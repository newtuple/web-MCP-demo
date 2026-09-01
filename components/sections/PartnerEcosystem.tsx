'use client'
/* eslint-disable @next/next/no-img-element */

import { Award, BrainCircuit, Building2, Cloud, Handshake } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import FadeIn from '@/components/motion/FadeIn'
import StaggerChildren, { StaggerItem } from '@/components/motion/StaggerChildren'

export interface PartnerItem {
  name: string
  logo?: string
  badge?: string
  badgeLogo?: string
  href?: string
}

export interface PartnerGroup {
  title: string
  description: string
  icon: 'model' | 'cloud' | 'delivery'
  items: PartnerItem[]
}

const icons = {
  model: BrainCircuit,
  cloud: Cloud,
  delivery: Handshake,
}

function PartnerMark({ partner, featured = false }: { partner: PartnerItem; featured?: boolean }) {
  const [logoFailed, setLogoFailed] = useState(false)
  const [badgeLogoFailed, setBadgeLogoFailed] = useState(false)

  const card = (
    <div
      className={`group relative flex h-[116px] flex-col items-center justify-center rounded-2xl border px-5 py-4 text-center transition-all duration-300 md:h-[120px] ${
        featured
          ? 'border-[var(--accent-300)] bg-white shadow-[0_18px_36px_-22px_rgba(0,71,171,0.5)] hover:-translate-y-1 hover:border-[var(--accent-500)]'
          : 'border-gray-200 bg-white/80 hover:-translate-y-0.5 hover:border-[var(--accent-200)] hover:bg-white'
      }`}
    >
      {partner.logo && !logoFailed ? (
        <img
          src={partner.logo}
          alt={partner.name}
          onError={() => setLogoFailed(true)}
          className={`object-contain ${featured ? 'h-auto w-full max-w-[160px]' : 'h-10 max-w-[170px]'}`}
        />
      ) : (
        <span className={`text-lg font-semibold tracking-tight ${featured ? 'text-[var(--accent-900)]' : 'text-gray-800'}`}>
          {partner.name}
        </span>
      )}
      {partner.badge && partner.badgeLogo && !badgeLogoFailed ? (
        <img src={partner.badgeLogo} alt={partner.badge} onError={() => setBadgeLogoFailed(true)} className="mt-1 h-7 max-w-[150px] object-contain" />
      ) : partner.badge ? (
        <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[var(--accent-50)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--accent-800)]">
          <Award className="h-3 w-3" />
          {partner.badge}
        </span>
      ) : null}
      <span className="pointer-events-none absolute -bottom-px left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-[var(--accent-500)] transition-all duration-300 group-hover:w-10" />
    </div>
  )

  return partner.href ? (
    <Link href={partner.href} className="block h-full" aria-label={`Read about ${partner.name}`}>
      {card}
    </Link>
  ) : (
    card
  )
}

export default function PartnerEcosystem({ groups }: { groups: PartnerGroup[] }) {
  return (
    <section className="relative overflow-hidden border-y border-gray-100 bg-gradient-to-b from-gray-50 via-white to-gray-50 py-20 md:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_0%,rgba(0,71,171,0.07),transparent_70%)]" />
      <Container className="relative z-10">
        <FadeIn>
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--accent-50)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent-900)]">
              <Building2 className="h-3.5 w-3.5" />
              Platforms &amp; partnerships
            </span>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Built across the AI ecosystem</h2>
            <p className="text-base font-light leading-relaxed text-gray-600 md:text-lg">
              Formal partnerships and proven platform experience help us move reliable AI into production.
            </p>
          </div>
        </FadeIn>

        <div className="grid gap-6 lg:grid-cols-3">
          {groups.map((group, groupIndex) => {
            const Icon = icons[group.icon]
            return (
              <FadeIn key={group.title} delay={groupIndex * 0.08}>
                <div className={`h-full rounded-3xl border p-5 md:p-6 ${group.icon === 'model' ? 'border-[var(--accent-200)] bg-[var(--accent-50)]/45' : 'border-gray-200 bg-white/70'}`}>
                  <div className="mb-5 flex items-start gap-3 lg:min-h-[132px]">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-900)] text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{group.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-gray-500">{group.description}</p>
                    </div>
                  </div>
                  <StaggerChildren className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    {group.items.map((partner, partnerIndex) => (
                      <StaggerItem key={partner.name}>
                        <PartnerMark partner={partner} featured={group.icon === 'model' && partnerIndex === 0} />
                      </StaggerItem>
                    ))}
                  </StaggerChildren>
                </div>
              </FadeIn>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
