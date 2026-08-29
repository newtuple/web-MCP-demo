'use client'
/* eslint-disable @next/next/no-img-element */

import { useMemo, useState } from 'react'
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock3,
  Database,
  FlaskConical,
  Gauge,
  Layers3,
  Radio,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import Hero from '@/components/sections/Hero'
import DeploymentOptions from '@/components/sections/DeploymentOptions'
import Section from '@/components/ui/Section'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import FadeIn from '@/components/motion/FadeIn'
import StaggerChildren, { StaggerItem } from '@/components/motion/StaggerChildren'
import TypingBlock from '@/components/motion/TypingBlock'
import ToolCallAnimation from '@/components/motion/ToolCallAnimation'
import type { ToolCallItem } from '@/components/motion/ToolCallAnimation'
import { resolveIcon } from '@/lib/icons'

const SHOWCASE_IMAGES: Record<number, string> = {
  0: '/images/accelerators/gaugetuple/gauge_intro.png',
  1: '/images/accelerators/gaugetuple/Eval_results.png',
  2: '/images/accelerators/gaugetuple/Eval_Criteria.png',
  3: '/images/accelerators/gaugetuple/dataset_management.png',
}

const evalOpsTools: ToolCallItem[] = [
  { label: 'Selecting evaluation rubric', result: 'Domain rubric loaded' },
  { label: 'Scheduling nightly regression run', result: '07:00 UTC queued' },
  { label: 'Scoring latest model build', result: '94.8% quality pass' },
  { label: 'Detecting drift on golden set', result: '2 regressions flagged' },
]

interface GaugetupleData {
  title: string
  description: string
  hero: {
    badge: string
    title: string
    description: string
  }
  showcase: {
    title: string
    highlight?: string
    description: string
    visual: 'dashboard' | 'chat' | 'chart' | 'flow'
    visualLabel?: string
    features: { title: string; icon: string; description: string }[]
  }[]
  integrations: {
    sectionTitle: string
    sectionDescription: string
    frameworks: {
      title: string
      items: string[]
    }
    agentSupport: {
      title: string
      items: string[]
    }
  }
  showDeployment: boolean
  cta: {
    title: string
    description: string
  }
}

function getIntegrationIcon(value: string): LucideIcon {
  const text = value.toLowerCase()
  if (text.includes('schedule')) return Clock3
  if (text.includes('dataset')) return Database
  if (text.includes('judge') || text.includes('classif') || text.includes('eval')) return FlaskConical
  if (text.includes('agent') || text.includes('dialogtuple')) return Bot
  if (text.includes('job') || text.includes('flow')) return Layers3
  return ShieldCheck
}

