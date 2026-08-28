import Image from 'next/image'
import { Linkedin } from 'lucide-react'
import Section from '@/components/ui/Section'
import FadeIn from '@/components/motion/FadeIn'
import StaggerChildren, { StaggerItem } from '@/components/motion/StaggerChildren'

export interface LeadershipMember {
  name: string
  role: string
  bio: string
  image?: string
  linkedin: string
}

interface LeadershipProps {
  eyebrow: string
  title: string
  description: string
  members: LeadershipMember[]
}

export default function Leadership({ eyebrow, title, description, members }: LeadershipProps) {
  return (
    <Section id="leadership" className="py-14 md:py-16 bg-gray-50">
      <FadeIn>
        <div className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-cobalt-900">
            {eyebrow}
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">{title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base font-light leading-relaxed text-gray-600 md:text-lg">
            {description}
          </p>
        </div>
      </FadeIn>

      <StaggerChildren className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 md:gap-6">
        {members.map((member) => {
          const initials = member.name
            .split(' ')
            .map((part) => part[0])
            .join('')
            .slice(0, 2)

          return (
            <StaggerItem key={member.name} className="h-full">
              <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200/90 bg-white px-5 pb-6 pt-5 text-center shadow-[0_16px_32px_-24px_rgba(15,23,42,0.32)] transition-all duration-300 hover:-translate-y-1 hover:border-cobalt-300 hover:shadow-[0_24px_42px_-26px_rgba(0,71,171,0.42)]">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] -translate-x-[110%] bg-gradient-to-r from-transparent via-cobalt-400 to-transparent transition-transform duration-700 group-hover:translate-x-0" />

                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${member.name} on LinkedIn`}
                  className="absolute right-3.5 top-3.5 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-cobalt-100 bg-cobalt-50 text-cobalt-900 transition-colors hover:border-cobalt-300 hover:bg-cobalt-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus-visible:ring-offset-2"
                >
                  <Linkedin className="h-4 w-4" strokeWidth={1.8} />
                </a>

                <div className="mx-auto mb-5 rounded-full bg-gradient-to-br from-cobalt-200 via-cobalt-50 to-cyan-100 p-1.5">
                  <div className="relative h-36 w-36 overflow-hidden rounded-full bg-white sm:h-40 sm:w-40 lg:h-36 lg:w-36 xl:h-40 xl:w-40">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={`${member.name}, ${member.role} at Newtuple`}
                        fill
                        sizes="(min-width: 1280px) 160px, (min-width: 1024px) 144px, 160px"
                        className="object-cover"
                      />
                    ) : (
                      <div
                        aria-hidden="true"
                        className="flex h-full w-full items-center justify-center bg-cobalt-50 text-4xl font-semibold tracking-tight text-cobalt-900"
                      >
                        {initials}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex min-h-[88px] flex-col items-center">
                  <h3 className="flex min-h-[48px] items-center justify-center text-xl font-semibold leading-tight text-gray-950">
                    {member.name}
                  </h3>
                  <p className="flex min-h-[40px] items-start justify-center text-sm font-semibold leading-snug text-cobalt-900">
                    {member.role}
                  </p>
                </div>

                <p className="mt-4 border-t border-gray-100 pt-4 text-sm font-light leading-relaxed text-gray-600">
                  {member.bio}
                </p>
              </article>
            </StaggerItem>
          )
        })}
      </StaggerChildren>
    </Section>
  )
}
