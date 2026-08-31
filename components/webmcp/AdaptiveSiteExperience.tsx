'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowDown, ArrowRight, Bot, Boxes, Check, CircleDot, Cpu, FileCheck2,
  Orbit, RotateCcw, Send, Sparkles, Target, Workflow, Zap,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import { DEFAULT_VISITOR_CONTEXT, generateAdaptiveSiteVariant, type VisitorContext } from '@/lib/adaptiveSite'
import {
  createFallbackMissionExperience,
  type ExperienceSectionKind,
  type ExperienceTheme,
  type MissionExperience,
} from '@/lib/missionExperience'
import { useVisitorContext } from './useVisitorContext'

interface CaseStudySummary { slug: string; title: string; competency: string; cardSummary: string }
type CompilePhase = 'idle' | 'thinking' | 'revealing' | 'ready'
type GenerationSource = 'openai' | 'fallback'
const EXPERIENCE_STORAGE_KEY = 'newtuple:generated-experience:v1'

const quickStarts = [
  'Cut product returns by fixing catalog quality across Shopify and SAP',
  'Design a governed AI support agent on Azure with human approval',
  'Compare Newtuple products for evaluating LLM quality in production',
  'Find an AI engineering role where I can own agent infrastructure',
]

const themes: Record<ExperienceTheme, { text: string; soft: string; border: string; dot: string; glow: string }> = {
  cyan: { text: 'text-cyan-900', soft: 'bg-cyan-50', border: 'border-cyan-200', dot: 'bg-cyan-500', glow: 'bg-cyan-200/35' },
  amber: { text: 'text-amber-900', soft: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-500', glow: 'bg-amber-200/35' },
  emerald: { text: 'text-emerald-900', soft: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500', glow: 'bg-emerald-200/35' },
  violet: { text: 'text-violet-900', soft: 'bg-violet-50', border: 'border-violet-200', dot: 'bg-violet-500', glow: 'bg-violet-200/35' },
}

const layoutClasses = {
  'command-center': 'lg:grid-cols-[.82fr_1.18fr]',
  blueprint: 'lg:grid-cols-[1.08fr_.92fr]',
  constellation: 'lg:grid-cols-[1.18fr_.82fr]',
  storyboard: 'lg:grid-cols-1',
}

const cx = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(' ')
const sectionIcon = (kind: ExperienceSectionKind) => kind === 'architecture' ? Cpu : kind === 'proof' ? FileCheck2 : Target

export default function AdaptiveSiteExperience({ caseStudies }: { caseStudies: CaseStudySummary[] }) {
  const { replaceContext, resetContext } = useVisitorContext()
  const [goal, setGoal] = useState('')
  const [compiled, setCompiled] = useState(false)
  const [phase, setPhase] = useState<CompilePhase>('idle')
  const [generation, setGeneration] = useState(0)
  const [experience, setExperience] = useState<MissionExperience | null>(null)
  const [source, setSource] = useState<GenerationSource>('fallback')
  const [model, setModel] = useState<string | null>(null)
  const [fallbackReason, setFallbackReason] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<ExperienceSectionKind>('outcome')
  const [showTools, setShowTools] = useState(false)

  const compile = async (statement: string) => {
    const mission = statement.trim()
    if (!mission) return
    const nextGeneration = generation + 1
    const fallback = createFallbackMissionExperience(mission)
    setGoal(mission)
    setExperience(fallback)
    replaceContext(fallback.context)
    setSource('fallback')
    setModel(null)
    setFallbackReason(null)
    setActiveSection('outcome')
    setPhase('thinking')
    setCompiled(false)

    const minimumBuildTime = new Promise((resolve) => window.setTimeout(resolve, 2400))
    let resolvedExperience = fallback
    let resolvedSource: GenerationSource = 'fallback'
    let resolvedModel: string | null = null
    try {
      const [response] = await Promise.all([
        fetch('/api/mission', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ statement: mission, generation: nextGeneration }),
        }),
        minimumBuildTime,
      ])
      if (!response.ok) throw new Error(`Mission API returned ${response.status}`)
      const result = await response.json()
      if (result?.experience) {
        resolvedExperience = result.experience
        resolvedSource = result.source === 'openai' ? 'openai' : 'fallback'
        resolvedModel = typeof result.model === 'string' ? result.model : null
        setExperience(resolvedExperience)
        replaceContext(resolvedExperience.context)
        setSource(resolvedSource)
        setModel(resolvedModel)
        setFallbackReason(typeof result.fallbackReason === 'string' ? result.fallbackReason : null)
      }
    } catch {
      await minimumBuildTime
    } finally {
      const generatedState = { experience: resolvedExperience, source: resolvedSource, model: resolvedModel }
      try { window.sessionStorage.setItem(EXPERIENCE_STORAGE_KEY, JSON.stringify(generatedState)) } catch { /* storage is progressive enhancement */ }
      window.dispatchEvent(new CustomEvent('newtuple-experience-generated', { detail: generatedState }))
      setGeneration(nextGeneration)
      setPhase('revealing')
      window.setTimeout(() => { setCompiled(true); setPhase('ready') }, 900)
    }
  }

  useEffect(() => {
    const onAgentCompile = (event: Event) => {
      const statement = (event as CustomEvent<{ statement?: string }>).detail?.statement
      if (statement) void compile(statement)
    }
    window.addEventListener('newtuple-zeronav-compile', onAgentCompile)
    return () => window.removeEventListener('newtuple-zeronav-compile', onAgentCompile)
  })

  // Structured WebMCP tools (set_visitor_context, update_visitor_profile,
  // infer_visitor_context, select_goal, reset_visitor_context, ...) update
  // the shared VisitorContext but have no free-text mission to send through
  // the OpenAI compile() path above. They dispatch this event instead so the
  // page still visibly rebuilds — locally, from the fallback composer, since
  // their tool descriptions promise an immediate rebuild, not a ~2.4s
  // OpenAI round trip.
  useEffect(() => {
    const onContextSync = (event: Event) => {
      const nextContext = (event as CustomEvent<{ context?: VisitorContext }>).detail?.context
      if (!nextContext) return

      const isNeutral = JSON.stringify(nextContext) === JSON.stringify(DEFAULT_VISITOR_CONTEXT)
      if (isNeutral) {
        setCompiled(false)
        setPhase('idle')
        setExperience(null)
        setGoal('')
        return
      }

      const built = createFallbackMissionExperience('', nextContext)
      setGoal(nextContext.goal)
      setExperience(built)
      setSource('fallback')
      setModel(null)
      setFallbackReason(null)
      setActiveSection('outcome')
      setPhase('thinking')
      setCompiled(false)
      window.setTimeout(() => {
        setGeneration((value) => value + 1)
        setPhase('revealing')
        window.setTimeout(() => { setCompiled(true); setPhase('ready') }, 500)
      }, 400)
    }
    window.addEventListener('newtuple-context-sync', onContextSync)
    return () => window.removeEventListener('newtuple-context-sync', onContextSync)
  })

  if (!compiled) {
    if (phase !== 'idle' && experience) return <BuildCanvas phase={phase} mission={goal} experience={experience} source={source} />
    return <EntryCanvas goal={goal} setGoal={setGoal} onCompile={compile} />
  }

  if (!experience) return null
  return <GeneratedExperience
    key={generation}
    experience={experience}
    source={source}
    model={model}
    fallbackReason={fallbackReason}
    generation={generation}
    caseStudies={caseStudies}
    activeSection={activeSection}
    setActiveSection={setActiveSection}
    showTools={showTools}
    setShowTools={setShowTools}
    reset={() => { resetContext(); setCompiled(false); setPhase('idle'); setExperience(null); setGoal('') }}
  />
}

