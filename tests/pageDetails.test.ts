import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { describe, expect, it } from 'vitest'
import { extractPageDetails } from '../lib/pageView/details'
import { PAGE_CATALOG } from '../lib/navigate/schema'

const load = (slug: string) =>
  matter(fs.readFileSync(path.join(process.cwd(), 'content', `${slug}.md`), 'utf-8')).data as Record<string, unknown>

describe('page details extraction (agent-visible site substance)', () => {
  it('social-care-healthcare carries use cases, the case study, and the testimonial', () => {
    const details = extractPageDetails('social-care-healthcare', load('social-care-healthcare'))
    expect(details.whatWeDo.length).toBeGreaterThanOrEqual(4)
    expect(details.whatWeDo.map((i) => i.title)).toContain('Referral Management & Triage')
    expect(details.caseStudy?.title).toContain('referral management')
    expect(details.testimonial?.quote).toContain('reliable partner')
    expect(details.cta?.title).toBeTruthy()
  })

  it('every catalog page except home yields details without throwing', () => {
    for (const page of PAGE_CATALOG.filter((p) => p.slug !== 'home')) {
      const details = extractPageDetails(page.slug, load(page.slug))
      expect(details.slug).toBe(page.slug)
    }
  })

  it('handles empty frontmatter gracefully', () => {
    const details = extractPageDetails('anything', {})
    expect(details.whatWeDo).toEqual([])
    expect(details.caseStudy).toBeUndefined()
    expect(details.testimonial).toBeUndefined()
  })
})
