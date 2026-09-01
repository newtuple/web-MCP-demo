'use client'

// Same bridge pattern as lib/demoApp/store.ts's setDemoNavigator, generalised
// to any real page instead of one fixed route. Registered once, from
// DemoAppLauncher (which already holds the Next.js router instance), so
// navigate_site can move the browser client-side without a full reload and
// without every caller needing its own useRouter().

let navigate: ((path: string) => void) | null = null

export function setSiteNavigator(fn: (path: string) => void) {
  navigate = fn
}

/** No-ops before the router is registered (e.g. the very first paint) rather than throwing. */
export function goToSitePage(path: string) {
  navigate?.(path)
}
