'use client'

import { useMemo, useState } from 'react'
import { ArrowRight, Building2, CheckCircle2, Radio, Users2 } from 'lucide-react'
import Section from '@/components/ui/Section'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import FadeIn from '@/components/motion/FadeIn'
import StaggerChildren, { StaggerItem } from '@/components/motion/StaggerChildren'
import TypingBlock from '@/components/motion/TypingBlock'
import { resolveIcon } from '@/lib/icons'

interface AgenciesData {
  title: string
  description: string
  hero: {
    badge: string
    title: string
    description: string
  }
  benefits: {
    sectionTitle: string
    items: { title: string; icon: string; description: string }[]
  }
  offerings: {
    title: string
    items: string[]
    highlight: {
      title: string
      description: string
    }
  }
  testimonial: {
    quote: string
    name: string
    attribution: string
    industry: string
  }
  cta: {
    title: string
    description: string
    buttonText: string
  }
}

const PARTNER_SIGNALS = [
  'Extending agency teams with production GenAI specialists',
  'Shipping white-label AI products under your brand',
  'Converting sold AI deals into reliable delivery',
  'Scaling delivery without scaling fixed headcount',
]

export default function AgenciesContent({ data }: { data: AgenciesData }) {
  const [activeBenefit, setActiveBenefit] = useState(0)

  const benefits = useMemo(
    () =>
      data.benefits.items.map((item) => ({
        ...item,
        icon: resolveIcon(item.icon),
      })),
    [data.benefits.items],
  )

  const selectedBenefit = benefits[Math.min(activeBenefit, Math.max(benefits.length - 1, 0))]

  return (
    <>
      <section className="relative overflow-hidden min-h-screen bg-white lg:flex lg:items-center">
        <div className="pointer-events-none absolute -top-24 left-[18%] h-72 w-72 rounded-full bg-cobalt-100/55 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-[8%] h-64 w-64 rounded-full bg-cyan-100/55 blur-3xl" />
        <Container className="relative z-10 w-full pt-28 pb-16 md:pt-36 md:pb-24">
          <FadeIn>
            <div className="max-w-5xl mx-auto text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-cobalt-100 bg-cobalt-50/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-cobalt-900 mb-7">
                <Users2 className="h-3.5 w-3.5" />
                {data.hero.badge}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl leading-[1.04] tracking-tight text-gray-950 mb-6 font-light">
                {data.hero.title}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed max-w-3xl mx-auto mb-10">
                {data.hero.description}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                <Button href="/contactus" size="lg" className="bg-gray-950 text-white hover:text-white" fillClassName="bg-cobalt-900">
                  <span className="inline-flex items-center gap-2 whitespace-nowrap">
                    {data.cta.buttonText}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Button>
                <Button href="#agency-offerings" variant="outline" size="lg" className="border-gray-300 text-gray-900 hover:text-white" fillClassName="bg-cobalt-900">
                  Explore offerings
                </Button>
              </div>
              <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-w-3xl mx-auto">
                {PARTNER_SIGNALS.map((signal) => (
                  <StaggerItem key={signal}>
                    <article className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs md:text-sm text-gray-600 font-light transition-all duration-300 hover:border-cobalt-300 hover:bg-cobalt-50/35">
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cobalt-400 to-transparent -translate-x-[110%] transition-transform duration-700 group-hover:translate-x-0" />
                      <p className="relative z-10">{signal}</p>
                    </article>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </div>
          </FadeIn>
        </Container>
      </section>

      <Section className="py-14 md:py-16 bg-gray-50">
        <FadeIn>
          <div className="text-center mb-10 md:mb-12">
            <p className="text-[11px] uppercase tracking-[0.16em] text-cobalt-900 font-semibold mb-2">
              Partnership Model
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {data.benefits.sectionTitle}
            </h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] gap-6 lg:gap-8">
          <FadeIn delay={0.05}>
            <div className="rounded-2xl border border-gray-200 bg-white p-3 lg:sticky lg:top-24 h-fit">
              <div className="space-y-2">
                {benefits.map((item, index) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => setActiveBenefit(index)}
                    className={`w-full rounded-xl border px-3 py-3 text-left transition-all duration-250 ${
                      activeBenefit === index
                        ? 'border-cobalt-300 bg-cobalt-50/45 shadow-[0_14px_26px_-20px_rgba(0,71,171,0.4)]'
                        : 'border-transparent bg-transparent hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <p className="text-[11px] uppercase tracking-[0.14em] text-cobalt-800 font-semibold mb-1">
                      Advantage {(index + 1).toString().padStart(2, '0')}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 leading-snug">{item.title}</p>
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>

          {selectedBenefit && (
            <FadeIn delay={0.1} direction="none" className="min-w-0">
              <article className="rounded-3xl border border-gray-200/90 bg-white shadow-[0_20px_40px_-28px_rgba(15,23,42,0.32)] overflow-hidden">
                <div className="border-b border-gray-200 bg-gradient-to-r from-cobalt-50/50 via-white to-cyan-50/35 p-5 md:p-6">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-cobalt-100 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-cobalt-900">
                      <Radio className="h-3.5 w-3.5" />
                      Active partnership layer
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      Delivery ready
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-tight mb-2.5">
                    {selectedBenefit.title}
                  </h3>
                  <p className="text-base text-gray-600 font-light leading-relaxed">
                    {selectedBenefit.description}
                  </p>
                </div>

                <div className="p-5 md:p-6 lg:p-7">
                  <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                    {benefits.slice(0, 3).map((item, index) => (
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

      <section id="agency-offerings" className="py-14 md:py-16 bg-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-dark" />
        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-6 md:gap-8 items-start">
            <FadeIn>
              <article className="group relative h-full overflow-hidden rounded-3xl border border-gray-800/90 bg-gray-900/90 p-5 md:p-6 shadow-[0_20px_40px_-28px_rgba(0,0,0,0.65)]">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cobalt-400 to-transparent -translate-x-[110%] transition-transform duration-700 group-hover:translate-x-0" />
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">{data.offerings.title}</h2>
                <div className="space-y-3.5">
                  {data.offerings.items.map((item) => (
                    <div key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-[18px] w-[18px] text-cobalt-300 mt-0.5 flex-shrink-0" strokeWidth={1.6} />
                      <p className="text-sm md:text-base text-gray-300 font-light leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </article>
            </FadeIn>

            <FadeIn delay={0.1}>
              <article className="group relative h-full overflow-hidden rounded-3xl border border-gray-800/90 bg-gray-900/90 p-5 md:p-6 shadow-[0_20px_40px_-28px_rgba(0,0,0,0.65)]">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cobalt-400 to-transparent -translate-x-[110%] transition-transform duration-700 group-hover:translate-x-0" />
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cobalt-500/35 bg-cobalt-500/15 mb-4">
                  <Building2 className="h-5 w-5 text-cobalt-300" strokeWidth={1.6} />
                </div>
                <h3 className="text-2xl font-semibold text-white leading-tight mb-3">
                  {data.offerings.highlight.title}
                </h3>
                <p className="text-sm md:text-base text-gray-300 font-light leading-relaxed">
                  {data.offerings.highlight.description}
                </p>
              </article>
            </FadeIn>
          </div>
        </Container>
      </section>

      <Section className="py-14 md:py-16 bg-white">
        <FadeIn>
          <div className="max-w-4xl mx-auto rounded-3xl border border-gray-200/90 bg-white p-6 md:p-8 shadow-[0_24px_40px_-28px_rgba(15,23,42,0.3)]">
            <p className="text-2xl md:text-3xl text-gray-900 leading-relaxed font-light mb-5">
              &ldquo;{data.testimonial.quote}&rdquo;
            </p>
            <p className="text-sm text-cobalt-900 font-semibold uppercase tracking-[0.12em]">
              {data.testimonial.name}
            </p>
            <p className="text-sm text-gray-600 font-light mt-1">
              {data.testimonial.attribution}
            </p>
          </div>
        </FadeIn>
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
                {data.cta.buttonText}
                <ArrowRight className="w-5 h-5" />
              </span>
            </Button>
          </FadeIn>
        </Container>
      </section>
    </>
  )
}
