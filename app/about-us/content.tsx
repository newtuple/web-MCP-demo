'use client'

import { useMemo, useState } from 'react'
import { ArrowRight, Compass, Flag, Radio, ShieldCheck, Sparkles } from 'lucide-react'
import Section from '@/components/ui/Section'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import FadeIn from '@/components/motion/FadeIn'
import StaggerChildren, { StaggerItem } from '@/components/motion/StaggerChildren'
import TypingBlock from '@/components/motion/TypingBlock'
import { resolveIcon } from '@/lib/icons'
import Leadership, { type LeadershipMember } from '@/components/sections/Leadership'

interface AboutData {
  title: string
  description: string
  hero: {
    badge: string
    title: string
    description: string
  }
  mission: string
  vision: string
  story: {
    title: string
    paragraphs: string[]
  }
  howWeBuild?: {
    title: string
    paragraphs: string[]
  }
  leadership: {
    eyebrow: string
    title: string
    description: string
    members: LeadershipMember[]
  }
  values: {
    title: string
    icon: string
    description: string
  }[]
  milestones: {
    year: string
    title: string
    description: string
  }[]
  expertise: {
    title: string
    icon: string
    description: string
  }[]
  cta: {
    title: string
    description: string
  }
}

export default function AboutContent({ data }: { data: AboutData }) {
  const [activeValue, setActiveValue] = useState(0)

  const values = useMemo(
    () =>
      data.values.map((item) => ({
        ...item,
        icon: resolveIcon(item.icon),
      })),
    [data.values],
  )

  const expertise = useMemo(
    () =>
      data.expertise.map((item) => ({
        ...item,
        icon: resolveIcon(item.icon),
      })),
    [data.expertise],
  )

  const selectedValue = values[Math.min(activeValue, Math.max(values.length - 1, 0))]

  return (
    <>
      <section className="relative overflow-hidden min-h-screen bg-white">
        <div className="pointer-events-none absolute -top-24 left-[18%] h-72 w-72 rounded-full bg-cobalt-100/55 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-[8%] h-64 w-64 rounded-full bg-cyan-100/55 blur-3xl" />
        <Container className="relative z-10 pt-28 pb-16 md:pt-36 md:pb-24">
          <FadeIn>
            <div className="max-w-5xl mx-auto text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-cobalt-100 bg-cobalt-50/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-cobalt-900 mb-7">
                <Sparkles className="h-3.5 w-3.5" />
                {data.hero.badge}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl leading-[1.04] tracking-tight text-gray-950 mb-6 font-light">
                {data.hero.title}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed max-w-3xl mx-auto mb-10">
                {data.hero.description}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-5">
                <Button href="/contactus" size="lg" className="bg-gray-950 text-white hover:text-white" fillClassName="bg-cobalt-900">
                  <span className="inline-flex items-center gap-2 whitespace-nowrap">
                    Talk to our experts
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Button>
                <Button href="#our-values" variant="outline" size="lg" className="border-gray-300 text-gray-900 hover:text-white" fillClassName="bg-cobalt-900">
                  Explore values
                </Button>
              </div>
              <p className="text-sm text-gray-500 font-light">
                Founded in 2022. 20+ production GenAI deployments. 40+ client engagements.
              </p>
            </div>
          </FadeIn>
        </Container>
      </section>

      <Section className="py-14 md:py-16 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <FadeIn>
            <article className="group relative h-full overflow-hidden rounded-3xl border border-gray-200/90 bg-white p-6 md:p-7 shadow-[0_20px_40px_-28px_rgba(15,23,42,0.3)]">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cobalt-400 to-transparent -translate-x-[110%] transition-transform duration-700 group-hover:translate-x-0" />
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cobalt-100 bg-cobalt-50 mb-4">
                <Flag className="h-5 w-5 text-cobalt-900" strokeWidth={1.6} />
              </div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-cobalt-900 font-semibold mb-2">Mission</p>
              <p className="text-2xl md:text-3xl text-gray-900 leading-snug font-light">{data.mission}</p>
            </article>
          </FadeIn>

          <FadeIn delay={0.08}>
            <article className="group relative h-full overflow-hidden rounded-3xl border border-gray-200/90 bg-white p-6 md:p-7 shadow-[0_20px_40px_-28px_rgba(15,23,42,0.3)]">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cobalt-400 to-transparent -translate-x-[110%] transition-transform duration-700 group-hover:translate-x-0" />
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cobalt-100 bg-cobalt-50 mb-4">
                <Compass className="h-5 w-5 text-cobalt-900" strokeWidth={1.6} />
              </div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-cobalt-900 font-semibold mb-2">Vision</p>
              <p className="text-2xl md:text-3xl text-gray-900 leading-snug font-light">{data.vision}</p>
            </article>
          </FadeIn>
        </div>
      </Section>

      <Leadership {...data.leadership} />

      <Section className="py-14 md:py-16 bg-gray-50">
        <FadeIn>
          <div className="text-center mb-10 md:mb-12">
            <p className="text-[11px] uppercase tracking-[0.16em] text-cobalt-900 font-semibold mb-2">Company Narrative</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{data.story.title}</h2>
            <p className="text-base md:text-lg text-gray-600 font-light max-w-3xl mx-auto mt-4">
              From first principles to production systems, this is how Newtuple evolved.
            </p>
          </div>
        </FadeIn>

        <div className="max-w-4xl mx-auto space-y-1">
          {data.story.paragraphs.map((paragraph, index) => (
            <FadeIn key={paragraph} delay={index * 0.08}>
              <article className="relative pl-12 md:pl-14 pb-7 md:pb-8 last:pb-0">
                {index < data.story.paragraphs.length - 1 && (
                  <div className="absolute left-[15px] top-8 h-[calc(100%+18px)] w-px bg-gradient-to-b from-cobalt-300/85 to-cobalt-200/45 md:left-[17px] md:h-[calc(100%+20px)]" />
                )}
                <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-cobalt-100 bg-cobalt-50 text-[11px] font-semibold text-cobalt-900 md:h-9 md:w-9">
                  {(index + 1).toString().padStart(2, '0')}
                </div>

                <article className="group relative overflow-hidden rounded-2xl border border-gray-200/90 bg-white px-5 py-4 md:px-6 md:py-5 shadow-[0_14px_26px_-22px_rgba(15,23,42,0.25)] transition-all duration-300 hover:border-cobalt-300 hover:shadow-[0_22px_34px_-26px_rgba(0,71,171,0.35)]">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cobalt-400 to-transparent -translate-x-[110%] transition-transform duration-700 group-hover:translate-x-0" />
                  <p className="text-[11px] uppercase tracking-[0.16em] text-cobalt-900 font-semibold mb-2">
                    Chapter {(index + 1).toString().padStart(2, '0')}
                  </p>
                  <p className="text-base md:text-lg text-gray-600 font-light leading-relaxed">{paragraph}</p>
                </article>
              </article>
            </FadeIn>
          ))}
        </div>
      </Section>

      {data.howWeBuild && (
        <Section className="py-14 md:py-16 bg-white">
          <FadeIn>
            <div className="text-center mb-10 md:mb-12">
              <p className="text-[11px] uppercase tracking-[0.16em] text-cobalt-900 font-semibold mb-2">Our Approach</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{data.howWeBuild.title}</h2>
            </div>
          </FadeIn>
          <div className="max-w-3xl mx-auto space-y-6">
            {data.howWeBuild.paragraphs.map((paragraph, index) => (
              <FadeIn key={paragraph} delay={index * 0.08}>
                <p className="text-base md:text-lg text-gray-600 font-light leading-relaxed text-center">{paragraph}</p>
              </FadeIn>
            ))}
          </div>
        </Section>
      )}

      <Section id="our-values" className="py-14 md:py-16 bg-white">
        <FadeIn>
          <div className="text-center mb-10 md:mb-12">
            <p className="text-[11px] uppercase tracking-[0.16em] text-cobalt-900 font-semibold mb-2">Operating Principles</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Values</h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] gap-6 lg:gap-8">
          <FadeIn delay={0.05}>
            <div className="rounded-2xl border border-gray-200 bg-white p-3 lg:sticky lg:top-24 h-fit">
              <div className="space-y-2">
                {values.map((item, index) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => setActiveValue(index)}
                    className={`w-full rounded-xl border px-3 py-3 text-left transition-all duration-250 ${
                      activeValue === index
                        ? 'border-cobalt-300 bg-cobalt-50/45 shadow-[0_14px_26px_-20px_rgba(0,71,171,0.4)]'
                        : 'border-transparent bg-transparent hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <p className="text-[11px] uppercase tracking-[0.14em] text-cobalt-800 font-semibold mb-1">
                      Value {(index + 1).toString().padStart(2, '0')}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 leading-snug">{item.title}</p>
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>

          {selectedValue && (
            <FadeIn delay={0.1} direction="none" className="min-w-0">
              <article className="rounded-3xl border border-gray-200/90 bg-white shadow-[0_20px_40px_-28px_rgba(15,23,42,0.32)] overflow-hidden">
                <div className="border-b border-gray-200 bg-gradient-to-r from-cobalt-50/50 via-white to-cyan-50/35 p-5 md:p-6">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-cobalt-100 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-cobalt-900">
                      <Radio className="h-3.5 w-3.5" />
                      Active principle
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      Team-wide
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-2.5">
                    <div className="h-10 w-10 rounded-xl border border-cobalt-100 bg-cobalt-50 flex items-center justify-center">
                      <selectedValue.icon className="h-5 w-5 text-cobalt-900" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-tight">
                      {selectedValue.title}
                    </h3>
                  </div>
                  <p className="text-base text-gray-600 font-light leading-relaxed">
                    {selectedValue.description}
                  </p>
                </div>

                <div className="p-5 md:p-6 lg:p-7">
                  <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                    {values.map((item, index) => (
                      <StaggerItem key={item.title}>
                        <article className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50/70 p-4 transition-all duration-300 hover:border-cobalt-300 hover:bg-white">
                          <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cobalt-400 to-transparent -translate-x-[110%] transition-transform duration-700 group-hover:translate-x-0" />
                          <div className="flex items-start justify-between gap-2.5 mb-2.5">
                            <div className="h-9 w-9 rounded-lg border border-cobalt-100 bg-cobalt-50 flex items-center justify-center">
                              <item.icon className="h-4 w-4 text-cobalt-900" strokeWidth={1.5} />
                            </div>
                            <span className="text-[11px] font-semibold tracking-[0.12em] text-gray-400">
                              {(index + 1).toString().padStart(2, '0')}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-gray-900 leading-snug mb-1.5">{item.title}</p>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            {item.description.length > 90 ? `${item.description.slice(0, 90)}...` : item.description}
                          </p>
                        </article>
                      </StaggerItem>
                    ))}
                  </StaggerChildren>
                </div>
              </article>
            </FadeIn>
          )}
        </div>
      </Section>

      {/* Our Journey section hidden - milestones need fact-checking */}

      <Section className="py-14 md:py-16 bg-white">
        <FadeIn>
          <div className="text-center mb-10 md:mb-12">
            <p className="text-[11px] uppercase tracking-[0.16em] text-cobalt-900 font-semibold mb-2">Core Capabilities</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Team Expertise</h2>
          </div>
        </FadeIn>

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {expertise.map((item, index) => (
            <StaggerItem key={item.title}>
              <article className="group relative h-full min-h-[230px] overflow-hidden rounded-2xl border border-gray-200/90 bg-white p-5 md:p-6 shadow-[0_14px_28px_-22px_rgba(15,23,42,0.3)] transition-all duration-300 hover:-translate-y-1 hover:border-cobalt-300 hover:shadow-[0_24px_42px_-26px_rgba(0,71,171,0.4)]">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cobalt-400 to-transparent -translate-x-[110%] transition-transform duration-700 group-hover:translate-x-0" />
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cobalt-100 bg-cobalt-50 transition-colors duration-300 group-hover:bg-cobalt-100">
                    <item.icon className="h-6 w-6 text-cobalt-900" strokeWidth={1.5} />
                  </div>
                  <span className="text-[11px] font-semibold tracking-[0.14em] text-gray-400">
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 leading-tight mb-2.5">{item.title}</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">{item.description}</p>
              </article>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </Section>

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
