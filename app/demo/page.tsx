'use client'

// The demo route: describe something, and the model writes the page.
//
// Static route with no dynamic segment on purpose. The generated page lives in
// the client store and sessionStorage, so a reload keeps it, and
// /demo?prompt=... generates on arrival, which makes a demo link shareable
// without carrying the whole page in the URL.

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, ArrowRight, RefreshCw, Sparkles } from 'lucide-react'
import { buildDemoApp, restoreDemoApp } from '@/lib/demoApp/store'
import GeneratedAppFrame from '@/components/webmcp/GeneratedAppFrame'
import { useDemoSnapshot } from '@/components/webmcp/useDemoAppSnapshot'
import Container from '@/components/ui/Container'
import FadeIn from '@/components/motion/FadeIn'

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
      <div className="flex min-h-screen flex-col bg-gray-950 text-gray-300">
        <header className="h-16 shrink-0 border-b border-gray-800 md:h-20">
          <Container className="flex h-full items-center">
            <Link href="/" className="inline-flex rounded-md bg-white px-3 py-1.5">
              <img src="/images/brand/Logo-white.png" alt="Newtuple" className="h-6 w-auto object-contain" />
            </Link>
          </Container>
        </header>
        <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6">
        <div className="w-full max-w-md">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-300)]">Writing your page</p>
          <p className="mt-2 text-lg font-light leading-snug text-white">{snapshot.statement}</p>
          <ul className="mt-6 space-y-2">
            {STAGES.map((label, index) => (
              <li key={label} className={index <= stage ? 'flex items-center gap-2.5 text-sm font-light text-white' : 'flex items-center gap-2.5 text-sm font-light text-gray-600'}>
                <span className={index < stage ? 'h-1.5 w-1.5 rounded-full bg-[var(--accent-400)]' : index === stage ? 'h-1.5 w-1.5 animate-pulse rounded-full bg-white' : 'h-1.5 w-1.5 rounded-full bg-gray-700'} />
                {label}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs font-light text-gray-500">
            {elapsed}s. The model is writing the HTML, CSS and JavaScript for this one page, so this is not instant.
          </p>
        </div>
        </div>
      </div>
    )
  }

  if (snapshot.phase === 'error') {
    return (
      <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-grid" />
        <header className="relative z-10 h-16 shrink-0 md:h-20">
          <Container className="flex h-full items-center">
            <Link href="/">
              <img src="/images/brand/Logo-white.png" alt="Newtuple" className="h-8 w-auto object-contain md:h-9" />
            </Link>
          </Container>
        </header>
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6 px-6">
        <div className="w-full max-w-md">
          <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-amber-700">
            <AlertTriangle className="h-4 w-4" /> The page was not generated
          </p>
          <p className="mt-3 text-[15px] font-light leading-relaxed text-gray-800">{snapshot.error}</p>
          <p className="mt-3 text-[13px] font-light leading-relaxed text-gray-500">
            Nothing canned is shown in its place on purpose: every page here is written for the request that
            asked for it.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void buildDemoApp(snapshot.statement, 'human')}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-900)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--accent-800)]"
            >
              <RefreshCw className="h-4 w-4" /> Try again
            </button>
            <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-800 transition hover:border-gray-400">
              Back to Newtuple
            </Link>
          </div>
        </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden bg-gradient-hero pb-24 h-screen">
      <div className="absolute inset-0 bg-grid" />
      <header className="relative z-10 h-16 md:h-20">
        <Container className="flex h-full items-center">
          <Link href="/">
            <img src="/images/brand/Logo-white.png" alt="Newtuple"  className="h-14 sm:h-16 md:h-20 w-auto object-contain"/>
          </Link>
        </Container>
      </header>
      <Container className="relative z-10 max-w-3xl pt-12 md:pt-16">
        <FadeIn>
          <span className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--accent-50)] px-4 py-1.5 text-sm font-medium text-[var(--accent-900)]">
            <Sparkles className="h-3.5 w-3.5" /> Live demo builder
          </span>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h1 className="mt-5 text-4xl font-extralight leading-[1.1] tracking-tight text-gray-900 sm:text-5xl">
            Say what to build. We write the page.
          </h1>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="mt-4 max-w-xl text-[15px] font-light leading-relaxed text-gray-600">
            No templates, no drag-and-drop, no waiting on a dev queue. Describe the product you need and
            watch a working page come together in under a minute, complete with its own look, its own
            copy, and real interactions you can click through right away.
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <form onSubmit={(event: FormEvent) => { event.preventDefault(); void buildDemoApp(draft, 'human') }} className="mt-8">
            <textarea
              rows={3}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="A chatbot that answers questions about our returns policy, for a footwear brand"
              className="w-full resize-none rounded-2xl border border-gray-300 bg-white px-4 py-3.5 text-[15px] font-light text-gray-900 outline-none transition focus:border-[var(--accent-900)]"
            />
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={draft.trim().length < 4}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-900)] px-6 py-3 text-sm font-medium text-white transition hover:bg-[var(--accent-800)] disabled:opacity-40"
              >
                Write the page <ArrowRight className="h-4 w-4" />
              </button>
              <span className="text-[12px] font-light text-gray-500">Takes 20 to 60 seconds.</span>
            </div>
          </form>
        </FadeIn>

        <div className="mt-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-900)]">Or start from one of these</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {EXAMPLES.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => void buildDemoApp(example, 'human')}
                className="group rounded-2xl border border-gray-200/90 bg-white p-3.5 text-left text-[13px] font-light leading-snug text-gray-800 shadow-[0_16px_30px_-24px_rgba(15,23,42,0.32)] transition hover:border-[var(--accent-300)] hover:shadow-[0_24px_44px_-26px_rgba(0,71,171,0.35)]"
              >
                {example}
                <ArrowRight className="ml-1 inline h-3 w-3 text-gray-400 transition group-hover:translate-x-0.5" />
              </button>
            ))}
          </div>
        </div>

        <p className="mt-10 text-[11px] font-light leading-relaxed text-gray-500">
          Generated pages run in a sandboxed frame on their own origin, with a content policy that blocks
          every network request, so a page cannot reach this site, your data, or anything outside the frame.
          Data in a demo is synthetic.
        </p>
      </Container>
    </div>
  )
}
