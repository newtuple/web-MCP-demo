'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  Headphones,
  Radio,
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

interface GenAIAcceleratorsData {
  title: string
  description: string
  hero: {
    badge: string
    title: string
    description: string
  }
  why: {
    sectionTitle: string
    sectionDescription: string
    items: {
      title: string
      icon: string
      description: string
    }[]
  }
  accelerators: {
    sectionTitle: string
    items: {
      name: string
      tagline: string
      description: string
      href: string
      icon: string
    }[]
  }
  licensing: {
    sectionTitle: string
    items: {
      title: string
      icon: string
      description: string
    }[]
    footnote: string
  }
  showDeployment: boolean
  cta: {
    title: string
    description: string
  }
}

interface AcceleratorViewItem {
  name: string
  tagline: string
  description: string
  href: string
  icon: LucideIcon
}

const rolloutTools: ToolCallItem[] = [
  { label: 'Selecting accelerator baseline', result: 'Architecture template loaded' },
  { label: 'Provisioning deployment artifacts', result: 'Compose + Helm generated' },
  { label: 'Applying project customizations', result: 'Domain extensions attached' },
  { label: 'Running release quality checks', result: 'Build approved for rollout' },
]

const DIALOGTUPLE_LOGOS = {
  dark: '/images/logos/dialogtuple/dark.png',
  darkIcon: '/images/logos/dialogtuple/dark_icon.png',
}

