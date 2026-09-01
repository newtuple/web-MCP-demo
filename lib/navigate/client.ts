'use client'

// Single client-side entry point to the navigator, shared by the WebMCP tool
// (components/webmcp/navigateTools.ts) and the human-facing popover
// (components/webmcp/DemoAppLauncher.tsx), so there is exactly one place that
// knows how to read/write the session and call /api/navigate - not two copies
// of the same fetch call quietly drifting apart.

import type { NavigationDecision } from './schema'
import { getNavigateSession, setNavigateSession } from './session'

export interface AskNavigatorResult {
  ok: boolean
  decision?: NavigationDecision
  error?: string
}

export async function askNavigator(message: string): Promise<AskNavigatorResult> {
  const trimmed = message.trim()
  if (!trimmed) return { ok: false, error: 'Say what you want to do or see.' }

  const history = getNavigateSession()

  let response: Response
  try {
    response = await fetch('/api/navigate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: trimmed, history }),
    })
  } catch {
    return { ok: false, error: 'Could not reach the navigation service. Try again in a moment.' }
  }

  const payload = await response.json().catch(() => null)

  if (!response.ok || !payload?.decision) {
    return { ok: false, error: payload?.detail ?? 'Navigation failed. Try again in a moment.' }
  }

  setNavigateSession(Array.isArray(payload.history) ? payload.history : [])

  return { ok: true, decision: payload.decision as NavigationDecision }
}
