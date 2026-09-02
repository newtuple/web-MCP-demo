'use client'

// Bridge between the WebMCP careers tools and the careers page UI, same
// registration pattern as lib/navigate/router.ts. The page registers a
// handler that applies filters to its own on-screen controls; a filter
// applied before the page is mounted (an agent filtering from anywhere on the
// site, right before navigating there) is held and replayed on mount - so
// the human lands on an already-filtered careers page.

import type { CareersFilters } from './roles'

type FilterHandler = (filters: CareersFilters) => void

let handler: FilterHandler | null = null
let pending: CareersFilters | null = null

export function registerCareersFilterHandler(fn: FilterHandler) {
  handler = fn
  if (pending) {
    const filters = pending
    pending = null
    fn(filters)
  }
  return () => {
    if (handler === fn) handler = null
  }
}

export function applyCareersFilters(filters: CareersFilters) {
  if (handler) handler(filters)
  else pending = filters
}
