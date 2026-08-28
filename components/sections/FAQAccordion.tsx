'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import FadeIn from '@/components/motion/FadeIn'

interface FAQItem {
  question: string
  answer: string
}

interface FAQAccordionProps {
  items: FAQItem[]
  className?: string
}

export default function FAQAccordion({ items, className = '' }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className={`max-w-3xl mx-auto lg:mx-0 ${className}`}>
      {items.map((item, i) => (
        <FadeIn key={i} delay={i * 0.05}>
          <div className="border-b border-gray-800">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between py-6 text-left text-gray-300 hover:text-white transition-colors"
            >
              <span className="text-lg font-medium pr-8">{item.question}</span>
              <ChevronRight
                className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                  openIndex === i ? 'rotate-90' : ''
                }`}
              />
            </button>
            <div
              className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-400 ease-in-out ${
                openIndex === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p
                  className={`text-gray-400 font-light leading-relaxed pb-6 transition-transform duration-400 ease-in-out ${
                    openIndex === i ? 'translate-y-0' : '-translate-y-1'
                  }`}
                >
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      ))}
    </div>
  )
}
