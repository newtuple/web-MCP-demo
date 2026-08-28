import { createMetadata } from '@/lib/metadata'
import { getPageContent, getAllCaseStudies } from '@/lib/content'
import HomeContent from './HomeContent'
import type { PartnerGroup } from '@/components/sections/PartnerEcosystem'

interface HomeData {
  title: string
  description: string
  hero: {
    badge: string
    title: string
    titleBold: string
    description: string
  }
  stats: { value: string; label: string }[]
  paths: {
    title: string
    href: string
    description: string
    icon: string
    image?: string
    bullets: string[]
  }[]
  clientLogos: {
    title: string
    items: { name: string; logo?: string; industry: string }[]
  }
  partnerEcosystem: {
    groups: PartnerGroup[]
  }
  caseStudy: {
    badge: string
    title: string
    description: string
    detail: string
    href: string
    quote: string
    attribution: string
  }
  caseStudyGrid: {
    title: string
    titleAccent: string
    description: string
  }
  manifesto: {
    title: string
    titleAccent: string
    subtitle: string
    paragraphs: string[]
  }
  accelerators: {
    sectionTitle: string
    sectionDescription: string
    items: {
      name: string
      description: string
      href: string
      icon: string
    }[]
  }
  testimonials: {
    sectionTitle: string
    sectionHighlight: string
    items: {
      quote: string
      name: string
      attribution: string
      industry: string
    }[]
  }
  marquee: string
  faq: {
    question: string
    answer: string
  }[]
  cta: {
    title: string
    titleBold: string
    description: string
    buttonText: string
  }
}

const { data } = getPageContent<HomeData>('home')
const caseStudies = getAllCaseStudies()

export const metadata = createMetadata({
  title: data.title,
  description: data.description,
  path: '/',
})

export default function HomePage() {
  return <HomeContent data={data} caseStudies={caseStudies} />
}
