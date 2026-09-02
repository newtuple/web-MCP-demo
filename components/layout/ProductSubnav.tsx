'use client'

// Each product gets its own secondary navbar, rendered under the main site
// header only on that product's page (config in lib/products.ts). It also
// records the product as the visitor's current "Regarding" topic, so a
// contact request started anywhere afterwards - the /contactus page, the
// chatbot, or the CTA here - opens with that field already filled in.

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageCircle } from 'lucide-react'
import Container from '@/components/ui/Container'
import { openAssistant } from '@/lib/assistant/store'
import { setContactRegarding } from '@/lib/contactRegarding'
import { productForPath } from '@/lib/products'
import { useVisitorContext } from '@/components/webmcp/useVisitorContext'

export default function ProductSubnav() {
  const pathname = usePathname()
  const product = productForPath(pathname)
  const { variant } = useVisitorContext()

  useEffect(() => {
    if (product) setContactRegarding(product.name)
  }, [product])

  if (!product) return null

  // The main header drops to top-8 when the personalization strip is shown
  // (see Navigation.tsx), so this bar follows it down.
  const top = variant.isPersonalized ? 'top-24 md:top-28' : 'top-16 md:top-20'

  return (
    <div className={`fixed left-0 right-0 z-30 border-b bg-white/90 backdrop-blur-xl ${top} ${product.accent.border}`}>
      <Container>
        <div className="flex h-12 items-center justify-between gap-4">
          <div className="flex min-w-0 items-baseline gap-3">
            <span className={`text-sm font-bold ${product.accent.text}`}>{product.name}</span>
            <span className="hidden truncate text-xs text-gray-500 sm:inline">{product.tagline}</span>
          </div>

          <div className="flex items-center gap-4">
            <nav className="hidden items-center gap-4 md:flex">
              {product.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs font-medium text-gray-600 transition-colors hover:text-gray-900"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <button
              type="button"
              onClick={() => openAssistant({ contact: true, regarding: product.name })}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold text-white transition-colors ${product.accent.button}`}
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Contact about {product.name}
            </button>
          </div>
        </div>
      </Container>
    </div>
  )
}