function EntryCanvas({ goal, setGoal, onCompile }: { goal: string; setGoal: (value: string) => void; onCompile: (value: string) => void }) {
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); onCompile(goal) }
  return <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-gradient-hero">
    <div className="pointer-events-none absolute inset-0 bg-grid" />
    <div className="pointer-events-none absolute left-1/2 top-1/4 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-200/25 blur-3xl" />
    <Container className="relative z-10 flex min-h-[calc(100vh-5rem)] items-center justify-center py-16">
      <div className="w-full max-w-5xl text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-white/80 px-4 py-1.5 text-sm font-semibold text-cyan-900 shadow-sm"><Orbit className="h-4 w-4" />Newtuple Generative Web</div>
        <h1 className="text-5xl font-extralight leading-[.96] tracking-[-.05em] text-gray-900 md:text-8xl">Don’t browse a website.<br /><span className="text-gradient">Compile one for your mission.</span></h1>
        <p className="mx-auto mt-8 max-w-2xl text-lg font-light leading-8 text-gray-600">Describe the outcome, systems, constraints, and audience. OpenAI generates the content architecture and selects a safe UI composition for this visit.</p>
        <form onSubmit={submit} className="mx-auto mt-10 max-w-3xl rounded-2xl border border-gray-200 bg-white p-2 text-left shadow-premium">
          <textarea autoFocus value={goal} onChange={(event) => setGoal(event.target.value)} placeholder="Example: We need to reduce product returns by improving catalog data across Shopify, SAP, and supplier onboarding…" className="min-h-28 w-full resize-none rounded-xl border-0 bg-gray-50 p-5 text-base leading-7 text-gray-900 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-100" />
          <button className="mt-2 inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-gray-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-premium-lg"><Send className="h-4 w-4" />Generate my website<ArrowRight className="h-4 w-4" /></button>
        </form>
        <div className="mx-auto mt-5 flex max-w-4xl flex-wrap justify-center gap-2">{quickStarts.map((item) => <button type="button" key={item} onClick={() => { setGoal(item); onCompile(item) }} className="rounded-full border border-gray-200 bg-white/80 px-3 py-1.5 text-xs text-gray-600 transition hover:border-cyan-300 hover:text-gray-900">{item}</button>)}</div>
        <div className="mt-10 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-gray-400"><ArrowDown className="h-3.5 w-3.5 animate-bounce" />Content and interface are generated together</div>
      </div>
    </Container>
  </section>
}

