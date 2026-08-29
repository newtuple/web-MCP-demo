'use client'

import Hero from '@/components/sections/Hero'
import CTASection from '@/components/sections/CTASection'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'
import GradientText from '@/components/ui/GradientText'
import FadeIn from '@/components/motion/FadeIn'
import StaggerChildren, { StaggerItem } from '@/components/motion/StaggerChildren'
import { resolveIcon } from '@/lib/icons'

interface ZeroToGenAIData {
  title: string
  description: string
  hero: {
    badge: string
    title: string
    description: string
  }
  journey: {
    sectionTitle: string
    sectionDescription: string
    items: { step: string; title: string; icon: string; description: string }[]
  }
  benefits: {
    title: string
    items: string[]
    highlight: {
      title: string
      description: string
    }
  }
  cta: {
    title: string
    description: string
  }
}

export default function ZeroToGenAIContent({ data }: { data: ZeroToGenAIData }) {
  const CheckCircle = resolveIcon('CheckCircle')
  const Sparkles = resolveIcon('Sparkles')

  return (
    <>
      <Hero
        badge={data.hero.badge}
        title={
          <>
            From zero to <GradientText>GenAI in production</GradientText>
          </>
        }
        description={data.hero.description}
        compact
      />

      {/* Journey */}
      <Section>
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your <GradientText>GenAI Journey</GradientText>
            </h2>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
              {data.journey.sectionDescription}
            </p>
          </div>
        </FadeIn>
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.journey.items.map((item) => {
            const Icon = resolveIcon(item.icon)
            return (
              <StaggerItem key={item.step}>
                <Card className="h-full relative">
                  <span className="text-5xl font-bold text-[var(--accent-50)] absolute top-4 right-4 select-none">{item.step}</span>
                  <Icon className="w-10 h-10 text-[var(--accent-900)] mb-4" strokeWidth={1.5} />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 font-light leading-relaxed text-sm">{item.description}</p>
                </Card>
              </StaggerItem>
            )
          })}
        </StaggerChildren>
      </Section>

      {/* What You Get */}
      <Section className="bg-gray-50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <FadeIn direction="left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              What you <GradientText>walk away with</GradientText>
            </h2>
            <ul className="space-y-4">
              {data.benefits.items.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 font-light">{benefit}</span>
                </li>
              ))}
            </ul>
          </FadeIn>
          <FadeIn direction="right">
            <Card className="p-8 bg-gradient-cobalt text-white" hover={false}>
              <Sparkles className="w-12 h-12 text-cyan-400 mb-6" strokeWidth={1.5} />
              <h3 className="text-2xl font-bold mb-4">{data.benefits.highlight.title}</h3>
              <p className="text-[var(--accent-100)] font-light leading-relaxed">
                {data.benefits.highlight.description}
              </p>
            </Card>
          </FadeIn>
        </div>
      </Section>

      <CTASection
        title={data.cta.title}
        description={data.cta.description}
        buttonText="Get in Touch"
        buttonHref="/contactus"
      />
    </>
  )
}
