import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/layout/Navigation'
import ProductSubnav from '@/components/layout/ProductSubnav'
import Footer from '@/components/layout/Footer'
import Analytics from '@/components/analytics/Analytics'
import CookieConsent from '@/components/analytics/CookieConsent'
import AdaptiveRecommendations from '@/components/webmcp/AdaptiveRecommendations'
import PageView from '@/components/webmcp/PageView'
import WebMCPProvider from '@/components/webmcp/WebMCPProvider'
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, COMPANY } from '@/lib/constants'
import { getPageContent } from '@/lib/content'
import { rolesFromPositions, type CareersPositionItem } from '@/lib/careers/roles'
import { PAGE_CATALOG } from '@/lib/navigate/schema'
import { extractPageDetails, type PageDetails } from '@/lib/pageView/details'

// Loaded once at build/render time so the WebMCP careers tools work from any
// page, not only after the visitor has opened /careers.
const careersRoles = rolesFromPositions(
  getPageContent<{ positions?: { items?: CareersPositionItem[] } }>('careers').data.positions?.items ?? [],
)

// Real page substance (use cases, case studies, testimonials, CTAs) pulled
// from each page's own content/*.md, so in-place page views and the
// get_page_details tool serve actual site content, not just titles.
const pageDetails: Record<string, PageDetails> = Object.fromEntries(
  PAGE_CATALOG.filter((page) => page.slug !== 'home').map((page) => {
    try {
      return [page.slug, extractPageDetails(page.slug, getPageContent<Record<string, unknown>>(page.slug).data)]
    } catch {
      return [page.slug, { slug: page.slug, whatWeDo: [] }]
    }
  }),
)

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['200', '300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `Build your Agentic Enterprise | ${SITE_NAME} Technologies Private Ltd.`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['en_GB', 'en_IN'],
    url: SITE_URL,
    siteName: SITE_NAME,
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: COMPANY.name,
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.svg`,
  description: SITE_DESCRIPTION,
  foundingDate: COMPANY.founded,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'B 204, Alacrity Hsg Society, Mohan Nagar Baner',
    addressLocality: 'Pune',
    addressRegion: 'Maharashtra',
    postalCode: '411045',
    addressCountry: 'IN',
  },
  sameAs: [COMPANY.linkedin, COMPANY.twitter, COMPANY.github],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans bg-white">
        <Navigation />
        <ProductSubnav />
        <main className="min-h-screen">{children}</main>
        <PageView details={pageDetails} />
        <AdaptiveRecommendations />
        <Footer />
        <Analytics />
        <CookieConsent />
        <WebMCPProvider careersRoles={careersRoles} pageDetails={pageDetails} />
      </body>
    </html>
  )
}