function BuildCanvas({ phase, mission, experience, source }: { phase: CompilePhase; mission: string; experience: MissionExperience; source: GenerationSource }) {
  const activeCount = phase === 'revealing' ? experience.build.stages.length : Math.max(1, Math.ceil(experience.build.stages.length / 2))
  const tone = themes[experience.ui.theme]
  return <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-gray-950 text-white">
    <div className="pointer-events-none absolute inset-0 opacity-25 bg-grid" />
    <div className={cx('pointer-events-none absolute left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 rounded-full blur-3xl', tone.glow)} />
    <Container className="relative z-10 flex min-h-[calc(100vh-5rem)] items-center justify-center py-14">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/[.055] shadow-2xl backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[.18em] text-white/60"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-400" />Experience compiler</div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-white/40"><span>{source === 'openai' ? 'OPENAI BLUEPRINT RECEIVED' : 'WAITING FOR OPENAI'}</span><span className="text-white/20">/</span><span>{experience.ui.layout}</span></div>
        </div>
        <div className="grid gap-10 p-6 md:p-10 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-cyan-300"><Sparkles className="h-4 w-4 animate-pulse" />{phase === 'revealing' ? 'Blueprint locked. Materializing UI…' : experience.build.headline}</div>
            <h1 className="text-4xl font-extralight tracking-[-.04em] md:text-6xl">The page is building around <span className="text-cyan-300">your task.</span></h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/55">“{mission}”</p>
            <div className="mt-8 flex flex-wrap gap-2">{experience.build.signals.map((signal) => <span key={signal} className="rounded-full border border-white/10 bg-white/[.06] px-3 py-1.5 text-xs text-white/70">{signal}</span>)}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="mb-4 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[.16em] text-white/35"><span>Live assembly grains</span><span>{phase === 'revealing' ? '100%' : 'building'}</span></div>
            <div className="space-y-2">{experience.build.stages.map((stage, index) => <div key={stage} className={cx('flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-700', index < activeCount ? 'border-cyan-400/25 bg-cyan-400/10 text-white' : 'border-white/5 bg-white/[.025] text-white/30')}><span className="font-mono text-[10px] text-white/30">0{index + 1}</span><span className="text-sm">{stage}</span>{index < activeCount ? <Check className="ml-auto h-4 w-4 text-cyan-300" /> : <span className="ml-auto h-3 w-3 animate-pulse rounded-full border border-white/20" />}</div>)}</div>
            <div className="mt-4 grid grid-cols-2 gap-2"><BuildGrain label="layout" value={experience.ui.layout} /><BuildGrain label="theme" value={experience.ui.theme} /><BuildGrain label="sections" value={`${experience.ui.sections.length} composed`} /><BuildGrain label="route" value={experience.ui.primaryCta.label} /></div>
          </div>
        </div>
        <div className="h-1 bg-white/5"><div className={cx('h-full bg-cyan-400 transition-all duration-[2400ms]', phase === 'revealing' ? 'w-full' : 'w-2/3')} /></div>
      </div>
    </Container>
  </section>
}

