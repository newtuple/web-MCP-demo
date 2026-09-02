'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'

/* ────────────────────────────────────────────────────────────────── */
/*  Types                                                            */
/* ────────────────────────────────────────────────────────────────── */

interface AcceleratorItem {
  name: string
  tagline: string
  description: string
  href: string
  icon: string
  terminal: { type: string; text: string }[]
}

interface WhyItem {
  title: string
  icon: string
  description: string
  bullets: string[]
}

interface GenAIAcceleratorsData {
  title: string
  description: string
  hero: {
    badge: string
    title: string
    description: string
    statusPhrases: string[]
    installCommand: string
  }
  why: {
    sectionTitle: string
    sectionDescription: string
    items: WhyItem[]
  }
  accelerators: {
    sectionTitle: string
    items: AcceleratorItem[]
  }
  licensing: {
    sectionTitle: string
    items: { title: string; icon: string; description: string }[]
    footnote: string
  }
  showDeployment: boolean
  cta: {
    title: string
    description: string
  }
}

/* ────────────────────────────────────────────────────────────────── */
/*  Helpers                                                          */
/* ────────────────────────────────────────────────────────────────── */

const SYMBOLS = ['◈', '◓', '✽', '◉', '⬡']
const CURSOR = '█'

function useTypingEffect(text: string, speed = 30, startDelay = 0) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (i >= text.length) {
          clearInterval(interval)
          setDone(true)
          return
        }
        setDisplayed(text.slice(0, i + 1))
        i++
      }, speed)
      return () => clearInterval(interval)
    }, startDelay)
    return () => clearTimeout(timeout)
  }, [text, speed, startDelay])

  return { displayed, done }
}

function TerminalLines({ lines, onDone }: { lines: { type: string; text: string }[]; onDone?: () => void }) {
  const [visibleCount, setVisibleCount] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setVisibleCount(0)
    let i = 0
    const step = () => {
      if (i >= lines.length) {
        onDone?.()
        return
      }
      i++
      setVisibleCount(i)
      const delay = lines[i - 1]?.type === 'prompt' ? 400 : lines[i - 1]?.type === 'output' ? 200 : 120
      timerRef.current = setTimeout(step, delay)
    }
    timerRef.current = setTimeout(step, 300)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [lines, onDone])

  return (
    <>
      {lines.slice(0, visibleCount).map((line, i) => {
        if (line.type === 'output') return <div key={i} className="h-2" />
        const color =
          line.type === 'prompt' ? 'text-green-400' :
          line.type === 'bullet' ? 'text-blue-400' :
          line.type === 'accent' ? 'text-amber-400' :
          'text-gray-500'
        return (
          <div key={i} className={`${color} leading-relaxed`}>
            {line.text}
          </div>
        )
      })}
    </>
  )
}

/* ────────────────────────────────────────────────────────────────── */
/*  Section components                                               */
/* ────────────────────────────────────────────────────────────────── */

