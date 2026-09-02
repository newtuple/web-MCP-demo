'use client'

// Tiny command bus for the site assistant (components/webmcp/SiteAssistant.tsx).
// Anything on the page - the hero's suggested prompts, a product subnav, a
// WebMCP tool - can open the assistant, optionally dropping it straight into
// contact mode or handing it a message to send, without holding a ref to the
// component itself. Same registration pattern as lib/navigate/router.ts.

export interface AssistantCommand {
  /** Open the panel. Always true today; kept explicit for readability at call sites. */
  open: boolean
  /** Start the in-chat contact flow immediately. */
  contact?: boolean
  /** Prefill for the contact flow's Regarding field. */
  regarding?: string
  /** A message to place in the input box, or send immediately when sendNow is set. */
  message?: string
  sendNow?: boolean
}

type Listener = (command: AssistantCommand) => void

let listener: Listener | null = null
let pending: AssistantCommand | null = null

/** Registered once by SiteAssistant. A command fired before mount is replayed on registration. */
export function registerAssistant(fn: Listener) {
  listener = fn
  if (pending) {
    const command = pending
    pending = null
    fn(command)
  }
  return () => {
    if (listener === fn) listener = null
  }
}

export function openAssistant(command: Omit<AssistantCommand, 'open'> = {}) {
  const full: AssistantCommand = { open: true, ...command }
  if (listener) listener(full)
  else pending = full
}
