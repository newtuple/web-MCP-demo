'use client'

import { Cloud, Eye, Server, Shield } from 'lucide-react'
import Section from '@/components/ui/Section'
import FadeIn from '@/components/motion/FadeIn'
import StaggerChildren, { StaggerItem } from '@/components/motion/StaggerChildren'

interface DeploymentOptionsProps {
  title?: string
  description?: string
  theme?: 'light' | 'dark'
  mobileCarousel?: boolean
}

export default function DeploymentOptions({
  title = 'Deployment Options',
  description = 'Deploy wherever your security and compliance requirements demand.',
  theme = 'light',
  mobileCarousel = false,
}: DeploymentOptionsProps) {
  const options = [
    {
      icon: Cloud,
      title: 'Cloud-Native',
      tag: 'Managed',
      description: 'AWS, Azure, or Google Cloud Platform with automated scaling and redundancy.',
      detail: 'Best for: fastest global rollout',
    },
    {
      icon: Shield,
      title: 'Air-Gapped',
      tag: 'High Security',
      description: 'Full deployment on private infrastructure with complete data sovereignty.',
      detail: 'Best for: regulated workloads',
    },
    {
      icon: Server,
      title: 'Self-Hosted',
      tag: 'Flexible',
      description: 'Ships as Docker Compose with optional Helm and Terraform modules.',
      detail: 'Best for: custom platform stacks',
    },
    {
      icon: Eye,
      title: 'Observable',
      tag: 'Operations',
      description: 'Built-in Prometheus/Grafana observability with secure LLM proxying.',
      detail: 'Best for: production monitoring',
    },
  ]

  const isDark = theme === 'dark'
  const sectionClass = isDark ? 'bg-gray-950 relative overflow-hidden' : 'bg-gray-50'
  const titleClass = isDark ? 'text-white' : 'text-gray-900'
  const descClass = isDark ? 'text-gray-400' : 'text-gray-600'
  const eyebrowClass = isDark ? 'text-[var(--accent-300)]' : 'text-[var(--accent-900)]'
  const cardBaseClass = isDark
    ? 'bg-gray-900/90 border-gray-800 text-white shadow-[0_24px_44px_-30px_rgba(0,0,0,0.85)] hover:border-[var(--accent-400)]/50 hover:shadow-[0_30px_54px_-30px_rgba(0,71,171,0.5)]'
    : 'bg-white border-gray-200/90 text-gray-900 shadow-[0_16px_30px_-24px_rgba(15,23,42,0.32)] hover:border-[var(--accent-300)] hover:shadow-[0_24px_44px_-26px_rgba(0,71,171,0.35)]'
  const iconWrapClass = isDark
    ? 'bg-gray-800 border-gray-700 group-hover:bg-[var(--accent-500)]/15 group-hover:border-[var(--accent-400)]/40'
    : 'bg-[var(--accent-50)] border-[var(--accent-100)] group-hover:bg-[var(--accent-100)] group-hover:border-[var(--accent-200)]'
  const iconClass = isDark
    ? 'w-6 h-6 text-[var(--accent-300)] transition-colors duration-300 group-hover:text-[var(--accent-200)]'
    : 'w-6 h-6 text-[var(--accent-900)] transition-colors duration-300 group-hover:text-[var(--accent-800)]'
  const tagClass = isDark
    ? 'border-gray-700 bg-gray-800/85 text-gray-300'
    : 'border-[var(--accent-100)] bg-white text-[var(--accent-800)]'
  const cardTitleClass = isDark ? 'text-lg font-semibold text-white mb-2' : 'text-lg font-semibold text-gray-900 mb-2'
  const cardDescClass = isDark ? 'text-gray-400 font-light text-sm leading-relaxed' : 'text-gray-600 font-light text-sm leading-relaxed'
  const detailClass = isDark ? 'text-[var(--accent-300)]/90' : 'text-[var(--accent-900)]'
  const overlayClass = isDark
    ? 'bg-[radial-gradient(120%_90%_at_0%_0%,rgba(0,71,171,0.18),transparent_60%),radial-gradient(120%_90%_at_100%_100%,rgba(0,184,217,0.15),transparent_65%)]'
    : 'bg-[radial-gradient(120%_90%_at_0%_0%,rgba(0,71,171,0.08),transparent_60%),radial-gradient(120%_90%_at_100%_100%,rgba(0,184,217,0.12),transparent_65%)]'
  const listClass = mobileCarousel
    ? 'relative z-10 flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-1 px-1 pb-2 md:mx-0 md:px-0 md:pb-0 md:overflow-visible md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6'
    : 'relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
  const itemClass = mobileCarousel ? 'min-w-[84%] sm:min-w-[62%] md:min-w-0 snap-start' : ''

  return (
    <Section className={sectionClass}>
      {isDark && <div className="pointer-events-none absolute inset-0 bg-grid-dark" />}
      <FadeIn>
        <div className="relative z-10 text-center mb-16">
          <p className={`text-[11px] uppercase tracking-[0.16em] font-semibold mb-2 ${eyebrowClass}`}>
            Deployment Architecture
          </p>
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${titleClass}`}>{title}</h2>
          <p className={`text-lg font-light max-w-2xl mx-auto ${descClass}`}>{description}</p>
        </div>
      </FadeIn>
      <StaggerChildren className={listClass}>
        {options.map((opt) => (
          <StaggerItem key={opt.title} className={itemClass}>
            <article
              className={`group relative h-full overflow-hidden rounded-2xl border p-5 md:p-6 transition-all duration-300 hover:-translate-y-1 ${cardBaseClass}`}
            >
              <div className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${overlayClass}`} />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-400)] to-transparent -translate-x-[110%] transition-transform duration-700 group-hover:translate-x-0" />

              <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div
                    className={`h-12 w-12 rounded-xl border flex items-center justify-center transition-all duration-300 ${iconWrapClass}`}
                  >
                    <opt.icon className={iconClass} strokeWidth={1.5} />
                  </div>
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${tagClass}`}>
                    {opt.tag}
                  </span>
                </div>

                <h3 className={cardTitleClass}>{opt.title}</h3>
                <p className={cardDescClass}>{opt.description}</p>
                <p className={`mt-3 text-xs font-medium ${detailClass}`}>{opt.detail}</p>
              </div>
            </article>
          </StaggerItem>
        ))}
      </StaggerChildren>
    </Section>
  )
}
