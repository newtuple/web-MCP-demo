import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants'

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    '/',
    '/about-us',
    '/newtuple-agents',
    '/newtuple-ai-apps',
    '/dialogtuple',
    '/gaugetuple',
    '/flowtuple',
    // '/omnituple', // Temporarily hidden while Omnituple is not working.
    '/genai-accelerators',
    '/genai-powered-business-automation',
    '/ai-transformation-for-the-enterprise',
    '/0-to-genai',
    '/financial-services',
    '/retail',
    '/social-care-healthcare',
    '/aviation',
    '/agencies',
    '/careers',
    '/life-at-newtuple',
  ]

  const baseEntries = pages.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '/' ? ('weekly' as const) : ('monthly' as const),
    priority: path === '/' ? 1 : 0.8,
  }))

  return baseEntries
}
