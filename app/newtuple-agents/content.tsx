'use client'
/* eslint-disable @next/next/no-img-element */

import { ArrowRight, CheckCircle2 } from 'lucide-react'
import Hero from '@/components/sections/Hero'
import DeploymentOptions from '@/components/sections/DeploymentOptions'
import Section from '@/components/ui/Section'
import Container from '@/components/ui/Container'
import FadeIn from '@/components/motion/FadeIn'
import StaggerChildren, { StaggerItem } from '@/components/motion/StaggerChildren'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import TypingBlock from '@/components/motion/TypingBlock'
import ToolCallAnimation from '@/components/motion/ToolCallAnimation'
import type { ToolCallItem } from '@/components/motion/ToolCallAnimation'
import { resolveIcon } from '@/lib/icons'

const provocativeTools: ToolCallItem[] = [
  { label: 'Mapping enterprise workflows', result: '47 automations identified' },
  { label: 'Provisioning agent fleet', result: '6 agents initialized' },
  { label: 'Configuring RBAC policies', result: 'Role-based access active' },
  { label: 'Deploying to production', result: 'Fleet live on Dialogtuple' },
  { label: 'Measuring business impact', result: '8.3x ROI confirmed' },
]

const DIALOGTUPLE_DARK_ICON = '/images/logos/dialogtuple/dark_icon.png'

interface NewtupleAgentsData {
  title: string
  description: string
  hero: {
    badge: string
    title: string
    description: string
  }
  stats: { value: string; label: string }[]
  platforms: {
    title: string
    items: { name: string; logo: string; focus?: string }[]
  }
  differentiators: {
    sectionTitle: string
    sectionDescription: string
    items: {
      icon: string
      title: string
      description: string
    }[]
  }
  agentTypes: {
    sectionTitle: string
    sectionDescription: string
    items: {
      image: string
      title: string
      description: string
    }[]
  }
  provocative: {
    title: string
    subtitle: string
    paragraphs: string[]
  }
  poweredBy: {
    sectionTitle: string
    sectionDescription: string
    items: {
      title: string
      icon: string
      href: string
      description: string
      highlights: string[]
    }[]
  }
  whyUs: {
    sectionTitle: string
    sectionDescription: string
    items: { title: string; icon: string; description: string }[]
  }
  showDeployment: boolean
  cta: {
    title: string
    description: string
  }
}

