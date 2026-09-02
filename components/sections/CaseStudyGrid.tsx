'use client'

import { useMemo } from 'react'
import { Sparkles } from 'lucide-react'
import Container from '@/components/ui/Container'
import GradientText from '@/components/ui/GradientText'
import FadeIn from '@/components/motion/FadeIn'
import { useVisitorContext } from '@/components/webmcp/useVisitorContext'

interface CaseStudySummary {
  slug: string
  title: string
  competency: string
  cardSummary: string
}

function CaseStudyCard({ study, emphasized }: { study: CaseStudySummary; emphasized?: boolean }) {
  return (
    <div className="w-[360px] flex-shrink-0">
      <div className={`h-full flex flex-col rounded-2xl bg-white p-6 md:p-8 shadow-premium ${emphasized ? 'ring-2 ring-[var(--accent-300)]' : ''}`}>
        <div className="mb-4 flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-[var(--accent-50)] px-3 py-1 text-xs font-medium text-[var(--accent-900)] uppercase tracking-wider w-fit">
            {study.competency}
          </span>
          {emphasized && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent-900)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
              <Sparkles className="h-3 w-3" />
              For you
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
          {study.title}
        </h3>

        <p className="text-sm text-gray-600 font-light leading-relaxed flex-1">
          {study.cardSummary}
        </p>
      </div>
    </div>
  )
}

export default function CaseStudyGrid({ caseStudies }: { caseStudies: CaseStudySummary[] }) {
  const { variant } = useVisitorContext()

  // Personalized visit: the case studies chosen for this visitor (the same
  // slugs select_case_studies reports) lead the marquee and get marked.
  const emphasizedSlugs = useMemo(
    () => (variant.isPersonalized ? new Set(variant.caseStudySlugs) : new Set<string>()),
    [variant.isPersonalized, variant.caseStudySlugs]
  )
  const ordered = useMemo(() => {
    if (emphasizedSlugs.size === 0) return caseStudies
    return [
      ...caseStudies.filter((study) => emphasizedSlugs.has(study.slug)),
      ...caseStudies.filter((study) => !emphasizedSlugs.has(study.slug)),
    ]
  }, [caseStudies, emphasizedSlugs])

  return (
    <section className="py-20 md:py-28 bg-gray-50 overflow-hidden">
      <Container>
        <FadeIn>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-4">
              <span className="font-bold">Built. Shipped. </span>
              <span className="font-bold"><GradientText>Running.</GradientText></span>
            </h2>
            <p className="text-lg text-gray-600 font-light">
              Production AI systems across aviation, finance, healthcare, and enterprise SaaS.
            </p>
          </div>
        </FadeIn>
      </Container>

      <div className="group/marquee">
        <div
          className="flex gap-6 animate-scroll-cards group-hover/marquee:[animation-play-state:paused]"
          style={{ width: 'max-content' }}
        >
          {ordered.map((study) => (
            <CaseStudyCard key={study.slug} study={study} emphasized={emphasizedSlugs.has(study.slug)} />
          ))}
          {ordered.map((study) => (
            <CaseStudyCard key={`dup-${study.slug}`} study={study} emphasized={emphasizedSlugs.has(study.slug)} />
          ))}
        </div>
      </div>
    </section>
  )
}
