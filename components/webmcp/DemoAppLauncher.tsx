'use client'

// Site-wide entry point, and the bridge that lets the store navigate.
//
// One box, two jobs: type a request and it either sends you to a real page
// (navigate_site's job), asks one clarifying question first if that is
// ambiguous, or - if it reads as "build me a thing" rather than "show me a
// page" - falls straight through into the existing demo builder
// (build_demo_app's job, untouched). The same classifier an agent calls
// through WebMCP is what this popover calls directly, via
// lib/navigate/client.ts, so a human typing here and an agent calling
// navigate_site get identical behaviour.
//
// Once a demo session exists, the pill reverts to its original single job:
// reopen /demo. Registering the router with the stores means an agent
// calling build_demo_app or navigate_site moves the page too, client-side,
// with WebMCP tools staying registered across the transition.

import { FormEvent, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { ArrowUpRight, Loader2, Send, Sparkles, X } from 'lucide-react'
import { DEMO_ROUTE, buildDemoApp, setDemoNavigator } from '@/lib/demoApp/store'
import { askNavigator } from '@/lib/navigate/client'
import { setSiteNavigator } from '@/lib/navigate/router'
import { pageHref } from '@/lib/navigate/schema'
import { useDemoSnapshot } from './useDemoAppSnapshot'

type TurnKind = 'user' | 'assistant' | 'error'
interface Turn {
  kind: TurnKind
  text: string
}

export default function DemoAppLauncher() {
  const router = useRouter()
  const pathname = usePathname()
  const snapshot = useDemoSnapshot()

  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [turns, setTurns] = useState<Turn[]>([])
  const [busy, setBusy] = useState(false)

  useEffect(() => setDemoNavigator((path) => router.push(path)), [router])
  // Same router instance, registered a second time for navigate_site, which
  // can send a visitor to any real page - not only /demo.
  useEffect(() => setSiteNavigator((path) => router.push(path)), [router])

  if (pathname?.startsWith(DEMO_ROUTE)) return null

  const hasSession = Boolean(snapshot.session)

  // The homepage already has its own "what are you trying to improve?" box
  // (AdaptiveSiteExperience). A second floating one on top of it is
  // redundant, so the popover is for every *other* page - the ones with no
  // ask box of their own. A demo already in progress still reopens from
  // anywhere, home included, so that branch is unaffected.
  if (!hasSession && pathname === '/') return null

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = message.trim()
    if (!value || busy) return

    setTurns((prev) => [...prev, { kind: 'user', text: value }])
    setMessage('')
    setBusy(true)

    const result = await askNavigator(value)

    if (!result.ok || !result.decision) {
      setTurns((prev) => [...prev, { kind: 'error', text: result.error ?? 'Something went wrong. Try again.' }])
      setBusy(false)
      return
    }

    const { decision } = result

    if (decision.decision === 'navigate' && decision.page) {
      setTurns((prev) => [...prev, { kind: 'assistant', text: `Taking you to ${decision.page}.` }])
      router.push(pageHref(decision.page))
      setOpen(false)
      setBusy(false)
      return
    }

    if (decision.decision === 'build_demo') {
      setTurns((prev) => [...prev, { kind: 'assistant', text: 'That sounds like something to build - starting now.' }])
      setOpen(false)
      setBusy(false)
      void buildDemoApp(value, 'human')
      return
    }

    setTurns((prev) => [...prev, { kind: 'assistant', text: decision.question || 'Could you say more about what you are looking for?' }])
    setBusy(false)
  }

  if (hasSession) {
    return (
      <button
        type="button"
        onClick={() => router.push(DEMO_ROUTE)}
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-xl transition hover:border-slate-400 print:hidden"
      >
        <Sparkles className="h-4 w-4 text-[var(--accent-900,#0047AB)]" />
        {`Open ${snapshot.session?.app.title}`}
        <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 print:hidden">
      {open && (
        <div className="flex w-80 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ask Newtuple</span>
            <button type="button" onClick={() => setOpen(false)} className="text-slate-400 transition hover:text-slate-700">
              <X className="h-4 w-4" />
            </button>
          </div>

          {turns.length > 0 && (
            <div className="max-h-64 space-y-2 overflow-y-auto px-4 py-3">
              {turns.map((turn, index) => (
                <div
                  key={index}
                  className={
                    turn.kind === 'user'
                      ? 'ml-auto max-w-[85%] rounded-lg bg-[var(--accent-900,#0047AB)] px-3 py-2 text-sm text-white'
                      : turn.kind === 'error'
                        ? 'max-w-[85%] rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700'
                        : 'max-w-[85%] rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700'
                  }
                >
                  {turn.text}
                </div>
              ))}
            </div>
          )}

          <form onSubmit={submit} className="flex items-center gap-2 border-t border-slate-100 p-3">
            <input
              autoFocus
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="What are you trying to do or see?"
              disabled={busy}
              className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-950 outline-none transition-colors focus:border-[var(--accent-400,#6090fa)] focus:bg-white focus:ring-2 focus:ring-[var(--accent-100,#dbe6fe)]"
            />
            <button
              type="submit"
              disabled={busy || !message.trim()}
              className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--accent-900,#0047AB)] text-white transition disabled:opacity-40"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-xl transition hover:border-slate-400"
      >
        <Sparkles className="h-4 w-4 text-[var(--accent-900,#0047AB)]" />
        Ask Newtuple
        <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
      </button>
    </div>
  )
}