function GeneratedExperience({ experience, source, model, fallbackReason, generation, caseStudies, activeSection, setActiveSection, showTools, setShowTools, reset }: {
  experience: MissionExperience
  source: GenerationSource
  model: string | null
  fallbackReason: string | null
  generation: number
  caseStudies: CaseStudySummary[]
  activeSection: ExperienceSectionKind
  setActiveSection: (kind: ExperienceSectionKind) => void
  showTools: boolean
  setShowTools: (value: boolean) => void
  reset: () => void
}) {
  const { context, ui } = experience
  const tone = themes[ui.theme]
  const localVariant = generateAdaptiveSiteVariant(context)
  const relevant = useMemo(() => caseStudies.filter((study) => localVariant.caseStudySlugs.includes(study.slug)).slice(0, 3), [caseStudies, localVariant.caseStudySlugs])
  const selected = ui.sections.find((section) => section.kind === activeSection) ?? ui.sections[0]
  const SelectedIcon = sectionIcon(selected.kind)
  const storyboard = ui.layout === 'storyboard'

  return <section className="relative min-h-screen overflow-hidden bg-gradient-hero pt-24 md:pt-28">
    <div className="pointer-events-none absolute inset-0 bg-grid" />
    <div className={cx('pointer-events-none absolute right-[-120px] top-24 h-[460px] w-[460px] rounded-full blur-3xl', tone.glow)} />
    <Container className="relative z-10 py-10 md:py-14"><div className="mx-auto max-w-7xl">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div className="flex flex-wrap items-center gap-3"><span className={cx('h-2.5 w-2.5 rounded-full', source === 'openai' ? 'bg-emerald-500' : 'bg-amber-500')} /><span className="text-xs font-semibold uppercase tracking-[.16em] text-gray-500">Build {generation} / {ui.layout}</span><span className="text-gray-300">/</span><span className="text-xs text-gray-500">{source === 'openai' ? `OpenAI generated${model ? ` · ${model}` : ''}` : `Local fallback${fallbackReason ? ` · ${formatFallbackReason(fallbackReason)}` : ''}`}</span></div>
        <button onClick={reset} className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900"><RotateCcw className="h-3.5 w-3.5" />Generate another website</button>
      </header>

      <div className={cx('grid gap-10 py-12 lg:items-center', layoutClasses[ui.layout])}>
        <div className={cx(storyboard && 'mx-auto max-w-4xl text-center')}>
          <div className={cx('mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold', tone.soft, tone.text)}><CircleDot className="h-3.5 w-3.5" />{ui.eyebrow}</div>
          <h1 className="max-w-4xl text-4xl font-extralight tracking-[-.04em] text-gray-900 md:text-7xl">{ui.title}</h1>
          <p className={cx('mt-6 max-w-2xl text-lg font-light leading-8 text-gray-600', storyboard && 'mx-auto')}>{ui.summary}</p>
          <div className={cx('mt-8 flex flex-wrap gap-2', storyboard && 'justify-center')}>{ui.navigation.map((item) => <Link key={`${item.href}-${item.label}`} href={item.href} className={cx('rounded-full border bg-white/70 px-3 py-1.5 text-xs font-semibold', tone.border, tone.text)}>{item.label}</Link>)}</div>
        </div>

        <div className={cx('relative rounded-3xl border border-gray-200 bg-white p-5 shadow-premium md:p-7', storyboard && 'mx-auto w-full max-w-5xl')}>
          <div className="absolute -top-3 left-6 rounded-full border border-gray-200 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[.16em] text-gray-500">AI-composed journey</div>
          <div className={cx('grid gap-3 pt-2', storyboard ? 'md:grid-cols-3' : 'sm:grid-cols-3')}>{ui.journey.map((step, index) => <div key={step.label} className={cx('rounded-2xl border p-4', index === 0 ? `${tone.border} ${tone.soft}` : 'border-gray-100 bg-gray-50')}><div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">0{index + 1}</div><div className="mt-4 text-sm font-semibold text-gray-900">{step.label}</div><div className="mt-2 text-xs leading-5 text-gray-500">{step.detail}</div></div>)}</div>
          <div className="my-5 flex items-center gap-2 text-[10px] text-gray-400"><span className="h-px flex-1 bg-gray-200" />MISSION SIGNALS<span className="h-px flex-1 bg-gray-200" /></div>
          <div className="grid gap-3 sm:grid-cols-3">{ui.metrics.map((metric) => <Metric key={metric.label} {...metric} />)}</div>
        </div>
      </div>

      <div className="grid gap-8 border-t border-gray-200 pt-12 lg:grid-cols-[1.25fr_.75fr]">
        <div>
          <div className="mb-4 flex flex-wrap gap-2">{ui.sections.map((section) => { const Icon = sectionIcon(section.kind); return <button key={section.kind} onClick={() => setActiveSection(section.kind)} className={cx('inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-semibold transition', activeSection === section.kind ? `${tone.border} ${tone.soft} ${tone.text}` : 'border-gray-200 bg-white text-gray-500')}><Icon className="h-4 w-4" />{section.label}</button> })}</div>
          <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-premium md:p-9">
            <div className="flex items-start gap-4"><div className={cx('rounded-xl p-3', tone.soft)}><SelectedIcon className={cx('h-6 w-6', tone.text)} /></div><div><div className="text-xs font-semibold uppercase tracking-[.16em] text-gray-400">AI-generated {selected.kind} module</div><h2 className="mt-3 text-3xl font-light tracking-tight text-gray-900 md:text-4xl">{selected.title}</h2><p className="mt-5 max-w-3xl text-base leading-7 text-gray-600">{selected.body}</p></div></div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">{selected.bullets.map((bullet, index) => <div key={bullet} className="rounded-2xl border border-gray-100 bg-gray-50 p-4"><div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Signal 0{index + 1}</div><div className="mt-3 text-sm font-semibold leading-6 text-gray-800">{bullet}</div></div>)}</div>
            {selected.kind === 'proof' && <div className="mt-8 space-y-3">{relevant.map((study) => <Link key={study.slug} href={localVariant.caseStudyHref} className="group flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 transition hover:border-gray-300"><div><div className={cx('text-[10px] font-semibold uppercase tracking-wider', tone.text)}>{study.competency}</div><div className="mt-1 text-sm font-semibold text-gray-900">{study.title}</div><div className="mt-1 line-clamp-1 text-xs text-gray-500">{study.cardSummary}</div></div><ArrowRight className="h-4 w-4 text-gray-400 transition group-hover:translate-x-1" /></Link>)}</div>}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-gray-200 bg-gray-950 p-6 text-white shadow-premium"><div className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-white/50"><Bot className="h-4 w-4 text-cyan-300" />Experience contract</div><div className="space-y-3 font-mono text-[11px]">{['context.generated', `layout.${ui.layout}`, `theme.${ui.theme}`, `sections.${ui.sections.length}`, `source.${source}`].map((line, index) => <div key={line} className="flex items-center gap-2"><span className="text-white/20">0{index + 1}</span><span className="text-white/65">{line}</span><span className="ml-auto text-emerald-300">ready</span></div>)}</div><div className="mt-5 flex flex-wrap gap-2">{ui.proofKeywords.map((keyword) => <span key={keyword} className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-white/50">{keyword}</span>)}</div></div>
          <div className={cx('rounded-3xl border p-6', tone.border, tone.soft)}><div className={cx('flex items-center gap-2 text-sm font-semibold', tone.text)}><Zap className="h-4 w-4" />Generated next move</div><p className="mt-3 text-sm leading-6 text-gray-700">{ui.primaryCta.rationale}</p><Button href={ui.primaryCta.href} size="md" className="mt-5 w-full">{ui.primaryCta.label}<ArrowRight className="ml-2 h-4 w-4" /></Button><Link href={ui.secondaryCta.href} className="mt-3 block text-center text-xs font-semibold text-gray-600">{ui.secondaryCta.label}</Link></div>
        </aside>
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-6 text-xs text-gray-500"><span className="inline-flex items-center gap-2"><Workflow className="h-4 w-4 text-[var(--accent-700)]" />One AI blueprint → many safe React primitives</span><button onClick={() => setShowTools(!showTools)} className="font-semibold text-gray-600 hover:text-gray-900">{showTools ? 'Hide' : 'Show'} WebMCP contract</button></div>
      {showTools && <div className="mt-3 rounded-2xl border border-gray-200 bg-white p-5 font-mono text-xs text-gray-600 shadow-sm"><div className="text-gray-400">document.modelContext.registerTool</div><div className="mt-2 text-[var(--accent-800)]">compile_experience → OpenAI blueprint → safe renderer → agent-readable state</div></div>}
    </div></Container>
  </section>
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4"><div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{label}</div><div className="mt-3 text-base font-semibold leading-6 text-gray-900">{value}</div><div className="mt-2 text-xs leading-5 text-gray-500">{detail}</div></div>
}

function BuildGrain({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-white/10 bg-white/[.04] p-3"><div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-wider text-white/30"><Boxes className="h-3 w-3 text-cyan-300" />{label}</div><div className="mt-2 truncate text-xs font-medium text-white/70">{value}</div></div>
}

function formatFallbackReason(reason: string) {
  if (reason === 'missing_api_key') return 'missing API key'
  if (reason === 'openai_http_401') return 'invalid API key'
  if (reason === 'openai_http_403') return 'API access denied'
  if (reason === 'openai_http_404') return 'model unavailable'
  if (reason === 'openai_http_429') return 'rate limited'
  if (reason === 'openai_empty_output') return 'empty model output'
  return 'OpenAI request failed'
}
