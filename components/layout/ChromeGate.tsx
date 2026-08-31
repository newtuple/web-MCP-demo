'use client'

// The generated demo at /demo is a full page in its own right - a landing
// surface has its own hero and nav language - so the site header and footer
// step aside there instead of framing it like a subpage.

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

export default function ChromeGate({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  if (pathname?.startsWith('/demo')) return null
  return <>{children}</>
}
