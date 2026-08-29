'use client'

import { useState, useEffect, useRef } from 'react'

export interface TypingHeadlinePhrase {
  text: string
  bold: string
}

const DEFAULT_PHRASES: TypingHeadlinePhrase[] = [
  { text: 'Build Your Agentic Enterprise.', bold: 'Agentic' },
  { text: 'Scale Your AI Operations.', bold: 'AI' },
  { text: 'Ship Production-Grade Intelligence.', bold: 'Production-Grade' },
]

const TYPE_SPEED = 60
const DELETE_SPEED = 35
const PAUSE_AFTER_TYPE = 4000
const PAUSE_AFTER_DELETE = 600

type Phase = 'typing' | 'paused' | 'deleting' | 'waiting'

export default function TypingHeadline({
  className = '',
  phrases = DEFAULT_PHRASES,
}: {
  className?: string
  phrases?: TypingHeadlinePhrase[]
}) {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [phase, setPhase] = useState<Phase>('typing')
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  const safePhrases = phrases.length > 0 ? phrases : DEFAULT_PHRASES
  const normalizedPhraseIndex = phraseIndex % safePhrases.length
  const fullText = safePhrases[normalizedPhraseIndex].text

  useEffect(() => {
    setPhraseIndex(0)
    setCharCount(0)
    setPhase('typing')
  }, [phrases])

  useEffect(() => {
    clearTimeout(timeoutRef.current)

    switch (phase) {
      case 'typing':
        if (charCount < fullText.length) {
          timeoutRef.current = setTimeout(() => setCharCount(c => c + 1), TYPE_SPEED)
        } else {
          setPhase('paused')
        }
        break

      case 'paused':
        timeoutRef.current = setTimeout(() => setPhase('deleting'), PAUSE_AFTER_TYPE)
        break

      case 'deleting':
        if (charCount > 0) {
          timeoutRef.current = setTimeout(() => setCharCount(c => c - 1), DELETE_SPEED)
        } else {
          setPhase('waiting')
        }
        break

      case 'waiting':
        timeoutRef.current = setTimeout(() => {
          setPhraseIndex(prev => (prev + 1) % safePhrases.length)
          setPhase('typing')
        }, PAUSE_AFTER_DELETE)
        break
    }

    return () => clearTimeout(timeoutRef.current)
  }, [phase, charCount, fullText.length, safePhrases.length])

  const currentPhrase = safePhrases[normalizedPhraseIndex]
  const displayed = fullText.slice(0, charCount)

  const renderPhrase = (phrase: TypingHeadlinePhrase, textToRender: string) => {
    const boldStart = phrase.text.indexOf(phrase.bold)
    const boldEnd = boldStart + phrase.bold.length

    if (boldStart === -1) {
      return <span className="font-extralight">{textToRender}</span>
    }

    const beforeBold = textToRender.slice(0, Math.min(textToRender.length, boldStart))
    const inBold = textToRender.length > boldStart
      ? textToRender.slice(boldStart, Math.min(textToRender.length, boldEnd))
      : ''
    const afterBold = textToRender.length > boldEnd
      ? textToRender.slice(boldEnd)
      : ''

    return (
      <>
        {beforeBold && <span className="font-extralight">{beforeBold}</span>}
        {inBold && <span className="font-bold">{inBold}</span>}
        {afterBold && <span className="font-extralight">{afterBold}</span>}
      </>
    )
  }

  return (
    <h1 className={className}>
      <span className="relative grid">
        {safePhrases.map((phrase) => (
          <span
            key={phrase.text}
            aria-hidden="true"
            className="invisible pointer-events-none select-none [grid-area:1/1]"
          >
            {renderPhrase(phrase, phrase.text)}
          </span>
        ))}
        <span className="[grid-area:1/1]">
          {renderPhrase(currentPhrase, displayed)}
          <span
            className="inline-block w-[3px] md:w-[4px] h-[0.85em] bg-[var(--accent-900)] ml-1 align-baseline translate-y-[0.05em] rounded-sm"
            style={{ animation: 'blink-caret 1s step-end infinite' }}
          />
        </span>
      </span>
    </h1>
  )
}
