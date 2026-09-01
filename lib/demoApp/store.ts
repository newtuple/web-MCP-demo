'use client'

// Client store for the generated demo page.
//
// It holds one session, routes the browser to /demo, and is the single place a
// tool call is recorded, whether it came from a WebMCP agent or from the page
// itself calling notify(). The page owns its own state; this store owns the
// session, the log and the navigation.

import { callPageTool, describePage } from './toolBridge'
import type { DemoLogEntry, DemoSession, GeneratedApp } from './types'

export type DemoPhase = 'idle' | 'building' | 'ready' | 'error'
export type DemoActor = 'human' | 'agent' | 'page' | 'system'

export interface DemoAppSnapshot {
  phase: DemoPhase
  session: DemoSession | null
  statement: string
  error: string | null
  /** when the current build started, for the build screen's elapsed timer */
  buildStartedAt: number | null
  revision: number
}

export const DEMO_ROUTE = '/demo'
const STORAGE_KEY = 'newtuple:demo-page:v2'
const MAX_LOG = 60

const EMPTY: DemoAppSnapshot = {
  phase: 'idle', session: null, statement: '', error: null, buildStartedAt: null, revision: 0,
}

let snapshot: DemoAppSnapshot = EMPTY
let buildToken = 0
const listeners = new Set<() => void>()

let navigate: ((path: string) => void) | null = null

export function setDemoNavigator(fn: (path: string) => void) {
  navigate = fn
  return () => { if (navigate === fn) navigate = null }
}

const go = (path: string) => {
  if (typeof window === 'undefined') return
  if (window.location.pathname === path) return
  if (navigate) navigate(path)
  else window.location.assign(path)
}

const emit = () => listeners.forEach((listener) => listener())

const persist = () => {
  if (typeof window === 'undefined') return
  try {
    if (snapshot.session) window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot.session))
    else window.sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // storage is a convenience for reloads, never a requirement
  }
}

const commit = (next: Partial<DemoAppSnapshot>) => {
  snapshot = { ...snapshot, ...next, revision: snapshot.revision + 1 }
  persist()
  emit()
}

const entry = (source: DemoActor, toolName: string, message: string): DemoLogEntry => ({
  id: `log_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
  at: Date.now(),
  source,
  toolName,
  message,
})

function log(source: DemoActor, toolName: string, message: string) {
  const session = snapshot.session
  if (!session) return
  commit({ session: { ...session, log: [entry(source, toolName, message), ...session.log].slice(0, MAX_LOG) } })
}

export function restoreDemoApp() {
  if (typeof window === 'undefined' || snapshot.session || snapshot.phase === 'building') return
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const session = JSON.parse(raw) as DemoSession
    if (!session?.app?.html) return
    commit({ phase: 'ready', session, statement: session.statement, error: null })
  } catch {
    // a corrupt snapshot is not worth surfacing
  }
}

export interface BuildResult {
  ok: boolean
  message: string
  session: DemoSession | null
}

export async function buildDemoApp(statement: string, source: DemoActor = 'human'): Promise<BuildResult> {
  const mission = statement.trim()
  if (mission.length < 4) {
    return { ok: false, message: 'Describe what to build in a sentence, for example "a chatbot that answers questions about our returns policy".', session: null }
  }

  const token = ++buildToken
  go(DEMO_ROUTE)
  commit({ phase: 'building', session: null, statement: mission, error: null, buildStartedAt: Date.now() })

  try {
    const response = await fetch('/api/demo-app', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statement: mission }),
    })
    const payload = await response.json().catch(() => null)

    if (token !== buildToken) return { ok: false, message: 'Replaced by a newer build.', session: null }

    if (!response.ok || !payload?.app?.html) {
      const detail = payload?.detail
        ? String(payload.detail)
        : payload?.error
          ? String(payload.error)
          : `the build endpoint returned ${response.status}`
      commit({ phase: 'error', error: detail, buildStartedAt: null })
      return { ok: false, message: `Could not build the page: ${detail}`, session: null }
    }

    const app = payload.app as GeneratedApp
    const session: DemoSession = {
      statement: mission,
      app,
      source: 'openai',
      model: typeof payload.model === 'string' ? payload.model : null,
      generation: 1,
      log: [entry(source, 'build_demo_app', `Generated "${app.title}" (${app.kind}) for: ${mission}`)],
    }
    commit({ phase: 'ready', session, error: null, buildStartedAt: null })

    return {
      ok: true,
      session,
      message: `Built "${app.title}", a ${app.kind}, at ${DEMO_ROUTE}. Design: ${app.designDirection}. The page implements ${app.tools.length} tools of its own.`,
    }
  } catch (error) {
    if (token !== buildToken) return { ok: false, message: 'Replaced by a newer build.', session: null }
    const detail = error instanceof Error ? error.message : 'unknown error'
    commit({ phase: 'error', error: detail, buildStartedAt: null })
    return { ok: false, message: `Could not build the page: ${detail}`, session: null }
  }
}

/** Calls a tool the generated page implements, and records it. */
export async function runPageTool(name: string, args: Record<string, unknown> = {}, source: DemoActor = 'agent') {
  if (!snapshot.session) {
    return { ok: false, message: 'No demo page is open. Call build_demo_app first.', data: null }
  }
  const result = await callPageTool(name, args)
  log(source, name, `${result.ok ? name : `${name} refused`}: ${result.message}`)
  return result
}

export async function readPage(source: DemoActor = 'agent') {
  if (!snapshot.session) {
    return { ok: false, message: 'No demo page is open. Call build_demo_app first.', data: null }
  }
  const result = await describePage({ waitForReady: true })
  log(source, 'demo_app_describe_page', result.ok ? 'Read the page.' : `Could not read the page: ${result.message}`)
  return result
}

/** A new generation remounts the iframe, which resets the page's own state. */
export function resetDemoApp(source: DemoActor = 'human') {
  const session = snapshot.session
  if (!session) return { ok: false, message: 'No demo page is open.' }
  commit({
    session: {
      ...session,
      generation: session.generation + 1,
      log: [entry(source, 'demo_app_reset', `Reloaded "${session.app.title}" from its generated source.`), ...session.log].slice(0, MAX_LOG),
    },
  })
  return { ok: true, message: `Reloaded "${session.app.title}". Its state is back to how it loaded.` }
}

export function closeDemoApp(source: DemoActor = 'human') {
  if (!snapshot.session) return { ok: false, message: 'No demo page is open.' }
  const title = snapshot.session.app.title
  commit({ phase: 'idle', session: null, error: null, statement: '', buildStartedAt: null })
  go('/')
  return {
    ok: true,
    message: `Closed "${title}". Its page tools are unregistered.${source === 'agent' ? ' Call build_demo_app to generate another page.' : ''}`,
  }
}

/** notify() inside the page, and page-level script errors, land here. */
export const recordPageNotice = (message: string, source: DemoActor = 'page') => log(source, 'page', message)

export const demoAppStore = {
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  getSnapshot: () => snapshot,
  getServerSnapshot: () => EMPTY,
}

export const getDemoSession = () => snapshot.session
