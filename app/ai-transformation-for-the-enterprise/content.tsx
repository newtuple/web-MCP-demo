'use client'

import { AlertCircle, CheckCircle } from 'lucide-react'
import Hero from '@/components/sections/Hero'
import CTASection from '@/components/sections/CTASection'
import FeatureGrid from '@/components/sections/FeatureGrid'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'
import GradientText from '@/components/ui/GradientText'
import ImagePlaceholder from '@/components/ui/ImagePlaceholder'
import FadeIn from '@/components/motion/FadeIn'
import StaggerChildren, { StaggerItem } from '@/components/motion/StaggerChildren'
import { resolveIcon } from '@/lib/icons'

interface AITransformationData {
  title: string
  description: string
  hero: {
    badge: string
    title: string
    description: string
  }
  capabilities: {
    sectionTitle: string
    items: { title: string; icon: string; description: string }[]
  }
  challenge: {
    title: string
    description: string
    painPoints: string[]
    approach: {
      title: string
      description: string
      illustration: string
    }
  }
  approach: {
    sectionTitle: string
    items: { step: string; title: string; description: string }[]
  }
  cta: {
    title: string
    description: string
  }
}

export default function AITransformationContent({ data }: { data: AITransformationData }) {
  const capabilities = data.capabilities.items.map((item) => ({
    ...item,
    icon: resolveIcon(item.icon),
  }))

  return (
    <>
      <Hero
        badge={data.hero.badge}
        title={
          <>
            Transform your enterprise with <GradientText>AI that delivers</GradientText>
          </>
        }
        description={data.hero.description}
        compact
      />

      {/* Challenge & Approach */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <FadeIn direction="left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {data.challenge.title}
            </h2>
            <p className="text-lg text-gray-600 font-light leading-relaxed mb-6">
              {data.challenge.description}
            </p>
            <ul className="space-y-3">
              {data.challenge.painPoints.map((point: string) => (
                <li key={point} className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 font-light">{point}</span>
                </li>
              ))}
            </ul>
          </FadeIn>
          <FadeIn direction="right">
            <Card className="p-8 bg-gradient-cobalt text-white" hover={false}>
              <CheckCircle className="w-12 h-12 text-cyan-400 mb-6" strokeWidth={1.5} />
              <h3 className="text-2xl font-bold mb-4">{data.challenge.approach.title}</h3>
              <p className="text-[var(--accent-100)] font-light leading-relaxed">
                {data.challenge.approach.description}
              </p>
            </Card>
          </FadeIn>
        </div>
      </Section>

      {/* Capabilities */}
      <Section>
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What we <GradientText>deliver</GradientText>
            </h2>
          </div>
        </FadeIn>
        <FeatureGrid features={capabilities} columns={3} />
      </Section>

      {/* Approach */}
      <Section className="bg-gray-50">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our <GradientText>Approach</GradientText>
            </h2>
          </div>
        </FadeIn>
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.approach.items.map((item) => (
            <StaggerItem key={item.step}>
              <Card className="h-full relative">
                <span className="text-5xl font-bold text-[var(--accent-50)] absolute top-4 right-4 select-none">{item.step}</span>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 font-light leading-relaxed text-sm">{item.description}</p>
              </Card>
            </StaggerItem>
          ))}
        </StaggerChildren>
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
