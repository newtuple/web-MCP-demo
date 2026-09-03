'use client'

// Site-wide personalization band, rendered above the footer on every page
// once a visitor context is set (via the chatbot or the WebMCP tools). Pages
// have bespoke section layouts that cannot each be rewritten per visitor, so
// this is the guaranteed, uniform place where the adaptation shows up as
// content - not just as the accent repaint - on the whole site.

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight, Bot, MessageCircle, RotateCcw } from 'lucide-react'
import Container from '@/components/ui/Container'
import { openAssistant } from '@/lib/assistant/store'
import { useVisitorContext } from './useVisitorContext'

export default function AdaptiveRecommendations() {
  const pathname = usePathname()
  const { variant, resetContext } = useVisitorContext()

  // The homepage is already fully adaptive - this band is for every other page.
  if (!variant.isPersonalized || pathname === '/') return null

  return (
    <section className="border-t border-[var(--accent-100)] bg-[var(--accent-50)]">
      <Container>
        <div className="flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--accent-900)] ring-1 ring-[var(--accent-200)]">
              <Bot className="h-3.5 w-3.5" />
              {variant.hero.eyebrow}
            </div>
            <h2 className="mt-3 text-2xl font-light text-gray-900 md:text-3xl">{variant.hero.title}</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">{variant.adaptationSummary}</p>
            <nav className="mt-4 flex flex-wrap gap-2">
              {variant.navigation.map((item, index) => (
                <Link
                  key={`${item.label}-${index}`}
                  href={item.href}
                  className="inline-flex items-center gap-1 rounded-full border border-[var(--accent-200)] bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-[var(--accent-400)] hover:text-[var(--accent-900)]"
                >
                  {item.label}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex flex-col items-start gap-3 md:items-end">
            <Link
              href={variant.primaryCta.href}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[var(--accent-900)] px-5 text-sm font-semibold text-white transition-shadow hover:shadow-premium-lg"
            >
              {variant.primaryCta.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={() => openAssistant({ contact: true, regarding: variant.context.goal })}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[var(--accent-300)] bg-white px-5 text-sm font-semibold text-[var(--accent-900)] transition-colors hover:border-[var(--accent-500)]"
            >
              <MessageCircle className="h-4 w-4" />
              Contact about {variant.context.goal}
            </button>
            <button
              type="button"
              onClick={resetContext}
              className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 transition-colors hover:text-gray-900"
            >
              <RotateCcw className="h-3 w-3" />
              Reset personalization
            </button>
          </div>
        </div>
      </Container>
    </section>
  )
}
