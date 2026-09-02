'use client'

import FadeIn from '@/components/motion/FadeIn'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import { useVisitorContext } from '@/components/webmcp/useVisitorContext'

interface CTASectionProps {
  title: string
  description: string
  buttonText?: string
  buttonHref?: string
  className?: string
}

const DEFAULT_TEXT = 'Get in Touch'
const DEFAULT_HREF = '/contactus'

export default function CTASection({
  title,
  description,
  buttonText = DEFAULT_TEXT,
  buttonHref = DEFAULT_HREF,
  className = '',
}: CTASectionProps) {
  const { variant } = useVisitorContext()

  // When the site is personalized and the page did not ask for a specific
  // button, the CTA becomes the one chosen for this visitor - the same
  // primaryCta the choose_cta WebMCP tool reports.
  const usingDefaults = buttonText === DEFAULT_TEXT && buttonHref === DEFAULT_HREF
  const finalText = variant.isPersonalized && usingDefaults ? variant.primaryCta.label : buttonText
  const finalHref = variant.isPersonalized && usingDefaults ? variant.primaryCta.href : buttonHref

  return (
    <section className={`py-20 md:py-28 bg-gradient-cobalt relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-grid opacity-10" />
      <Container className="relative z-10 text-center">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {title}
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-lg text-[var(--accent-100)] font-light max-w-2xl mx-auto mb-8">
            {description}
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <Button href={finalHref} variant="secondary" size="lg">
            {finalText}
          </Button>
          {variant.isPersonalized && (
            <p className="mt-4 text-xs font-medium uppercase tracking-wide text-[var(--accent-200)]">
              {variant.adaptationSummary}
            </p>
          )}
        </FadeIn>
      </Container>
    </section>
  )
}
