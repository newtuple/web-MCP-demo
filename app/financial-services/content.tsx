'use client'

import {
  ArrowRight,
  CheckCircle2,
  FileText,
  ShieldCheck,
} from 'lucide-react'
import DeploymentOptions from '@/components/sections/DeploymentOptions'
import Section from '@/components/ui/Section'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import FadeIn from '@/components/motion/FadeIn'
import StaggerChildren, { StaggerItem } from '@/components/motion/StaggerChildren'
import TypingBlock from '@/components/motion/TypingBlock'
import { resolveIcon } from '@/lib/icons'

interface FinancialServicesData {
  title: string
  description: string
  hero: {
    badge: string
    title: string
    description: string
  }
  challenge: {
    title: string
    description: string
  }
  caseStudy: {
    badge: string
    title: string
    bullets: string[]
    quote: string
  }
  useCases: {
    sectionTitle: string
    items: { title: string; icon: string; description: string }[]
  }
  deployment: {
    title: string
    description: string
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
  }
}

const OPS_SIGNALS = [
  'Ingesting monthly filings and statements',
  'Routing low-confidence extraction to review queue',
  'Reconciling cross-system portfolio records',
  'Publishing audit-ready decision trail',
]

export default function FinancialServicesContent({ data }: { data: FinancialServicesData }) {
  const useCases = data.useCases.items.map((item) => ({
    ...item,
    icon: resolveIcon(item.icon),
  }))

  return (
    <>
      <section className="relative overflow-hidden min-h-screen bg-white lg:flex lg:items-center">
        <div className="pointer-events-none absolute -top-24 left-[20%] h-72 w-72 rounded-full bg-[var(--accent-100)]/55 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-[8%] h-64 w-64 rounded-full bg-cyan-100/55 blur-3xl" />
        <Container className="relative z-10 w-full pt-28 pb-16 md:pt-36 md:pb-24">
          <FadeIn>
            <div className="max-w-5xl mx-auto text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-100)] bg-[var(--accent-50)]/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-900)] mb-7">
                <ShieldCheck className="h-3.5 w-3.5" />
                {data.hero.badge}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl leading-[1.04] tracking-tight text-gray-950 mb-6 font-light">
                GenAI that reads, reasons,
                <br />
                <span className="font-semibold text-[var(--accent-900)]">and acts on financial data</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed max-w-3xl mx-auto mb-10">
                {data.hero.description}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                <Button href="/contactus" size="lg" className="bg-gray-950 text-white hover:text-white" fillClassName="bg-[var(--accent-900)]">
                  <span className="inline-flex items-center gap-2 whitespace-nowrap">
                    Talk to our experts
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Button>
                <Button href="#financial-use-cases" variant="outline" size="lg" className="border-gray-300 text-gray-900 hover:text-white" fillClassName="bg-[var(--accent-900)]">
                  Explore use cases
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-w-3xl mx-auto">
                {OPS_SIGNALS.map((signal) => (
                  <p
                    key={signal}
                    className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs md:text-sm text-gray-600 font-light"
                  >
                    {signal}
                  </p>
                ))}
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>

      <Section className="py-14 md:py-16 bg-white">
        <FadeIn>
          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-8 lg:gap-10 items-start">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--accent-900)] font-semibold mb-2">
                Core Challenge
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
                {data.challenge.title}
              </h2>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50/80 p-5 md:p-6 shadow-[0_14px_26px_-22px_rgba(15,23,42,0.25)]">
              <p className="text-base md:text-lg text-gray-600 font-light leading-relaxed">
                {data.challenge.description}
              </p>
            </div>
          </div>
        </FadeIn>
      </Section>

      <Section className="py-14 md:py-16 bg-gray-50">
        <FadeIn>
          <div className="text-center mb-10 md:mb-12">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--accent-900)] font-semibold mb-2">
              Proof of Execution
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {data.caseStudy.title}
            </h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr] gap-6 md:gap-8">
          <FadeIn delay={0.05}>
            <article className="group relative h-full overflow-hidden rounded-3xl border border-gray-200/90 bg-white p-5 md:p-6 shadow-[0_20px_40px_-28px_rgba(15,23,42,0.3)]">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-400)] to-transparent -translate-x-[110%] transition-transform duration-700 group-hover:translate-x-0" />
              <span className="inline-flex items-center rounded-full border border-[var(--accent-100)] bg-[var(--accent-50)]/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--accent-900)] mb-4">
                {data.caseStudy.badge}
              </span>
              <div className="space-y-3.5">
                {data.caseStudy.bullets.map((bullet) => (
                  <div key={bullet} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4.5 w-4.5 text-[var(--accent-900)] mt-0.5 flex-shrink-0" strokeWidth={1.6} />
                    <p className="text-sm md:text-base text-gray-600 font-light leading-relaxed">{bullet}</p>
                  </div>
                ))}
              </div>
            </article>
          </FadeIn>

          <FadeIn delay={0.1}>
            <article className="group relative h-full overflow-hidden rounded-3xl border border-gray-200/90 bg-white p-5 md:p-6 shadow-[0_20px_40px_-28px_rgba(15,23,42,0.3)]">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-400)] to-transparent -translate-x-[110%] transition-transform duration-700 group-hover:translate-x-0" />
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--accent-100)] bg-[var(--accent-50)] mb-4">
                <FileText className="h-5 w-5 text-[var(--accent-900)]" strokeWidth={1.6} />
              </div>
              <p className="text-lg md:text-xl text-gray-900 leading-relaxed font-light mb-4">
                &ldquo;{data.caseStudy.quote}&rdquo;
              </p>
              <p className="text-sm text-gray-500 uppercase tracking-[0.12em] font-semibold">
                Production Outcome
              </p>
              <p className="text-sm text-gray-600 font-light mt-1 leading-relaxed">
                Specialized agents, confidence routing, and full auditability in a single operating flow.
              </p>
            </article>
          </FadeIn>
        </div>
      </Section>

      <Section id="financial-use-cases" className="py-14 md:py-16 bg-white">
        <FadeIn>
          <div className="text-center mb-10 md:mb-12">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--accent-900)] font-semibold mb-2">
              Financial Workloads
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {data.useCases.sectionTitle}
            </h2>
          </div>
        </FadeIn>

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {useCases.map((item, index) => (
            <StaggerItem key={item.title}>
              <article className="group relative h-full min-h-[250px] overflow-hidden rounded-2xl border border-gray-200/90 bg-white p-5 md:p-6 shadow-[0_14px_28px_-22px_rgba(15,23,42,0.3)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent-300)] hover:shadow-[0_24px_42px_-26px_rgba(0,71,171,0.4)]">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-400)] to-transparent -translate-x-[110%] transition-transform duration-700 group-hover:translate-x-0" />
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--accent-100)] bg-[var(--accent-50)] transition-colors duration-300 group-hover:bg-[var(--accent-100)]">
                    <item.icon className="h-6 w-6 text-[var(--accent-900)]" strokeWidth={1.5} />
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

      <DeploymentOptions
        title={data.deployment.title}
        description={data.deployment.description}
        theme="dark"
      />

      <Section className="py-14 md:py-16 bg-white">
        <FadeIn>
          <div className="max-w-4xl mx-auto rounded-3xl border border-gray-200/90 bg-white p-6 md:p-8 shadow-[0_24px_40px_-28px_rgba(15,23,42,0.3)]">
            <p className="text-2xl md:text-3xl text-gray-900 leading-relaxed font-light mb-5">
              &ldquo;{data.testimonial.quote}&rdquo;
            </p>
            <p className="text-sm text-[var(--accent-900)] font-semibold uppercase tracking-[0.12em]">
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