function GaugetupleHeroVisual({ image }: { image?: string }) {
  return (
    <div className="relative mx-auto w-full max-w-[560px] px-1">
      <div className="pointer-events-none absolute inset-x-8 inset-y-8 rounded-full bg-[var(--accent-200)]/50 blur-3xl animate-pulse-subtle" />
      <div className="group relative min-h-[360px] sm:min-h-[400px] md:min-h-[430px] overflow-hidden rounded-3xl border border-[var(--accent-100)]/90 bg-white/85 p-4 sm:p-5 md:p-6 shadow-[0_32px_68px_-42px_rgba(0,71,171,0.5)] backdrop-blur-sm">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-[var(--accent-50)]/60 to-cyan-50/35" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-400)] to-transparent -translate-x-[110%] transition-transform duration-1000 group-hover:translate-x-0" />

        <div className="relative z-10 flex h-full flex-col">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--accent-100)] bg-white/90 px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--accent-800)]">
            <Gauge className="h-3.5 w-3.5" />
            Quality Control Layer
          </span>

          <div className="mt-4 rounded-2xl border border-[var(--accent-100)]/90 bg-white/95 px-3 py-3 sm:px-4 sm:py-3.5 shadow-[0_18px_36px_-30px_rgba(0,71,171,0.55)]">
            <p className="text-[12px] font-semibold text-gray-900 sm:text-[13px]">Continuous model quality checks</p>
            <p className="mt-1 text-[10px] leading-relaxed text-gray-600 sm:text-[11px]">
              Guided evals, golden datasets, and automated regressions in one flow.
            </p>
          </div>

          <div className="mt-3 h-[190px] sm:h-[205px] rounded-2xl border border-gray-200 bg-white/95 p-2 sm:p-3 overflow-hidden">
            {image ? (
              <img src={image} alt="Gaugetuple dashboard" className="h-full w-full object-contain" />
            ) : (
              <div className="h-full w-full rounded-xl bg-gradient-to-br from-[var(--accent-50)] via-white to-cyan-50" />
            )}
          </div>

          <div className="mt-auto pt-3 sm:pt-4 grid grid-cols-3 gap-2 sm:gap-2.5">
            {[
              { value: 'Auto', label: 'Regressions' },
              { value: 'Versioned', label: 'Datasets' },
              { value: 'Always On', label: 'Quality Gate' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-[var(--accent-100)]/90 bg-white/90 px-2 py-2 text-center shadow-[0_12px_24px_-20px_rgba(0,71,171,0.45)]"
              >
                <p className="text-sm font-semibold leading-tight text-[var(--accent-900)] sm:text-base md:text-lg">{stat.value}</p>
                <p className="text-[10px] font-medium leading-tight text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function GaugetupleContent({ data }: { data: GaugetupleData }) {
  const [activeCapability, setActiveCapability] = useState(0)

  const showcaseItems = useMemo(
    () =>
      data.showcase.map((item, index) => ({
        ...item,
        image: SHOWCASE_IMAGES[index],
        features: item.features.map((feature) => ({
          ...feature,
          icon: resolveIcon(feature.icon),
        })),
      })),
    [data.showcase],
  )

  const safeCapability = showcaseItems[Math.min(activeCapability, Math.max(showcaseItems.length - 1, 0))]

  return (
    <>
      <Hero
        badge={data.hero.badge}
        title={
          <>
            <span className="block text-gray-950 font-light">{data.hero.title}</span>
            <span className="mt-2 block text-[var(--accent-900)] font-semibold tracking-tight">Ship with measurable quality</span>
          </>
        }
        description={data.hero.description}
        compact
        fullScreen
        variant="split"
        gradient={false}
        visual={<GaugetupleHeroVisual image={showcaseItems[0]?.image} />}
        className="bg-white before:pointer-events-none before:absolute before:-top-32 before:left-[20%] before:h-72 before:w-72 before:rounded-full before:bg-[var(--accent-100)]/55 before:blur-3xl after:pointer-events-none after:absolute after:-bottom-28 after:right-[8%] after:h-64 after:w-64 after:rounded-full after:bg-cyan-100/55 after:blur-3xl"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <Button href="/contactus" size="lg" className="bg-gray-950 text-white hover:text-white" fillClassName="bg-[var(--accent-900)]">
            <span className="inline-flex items-center gap-2 whitespace-nowrap">
              Talk to our experts
              <ArrowRight className="h-4 w-4" />
            </span>
          </Button>
          <Button href="#evaluation-capabilities" variant="outline" size="lg" className="border-gray-300 text-gray-900 hover:text-white" fillClassName="bg-[var(--accent-900)]">
            Explore capabilities
          </Button>
        </div>
      </Hero>

      <Section id="evaluation-capabilities" className="py-14 md:py-16 bg-gray-50">
        <FadeIn>
          <div className="text-center mb-10 md:mb-12">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--accent-900)] font-semibold mb-2">
              Evaluation Capabilities
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Operationalize evaluation end to end
            </h2>
            <p className="text-lg text-gray-600 font-light max-w-3xl mx-auto">
              Review every part of the Gaugetuple workflow from integrated frameworks to dataset and agent quality management.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] gap-6 lg:gap-8">
          <FadeIn delay={0.05}>
            <div className="rounded-2xl border border-gray-200 bg-white p-3 lg:sticky lg:top-24 h-fit">
              <div className="space-y-2">
                {showcaseItems.map((item, index) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => setActiveCapability(index)}
                    className={`w-full rounded-xl border px-3 py-3 text-left transition-all duration-250 ${
                      activeCapability === index
                        ? 'border-[var(--accent-300)] bg-[var(--accent-50)]/45 shadow-[0_14px_26px_-20px_rgba(0,71,171,0.4)]'
                        : 'border-transparent bg-transparent hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--accent-800)] font-semibold mb-1">
                      {item.highlight || `Capability ${index + 1}`}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 leading-snug">{item.title}</p>
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>

          {safeCapability && (
            <FadeIn delay={0.1} direction="none" className="min-w-0">
              <article className="rounded-3xl border border-gray-200/90 bg-white shadow-[0_20px_40px_-28px_rgba(15,23,42,0.32)] overflow-hidden">
                <div className="h-[260px] md:h-[340px] lg:h-[410px] bg-gradient-to-br from-gray-50 to-[var(--accent-50)]/30 p-4 md:p-5 lg:p-6">
                  <div className="h-full w-full overflow-hidden rounded-2xl border border-gray-200/90 bg-white p-2 md:p-3">
                    {safeCapability.image ? (
                      <img
                        src={safeCapability.image}
                        alt={safeCapability.visualLabel || safeCapability.title}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-[var(--accent-50)] via-white to-cyan-50" />
                    )}
                  </div>
                </div>

                <div className="p-5 md:p-6 lg:p-7">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-100)] bg-[var(--accent-50)]/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--accent-900)]">
                      <Radio className="h-3.5 w-3.5" />
                      {safeCapability.highlight || 'Evaluation workflow'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      Active monitoring
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-tight mb-2.5">
                    {safeCapability.title}
                  </h3>
                  <p className="text-base text-gray-600 font-light leading-relaxed mb-5">
                    {safeCapability.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {safeCapability.features.map((feature, index) => {
                      const FeatureIcon = feature.icon
                      return (
                        <div
                          key={feature.title}
                          className="group relative overflow-hidden rounded-2xl border border-gray-200/90 bg-gray-50/70 p-4 md:p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent-300)] hover:bg-white"
                        >
                          <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-400)] to-transparent -translate-x-[110%] transition-transform duration-700 group-hover:translate-x-0" />
                          <div className="flex items-start gap-2.5 mb-2.5">
                            <div className="w-9 h-9 rounded-xl bg-[var(--accent-50)] border border-[var(--accent-100)] flex items-center justify-center flex-shrink-0">
                              <FeatureIcon className="h-[18px] w-[18px] text-[var(--accent-900)]" strokeWidth={1.5} />
                            </div>
                            <span className="text-[11px] font-semibold tracking-[0.12em] text-gray-400">
                              {(index + 1).toString().padStart(2, '0')}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-gray-900 leading-snug">{feature.title}</p>
                          <p className="text-sm text-gray-600 font-light leading-relaxed mt-1.5">{feature.description}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </article>
            </FadeIn>
          )}
        </div>
      </Section>

      <Section className="py-14 md:py-16 bg-white">
        <FadeIn>
          <div className="text-center mb-10 md:mb-12">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--accent-900)] font-semibold mb-2">
              Framework Stack
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {data.integrations.sectionTitle}
            </h2>
            <p className="text-lg text-gray-600 font-light max-w-3xl mx-auto">
              {data.integrations.sectionDescription}
            </p>
          </div>
        </FadeIn>

        <StaggerChildren className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
          {[
            { title: data.integrations.frameworks.title, items: data.integrations.frameworks.items },
            { title: data.integrations.agentSupport.title, items: data.integrations.agentSupport.items },
          ].map((group) => (
            <StaggerItem key={group.title}>
              <article className="group relative h-full overflow-hidden rounded-2xl border border-gray-200/90 bg-white p-5 md:p-6 shadow-[0_14px_28px_-22px_rgba(15,23,42,0.3)] transition-all duration-300 hover:border-[var(--accent-300)] hover:shadow-[0_24px_42px_-26px_rgba(0,71,171,0.38)]">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-400)] to-transparent -translate-x-[110%] transition-transform duration-700 group-hover:translate-x-0" />
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{group.title}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {group.items.map((item) => {
                    const ItemIcon = getIntegrationIcon(item)
                    return (
                      <div
                        key={item}
                        className="rounded-xl border border-gray-200 bg-gray-50/70 px-3 py-3 transition-colors duration-300 group-hover:border-[var(--accent-100)] group-hover:bg-white"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-lg border border-[var(--accent-100)] bg-[var(--accent-50)] flex items-center justify-center flex-shrink-0">
                            <ItemIcon className="h-4 w-4 text-[var(--accent-900)]" strokeWidth={1.5} />
                          </div>
                          <p className="text-sm font-medium text-gray-700 leading-snug">{item}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerChildren>

        <FadeIn delay={0.15}>
          <div className="mt-8 rounded-2xl border border-[var(--accent-100)] bg-[var(--accent-50)]/45 p-5 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
              <div className="h-10 w-10 rounded-xl border border-[var(--accent-200)] bg-white flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-[var(--accent-900)]" strokeWidth={1.8} />
              </div>
              <p className="text-sm md:text-base text-gray-700 font-light leading-relaxed">
                Gaugetuple keeps evaluation repeatable and audit-ready with dataset versioning, scheduled jobs, and traceable criteria across every release.
              </p>
            </div>
          </div>
        </FadeIn>
      </Section>

      <section className="min-h-[72vh] flex items-center py-20 md:py-24 bg-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-dark" />
        <div className="relative z-10 w-full">
          <div className="flex flex-col lg:flex-row items-stretch">
            <div className="flex-1 min-w-0 overflow-hidden">
              <Container>
                <div className="max-w-4xl mx-auto lg:mx-0">
                  <TypingBlock
                    lines={[
                      'Quality should block bad releases, not just report them.',
                      'Evaluate continuously. Ship confidently.',
                      'Gaugetuple combines framework coverage, custom criteria, and regression automation in one operational loop.',
                      'Your teams can move faster while keeping quality thresholds explicit and enforceable.',
                    ]}
                    lineDelay={200}
                    lineClassName={(i) => {
                      if (i === 0) return 'text-4xl md:text-5xl lg:text-6xl text-white mb-4 leading-tight font-bold'
                      if (i === 1) return 'text-2xl md:text-3xl text-gray-400 font-light mb-10 leading-snug'
                      return 'text-lg text-gray-400 font-light leading-relaxed mb-5'
                    }}
                    warpSpeed
                  />
                </div>
              </Container>
            </div>
            <div className="hidden lg:flex items-stretch flex-shrink-0">
              <div className="w-px self-stretch bg-gray-800" />
              <div className="pl-6 pr-8 w-[320px] py-8">
                <div className="rounded-2xl border border-gray-800/90 bg-gray-900/70 p-5 shadow-[0_20px_44px_-32px_rgba(0,0,0,0.75)]">
                  <ToolCallAnimation tools={evalOpsTools} title="Evaluation Ops" dark />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {data.showDeployment && <DeploymentOptions theme="dark" />}

      <section className="py-20 md:py-24 bg-white border-t border-gray-200">
        <Container className="text-center">
          <TypingBlock
            lines={[data.cta.title, data.cta.description]}
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
