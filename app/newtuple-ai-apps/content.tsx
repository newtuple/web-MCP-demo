'use client'
/* eslint-disable @next/next/no-img-element */

import { ArrowRight, CheckCircle2 } from 'lucide-react'
import Hero from '@/components/sections/Hero'
import Section from '@/components/ui/Section'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import FadeIn from '@/components/motion/FadeIn'
import StaggerChildren, { StaggerItem } from '@/components/motion/StaggerChildren'
import TypingBlock from '@/components/motion/TypingBlock'
import ToolCallAnimation from '@/components/motion/ToolCallAnimation'
import type { ToolCallItem } from '@/components/motion/ToolCallAnimation'
import { resolveIcon } from '@/lib/icons'

const provocativeTools: ToolCallItem[] = [
  { label: 'Mapping product roadmap', result: '6 milestones defined' },
  { label: 'Evaluating model stack', result: 'GPT-4o + Claude selected' },
  { label: 'Scaffolding application', result: 'React + FastAPI ready' },
  { label: 'Building RAG pipeline', result: 'Vector store indexed' },
  { label: 'Running evaluation suite', result: '94.2% accuracy confirmed' },
]

interface NewtupleAiAppsData {
  title: string
  description: string
  hero: {
    badge: string
    title: string
    description: string
  }
  stats: { value: string; label: string }[]
  whatWeOffer: {
    sectionTitle: string
    sectionDescription: string
    items: {
      title: string
      image: string
      description: string
    }[]
  }
  phases: {
    sectionTitle: string
    sectionDescription: string
    items: {
      step: string
      title: string
      icon: string
      description: string
    }[]
  }
  includedFeatures: {
    sectionTitle: string
    sectionDescription: string
    items: {
      title: string
      icon: string
      description: string
    }[]
  }
  provocative: {
    title: string
    subtitle: string
    paragraphs: string[]
  }
  socialProof: {
    title: string
    description: string
  }
  cta: {
    title: string
    description: string
  }
}

