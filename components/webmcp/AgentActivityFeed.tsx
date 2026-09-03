'use client'

import { useSyncExternalStore } from 'react'
import { agentActivityStore, agentActivityVisibilityStore } from '@/lib/agentActivity/store'

// Renders every WebMCP tool call as it happens, so a human sharing the tab
// with an agent sees what it just did instead of only seeing the result.
// This is the collaboration surface: the agent isn't acting behind a curtain.
// Opt-in only: hidden until the chat header's toggle turns it on, so it never
// appears uninvited over the chat panel.
export default function AgentActivityFeed() {
  const visible = useSyncExternalStore(
    agentActivityVisibilityStore.subscribe,
    agentActivityVisibilityStore.getSnapshot,
    agentActivityVisibilityStore.getServerSnapshot,
  )
  const entries = useSyncExternalStore(
    agentActivityStore.subscribe,
    agentActivityStore.getSnapshot,
    agentActivityStore.getServerSnapshot,
  )

  if (!visible || entries.length === 0) return null

  return (
    <div
      className="pointer-events-none fixed bottom-4 left-4 z-[9999] flex w-[min(340px,calc(100vw-2rem))] flex-col gap-1.5"
      aria-live="polite"
    >
      {entries.map((entry, index) => (
        <div
          key={entry.id}
          className="pointer-events-auto rounded-lg border border-[var(--accent-200)] bg-white/95 px-3 py-2 text-xs text-slate-700 shadow-lg backdrop-blur transition-opacity"
          style={{ opacity: 1 - index * 0.15 }}
        >
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-500)]" />
            <span className="font-medium text-slate-500">Agent activity</span>
            <code className="ml-auto rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono text-slate-500">
              {entry.tool}
            </code>
          </div>
          <div className="mt-0.5 leading-snug text-slate-800">{entry.label}</div>
        </div>
      ))}
    </div>
  )
}
