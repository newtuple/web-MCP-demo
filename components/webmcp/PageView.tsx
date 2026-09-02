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
import { ArrowRight, ArrowUpRight, Bot, MessageCircle, X } from 'lucide-react'
import Container from '@/components/ui/Container'
import { openAssistant } from '@/lib/assistant/store'
import { setContactRegarding } from '@/lib/contactRegarding'
import { PAGE_CATALOG, pageHref } from '@/lib/navigate/schema'
import { closePageView, contextPatchForSlug, openPageView, pageViewStore } from '@/lib/pageView/store'
import { PRODUCTS } from '@/lib/products'
import { useVisitorContext } from './useVisitorContext'

export default function PageView() {
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
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent-200)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--accent-900)]">
              <Bot className="h-3.5 w-3.5" />
              Rendered in place by WebMCP - no page load
            </span>
            <button
              type="button"
              onClick={closePageView}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900"
            >
              <X className="h-3.5 w-3.5" />
              Back to this page
            </button>
          </div>

          <div className="mt-8 animate-fade-up">
            {product && (
              <div className={`text-xs font-semibold uppercase tracking-[0.14em] ${product.accent.text}`}>{product.tagline}</div>
            )}
            <h1 className="mt-2 text-4xl font-extralight tracking-tight text-gray-900 md:text-5xl">{page.title}</h1>
            <p className="mt-5 max-w-2xl text-lg font-light leading-relaxed text-gray-600">{page.description}</p>
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
