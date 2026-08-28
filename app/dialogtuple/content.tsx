'use client'
/* eslint-disable @next/next/no-img-element */

import { useState } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'
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
  0: '/images/accelerators/dialogtuple/workflowbuilder.gif',
  1: '/images/accelerators/dialogtuple/testing.gif',
}

const DIALOGTUPLE_LOGOS = {
  dark: '/images/logos/dialogtuple/dark.png',
  darkIcon: '/images/logos/dialogtuple/dark_icon.png',
  light: '/images/logos/dialogtuple/light.png',
  lightIcon: '/images/logos/dialogtuple/light_icon.png',
}

const platformOpsTools: ToolCallItem[] = [
  { label: 'Selecting LLM for intent route', result: 'Claude Sonnet assigned' },
  { label: 'Connecting MCP toolchain', result: '7 tools attached' },
  { label: 'Tracing multi-agent handoff', result: 'Latency stable at 340ms' },
  { label: 'Publishing to channels', result: 'Slack + Teams live' },
]

interface DialogtupleData {
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
  deployment: {
    sectionTitle: string
    sectionDescription: string
    items: { title: string; icon: string; description: string }[]
  }
  cta: {
    title: string
    description: string
  }
}

export default function DialogtupleContent({ data }: { data: DialogtupleData }) {
  const showcaseItems = data.showcase.map((item, i) => ({
    ...item,
    image: SHOWCASE_IMAGES[i],
    features: item.features.map((f) => ({
      ...f,
      icon: resolveIcon(f.icon),
    })),
  }))

  const deploymentItems = data.deployment.items.map((item) => ({
    ...item,
    icon: resolveIcon(item.icon),
  }))

  const [activeCapability, setActiveCapability] = useState(0)
  const capabilityPills = showcaseItems
    .slice(0, 3)
    .map((item) => item.highlight || item.title)
  const safeActiveCapability = showcaseItems.length === 0
    ? null
    : showcaseItems[Math.min(activeCapability, showcaseItems.length - 1)]

  return (
    <>
      <section className="relative overflow-hidden min-h-screen bg-white">
        <Container className="relative z-10 pt-28 pb-16 md:pt-36 md:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-12 items-center">
            <div>
              <FadeIn>
                <div className="mb-6">
                  <img
                    src={DIALOGTUPLE_LOGOS.dark}
                    alt="Dialogtuple logo"
                    className="h-14 w-auto md:h-16 object-contain"
                  />
                </div>
              </FadeIn>
              <FadeIn>
                <span className="inline-flex items-center gap-2 rounded-full border border-cobalt-200 bg-cobalt-50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-cobalt-900 mb-7">
                  <Sparkles className="w-3.5 h-3.5" />
                  {data.hero.badge}
                </span>
              </FadeIn>
              <FadeIn delay={0.1}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-tight text-gray-950 mb-7 font-light">
                  100+ LLMs.
                  <br />
                  <span className="font-semibold text-cobalt-900">Native agents.</span>
                  <br />
                  One platform.
                </h1>
              </FadeIn>
              <FadeIn delay={0.2}>
                <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed max-w-2xl mb-10">
                  {data.hero.description}
                </p>
              </FadeIn>
              <FadeIn delay={0.3}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button href="/contactus" size="lg" className="bg-cobalt-900 hover:text-white" fillClassName="bg-cobalt-800">
                    <span className="inline-flex items-center gap-2">
                      Request a demo
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Button>
                  <Button href="#platform-capabilities" variant="outline" size="lg" className="border-gray-300 text-gray-900 hover:text-white" fillClassName="bg-cobalt-900">
                    Explore capabilities
                  </Button>
                </div>
              </FadeIn>
              <FadeIn delay={0.35}>
                <div className="mt-8 flex flex-wrap gap-2.5">
                  {capabilityPills.map((pill) => (
                    <span
                      key={pill}
                      className="inline-flex rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700"
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </FadeIn>
            </div>

            <FadeIn direction="right" delay={0.15}>
              <div className="relative rounded-3xl border border-gray-200 bg-white p-4 sm:p-5 shadow-[0_30px_60px_-42px_rgba(15,23,42,0.35)]">
                <div className="absolute inset-x-5 top-0 h-[2px] bg-gradient-to-r from-transparent via-cobalt-400/60 to-transparent" />
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-cobalt-900">
                    <span className="inline-flex items-center justify-center rounded-md border border-cobalt-200 bg-white p-1 shadow-[0_8px_16px_-12px_rgba(0,71,171,0.45)]">
                      <img
                        src={DIALOGTUPLE_LOGOS.darkIcon}
                        alt="Dialogtuple icon"
                        className="h-4 w-4 object-contain"
                      />
                    </span>
                    Dialogtuple Live Console
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-600">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    System healthy
                  </span>
                </div>
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 h-[300px] sm:h-[360px] p-2 md:p-3">
                  {showcaseItems[0]?.image ? (
                    <img
                      src={showcaseItems[0].image}
                      alt={showcaseItems[0].visualLabel || showcaseItems[0].title}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-50" />
                  )}
                </div>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      <section id="platform-capabilities" className="py-16 md:py-20 bg-white">
        <Container>
          <FadeIn>
            <div className="text-center mb-10 md:mb-12">
              <p className="text-[11px] uppercase tracking-[0.16em] text-cobalt-900 font-semibold mb-2">
                Platform Capabilities
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What makes Dialogtuple production-ready
              </h2>
              <p className="text-lg text-gray-600 font-light max-w-3xl mx-auto">
                Each capability has dedicated space below. Switch between them to review screenshots and implementation details clearly.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] gap-6 lg:gap-8">
            <FadeIn delay={0.05}>
              <div className="rounded-2xl border border-gray-200 bg-gray-50/80 p-3 lg:sticky lg:top-24 h-fit">
                <div className="space-y-2">
                  {showcaseItems.map((item, index) => (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => setActiveCapability(index)}
                      className={`w-full rounded-xl border px-3 py-3 text-left transition-all duration-250 ${
                        activeCapability === index
                          ? 'border-cobalt-300 bg-white shadow-[0_14px_26px_-20px_rgba(0,71,171,0.4)]'
                          : 'border-transparent bg-transparent hover:border-gray-200 hover:bg-white'
                      }`}
                    >
                      <p className="text-[11px] uppercase tracking-[0.14em] text-cobalt-800 font-semibold mb-1">
                        {item.highlight || `Capability ${index + 1}`}
                      </p>
                      <p className="text-sm font-semibold text-gray-900 leading-snug">{item.title}</p>
                    </button>
                  ))}
                </div>
              </div>
            </FadeIn>

            {safeActiveCapability && (
              <FadeIn delay={0.1} direction="none" className="min-w-0">
                <article key={safeActiveCapability.title} className="animate-fade-in rounded-3xl border border-gray-200/90 bg-white shadow-[0_20px_40px_-28px_rgba(15,23,42,0.32)] overflow-hidden">
                  <div className="h-[280px] md:h-[360px] lg:h-[430px] bg-gradient-to-br from-gray-50 to-cobalt-50/30 p-4 md:p-5 lg:p-6">
                    <div className="h-full w-full overflow-hidden rounded-2xl border border-gray-200/90 bg-gray-50 p-2 md:p-3">
                      {safeActiveCapability.image ? (
                        <img
                          src={safeActiveCapability.image}
                          alt={safeActiveCapability.visualLabel || safeActiveCapability.title}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-cobalt-50 via-white to-cyan-50" />
                      )}
                    </div>
                  </div>

                  <div className="p-6 md:p-7 lg:p-8">
                    {safeActiveCapability.highlight && (
                      <span className="inline-flex w-fit items-center rounded-full border border-cobalt-100 bg-cobalt-50/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-cobalt-900 mb-4">
                        {safeActiveCapability.highlight}
                      </span>
                    )}
                    <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-tight mb-3">
                      {safeActiveCapability.title}
                    </h3>
                    <p className="text-base text-gray-600 font-light leading-relaxed mb-6">
                      {safeActiveCapability.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      {safeActiveCapability.features.map((feature) => {
                        const FeatureIcon = feature.icon
                        return (
                          <div
                            key={feature.title}
                            className="rounded-xl border border-gray-200/90 bg-gray-50/70 p-4"
                          >
                            <div className="flex items-start gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-cobalt-50 border border-cobalt-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <FeatureIcon className="w-4 h-4 text-cobalt-900" strokeWidth={1.5} />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{feature.title}</p>
                                <p className="text-sm text-gray-600 font-light leading-relaxed mt-1">
                                  {feature.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </article>
              </FadeIn>
            )}
          </div>
        </Container>
      </section>

      <section className="min-h-[76vh] flex items-center py-24 md:py-28 bg-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-dark" />
        <div className="relative z-10 w-full">
          <div className="flex flex-col lg:flex-row items-stretch">
            <div className="flex-1 min-w-0 overflow-hidden">
              <Container>
                <div className="max-w-4xl mx-auto lg:mx-0">
                  <FadeIn delay={0.05}>
                    <span className="mb-8 inline-flex items-center rounded-xl border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
                      <img
                        src={DIALOGTUPLE_LOGOS.light}
                        alt="Dialogtuple logo"
                        className="h-10 w-auto object-contain md:h-11"
                      />
                    </span>
                  </FadeIn>
                  <TypingBlock
                    lines={[
                      'Orchestration should not be your bottleneck.',
                      'Build once. Operate everywhere.',
                      'Dialogtuple keeps model routing, tools, channels, and observability in one reliable control plane.',
                      'Your team focuses on outcomes while the platform handles production complexity.',
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
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gray-700 bg-black/40 px-3 py-1.5">
                    <img
                      src={DIALOGTUPLE_LOGOS.lightIcon}
                      alt="Dialogtuple icon"
                      className="h-4 w-4 object-contain"
                    />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-300">
                      Dialogtuple
                    </span>
                  </div>
                  <ToolCallAnimation tools={platformOpsTools} title="Platform Ops" dark />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section className="py-14 md:py-16">
        <FadeIn>
          <div className="text-center mb-10 md:mb-12">
            <p className="text-[11px] uppercase tracking-[0.16em] text-cobalt-900 font-semibold mb-2">
              Deployment Flexibility
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {data.deployment.sectionTitle}
            </h2>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
              {data.deployment.sectionDescription}
            </p>
          </div>
        </FadeIn>

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {deploymentItems.map((item, index) => (
            <StaggerItem key={item.title}>
              <article className="group relative h-full min-h-[250px] overflow-hidden rounded-2xl border border-gray-200/90 bg-white p-5 md:p-6 shadow-[0_14px_28px_-22px_rgba(15,23,42,0.32)] transition-all duration-300 hover:-translate-y-1 hover:border-cobalt-300 hover:shadow-[0_24px_42px_-26px_rgba(0,71,171,0.4)]">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cobalt-400 to-transparent -translate-x-[110%] transition-transform duration-700 group-hover:translate-x-0" />
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cobalt-100 bg-cobalt-50 transition-colors duration-300 group-hover:bg-cobalt-100">
                    <item.icon className="h-6 w-6 text-cobalt-900" strokeWidth={1.5} />
                  </div>
                  <span className="text-[11px] font-semibold tracking-[0.14em] text-gray-400">
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 leading-tight mb-2.5">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">
                  {item.description}
                </p>
              </article>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </Section>

      <section className="py-14 md:py-16 bg-gradient-to-b from-white via-cobalt-50/25 to-white">
        <Container>
          <FadeIn>
            <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-8 rounded-3xl border border-cobalt-100 bg-white/95 p-6 md:p-8 shadow-[0_24px_44px_-30px_rgba(0,71,171,0.35)]">
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-cobalt-50 flex items-center justify-center">
                <img
                  src={DIALOGTUPLE_LOGOS.darkIcon}
                  alt="Dialogtuple icon"
                  className="w-7 h-7 object-contain"
                />
              </div>
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  Need us to build your AI agents too?
                </h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  Dialogtuple is one of the core platforms we use to design, build, and operate enterprise AI agents. From architecture to production rollout, we can run the full delivery for your team.
                </p>
              </div>
              <Button href="/newtuple-agents" variant="outline" size="md" className="flex-shrink-0">
                <span className="inline-flex items-center gap-2">
                  Build AI Agents
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Button>
            </div>
          </FadeIn>
        </Container>
      </section>

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
