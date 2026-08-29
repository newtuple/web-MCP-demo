'use client'
/* eslint-disable @next/next/no-img-element */

import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'
import Hero from '@/components/sections/Hero'
import Section from '@/components/ui/Section'
import FadeIn from '@/components/motion/FadeIn'
import ImagePlaceholder from '@/components/ui/ImagePlaceholder'
import HighlightedText from '@/components/ui/HighlightedText'

interface ShowcaseFeature {
  icon: LucideIcon
  title: string
  description: string
}

export interface ShowcaseItem {
  title: string
  highlight?: string
  description: string
  visual: 'dashboard' | 'chat' | 'chart' | 'flow'
  visualLabel?: string
  image?: string
  features?: ShowcaseFeature[]
}

interface ProductShowcaseProps {
  badge?: string
  items: ShowcaseItem[]
  heroChildren?: ReactNode
}

function FeatureBullets({ features }: { features: ShowcaseFeature[] }) {
  return (
    <div className="space-y-4 mt-6">
      {features.map((f) => (
        <div key={f.title} className="flex items-start gap-3">
          <f.icon className="w-5 h-5 text-[var(--accent-900)] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
          <div>
            <span className="font-semibold text-gray-900 text-sm">{f.title}</span>
            <span className="text-gray-600 font-light text-sm">  {f.description}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function Visual({ item }: { item: ShowcaseItem }) {
  if (item.image) {
    return (
      <img
        src={item.image}
        alt={item.visualLabel || item.title}
        className="rounded-2xl border border-gray-200 shadow-lg w-full"
      />
    )
  }
  return <ImagePlaceholder variant={item.visual} label={item.visualLabel} />
}

export default function ProductShowcase({ badge, items, heroChildren }: ProductShowcaseProps) {
  return (
    <>
      {items.map((item, index) => {
        const isReversed = index % 2 !== 0

        if (index === 0) {
          return (
            <Hero
              key={index}
              badge={badge}
              title={<HighlightedText text={item.title} highlight={item.highlight} />}
              description={item.description}
              variant="split"
              compact
              visual={<Visual item={item} />}
            >
              {heroChildren}
              {item.features && item.features.length > 0 && (
                <FeatureBullets features={item.features} />
              )}
            </Hero>
          )
        }

        return (
          <Section key={index} className={isReversed ? 'bg-gray-50' : ''}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <FadeIn direction={isReversed ? 'right' : 'left'} className={isReversed ? 'lg:order-last' : ''}>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    <HighlightedText text={item.title} highlight={item.highlight} />
                  </h2>
                  <p className="text-lg text-gray-600 font-light leading-relaxed">
                    {item.description}
                  </p>
                  {item.features && item.features.length > 0 && (
                    <FeatureBullets features={item.features} />
                  )}
                </div>
              </FadeIn>
              <FadeIn direction={isReversed ? 'left' : 'right'} className={isReversed ? 'lg:order-first' : ''}>
                <Visual item={item} />
              </FadeIn>
            </div>
          </Section>
        )
      })}
    </>
  )
}
