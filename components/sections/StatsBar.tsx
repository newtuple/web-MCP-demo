'use client'

import FadeIn from '@/components/motion/FadeIn'
import Container from '@/components/ui/Container'

interface Stat {
  value: string
  label: string
}

interface StatsBarProps {
  stats: Stat[]
  className?: string
  dark?: boolean
}

export default function StatsBar({ stats, className = '', dark = false }: StatsBarProps) {
  return (
    <section className={`py-16 ${dark ? 'bg-gradient-cobalt text-white' : 'bg-cobalt-50'} ${className}`}>
      <Container>
        <div className={`grid grid-cols-2 md:grid-cols-${stats.length} gap-8 text-center`}>
          {stats.map((stat, i) => (
            <FadeIn key={stat.label} delay={i * 0.1}>
              <div>
                <div className={`text-3xl md:text-4xl font-bold mb-2 ${dark ? 'text-white' : 'text-cobalt-900'}`}>
                  {stat.value}
                </div>
                <div className={`text-sm font-light ${dark ? 'text-cobalt-200' : 'text-gray-600'}`}>
                  {stat.label}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  )
}