function AppsHeroVisual({ stats }: { stats: { value: string; label: string }[] }) {
  const statItems = stats.slice(0, 3)

  return (
    <div className="relative mx-auto w-full max-w-[560px] px-1">
      <div className="pointer-events-none absolute inset-x-8 inset-y-8 rounded-full bg-cobalt-200/50 blur-3xl animate-pulse-subtle" />
      <div className="group relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden rounded-3xl border border-cobalt-100/90 bg-white/80 p-4 sm:p-5 md:p-6 shadow-[0_32px_68px_-42px_rgba(0,71,171,0.55)] backdrop-blur-sm">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-cobalt-50/60 to-cyan-50/40" />
        <div className="pointer-events-none absolute left-1/2 top-[43%] h-44 w-44 sm:h-52 sm:w-52 md:h-56 md:w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cobalt-200/80" />
        <div className="pointer-events-none absolute left-1/2 top-[43%] h-32 w-32 sm:h-40 sm:w-40 md:h-44 md:w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-cobalt-300/80 animate-[spin_18s_linear_infinite]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cobalt-400 to-transparent -translate-x-[110%] transition-transform duration-1000 group-hover:translate-x-0" />

        <div className="relative z-10 flex h-full flex-col">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-cobalt-100 bg-white/90 px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.12em] text-cobalt-800">
            Product Command Layer
          </span>

          <div className="absolute left-1/2 top-[39%] sm:top-[41%] w-[82%] sm:w-[76%] md:w-[72%] max-w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-cobalt-100/90 bg-white/95 px-3 py-2.5 sm:px-4 sm:py-3 shadow-[0_20px_42px_-30px_rgba(0,71,171,0.55)]">
            <div className="mb-1.5 flex items-center justify-between">
              <p className="text-[12px] sm:text-[13px] font-semibold text-gray-900">AI App Delivery Pipeline</p>
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-cyan-500 animate-pulse" />
            </div>
            <p className="text-[10px] sm:text-[11px] leading-relaxed text-gray-600">Roadmap, model stack, and production ops coordinated in one flow.</p>
          </div>

          <div className="absolute left-[7%] top-[22%] hidden lg:block rounded-xl border border-cobalt-100 bg-white/90 px-3 py-2 text-[11px] font-medium text-gray-700 shadow-[0_10px_24px_-18px_rgba(0,71,171,0.55)] animate-float">
            Strategy Sprint
          </div>
          <div className="absolute right-[5%] top-[22%] hidden lg:block rounded-xl border border-cobalt-100 bg-white/90 px-3 py-2 text-[11px] font-medium text-gray-700 shadow-[0_10px_24px_-18px_rgba(0,71,171,0.55)] animate-float-delayed">
            Build Phase
          </div>
          <div className="absolute right-[13%] top-[58%] hidden xl:block rounded-xl border border-cobalt-100 bg-white/90 px-3 py-2 text-[11px] font-medium text-gray-700 shadow-[0_10px_24px_-18px_rgba(0,71,171,0.55)] animate-float-slow">
            Operate Phase
          </div>

          <div className="mt-auto grid grid-cols-3 gap-2 sm:gap-2.5">
            {statItems.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-cobalt-100/90 bg-white/90 px-2 py-2 text-center shadow-[0_12px_24px_-20px_rgba(0,71,171,0.45)]"
              >
                <p className="text-sm sm:text-base md:text-lg font-semibold leading-tight text-cobalt-900">{stat.value}</p>
                <p className="text-[10px] font-medium leading-tight text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function NewtupleAiAppsContent({ data }: { data: NewtupleAiAppsData }) {
  const { hero, stats, whatWeOffer, phases, includedFeatures, socialProof, cta } = data

  const phaseItems = phases.items.map((item: any) => ({
    ...item,
    icon: resolveIcon(item.icon),
  }))

  const featureItems = includedFeatures.items.map((item: any) => ({
    ...item,
    icon: resolveIcon(item.icon),
  }))

  return (
    <>
      <Hero
        badge={hero.badge}
        title={
          <>
            <span className="block text-gray-950 font-light">From roadmap to</span>
            <span className="mt-2 block text-cobalt-900 font-semibold tracking-tight">
              running product
            </span>
          </>
        }
        description={hero.description}
        compact
        fullScreen
        variant="split"
        visual={<AppsHeroVisual stats={stats} />}
        className="before:pointer-events-none before:absolute before:-top-32 before:left-[20%] before:h-72 before:w-72 before:rounded-full before:bg-cobalt-100/60 before:blur-3xl after:pointer-events-none after:absolute after:-bottom-28 after:right-[8%] after:h-64 after:w-64 after:rounded-full after:bg-cyan-100/60 after:blur-3xl"
      />

      {/* Provocative Section */}
      <section className="min-h-screen flex items-center py-24 md:py-32 bg-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-dark" />
        <div className="relative z-10 w-full">
          <div className="flex flex-col lg:flex-row items-stretch">
            <div className="flex-1 min-w-0 overflow-hidden">
              <Container>
                <div className="max-w-4xl mx-auto lg:mx-0">
                  <TypingBlock
                    lines={[
                      data.provocative.title,
                      data.provocative.subtitle,
                      ...data.provocative.paragraphs,
                    ]}
                    lineDelay={200}
                    lineClassName={(i) => {
                      if (i === 0) return 'text-4xl md:text-5xl lg:text-6xl text-white mb-4 leading-tight font-bold'
                      if (i === 1) return 'text-2xl md:text-3xl text-gray-400 font-light mb-12 leading-snug'
                      return 'text-lg text-gray-400 font-light leading-relaxed mb-6'
                    }}
                    warpSpeed
                  />
                  <FadeIn delay={0.4}>
                    <Button
                      href="/contactus"
                      variant="ghost"
                      size="lg"
                      className="border border-white/20 text-white hover:bg-white/10 hover:text-white mt-4"
                      fillClassName="bg-cobalt-900/90"
                    >
                      <span className="inline-flex items-center gap-2 whitespace-nowrap">
                        Get started
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </Button>
                  </FadeIn>
                </div>
              </Container>
            </div>
            <div className="hidden lg:flex items-stretch flex-shrink-0">
              <div className="w-px self-stretch bg-gray-800" />
              <div className="pl-6 pr-8 w-[320px] py-8">
                <div className="rounded-2xl border border-gray-800/90 bg-gray-900/70 p-5 shadow-[0_20px_44px_-32px_rgba(0,0,0,0.75)]">
                  <ToolCallAnimation tools={provocativeTools} title="Build Pipeline" dark />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <Section className="bg-gray-50 py-14 md:py-16">
        <FadeIn>
          <div className="text-center mb-10 md:mb-12">
            <p className="text-[11px] uppercase tracking-[0.16em] text-cobalt-900 font-semibold mb-2">
              Product Services
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {whatWeOffer.sectionTitle}
            </h2>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
              {whatWeOffer.sectionDescription}
            </p>
          </div>
        </FadeIn>
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {whatWeOffer.items.map((item) => (
            <StaggerItem key={item.title}>
              <Card className="group relative overflow-hidden p-0 h-[350px] md:h-[318px] flex flex-col border border-gray-200/90 transition-all duration-300 hover:border-cobalt-300 hover:shadow-[0_24px_42px_-28px_rgba(0,71,171,0.42)]">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cobalt-400 to-transparent -translate-x-[110%] transition-transform duration-700 group-hover:translate-x-0" />
                <div className="h-[73%] md:h-[74%] w-full overflow-hidden transition-[height] duration-500 ease-out md:group-hover:h-[56%]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover object-center scale-[1.02] transition-transform duration-700 ease-out md:group-hover:scale-[1.06]"
                  />
                </div>
                <div className="flex-1 px-4 pt-3.5 pb-4 md:px-5 md:pt-3.5 md:pb-4 flex flex-col">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm font-light leading-relaxed overflow-hidden transition-all duration-500 ease-out max-h-24 opacity-100 mt-2 md:max-h-0 md:opacity-0 md:mt-0 md:group-hover:max-h-24 md:group-hover:opacity-100 md:group-hover:mt-2">
                    {item.description}
                  </p>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </Section>

      {/* Process Section */}
      <Section>
        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-[11px] uppercase tracking-[0.16em] text-cobalt-900 font-semibold mb-2">
              Delivery Method
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {phases.sectionTitle}
            </h2>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
              {phases.sectionDescription}
            </p>
          </div>
        </FadeIn>
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {phaseItems.map((phase: any, index: number) => (
            <StaggerItem key={phase.title}>
              <article className="group relative h-full min-h-[250px] overflow-hidden rounded-2xl border border-gray-200/90 bg-white p-6 shadow-[0_14px_28px_-22px_rgba(15,23,42,0.32)] transition-all duration-300 hover:-translate-y-1 hover:border-cobalt-300 hover:shadow-[0_24px_42px_-26px_rgba(0,71,171,0.4)]">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cobalt-400 to-transparent -translate-x-[110%] transition-transform duration-700 group-hover:translate-x-0" />
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cobalt-100 bg-cobalt-50 transition-colors duration-300 group-hover:bg-cobalt-100">
                    <phase.icon className="w-6 h-6 text-cobalt-900" strokeWidth={1.5} />
                  </div>
                  <span className="text-[11px] font-semibold tracking-[0.14em] text-gray-400">
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2.5">
                  {phase.title}
                </h3>
                <p className="text-gray-600 font-light leading-relaxed text-sm">
                  {phase.description}
                </p>
                <span className="text-6xl font-bold text-cobalt-50/70 absolute bottom-4 right-4 select-none">
                  {phase.step}
                </span>
              </article>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </Section>

      {/* What's Included */}
      <Section className="bg-gray-50">
        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-[11px] uppercase tracking-[0.16em] text-cobalt-900 font-semibold mb-2">
              Foundation Layer
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {includedFeatures.sectionTitle}
            </h2>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
              {includedFeatures.sectionDescription}
            </p>
          </div>
        </FadeIn>
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {featureItems.map((feature: any, index: number) => (
            <StaggerItem key={feature.title}>
              <article className="group relative h-full min-h-[250px] overflow-hidden rounded-2xl border border-gray-200/90 bg-white p-5 md:p-6 shadow-[0_14px_28px_-22px_rgba(15,23,42,0.32)] transition-all duration-300 hover:-translate-y-1 hover:border-cobalt-300 hover:shadow-[0_24px_42px_-26px_rgba(0,71,171,0.4)]">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cobalt-400 to-transparent -translate-x-[110%] transition-transform duration-700 group-hover:translate-x-0" />
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cobalt-100 bg-cobalt-50 transition-colors duration-300 group-hover:bg-cobalt-100">
                    <feature.icon
                      className="w-6 h-6 text-cobalt-900"
                      strokeWidth={1.5}
                    />
                  </div>
                  <span className="text-[11px] font-semibold tracking-[0.14em] text-gray-400">
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2.5 leading-tight">
                  {feature.title}
                </h3>
                <p className="text-gray-600 font-light leading-relaxed text-sm">
                  {feature.description}
                </p>
              </article>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </Section>

      {/* Social Proof */}
      <section className="relative overflow-hidden py-20 md:py-28 bg-gray-950">
        <div className="absolute inset-0 bg-grid-dark" />
        <Container className="relative z-10">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto mb-8">
              <p className="text-[11px] uppercase tracking-[0.16em] text-cobalt-300 font-semibold mb-2">
                Proof of Execution
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {socialProof.title}
              </h2>
              <p className="text-lg text-gray-400 font-light leading-relaxed">
                {socialProof.description}
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-8">
              {stats.slice(0, 3).map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-gray-800/90 bg-gray-900/90 px-4 py-3 text-center shadow-[0_20px_34px_-24px_rgba(0,0,0,0.7)]"
                >
                  <p className="text-2xl font-semibold leading-tight text-cobalt-300">{stat.value}</p>
                  <p className="text-xs md:text-sm text-gray-400 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="max-w-3xl mx-auto rounded-2xl border border-gray-800 bg-gray-900/90 p-6 md:p-7 shadow-[0_24px_44px_-30px_rgba(0,0,0,0.8)]">
              <CheckCircle2 className="w-8 h-8 text-cobalt-300 mb-3 mx-auto" strokeWidth={1.5} />
              <p className="text-gray-200 font-light leading-relaxed text-base md:text-lg text-center">
                {socialProof.description}
              </p>
            </div>
          </FadeIn>
        </Container>
      </section>

      <section className="py-20 md:py-24 bg-white border-t border-gray-200">
        <Container className="text-center">
          <TypingBlock
            lines={[cta.title, cta.description]}
            lineDelay={200}
            lineClassName={(i) =>
              i === 0
                ? 'text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-7 leading-tight font-light'
                : 'text-lg text-gray-600 font-light max-w-2xl mx-auto mb-9'
            }
            warpSpeed
          />
          <FadeIn delay={0.2}>
            <Button
              href="/contactus"
              size="lg"
              className="bg-gray-950 text-white hover:text-white shadow-premium hover:shadow-premium-lg"
              fillClassName="bg-cobalt-900"
            >
              <span className="inline-flex items-center gap-2">
                Get in Touch
                <ArrowRight className="w-5 h-5" />
              </span>
            </Button>
          </FadeIn>
        </Container>
      </section>
    </>
  )
}
