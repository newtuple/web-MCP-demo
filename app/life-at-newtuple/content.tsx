'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, X } from 'lucide-react'
import Section from '@/components/ui/Section'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import FadeIn from '@/components/motion/FadeIn'
import StaggerChildren, { StaggerItem } from '@/components/motion/StaggerChildren'
import { resolveIcon } from '@/lib/icons'

interface LifeData {
  title: string
  description: string
  hero: {
    badge: string
    title: string
    description: string
  }
  culture: {
    sectionTitle: string
    sectionDescription: string
    items: {
      title: string
      icon: string
      description: string
    }[]
  }
  dayInLife: {
    title: string
    description: string
    items: {
      time: string
      title: string
      description: string
    }[]
  }
  photoGallery: {
    title: string
    description: string
    placeholders: { label: string }[]
  }
  perks: {
    sectionTitle: string
    items: {
      title: string
      icon: string
      description: string
    }[]
  }
  cta: {
    title: string
    description: string
    buttonText: string
    buttonHref: string
  }
}

type GalleryImage = {
  src: string
  alt: string
}

const galleryImages: GalleryImage[] = [
  { src: '/images/team/IMG_0311_edited.jpg', alt: 'Brainstorming session at Newtuple' },
  { src: '/images/team/IMG_1273.jpg', alt: 'Product workshop with the team' },
  { src: '/images/team/IMG_1774.jpg', alt: 'Celebrating a major milestone together' },
  { src: '/images/team/IMG_0905.jpg', alt: 'Whiteboard planning with the engineering squad' },
  { src: '/images/team/IMG_5844.jpg', alt: 'Office culture and candid moments' },
  { src: '/images/team/IMG_2944.jpg', alt: 'Team outing and bonding moments' },
  { src: '/images/team/IMG_0224.jpg', alt: 'Cross-functional collaboration in action' },
  { src: '/images/team/IMG20241121111536.jpg', alt: 'Learning session with the core team' },
]

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[540px]">
      <div className="pointer-events-none absolute -inset-8 rounded-full bg-cobalt-100/70 blur-3xl" />

      <div className="relative rounded-3xl border border-gray-200/90 bg-white p-3 shadow-[0_28px_58px_-36px_rgba(15,23,42,0.35)]">
        <div className="relative aspect-[16/11] overflow-hidden rounded-2xl">
          <Image
            src="/images/team/IMG_0311_edited.jpg"
            alt="Life at Newtuple team moment"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 92vw, 520px"
            priority
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />
          <div className="absolute bottom-3 left-3 rounded-full border border-white/30 bg-black/45 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            Life at Newtuple
          </div>
        </div>
      </div>

      <div className="absolute -left-5 top-8 hidden md:block w-36 rounded-2xl border border-white/80 bg-white p-2 shadow-[0_18px_36px_-24px_rgba(15,23,42,0.45)] animate-float">
        <div className="relative h-24 overflow-hidden rounded-xl">
          <Image
            src="/images/team/IMG_1776.jpg"
            alt="Team collaboration"
            fill
            className="object-cover"
            sizes="144px"
          />
        </div>
      </div>

      <div className="absolute -right-4 bottom-8 hidden md:block w-40 rounded-2xl border border-white/80 bg-white p-2 shadow-[0_18px_36px_-24px_rgba(15,23,42,0.45)] animate-float-delayed">
        <div className="relative h-24 overflow-hidden rounded-xl">
          <Image
            src="/images/team/IMG_2616.jpg"
            alt="Team event moment"
            fill
            className="object-cover"
            sizes="160px"
          />
        </div>
      </div>
    </div>
  )
}

