'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowDown, ArrowRight, Bot, Check, ChevronRight, CircleDot, FileText, Gauge, Network, RotateCcw, Send, ShieldCheck, Sparkles, Target, Terminal, Workflow, Zap } from 'lucide-react'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import { generateAdaptiveSiteVariant, inferVisitorContext, type VisitorIntent } from '@/lib/adaptiveSite'
import { useVisitorContext } from './useVisitorContext'

interface CaseStudySummary { slug: string; title: string; competency: string; cardSummary: string }
type View = 'business' | 'technical' | 'proof'
type CompilePhase = 'idle' | 'thinking' | 'revealing' | 'ready'
const quickStarts = ['Automate supplier onboarding with SAP', 'Make our AI support agent reliable', 'Prepare our enterprise data for AI']
const intentColors: Record<VisitorIntent, { text: string; soft: string; border: string; fill: string }> = {
  general: { text: 'text-[var(--accent-900)]', soft: 'bg-[var(--accent-50)]', border: 'border-[var(--accent-200)]', fill: 'bg-[var(--accent-900)]' },
  services: { text: 'text-cyan-900', soft: 'bg-cyan-50', border: 'border-cyan-200', fill: 'bg-cyan-700' },
  products: { text: 'text-amber-900', soft: 'bg-amber-50', border: 'border-amber-200', fill: 'bg-amber-600' },
  careers: { text: 'text-emerald-900', soft: 'bg-emerald-50', border: 'border-emerald-200', fill: 'bg-emerald-700' },
}
const cx = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(' ')

