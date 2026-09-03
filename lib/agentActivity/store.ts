'use client'

// Live feed of every WebMCP tool call, so a human sharing the tab with an
// agent can see what the agent just did instead of only seeing the result.
// Same subscribe/getSnapshot pattern as lib/pageView/store.ts.

export interface AgentActivityEntry {
  id: string
  tool: string
  label: string
  at: number
}

const MAX_ENTRIES = 6

let entries: AgentActivityEntry[] = []
const listeners = new Set<() => void>()
const EMPTY: AgentActivityEntry[] = []

const emit = () => listeners.forEach((listener) => listener())

export const agentActivityStore = {
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
  getSnapshot: (): AgentActivityEntry[] => entries,
  getServerSnapshot: (): AgentActivityEntry[] => EMPTY,
}

export function logAgentActivity(tool: string, label: string) {
  const entry: AgentActivityEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    tool,
    label,
    at: Date.now(),
  }
  entries = [entry, ...entries].slice(0, MAX_ENTRIES)
  emit()
}

// The feed itself is opt-in: it starts hidden so it never overlaps the chat
// panel uninvited. A button in the chat header toggles it on, only then does
// a tool call actually render a card.
let visible = false
const visibilityListeners = new Set<() => void>()
const emitVisibility = () => visibilityListeners.forEach((listener) => listener())

export const agentActivityVisibilityStore = {
  subscribe(listener: () => void) {
    visibilityListeners.add(listener)
    return () => {
      visibilityListeners.delete(listener)
    }
  },
  getSnapshot: (): boolean => visible,
  getServerSnapshot: (): boolean => false,
}

export function toggleAgentActivityVisibility() {
  visible = !visible
  emitVisibility()
}
