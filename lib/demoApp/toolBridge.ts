'use client'

// Parent side of the frame channel.
//
// The generated page is on an opaque origin, so the parent cannot read its DOM
// or call its functions directly. Everything goes through postMessage: a WebMCP
// tool call becomes a message in, the page's own function runs, and its result
// comes back out. That is also why the page can be trusted to be the only thing
// that knows how to change itself.

export interface BridgeResult {
  ok: boolean
  message: string
  data: unknown
}

interface Pending {
  resolve: (result: BridgeResult) => void
  timer: number
}

type Handlers = {
  onNotify?: (message: string) => void
  onError?: (message: string) => void
  onReady?: (tools: string[]) => void
}

let frameWindow: Window | null = null
let handlers: Handlers = {}
let ready = false
let readyWaiters: Array<() => void> = []
let nextId = 1
const pending = new Map<number, Pending>()

const isFrameMessage = (event: MessageEvent): boolean => {
  if (!frameWindow || event.source !== frameWindow) return false
  const data = event.data as Record<string, unknown> | null
  return Boolean(data && data.__newtuple === 1)
}

function onMessage(event: MessageEvent) {
  if (!isFrameMessage(event)) return
  const data = event.data as Record<string, unknown>

  if (data.type === 'ready') {
    ready = true
    readyWaiters.forEach((resolve) => resolve())
    readyWaiters = []
    handlers.onReady?.(Array.isArray(data.tools) ? (data.tools as string[]) : [])
    return
  }
  if (data.type === 'notify') {
    handlers.onNotify?.(String(data.message ?? ''))
    return
  }
  if (data.type === 'error') {
    handlers.onError?.(String(data.message ?? ''))
    return
  }
  if (data.type === 'result') {
    const id = Number(data.id)
    const entry = pending.get(id)
    if (!entry) return
    window.clearTimeout(entry.timer)
    pending.delete(id)
    entry.resolve({
      ok: data.ok === true,
      message: String(data.message ?? ''),
      data: data.data ?? null,
    })
  }
}

/** Called by the component that owns the iframe. */
export function attachDemoFrame(win: Window | null, next: Handlers = {}) {
  frameWindow = win
  handlers = next
  ready = false
  readyWaiters = []
  pending.forEach((entry) => {
    window.clearTimeout(entry.timer)
    entry.resolve({ ok: false, message: 'The demo page was replaced while this tool was running.', data: null })
  })
  pending.clear()

  window.addEventListener('message', onMessage)
  return () => {
    window.removeEventListener('message', onMessage)
    if (frameWindow === win) {
      frameWindow = null
      ready = false
    }
  }
}

export const isFrameReady = () => ready
export const hasFrame = () => Boolean(frameWindow)

/** An agent can call a tool the instant a build returns, before the frame has parsed. */
export function whenFrameReady(timeoutMs = 12_000): Promise<boolean> {
  if (ready) return Promise.resolve(true)
  if (!frameWindow) return Promise.resolve(false)
  return new Promise((resolve) => {
    const timer = window.setTimeout(() => {
      readyWaiters = readyWaiters.filter((waiter) => waiter !== onReady)
      resolve(ready)
    }, timeoutMs)
    const onReady = () => {
      window.clearTimeout(timer)
      resolve(true)
    }
    readyWaiters.push(onReady)
  })
}

export async function callPageTool(
  name: string,
  args: Record<string, unknown> = {},
  timeoutMs = 15_000,
  options: { waitForReady?: boolean } = {},
): Promise<BridgeResult> {
  if (!frameWindow) {
    return { ok: false, message: 'No demo page is open. Call build_demo_app first.', data: null }
  }
  // A read probe must not wait on the ready signal: it is what the host uses to
  // find out whether the page came up at all when that signal was missed.
  if (options.waitForReady !== false) await whenFrameReady()
  if (!frameWindow) {
    return { ok: false, message: 'The demo page closed before the call was delivered.', data: null }
  }

  const id = nextId++
  const target = frameWindow
  return new Promise<BridgeResult>((resolve) => {
    const timer = window.setTimeout(() => {
      pending.delete(id)
      resolve({ ok: false, message: `The page did not answer "${name}" within ${Math.round(timeoutMs / 1000)}s. It may be waiting on a human, or the tool may be stuck.`, data: null })
    }, timeoutMs)
    pending.set(id, { resolve, timer })
    target.postMessage({ __newtuple: 1, type: 'call', id, name, args }, '*')
  })
}

export const describePage = (options: { waitForReady?: boolean } = {}) =>
  callPageTool('__describe', {}, 8_000, options)
