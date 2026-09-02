'use client'

// The adaptive homepage. There is deliberately no input box here any more -
// the single conversational entry point is the site assistant chatbot
// (SiteAssistant), which this hero opens. The page itself is the output
// surface: hero, navigation and CTAs rebuild around the visitor context,
// whether a human set it through the chatbot or an agent set it through the
// WebMCP tools.

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Bot, Briefcase, Building2, HelpCircle, MessageCircle, PackageCheck, Sparkles } from 'lucide-react'
import Container from '@/components/ui/Container'
import { openAssistant } from '@/lib/assistant/store'
import { type VisitorIntent } from '@/lib/adaptiveSite'
import { useVisitorContext } from './useVisitorContext'

const intentIcon: Record<VisitorIntent, typeof Bot> = {
  general: Bot,
  services: Building2,
  products: PackageCheck,
  careers: Briefcase,
}

// Always-on WebMCP tools, shown so agent builders can see the surface.
const agentTools = [
  'get_site_state',
  'navigate_site',
  'list_site_pages',
  'render_page_view',
  'close_page_view',
  'prepare_contact_request',
  'submit_contact_request',
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
  buttonClass: string
  glow: string
}> = {
  general: {
    badge: 'bg-[var(--accent-50)] text-[var(--accent-900)] ring-1 ring-[var(--accent-100)]',
    buttonClass: 'bg-[var(--accent-900)] hover:shadow-premium-lg',
    glow: 'bg-[var(--accent-300)]/30',
  },
  services: {
    badge: 'bg-cyan-50 text-cyan-900 ring-1 ring-cyan-100',
    buttonClass: 'bg-cyan-700 hover:shadow-premium-lg',
    glow: 'bg-cyan-300/30',
  },
  products: {
    badge: 'bg-amber-50 text-amber-900 ring-1 ring-amber-100',
    buttonClass: 'bg-amber-600 hover:shadow-premium-lg',
    glow: 'bg-amber-300/30',
  },
  careers: {
    badge: 'bg-emerald-50 text-emerald-900 ring-1 ring-emerald-100',
    buttonClass: 'bg-emerald-700 hover:shadow-premium-lg',
    glow: 'bg-emerald-300/30',
  },
}

const cx = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(' ')

export default function AdaptiveSiteExperience() {
  const { variant } = useVisitorContext()
  const [showWhy, setShowWhy] = useState(false)
  const [showAgentPanel, setShowAgentPanel] = useState(false)
  const accent = accents[variant.intent]
  const IntentIcon = intentIcon[variant.intent]

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-hero pt-24 md:pt-28">
      <div className="pointer-events-none absolute inset-0 bg-grid" />
      <div className={cx('pointer-events-none absolute left-1/2 top-32 h-[420px] w-[420px] -translate-x-1/2 animate-pulse-subtle rounded-full blur-3xl transition-colors duration-500', accent.glow)} />

      <Container className="relative z-10 flex min-h-[calc(100vh-6rem)] flex-col justify-center py-16">
        <div className="mx-auto w-full max-w-3xl text-center">
          <div className={cx('mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold', accent.badge)}>
            <IntentIcon className="h-4 w-4" />
            {variant.hero.eyebrow}
          </div>

          {variant.isPersonalized && (
            <div className="mb-6">
              <button
                type="button"
                onClick={() => setShowWhy((open) => !open)}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                Why am I seeing this?
              </button>
              {showWhy && (
                <div className="mx-auto mt-3 max-w-xl rounded-md border border-gray-200 bg-white px-4 py-3 text-sm leading-6 text-gray-600">
                  {variant.reasonForVisitor}
                </div>
              )}
            </div>
          )}

          <div key={`hero-${variant.intent}`} className="animate-fade-up">
            <h1 className="text-4xl font-extralight tracking-tight text-gray-900 md:text-6xl lg:text-7xl">{variant.hero.title}</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg font-light leading-relaxed text-gray-600 md:text-xl">{variant.hero.description}</p>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={() => openAssistant()}
              className={cx(
                'inline-flex h-12 items-center justify-center gap-2 rounded-md px-7 text-sm font-semibold text-white shadow-premium transition-all focus-visible:outline-none focus-visible:ring-2',
                accent.buttonClass
              )}
            >
              <MessageCircle className="h-4 w-4" />
              Chat with Newtuple
            </button>
            <Link
              href={variant.secondaryCta.href}
              className="group inline-flex h-12 items-center gap-1.5 px-2 text-sm font-semibold text-gray-600 transition-colors hover:text-gray-900"
            >
              {variant.secondaryCta.label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {variant.suggestedPrompts.length > 0 && (
            <div className="mx-auto mt-16 max-w-2xl">
              <div className="flex items-center justify-center gap-3">
                <span className="h-px w-10 bg-gray-200" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">Try asking</span>
                <span className="h-px w-10 bg-gray-200" />
              </div>
              <div className="mt-5 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
                {variant.suggestedPrompts.slice(0, 3).map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => openAssistant({ message: prompt, sendNow: true })}
                    className="group flex flex-1 items-start gap-2.5 rounded-xl border border-gray-200 bg-white/80 px-4 py-3.5 text-left backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-[var(--accent-300)] hover:shadow-premium sm:max-w-[15rem]"
                  >
                    <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent-500)]" />
                    <span className="text-[13px] leading-5 text-gray-600 transition-colors group-hover:text-gray-900">{prompt}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowAgentPanel((open) => !open)}
            className="mx-auto mt-14 inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-900"
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
