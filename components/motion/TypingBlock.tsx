'use client'

import { useState, useEffect, useRef } from 'react'

interface TypingBlockProps {
  lines: string[]
  charSpeed?: number
  lineDelay?: number
  className?: string
  lineClassName?: (index: number) => string
  onComplete?: () => void
  warpSpeed?: boolean
}

export default function TypingBlock({
  lines,
  charSpeed = 25,
  lineDelay = 300,
  className = '',
  lineClassName,
  onComplete,
  warpSpeed = false,
}: TypingBlockProps) {
  const [currentLine, setCurrentLine] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [completedLines, setCompletedLines] = useState<number[]>([])
  const [started, setStarted] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const hasCompleted = useRef(false)

  const effectiveSpeed = warpSpeed ? 8 : charSpeed
  const charsPerTick = warpSpeed ? 3 : 1

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true)
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started || currentLine >= lines.length) return

    const fullLine = lines[currentLine]

    if (charCount < fullLine.length) {
      const timeout = setTimeout(() => {
        setCharCount(c => Math.min(c + charsPerTick, fullLine.length))
      }, effectiveSpeed)
      return () => clearTimeout(timeout)
    } else {
      const timeout = setTimeout(() => {
        setCompletedLines(prev => [...prev, currentLine])
        if (currentLine < lines.length - 1) {
          setCurrentLine(prev => prev + 1)
          setCharCount(0)
        } else if (!hasCompleted.current) {
          hasCompleted.current = true
          onComplete?.()
        }
      }, lineDelay)
      return () => clearTimeout(timeout)
    }
  }, [started, currentLine, charCount, lines, effectiveSpeed, charsPerTick, lineDelay, onComplete])

  const getLineClass = (i: number) => lineClassName?.(i) ?? ''

  return (
    <div ref={sectionRef} className={className}>
      {lines.map((line, i) => {
        const isComplete = completedLines.includes(i)
        const isActive = i === currentLine && started
        const isVisible = isComplete || isActive

        if (!isVisible) return null

        const displayedText = isComplete ? line : line.slice(0, charCount)

        return (
          <div key={i} className={getLineClass(i)}>
            {displayedText}
            {isActive && !isComplete && (
              <span
                className="inline-block w-[2px] md:w-[3px] h-[0.85em] ml-0.5 align-baseline translate-y-[0.05em] rounded-sm"
                style={{
                  backgroundColor: 'currentColor',
                  opacity: 0.6,
                  animation: 'blink-caret 1s step-end infinite',
                  ...(warpSpeed ? {
                    boxShadow: '0 0 8px currentColor, 0 0 16px currentColor',
                    animation: 'none',
                    opacity: 1,
                  } : {}),
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