function AcceleratorsHeroVisual({ items }: { items: AcceleratorViewItem[] }) {
  return (
    <div className="relative mx-auto w-full max-w-[560px] px-1">
      <div className="pointer-events-none absolute inset-x-8 inset-y-8 rounded-full bg-cobalt-200/50 blur-3xl animate-pulse-subtle" />
      <div className="group relative min-h-[360px] sm:min-h-[410px] md:min-h-[440px] overflow-hidden rounded-3xl border border-cobalt-100/90 bg-white/85 p-4 sm:p-5 md:p-6 shadow-[0_32px_68px_-42px_rgba(0,71,171,0.5)] backdrop-blur-sm">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-cobalt-50/60 to-cyan-50/35" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cobalt-400 to-transparent -translate-x-[110%] transition-transform duration-1000 group-hover:translate-x-0" />

        <div className="relative z-10 flex h-full flex-col">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-cobalt-100 bg-white/90 px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.12em] text-cobalt-800">
            <Sparkles className="h-3.5 w-3.5" />
            Accelerator Command Layer
          </span>

          <div className="mt-4 rounded-2xl border border-cobalt-100/90 bg-white/95 px-3 py-3 sm:px-4 sm:py-3.5 shadow-[0_18px_36px_-30px_rgba(0,71,171,0.55)]">
            <p className="text-[12px] font-semibold text-gray-900 sm:text-[13px]">Composable production stack</p>
            <p className="mt-1 text-[10px] leading-relaxed text-gray-600 sm:text-[11px]">
              Start from a proven base, customize only what is unique to your business.
            </p>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2.5 sm:gap-3">
            {items.slice(0, 4).map((item) => (
              <div
                key={item.name}
                className="rounded-xl border border-gray-200/90 bg-white/90 px-3 py-2.5 shadow-[0_14px_24px_-22px_rgba(15,23,42,0.34)]"
              >
                <div className="mb-2 flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg border border-cobalt-100 bg-cobalt-50 flex items-center justify-center">
                    {item.name.toLowerCase() === 'dialogtuple' ? (
                      <span className="inline-flex items-center justify-center rounded-md bg-white p-0.5 shadow-[0_8px_14px_-10px_rgba(0,71,171,0.35)]">
                        <Image
                          src={DIALOGTUPLE_LOGOS.darkIcon}
                          alt="Dialogtuple icon"
                          width={16}
                          height={16}
                          className="h-4 w-4 object-contain"
                        />
                      </span>
                    ) : (
                      <item.icon className="h-3.5 w-3.5 text-cobalt-900" strokeWidth={1.5} />
                    )}
                  </div>
                  <p className="text-xs font-semibold text-gray-900 leading-tight">{item.name}</p>
                </div>
                <p className="text-[10px] text-gray-600 leading-snug">{item.tagline}</p>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-3 sm:pt-4 grid grid-cols-3 gap-2 sm:gap-2.5">
            {[
              { value: `${items.length}`, label: 'Accelerators' },
              { value: 'Modular', label: 'Architecture' },
              { value: 'Prod-ready', label: 'Delivery' },
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

export default function GenAIAcceleratorsContent({ data }: { data: GenAIAcceleratorsData }) {
  const { hero, why, accelerators, licensing, cta } = data
  const [activeAccelerator, setActiveAccelerator] = useState(0)

  const whyItems = useMemo(
    () =>
      why.items.map((item) => ({
        ...item,
        icon: resolveIcon(item.icon),
      })),
    [why.items],
  )

  const acceleratorItems = useMemo(
    () =>
      accelerators.items.map((item) => ({
        ...item,
        icon: resolveIcon(item.icon),
      })),
    [accelerators.items],
  )

  const licensingItems = useMemo(
    () =>
      licensing.items.map((item) => ({
        ...item,
        icon: resolveIcon(item.icon),
      })),
    [licensing.items],
  )

  const selectedAccelerator = acceleratorItems[Math.min(activeAccelerator, Math.max(acceleratorItems.length - 1, 0))]

  return (
    <>
      <Hero
        badge={hero.badge}
        title={
          <>
            <span className="block text-gray-950 font-light">{hero.title}</span>
            <span className="mt-2 block text-cobalt-900 font-semibold tracking-tight">Build faster, ship with confidence</span>
          </>
        }
        description={hero.description}
        compact
        fullScreen
        variant="split"
        gradient={false}
        visual={<AcceleratorsHeroVisual items={acceleratorItems} />}
        className="bg-white before:pointer-events-none before:absolute before:-top-32 before:left-[20%] before:h-72 before:w-72 before:rounded-full before:bg-cobalt-100/55 before:blur-3xl after:pointer-events-none after:absolute after:-bottom-28 after:right-[8%] after:h-64 after:w-64 after:rounded-full after:bg-cyan-100/55 after:blur-3xl"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <Button href="/contactus" size="lg" className="bg-gray-950 text-white hover:text-white" fillClassName="bg-cobalt-900">
            <span className="inline-flex items-center gap-2 whitespace-nowrap">
              Talk to our experts
              <ArrowRight className="h-4 w-4" />
            </span>
          </Button>
          <Button href="#accelerator-suite" variant="outline" size="lg" className="border-gray-300 text-gray-900 hover:text-white" fillClassName="bg-cobalt-900">
            Explore suite
          </Button>
        </div>
      </Hero>

      <Section className="py-14 md:py-16 bg-white">
        <FadeIn>
          <div className="text-center mb-10 md:mb-12">
            <p className="text-[11px] uppercase tracking-[0.16em] text-cobalt-900 font-semibold mb-2">
              Delivery Principles
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {why.sectionTitle}
            </h2>
            <p className="text-lg text-gray-600 font-light max-w-3xl mx-auto">
              {why.sectionDescription}
            </p>
          </div>
        </FadeIn>

        <StaggerChildren className="space-y-3 max-w-5xl mx-auto">
          {whyItems.map((item, index) => (
            <StaggerItem key={item.title}>
              <article className="group relative overflow-hidden rounded-2xl border border-gray-200/90 bg-white px-4 py-4 md:px-6 md:py-5 shadow-[0_14px_26px_-20px_rgba(15,23,42,0.25)] transition-all duration-300 hover:border-cobalt-300 hover:shadow-[0_24px_42px_-26px_rgba(0,71,171,0.38)]">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cobalt-400 to-transparent -translate-x-[110%] transition-transform duration-700 group-hover:translate-x-0" />
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-5">
                  <div className="flex items-center gap-3 md:w-[290px]">
                    <span className="text-[11px] font-semibold tracking-[0.14em] text-gray-400">
                      {(index + 1).toString().padStart(2, '0')}
                    </span>
                    <div className="h-10 w-10 rounded-xl border border-cobalt-100 bg-cobalt-50 flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-cobalt-900" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-base md:text-lg font-semibold text-gray-900">{item.title}</h3>
                  </div>
                  <p className="text-sm md:text-base text-gray-600 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </Section>

      <Section id="accelerator-suite" className="py-14 md:py-16 bg-gray-50">
        <FadeIn>
          <div className="text-center mb-10 md:mb-12">
            <p className="text-[11px] uppercase tracking-[0.16em] text-cobalt-900 font-semibold mb-2">
              Product Suite
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {accelerators.sectionTitle}
            </h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-6 lg:gap-8">
          <FadeIn delay={0.05}>
            <div className="rounded-2xl border border-gray-200 bg-white p-3 lg:sticky lg:top-24 h-fit">
              <div className="space-y-2">
                {acceleratorItems.map((item, index) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setActiveAccelerator(index)}
                    className={`w-full rounded-xl border px-3 py-3 text-left transition-all duration-250 ${
                      activeAccelerator === index
                        ? 'border-cobalt-300 bg-cobalt-50/45 shadow-[0_14px_26px_-20px_rgba(0,71,171,0.4)]'
                        : 'border-transparent bg-transparent hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <div className="h-8 w-8 rounded-lg border border-cobalt-100 bg-cobalt-50 flex items-center justify-center">
                        {item.name.toLowerCase() === 'dialogtuple' ? (
                          <span className="inline-flex items-center justify-center rounded-md bg-white p-0.5 shadow-[0_8px_14px_-10px_rgba(0,71,171,0.35)]">
                            <Image
                              src={DIALOGTUPLE_LOGOS.darkIcon}
                              alt="Dialogtuple icon"
                              width={16}
                              height={16}
                              className="h-4 w-4 object-contain"
                            />
                          </span>
                        ) : (
                          <item.icon className="h-4 w-4 text-cobalt-900" strokeWidth={1.5} />
                        )}
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                    </div>
                    <p className="text-xs text-gray-600">{item.tagline}</p>
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>

          {selectedAccelerator && (
            <FadeIn delay={0.1} direction="none" className="min-w-0">
              <article className="rounded-3xl border border-gray-200/90 bg-white shadow-[0_20px_40px_-28px_rgba(15,23,42,0.32)] overflow-hidden">
                <div className="border-b border-gray-200 bg-gradient-to-r from-cobalt-50/50 via-white to-cyan-50/35 p-5 md:p-6">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-cobalt-100 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-cobalt-900">
                      <Radio className="h-3.5 w-3.5" />
                      Active accelerator
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      Ready for rollout
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-tight mb-2">
                    {selectedAccelerator.name}
                  </h3>
                  {selectedAccelerator.name.toLowerCase() === 'dialogtuple' && (
                    <span className="mb-2.5 inline-flex items-center rounded-xl border border-cobalt-200 bg-white px-3 py-1.5">
                      <Image
                        src={DIALOGTUPLE_LOGOS.dark}
                        alt="Dialogtuple logo"
                        width={148}
                        height={32}
                        className="h-8 w-auto object-contain"
                      />
                    </span>
                  )}
                  <p className="text-sm md:text-base text-cobalt-900 font-medium mb-2.5">{selectedAccelerator.tagline}</p>
                  <p className="text-base text-gray-600 font-light leading-relaxed">
                    {selectedAccelerator.description}
                  </p>
                </div>

                <div className="p-5 md:p-6 lg:p-7">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-6">
                    {acceleratorItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="group relative overflow-hidden rounded-2xl border border-gray-200/90 bg-gray-50/70 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-cobalt-300 hover:bg-white"
                      >
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cobalt-400 to-transparent -translate-x-[110%] transition-transform duration-700 group-hover:translate-x-0" />
                        <div className="flex items-center gap-2.5 mb-2">
                          <div className="h-8 w-8 rounded-lg border border-cobalt-100 bg-cobalt-50 flex items-center justify-center">
                            {item.name.toLowerCase() === 'dialogtuple' ? (
                              <span className="inline-flex items-center justify-center rounded-md bg-white p-0.5 shadow-[0_8px_14px_-10px_rgba(0,71,171,0.35)]">
                                <Image
                                  src={DIALOGTUPLE_LOGOS.darkIcon}
                                  alt="Dialogtuple icon"
                                  width={16}
                                  height={16}
                                  className="h-4 w-4 object-contain"
                                />
                              </span>
                            ) : (
                              <item.icon className="h-4 w-4 text-cobalt-900" strokeWidth={1.5} />
                            )}
                          </div>
                          <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{item.tagline}</p>
                      </Link>
                    ))}
                  </div>

                  <Button href={selectedAccelerator.href} size="md" className="bg-gray-950 text-white hover:text-white" fillClassName="bg-cobalt-900">
                    <span className="inline-flex items-center gap-2">
                      Open {selectedAccelerator.name}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Button>
                </div>
              </article>
            </FadeIn>
          )}
        </div>
      </Section>

      <section className="min-h-[70vh] flex items-center py-20 md:py-24 bg-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-dark" />
        <div className="relative z-10 w-full">
          <div className="flex flex-col lg:flex-row items-stretch">
            <div className="flex-1 min-w-0 overflow-hidden">
              <Container>
                <div className="max-w-4xl mx-auto lg:mx-0">
                  <TypingBlock
                    lines={[
                      'Stop rebuilding the same GenAI foundation.',
                      'Accelerate delivery without losing control.',
                      'Our accelerators package the repeatable 70% so your teams focus on domain-specific value.',
                      'Composable architecture, operational guardrails, and deployment-ready artifacts are built in from day one.',
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
                  <ToolCallAnimation tools={rolloutTools} title="Rollout Engine" dark />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section className="py-14 md:py-16 bg-white">
        <FadeIn>
          <div className="text-center mb-10 md:mb-12">
            <p className="text-[11px] uppercase tracking-[0.16em] text-cobalt-900 font-semibold mb-2">
              Commercial Model
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {licensing.sectionTitle}
            </h2>
          </div>
        </FadeIn>

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 max-w-4xl mx-auto">
          {licensingItems.map((item, index) => (
            <StaggerItem key={item.title}>
              <article className="group relative h-full min-h-[220px] overflow-hidden rounded-2xl border border-gray-200/90 bg-white p-5 md:p-6 shadow-[0_14px_28px_-22px_rgba(15,23,42,0.3)] transition-all duration-300 hover:-translate-y-1 hover:border-cobalt-300 hover:shadow-[0_24px_42px_-26px_rgba(0,71,171,0.4)]">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cobalt-400 to-transparent -translate-x-[110%] transition-transform duration-700 group-hover:translate-x-0" />
                <div className="flex items-start justify-between gap-3 mb-4">
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

        <FadeIn delay={0.2}>
          <div className="mt-8 rounded-2xl border border-cobalt-100 bg-cobalt-50/45 p-5 md:p-6 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
              <div className="h-10 w-10 rounded-xl border border-cobalt-200 bg-white flex items-center justify-center">
                <Headphones className="h-5 w-5 text-cobalt-900" strokeWidth={1.8} />
              </div>
              <p className="text-sm md:text-base text-gray-700 font-light leading-relaxed">
                {licensing.footnote}
              </p>
            </div>
          </div>
        </FadeIn>
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
