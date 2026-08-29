'use client'

interface MarqueeProps {
  text: string
  className?: string
}

export default function Marquee({ text, className = '' }: MarqueeProps) {
  const items = Array(10).fill(text)

  return (
    <section className={`py-4 bg-[var(--accent-900)] overflow-hidden ${className}`}>
      <div className="animate-marquee whitespace-nowrap flex">
        {items.map((item, i) => (
          <span key={i} className="text-white font-semibold text-sm tracking-wider uppercase mx-8 inline-flex items-center gap-8">
            {item} <span className="text-[var(--accent-400)]">&bull;</span>
          </span>
        ))}
        {items.map((item, i) => (
          <span key={`dup-${i}`} className="text-white font-semibold text-sm tracking-wider uppercase mx-8 inline-flex items-center gap-8">
            {item} <span className="text-[var(--accent-400)]">&bull;</span>
          </span>
        ))}
      </div>
    </section>
  )
}
