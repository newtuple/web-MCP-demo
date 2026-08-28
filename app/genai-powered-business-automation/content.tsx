'use client'

import Hero from '@/components/sections/Hero'
import CTASection from '@/components/sections/CTASection'
import FeatureGrid from '@/components/sections/FeatureGrid'
import StatsBar from '@/components/sections/StatsBar'
import DeploymentOptions from '@/components/sections/DeploymentOptions'
import Section from '@/components/ui/Section'
import GradientText from '@/components/ui/GradientText'
import FadeIn from '@/components/motion/FadeIn'
import { resolveIcon } from '@/lib/icons'

interface BusinessAutomationData {
  title: string
  description: string
  hero: {
    badge: string
    title: string
    description: string
  }
  stats: { value: string; label: string }[]
  agentSolutions: {
    sectionTitle: string
    sectionDescription: string
    items: {
      icon: string
      title: string
      description: string
    }[]
  }
  whyUs: {
    sectionTitle: string
    sectionDescription: string
    items: {
      icon: string
      title: string
      description: string
    }[]
  }
  showDeployment: boolean
  cta: {
    title: string
    description: string
  }
}

export default function AgentsAsServiceContent({ data }: { data: BusinessAutomationData }) {
  const { hero, stats, agentSolutions, whyUs, cta } = data

  const agentSolutionFeatures = agentSolutions.items.map((item: any) => ({
    ...item,
    icon: resolveIcon(item.icon),
  }))

  const whyUsFeatures = whyUs.items.map((item: any) => ({
    ...item,
    icon: resolveIcon(item.icon),
  }))

  return (
    <>
      <Hero
        badge={hero.badge}
        title={
          <>
            Powerful AI agents that{' '}
            <GradientText>transform your operations</GradientText>
          </>
        }
        description={hero.description}
      />

      <StatsBar stats={stats} dark />

      {/* Agent Solutions */}
      <Section>
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              AI Agents for <GradientText>every function</GradientText>
            </h2>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
              {agentSolutions.sectionDescription}
            </p>
          </div>
        </FadeIn>
        <FeatureGrid features={agentSolutionFeatures} columns={3} />
      </Section>

      {/* Why Newtuple */}
      <Section className="bg-gray-50">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why <GradientText>Newtuple</GradientText>
            </h2>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
              {whyUs.sectionDescription}
            </p>
          </div>
        </FadeIn>
        <FeatureGrid features={whyUsFeatures} columns={4} />
      </Section>

      {data.showDeployment && <DeploymentOptions />}

      <CTASection
        title={cta.title}
        description={cta.description}
        buttonText="Get in Touch"
        buttonHref="/contactus"
      />
    </>
  )
}