export default function AdaptiveSiteExperience({ caseStudies }: { caseStudies: CaseStudySummary[] }) {
  const { context, variant, replaceContext, resetContext } = useVisitorContext()
  const [goal, setGoal] = useState('')
  const [compiled, setCompiled] = useState(false)
  const [compilePhase, setCompilePhase] = useState<CompilePhase>('idle')
  const [generation, setGeneration] = useState(0)
  const [view, setView] = useState<View>('business')
  const [showTools, setShowTools] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready'>('idle')
  const colors = intentColors[variant.intent]
  const current = generateAdaptiveSiteVariant(context)
  const relevant = useMemo(() => caseStudies.filter((study) => variant.caseStudySlugs.includes(study.slug)).slice(0, 2), [caseStudies, variant.caseStudySlugs])

  const compile = async (value: string) => {
    if (!value.trim()) return
    setStatus('loading'); setCompilePhase('thinking'); setCompiled(false)
    const fallback = inferVisitorContext(value)
    replaceContext(fallback)
    setView(value.toLowerCase().match(/architecture|api|sdk|production|technical/) ? 'technical' : value.toLowerCase().match(/case study|proof|evidence|example/) ? 'proof' : 'business')
    const minimumThinkTime = new Promise((resolve) => window.setTimeout(resolve, 2200))
    try {
      const [response] = await Promise.all([fetch('/api/mission', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ statement: value }) }), minimumThinkTime])
      const result = await response.json(); if (result?.context) replaceContext(result.context)
    } catch { await minimumThinkTime } finally {
      setStatus('ready'); setCompilePhase('revealing'); setGeneration((value) => value + 1)
      window.setTimeout(() => { setCompiled(true); setCompilePhase('ready') }, 850)
    }
  }
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); void compile(goal) }

  useEffect(() => {
    const handleCompileRequest = (event: Event) => {
      const statement = (event as CustomEvent<{ statement?: string }>).detail?.statement
      if (statement) {
        setGoal(statement)
        void compile(statement)
      }
    }
    window.addEventListener('newtuple-zeronav-compile', handleCompileRequest)
    return () => window.removeEventListener('newtuple-zeronav-compile', handleCompileRequest)
  })

  if (!compiled) return compilePhase !== 'idle' ? <ThinkingCanvas phase={compilePhase} goal={goal} /> : <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-gradient-hero"><div className="pointer-events-none absolute inset-0 bg-grid" /><div className="pointer-events-none absolute left-1/2 top-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-200/25 blur-3xl" /><Container className="relative z-10 flex min-h-[calc(100vh-5rem)] items-center justify-center py-16"><div className="w-full max-w-4xl text-center"><div className="mb-8 inline-flex items-center gap-2 rounded-full bg-[var(--accent-50)] px-4 py-1.5 text-sm font-semibold text-[var(--accent-900)]"><Sparkles className="h-4 w-4" />Newtuple ZeroNav</div><h1 className="text-5xl font-extralight leading-[.98] tracking-[-.04em] text-gray-900 md:text-8xl">What are you<br /><span className="text-gradient">trying to accomplish?</span></h1><p className="mx-auto mt-8 max-w-xl text-lg font-light leading-8 text-gray-600">There is no menu because there is no single path. Give the site your mission and it will compile the interface around it.</p><form onSubmit={submit} className="mx-auto mt-10 max-w-2xl rounded-xl border border-gray-200 bg-white p-2 text-left shadow-premium"><textarea autoFocus value={goal} onChange={(event) => setGoal(event.target.value)} placeholder="I need to make our AI support agent reliable in production…" className="min-h-24 w-full resize-none rounded-lg border-0 bg-gray-50 p-4 text-base leading-7 text-gray-900 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[var(--accent-100)]" /><button className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[var(--accent-900)] px-5 text-sm font-semibold text-white hover:shadow-premium-lg"><Send className="h-4 w-4" />Compile my experience<ArrowRight className="h-4 w-4" /></button></form><div className="mx-auto mt-5 flex max-w-2xl flex-wrap justify-center gap-2">{quickStarts.map((item) => <button key={item} onClick={() => { setGoal(item); void compile(item) }} className="rounded-full border border-gray-200 bg-white/80 px-3 py-1.5 text-xs text-gray-600 hover:border-[var(--accent-300)] hover:text-gray-900">Try: {item}</button>)}</div><div className="mt-10 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-gray-400"><ArrowDown className="h-3.5 w-3.5 animate-bounce" />The interface appears after intent</div></div></Container></section>

  return <section key={generation} className="relative min-h-screen overflow-hidden bg-gradient-hero pt-24 md:pt-28"><div className="pointer-events-none absolute inset-0 bg-grid" /><Container className="relative z-10 py-10 md:py-14"><div className="mx-auto max-w-7xl"><div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-5"><div className="flex items-center gap-3"><span className={cx('h-2.5 w-2.5 rounded-full', status === 'loading' ? 'animate-pulse bg-amber-500' : 'bg-emerald-500')} /><span className="text-xs font-semibold uppercase tracking-[.16em] text-gray-500">{status === 'loading' ? 'Compiling surface' : `Surface compiled / build ${generation}`}</span><span className="text-gray-300">/</span><span className="text-xs text-gray-500">{context.industry} · {context.role}</span></div><button onClick={() => { resetContext(); setCompiled(false); setCompilePhase('idle'); setGoal('') }} className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900"><RotateCcw className="h-3.5 w-3.5" />Start another mission</button></div><div className="grid gap-10 py-12 lg:grid-cols-[.72fr_1.28fr] lg:items-center"><div><div className={cx('mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold', colors.soft, colors.text)}><CircleDot className="h-3.5 w-3.5" />Generated for this visitor</div><h1 className="max-w-2xl text-4xl font-extralight tracking-tight text-gray-900 md:text-6xl">{current.hero.title}</h1><p className="mt-5 max-w-xl text-lg font-light leading-8 text-gray-600">{current.hero.description}</p><div className="mt-7 flex flex-wrap gap-2">{current.navigation.map((item) => <a key={item.label} href={item.href} className={cx('rounded-full border px-3 py-1.5 text-xs font-semibold', colors.border, colors.text)}>{item.label}</a>)}</div></div><div className="relative rounded-2xl border border-gray-200 bg-white p-5 shadow-premium md:p-7"><div className="absolute -top-3 left-6 rounded-full border border-gray-200 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[.16em] text-gray-500">ZeroNav / generated journey</div><div className="grid grid-cols-3 gap-2 pt-2 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-400"><div className="rounded-lg bg-gray-50 p-3">Intent<br /><span className="mt-1 block text-sm normal-case tracking-normal text-gray-900">{context.goal}</span></div><div className="rounded-lg bg-gray-50 p-3">Audience<br /><span className="mt-1 block text-sm normal-case tracking-normal text-gray-900">{context.role}</span></div><div className="rounded-lg bg-gray-50 p-3">Depth<br /><span className="mt-1 block text-sm normal-case tracking-normal text-gray-900">{context.technical_depth}</span></div></div><div className="my-4 flex items-center gap-2 text-[10px] text-gray-400"><span className="h-px flex-1 bg-gray-200" />GENERATED IN THIS VISIT<span className="h-px flex-1 bg-gray-200" /></div><div className="grid gap-2 sm:grid-cols-4">{['Mission', 'Business', 'Technical', 'Proof'].map((item, index) => <button key={item} onClick={() => setView((['business', 'business', 'technical', 'proof'] as View[])[index])} className={cx('rounded-lg border p-3 text-left text-xs font-semibold transition-colors', (index === 0 && view === 'business') || item.toLowerCase() === view ? `${colors.border} ${colors.soft} ${colors.text}` : 'border-gray-100 bg-white text-gray-500')}><span className="block text-[10px] text-gray-400">0{index + 1}</span><span className="mt-3 block">{item}</span></button>)}</div></div></div>

    <div className="grid gap-8 border-t border-gray-200 pt-12 lg:grid-cols-[1.2fr_.8fr]"><div><div className="mb-3 text-xs font-semibold uppercase tracking-[.16em] text-[var(--accent-700)]">{view === 'business' ? 'Business view' : view === 'technical' ? 'Technical view' : 'Proof view'} / materialized now</div><div className="rounded-xl border border-gray-200 bg-white p-6 shadow-premium md:p-8">{view === 'business' && <><div className="flex items-start gap-4"><Target className="mt-1 h-6 w-6 shrink-0 text-[var(--accent-700)]" /><div><h2 className="text-3xl font-light text-gray-900">What changes for the business?</h2><p className="mt-4 text-base leading-7 text-gray-600">Newtuple maps <span className="font-semibold text-gray-900">{context.goal}</span> into an outcome, a proof point, and an actionable first step. The visitor does not browse a catalogue; the catalogue is filtered by the mission.</p></div></div><div className="mt-8 grid gap-3 sm:grid-cols-3"><Info label="Outcome" value={context.goal} /><Info label="First proof" value="14-day pilot" /><Info label="Next decision" value={current.primaryCta.label} /></div></>}{view === 'technical' && <><div className="flex items-start gap-4"><Terminal className="mt-1 h-6 w-6 shrink-0 text-[var(--accent-700)]" /><div><h2 className="text-3xl font-light text-gray-900">A path for builders.</h2><p className="mt-4 text-base leading-7 text-gray-600">The technical view is generated on demand. It prioritizes integrations, evaluation, observability, and the constraints already present in the visitor profile.</p></div></div><div className="mt-8 grid items-center gap-2 sm:grid-cols-3"><Info label="Systems" value={context.systems.join(' + ') || 'Existing stack'} /><ArrowRight className="hidden text-gray-300 sm:block" /><Info label="Newtuple layer" value="Agents + workflows + evals" /></div></>}{view === 'proof' && <><div className="flex items-start gap-4"><ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-emerald-600" /><div><h2 className="text-3xl font-light text-gray-900">Proof selected for this goal.</h2><p className="mt-4 text-base leading-7 text-gray-600">Only relevant approved work appears in this journey. Every other case study stays out of the way.</p></div></div><div className="mt-7 space-y-3">{relevant.map((study) => <Link key={study.slug} href={variant.caseStudyHref} className="group flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4 hover:border-[var(--accent-300)]"><div><div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--accent-700)]">{study.competency}</div><div className="mt-1 text-sm font-semibold text-gray-900">{study.title}</div></div><ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1" /></Link>)}</div></>}</div></div><div className="space-y-4"><div className="rounded-xl border border-gray-200 bg-white p-5 shadow-premium"><div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-gray-500"><Bot className="h-4 w-4 text-[var(--accent-700)]" />Agent-readable state</div><div className="space-y-3 font-mono text-[11px]">{['get_current_experience()', `explain_current_experience()`, `generate_recommended_path()`].map((line, index) => <div key={line} className="flex items-center gap-2"><span className="text-gray-300">0{index + 1}</span><span className="text-gray-600">{line}</span><span className="ml-auto text-emerald-600">ready</span></div>)}</div><div className="mt-5 rounded-lg bg-gray-50 p-3 text-xs leading-5 text-gray-600">The agent receives the compiled mission and can request another view without navigating through a fixed site hierarchy.</div></div><div className="rounded-xl border border-[var(--accent-200)] bg-[var(--accent-50)] p-5"><div className="flex items-center gap-2 text-sm font-semibold text-[var(--accent-900)]"><Zap className="h-4 w-4" />Recommended next move</div><p className="mt-2 text-sm leading-6 text-gray-700">{current.primaryCta.label} — the visitor stays in control before any consultation or lead action.</p><Button href={current.primaryCta.href} size="md" className="mt-4 w-full">Continue the mission<ArrowRight className="ml-2 h-4 w-4" /></Button></div></div></div>
    <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-6 text-xs text-gray-500"><span className="inline-flex items-center gap-2"><Workflow className="h-4 w-4 text-[var(--accent-700)]" />One context object. Many generated surfaces.</span><button onClick={() => setShowTools((open) => !open)} className="font-semibold text-gray-600 hover:text-gray-900">{showTools ? 'Hide' : 'Show'} WebMCP contract</button></div>
    {showTools && <div className="mt-3 rounded-xl border border-gray-200 bg-white p-5 font-mono text-xs text-gray-600 shadow-sm"><div className="text-gray-400">document.modelContext.registerTool</div><div className="mt-2 text-[var(--accent-800)]">set_visitor_context → compile_experience → request_view → start_consultation</div><div className="mt-3 font-sans text-gray-500">Tools are progressive enhancement; the human experience remains complete without an agent.</div></div>}
  </div></Container></section>
}

