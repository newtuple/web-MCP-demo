'use client'

// The adaptive homepage. There is deliberately no input box here any more -
// the single conversational entry point is the site assistant chatbot
// (SiteAssistant), which this hero opens. The page itself is the output
// surface: hero, navigation, CTAs and case studies all rebuild around the
// visitor context, whether a human set it through the chatbot or an agent set
// it through the WebMCP tools.

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Bot, Briefcase, Building2, HelpCircle, MessageCircle, PackageCheck, Sparkles } from 'lucide-react'
import Container from '@/components/ui/Container'
import { openAssistant } from '@/lib/assistant/store'
import { type VisitorIntent } from '@/lib/adaptiveSite'
import { useVisitorContext } from './useVisitorContext'

interface CaseStudySummary {
  slug: string
  title: string
  competency: string
  cardSummary: string
}

const intentIcon: Record<VisitorIntent, typeof Bot> = {
  general: Bot,
  services: Building2,
  products: PackageCheck,
  careers: Briefcase,
}

// Always-on WebMCP tools, shown so agent builders can see the surface.
const agentTools = [
  'navigate_site',
  'list_site_pages',
  'render_page_view',
  'close_page_view',
  'prepare_contact_request',
  'infer_visitor_context',
  'set_visitor_context',
  'update_visitor_profile',
  'reorder_navigation',
  'generate_page_variant',
  'select_case_studies',
  'choose_cta',
  'reset_visitor_context',
]

const accents: Record<VisitorIntent, {
  badge: string
  eyebrow: string
  cardTop: string
  cardHover: string
  buttonClass: string
  glow: string
}> = {
  general: {
    badge: 'bg-[var(--accent-50)] text-[var(--accent-900)] ring-[var(--accent-100)]',
    eyebrow: 'text-[var(--accent-900)]',
    cardTop: 'bg-[var(--accent-500)]',
    cardHover: 'hover:border-[var(--accent-200)] hover:shadow-[0_18px_40px_-24px_rgba(0,71,171,0.35)]',
    buttonClass: 'bg-[var(--accent-900)] hover:shadow-premium-lg',
    glow: 'bg-[var(--accent-300)]/30',
  },
  services: {
    badge: 'bg-cyan-50 text-cyan-900 ring-cyan-100',
    eyebrow: 'text-cyan-700',
    cardTop: 'bg-cyan-600',
    cardHover: 'hover:border-cyan-200 hover:shadow-[0_18px_40px_-24px_rgba(8,145,178,0.35)]',
    buttonClass: 'bg-cyan-700 hover:shadow-premium-lg',
    glow: 'bg-cyan-300/30',
  },
  products: {
    badge: 'bg-amber-50 text-amber-900 ring-amber-100',
    eyebrow: 'text-amber-700',
    cardTop: 'bg-amber-500',
    cardHover: 'hover:border-amber-200 hover:shadow-[0_18px_40px_-24px_rgba(217,119,6,0.35)]',
    buttonClass: 'bg-amber-600 hover:shadow-premium-lg',
    glow: 'bg-amber-300/30',
  },
  careers: {
    badge: 'bg-emerald-50 text-emerald-900 ring-emerald-100',
    eyebrow: 'text-emerald-700',
    cardTop: 'bg-emerald-600',
    cardHover: 'hover:border-emerald-200 hover:shadow-[0_18px_40px_-24px_rgba(4,120,87,0.35)]',
    buttonClass: 'bg-emerald-700 hover:shadow-premium-lg',
    glow: 'bg-emerald-300/30',
  },
}

const cx = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(' ')

