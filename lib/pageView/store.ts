'use client'

// In-place page rendering, the WebMCP-native alternative to routing.
//
// Instead of sending the visitor to another URL, render_page_view morphs the
// CURRENT screen into the requested page: the route's own content is hidden
// with CSS (html[data-page-view] main { display:none }, see globals.css) and
// components/webmcp/PageView.tsx renders the requested page's view in its
// place, while the visitor-context tools re-theme navigation and accents to
// match. No page load, no route change - the URL stays where it was.

import { PAGE_CATALOG, pageHref } from '@/lib/navigate/schema'
import type { VisitorContext } from '@/lib/adaptiveSite'

export interface PageViewState {
  slug: string | null
}

const CLOSED: PageViewState = { slug: null }

let state: PageViewState = CLOSED
const listeners = new Set<() => void>()

const emit = () => listeners.forEach((listener) => listener())

export const pageViewStore = {
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
  getSnapshot: (): PageViewState => state,
  // Stable reference: useSyncExternalStore requires the same object on every
  // server render.
  getServerSnapshot: (): PageViewState => CLOSED,
}

export function isPageViewSlug(slug: string): boolean {
  return PAGE_CATALOG.some((page) => page.slug === slug)
}

/** Morph the current screen into the given catalog page. Unknown slugs are ignored. */
export function openPageView(slug: string): boolean {
  if (!isPageViewSlug(slug) || slug === 'home') return false
  state = { slug }
  emit()
  return true
}

/** Restore the underlying route's own content. */
export function closePageView() {
  if (state.slug === null) return
  state = CLOSED
  emit()
}

export { pageHref }

/** How each page view re-themes the site: the context patch the visitor-context
 * tools would apply for a visitor focused on that page. */
export function contextPatchForSlug(slug: string): Partial<VisitorContext> {
  const page = PAGE_CATALOG.find((p) => p.slug === slug)
  const goal = page ? page.title : 'AI transformation'

  if (['dialogtuple', 'flowtuple', 'gaugetuple', 'omnituple', 'uttertuple', 'genai-accelerators', 'newtuple-ai-apps'].includes(slug)) {
    return { intent: 'products', goal }
  }
  if (['careers', 'life-at-newtuple'].includes(slug)) {
    return { intent: 'careers', goal }
  }
  const industryBySlug: Record<string, string> = {
    retail: 'retail',
    'financial-services': 'financial services',
    aviation: 'aviation',
    'social-care-healthcare': 'healthcare',
    agencies: 'agencies',
  }
  return { intent: 'services', goal, ...(industryBySlug[slug] ? { industry: industryBySlug[slug] } : {}) }
}
