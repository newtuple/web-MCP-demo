'use client'

import { FormEvent, useCallback, useMemo, useRef, useState } from 'react'
import { ArrowRight, Briefcase, Building2, CheckCircle2, ChevronDown, Loader2, MapPin, Search, Sparkles } from 'lucide-react'
import MarkdownContent from '@/components/blog/MarkdownContent'
import { resolveIcon } from '@/lib/icons'
import Section from '@/components/ui/Section'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import FadeIn from '@/components/motion/FadeIn'
import StaggerChildren, { StaggerItem } from '@/components/motion/StaggerChildren'
import Turnstile, { TurnstileRef } from '@/components/ui/Turnstile'

interface CareersData {
  title: string
  description: string
  hero: {
    badge: string
    title: string
    description: string
  }
  whyJoin: {
    title: string
    description: string
  }
  benefits: {
    sectionTitle: string
    items: {
      title: string
      icon: string
      description: string
    }[]
  }
  positions: {
    sectionTitle: string
    items: {
      title: string
      level: string
      location: string
      type: string
      jdContent?: string
    }[]
  }
  cta: {
    title: string
    description: string
  }
}

type CareerApplicationState = {
  name: string
  email: string
  role: string
  level: string
  location: string
  employmentType: string
  resumeLink: string
  message: string
  consent: boolean
}