function PhotoCarouselRow({
  images,
  reverse = false,
  onImageSelect,
}: {
  images: GalleryImage[]
  reverse?: boolean
  onImageSelect: (image: GalleryImage) => void
}) {
  const loopImages = [...images, ...images]

  return (
    <div className="group/row relative overflow-hidden rounded-2xl border border-gray-800/90 bg-gray-900/70">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 md:w-16 bg-gradient-to-r from-gray-950 via-gray-950/90 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 md:w-16 bg-gradient-to-l from-gray-950 via-gray-950/90 to-transparent" />
      <div
        className={`flex w-max items-stretch gap-4 p-3 will-change-transform group-hover/row:[animation-play-state:paused] ${reverse ? 'animate-scroll-cards [animation-direction:reverse] [animation-duration:68s]' : 'animate-scroll-cards [animation-duration:62s]'}`}
      >
        {loopImages.map((image, index) => (
          <button
            type="button"
            key={`${image.src}-${index}`}
            onClick={() => onImageSelect(image)}
            className="group/card relative h-[210px] w-[250px] sm:h-[230px] sm:w-[280px] md:h-[250px] md:w-[320px] overflow-hidden rounded-xl border border-gray-700/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-400/70"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
              sizes="(max-width: 640px) 68vw, (max-width: 768px) 280px, 320px"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export default function LifeContent({ data }: { data: LifeData }) {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null)

  const cultureItems = data.culture.items.map((item) => ({
    ...item,
    icon: resolveIcon(item.icon),
  }))

  const perkItems = data.perks.items.map((item) => ({
    ...item,
    icon: resolveIcon(item.icon),
  }))

  const activeImage = activeImageIndex !== null ? galleryImages[activeImageIndex] : null

  const openImage = useCallback((image: GalleryImage) => {
    const index = galleryImages.findIndex((item) => item.src === image.src)
    if (index >= 0) setActiveImageIndex(index)
  }, [])

  const closeLightbox = useCallback(() => {
    setActiveImageIndex(null)
  }, [])

  const showPrev = useCallback(() => {
    setActiveImageIndex((current) => {
      if (current === null) return null
      return current === 0 ? galleryImages.length - 1 : current - 1
    })
  }, [])

  const showNext = useCallback(() => {
    setActiveImageIndex((current) => {
      if (current === null) return null
      return current === galleryImages.length - 1 ? 0 : current + 1
    })
  }, [])

  useEffect(() => {
    if (activeImageIndex === null) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [activeImageIndex])

  useEffect(() => {
    if (activeImageIndex === null) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeLightbox()
      if (event.key === 'ArrowLeft') showPrev()
      if (event.key === 'ArrowRight') showNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeImageIndex, closeLightbox, showNext, showPrev])

  return (
    <>
      <section className="relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute inset-0 bg-grid" />
        <div className="pointer-events-none absolute -top-24 left-[10%] h-72 w-72 rounded-full bg-cobalt-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-[6%] h-64 w-64 rounded-full bg-cobalt-50 blur-3xl" />
        <Container className="relative z-10 pt-28 pb-16 md:pt-36 md:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-12 lg:gap-14 items-center">
            <FadeIn>
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-cobalt-100 bg-cobalt-50/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-cobalt-900 mb-7">
                  <Sparkles className="h-3.5 w-3.5" />
                  {data.hero.badge}
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl leading-[1.04] tracking-tight text-gray-950 mb-6 font-light">
                  {data.hero.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed max-w-2xl">
                  {data.hero.description}
                </p>
                <div className="mt-9 flex flex-col sm:flex-row gap-3.5">
                  <Button
                    href={data.cta.buttonHref}
                    size="lg"
                    className="bg-gray-950 text-white hover:text-white"
                    fillClassName="bg-cobalt-900"
                  >
                    <span className="inline-flex items-center gap-2 whitespace-nowrap">
                      {data.cta.buttonText}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Button>
                  <Button
                    href="#life-in-pictures"
                    variant="outline"
                    size="lg"
                    className="border-gray-300 text-gray-900 hover:text-white"
                    fillClassName="bg-cobalt-900"
                  >
                    Explore moments
                  </Button>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.08}>
              <HeroVisual />
            </FadeIn>
          </div>
        </Container>
      </section>

      <Section className="py-14 md:py-16 bg-white">
        <FadeIn>
          <div className="text-center mb-10 md:mb-12">
            <p className="text-[11px] uppercase tracking-[0.16em] text-cobalt-900 font-semibold mb-2">
              Culture DNA
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{data.culture.sectionTitle}</h2>
            <p className="text-lg text-gray-600 font-light max-w-3xl mx-auto">
              {data.culture.sectionDescription}
            </p>
          </div>
        </FadeIn>
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {cultureItems.map((item, index) => (
            <StaggerItem key={item.title}>
              <article className="group relative h-full min-h-[230px] overflow-hidden rounded-2xl border border-gray-200/90 bg-white p-5 md:p-6 shadow-[0_14px_28px_-22px_rgba(15,23,42,0.28)] transition-all duration-300 hover:-translate-y-1 hover:border-cobalt-300 hover:shadow-[0_24px_40px_-26px_rgba(0,71,171,0.36)]">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cobalt-400 to-transparent -translate-x-[110%] transition-transform duration-700 group-hover:translate-x-0" />
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cobalt-100 bg-cobalt-50">
                    <item.icon className="h-5 w-5 text-cobalt-900" strokeWidth={1.6} />
                  </div>
                  <span className="text-[11px] font-semibold tracking-[0.14em] text-gray-400">
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2.5 leading-tight">{item.title}</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">{item.description}</p>
              </article>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </Section>

      <section className="py-14 md:py-16 bg-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-dark" />
        <Container className="relative z-10">
          <FadeIn>
            <div className="text-center mb-10 md:mb-12">
              <p className="text-[11px] uppercase tracking-[0.16em] text-cobalt-300 font-semibold mb-2">
                Rhythm of Work
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{data.dayInLife.title}</h2>
              <p className="text-base md:text-lg text-gray-400 font-light max-w-3xl mx-auto">
                {data.dayInLife.description}
              </p>
            </div>
          </FadeIn>
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {data.dayInLife.items.map((item) => (
              <StaggerItem key={item.time}>
                <article className="group relative h-full overflow-hidden rounded-2xl border border-gray-800/90 bg-gray-900/85 p-5 shadow-[0_18px_34px_-24px_rgba(0,0,0,0.72)] transition-all duration-300 hover:border-cobalt-400/55 hover:shadow-[0_24px_42px_-24px_rgba(0,71,171,0.45)]">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cobalt-400 to-transparent -translate-x-[110%] transition-transform duration-700 group-hover:translate-x-0" />
                  <span className="inline-flex items-center rounded-full border border-cobalt-400/30 bg-cobalt-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-cobalt-300">
                    {item.time}
                  </span>
                  <h3 className="text-lg font-semibold text-white mt-4 mb-2 leading-tight">{item.title}</h3>
                  <p className="text-sm text-gray-400 font-light leading-relaxed">{item.description}</p>
                </article>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </Container>
      </section>

      <section id="life-in-pictures" className="py-14 md:py-16 bg-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-dark" />
        <Container className="relative z-10">
          <FadeIn>
            <div className="text-center mb-8 md:mb-10">
              <p className="text-[11px] uppercase tracking-[0.16em] text-cobalt-300 font-semibold mb-2">
                Visual Diary
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{data.photoGallery.title}</h2>
              <p className="text-base md:text-lg text-gray-400 font-light max-w-2xl mx-auto">
                {data.photoGallery.description}
              </p>
              <p className="text-xs uppercase tracking-[0.14em] text-gray-500 mt-4">Hover a row to pause and explore</p>
            </div>
          </FadeIn>

          <div className="space-y-4 md:space-y-5">
            <PhotoCarouselRow images={galleryImages} onImageSelect={openImage} />
            <PhotoCarouselRow images={[...galleryImages].reverse()} onImageSelect={openImage} reverse />
          </div>
        </Container>
      </section>

      <Section className="py-14 md:py-16 bg-white">
        <FadeIn>
          <div className="text-center mb-10 md:mb-12">
            <p className="text-[11px] uppercase tracking-[0.16em] text-cobalt-900 font-semibold mb-2">
              Team Experience
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{data.perks.sectionTitle}</h2>
          </div>
        </FadeIn>

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {perkItems.map((perk, index) => (
            <StaggerItem key={perk.title}>
              <article className="group relative h-full min-h-[220px] overflow-hidden rounded-2xl border border-gray-200/90 bg-white p-5 md:p-6 shadow-[0_14px_28px_-22px_rgba(15,23,42,0.28)] transition-all duration-300 hover:-translate-y-1 hover:border-cobalt-300 hover:shadow-[0_24px_40px_-26px_rgba(0,71,171,0.36)]">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cobalt-400 to-transparent -translate-x-[110%] transition-transform duration-700 group-hover:translate-x-0" />
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cobalt-100 bg-cobalt-50">
                    <perk.icon className="h-5 w-5 text-cobalt-900" strokeWidth={1.6} />
                  </div>
                  <span className="text-[11px] font-semibold tracking-[0.14em] text-gray-400">
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2.5 leading-tight">{perk.title}</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">{perk.description}</p>
              </article>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </Section>

      <section className="py-16 md:py-20 bg-white border-t border-gray-200">
        <Container className="text-center">
          <FadeIn>
            <p className="text-[11px] uppercase tracking-[0.16em] text-cobalt-900 font-semibold mb-3">
              Join the Journey
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-gray-900 leading-tight mb-4">
              {data.cta.title}
            </h2>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto mb-8">
              {data.cta.description}
            </p>
            <Button
              href={data.cta.buttonHref}
              size="lg"
              className="bg-gray-950 text-white hover:text-white"
              fillClassName="bg-cobalt-900"
            >
              <span className="inline-flex items-center gap-2 whitespace-nowrap">
                {data.cta.buttonText}
                <ArrowRight className="h-4 w-4" />
              </span>
            </Button>
          </FadeIn>
        </Container>
      </section>

      {activeImage && (
        <div
          className="fixed inset-0 z-[80] bg-black/92 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={closeLightbox}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white transition-colors duration-200 hover:bg-black/70 md:right-7 md:top-7"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            aria-label="Previous image"
            onClick={(event) => {
              event.stopPropagation()
              showPrev()
            }}
            className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white transition-colors duration-200 hover:bg-black/70 md:left-6"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            aria-label="Next image"
            onClick={(event) => {
              event.stopPropagation()
              showNext()
            }}
            className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white transition-colors duration-200 hover:bg-black/70 md:right-6"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="flex h-full w-full items-center justify-center px-12 py-16 md:px-20" onClick={(event) => event.stopPropagation()}>
            <div className="relative h-full w-full max-h-[86vh] max-w-6xl overflow-hidden rounded-2xl border border-white/15 bg-black/40">
              <Image
                src={activeImage.src}
                alt={activeImage.alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
