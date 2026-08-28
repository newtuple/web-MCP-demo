'use client'

import { Quote } from 'lucide-react'
import Container from '@/components/ui/Container'
import Card from '@/components/ui/Card'
import FadeIn from '@/components/motion/FadeIn'
import StaggerChildren, { StaggerItem } from '@/components/motion/StaggerChildren'
import SectionHeader from '@/components/ui/SectionHeader'

interface Testimonial {
  quote: string
  name: string
  attribution: string
  industry: string
}

interface TestimonialsProps {
  title?: string
  highlight?: string
  testimonials: Testimonial[]
  className?: string
}

export default function Testimonials({
  title = 'What our clients say',
  highlight = 'clients say',
  testimonials,
  className = '',
}: TestimonialsProps) {
  return (
    <section className={`py-20 md:py-28 bg-gray-50 ${className}`}>
      <Container>
        <FadeIn>
          <SectionHeader title={title} highlight={highlight} />
        </FadeIn>
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <StaggerItem key={t.name + t.industry}>
              <Card className="h-full p-6 md:p-8 flex flex-col" hover={false}>
                <Quote className="w-8 h-8 text-cobalt-200 mb-4 flex-shrink-0" strokeWidth={1.5} />
                <blockquote className="text-gray-600 font-light leading-relaxed text-sm flex-1 mb-6">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="border-t border-gray-100 pt-4 mt-auto">
                  <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.attribution}</div>
                  <span className="inline-block mt-2 text-xs font-medium text-cobalt-700 bg-cobalt-50 rounded-full px-2.5 py-0.5">
                    {t.industry}
                  </span>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </Container>
    </section>
  )
}
