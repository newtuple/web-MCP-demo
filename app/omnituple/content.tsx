'use client'

import { useMemo, useState } from 'react'
import {
  ArrowRight,
  Database,
  FileSpreadsheet,
  LineChart,
  Radio,
  Search,
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

interface OmnitupleData {
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
  dataSources: {
    sectionTitle: string
    sectionDescription: string
    items: string[]
  }
  showDeployment: boolean
  cta: {
    title: string
    description: string
  }
}

const insightTools: ToolCallItem[] = [
  { label: 'Parsing voice query intent', result: 'Intent confidence 98.6%' },
  { label: 'Routing to semantic retriever', result: 'Top 12 transcript matches' },
  { label: 'Composing dashboard tiles', result: '7 live widgets rendered' },
  { label: 'Generating narrative summary', result: 'Actionable insights ready' },
]

const QUERY_LINES = [
  '"Show unresolved call reasons from last 14 days"',
  '"Compare sentiment by team and shift"',
  '"Find churn risk mentions in enterprise calls"',
]

function getSourceIcon(source: string): LucideIcon {
  const value = source.toLowerCase()
  if (value.includes('excel') || value.includes('csv')) return FileSpreadsheet
  if (value.includes('snowflake') || value.includes('bigquery') || value.includes('redshift')) return LineChart
  return Database
}

function OmnitupleHeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[560px] px-1">
      <div className="pointer-events-none absolute inset-x-8 inset-y-8 rounded-full bg-[var(--accent-200)]/50 blur-3xl animate-pulse-subtle" />
      <div className="group relative min-h-[360px] sm:min-h-[400px] md:min-h-[430px] overflow-hidden rounded-3xl border border-[var(--accent-100)]/90 bg-white/85 p-4 sm:p-5 md:p-6 shadow-[0_32px_68px_-42px_rgba(0,71,171,0.5)] backdrop-blur-sm">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-[var(--accent-50)]/60 to-cyan-50/35" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-400)] to-transparent -translate-x-[110%] transition-transform duration-1000 group-hover:translate-x-0" />

        <div className="relative z-10 flex h-full flex-col">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--accent-100)] bg-white/90 px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--accent-800)]">
            <LineChart className="h-3.5 w-3.5" />
            Omnituple Insight Layer
          </span>

          <div className="mt-4 rounded-2xl border border-[var(--accent-100)]/90 bg-white/95 px-3 py-3 sm:px-4 sm:py-3.5 shadow-[0_18px_36px_-30px_rgba(0,71,171,0.55)]">
            <p className="text-[12px] font-semibold text-gray-900 sm:text-[13px]">Natural-language analytics console</p>
            <p className="mt-1 text-[10px] leading-relaxed text-gray-600 sm:text-[11px]">
              Ask in plain language and get live dashboards with narrative insights.
            </p>
          </div>

          <div className="mt-3 rounded-2xl border border-gray-200 bg-white/95 p-3 sm:p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--accent-900)]">Sample prompts</span>
              <span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Listening
              </span>
            </div>
            <div className="space-y-1.5">
              {QUERY_LINES.map((line) => (
                <p key={line} className="rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-1.5 text-[10px] text-gray-600 sm:text-[11px]">
                  {line}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-3 sm:pt-4 grid grid-cols-3 gap-2 sm:gap-2.5">
            {[
              { value: '<2s', label: 'Insight Time' },
              { value: 'Live', label: 'Dashboards' },
              { value: '24x7', label: 'Monitoring' },
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

export default function OmnitupleContent({ data }: { data: OmnitupleData }) {
  const [activeCapability, setActiveCapability] = useState(0)

  const showcaseItems = useMemo(
    () =>
      data.showcase.map((item) => ({
        ...item,
        features: item.features.map((feature) => ({
          ...feature,
          icon: resolveIcon(feature.icon),
        })),
      })),
    [data.showcase],
  )

  const safeCapability = showcaseItems[Math.min(activeCapability, Math.max(showcaseItems.length - 1, 0))]
  const capabilityTags = showcaseItems.map((item) => item.highlight || item.title)

  return (
    <>
      <Hero
        badge={data.hero.badge}
        title={
          <>
            <span className="block text-gray-950 font-light">{data.hero.title}</span>
            <span className="mt-2 block text-[var(--accent-900)] font-semibold tracking-tight">Analytics that talk back</span>
          </>
        }
        description={data.hero.description}
        compact
        fullScreen
        variant="split"
        gradient={false}
        visual={<OmnitupleHeroVisual />}
        className="bg-white before:pointer-events-none before:absolute before:-top-32 before:left-[20%] before:h-72 before:w-72 before:rounded-full before:bg-[var(--accent-100)]/55 before:blur-3xl after:pointer-events-none after:absolute after:-bottom-28 after:right-[8%] after:h-64 after:w-64 after:rounded-full after:bg-cyan-100/55 after:blur-3xl"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <Button href="/contactus" size="lg" className="bg-gray-950 text-white hover:text-white" fillClassName="bg-[var(--accent-900)]">
            <span className="inline-flex items-center gap-2 whitespace-nowrap">
              Talk to our experts
              <ArrowRight className="h-4 w-4" />
            </span>
          </Button>
          <Button href="#analytics-capabilities" variant="outline" size="lg" className="border-gray-300 text-gray-900 hover:text-white" fillClassName="bg-[var(--accent-900)]">
            Explore capabilities
          </Button>
        </div>
      </Hero>

      <Section id="analytics-capabilities" className="py-14 md:py-16 bg-gray-50">
        <FadeIn>
          <div className="text-center mb-10 md:mb-12">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--accent-900)] font-semibold mb-2">
              Analytics Capabilities
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Production analytics without complexity
            </h2>
            <p className="text-lg text-gray-600 font-light max-w-3xl mx-auto">
              Explore the workflows Omnituple supports from realtime insights to safe experimentation.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2.5">
              {capabilityTags.map((tag) => (
                <span key={tag} className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700">
                  {tag}
                </span>
              ))}
            </div>
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
                <div className="border-b border-gray-200 bg-gradient-to-r from-[var(--accent-50)]/50 via-white to-cyan-50/35 p-5 md:p-6">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-100)] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--accent-900)]">
                      <Radio className="h-3.5 w-3.5" />
                      {safeCapability.visualLabel || 'Omnituple capability'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      Live insights
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-tight mb-2.5">
                    {safeCapability.title}
                  </h3>
                  <p className="text-base text-gray-600 font-light leading-relaxed">
                    {safeCapability.description}
                  </p>
                </div>

                <div className="p-5 md:p-6 lg:p-7">
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
              Data Stack Connectivity
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {data.dataSources.sectionTitle}
            </h2>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
              {data.dataSources.sectionDescription}
            </p>
          </div>
        </FadeIn>

        <StaggerChildren className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {data.dataSources.items.map((source, index) => {
            const SourceIcon = getSourceIcon(source)
            return (
              <StaggerItem key={source}>
                <article className="group relative h-full min-h-[108px] overflow-hidden rounded-2xl border border-gray-200/90 border-t-2 border-t-[var(--accent-100)] bg-white px-3 py-4 md:px-4 md:py-5 text-center shadow-[0_14px_26px_-22px_rgba(15,23,42,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent-300)] hover:shadow-[0_24px_42px_-30px_rgba(0,71,171,0.4)]">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-400)] to-transparent -translate-x-[110%] transition-transform duration-700 group-hover:translate-x-0" />
                  <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--accent-100)] bg-[var(--accent-50)]">
                    <SourceIcon className="h-[18px] w-[18px] text-[var(--accent-900)]" strokeWidth={1.6} />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 leading-tight">{source}</p>
                  <p className="mt-1 text-[10px] font-medium tracking-[0.12em] text-gray-400">
                    {(index + 1).toString().padStart(2, '0')}
                  </p>
                </article>
              </StaggerItem>
            )
          })}
        </StaggerChildren>
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
                      'Your analytics should answer before meetings start.',
                      'Voice in. Decisions out.',
                      'Omnituple combines transcript intelligence, search, and live dashboards in a single operating layer.',
                      'Teams can explore confidently with guardrails, experiments, and rollback-ready workflows.',
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
                  <ToolCallAnimation tools={insightTools} title="Insight Engine" dark />
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
