'use client'

import { useMemo, useState } from 'react'
import { ArrowRight, CheckCircle2, Mic, Radio, Sparkles, Waves } from 'lucide-react'
import Hero from '@/components/sections/Hero'
import DeploymentOptions from '@/components/sections/DeploymentOptions'
import Section from '@/components/ui/Section'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import FadeIn from '@/components/motion/FadeIn'
import StaggerChildren, { StaggerItem } from '@/components/motion/StaggerChildren'
import TypingBlock from '@/components/motion/TypingBlock'
import { resolveIcon } from '@/lib/icons'

interface UttertupleData {
  title: string
  description: string
  hero: {
    badge: string
    title: string
    description: string
    highlight: string
  }
  showcase: {
    title: string
    highlight?: string
    description: string
    visual: 'dashboard' | 'chat' | 'chart' | 'flow'
    visualLabel?: string
    features: { title: string; icon: string; description: string }[]
  }[]
  providers: {
    sectionTitle: string
    sectionDescription: string
    cloudProviders: {
      title: string
      items: string[]
    }
    startups: {
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

const SIGNAL_FEED = [
  'Input stream stabilized',
  'Realtime route selected',
  'Barge-in protection active',
  'Voice memory context attached',
  'Quality scoring online',
]

function VoiceHeroVisual({ highlight }: { highlight: string }) {
  return (
    <div className="relative mx-auto w-full max-w-[560px] px-1">
      <div className="pointer-events-none absolute inset-x-8 inset-y-8 rounded-full bg-cobalt-200/50 blur-3xl animate-pulse-subtle" />
      <div className="group relative min-h-[360px] sm:min-h-[400px] md:min-h-[430px] overflow-hidden rounded-3xl border border-cobalt-100/90 bg-white/85 p-4 sm:p-5 md:p-6 shadow-[0_32px_68px_-42px_rgba(0,71,171,0.5)] backdrop-blur-sm">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-cobalt-50/60 to-cyan-50/35" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cobalt-400 to-transparent -translate-x-[110%] transition-transform duration-1000 group-hover:translate-x-0" />

        <div className="relative z-10 flex h-full flex-col">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-cobalt-100 bg-white/90 px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.12em] text-cobalt-800">
            <Waves className="h-3.5 w-3.5" />
            Voice Command Layer
          </span>

          <div className="mt-4 rounded-2xl border border-cobalt-100/90 bg-white/95 px-3 py-3 sm:px-4 sm:py-3.5 shadow-[0_18px_36px_-30px_rgba(0,71,171,0.55)]">
            <p className="text-[12px] font-semibold text-gray-900 sm:text-[13px]">Live Voice Session</p>
            <p className="mt-1 text-[10px] leading-relaxed text-gray-600 sm:text-[11px]">{highlight}</p>
          </div>

          <div className="mt-3 rounded-2xl border border-gray-200 bg-white/95 p-3 sm:p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-cobalt-900">Signal activity</span>
              <span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            </div>
            <div className="space-y-1.5">
              {SIGNAL_FEED.slice(0, 3).map((item) => (
                <p key={item} className="rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-1.5 text-[10px] text-gray-600 sm:text-[11px]">
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-3 sm:pt-4 grid grid-cols-3 gap-2 sm:gap-2.5">
            {[
              { value: '<300ms', label: 'Latency' },
              { value: '99.95%', label: 'Uptime' },
              { value: '24x7', label: 'Ops Ready' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-cobalt-100/90 bg-white/90 px-2 py-2 text-center shadow-[0_12px_24px_-20px_rgba(0,71,171,0.45)]"
              >
                <p className="text-sm font-semibold leading-tight text-cobalt-900 sm:text-base md:text-lg">{stat.value}</p>
                <p className="text-[10px] font-medium leading-tight text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function UttertupleContent({ data }: { data: UttertupleData }) {
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

  return (
    <>
      <Hero
        badge={data.hero.badge}
        title={
          <>
            <span className="block text-gray-950 font-light">{data.hero.title}</span>
            <span className="mt-2 block text-cobalt-900 font-semibold tracking-tight">Production voice AI, simplified</span>
          </>
        }
        description={data.hero.description}
        compact
        fullScreen
        variant="split"
        gradient={false}
        visual={<VoiceHeroVisual highlight={data.hero.highlight} />}
        className="bg-white before:pointer-events-none before:absolute before:-top-32 before:left-[20%] before:h-72 before:w-72 before:rounded-full before:bg-cobalt-100/55 before:blur-3xl after:pointer-events-none after:absolute after:-bottom-28 after:right-[8%] after:h-64 after:w-64 after:rounded-full after:bg-cyan-100/55 after:blur-3xl"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <Button href="/contactus" size="lg" className="bg-gray-950 text-white hover:text-white" fillClassName="bg-cobalt-900">
            <span className="inline-flex items-center gap-2 whitespace-nowrap">
              Talk to our experts
              <ArrowRight className="h-4 w-4" />
            </span>
          </Button>
          <Button href="#voice-capabilities" variant="outline" size="lg" className="border-gray-300 text-gray-900 hover:text-white" fillClassName="bg-cobalt-900">
            Explore capabilities
          </Button>
        </div>
      </Hero>

      <Section id="voice-capabilities" className="py-14 md:py-16 bg-gray-50">
        <FadeIn>
          <div className="text-center mb-10 md:mb-12">
            <p className="text-[11px] uppercase tracking-[0.16em] text-cobalt-900 font-semibold mb-2">
              Voice Capabilities
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              One platform for every voice workflow
            </h2>
            <p className="text-lg text-gray-600 font-light max-w-3xl mx-auto">
              Pick a capability to inspect how Uttertuple handles integrations, realtime orchestration, and production operations.
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
                        ? 'border-cobalt-300 bg-cobalt-50/45 shadow-[0_14px_26px_-20px_rgba(0,71,171,0.4)]'
                        : 'border-transparent bg-transparent hover:border-gray-200 hover:bg-gray-50'
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

          {safeCapability && (
            <FadeIn delay={0.1} direction="none" className="min-w-0">
              <article className="rounded-3xl border border-gray-200/90 bg-white shadow-[0_20px_40px_-28px_rgba(15,23,42,0.32)] overflow-hidden">
                <div className="border-b border-gray-200 bg-gradient-to-r from-cobalt-50/50 via-white to-cyan-50/35 p-5 md:p-6">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-cobalt-100 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-cobalt-900">
                      <Radio className="h-3.5 w-3.5" />
                      {safeCapability.visualLabel || 'Uttertuple capability'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      Production active
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
                          className="group relative overflow-hidden rounded-2xl border border-gray-200/90 bg-gray-50/70 p-4 md:p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-cobalt-300 hover:bg-white"
                        >
                          <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cobalt-400 to-transparent -translate-x-[110%] transition-transform duration-700 group-hover:translate-x-0" />
                          <div className="flex items-start gap-2.5 mb-2.5">
                            <div className="w-9 h-9 rounded-xl bg-cobalt-50 border border-cobalt-100 flex items-center justify-center flex-shrink-0">
                              <FeatureIcon className="h-[18px] w-[18px] text-cobalt-900" strokeWidth={1.5} />
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
            <p className="text-[11px] uppercase tracking-[0.16em] text-cobalt-900 font-semibold mb-2">
              Provider Ecosystem
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {data.providers.sectionTitle}
            </h2>
            <p className="text-lg text-gray-600 font-light max-w-3xl mx-auto">
              {data.providers.sectionDescription}
            </p>
          </div>
        </FadeIn>

        <StaggerChildren className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
          {[
            {
              title: data.providers.cloudProviders.title,
              icon: Mic,
              items: data.providers.cloudProviders.items,
            },
            {
              title: data.providers.startups.title,
              icon: Sparkles,
              items: data.providers.startups.items,
            },
          ].map((group) => (
            <StaggerItem key={group.title}>
              <article className="group relative h-full overflow-hidden rounded-2xl border border-gray-200/90 bg-white p-5 md:p-6 shadow-[0_14px_28px_-22px_rgba(15,23,42,0.3)] transition-all duration-300 hover:border-cobalt-300 hover:shadow-[0_24px_42px_-26px_rgba(0,71,171,0.38)]">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cobalt-400 to-transparent -translate-x-[110%] transition-transform duration-700 group-hover:translate-x-0" />
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl border border-cobalt-100 bg-cobalt-50 flex items-center justify-center">
                    <group.icon className="h-5 w-5 text-cobalt-900" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{group.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {group.items.map((provider) => (
                    <span
                      key={provider}
                      className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors duration-250 group-hover:border-cobalt-100 group-hover:bg-cobalt-50/45"
                    >
                      {provider}
                    </span>
                  ))}
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerChildren>

        <FadeIn delay={0.15}>
          <div className="mt-8 rounded-2xl border border-cobalt-100 bg-cobalt-50/45 p-5 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
              <div className="h-10 w-10 rounded-xl border border-cobalt-200 bg-white flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-cobalt-900" strokeWidth={1.8} />
              </div>
              <p className="text-sm md:text-base text-gray-700 font-light leading-relaxed">
                Uttertuple keeps provider-switching configuration-driven, so teams can optimize cost, latency, or quality without rewriting the app layer.
              </p>
            </div>
          </div>
        </FadeIn>
      </Section>

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
