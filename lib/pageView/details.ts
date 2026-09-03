// Compact, agent-and-human-readable details for every catalog page, extracted
// from the page's own content/*.md frontmatter at render time (layout.tsx).
// This is what makes an in-place page view (render_page_view) show the REAL
// page's substance - what Newtuple can do, case-study proof, the testimonial -
// instead of just a title and description, and what lets an agent answer
// "do they have experience with X?" from actual site content.
//
// Client-safe: pure functions, no fs. The raw frontmatter is loaded
// server-side and passed down.

export interface PageDetailItem {
  title: string
  description: string
}

export interface PageDetails {
  slug: string
  heroTitle?: string
  heroDescription?: string
  /** "What we can do for you" - the page's own use cases / capabilities. */
  whatWeDo: PageDetailItem[]
  caseStudy?: { title: string; bullets: string[] }
  testimonial?: { quote: string; name?: string; attribution?: string }
  cta?: { title: string; description?: string }
}

type Raw = Record<string, unknown>

const asRecord = (value: unknown): Raw | null =>
  typeof value === 'object' && value !== null && !Array.isArray(value) ? (value as Raw) : null

const asString = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim() ? value.trim() : undefined

// Pages name their capability sections differently; take the first section
// that actually holds {title, description} items.
const ITEM_SECTION_KEYS = ['useCases', 'features', 'capabilities', 'services', 'offerings', 'whyUs', 'benefits', 'agentTypes', 'positions']

function extractItems(frontmatter: Raw): PageDetailItem[] {
  for (const key of ITEM_SECTION_KEYS) {
    const section = asRecord(frontmatter[key])
    const rawItems = Array.isArray(section?.items) ? (section?.items as unknown[]) : Array.isArray(frontmatter[key]) ? (frontmatter[key] as unknown[]) : null
    if (!rawItems) continue
    const items = rawItems
      .map((item) => {
        const record = asRecord(item)
        const title = asString(record?.title)
        const description = asString(record?.description)
        return title && description ? { title, description } : null
      })
      .filter((item): item is PageDetailItem => item !== null)
    if (items.length > 0) return items.slice(0, 6)
  }
  return []
}

export function extractPageDetails(slug: string, frontmatter: Raw): PageDetails {
  const hero = asRecord(frontmatter.hero)
  const caseStudy = asRecord(frontmatter.caseStudy)
  const testimonial = asRecord(frontmatter.testimonial)
  const cta = asRecord(frontmatter.cta)

  const bullets = Array.isArray(caseStudy?.bullets)
    ? (caseStudy?.bullets as unknown[]).map((b) => asString(b)).filter((b): b is string => Boolean(b)).slice(0, 6)
    : []

  return {
    slug,
    heroTitle: asString(hero?.title),
    heroDescription: asString(hero?.description),
    whatWeDo: extractItems(frontmatter),
    caseStudy:
      caseStudy && bullets.length > 0
        ? { title: asString(caseStudy.title) ?? 'Case study', bullets }
        : undefined,
    testimonial: asString(testimonial?.quote)
      ? {
          quote: asString(testimonial?.quote) as string,
          name: asString(testimonial?.name),
          attribution: asString(testimonial?.attribution),
        }
      : undefined,
    cta: asString(cta?.title) ? { title: asString(cta?.title) as string, description: asString(cta?.description) } : undefined,
  }
}
