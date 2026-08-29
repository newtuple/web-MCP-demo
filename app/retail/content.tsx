'use client'

import { useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  Radio,
  FileText,
  Ticket,
  ClipboardCheck,
  Check,
  Briefcase,
  Zap,
} from 'lucide-react'
import Section from '@/components/ui/Section'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import FadeIn from '@/components/motion/FadeIn'
import StaggerChildren, { StaggerItem } from '@/components/motion/StaggerChildren'
import TypingBlock from '@/components/motion/TypingBlock'
import IntelligentCommerceArchitecture from '@/components/retail/IntelligentCommerceArchitecture'

interface AgentPillar {
  title: string
  bullets: string[]
}

interface AgentTarget {
  value: string
  label: string
}

interface AgentDetail {
  label: string
  text: string
}

interface AgentItem {
  id: string
  tabLabel: string
  tabSublabel: string
  icon: string
  title: string
  intro: string
  pillars?: AgentPillar[]
  targets?: AgentTarget[]
  details?: AgentDetail[]
  note?: string
}

interface RetailData {
  title: string
  description: string
  hero: {
    badge: string
    title: string
    description: string
    outcomes: string[]
  }
  proofStrip: {
    value: string
    label: string
  }[]
  challenge: {
    title: string
    description: string
    systems: string[]
  }
  priorities: {
    badge: string
    title: string
    description: string
    items: {
      title: string
      label: string
      bullets: string[]
      valueExample: string
      icon: 'launch' | 'effort' | 'accuracy'
    }[]
  }
  outcomes: {
    sectionTitle: string
    sectionDescription: string
    items: {
      rank: string
      label: string
      title: string
      description: string
    }[]
  }
  agents: {
    sectionTitle: string
    sectionDescription: string
    items: AgentItem[]
  }
  delivery: {
    sectionTitle: string
    sectionDescription: string
    items: {
      title: string
      description: string
    }[]
    platformLine: string
  }
  trust: {
    sectionTitle: string
    sectionDescription: string
    items: {
      title: string
      description: string
    }[]
  }
  testimonial: {
    quote: string
    name: string
    attribution: string
  }
  partner: {
    content: string
  }
  cta: {
    title: string
    description: string
  }
}