function ThinkingCanvas({ phase, goal }: { phase: CompilePhase; goal: string }) {
  const steps = ['read intent', 'resolve audience', 'select proof', 'compose journey']
  const activeStep = phase === 'thinking' ? 2 : 4

  return <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-gradient-hero">
    <div className="pointer-events-none absolute inset-0 bg-grid" />
    <div className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-cyan-200/30 blur-3xl" />
    <Container className="relative z-10 flex min-h-[calc(100vh-5rem)] items-center justify-center py-16">
      <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white/95 p-7 shadow-premium md:p-10">
        <div className="flex items-center justify-between border-b border-gray-100 pb-5">
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[.16em] text-gray-500"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-amber-500" />ZeroNav compiler</div>
          <span className="font-mono text-[11px] text-gray-400">build in progress</span>
        </div>
        <div className="py-10">
          <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-[var(--accent-800)]"><Sparkles className="h-4 w-4 animate-pulse" />{phase === 'revealing' ? 'Revealing a new surface…' : 'Thinking through your mission…'}</div>
          <h1 className="text-4xl font-extralight tracking-tight text-gray-900 md:text-6xl">Compiling a new interface<span className="text-[var(--accent-600)]">.</span></h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-gray-600">“{goal}”</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-4">
          {steps.map((step, index) => <div key={step} className={cx('rounded-lg border p-3 text-xs transition-all duration-500', index < activeStep ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-gray-100 bg-gray-50 text-gray-400')}><div className="mb-3 flex items-center justify-between"><span>0{index + 1}</span>{index < activeStep ? <Check className="h-3.5 w-3.5" /> : <span className="h-3.5 w-3.5 animate-pulse rounded-full border border-gray-300" />}</div>{step}</div>)}
        </div>
        <div className="mt-7 h-1 overflow-hidden rounded-full bg-gray-100"><div className={cx('h-full rounded-full bg-[var(--accent-600)] transition-all duration-[2200ms]', phase === 'revealing' ? 'w-full' : 'w-2/3')} /></div>
        <p className="mt-3 text-center text-[11px] uppercase tracking-[.16em] text-gray-400">The layout, copy, proof, and next action are being selected for this visitor</p>
      </div>
    </Container>
  </section>
}

function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-lg border border-gray-100 bg-gray-50 p-4"><div className="text-xs text-gray-500">{label}</div><div className="mt-3 text-sm font-semibold leading-5 text-gray-900">{value}</div></div> }
