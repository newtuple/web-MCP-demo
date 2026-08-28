'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  ArrowRight,
  Sparkles,
  Quote,
  CheckCircle,
  Layers3,
  RotateCcw,
} from 'lucide-react'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import FadeIn from '@/components/motion/FadeIn'
import StaggerChildren, { StaggerItem } from '@/components/motion/StaggerChildren'
import ClientLogos from '@/components/sections/ClientLogos'
import PartnerEcosystem from '@/components/sections/PartnerEcosystem'
import type { PartnerGroup } from '@/components/sections/PartnerEcosystem'
import FAQAccordion from '@/components/sections/FAQAccordion'
import TypingHeadline from '@/components/motion/TypingHeadline'
import TypingBlock from '@/components/motion/TypingBlock'
import ToolCallAnimation from '@/components/motion/ToolCallAnimation'
import type { ToolCallItem } from '@/components/motion/ToolCallAnimation'
import { resolveIcon } from '@/lib/icons'
import { ARCHITECTURES, DEFAULT_SECTION_ORDER } from '@/lib/personalization/catalog'
import type { HomepageSectionId } from '@/lib/personalization/types'
import { useWebMCPPersonalization } from '@/components/personalization/useWebMCPPersonalization'

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

interface CaseStudySummary {
  slug: string
  title: string
  competency: string
  cardSummary: string
}

type TestimonialItem = HomeData['testimonials']['items'][number]
const getTestimonialKey = (item: TestimonialItem) => `${item.name}-${item.attribution}-${item.industry}`

// ── Per-section tool calls ──

const heroTools: ToolCallItem[] = [
  { label: 'Analyzing revenue data', result: '↑ 34% growth identified' },
  { label: 'Optimizing operations', result: '$2.1M savings found' },
  { label: 'Scoring lead pipeline', result: '812 leads prioritized' },
  { label: 'Deploying AI agents', result: '5 agents live' },
  { label: 'Measuring ROI impact', result: '11.2x return confirmed' },
]

const manifestoTools: ToolCallItem[] = [
  { label: 'Scanning industry trends', result: 'AI adoption at 78%' },
  { label: 'Modeling cost of intelligence', result: 'Approaching $0' },
  { label: 'Forecasting disruption window', result: '18 months remain' },
  { label: 'Evaluating readiness', result: 'Action required now' },
]

const pathsTools: ToolCallItem[] = [
  { label: 'Mapping agent workflows', result: '12 automations found' },
  { label: 'Estimating build timeline', result: '6 weeks to production' },
  { label: 'Selecting architecture', result: 'Multi-agent framework' },
  { label: 'Calculating team velocity', result: '3x faster with AI' },
]

const caseStudyTools: ToolCallItem[] = [
  { label: 'Aggregating outcomes', result: '12 deployments shipped' },
  { label: 'Measuring accuracy gains', result: '90%+ across projects' },
  { label: 'Computing time savings', result: 'Hours → seconds' },
  { label: 'Verifying uptime', result: '99.9% availability' },
]

const acceleratorTools: ToolCallItem[] = [
  { label: 'Loading starter templates', result: '4 accelerators ready' },
  { label: 'Pre-configuring pipelines', result: '70% complete on day 1' },
  { label: 'Connecting LLM providers', result: 'Multi-model enabled' },
  { label: 'Activating guardrails', result: 'Safety layer active' },
]

const DIALOGTUPLE_DARK_ICON = '/images/logos/dialogtuple/dark_icon.png'

const faqTools: ToolCallItem[] = [
  { label: 'Indexing knowledge base', result: '24 topics covered' },
  { label: 'Processing common queries', result: '12 answers ready' },
  { label: 'Checking response accuracy', result: 'Verified against docs' },
  { label: 'Optimizing for clarity', result: 'Readability score: 96' },
]

// ── Sidebar wrapper for consistent layout ──