export default function RetailContent({ data }: { data: RetailData }) {
  const [activeTab, setActiveTab] = useState(0)

  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    FileText,
    Ticket,
    ClipboardCheck,
  }

  const priorityIconMap: Record<'launch' | 'effort' | 'accuracy', React.ComponentType<{ className?: string }>> = {
    launch: ArrowUpRight,
    effort: Zap,
    accuracy: ClipboardCheck,
  }

  const selectedAgent = data.agents.items[activeTab] || data.agents.items[0]

  return (
    <>
      <section className="relative overflow-hidden min-h-screen bg-white lg:flex lg:items-center">
        <div className="pointer-events-none absolute -top-24 left-[18%] h-96 w-96 rounded-full bg-[var(--accent-100)]/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-[8%] h-96 w-96 rounded-full bg-cyan-100/40 blur-3xl" />

        <Container className="relative z-10 w-full pt-28 pb-16 md:pt-36 md:pb-24">
          <FadeIn>
            <div className="max-w-5xl mx-auto text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-100)] bg-[var(--accent-50)]/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-900)] mb-7">
                <Briefcase className="h-3.5 w-3.5 text-[var(--accent-900)]" />
                {data.hero.badge}
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl leading-[1.08] tracking-tight text-gray-950 mb-6 font-light">
                Run retail faster and smarter <br />
                <span className="bg-gradient-to-r from-[var(--accent-900)] to-cyan-600 bg-clip-text text-transparent font-semibold">
                  with AI built for your stack.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed max-w-3xl mx-auto mb-10">
                {data.hero.description}
              </p>

              <div className="flex justify-center mb-12">
                <Button href="/contactus" size="lg" className="bg-gray-950 text-white hover:text-white shadow-premium hover:shadow-premium-lg" fillClassName="bg-[var(--accent-900)]">
                  <span className="inline-flex items-center gap-2 whitespace-nowrap">
                    Book a working session
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Button>
              </div>

              <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-3.5 max-w-4xl mx-auto">
                {data.hero.outcomes.map((outcome) => (
                  <StaggerItem key={outcome}>
                    <div className="rounded-2xl border border-gray-200/80 bg-white/60 px-5 py-4 text-sm text-gray-700 font-medium shadow-[0_8px_30px_rgb(0,0,0,0.02)] backdrop-blur-sm transition-all duration-300 hover:border-[var(--accent-200)] hover:bg-white hover:shadow-premium-sm">
                      {outcome}
                    </div>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </div>
          </FadeIn>
        </Container>
      </section>

      <Section className="py-14 md:py-20 bg-white relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_0%,rgba(0,71,171,0.05),transparent_55%)]" />

        <FadeIn>
          <div className="relative z-10 max-w-5xl mb-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-100)] bg-white px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-900)] mb-5">
              <span className="h-2 w-2 rounded-full bg-[var(--accent-900)]" />
              {data.priorities.badge}
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-[4rem] leading-[1.05] tracking-tight text-gray-950 mb-5 font-light max-w-4xl">
              {data.priorities.title}
            </h2>
            <p className="text-base md:text-lg text-gray-600 font-light leading-relaxed max-w-4xl">
              {data.priorities.description}
            </p>
          </div>
        </FadeIn>

        <StaggerChildren className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-5">
          {data.priorities.items.map((item) => {
            const PriorityIcon = priorityIconMap[item.icon]

            return (
              <StaggerItem key={item.title}>
                <article className="h-full rounded-[1.6rem] border border-gray-200 bg-white p-5 md:p-6 shadow-[0_18px_36px_-30px_rgba(15,23,42,0.14)]">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-50)] text-[var(--accent-900)] mb-6">
                    <PriorityIcon className="h-5.5 w-5.5" strokeWidth={1.8} />
                  </div>

                  <h3 className="text-[1.8rem] md:text-[1.95rem] font-semibold leading-[1.08] tracking-tight text-gray-950 mb-2 max-w-[14ch]">
                    {item.title}
                  </h3>

                  <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--accent-700)] font-semibold mb-5">
                    {item.label}
                  </p>

                  <ul className="space-y-3.5 mb-6">
                    {item.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3 text-[15px] text-gray-600 font-light leading-relaxed">
                        <Check className="h-4.5 w-4.5 text-[var(--accent-700)] mt-0.5 flex-shrink-0" strokeWidth={2.4} />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="rounded-[1.25rem] bg-[var(--accent-900)] px-4 py-4 md:px-5 md:py-5 text-white">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--accent-100)]/85 font-semibold mb-2">
                      Value Example
                    </p>
                    <p className="text-base md:text-lg leading-snug font-semibold">
                      {item.valueExample}
                    </p>
                  </div>
                </article>
              </StaggerItem>
            )
          })}
        </StaggerChildren>
      </Section>

      <Section className="py-16 md:py-24 bg-gray-950 relative overflow-hidden" id="challenges">
        <div className="pointer-events-none absolute inset-0 bg-grid-dark" />

        <FadeIn>
          <div className="relative z-10 max-w-3xl mb-12">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--accent-300)] font-semibold mb-3">
              Outcomes, by function
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-white leading-tight mb-4">
              {data.outcomes.sectionTitle}
            </h2>
            <p className="text-base md:text-lg text-gray-400 font-light">
              {data.outcomes.sectionDescription}
            </p>
          </div>
        </FadeIn>

        <StaggerChildren className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.outcomes.items.map((item) => (
            <StaggerItem key={item.rank}>
              <article className="group relative h-full overflow-hidden rounded-2xl border border-gray-800/90 bg-gray-900/90 p-6 shadow-[0_24px_44px_-30px_rgba(0,0,0,0.85)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent-400)]/50 hover:shadow-[0_30px_54px_-30px_rgba(0,71,171,0.5)]">
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(120%_90%_at_0%_0%,rgba(0,71,171,0.18),transparent_60%),radial-gradient(120%_90%_at_100%_100%,rgba(0,184,217,0.15),transparent_65%)]" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-400)] to-transparent -translate-x-[110%] transition-transform duration-700 group-hover:translate-x-0" />

                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <span className="inline-flex items-center whitespace-nowrap rounded-full border border-gray-700 bg-gray-800/85 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-gray-300 md:text-[10px]">
                      {item.label}
                    </span>
                    <span className="text-xs font-bold tracking-[0.14em] text-gray-500">
                      {item.rank}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs md:text-sm text-gray-400 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </Section>

      <Section className="py-16 md:py-24 bg-white">
        <FadeIn>
          <div className="max-w-3xl mb-12">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--accent-900)] font-semibold mb-3">
              What we build for retail
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-gray-950 leading-tight mb-4">
              {data.agents.sectionTitle}
            </h2>
            <p className="text-base md:text-lg text-gray-600 font-light">
              {data.agents.sectionDescription}
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-8 items-start">
          <FadeIn delay={0.05} className="w-full">
            <div className="flex flex-col gap-3 lg:sticky lg:top-24 h-fit">
              {data.agents.items.map((item, index) => {
                const TabIcon = iconMap[item.icon] || FileText
                const isActive = activeTab === index

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(index)
                    }}
                    className={`w-full rounded-2xl border px-5 py-4 text-left transition-all duration-300 flex items-center gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-400)]/60 ${
                      isActive
                        ? 'border-[var(--accent-200)] bg-[var(--accent-50)]/50 shadow-premium-sm'
                        : 'border-transparent bg-transparent hover:border-gray-200 hover:bg-gray-50/50'
                    }`}
                  >
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                        isActive
                          ? 'bg-white border border-[var(--accent-100)] shadow-sm text-[var(--accent-900)]'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      <TabIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-950 block">
                        {item.tabLabel}
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.1em] text-gray-400 font-semibold block mt-0.5">
                        {item.tabSublabel}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </FadeIn>

          {selectedAgent && (
            <FadeIn key={selectedAgent.id} delay={0.1} direction="none" className="min-w-0">
              <article className="rounded-3xl border border-gray-200 bg-white shadow-premium-lg overflow-hidden">
                <div className="border-b border-gray-200 bg-gradient-to-r from-[var(--accent-50)]/40 via-white to-cyan-50/20 p-6 md:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent-100)] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--accent-900)] shadow-sm">
                      <Radio className="h-3.5 w-3.5 text-[var(--accent-900)]" />
                      Active Agent Solution
                    </span>
                    {selectedAgent.tabSublabel === 'Flagship' ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-[var(--accent-900)] font-semibold bg-[var(--accent-50)] border border-[var(--accent-100)] px-3 py-1 rounded-full">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-500)] animate-pulse" />
                        In Build / Demo Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live in Production
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl md:text-3xl font-light text-gray-950 leading-tight mb-3">
                    {selectedAgent.title}
                  </h3>

                  <p className="text-base text-gray-600 font-light leading-relaxed">
                    {selectedAgent.intro}
                  </p>
                </div>

                <div className="p-6 md:p-8">
                  <div className="space-y-8 animate-fadeIn">
                    {selectedAgent.pillars && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedAgent.pillars.map((pillar) => (
                            <div
                              key={pillar.title}
                              className="rounded-2xl border border-gray-200/80 bg-gray-50/50 p-5"
                            >
                              <h4 className="text-sm font-semibold text-gray-950 mb-3 flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-900)]" />
                                {pillar.title}
                              </h4>
                              <ul className="space-y-2">
                                {pillar.bullets.map((bullet) => (
                                  <li key={bullet} className="flex items-start gap-2 text-xs md:text-sm text-gray-600 font-light">
                                    <Check className="h-4 w-4 text-[var(--accent-600)] mt-0.5 flex-shrink-0" strokeWidth={2} />
                                    <span>{bullet}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>

                        {selectedAgent.targets && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5 bg-gray-200 border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                            {selectedAgent.targets.map((target) => (
                              <div key={target.label} className="bg-[#001a45] p-5 text-center flex flex-col justify-center min-h-[120px]">
                                <strong className="text-2xl md:text-3xl font-semibold text-white">
                                  {target.value}
                                </strong>
                                <span className="text-xs text-gray-400 mt-1 leading-normal">
                                  {target.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {!selectedAgent.pillars && selectedAgent.details && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {selectedAgent.details.map((detail) => (
                          <div
                            key={detail.label}
                            className="rounded-2xl border border-gray-200 bg-gray-50/60 p-5 md:min-h-[160px] flex flex-col justify-between"
                          >
                            <div>
                              <strong className="text-[10px] font-semibold tracking-wider text-[var(--accent-900)] uppercase mb-2 block">
                                {detail.label}
                              </strong>
                              <p className="text-sm md:text-base text-gray-950 font-light leading-relaxed">
                                {detail.text}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedAgent.note && (
                      <p className="text-xs text-gray-400 mt-5 italic flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                        {selectedAgent.note}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            </FadeIn>
          )}
        </div>
      </Section>

      <Section className="py-16 md:py-24 bg-white">
        <FadeIn>
          <div className="max-w-[1240px] mx-auto">
            <IntelligentCommerceArchitecture />
          </div>
        </FadeIn>
      </Section>

      <Section className="py-16 md:py-20 bg-gray-50/30 border-y border-gray-100">
        <FadeIn>
          <div className="max-w-4xl mx-auto text-center px-4">
            <p className="text-xl md:text-2xl text-gray-950 font-light leading-relaxed mb-6 italic">
              &ldquo;{data.testimonial.quote}&rdquo;
            </p>
            <p className="text-xs md:text-sm text-[var(--accent-900)] font-semibold uppercase tracking-widest">
              {data.testimonial.name}
            </p>
            <p className="text-xs text-gray-500 font-light mt-1">
              {data.testimonial.attribution}
            </p>
          </div>
        </FadeIn>
      </Section>

      <section className="py-20 md:py-24 bg-white border-t border-gray-200" id="contact">
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
