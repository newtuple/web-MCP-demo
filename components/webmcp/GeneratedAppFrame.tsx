'use client'

// Host for a generated page.
//
// The page gets the whole viewport under a slim ribbon, because it is the demo -
// this component contributes no layout, no styling and no widgets to it. All it
// does is mount the sandbox, keep the postMessage bridge attached, and show the
// activity drawer, which is where a visitor sees an agent working the page.

import { useEffect, useMemo, useRef, useState } from 'react'
import { Bot, ChevronDown, LogOut, RotateCcw, Terminal } from 'lucide-react'
import { FRAME_SANDBOX, buildFrameDocument } from '@/lib/demoApp/frame'
import { closeDemoApp, recordPageNotice, resetDemoApp } from '@/lib/demoApp/store'
import { attachDemoFrame, describePage } from '@/lib/demoApp/toolBridge'
import type { DemoSession } from '@/lib/demoApp/types'

const cx = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(' ')

export default function GeneratedAppFrame({ session }: { session: DemoSession }) {
  const frameRef = useRef<HTMLIFrameElement | null>(null)
  const [ready, setReady] = useState(false)
  const [pageTools, setPageTools] = useState<string[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)

  const app = session.app
  const srcDoc = useMemo(() => buildFrameDocument(app.html), [app.html])

  // Re-attached whenever the frame is remounted, which is what reset does.
  useEffect(() => {
    let cancelled = false
    setReady(false)
    setPageTools([])
    const detach = attachDemoFrame(frameRef.current?.contentWindow ?? null, {
      onNotify: (message) => recordPageNotice(message, 'page'),
      onError: (message) => recordPageNotice(`page script error: ${message}`, 'system'),
      onReady: (tools) => {
        if (cancelled) return
        setReady(true)
        setPageTools(tools)
      },
    })

    // The frame can finish parsing before this effect runs, in which case its
    // ready message was sent to nobody. One read probe settles it.
    const probe = window.setTimeout(async () => {
      const result = await describePage({ waitForReady: false })
      if (cancelled || !result.ok) return
      const payload = result.data as { toolsImplemented?: unknown } | null
      setReady(true)
      setPageTools(Array.isArray(payload?.toolsImplemented) ? (payload?.toolsImplemented as string[]) : [])
    }, 700)

    return () => {
      cancelled = true
      window.clearTimeout(probe)
      detach()
    }
  }, [app.id, session.generation])

  const declared = app.tools.map((tool) => tool.name)
  const missing = declared.filter((name) => pageTools.length > 0 && !pageTools.includes(name))

  return (
    <div className="flex h-screen flex-col bg-slate-950">
      <header className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-white/10 px-4 py-2 text-[11px] text-slate-400">
        <span className="font-semibold text-white">{app.title}</span>
        <span className="rounded-full bg-white/10 px-2 py-0.5">{app.kind}</span>
        <span className="hidden text-slate-500 sm:inline">{app.designDirection}</span>
        <span className={cx('inline-flex items-center gap-1.5', ready ? 'text-emerald-300' : 'text-amber-300')}>
          <span className={cx('h-1.5 w-1.5 rounded-full', ready ? 'bg-emerald-400' : 'bg-amber-300')} />
          {ready ? 'page live' : 'starting'}
        </span>

        <span className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDrawerOpen((value) => !value)}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 hover:bg-white/20"
          >
            <Bot className="h-3 w-3" /> {declared.length + 4} WebMCP tools
            <ChevronDown className={cx('h-3 w-3 transition', drawerOpen && 'rotate-180')} />
          </button>
          <button
            type="button"
            onClick={() => resetDemoApp('human')}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 hover:bg-white/20"
          >
            <RotateCcw className="h-3 w-3" /> Reload page
          </button>
          <button
            type="button"
            onClick={() => closeDemoApp('human')}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 hover:bg-white/20"
          >
            <LogOut className="h-3 w-3" /> Exit demo
          </button>
        </span>
      </header>

      <div className="relative min-h-0 flex-1">
        <iframe
          ref={frameRef}
          key={`${app.id}-${session.generation}`}
          title={`${app.title} demo`}
          // No allow-same-origin: the page runs on an opaque origin and cannot
          // reach this site, its storage, or the network (see lib/demoApp/frame.ts).
          sandbox={FRAME_SANDBOX}
          srcDoc={srcDoc}
          className="h-full w-full border-0 bg-white"
        />
      </div>

      {drawerOpen && (
        <section className="max-h-[42vh] shrink-0 overflow-y-auto border-t border-white/10 bg-slate-950 px-4 py-3 text-slate-300">
          <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
            <div>
              <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-slate-500">
                <Terminal className="h-3 w-3" /> Activity
              </p>
              <ul className="mt-2 space-y-1.5">
                {session.log.map((row) => (
                  <li key={row.id} className="flex gap-2 text-[11px] leading-snug">
                    <span className={cx(
                      'mt-0.5 inline-flex h-4 shrink-0 items-center rounded-full px-1.5 text-[9px] font-semibold uppercase',
                      row.source === 'agent' ? 'bg-indigo-500/20 text-indigo-200'
                        : row.source === 'human' ? 'bg-white/15 text-slate-100'
                          : row.source === 'page' ? 'bg-emerald-500/15 text-emerald-200'
                            : 'bg-white/10 text-slate-400',
                    )}>
                      {row.source}
                    </span>
                    <span className="min-w-0 text-slate-300">{row.message}</span>
                  </li>
                ))}
                {session.log.length === 0 && <li className="text-[11px] text-slate-500">Nothing yet.</li>}
              </ul>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500">Tools this page implements</p>
                <div className="mt-2 space-y-1.5">
                  {app.tools.map((tool) => (
                    <p key={tool.name} className="text-[11px] leading-snug">
                      <code className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white">{tool.name}</code>
                      <span className="ml-2 text-slate-400">{tool.description}</span>
                    </p>
                  ))}
                  {app.tools.length === 0 && <p className="text-[11px] text-slate-500">This page declared no tools of its own.</p>}
                  <p className="pt-1 text-[11px] text-slate-500">
                    Plus <code className="rounded bg-white/10 px-1 text-[10px]">demo_app_describe_page</code>,{' '}
                    <code className="rounded bg-white/10 px-1 text-[10px]">demo_app_reset</code>,{' '}
                    <code className="rounded bg-white/10 px-1 text-[10px]">close_demo_app</code> from the site.
                  </p>
                  {missing.length > 0 && (
                    <p className="pt-1 text-[11px] text-amber-300">
                      Declared but not found on the page at load: {missing.join(', ')}. Calls to those will refuse.
                    </p>
                  )}
                </div>
              </div>

              {app.starters.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500">Try on the page</p>
                  <ul className="mt-2 space-y-1">
                    {app.starters.map((starter) => (
                      <li key={starter} className="text-[11px] text-slate-400">{starter}</li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-[10px] leading-relaxed text-slate-500">
                This page was written by {session.model ?? 'the model'} for your request and runs in a sandboxed frame with
                no network access and no access to this site. Built from: {session.statement}
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
