import type { Metadata } from 'next'
import { SITE_URL, SITE_NAME } from './constants'

export function createMetadata({
  title,
  description,
  image,
  canonical,
  path = '',
  noindex = false,
}: {
  title: string
  description: string
  image?: string
  canonical?: string
  path?: string
  noindex?: boolean
}): Metadata {
  const url = canonical ?? `${SITE_URL}${path}`
  const fullTitle = `${title} | ${SITE_NAME}`
  const absoluteImage = image ? (image.startsWith('http') ? image : `${SITE_URL}${image}`) : undefined

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: url,
    },
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'en_US',
      alternateLocale: ['en_GB', 'en_IN'],
      images: absoluteImage ? [{ url: absoluteImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: absoluteImage ? [absoluteImage] : undefined,
    },
  }
}
