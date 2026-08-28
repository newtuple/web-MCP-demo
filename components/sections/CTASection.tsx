'use client'

import FadeIn from '@/components/motion/FadeIn'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'

interface CTASectionProps {
  title: string
  description: string
  buttonText?: string
  buttonHref?: string
  className?: string
}

export default function CTASection({
  title,
  description,
  buttonText = 'Get in Touch',
  buttonHref = '/contactus',
  className = '',
}: CTASectionProps) {
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
          <p className="text-lg text-cobalt-100 font-light max-w-2xl mx-auto mb-8">
            {description}
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <Button href={buttonHref} variant="secondary" size="lg">
            {buttonText}
          </Button>
        </FadeIn>
      </Container>
    </section>
  )
}
