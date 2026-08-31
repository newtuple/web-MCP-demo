import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ChromeGate from '@/components/layout/ChromeGate'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import Analytics from '@/components/analytics/Analytics'
import CookieConsent from '@/components/analytics/CookieConsent'
import WebMCPProvider from '@/components/webmcp/WebMCPProvider'
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, COMPANY } from '@/lib/constants'

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
        <ChromeGate><Navigation /></ChromeGate>
        <main className="min-h-screen">{children}</main>
        <ChromeGate><Footer /></ChromeGate>
        <Analytics />
        <CookieConsent />
        <WebMCPProvider />
      </body>
    </html>
  )
}
