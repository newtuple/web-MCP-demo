'use client'

// The navigate_site conversation, held entirely in the browser. No database,
// no server-side session - the server (lib/navigate/agent.ts) is a pure
// function of whatever transcript this file sends it.
//
// Two independent expiries stack on top of each other:
//   1. Native: sessionStorage itself is cleared the moment the tab is closed.
//   2. This file: a session that survives an open tab but sits idle for 10
//      minutes is deleted the next time anything touches it.
//
// The window is sliding, not fixed, because the requirement is inactivity,
// not a hard ten-minute lifetime: every read that finds a live session
// refreshes its clock, so a tab in active use never expires, and one left
// open and untouched does, on schedule, without needing a live timer to fire.

import type { AgentInputItem } from '@openai/agents'

const SESSION_STORAGE_KEY = 'newtuple:navigate-session:v1'
const INACTIVITY_LIMIT_MS = 10 * 60 * 1000

interface StoredNavigateSession {
  history: AgentInputItem[]
  lastActivityAt: number
}

function readRaw(): StoredNavigateSession | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<StoredNavigateSession>
    if (!Array.isArray(parsed.history) || typeof parsed.lastActivityAt !== 'number') return null
    return { history: parsed.history, lastActivityAt: parsed.lastActivityAt }
  } catch {
    return null
  }
}

function writeRaw(session: StoredNavigateSession) {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
  } catch {
    // Private-mode storage denial or a full quota. The session just will not
    // survive a reload; navigate_site still works turn by turn either way.
  }
}

/**
 * Reads the live session transcript, applying the sliding inactivity window.
 * A first-ever visit, or one that has sat idle past the limit, returns an
 * empty transcript - that emptiness *is* "a new session has opened": there is
 * no separate open/close step, the first message is what starts it.
 */
export function getNavigateSession(): AgentInputItem[] {
  const stored = readRaw()
  if (!stored) return []

  const idleForMs = Date.now() - stored.lastActivityAt
  if (idleForMs > INACTIVITY_LIMIT_MS) {
    clearNavigateSession()
    return []
  }

  // This read counts as activity: slide the ten-minute window forward from now.
  writeRaw({ history: stored.history, lastActivityAt: Date.now() })
  return stored.history
}

/** Called after every navigate_site response, with the server's updated history. */
export function setNavigateSession(history: AgentInputItem[]) {
  writeRaw({ history, lastActivityAt: Date.now() })
}

/** Explicit wipe - also runs implicitly, from getNavigateSession, once idle time is exceeded. */
export function clearNavigateSession() {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.removeItem(SESSION_STORAGE_KEY)
  } catch {
    // Nothing to clean up if storage was never writable in the first place.
  }
}

/** Milliseconds until this session would expire if left untouched, or null if none is open. */
export function msUntilNavigateSessionExpiry(): number | null {
  const stored = readRaw()
  if (!stored) return null
  const remaining = INACTIVITY_LIMIT_MS - (Date.now() - stored.lastActivityAt)
  return remaining > 0 ? remaining : 0
}