function normalizeValue(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function createJobId(item: { title: string; level: string; location: string; type: string }) {
  return `${normalizeValue(item.title)}-${normalizeValue(item.level)}-${normalizeValue(item.location)}-${normalizeValue(item.type)}`
}

export default function CareersContent({ data }: { data: CareersData }) {
  const [filters, setFilters] = useState({
    query: '',
    level: 'All',
    type: 'All',
    location: 'All',
  })

  const jobs = useMemo(
    () =>
      data.positions.items
        .filter((item) => Boolean(item.jdContent))
        .map((item, index) => ({
          ...item,
          title: item.title.trim(),
          level: item.level.trim(),
          location: item.location.trim(),
          type: item.type.trim(),
          id: `${createJobId(item)}-${index}`,
        })),
    [data.positions.items],
  )

  const levels = useMemo(
    () => ['All', ...Array.from(new Set(jobs.map((item) => item.level)))],
    [jobs],
  )
  const types = useMemo(
    () => ['All', ...Array.from(new Set(jobs.map((item) => item.type)))],
    [jobs],
  )
  const locations = useMemo(
    () => ['All', ...Array.from(new Set(jobs.map((item) => item.location)))],
    [jobs],
  )

  const filteredPositions = useMemo(
    () => {
      const q = normalizeValue(filters.query)
      return jobs.filter((item) => {
        const title = normalizeValue(item.title)
        const level = normalizeValue(item.level)
        const location = normalizeValue(item.location)
        const type = normalizeValue(item.type)

        const matchesQuery =
          q.length === 0 ||
          title.includes(q) ||
          level.includes(q) ||
          location.includes(q) ||
          type.includes(q)

        const matchesLevel = filters.level === 'All' || normalizeValue(filters.level) === level
        const matchesType = filters.type === 'All' || normalizeValue(filters.type) === type
        const matchesLocation =
          filters.location === 'All' || normalizeValue(filters.location) === location

        return matchesQuery && matchesLevel && matchesType && matchesLocation
      })
    },
    [jobs, filters],
  )

  const [expandedJob, setExpandedJob] = useState<string | null>(null)

  const seniorCount = jobs.filter((item) => normalizeValue(item.level) === 'senior').length
  const juniorCount = jobs.filter((item) => normalizeValue(item.level) === 'junior').length

  const hasFilters =
    filters.level !== 'All' ||
    filters.type !== 'All' ||
    filters.location !== 'All' ||
    filters.query.trim().length > 0

  const [application, setApplication] = useState<CareerApplicationState>({
    name: '',
    email: '',
    role: '',
    level: '',
    location: '',
    employmentType: '',
    resumeLink: '',
    message: '',
    consent: false,
  })
  const [applicationState, setApplicationState] = useState<'idle' | 'submitting' | 'failed' | 'success'>('idle')
  const [applicationError, setApplicationError] = useState<string | null>(null)
  const [honeypot, setHoneypot] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')
  const formLoadedAt = useRef(Date.now())
  const turnstileRef = useRef<TurnstileRef>(null)
  const onTurnstileVerify = useCallback((token: string) => setTurnstileToken(token), [])

  const handleRoleApply = (role: {
    title: string
    level: string
    location: string
    type: string
  }) => {
    setApplication((prev) => ({
      ...prev,
      role: role.title,
      level: role.level,
      location: role.location,
      employmentType: role.type,
    }))
    setApplicationState('idle')
    setApplicationError(null)
    document.getElementById('career-application-form')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  const handleApplicationSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setApplicationState('submitting')
    setApplicationError(null)

    try {
      const response = await fetch('/api/careers/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          application,
          _hp: honeypot,
          _t: formLoadedAt.current,
          _cf_turnstile: turnstileToken,
        }),
      })

      const body = (await response.json().catch(() => ({}))) as {
        error?: string
      }

      if (!response.ok) {
        const retryAfter = response.headers.get('Retry-After')
        if (response.status === 429) {
          setApplicationError(
            retryAfter
              ? `Too many requests. Try again in ${retryAfter} seconds.`
              : 'Too many requests. Please try again later.',
          )
        } else {
          setApplicationError(body.error ?? 'Failed to submit your application.')
        }
        setApplicationState('failed')
        turnstileRef.current?.reset()
        setTurnstileToken('')
        return
      }

      setApplicationState('success')
      setApplication({
        name: '',
        email: '',
        role: '',
        level: '',
        location: '',
        employmentType: '',
        resumeLink: '',
        message: '',
        consent: false,
      })
    } catch {
      setApplicationError('Network error. Please try again in a moment.')
      setApplicationState('failed')
      turnstileRef.current?.reset()
      setTurnstileToken('')
    }
  }

  return (
    <>
      <section className="relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute inset-0 bg-grid" />
        <div className="pointer-events-none absolute -top-24 left-[8%] h-72 w-72 rounded-full bg-[var(--accent-100)]/65 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-[6%] h-64 w-64 rounded-full bg-[var(--accent-50)] blur-3xl" />
        <Container className="relative z-10 pt-28 pb-16 md:pt-36 md:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-10 lg:gap-12 items-center">
            <FadeIn>
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-100)] bg-[var(--accent-50)]/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-900)] mb-7">
                  <Sparkles className="h-3.5 w-3.5" />
                  {data.hero.badge}
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl leading-[1.04] tracking-tight text-gray-950 mb-6 font-light">
                  {data.hero.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed max-w-2xl mb-9">
                  {data.hero.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-3.5">
                  <Button href="#open-roles" size="lg" className="bg-gray-950 text-white hover:text-white" fillClassName="bg-[var(--accent-900)]">
                    <span className="inline-flex items-center gap-2 whitespace-nowrap">
                      Browse Open Roles
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Button>
                  <Button href="/contactus" variant="outline" size="lg" className="border-gray-300 text-gray-900 hover:text-white" fillClassName="bg-[var(--accent-900)]">
                    Talk to Hiring Team
                  </Button>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.08}>
              <article className="group relative overflow-hidden rounded-3xl border border-gray-200/90 bg-white p-6 md:p-7 shadow-[0_24px_46px_-30px_rgba(15,23,42,0.35)]">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-400)] to-transparent -translate-x-[110%] transition-transform duration-700 group-hover:translate-x-0" />
                <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--accent-900)] font-semibold mb-5">
                  Hiring Snapshot
                </p>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="rounded-2xl border border-gray-200 bg-gray-50/85 p-4">
                    <p className="text-2xl md:text-3xl font-semibold text-gray-900">{jobs.length}</p>
                    <p className="text-xs uppercase tracking-[0.12em] text-gray-500 mt-1">Open roles</p>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-gray-50/85 p-4">
                    <p className="text-2xl md:text-3xl font-semibold text-gray-900">{locations.length - 1}</p>
                    <p className="text-xs uppercase tracking-[0.12em] text-gray-500 mt-1">Locations</p>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-gray-50/85 p-4">
                    <p className="text-2xl md:text-3xl font-semibold text-gray-900">{seniorCount}</p>
                    <p className="text-xs uppercase tracking-[0.12em] text-gray-500 mt-1">Senior roles</p>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-gray-50/85 p-4">
                    <p className="text-2xl md:text-3xl font-semibold text-gray-900">{juniorCount}</p>
                    <p className="text-xs uppercase tracking-[0.12em] text-gray-500 mt-1">Junior roles</p>
                  </div>
                </div>
                <div className="mt-5 rounded-2xl border border-[var(--accent-100)] bg-[var(--accent-50)]/60 p-4">
                  <p className="text-sm text-[var(--accent-900)] font-medium leading-relaxed">
                    We hire for impact, ownership, and strong execution in production AI.
                  </p>
                </div>
              </article>
            </FadeIn>
          </div>
        </Container>
      </section>

      <Section className="py-14 md:py-16 bg-white">
        <FadeIn>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--accent-900)] font-semibold mb-2">
              Why Join
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{data.whyJoin.title}</h2>
            <p className="text-lg text-gray-600 font-light leading-relaxed">{data.whyJoin.description}</p>
          </div>
        </FadeIn>
      </Section>

      <Section className="py-14 md:py-16 bg-gray-50">
        <FadeIn>
          <div className="text-center mb-10 md:mb-12">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--accent-900)] font-semibold mb-2">
              Employee Value
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{data.benefits.sectionTitle}</h2>
          </div>
        </FadeIn>
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {data.benefits.items.map((benefit) => {
            const Icon = resolveIcon(benefit.icon)
            return (
              <StaggerItem key={benefit.title}>
                <article className="group relative h-full min-h-[220px] overflow-hidden rounded-2xl border border-gray-200/90 bg-white p-5 md:p-6 shadow-[0_14px_28px_-22px_rgba(15,23,42,0.3)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent-300)] hover:shadow-[0_24px_40px_-26px_rgba(0,71,171,0.38)]">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-400)] to-transparent -translate-x-[110%] transition-transform duration-700 group-hover:translate-x-0" />
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--accent-100)] bg-[var(--accent-50)] mb-4">
                    <Icon className="h-5 w-5 text-[var(--accent-900)]" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600 font-light leading-relaxed">{benefit.description}</p>
                </article>
              </StaggerItem>
            )
          })}
        </StaggerChildren>
      </Section>

      <Section id="open-roles" className="py-14 md:py-16 bg-white">
        <FadeIn>
          <div className="text-center mb-10 md:mb-12">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--accent-900)] font-semibold mb-2">
              Job Portal
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{data.positions.sectionTitle}</h2>
            <p className="text-base md:text-lg text-gray-600 font-light max-w-2xl mx-auto">
              Search and filter roles by level, location, and employment type.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 xl:grid-cols-[300px_minmax(0,1fr)] gap-6 xl:gap-7">
          <FadeIn delay={0.05}>
            <aside className="xl:sticky xl:top-24 h-fit rounded-2xl border border-gray-200 bg-white p-4 md:p-5 shadow-[0_14px_28px_-24px_rgba(15,23,42,0.28)]">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-900)] mb-3">Filter roles</p>
              <label className="relative block mb-4">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={filters.query}
                  onChange={(event) => setFilters((prev) => ({ ...prev, query: event.target.value }))}
                  placeholder="Search by role or keyword"
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none transition-colors focus:border-[var(--accent-300)]"
                />
              </label>

              <FilterCapsuleGroup
                title="Level"
                value={filters.level}
                options={levels}
                onChange={(value) => setFilters((prev) => ({ ...prev, level: value }))}
              />
              <FilterCapsuleGroup
                title="Type"
                value={filters.type}
                options={types}
                onChange={(value) => setFilters((prev) => ({ ...prev, type: value }))}
              />
              <FilterCapsuleGroup
                title="Location"
                value={filters.location}
                options={locations}
                onChange={(value) => setFilters((prev) => ({ ...prev, location: value }))}
              />

              <button
                type="button"
                onClick={() => {
                  setFilters({
                    query: '',
                    level: 'All',
                    type: 'All',
                    location: 'All',
                  })
                }}
                className={`mt-3 w-full rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                  hasFilters
                    ? 'border-[var(--accent-200)] bg-[var(--accent-50)] text-[var(--accent-900)] hover:bg-[var(--accent-100)]'
                    : 'border-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                disabled={!hasFilters}
              >
                Clear filters
              </button>
            </aside>
          </FadeIn>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-5 shadow-[0_14px_30px_-24px_rgba(15,23,42,0.28)]">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gray-200 bg-gray-50/80 px-3.5 py-2.5">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredPositions.length}</span>{' '}
                {filteredPositions.length === 1 ? 'role' : 'roles'}
              </p>
              <p className="text-xs uppercase tracking-[0.12em] text-gray-500 inline-flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" />
                Newtuple Careers
              </p>
            </div>

            {filteredPositions.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/70 px-5 py-10 text-center">
                <p className="text-base font-medium text-gray-900">No matching roles found</p>
                <p className="text-sm text-gray-600 mt-2">Try adjusting your filters or search query.</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {filteredPositions.map((pos) => {
                  const isExpanded = expandedJob === pos.id
                  const hasJd = Boolean(pos.jdContent)
                  return (
                    <article key={pos.id} className="group relative overflow-hidden rounded-2xl border border-gray-200/90 bg-white transition-all duration-300 hover:border-[var(--accent-300)] hover:shadow-[0_22px_36px_-26px_rgba(0,71,171,0.42)]">
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-400)] to-transparent -translate-x-[110%] transition-transform duration-700 group-hover:translate-x-0" />
                      <div
                        className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 md:p-5 ${hasJd ? 'cursor-pointer' : ''}`}
                        onClick={() => hasJd && setExpandedJob(isExpanded ? null : pos.id)}
                      >
                        <div className="min-w-0">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--accent-100)] bg-[var(--accent-50)]">
                              <Briefcase className="h-4 w-4 text-[var(--accent-900)]" strokeWidth={1.5} />
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-lg font-semibold text-gray-900 leading-tight">{pos.title}</h3>
                              <div className="mt-2 flex flex-wrap items-center gap-2">
                                <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700">
                                  {pos.level}
                                </span>
                                <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700">
                                  {pos.type}
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700">
                                  <MapPin className="h-3 w-3" />
                                  {pos.location}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                        <div className="flex items-center gap-2 self-start md:self-center" onClick={(e) => e.stopPropagation()}>
                          {hasJd && (
                            <button
                              type="button"
                              onClick={() => setExpandedJob(isExpanded ? null : pos.id)}
                              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900 transition-colors"
                            >
                              View JD
                              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                          )}
                          <Button
                            onClick={() => handleRoleApply(pos)}
                            variant="outline"
                            size="sm"
                            className="border-gray-300 text-gray-900 hover:text-white"
                            fillClassName="bg-[var(--accent-900)]"
                          >
                            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                              Apply now
                              <ArrowRight className="h-3.5 w-3.5" />
                            </span>
                          </Button>
                        </div>
                      </div>

                      {isExpanded && pos.jdContent && (
                        <div className="border-t border-gray-200 bg-gray-50/50 px-5 md:px-7 py-5">
                          <MarkdownContent content={pos.jdContent} />
                          <div className="mt-6 pt-4 border-t border-gray-200">
                            <Button
                              onClick={() => handleRoleApply(pos)}
                              variant="outline"
                              size="sm"
                              className="border-gray-300 text-gray-900 hover:text-white"
                              fillClassName="bg-[var(--accent-900)]"
                            >
                              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                                Apply for this role
                                <ArrowRight className="h-3.5 w-3.5" />
                              </span>
                            </Button>
                          </div>
                        </div>
                      )}
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </Section>

      <Section id="career-application-form" className="py-14 md:py-16 bg-gray-50 border-t border-gray-200">
        <FadeIn>
          <div className="max-w-3xl mx-auto text-center mb-8">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--accent-900)] font-semibold mb-2">
              Application Form
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Apply to Newtuple</h2>
            <p className="text-base md:text-lg text-gray-600 font-light">
              Share your profile and role preference. Our hiring team will reach out if there is a fit.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.06}>
          <form
            onSubmit={handleApplicationSubmit}
            className="max-w-3xl mx-auto rounded-3xl border border-gray-200 bg-white p-5 md:p-7 shadow-[0_20px_34px_-24px_rgba(15,23,42,0.28)]"
          >
            {/* Honeypot - hidden from real users */}
            <div className="absolute opacity-0 -z-10 h-0 overflow-hidden" aria-hidden="true" tabIndex={-1}>
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-1.5">Full name</span>
                <input
                  type="text"
                  value={application.name}
                  onChange={(event) => setApplication((prev) => ({ ...prev, name: event.target.value }))}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition-colors focus:border-[var(--accent-300)]"
                />
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-1.5">Work email</span>
                <input
                  type="email"
                  value={application.email}
                  onChange={(event) => setApplication((prev) => ({ ...prev, email: event.target.value }))}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition-colors focus:border-[var(--accent-300)]"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="block text-sm font-medium text-gray-700 mb-1.5">Role you are applying for</span>
                <input
                  type="text"
                  value={application.role}
                  onChange={(event) => setApplication((prev) => ({ ...prev, role: event.target.value }))}
                  required
                  placeholder="Example: Senior Frontend Developer"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition-colors focus:border-[var(--accent-300)]"
                />
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-1.5">Level</span>
                <input
                  type="text"
                  value={application.level}
                  onChange={(event) => setApplication((prev) => ({ ...prev, level: event.target.value }))}
                  placeholder="Senior / Junior"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition-colors focus:border-[var(--accent-300)]"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="block text-sm font-medium text-gray-700 mb-1.5">Resume link</span>
                <input
                  type="url"
                  value={application.resumeLink}
                  onChange={(event) =>
                    setApplication((prev) => ({ ...prev, resumeLink: event.target.value }))
                  }
                  required
                  placeholder="https://..."
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition-colors focus:border-[var(--accent-300)]"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="block text-sm font-medium text-gray-700 mb-1.5">Cover message</span>
                <textarea
                  value={application.message}
                  onChange={(event) => setApplication((prev) => ({ ...prev, message: event.target.value }))}
                  required
                  rows={5}
                  placeholder="Share your relevant experience and why you'd like to join."
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition-colors focus:border-[var(--accent-300)]"
                />
              </label>
            </div>

            <label className="mt-4 inline-flex items-start gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={application.consent}
                onChange={(event) => setApplication((prev) => ({ ...prev, consent: event.target.checked }))}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-[var(--accent-900)] focus:ring-[var(--accent-500)]"
                required
              />
              <span>I consent to being contacted by the Newtuple hiring team regarding this application.</span>
            </label>

            {applicationError ? (
              <p className="mt-4 text-sm text-red-600">{applicationError}</p>
            ) : null}
            {applicationState === 'success' ? (
              <p className="mt-4 inline-flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                Application submitted successfully.
              </p>
            ) : null}

            <div className="mt-4">
              <Turnstile ref={turnstileRef} onVerify={onTurnstileVerify} />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={applicationState === 'submitting'}
                className="inline-flex items-center gap-2 rounded-full bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-900)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {applicationState === 'submitting' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting
                  </>
                ) : (
                  <>
                    Submit application
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
              <p className="text-xs text-gray-500">We usually respond within 2-3 business days.</p>
            </div>
          </form>
        </FadeIn>
      </Section>

      <section className="py-16 md:py-20 bg-white border-t border-gray-200">
        <Container className="text-center">
          <FadeIn>
            <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--accent-900)] font-semibold mb-3">
              Career Conversation
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-gray-900 leading-tight mb-4">
              {data.cta.title}
            </h2>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto mb-8">
              {data.cta.description}
            </p>
            <Button href="#career-application-form" size="lg" className="bg-gray-950 text-white hover:text-white" fillClassName="bg-[var(--accent-900)]">
              <span className="inline-flex items-center gap-2 whitespace-nowrap">
                Send your application
                <ArrowRight className="h-4 w-4" />
              </span>
            </Button>
          </FadeIn>
        </Container>
      </section>
    </>
  )
}

function FilterCapsuleGroup({
  title,
  value,
  options,
  onChange,
}: {
  title: string
  value: string
  options: string[]
  onChange: (option: string) => void
}) {
  return (
    <div className="mb-4">
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-gray-500 mb-2">{title}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={value === option}
            className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
              value === option
                ? 'border-[var(--accent-300)] bg-[var(--accent-50)] text-[var(--accent-900)]'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
