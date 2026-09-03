'use client'

// Renders the page requested through render_page_view (or a navigate decision)
// on the CURRENT screen. The underlying route's content is hidden by CSS while
// this view is open - see html[data-page-view] main in globals.css - and the
// visitor context is patched so navigation, accents, gradients and every other
// adaptive surface re-theme to match the page being shown. Closing the view
// removes the attribute and the original content is back, untouched.

import { useEffect, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight, ArrowUpRight, MessageCircle } from 'lucide-react'
import Container from '@/components/ui/Container'
import { openAssistant } from '@/lib/assistant/store'
import { setContactRegarding } from '@/lib/contactRegarding'
import { PAGE_CATALOG, pageHref } from '@/lib/navigate/schema'
import { type PageDetails } from '@/lib/pageView/details'
import { closePageView, contextPatchForSlug, openPageView, pageViewStore } from '@/lib/pageView/store'
import { PRODUCTS } from '@/lib/products'
import { useVisitorContext } from './useVisitorContext'

export default function PageView({ details = {} }: { details?: Record<string, PageDetails> }) {
  const { slug } = useSyncExternalStore(pageViewStore.subscribe, pageViewStore.getSnapshot, pageViewStore.getServerSnapshot)
  const pathname = usePathname()
  const { variant, updateContext } = useVisitorContext()

  // A real route change (link click, back button) always wins: the visitor
  // asked for that page's own content, so the morph closes.
  useEffect(() => {
    closePageView()
  }, [pathname])

  // Dev-only escape hatch so the view can be driven from the console when no
  // WebMCP-capable agent is attached. Stripped from production builds.
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return
    const w = window as unknown as Record<string, unknown>
    w.__newtupleOpenPageView = openPageView
    w.__newtupleClosePageView = closePageView
  }, [])

  // The CSS switch: while a view is open, the route's own <main> is hidden.
  useEffect(() => {
    const root = document.documentElement
    if (slug) root.setAttribute('data-page-view', slug)
    else root.removeAttribute('data-page-view')
    return () => root.removeAttribute('data-page-view')
  }, [slug])

  // Opening a view re-themes the whole site around that page and records it
  // as what a contact request would be regarding.
  useEffect(() => {
    if (!slug) return
    updateContext(contextPatchForSlug(slug))
    const page = PAGE_CATALOG.find((p) => p.slug === slug)
    if (page) setContactRegarding(page.title)
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    // updateContext is stable per useVisitorContext's useCallback
  }, [slug, updateContext])

  if (!slug) return null

  const page = PAGE_CATALOG.find((p) => p.slug === slug)
  if (!page) return null

  const detail = details[slug]
  const product = PRODUCTS.find((p) => p.slug === slug) ?? null
  const related = product
    ? PRODUCTS.filter((p) => p.slug !== slug).map((p) => ({ label: p.name, slug: p.slug }))
    : PAGE_CATALOG.filter((p) => p.slug !== slug && p.slug !== 'home')
        .slice(0, 6)
        .map((p) => ({ label: p.title, slug: p.slug }))

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-hero pt-28 md:pt-32 pb-20">
      <div className="pointer-events-none absolute inset-0 bg-grid" />
      <Container className="relative z-10">
        <div className="mx-auto max-w-3xl">
          <div className="animate-fade-up">
            {product && (
              <div className={`text-xs font-semibold uppercase tracking-[0.14em] ${product.accent.text}`}>{product.tagline}</div>
            )}
            <h1 className="mt-2 text-4xl font-extralight tracking-tight text-gray-900 md:text-5xl">{detail?.heroTitle ?? page.title}</h1>
            <p className="mt-5 max-w-2xl text-lg font-light leading-relaxed text-gray-600">{detail?.heroDescription ?? page.description}</p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => openAssistant({ contact: true, regarding: product ? product.name : page.title })}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[var(--accent-900)] px-5 text-sm font-semibold text-white transition-shadow hover:shadow-premium-lg"
            >
              <MessageCircle className="h-4 w-4" />
              Contact about {product ? product.name : 'this'}
            </button>
            <Link
              href={pageHref(slug)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-5 text-sm font-semibold text-gray-900 transition-colors hover:border-gray-400"
            >
              Open the full page
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {variant.isPersonalized && (
            <p className="mt-6 text-xs font-medium uppercase tracking-wide text-gray-400">{variant.adaptationSummary}</p>
          )}

          {detail && detail.whatWeDo.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-900)]">What we can do for you</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {detail.whatWeDo.map((item) => (
                  <div key={item.title} className="rounded-xl border border-gray-200 bg-white/80 p-4">
                    <h3 className="text-sm font-semibold text-gray-950">{item.title}</h3>
                    <p className="mt-1.5 text-xs leading-5 text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {detail?.caseStudy && (
            <div className="mt-10 rounded-xl border border-[var(--accent-200)] bg-white p-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-900)]">Proven in production</div>
              <h3 className="mt-1.5 text-base font-semibold text-gray-950">{detail.caseStudy.title}</h3>
              <ul className="mt-3 space-y-2">
                {detail.caseStudy.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2 text-sm leading-6 text-gray-600">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-500)]" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {detail?.testimonial && (
            <blockquote className="mt-8 rounded-xl bg-[var(--accent-50)] p-5">
              <p className="text-sm italic leading-6 text-gray-700">&ldquo;{detail.testimonial.quote}&rdquo;</p>
              {(detail.testimonial.name || detail.testimonial.attribution) && (
                <footer className="mt-3 text-xs font-semibold text-[var(--accent-900)]">
                  {[detail.testimonial.name, detail.testimonial.attribution].filter(Boolean).join(' · ')}
                </footer>
              )}
            </blockquote>
          )}

          {detail?.cta && (
            <div className="mt-10 rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="text-base font-semibold text-gray-950">{detail.cta.title}</h3>
              {detail.cta.description && <p className="mt-1.5 text-sm leading-6 text-gray-600">{detail.cta.description}</p>}
              <button
                type="button"
                onClick={() => openAssistant({ contact: true, regarding: product ? product.name : page.title })}
                className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[var(--accent-900)] px-4 text-sm font-semibold text-white transition-shadow hover:shadow-premium-lg"
              >
                <MessageCircle className="h-4 w-4" />
                Start the conversation
              </button>
            </div>
          )}

          {related.length > 0 && (
            <div className="mt-12">
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                {product ? 'Other Newtuple products' : 'Also on newtuple.com'}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {related.map((item) => (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => openPageView(item.slug)}
                    className="inline-flex items-center gap-1 rounded-full border border-[var(--accent-200)] bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-[var(--accent-400)] hover:text-[var(--accent-900)]"
                  >
                    {item.label}
                    <ArrowRight className="h-3 w-3" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
