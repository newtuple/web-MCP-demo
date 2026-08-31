'use client'

// The demo route: describe something, and the model writes the page.
//
// Static route with no dynamic segment on purpose. The generated page lives in
// the client store and sessionStorage, so a reload keeps it, and
// /demo?prompt=... generates on arrival, which makes a demo link shareable
// without carrying the whole page in the URL.

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, ArrowLeft, ArrowRight, RefreshCw, Sparkles } from 'lucide-react'
import { buildDemoApp, restoreDemoApp } from '@/lib/demoApp/store'
import GeneratedAppFrame from '@/components/webmcp/GeneratedAppFrame'
import { useDemoSnapshot } from '@/components/webmcp/useDemoAppSnapshot'

const EXAMPLES = [
  'A chatbot that answers questions about our returns policy for a footwear brand',
  'A landing page for a warehouse robotics pilot, with a waitlist behind it',
  'An ecommerce catalog console that fixes incomplete listings before they syndicate',
  'A dispatch board for a 3PL moving pick waves to carriers',
  'A pricing calculator for a B2B SaaS with seat tiers and an annual toggle',
  'A shift swap tool for a hospital ward with approval rules',
]

const STAGES = [
  'Reading the request',
  'Choosing a layout and a visual direction',
  'Writing the markup and styles',
  'Writing the state, the interactions and the tools',
  'Sandboxing the page',
]

export default function DemoPage() {
  const snapshot = useDemoSnapshot()
  const [draft, setDraft] = useState('')
  const [elapsed, setElapsed] = useState(0)
  const [autoTried, setAutoTried] = useState(false)

  useEffect(() => { restoreDemoApp() }, [])

  useEffect(() => {
    if (autoTried) return
    setAutoTried(true)
    const prompt = new URLSearchParams(window.location.search).get('prompt')
    if (prompt && prompt.trim().length > 3) void buildDemoApp(prompt, 'human')
  }, [autoTried])

  useEffect(() => {
    if (snapshot.phase !== 'building') { setElapsed(0); return }
    const started = snapshot.buildStartedAt ?? Date.now()
    const timer = window.setInterval(() => setElapsed(Math.round((Date.now() - started) / 1000)), 500)
    return () => window.clearInterval(timer)
  }, [snapshot.phase, snapshot.buildStartedAt])

  if (snapshot.phase === 'ready' && snapshot.session) {
    return <GeneratedAppFrame session={snapshot.session} />
  }

  if (snapshot.phase === 'building') {
    // One stage per ~7s of a 20-60s write, so the list tracks reality loosely
    // rather than pretending to know progress.
    const stage = Math.min(Math.floor(elapsed / 7), STAGES.length - 1)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-slate-950 px-6 text-slate-200">
        <div className="w-full max-w-md">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Writing your page</p>
          <p className="mt-2 text-lg leading-snug text-white">{snapshot.statement}</p>
          <ul className="mt-6 space-y-2">
            {STAGES.map((label, index) => (
              <li key={label} className={index <= stage ? 'flex items-center gap-2.5 text-sm text-white' : 'flex items-center gap-2.5 text-sm text-slate-600'}>
                <span className={index < stage ? 'h-1.5 w-1.5 rounded-full bg-emerald-400' : index === stage ? 'h-1.5 w-1.5 animate-pulse rounded-full bg-white' : 'h-1.5 w-1.5 rounded-full bg-slate-700'} />
                {label}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-slate-500">
            {elapsed}s. The model is writing the HTML, CSS and JavaScript for this one page, so this is not instant.
          </p>
        </div>
      </div>
    )
  }

  if (snapshot.phase === 'error') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white px-6">
        <div className="w-full max-w-md">
          <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-amber-700">
            <AlertTriangle className="h-4 w-4" /> The page was not generated
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-800">{snapshot.error}</p>
          <p className="mt-3 text-[13px] leading-relaxed text-slate-500">
            Nothing canned is shown in its place on purpose: every page here is written for the request that
            asked for it.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void buildDemoApp(snapshot.statement, 'human')}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white"
            >
              <RefreshCw className="h-4 w-4" /> Try again
            </button>
            <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-800">
              Back to Newtuple
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
        <Link href="/" className="inline-flex items-center gap-1.5 text-[12px] text-slate-500 transition hover:text-slate-900">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Newtuple
        </Link>

        <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-[11px] font-medium text-slate-600">
          <Sparkles className="h-3.5 w-3.5 text-[var(--accent-900,#0047AB)]" /> Live demo builder
        </p>
        <h1 className="mt-5 text-4xl font-semibold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
          Say what to build. We write the page.
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-slate-600">
          Not a template with your words in it. The model writes this page from scratch for your request:
          its own markup, styles, state and interactions, with a visual direction picked per build, so the
          same request twice gives you two different pages. Then it hands its own functions to AI agents
          over WebMCP, so an agent can use the page while you watch.
        </p>

        <form onSubmit={(event: FormEvent) => { event.preventDefault(); void buildDemoApp(draft, 'human') }} className="mt-8">
          <textarea
            rows={3}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="A chatbot that answers questions about our returns policy, for a footwear brand"
            className="w-full resize-none rounded-2xl border border-slate-300 px-4 py-3.5 text-[15px] text-slate-900 outline-none transition focus:border-slate-900"
          />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={draft.trim().length < 4}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-900,#0047AB)] px-6 py-3 text-sm font-semibold text-white transition disabled:opacity-40"
            >
              Write the page <ArrowRight className="h-4 w-4" />
            </button>
            <span className="text-[12px] text-slate-500">Takes 20 to 60 seconds.</span>
          </div>
        </form>

        <div className="mt-10">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Or start from one of these</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {EXAMPLES.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => void buildDemoApp(example, 'human')}
                className="group rounded-2xl border border-slate-200 p-3.5 text-left text-[13px] leading-snug text-slate-800 transition hover:border-slate-900"
              >
                {example}
                <ArrowRight className="ml-1 inline h-3 w-3 text-slate-400 transition group-hover:translate-x-0.5" />
              </button>
            ))}
          </div>
        </div>

        <p className="mt-10 text-[11px] leading-relaxed text-slate-500">
          Generated pages run in a sandboxed frame on their own origin, with a content policy that blocks
          every network request, so a page cannot reach this site, your data, or anything outside the frame.
          Data in a demo is synthetic.
        </p>
      </div>
    </div>
  )
}