function SectionWithSidebar({
  children,
  tools,
  title,
  dark = false,
  dividerClass,
  className = '',
  sectionClassName = '',
  sidebarMode = 'stretch',
  sidebarVariant = 'divider',
}: {
  children: React.ReactNode
  tools: ToolCallItem[]
  title: string
  dark?: boolean
  dividerClass?: string
  className?: string
  sectionClassName?: string
  sidebarMode?: 'stretch' | 'centered'
  sidebarVariant?: 'divider' | 'panel'
}) {
  const isCenteredSidebar = sidebarMode === 'centered'
  const isPanelSidebar = sidebarVariant === 'panel'

  return (
    <div className={`flex flex-col lg:flex-row items-stretch ${className}`}>
      <div className={`flex-1 min-w-0 overflow-hidden ${sectionClassName}`}>
        {children}
      </div>
      <div className={`hidden lg:flex flex-shrink-0 ${isCenteredSidebar ? 'items-center self-center' : 'items-stretch'}`}>
        {!isPanelSidebar && (
          <div
            className={`${isCenteredSidebar ? 'w-px h-[300px] self-center' : 'w-px self-stretch'} ${
              dividerClass || (dark ? 'bg-gray-800' : 'bg-gray-200')
            }`}
          />
        )}
        <div className={`${isPanelSidebar ? 'pl-8 pr-8' : 'pl-6 pr-8'} w-[320px] ${isCenteredSidebar ? 'py-0 self-center' : 'py-8'}`}>
          <div className={isPanelSidebar ? 'rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm shadow-[0_24px_48px_-28px_rgba(15,23,42,0.4)] p-5' : ''}>
            <ToolCallAnimation tools={tools} title={title} dark={dark} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HomeContent({ data, caseStudies }: { data: HomeData; caseStudies: CaseStudySummary[] }) {
  const { hero, paths, clientLogos, partnerEcosystem, manifesto, accelerators, testimonials, faq, cta } = data
  const { manifest, resetManifest } = useWebMCPPersonalization()
  const effectiveHero = manifest
    ? {
        ...hero,
        badge: manifest.narrative.badge,
        description: manifest.narrative.description,
      }
    : hero
  const effectiveCta = manifest
    ? {
        title: manifest.cta.title,
        titleBold: '',
        description: manifest.cta.description,
        buttonText: manifest.cta.label,
        href: manifest.cta.href,
      }
    : { ...cta, href: '/contactus' }
  const effectiveCaseStudies = manifest
    ? manifest.caseStudySlugs
        .map(slug => caseStudies.find(study => study.slug === slug))
        .filter((study): study is CaseStudySummary => Boolean(study))
    : caseStudies
  const effectiveAccelerators = manifest
    ? manifest.demoIds
        .map(id => accelerators.items.find(item => item.name.toLowerCase() === id))
        .filter((item): item is HomeData['accelerators']['items'][number] => Boolean(item))
    : accelerators.items
  const architectureExamples = manifest?.architectureExamples
    ?? ARCHITECTURES.slice(0, 3).map(({ id, title, description, layers }) => ({ id, title, description, layers }))
  const sectionOrder = manifest?.sectionOrder ?? DEFAULT_SECTION_ORDER
  const sectionStyle = (id: HomepageSectionId) => ({ order: Math.max(sectionOrder.indexOf(id), 0) })
  const caseStudyGrid = data.caseStudyGrid ?? {
    title: "Work we've",
    titleAccent: 'done.',
    description: 'Production AI systems across aviation, finance, healthcare, and enterprise SaaS.',
  }

  const manifestoLines = [
    manifesto.title,
    manifesto.subtitle,
    ...manifesto.paragraphs,
  ]

  const manifestoLineStyles = (index: number) => {
    if (index === 0) return 'text-4xl md:text-5xl lg:text-6xl text-white mb-4 leading-tight font-bold'
    if (index === 1) return 'text-2xl md:text-3xl text-gray-400 font-light mb-12 leading-snug'
    return 'text-lg text-gray-400 font-light leading-relaxed mb-6'
  }

  const [testimonialsColumnA, testimonialsColumnB] = testimonials.items.reduce<[TestimonialItem[], TestimonialItem[]]>(
    (columns, item, index) => {
      columns[index % 2].push(item)
      return columns
    },
    [[], []]
  )
  const desktopRightColumn = testimonialsColumnB.length > 0 ? testimonialsColumnB : testimonialsColumnA
  const [activeTestimonial, setActiveTestimonial] = useState<TestimonialItem | null>(testimonials.items[0] ?? null)

  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden min-h-screen flex items-center py-24 md:py-32 bg-gradient-hero"
        style={sectionStyle('hero')}
        data-personalized-section="hero"
      >
        <div className="absolute inset-0 bg-grid" />
        <div className="relative z-10 w-full">
          <SectionWithSidebar tools={heroTools} title="AI Activity">
            <Container className="text-center lg:text-left">
              <FadeIn direction="none">
                <span className="inline-flex items-center gap-2 rounded-full bg-cobalt-50 px-4 py-1.5 text-sm font-medium text-cobalt-900 mb-8">
                  <Sparkles className="w-4 h-4" />
                  {effectiveHero.badge}
                </span>
              </FadeIn>
              {manifest && (
                <FadeIn delay={0.05} direction="none">
                  <div className="mb-6 flex flex-wrap items-center justify-center gap-3 text-sm text-gray-600 lg:justify-start">
                    <span className="rounded-full border border-cobalt-200 bg-white/80 px-3 py-1">
                      Personalized for {manifest.audienceSummary}
                    </span>
                    <button
                      type="button"
                      onClick={resetManifest}
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-cobalt-800 transition-colors hover:bg-cobalt-50"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Use standard site
                    </button>
                  </div>
                </FadeIn>
              )}
              <FadeIn delay={0.1} direction="none">
                <TypingHeadline
                  className="text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-gray-900 mb-8 min-h-[2.2em] lg:min-h-[1.1em]"
                  phrases={manifest?.narrative.headlines}
                />
              </FadeIn>
              <FadeIn delay={0.2} direction="none">
                <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed lg:max-w-xl mb-12">
                  {effectiveHero.description}
                </p>
              </FadeIn>
              <FadeIn delay={0.3} direction="none">
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button
                    href={effectiveCta.href}
                    size="lg"
                    className="bg-cobalt-900 hover:shadow-premium-lg"
                    fillClassName="bg-cobalt-800"
                  >
                    {effectiveCta.buttonText}
                  </Button>
                  <Button href="/genai-accelerators" variant="outline" size="lg">
                    Explore Accelerators
                  </Button>
                </div>
              </FadeIn>
            </Container>
          </SectionWithSidebar>
        </div>
      </section>

      {/* ── Manifesto — dark section ── */}
      <section
        className="min-h-screen flex items-center py-24 md:py-32 bg-gray-950 relative overflow-hidden"
        style={sectionStyle('manifesto')}
        data-personalized-section="manifesto"
      >
        <div className="absolute inset-0 bg-grid-dark" />
        <div className="relative z-10 w-full">
          <SectionWithSidebar tools={manifestoTools} title="Intelligence" dark>
            <Container>
              <div className="max-w-4xl mx-auto lg:mx-0">
                <TypingBlock
                  lines={manifestoLines}
                  lineDelay={200}
                  lineClassName={manifestoLineStyles}
                  warpSpeed
                />
                <FadeIn delay={0.4}>
                  <Button
                    href="/contactus"
                    variant="ghost"
                    size="lg"
                    className="border border-white/20 text-white hover:bg-white/10 hover:text-white mt-4"
                    fillClassName="bg-cobalt-900/90"
                  >
                    <span className="inline-flex items-center gap-2 whitespace-nowrap">
                      Get started
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Button>
                </FadeIn>
              </div>
            </Container>
          </SectionWithSidebar>
        </div>
      </section>

      {/* ── Two Paths — shopping-style cards ── */}
      <section className="py-20 md:py-28" style={sectionStyle('paths')} data-personalized-section="paths">
        <SectionWithSidebar tools={pathsTools} title="Build Planning" sidebarMode="centered">
          <Container>
            <h2 className="text-3xl md:text-4xl text-gray-900 mb-16 text-center lg:text-left font-light">
              Two ways we accelerate{' '}
              <span className="relative inline-flex items-center">
                <span className="relative z-10 rounded-md bg-gray-900 px-2 py-0.5 font-semibold text-white transition-colors duration-300">
                  AI
                </span>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-1 left-1/2 h-[3px] w-8 -translate-x-1/2 rounded-full bg-gray-900/40 animate-pulse-subtle"
                />
              </span>{' '}
              for you
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-8">
              {paths.map((item, i) => {
                return (
                  <FadeIn key={item.title} delay={i * 0.1}>
                    <div className="group relative h-full rounded-3xl transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_24px_54px_-24px_rgba(0,71,171,0.45),0_12px_24px_-14px_rgba(15,23,42,0.25)]">
                      <article className="relative h-full overflow-hidden rounded-3xl border border-gray-200/90 bg-white transition-colors duration-300 group-hover:border-cobalt-300">
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_0%_0%,rgba(0,71,171,0.08),transparent_55%),radial-gradient(130%_90%_at_100%_100%,rgba(0,184,217,0.12),transparent_55%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cobalt-400 to-transparent -translate-x-[115%] transition-transform duration-700 group-hover:translate-x-0" />

                        {item.image && (
                          <div className="relative w-full h-36 md:h-40 overflow-hidden bg-white">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-contain transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                        )}

                        <div className="relative z-10 flex h-full flex-col p-6 md:p-7">
                        <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
                        <p className="text-gray-600 font-light leading-relaxed mt-3">{item.description}</p>

                        <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50/80 p-4 transition-all duration-300 group-hover:border-cobalt-200 group-hover:bg-white group-hover:shadow-[0_14px_30px_rgba(0,71,171,0.12)]">
                          <ul className="space-y-2.5">
                            {item.bullets.map((bullet) => (
                              <li key={bullet} className="flex items-start gap-2.5 text-sm text-gray-700">
                                <CheckCircle className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-100">
                          <Button
                            href={item.href}
                            variant="ghost"
                            className="px-0 text-cobalt-900 hover:text-white"
                            fillClassName="bg-cobalt-900"
                          >
                            <span className="inline-flex items-center gap-2">
                              Learn More
                              <ArrowRight className="w-4 h-4" />
                            </span>
                          </Button>
                        </div>
                      </div>
                      </article>
                      <div className="pointer-events-none absolute left-8 right-8 -bottom-3 h-6 rounded-full bg-cobalt-900/25 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-35" />
                    </div>
                  </FadeIn>
                )
              })}
            </div>
          </Container>
        </SectionWithSidebar>
      </section>

      {/* ── Case Study Grid ── */}
      <section
        className="py-20 md:py-28 bg-gray-50 overflow-hidden"
        style={sectionStyle('case_studies')}
        data-personalized-section="case_studies"
      >
        <SectionWithSidebar tools={caseStudyTools} title="Deployments" sidebarMode="centered" sidebarVariant="panel">
          <Container>
            <div className="max-w-3xl mx-auto lg:mx-0 text-center lg:text-left mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-4">
                <span className="font-bold">{caseStudyGrid.title} </span>
                <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-cobalt-900 via-cobalt-700 to-cobalt-500">
                  {caseStudyGrid.titleAccent}
                </span>
              </h2>
              <p className="text-lg text-gray-600 font-light">
                {caseStudyGrid.description}
              </p>
            </div>
          </Container>
          <div className="relative group/marquee">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 md:w-24 bg-gradient-to-r from-gray-50 via-gray-50/90 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 md:w-24 bg-gradient-to-l from-gray-50 via-gray-50/90 to-transparent" />
            <div className="overflow-hidden py-5">
              <div
                className="flex items-stretch gap-6 animate-scroll-cards group-hover/marquee:[animation-play-state:paused]"
                style={{ width: 'max-content' }}
              >
                {effectiveCaseStudies.map((study) => (
                  <CaseStudyCard key={study.slug} study={study} />
                ))}
                {effectiveCaseStudies.map((study) => (
                  <CaseStudyCard key={`dup-${study.slug}`} study={study} />
                ))}
              </div>
            </div>
          </div>
        </SectionWithSidebar>
      </section>

      {/* ── Client Logos ── */}
      <div style={sectionStyle('client_logos')} data-personalized-section="client_logos">
        <ClientLogos title={clientLogos.title} clients={clientLogos.items} />
      </div>

      {/* ── Partner Ecosystem ── */}
      <div style={sectionStyle('partners')} data-personalized-section="partners">
        <PartnerEcosystem groups={partnerEcosystem.groups} />
      </div>

      {/* ── Testimonials — vertical dual carousel ── */}
      <section
        className="relative overflow-hidden py-20 md:py-28 bg-gradient-to-b from-gray-50 via-white to-gray-50"
        style={sectionStyle('testimonials')}
        data-personalized-section="testimonials"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_60%_at_50%_0%,rgba(0,71,171,0.06),transparent_70%)]" />
        <Container className="relative z-10">
          <TypingBlock
            lines={['Real stories, real results']}
            lineDelay={200}
            lineClassName={() => 'text-3xl md:text-4xl text-gray-900 mb-4 font-bold text-center'}
            warpSpeed
          />
          <FadeIn delay={0.1}>
            <p className="text-center text-sm md:text-base text-gray-600 font-light mb-10 md:mb-12">
              Voices from teams that shipped production AI with us.
            </p>
          </FadeIn>
        </Container>

        {activeTestimonial && (
          <Container className="relative z-10 mb-8 md:mb-10">
            <FadeIn delay={0.15}>
              <article className="rounded-2xl border border-cobalt-200 bg-white/95 p-6 md:p-7 shadow-[0_24px_44px_-30px_rgba(0,71,171,0.45)]">
                <Quote className="w-8 h-8 text-cobalt-300 mb-4" strokeWidth={1.5} />
                <blockquote className="text-gray-700 font-light leading-relaxed text-base md:text-lg">
                  &ldquo;{activeTestimonial.quote}&rdquo;
                </blockquote>
                <div className="border-t border-gray-100 pt-4 mt-6">
                  <div className="font-semibold text-gray-900">{activeTestimonial.name}</div>
                  <div className="text-sm text-gray-500">{activeTestimonial.attribution}</div>
                  <span className="inline-block mt-2 text-xs font-medium text-cobalt-700 bg-cobalt-50 rounded-full px-2.5 py-0.5">
                    {activeTestimonial.industry}
                  </span>
                </div>
              </article>
            </FadeIn>
          </Container>
        )}

        <div className="relative z-10 md:hidden">
          <Container>
            <TestimonialColumn
              items={testimonials.items}
              direction="up"
              heightClass="h-[520px]"
              activeKey={activeTestimonial ? getTestimonialKey(activeTestimonial) : null}
              onSelect={setActiveTestimonial}
            />
          </Container>
        </div>

        <div className="relative z-10 hidden md:block">
          <Container>
            <div className="grid grid-cols-2 gap-6 lg:gap-8">
              <TestimonialColumn
                items={testimonialsColumnA}
                direction="up"
                heightClass="h-[560px]"
                activeKey={activeTestimonial ? getTestimonialKey(activeTestimonial) : null}
                onSelect={setActiveTestimonial}
              />
              <TestimonialColumn
                items={desktopRightColumn}
                direction="down"
                heightClass="h-[560px]"
                activeKey={activeTestimonial ? getTestimonialKey(activeTestimonial) : null}
                onSelect={setActiveTestimonial}
              />
            </div>
          </Container>
        </div>
      </section>

      {/* ── GenAI Accelerators ── */}
      <section
        className="relative overflow-hidden py-20 md:py-28 bg-gradient-to-b from-white via-cobalt-50/20 to-white"
        style={sectionStyle('accelerators')}
        data-personalized-section="accelerators"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_20%_0%,rgba(0,71,171,0.07),transparent_70%),radial-gradient(70%_60%_at_90%_100%,rgba(0,184,217,0.09),transparent_70%)]" />
        <SectionWithSidebar tools={acceleratorTools} title="Platform" sidebarMode="centered">
          <Container className="relative z-10">
            <TypingBlock
              lines={[accelerators.sectionTitle, accelerators.sectionDescription]}
              lineDelay={200}
              lineClassName={(i) =>
                i === 0
                  ? 'text-3xl md:text-4xl text-gray-900 mb-4 font-bold text-center lg:text-left'
                  : 'text-lg text-gray-600 font-light mb-12 text-center lg:text-left max-w-2xl'
              }
              warpSpeed
            />
            <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-7 items-stretch">
              {effectiveAccelerators.map((acc, i) => {
                const AccIcon = resolveIcon(acc.icon)
                const isDialogtuple = acc.name.toLowerCase() === 'dialogtuple'
                const bgClass = [
                  'from-cobalt-50/80 via-white to-cyan-50/70',
                  'from-cyan-50/80 via-white to-cobalt-50/70',
                  'from-slate-50 via-white to-cobalt-50/60',
                  'from-cobalt-50/70 via-white to-slate-50',
                ][i % 4]

                return (
                  <StaggerItem key={acc.name}>
                    <a href={acc.href} className="group block h-full">
                      <article className="relative h-[330px] md:h-[340px] overflow-hidden rounded-3xl border border-gray-200/90 bg-white shadow-[0_16px_34px_-24px_rgba(15,23,42,0.35)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-cobalt-300 hover:shadow-[0_28px_52px_-26px_rgba(0,71,171,0.4)]">
                        <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${bgClass} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cobalt-400 to-transparent -translate-x-[110%] transition-transform duration-700 group-hover:translate-x-0" />

                        <div className="relative z-10 h-full p-5 md:p-6 flex flex-col">
                          <div className="shrink-0">
                            <div className="flex items-start justify-between gap-4">
                              <div className="w-12 h-12 rounded-xl bg-cobalt-50 flex items-center justify-center transition-all duration-300 group-hover:bg-white group-hover:shadow-[0_14px_26px_-18px_rgba(0,71,171,0.45)]">
                                {isDialogtuple ? (
                                  <span className="inline-flex items-center justify-center rounded-md bg-white p-1 shadow-[0_10px_16px_-12px_rgba(0,71,171,0.4)]">
                                    <Image
                                      src={DIALOGTUPLE_DARK_ICON}
                                      alt="Dialogtuple icon"
                                      width={20}
                                      height={20}
                                      className="h-5 w-5 object-contain"
                                    />
                                  </span>
                                ) : (
                                  <AccIcon className="w-6 h-6 text-cobalt-900 transition-colors duration-300 group-hover:text-cyan-600" strokeWidth={1.5} />
                                )}
                              </div>
                              <span className="inline-flex items-center rounded-full border border-cobalt-100 bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-cobalt-800">
                                Product
                              </span>
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mt-5 leading-tight [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden">
                              {acc.name}
                            </h3>
                          </div>

                          <div className="flex-1 min-h-0 mt-5 overflow-hidden">
                            <p className="text-gray-600 font-light leading-relaxed [display:-webkit-box] [-webkit-line-clamp:4] [-webkit-box-orient:vertical] overflow-hidden">
                              {acc.description}
                            </p>
                          </div>

                          <div className="shrink-0 pt-3.5 mt-4 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-sm font-medium text-cobalt-900">Explore Product</span>
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-cobalt-900 text-white transition-transform duration-300 group-hover:translate-x-1">
                              <ArrowRight className="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                      </article>
                    </a>
                  </StaggerItem>
                )
              })}
            </StaggerChildren>
            <FadeIn delay={0.3}>
              <div className="text-center mt-12">
                <Button href="/genai-accelerators" variant="outline" className="border-2 border-cobalt-900 text-cobalt-900 hover:text-white">
                  <span className="inline-flex items-center gap-2">
                    Explore All Accelerators
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Button>
              </div>
            </FadeIn>
          </Container>
        </SectionWithSidebar>
      </section>

      {/* ── Architecture examples ── */}
      <section
        className="relative overflow-hidden border-y border-gray-200 bg-gray-950 py-20 md:py-28"
        style={sectionStyle('architecture')}
        data-personalized-section="architecture"
      >
        <div className="absolute inset-0 bg-grid-dark" />
        <Container className="relative z-10">
          <div className="mb-14 max-w-3xl">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-cobalt-400/30 bg-cobalt-400/10 px-3 py-1 text-sm font-medium text-cyan-300">
              <Layers3 className="h-4 w-4" />
              Architecture examples
            </span>
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              A practical path from use case to production
            </h2>
            <p className="mt-4 text-lg font-light leading-relaxed text-gray-400">
              {manifest
                ? `Selected for ${manifest.audienceSummary}.`
                : 'Reference patterns for secure, measurable, and maintainable AI systems.'}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {architectureExamples.map((example, index) => (
              <FadeIn key={example.id} delay={index * 0.1}>
                <article className="h-full rounded-3xl border border-gray-800 bg-gray-900/80 p-6 shadow-[0_22px_50px_-30px_rgba(0,184,217,0.4)] md:p-8">
                  <h3 className="text-2xl font-bold text-white">{example.title}</h3>
                  <p className="mt-3 font-light leading-relaxed text-gray-400">{example.description}</p>
                  <ol className="mt-7 space-y-3">
                    {example.layers.map((layer, layerIndex) => (
                      <li key={layer} className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-950/70 px-4 py-3 text-sm text-gray-200">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cobalt-900 text-xs font-semibold text-white">
                          {layerIndex + 1}
                        </span>
                        {layer}
                      </li>
                    ))}
                  </ol>
                </article>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* ── FAQ ── */}
      <section
        className="py-20 md:py-28 bg-gray-950"
        style={sectionStyle('faq')}
        data-personalized-section="faq"
      >
        <SectionWithSidebar tools={faqTools} title="Knowledge" dark>
          <Container>
            <TypingBlock
              lines={['Questions? We have answers']}
              lineDelay={200}
              lineClassName={() => 'text-3xl md:text-4xl text-white mb-16 font-bold text-center lg:text-left'}
              warpSpeed
            />
            <FAQAccordion items={faq} />
          </Container>
        </SectionWithSidebar>
      </section>

      {/* ── Dramatic Final CTA ── */}
      <section
        className="py-20 md:py-24 bg-white border-t border-gray-200"
        style={sectionStyle('cta')}
        data-personalized-section="cta"
      >
        <Container className="text-center">
          <TypingBlock
            lines={[`${effectiveCta.title} ${effectiveCta.titleBold}`.trim(), effectiveCta.description]}
            lineDelay={200}
            lineClassName={(i) =>
              i === 0
                ? 'text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-7 leading-tight font-light'
                : 'text-lg text-gray-600 font-light max-w-2xl mx-auto mb-9'
            }
            warpSpeed
          />
          <FadeIn delay={0.2}>
            <Button
              href={effectiveCta.href}
              size="lg"
              className="bg-gray-950 text-white hover:text-white shadow-premium hover:shadow-premium-lg"
              fillClassName="bg-cobalt-900"
            >
              <span className="inline-flex items-center gap-2">
                {effectiveCta.buttonText}
                <ArrowRight className="w-5 h-5" />
              </span>
            </Button>
          </FadeIn>
        </Container>
      </section>
    </div>
  )
}

function TestimonialCard({
  item,
  isActive,
  onSelect,
}: {
  item: TestimonialItem
  isActive: boolean
  onSelect: (item: TestimonialItem) => void
}) {
  return (
    <button type="button" onClick={() => onSelect(item)} className="text-left w-full">
      <article
        className={`flex-shrink-0 rounded-2xl border bg-white p-6 shadow-[0_16px_30px_-24px_rgba(15,23,42,0.45)] transition-all duration-300 hover:border-cobalt-200 hover:shadow-[0_20px_36px_-22px_rgba(0,71,171,0.35)] ${
          isActive ? 'border-cobalt-300 shadow-[0_24px_42px_-24px_rgba(0,71,171,0.4)]' : 'border-gray-200/90'
        }`}
      >
        <Quote className={`w-7 h-7 mb-3 ${isActive ? 'text-cobalt-400' : 'text-cobalt-200'}`} strokeWidth={1.5} />
        <blockquote className="text-gray-600 font-light leading-relaxed text-sm">
          &ldquo;{item.quote}&rdquo;
        </blockquote>
        <div className="border-t border-gray-100 pt-4 mt-4">
          <div className="font-semibold text-gray-900 text-sm">{item.name}</div>
          <div className="text-xs text-gray-500">{item.attribution}</div>
          <span className="inline-block mt-2 text-xs font-medium text-cobalt-700 bg-cobalt-50 rounded-full px-2.5 py-0.5">
            {item.industry}
          </span>
        </div>
      </article>
    </button>
  )
}

function TestimonialColumn({
  items,
  direction,
  heightClass,
  activeKey,
  onSelect,
}: {
  items: TestimonialItem[]
  direction: 'up' | 'down'
  heightClass: string
  activeKey: string | null
  onSelect: (item: TestimonialItem) => void
}) {
  if (items.length === 0) return null

  const loopItems = [...items, ...items]
  const animationClass = direction === 'up' ? 'animate-marquee-vertical-up' : 'animate-marquee-vertical-down'

  return (
    <div className={`relative ${heightClass} overflow-hidden rounded-2xl border border-gray-200/80 bg-white/70 shadow-[0_18px_36px_-28px_rgba(15,23,42,0.4)] backdrop-blur-[1px]`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20 bg-gradient-to-b from-gray-50 via-gray-50/90 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-t from-gray-50 via-gray-50/90 to-transparent" />
      <div className={`absolute inset-x-0 top-0 flex flex-col gap-5 p-3 md:p-4 will-change-transform ${animationClass} hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]`}>
        {loopItems.map((item, index) => (
          <TestimonialCard
            key={`${item.name}-${item.industry}-${index}`}
            item={item}
            isActive={activeKey === getTestimonialKey(item)}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  )
}

// ── Inline case study card (used by marquee) ──

function CaseStudyCard({ study }: { study: CaseStudySummary }) {
  return (
    <div className="w-[360px] flex-shrink-0 py-1">
      <article className="group relative h-full min-h-[290px] overflow-hidden rounded-2xl border border-gray-200/80 bg-white/95 p-6 md:p-8 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-cobalt-300 hover:shadow-[0_22px_44px_-22px_rgba(0,71,171,0.45),0_10px_18px_-12px_rgba(15,23,42,0.25)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_80%_at_0%_0%,rgba(0,71,171,0.07),transparent_60%),radial-gradient(120%_90%_at_100%_100%,rgba(0,184,217,0.12),transparent_65%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cobalt-400 to-transparent -translate-x-[110%] transition-transform duration-700 group-hover:translate-x-0" />

        <div className="relative z-10 h-full flex flex-col">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cobalt-100 bg-cobalt-50/80 px-3 py-1 text-[11px] font-semibold text-cobalt-900 uppercase tracking-[0.1em] mb-4 w-fit">
            <Sparkles className="w-3 h-3" />
            {study.competency}
          </span>

          <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug">
            {study.title}
          </h3>
          <p className="text-sm text-gray-600 font-light leading-relaxed flex-1">
            {study.cardSummary}
          </p>
        </div>
      </article>
    </div>
  )
}