function AgentsHeroVisual({ stats }: { stats: { value: string; label: string }[] }) {
  const statItems = stats.slice(0, 3)

  return (
    <div className="relative mx-auto w-full max-w-[560px] px-1">
      <div className="pointer-events-none absolute inset-x-8 inset-y-8 rounded-full bg-[var(--accent-200)]/50 blur-3xl animate-pulse-subtle" />
      <div className="group relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden rounded-3xl border border-[var(--accent-100)]/90 bg-white/80 p-4 sm:p-5 md:p-6 shadow-[0_32px_68px_-42px_rgba(0,71,171,0.55)] backdrop-blur-sm">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-[var(--accent-50)]/60 to-cyan-50/40" />
        <div className="pointer-events-none absolute left-1/2 top-[43%] h-44 w-44 sm:h-52 sm:w-52 md:h-56 md:w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--accent-200)]/80" />
        <div className="pointer-events-none absolute left-1/2 top-[43%] h-32 w-32 sm:h-40 sm:w-40 md:h-44 md:w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[var(--accent-300)]/80 animate-[spin_18s_linear_infinite]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-400)] to-transparent -translate-x-[110%] transition-transform duration-1000 group-hover:translate-x-0" />

        <div className="relative z-10 flex h-full flex-col">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--accent-100)] bg-white/90 px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--accent-800)]">
            Agent Command Layer
          </span>

          <div className="absolute left-1/2 top-[39%] sm:top-[41%] w-[82%] sm:w-[76%] md:w-[72%] max-w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[var(--accent-100)]/90 bg-white/95 px-3 py-2.5 sm:px-4 sm:py-3 shadow-[0_20px_42px_-30px_rgba(0,71,171,0.55)]">
            <div className="mb-1.5 flex items-center justify-between">
              <p className="text-[12px] sm:text-[13px] font-semibold text-gray-900">Enterprise Agent Fleet</p>
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-cyan-500 animate-pulse" />
            </div>
            <p className="text-[10px] sm:text-[11px] leading-relaxed text-gray-600">Monitoring workflows, routing tasks, and enforcing guardrails in real time.</p>
          </div>

          <div className="absolute left-[6%] top-[23%] hidden lg:block rounded-xl border border-[var(--accent-100)] bg-white/90 px-3 py-2 text-[11px] font-medium text-gray-700 shadow-[0_10px_24px_-18px_rgba(0,71,171,0.55)] animate-float">
            Intake Agent
          </div>
          <div className="absolute right-[5%] top-[22%] hidden lg:block rounded-xl border border-[var(--accent-100)] bg-white/90 px-3 py-2 text-[11px] font-medium text-gray-700 shadow-[0_10px_24px_-18px_rgba(0,71,171,0.55)] animate-float-delayed">
            Compliance Agent
          </div>
          <div className="absolute right-[13%] top-[58%] hidden xl:block rounded-xl border border-[var(--accent-100)] bg-white/90 px-3 py-2 text-[11px] font-medium text-gray-700 shadow-[0_10px_24px_-18px_rgba(0,71,171,0.55)] animate-float-slow">
            Insights Agent
          </div>

          <div className="mt-auto grid grid-cols-3 gap-2 sm:gap-2.5">
            {statItems.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-[var(--accent-100)]/90 bg-white/90 px-2 py-2 text-center shadow-[0_12px_24px_-20px_rgba(0,71,171,0.45)]"
              >
                <p className="text-sm sm:text-base md:text-lg font-semibold leading-tight text-[var(--accent-900)]">{stat.value}</p>
                <p className="text-[10px] font-medium leading-tight text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function NewtupleAgentsContent({ data }: { data: NewtupleAgentsData }) {
  const { hero, stats, platforms, differentiators, agentTypes, poweredBy, whyUs, cta } = data

  const differentiatorFeatures = differentiators.items.map((item: any) => ({
    ...item,
    icon: resolveIcon(item.icon),
  }))

  const whyUsFeatures = whyUs.items.map((item: any) => ({
    ...item,
    icon: resolveIcon(item.icon),
  }))

  return (
    <>
      <Hero
        badge={hero.badge}
        title={
          <>
            <span className="block text-gray-950 font-light">We design, build, and operate</span>
            <span className="mt-2 block text-[var(--accent-900)] font-semibold tracking-tight">
              enterprise AI agents
            </span>
          </>
        }
        description={hero.description}
        compact
        fullScreen
        variant="split"
        visual={<AgentsHeroVisual stats={stats} />}
        className="before:pointer-events-none before:absolute before:-top-32 before:left-[20%] before:h-72 before:w-72 before:rounded-full before:bg-[var(--accent-100)]/60 before:blur-3xl after:pointer-events-none after:absolute after:-bottom-28 after:right-[8%] after:h-64 after:w-64 after:rounded-full after:bg-cyan-100/60 after:blur-3xl"
      />

      <Section>
        <FadeIn>
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--accent-900)] font-semibold mb-2">
              Platform Ecosystem
            </p>
            <h2 className="mb-4 text-2xl md:text-3xl font-semibold tracking-tight text-gray-950">
              {platforms.title}
            </h2>
            <p className="text-sm text-gray-600 font-light mb-8 max-w-2xl mx-auto">
              We build where your teams already work, from enterprise copilots to production-grade agent orchestration.
            </p>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-2 px-2 py-2 md:mx-0 md:px-0 md:py-0 md:overflow-visible md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-5">
              {platforms.items.map((platform) => (
                <article
                  key={platform.name}
                  className="min-w-[84%] sm:min-w-[62%] md:min-w-0 snap-start group relative overflow-hidden rounded-2xl border border-gray-200/90 bg-white px-5 py-5 md:px-6 md:py-6 text-left shadow-[0_14px_26px_-20px_rgba(15,23,42,0.25)] transition-all duration-300 md:hover:-translate-y-1 hover:border-[var(--accent-300)] hover:shadow-[0_24px_42px_-26px_rgba(0,71,171,0.45)]"
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-400)] to-transparent -translate-x-[110%] transition-transform duration-700 group-hover:translate-x-0" />
                  <div className="h-10 md:h-12 mb-4 flex items-center">
                    <img
                      src={platform.logo}
                      alt={platform.name}
                      className="h-full w-auto object-contain opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  </div>
                  <h3 className="text-sm md:text-base font-semibold text-gray-900 leading-tight mb-1.5">
                    {platform.name}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    {platform.focus || 'Enterprise-ready AI platform integration'}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </FadeIn>
      </Section>

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
                      fillClassName="bg-[var(--accent-900)]/90"
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
                  <ToolCallAnimation tools={provocativeTools} title="Intelligence" dark />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agent Types */}
      <Section className="bg-gray-50 py-14 md:py-16">
        <FadeIn>
          <div className="text-center mb-10 md:mb-12">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--accent-900)] font-semibold mb-2">
              Agent Portfolio
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {agentTypes.sectionTitle}
            </h2>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
              {agentTypes.sectionDescription}
            </p>
          </div>
        </FadeIn>
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-2 px-2 py-2 md:mx-0 md:px-0 md:py-0 md:overflow-visible md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {agentTypes.items.map((item) => (
            <Card
              key={item.title}
              className="min-w-[86%] sm:min-w-[70%] md:min-w-0 snap-start group relative overflow-hidden p-0 h-[300px] md:h-[318px] flex flex-col border border-gray-200/90 transition-all duration-300 hover:border-[var(--accent-300)] hover:shadow-[0_24px_42px_-28px_rgba(0,71,171,0.42)]"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-400)] to-transparent -translate-x-[110%] transition-transform duration-700 group-hover:translate-x-0" />
              <div className="h-[73%] md:h-[74%] w-full overflow-hidden transition-[height] duration-500 ease-out md:group-hover:h-[56%]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-contain transition-transform duration-700 ease-out md:group-hover:scale-[1.02]"
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
          ))}
        </div>
      </Section>

      {/* Key Differentiators */}
      <Section>
        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--accent-900)] font-semibold mb-2">
              Strategic Advantage
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {differentiators.sectionTitle}
            </h2>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
              {differentiators.sectionDescription}
            </p>
          </div>
        </FadeIn>
        <StaggerChildren className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-2 px-2 py-2 md:mx-0 md:px-0 md:py-0 md:overflow-visible md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6">
          {differentiatorFeatures.map((feature, index) => (
            <StaggerItem key={feature.title} className="min-w-[84%] sm:min-w-[62%] md:min-w-0 snap-start">
              <article className="group relative h-full min-h-[250px] overflow-hidden rounded-2xl border border-gray-200/90 bg-white p-5 md:p-6 shadow-[0_14px_28px_-22px_rgba(15,23,42,0.32)] transition-all duration-300 md:hover:-translate-y-1 hover:border-[var(--accent-300)] hover:shadow-[0_24px_42px_-26px_rgba(0,71,171,0.4)]">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-400)] to-transparent -translate-x-[110%] transition-transform duration-700 group-hover:translate-x-0" />
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--accent-100)] bg-[var(--accent-50)] transition-colors duration-300 group-hover:bg-[var(--accent-100)]">
                    <feature.icon className="h-6 w-6 text-[var(--accent-900)]" strokeWidth={1.5} />
                  </div>
                  <span className="text-[11px] font-semibold tracking-[0.14em] text-gray-400">
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 leading-tight mb-2.5">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">
                  {feature.description}
                </p>
              </article>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </Section>

      {/* Powered by Our Accelerators */}
      <Section className="bg-gray-50">
        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--accent-900)] font-semibold mb-2">
              Built on Products
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {poweredBy.sectionTitle}
            </h2>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
              {poweredBy.sectionDescription}
            </p>
          </div>
        </FadeIn>
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 md:gap-6 lg:gap-7 items-stretch">
          {poweredBy.items.map((item, i) => {
            const Icon = resolveIcon(item.icon)
            const isDialogtuple = item.title.toLowerCase() === 'dialogtuple'
            const bgClass = [
              'from-[var(--accent-50)]/80 via-white to-cyan-50/70',
              'from-cyan-50/80 via-white to-[var(--accent-50)]/70',
              'from-slate-50 via-white to-[var(--accent-50)]/60',
              'from-[var(--accent-50)]/70 via-white to-slate-50',
            ][i % 4]

            return (
              <StaggerItem key={item.title}>
                <a href={item.href} className="group block h-full">
                  <article className="relative h-full overflow-hidden rounded-3xl border border-gray-200/90 bg-white shadow-[0_16px_34px_-24px_rgba(15,23,42,0.35)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[var(--accent-300)] hover:shadow-[0_28px_52px_-26px_rgba(0,71,171,0.4)]">
                    <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${bgClass} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-400)] to-transparent -translate-x-[110%] transition-transform duration-700 group-hover:translate-x-0" />

                    <div className="relative z-10 h-full p-6 md:p-7 flex flex-col">
                      <div className="shrink-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="w-12 h-12 rounded-xl bg-[var(--accent-50)] flex items-center justify-center transition-all duration-300 group-hover:bg-white group-hover:shadow-[0_14px_26px_-18px_rgba(0,71,171,0.45)]">
                            {isDialogtuple ? (
                              <span className="inline-flex items-center justify-center rounded-md bg-white p-1 shadow-[0_10px_16px_-12px_rgba(0,71,171,0.4)]">
                                <img
                                  src={DIALOGTUPLE_DARK_ICON}
                                  alt="Dialogtuple icon"
                                  className="h-5 w-5 object-contain"
                                />
                              </span>
                            ) : (
                              <Icon className="w-6 h-6 text-[var(--accent-900)] transition-colors duration-300 group-hover:text-cyan-600" strokeWidth={1.5} />
                            )}
                          </div>
                          <span className="inline-flex items-center rounded-full border border-[var(--accent-100)] bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--accent-800)]">
                            Accelerator
                          </span>
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mt-5 leading-tight">
                          {item.title}
                        </h3>
                      </div>

                      <div className="flex-1 min-h-0 mt-3">
                        <p className="text-gray-600 font-light leading-relaxed mb-5">
                          {item.description}
                        </p>
                        <ul className="space-y-2.5">
                          {item.highlights.map((h) => (
                            <li key={h} className="flex items-start gap-2.5 text-sm text-gray-700">
                              <CheckCircle2 className="w-4 h-4 text-[var(--accent-900)] mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="shrink-0 pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-sm font-medium text-[var(--accent-900)]">Explore Product</span>
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--accent-900)] text-white transition-transform duration-300 group-hover:translate-x-1">
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </article>
                </a>
              </StaggerItem>
            )
          })}
        </StaggerChildren>
      </Section>

      {/* Why Newtuple */}
      <Section className="bg-gradient-to-b from-white via-[var(--accent-50)]/25 to-white">
        <FadeIn>
          <div className="text-center mb-10 md:mb-12">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--accent-900)] font-semibold mb-2">
              Why Teams Choose Us
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {whyUs.sectionTitle}
            </h2>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
              {whyUs.sectionDescription}
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.05}>
          <div className="mb-8 md:mb-10 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            {stats.slice(0, 3).map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-[var(--accent-100)]/90 bg-white/90 px-4 py-3 text-center shadow-[0_14px_28px_-24px_rgba(0,71,171,0.35)]"
              >
                <p className="text-2xl font-semibold leading-tight text-[var(--accent-900)]">{stat.value}</p>
                <p className="text-xs md:text-sm text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </FadeIn>

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {whyUsFeatures.map((feature, index) => (
            <StaggerItem key={feature.title}>
              <article className="group relative h-full min-h-[250px] overflow-hidden rounded-2xl border border-gray-200/90 bg-white p-5 md:p-6 shadow-[0_14px_28px_-22px_rgba(15,23,42,0.32)] transition-all duration-300 md:hover:-translate-y-1 hover:border-[var(--accent-300)] hover:shadow-[0_24px_42px_-26px_rgba(0,71,171,0.4)]">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-400)] to-transparent -translate-x-[110%] transition-transform duration-700 group-hover:translate-x-0" />
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--accent-100)] bg-[var(--accent-50)] transition-colors duration-300 group-hover:bg-[var(--accent-100)]">
                    <feature.icon className="h-6 w-6 text-[var(--accent-900)]" strokeWidth={1.5} />
                  </div>
                  <span className="text-[11px] font-semibold tracking-[0.14em] text-gray-400">
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 leading-tight mb-2.5">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">
                  {feature.description}
                </p>
              </article>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </Section>

      {data.showDeployment && <DeploymentOptions theme="dark" />}

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
              fillClassName="bg-[var(--accent-900)]"
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