export default function AdaptiveSiteExperience({ caseStudies }: { caseStudies: CaseStudySummary[] }) {
  const { variant } = useVisitorContext()
  const [showWhy, setShowWhy] = useState(false)
  const [showAgentPanel, setShowAgentPanel] = useState(false)
  const accent = accents[variant.intent]
  const IntentIcon = intentIcon[variant.intent]

  const relevantCaseStudies = useMemo(
    () => caseStudies.filter((study) => variant.caseStudySlugs.includes(study.slug)).slice(0, 3),
    [caseStudies, variant.caseStudySlugs]
  )

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-hero pt-24 md:pt-28">
      <div className="pointer-events-none absolute inset-0 bg-grid" />
      <div className={cx('pointer-events-none absolute left-1/2 top-32 h-[420px] w-[420px] -translate-x-1/2 animate-pulse-subtle rounded-full blur-3xl transition-colors duration-500', accent.glow)} />

      <Container className="relative z-10 flex min-h-[calc(100vh-6rem)] flex-col justify-center py-16">
        <div className="mx-auto w-full max-w-3xl text-center">
          {variant.isPersonalized ? (
            <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setShowWhy((open) => !open)}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                Why am I seeing this?
              </button>
            </div>
          ) : (
            <div className={cx('mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold', accent.badge)}>
              <IntentIcon className="h-4 w-4" />
              {variant.hero.eyebrow}
            </div>
          )}

          {showWhy && (
            <div className="mx-auto mb-6 max-w-xl rounded-md border border-gray-200 bg-white px-4 py-3 text-sm leading-6 text-gray-600">
              {variant.reasonForVisitor}
            </div>
          )}

          <div key={`hero-${variant.intent}`} className="animate-fade-up">
            <h1 className="text-4xl font-extralight tracking-tight text-gray-900 md:text-5xl lg:text-6xl">{variant.hero.title}</h1>
            <p className="mx-auto mt-6 max-w-xl text-lg font-light leading-relaxed text-gray-600 md:text-xl">{variant.hero.description}</p>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => openAssistant()}
              className={cx(
                'inline-flex h-12 items-center justify-center gap-2 rounded-md px-6 text-sm font-semibold text-white transition-all focus-visible:outline-none focus-visible:ring-2',
                accent.buttonClass
              )}
            >
              <MessageCircle className="h-4 w-4" />
              Chat with Newtuple
            </button>
            <Link
              href={variant.primaryCta.href}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-6 text-sm font-semibold text-gray-900 transition-colors hover:border-gray-400"
            >
              {variant.primaryCta.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {variant.suggestedPrompts.length > 0 && (
            <div className="mx-auto mt-6 flex max-w-2xl flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                <Sparkles className="h-3 w-3" />
                Try asking
              </span>
              {variant.suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => openAssistant({ message: prompt, sendNow: true })}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {relevantCaseStudies.length > 0 && (
            <div key={`cases-${variant.intent}`} className="mt-14 grid grid-cols-1 gap-4 text-left sm:grid-cols-3">
              {relevantCaseStudies.map((study, index) => (
                <Link
                  key={study.slug}
                  href={variant.caseStudyHref}
                  style={{ animationDelay: `${index * 80}ms` }}
                  className={cx(
                    'group block animate-fade-up overflow-hidden rounded-lg border border-gray-200 bg-white opacity-0 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.35)] transition-all',
                    accent.cardHover
                  )}
                >
                  <div className={cx('h-1', accent.cardTop)} />
                  <div className="p-4">
                    <div className={cx('text-[11px] font-semibold uppercase tracking-[0.1em]', accent.eyebrow)}>{study.competency}</div>
                    <h3 className="mt-2 text-sm font-semibold text-gray-950">{study.title}</h3>
                    <p className="mt-2 text-xs leading-5 text-gray-600">{study.cardSummary}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-gray-500 group-hover:text-gray-900">
                      See related work
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowAgentPanel((open) => !open)}
            className="mx-auto mt-10 inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-900"
          >
            <Bot className="h-3.5 w-3.5" />
            WebMCP tools available to agents
          </button>
          {showAgentPanel && (
            <div className="mx-auto mt-3 flex max-w-2xl flex-wrap justify-center gap-2">
              {agentTools.map((tool) => (
                <span key={tool} className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-600">
                  {tool}
                </span>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
