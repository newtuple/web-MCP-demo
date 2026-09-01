'use client'

// Site-wide entry point, and the bridge that lets the store navigate.
//
// Replaces the old modal: nothing renders over the page any more. The pill
// takes the visitor to /demo, and registering the router with the store means
// an agent calling build_demo_app moves the page there too, client-side, with
// its WebMCP tools staying registered across the transition.

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { DEMO_ROUTE, setDemoNavigator } from '@/lib/demoApp/store'
import { useDemoSnapshot } from './useDemoAppSnapshot'

export default function DemoAppLauncher() {
  const router = useRouter()
  const pathname = usePathname()
  const snapshot = useDemoSnapshot()

  useEffect(() => setDemoNavigator((path) => router.push(path)), [router])

  if (pathname?.startsWith(DEMO_ROUTE)) return null

  const hasSession = Boolean(snapshot.session)

  return (
    <button
      type="button"
      onClick={() => router.push(DEMO_ROUTE)}
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-xl transition hover:border-slate-400 print:hidden"
    >
      <Sparkles className="h-4 w-4 text-[var(--accent-900,#0047AB)]" />
      {hasSession ? `Open ${snapshot.session?.app.title}` : 'Build a live demo'}
      <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
    </button>
  )
}
