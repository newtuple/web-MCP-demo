'use client'

import { useMemo } from 'react'
import Section from '@/components/ui/Section'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import GradientText from '@/components/ui/GradientText'
import FadeIn from '@/components/motion/FadeIn'
import StaggerChildren, { StaggerItem } from '@/components/motion/StaggerChildren'
import DeploymentOptions from '@/components/sections/DeploymentOptions'
import StateMachineHero from '@/components/flowtuple/StateMachineHero'
import WorkspaceDemo from '@/components/flowtuple/WorkspaceDemo'
import { resolveIcon } from '@/lib/icons'

interface FlowtupleData {
  title: string
  description: string
  hero: {
    badge: string
    titleLead: string
    titleAccent: string
    description: string
    kicker: string
    primaryCta: string
    secondaryCta: string
  }
  problem: {
    label: string
    title: string
    titleAccent: string
    description: string
    vignettes: { label: string; body: string; punch: string }[]
  }
  thesis: { title: string; titleAccent: string; description: string }
  how: {
    label: string
    title: string
    titleAccent: string
    steps: { num: string; icon: string; title: string; description: string }[]
    primitivesLabel: string
    primitives: string[]
  }
  engine: {
    label: string
    title: string
    titleAccent: string
    description: string
    facts: { icon: string; title: string; description: string }[]
  }
  experience: {
    label: string
    title: string
    titleAccent: string
    features: { icon: string; title: string; description: string }[]
  }
  workflows: {
    label: string
    title: string
    titleAccent: string
    description: string
    items: { title: string; sector: string; description: string }[]
  }
  principles: {
    label: string
    title: string
    items: { title: string; description: string }[]
  }
  showDeployment: boolean
  cta: { title: string; description: string }
}

/** Small uppercase eyebrow with the cobalt tick beneath it. */
function Eyebrow({ children, dark = false }: { children: string; dark?: boolean }) {
  return (
    <>
      <div
        className={`text-xs font-medium uppercase tracking-[0.22em] ${dark ? 'text-white/45' : 'text-cobalt-900'}`}
      >
        {children}
      </div>
      <span className={`mt-5 mb-7 block h-0.5 w-9 rounded-full ${dark ? 'bg-cyan-500' : 'bg-cobalt-900'}`} />
    </>
  )
}