function HeroSection({ hero }: { hero: GenAIAcceleratorsData['hero'] }) {
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [symIdx, setSymIdx] = useState(0)
  const [copied, setCopied] = useState(false)
  const heroTyping = useTypingEffect('newtuple accelerators --init', 40, 800)

  useEffect(() => {
    const t1 = setInterval(() => setPhraseIdx(i => (i + 1) % hero.statusPhrases.length), 2200)
    const t2 = setInterval(() => setSymIdx(i => (i + 1) % SYMBOLS.length), 600)
    return () => { clearInterval(t1); clearInterval(t2) }
  }, [hero.statusPhrases.length])

  const handleCopy = () => {
    navigator.clipboard.writeText(hero.installCommand)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Status line */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          <span className="text-amber-400">{SYMBOLS[symIdx]}</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={phraseIdx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-amber-400"
            >
              {hero.statusPhrases[phraseIdx]}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Main heading as terminal output */}
        <div className="mb-8">
          <div className="text-green-400 text-sm mb-2">
            $ {heroTyping.displayed}{!heroTyping.done && <span className="animate-pulse">{CURSOR}</span>}
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mt-4">
            Start <span className="text-amber-400">70% complete</span>
            <br />
            <span className="text-gray-500">on day one.</span>
          </h1>
        </div>

        <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-3xl mb-10">
          {hero.description}
        </p>

        {/* Install command */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
          <Link
            href="/contactus"
            className="inline-flex items-center gap-2 bg-amber-400 text-gray-950 rounded px-6 py-2.5 text-sm font-bold hover:bg-amber-300 transition-colors"
          >
            Get Started →
          </Link>
          <button
            onClick={handleCopy}
            className="group flex items-center gap-3 bg-gray-800/80 border border-gray-700 rounded px-4 py-2.5 text-sm hover:border-gray-500 transition-colors"
          >
            <span className="text-green-400">$</span>
            <span className="text-gray-300">{hero.installCommand}</span>
            <span className="text-gray-600 group-hover:text-gray-400 transition-colors ml-2">
              {copied ? '✓' : '⎘'}
            </span>
          </button>
        </div>

        <p className="text-sm text-gray-600 mt-4">
          Or read the{' '}
          <Link href="/contactus" className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors">
            documentation
          </Link>
        </p>
      </div>
    </section>
  )
}

function WhySection({ why }: { why: GenAIAcceleratorsData['why'] }) {
  return (
    <section className="py-16 md:py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-green-400 text-sm mb-2">$ cat why-accelerators.md</div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
          # Why <span className="text-amber-400">Accelerators?</span>
        </h2>

        <div className="space-y-0">
          {why.items.map((item, i) => (
            <div key={item.title} className="border-t border-gray-800 py-8">
              <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4 md:gap-12">
                <div className="flex items-start gap-3">
                  <span className="text-amber-400 text-sm mt-0.5">▸</span>
                  <h3 className="text-lg text-white font-semibold">{item.title}</h3>
                </div>
                <ul className="space-y-2">
                  {item.bullets.map((bullet, j) => (
                    <li key={j} className="flex items-start gap-3 text-gray-400 text-sm">
                      <span className="text-gray-600 mt-0.5">•</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
          <div className="border-t border-gray-800" />
        </div>
      </div>
    </section>
  )
}

function AcceleratorsSection({ accelerators }: { accelerators: GenAIAcceleratorsData['accelerators'] }) {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <section className="py-16 md:py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-green-400 text-sm mb-2">$ newtuple list --accelerators</div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          # What could you <span className="text-gray-500">build?</span>
        </h2>
        <p className="text-gray-500 mb-12">
          Four production-ready accelerators. Each solving a distinct GenAI challenge.
        </p>

        {/* Tabs as CLI-style selectors */}
        <div className="flex flex-wrap gap-1 mb-8 text-sm">
          {accelerators.items.map((acc, i) => (
            <button
              key={acc.name}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-1.5 rounded transition-colors ${
                activeTab === i
                  ? 'bg-amber-400/15 text-amber-400 border border-amber-400/30'
                  : 'text-gray-500 hover:text-gray-300 border border-transparent'
              }`}
            >
              {acc.name}
            </button>
          ))}
        </div>

        {/* Active accelerator - terminal session */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
              {/* Terminal window */}
              <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-800/60 border-b border-gray-800">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  <span className="text-gray-600 text-xs ml-2">newtuple - {accelerators.items[activeTab].name.toLowerCase()}</span>
                </div>
                <div className="p-5 text-sm leading-relaxed min-h-[240px]">
                  <TerminalLines lines={accelerators.items[activeTab].terminal} />
                </div>
              </div>

              {/* Info panel */}
              <div className="py-2">
                <h3 className="text-2xl font-bold text-white mb-1">
                  {accelerators.items[activeTab].name}
                </h3>
                <p className="text-amber-400 text-sm font-medium mb-4">
                  {accelerators.items[activeTab].tagline}
                </p>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {accelerators.items[activeTab].description}
                </p>
                <Link
                  href={accelerators.items[activeTab].href}
                  className="text-blue-400 hover:text-blue-300 text-sm underline underline-offset-2 transition-colors"
                >
                  Learn more →
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

function ShowcaseGrid({ accelerators }: { accelerators: GenAIAcceleratorsData['accelerators'] }) {
  return (
    <section className="py-16 md:py-24 px-6 bg-gray-900/50">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {accelerators.items.map((acc) => (
            <Link key={acc.name} href={acc.href} className="group">
              <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden group-hover:border-gray-700 transition-colors">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/60 border-b border-gray-800">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                  <span className="text-gray-600 text-xs ml-2">{acc.name.toLowerCase()}</span>
                </div>
                <div className="p-4 text-xs leading-relaxed h-[140px] overflow-hidden">
                  {acc.terminal.slice(0, 5).map((line, i) => {
                    if (line.type === 'output') return <div key={i} className="h-1.5" />
                    const color =
                      line.type === 'prompt' ? 'text-green-400' :
                      line.type === 'bullet' ? 'text-blue-400' :
                      line.type === 'accent' ? 'text-amber-400' :
                      'text-gray-500'
                    return <div key={i} className={color}>{line.text}</div>
                  })}
                </div>
              </div>
              <div className="mt-3 px-1">
                <h3 className="text-white font-semibold group-hover:text-amber-400 transition-colors">
                  {acc.name}
                </h3>
                <p className="text-gray-600 text-sm">{acc.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function LicensingSection({ licensing }: { licensing: GenAIAcceleratorsData['licensing'] }) {
  return (
    <section className="py-16 md:py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-green-400 text-sm mb-2">$ newtuple pricing --list</div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
          # Simple <span className="text-gray-500">Licensing</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {licensing.items.map((item) => (
            <div key={item.title} className="border border-gray-800 rounded-lg p-6 bg-gray-900/50 hover:border-gray-700 transition-colors">
              <div className="text-amber-400 text-sm mb-3">▸ {item.title}</div>
              <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="text-gray-600 text-sm mt-6 flex items-center gap-2">
          <span className="text-gray-700">#</span>
          {licensing.footnote}
        </div>
      </div>
    </section>
  )
}

function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  const faqs = [
    { q: 'How quickly can I deploy an accelerator?', a: 'Most accelerators deploy in under 30 minutes via docker compose. Terraform and Helm artifacts support production-grade cloud deployments on AWS, GCP, or Azure.' },
    { q: 'Can I use accelerators with my existing infrastructure?', a: 'Yes. All accelerators communicate over clean REST and event-driven APIs. They integrate with your existing databases, message queues, and CI/CD pipelines. No vendor lock-in.' },
    { q: 'Do I get access to the source code?', a: 'Absolutely. You receive 100% of the source code. Fork it, extend it, brand it - the codebase is fully yours.' },
    { q: 'What support options are available?', a: 'Every licence includes onboarding guidance. Optional monthly support plans are available with guaranteed response times, architecture reviews, and dedicated Slack channels.' },
    // Previous copy when Omnituple was active:
    // { q: 'Can I use just one accelerator or do I need all four?', a: 'Each accelerator is independently licensable. Deploy one or combine several - they work standalone or together through composable APIs.' },
    { q: 'Can I use just one accelerator or do I need the full suite?', a: 'Each accelerator is independently licensable. Deploy one or combine several - they work standalone or together through composable APIs.' },
  ]

  return (
    <section className="py-16 md:py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-green-400 text-sm mb-2">$ newtuple faq --all</div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-600 mb-12">
          # FAQ
        </h2>

        <div>
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-gray-800">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="flex items-center justify-between w-full py-5 text-left group"
              >
                <span className="text-gray-300 text-sm pr-4 group-hover:text-white transition-colors">
                  {faq.q}
                </span>
                <span className="text-gray-600 text-sm flex-shrink-0">
                  {openIdx === i ? '−' : '+'}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {openIdx === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 text-gray-500 text-sm leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection({ cta }: { cta: GenAIAcceleratorsData['cta'] }) {
  return (
    <section className="py-16 md:py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <div className="text-green-400 text-sm mb-6">$ newtuple start</div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {cta.title}
        </h2>
        <p className="text-gray-500 mb-10">{cta.description}</p>
        <Link
          href="/contactus"
          className="inline-flex items-center gap-2 bg-amber-400 text-gray-950 rounded px-8 py-3 text-sm font-bold hover:bg-amber-300 transition-colors"
        >
          Get in Touch →
        </Link>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────────── */
/*  Main page                                                        */
/* ────────────────────────────────────────────────────────────────── */

export default function GenAIAcceleratorsContent({ data }: { data: GenAIAcceleratorsData }) {
  const { hero, why, accelerators, licensing, cta } = data

  return (
    <div className="bg-gray-950 text-gray-300 font-mono min-h-screen selection:bg-amber-400/20 selection:text-amber-200">
      <HeroSection hero={hero} />
      <WhySection why={why} />
      <AcceleratorsSection accelerators={accelerators} />
      <ShowcaseGrid accelerators={accelerators} />
      <LicensingSection licensing={licensing} />
      <FAQSection />
      <CTASection cta={cta} />
    </div>
  )
}
