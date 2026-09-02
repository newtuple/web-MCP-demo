// One config per product, driving that product's own subnavbar
// (components/layout/ProductSubnav.tsx) and the auto-filled Regarding value
// on contact requests started from that product's page.
//
// Omnituple is deliberately absent - its page is hidden in app/_pageRegistry.ts.

export interface ProductLink {
  label: string
  /** In-page anchor or route the product's own subnav links to. */
  href: string
}

export interface ProductConfig {
  slug: string
  name: string
  tagline: string
  /** Tailwind classes for the subnav's accent bits, so each product reads as its own. */
  accent: {
    text: string
    border: string
    button: string
  }
  links: ProductLink[]
}

export const PRODUCTS: ProductConfig[] = [
  {
    slug: 'dialogtuple',
    name: 'Dialogtuple',
    tagline: 'Multi-agent platform',
    accent: { text: 'text-blue-700', border: 'border-blue-200', button: 'bg-blue-700 hover:bg-blue-800' },
    links: [
      { label: 'Build AI Agents', href: '/newtuple-agents' },
      { label: 'GenAI Accelerators', href: '/genai-accelerators' },
    ],
  },
  {
    slug: 'flowtuple',
    name: 'Flowtuple',
    tagline: 'Humans and agents in one system of work',
    accent: { text: 'text-indigo-700', border: 'border-indigo-200', button: 'bg-indigo-700 hover:bg-indigo-800' },
    links: [
      { label: 'Agents as a Service', href: '/genai-powered-business-automation' },
      { label: 'GenAI Accelerators', href: '/genai-accelerators' },
    ],
  },
  {
    slug: 'gaugetuple',
    name: 'Gaugetuple',
    tagline: 'LLM evaluation & quality scoring',
    accent: { text: 'text-amber-700', border: 'border-amber-200', button: 'bg-amber-600 hover:bg-amber-700' },
    links: [
      { label: 'Build AI Apps', href: '/newtuple-ai-apps' },
      { label: 'GenAI Accelerators', href: '/genai-accelerators' },
    ],
  },
  {
    slug: 'uttertuple',
    name: 'Uttertuple',
    tagline: 'Voice AI accelerator',
    accent: { text: 'text-emerald-700', border: 'border-emerald-200', button: 'bg-emerald-700 hover:bg-emerald-800' },
    links: [
      { label: 'Build AI Apps', href: '/newtuple-ai-apps' },
      { label: 'GenAI Accelerators', href: '/genai-accelerators' },
    ],
  },
  {
    slug: 'genai-accelerators',
    name: 'GenAI Accelerators',
    tagline: 'Turn-key GenAI base applications',
    accent: { text: 'text-cyan-700', border: 'border-cyan-200', button: 'bg-cyan-700 hover:bg-cyan-800' },
    links: [
      { label: 'Dialogtuple', href: '/dialogtuple' },
      { label: 'Flowtuple', href: '/flowtuple' },
      { label: 'Gaugetuple', href: '/gaugetuple' },
      { label: 'Uttertuple', href: '/uttertuple' },
    ],
  },
]

export function productForPath(pathname: string | null | undefined): ProductConfig | null {
  if (!pathname) return null
  const slug = pathname.replace(/^\/+|\/+$/g, '')
  return PRODUCTS.find((product) => product.slug === slug) ?? null
}

/** Human label for where a visitor is, used to auto-fill Regarding from any page. */
export function regardingForPath(pathname: string | null | undefined): string {
  const product = productForPath(pathname)
  return product ? product.name : ''
}
