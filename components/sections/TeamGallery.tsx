'use client'
/* eslint-disable @next/next/no-img-element */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import FadeIn from '@/components/motion/FadeIn'

interface TeamImage {
  src: string
  alt: string
  size: 'small' | 'medium' | 'large'
}

const teamImages: TeamImage[] = [
  { src: '/images/team/IMG_0224.jpg', alt: 'Team moment', size: 'medium' },
  { src: '/images/team/IMG_0311_edited.jpg', alt: 'Team collaboration', size: 'large' },
  { src: '/images/team/IMG_0870.jpg', alt: 'Office life', size: 'small' },
  { src: '/images/team/IMG_0905.jpg', alt: 'Team event', size: 'medium' },
  { src: '/images/team/IMG_1273.jpg', alt: 'Working together', size: 'large' },
  { src: '/images/team/IMG_1774.jpg', alt: 'Team celebration', size: 'medium' },
  { src: '/images/team/IMG_1776.jpg', alt: 'Collaboration', size: 'small' },
  { src: '/images/team/IMG_2616.jpg', alt: 'Office moments', size: 'medium' },
  { src: '/images/team/IMG_2944.jpg', alt: 'Team fun', size: 'large' },
  { src: '/images/team/IMG_4765.JPG', alt: 'Working session', size: 'medium' },
  { src: '/images/team/IMG_4769.JPG', alt: 'Team discussion', size: 'small' },
  { src: '/images/team/IMG_5844.jpg', alt: 'Office culture', size: 'medium' },
  { src: '/images/team/IMG20241121111536.jpg', alt: 'Team building', size: 'large' },
  { src: '/images/team/IMG20250826142103.jpg', alt: 'Collaboration moment', size: 'medium' },
  { src: '/images/team/IMG20250826142209_edited.jpg', alt: 'Team spirit', size: 'medium' },
  { src: '/images/team/profile_varad.jpg', alt: 'Team member', size: 'small' },
  { src: '/images/team/Omkar_edited.jpg', alt: 'Team member', size: 'small' },
  { src: '/images/team/Shikhar Jha_edited.jpg', alt: 'Team member', size: 'small' },
]

const sizeClasses = {
  small: 'aspect-square',
  medium: 'aspect-[4/3]',
  large: 'aspect-[16/10]',
}

const gridSpans = {
  small: 'col-span-1 row-span-1',
  medium: 'col-span-1 md:col-span-1 row-span-1',
  large: 'col-span-1 md:col-span-2 row-span-1',
}

export default function TeamGallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const openLightbox = (index: number) => {
    setSelectedIndex(index)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setSelectedIndex(null)
    document.body.style.overflow = 'unset'
  }

  const goToPrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? teamImages.length - 1 : selectedIndex - 1)
    }
  }

  const goToNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === teamImages.length - 1 ? 0 : selectedIndex + 1)
    }
  }

  return (
    <>
      <FadeIn>
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-[var(--accent-600)] uppercase tracking-wider mb-3">
            Meet the Team
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            The people behind{' '}
            <span className="bg-gradient-to-r from-[var(--accent-900)] to-cyan-500 bg-clip-text text-transparent">
              Newtuple
            </span>
          </h2>
          <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
            A passionate team of builders, thinkers, and problem-solvers.
          </p>
        </div>
      </FadeIn>

      {/* Bento Grid Gallery */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-fr">
        {teamImages.map((image, index) => (
          <FadeIn key={image.src} delay={index * 0.05} direction="up">
            <motion.div
              className={`relative overflow-hidden rounded-2xl cursor-pointer group ${gridSpans[image.size]} ${sizeClasses[image.size]}`}
              onClick={() => openLightbox(index)}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--accent-950)]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                <p className="text-white text-sm font-medium">{image.alt}</p>
              </div>
            </motion.div>
          </FadeIn>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--accent-950)]/95 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                goToPrevious()
              }}
              className="absolute left-4 md:left-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="max-w-5xl max-h-[80vh] mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={teamImages[selectedIndex].src}
                alt={teamImages[selectedIndex].alt}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
              />
              <p className="text-center text-white/80 mt-4 text-sm">
                {teamImages[selectedIndex].alt}
              </p>
            </motion.div>

            <button
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
              className="absolute right-4 md:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
