'use client'
/* eslint-disable @next/next/no-img-element */

import { Building2 } from 'lucide-react'
import Container from '@/components/ui/Container'
import FadeIn from '@/components/motion/FadeIn'
import StaggerChildren, { StaggerItem } from '@/components/motion/StaggerChildren'

interface Client {
  name: string
  logo?: string
  industry: string
}

interface ClientLogosProps {
  title?: string
  clients: Client[]
  className?: string
}

export default function ClientLogos({
  title = 'Trusted by forward-thinking enterprises',
  clients,
  className = '',
}: ClientLogosProps) {
  return (
    <section className={`relative overflow-hidden py-16 md:py-20 bg-white ${className}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(0,71,171,0.04),transparent_70%)]" />
      <Container>
        <FadeIn>
          <div className="flex items-center justify-center gap-4 md:gap-6 mb-10 md:mb-12">
            <span className="h-px w-10 md:w-16 bg-gradient-to-r from-transparent to-gray-300" />
            <p className="text-center text-base md:text-lg font-medium text-gray-500 uppercase tracking-[0.12em]">
              {title}
            </p>
            <span className="h-px w-10 md:w-16 bg-gradient-to-l from-transparent to-gray-300" />
          </div>
        </FadeIn>

        <StaggerChildren className="flex flex-wrap items-center justify-center gap-x-10 md:gap-x-12 lg:gap-x-14 gap-y-10 md:gap-y-12">
          {clients.map((client) => (
            <StaggerItem key={client.name}>
              {client.logo ? (
                <div className="group relative flex min-h-[72px] items-center justify-center px-3 py-2 md:min-h-[88px]">
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="h-11 w-auto max-w-[160px] object-contain transition-transform duration-300 group-hover:scale-[1.04] sm:h-12 sm:max-w-[180px] md:h-14 md:max-w-[210px] lg:h-16"
                  />
                  <span className="pointer-events-none absolute -bottom-1 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-cobalt-400/60 transition-all duration-300 group-hover:w-8" />
                </div>
              ) : (
                <div className="group inline-flex items-center gap-2 px-3 py-1.5 text-gray-500 transition-colors duration-200 hover:text-cobalt-900">
                  <Building2 className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                  <span className="text-sm font-medium whitespace-nowrap">{client.name}</span>
                </div>
              )}
            </StaggerItem>
          ))}
        </StaggerChildren>

        <div className="mt-10 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </Container>
    </section>
  )
}
