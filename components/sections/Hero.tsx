'use client'

import { ReactNode } from 'react'
import Container from '@/components/ui/Container'
import FadeIn from '@/components/motion/FadeIn'

interface HeroProps {
  badge?: string
  title: ReactNode
  description: string
  children?: ReactNode
  className?: string
  gradient?: boolean
  compact?: boolean
  fullScreen?: boolean
  variant?: 'centered' | 'split'
  visual?: ReactNode
}

export default function Hero({
  badge,
  title,
  description,
  children,
  className = '',
  gradient = true,
  compact = false,
  fullScreen = false,
  variant = 'centered',
  visual,
}: HeroProps) {
  const padding = compact
    ? 'pt-24 pb-14 md:pt-32 md:pb-20'
    : 'pt-32 pb-20 md:pt-40 md:pb-28'

  const fullScreenClass = fullScreen ? 'min-h-screen flex items-center' : ''

  if (variant === 'split') {
    return (
      <section className={`relative overflow-hidden ${padding} ${fullScreenClass} ${gradient ? 'bg-gradient-hero' : ''} ${className}`}>
        {gradient && <div className="absolute inset-0 bg-grid" />}
        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              {badge && (
                <FadeIn>
                  <span className="inline-flex items-center rounded-full bg-cobalt-50 px-4 py-1.5 text-sm font-medium text-cobalt-900 mb-6">
                    {badge}
                  </span>
                </FadeIn>
              )}
              <FadeIn delay={0.1}>
                <h1 className="text-4xl md:text-5xl font-extralight tracking-tight text-gray-900 mb-6">
                  {title}
                </h1>
              </FadeIn>
              <FadeIn delay={0.2}>
                <p className="text-lg text-gray-600 font-light leading-relaxed mb-8">
                  {description}
                </p>
              </FadeIn>
              {children && (
                <FadeIn delay={0.3}>
                  {children}
                </FadeIn>
              )}
            </div>
            <FadeIn direction="right" delay={0.2}>
              <div>
                {visual || (
                  <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-cobalt-50 to-cobalt-100/80 border border-cobalt-200/50 flex items-center justify-center p-8">
                    <div className="w-full space-y-3 opacity-60">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-2.5 h-2.5 rounded-full bg-cobalt-300/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-cobalt-300/30" />
                        <div className="w-2.5 h-2.5 rounded-full bg-cobalt-300/20" />
                      </div>
                      <div className="w-3/4 h-2.5 rounded bg-cobalt-200/40" />
                      <div className="w-full h-2.5 rounded bg-cobalt-200/30" />
                      <div className="w-2/3 h-2.5 rounded bg-cobalt-200/35" />
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="h-16 rounded-lg bg-cobalt-200/25" />
                        <div className="h-16 rounded-lg bg-cobalt-200/20" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className={`relative overflow-hidden ${padding} ${fullScreenClass} ${gradient ? 'bg-gradient-hero' : ''} ${className}`}>
      {gradient && <div className="absolute inset-0 bg-grid" />}
      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {badge && (
            <FadeIn>
              <span className="inline-flex items-center rounded-full bg-cobalt-50 px-4 py-1.5 text-sm font-medium text-cobalt-900 mb-6">
                {badge}
              </span>
            </FadeIn>
          )}
          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extralight tracking-tight text-gray-900 mb-6">
              {title}
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed max-w-3xl mx-auto mb-8">
              {description}
            </p>
          </FadeIn>
          {children && (
            <FadeIn delay={0.3}>
              {children}
            </FadeIn>
          )}
        </div>
      </Container>
    </section>
  )
}