export default function FlowtupleContent({ data }: { data: FlowtupleData }) {
  const { hero, problem, thesis, how, engine, experience, workflows, principles, cta } = data

  const howSteps = useMemo(
    () => how.steps.map((s) => ({ ...s, Icon: resolveIcon(s.icon) })),
    [how.steps]
  )
  const engineFacts = useMemo(
    () => engine.facts.map((f) => ({ ...f, Icon: resolveIcon(f.icon) })),
    [engine.facts]
  )
  const expFeatures = useMemo(
    () => experience.features.map((f) => ({ ...f, Icon: resolveIcon(f.icon) })),
    [experience.features]
  )

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-white px-6 pb-20 pt-36 md:pt-40 lg:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-32 h-80 w-80 rounded-full bg-cobalt-100/55 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 top-40 h-72 w-72 rounded-full bg-cyan-100/50 blur-3xl"
        />
        <Container className="relative">
          <FadeIn>
            <div className="text-xs font-medium uppercase tracking-[0.22em] text-cobalt-900">{hero.badge}</div>
            <span className="mt-5 mb-7 block h-0.5 w-9 rounded-full bg-cobalt-900" />
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="max-w-[14em] text-4xl font-extralight leading-[1.12] tracking-tight text-gray-950 sm:text-5xl lg:text-7xl">
              {hero.titleLead}
              <br />
              <span className="font-light text-cobalt-900">{hero.titleAccent}</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="mt-7 max-w-3xl text-lg font-light leading-relaxed text-gray-600 lg:text-xl">
              {hero.description}
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="mt-6 max-w-2xl border-l-2 border-cobalt-200 pl-4 text-sm font-light leading-relaxed text-gray-500 md:text-[15px]">
              {hero.kicker}
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button
                href="/contactus"
                size="lg"
                className="bg-gray-950 text-white hover:text-white"
                fillClassName="bg-cobalt-900"
              >
                {hero.primaryCta}
              </Button>
              <Button href="#workspace" size="lg" variant="outline">
                {hero.secondaryCta}
              </Button>
            </div>
          </FadeIn>

          <FadeIn delay={0.5}>
            <div className="mt-16">
              <StateMachineHero />
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* ================= PROBLEM ================= */}
      <Section className="bg-gray-50">
        <FadeIn>
          <Eyebrow>{problem.label}</Eyebrow>
          <h2 className="max-w-[18em] text-3xl font-extralight leading-[1.18] tracking-tight text-gray-950 md:text-5xl">
            {problem.title}
            <br />
            <span className="text-cobalt-900">{problem.titleAccent}</span>
          </h2>
          <p className="mt-6 max-w-[38em] text-base font-light leading-relaxed text-gray-600 md:text-lg">
            {problem.description}
          </p>
        </FadeIn>

        <StaggerChildren className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {problem.vignettes.map((v) => (
            <StaggerItem key={v.label}>
              <div className="h-full rounded-3xl border border-gray-200 bg-white p-6">
                <div className="mb-4 text-[10.5px] font-medium uppercase tracking-[0.2em] text-cobalt-900">
                  {v.label}
                </div>
                <p className="text-sm font-light leading-relaxed text-gray-600">{v.body}</p>
                <b className="mt-3 block text-sm font-semibold text-gray-950">{v.punch}</b>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </Section>

      {/* ================= THESIS ================= */}
      <Section className="text-center">
        <FadeIn>
          <h2 className="mx-auto max-w-[16em] text-3xl font-extralight leading-[1.16] tracking-tight text-gray-950 md:text-5xl lg:text-6xl">
            {thesis.title}
            <br />
            {thesis.titleAccent.split('modeled')[0]}
            <GradientText className="font-light">modeled</GradientText>.
          </h2>
          <p className="mx-auto mt-7 max-w-[34em] text-base font-light leading-relaxed text-gray-600 md:text-xl">
            {thesis.description}
          </p>
        </FadeIn>
      </Section>

      {/* ================= HOW IT WORKS ================= */}
      <Section className="bg-gray-50">
        <FadeIn>
          <Eyebrow>{how.label}</Eyebrow>
          <h2 className="max-w-[18em] text-3xl font-extralight leading-[1.18] tracking-tight text-gray-950 md:text-5xl">
            {how.title}
            <br />
            <span className="text-cobalt-900">{how.titleAccent}</span>
          </h2>
        </FadeIn>

        <StaggerChildren className="mt-14 grid gap-5 md:grid-cols-3">
          {howSteps.map((s) => (
            <StaggerItem key={s.num}>
              <div className="h-full rounded-3xl border border-gray-200 bg-white p-8">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold tracking-widest text-cobalt-900">{s.num}</span>
                  <s.Icon className="h-6 w-6 text-cobalt-900" strokeWidth={1.5} />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-gray-950">{s.title}</h3>
                <p className="mt-3 text-sm font-light leading-relaxed text-gray-600">{s.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>

        <FadeIn>
          <div className="mt-12 flex flex-wrap items-center gap-2.5">
            <span className="mr-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">
              {how.primitivesLabel}
            </span>
            {how.primitives.map((p) => (
              <span
                key={p}
                className="rounded-full border border-cobalt-900/30 bg-cobalt-900/5 px-4 py-1.5 text-[12.5px] font-medium text-cobalt-900"
              >
                {p}
              </span>
            ))}
          </div>
        </FadeIn>
      </Section>

      {/* ================= THE WORKSPACE ================= */}
      <Section id="workspace" className="bg-white">
        <FadeIn>
          <Eyebrow>{experience.label}</Eyebrow>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <h2 className="text-3xl font-extralight leading-[1.18] tracking-tight text-gray-950 md:text-5xl">
                {experience.title}
                <br />
                <span className="text-cobalt-900">{experience.titleAccent}</span>
              </h2>
            </div>
            <div className="flex flex-col gap-6">
              {expFeatures.map((f) => (
                <div key={f.title} className="flex gap-4">
                  <f.Icon className="mt-0.5 h-5 w-5 shrink-0 text-cobalt-900" strokeWidth={1.5} />
                  <div>
                    <b className="block text-[15px] font-semibold text-gray-950">{f.title}</b>
                    <p className="mt-1 text-sm font-light leading-relaxed text-gray-600">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="mt-14">
            <WorkspaceDemo />
          </div>
          <p className="mx-auto mt-5 max-w-3xl text-center text-xs leading-relaxed text-gray-400">
            Running on sample data. Switch personas or tap a quick action and the surface is composed again from the
            same six components, and you can watch which ones the request selects. The supplier board is a live state machine:
            it advances one guarded transition at a time, and stops when a guard says no.
          </p>
        </FadeIn>
      </Section>

      {/* ================= THE ENGINE (practitioner) ================= */}
      <section className="relative overflow-hidden bg-gray-950 px-6 py-24 text-white md:py-28 lg:px-8">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid-dark opacity-40" />
        <Container className="relative">
          <FadeIn>
            <Eyebrow dark>{engine.label}</Eyebrow>
            <h2 className="max-w-[18em] text-3xl font-extralight leading-[1.18] tracking-tight md:text-5xl">
              {engine.title}
              <br />
              <span className="text-white/60">{engine.titleAccent}</span>
            </h2>
            <p className="mt-6 max-w-[38em] text-base font-light leading-relaxed text-white/60 md:text-lg">
              {engine.description}
            </p>
          </FadeIn>

          <StaggerChildren className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {engineFacts.map((f) => (
              <StaggerItem key={f.title}>
                <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-colors hover:border-white/25">
                  <f.Icon className="h-6 w-6 text-cyan-500" strokeWidth={1.5} />
                  <b className="mt-5 block text-[15.5px] font-semibold text-white">{f.title}</b>
                  <p className="mt-3 text-sm font-light leading-relaxed text-white/60">{f.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </Container>
      </section>

      {/* ================= WORKFLOWS ================= */}
      <Section>
        <FadeIn>
          <Eyebrow>{workflows.label}</Eyebrow>
          <h2 className="max-w-[18em] text-3xl font-extralight leading-[1.18] tracking-tight text-gray-950 md:text-5xl">
            {workflows.title}
            <br />
            <span className="text-cobalt-900">{workflows.titleAccent}</span>
          </h2>
          <p className="mt-6 max-w-[38em] text-base font-light leading-relaxed text-gray-600 md:text-lg">
            {workflows.description}
          </p>
        </FadeIn>

        <StaggerChildren className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {workflows.items.map((w) => (
            <StaggerItem key={w.title}>
              <div className="h-full rounded-3xl border border-gray-200 bg-white p-7 transition-all hover:-translate-y-0.5 hover:border-cobalt-300 hover:shadow-premium-lg">
                <span className="inline-flex rounded-full border border-cobalt-200 bg-cobalt-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-cobalt-900">
                  {w.sector}
                </span>
                <h3 className="mt-4 text-[17px] font-semibold text-gray-950">{w.title}</h3>
                <p className="mt-3 text-sm font-light leading-relaxed text-gray-600">{w.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </Section>

      {/* ================= PRINCIPLES ================= */}
      <Section className="bg-gray-50">
        <FadeIn>
          <Eyebrow>{principles.label}</Eyebrow>
          <h2 className="text-3xl font-extralight leading-[1.18] tracking-tight text-gray-950 md:text-5xl">
            {principles.title}
          </h2>
        </FadeIn>

        <StaggerChildren className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {principles.items.map((p) => (
            <StaggerItem key={p.title}>
              <div className="h-full rounded-3xl border border-gray-200 bg-white p-7">
                <b className="block text-[15.5px] font-semibold text-gray-950">{p.title}</b>
                <p className="mt-2.5 text-sm font-light leading-relaxed text-gray-600">{p.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </Section>

      {data.showDeployment && <DeploymentOptions theme="dark" />}

      {/* ================= CTA ================= */}
      <section className="border-t border-gray-200 bg-white px-6 py-20 text-center md:py-24 lg:px-8">
        <Container>
          <FadeIn>
            <h2 className="mx-auto max-w-[16em] text-3xl font-extralight leading-[1.18] tracking-tight text-gray-950 md:text-5xl">
              {cta.title}
            </h2>
            <p className="mx-auto mt-6 max-w-[34em] text-base font-light leading-relaxed text-gray-600 md:text-lg">
              {cta.description}
            </p>
            <div className="mt-10 flex justify-center">
              <Button
                href="/contactus"
                size="lg"
                className="bg-gray-950 text-white hover:text-white shadow-premium hover:shadow-premium-lg"
                fillClassName="bg-cobalt-900"
              >
                Get in touch
              </Button>
            </div>
          </FadeIn>
        </Container>
      </section>
    </>
  )
}
