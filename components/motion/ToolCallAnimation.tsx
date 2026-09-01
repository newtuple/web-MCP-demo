'use client'

import { useState, useEffect, useRef } from 'react'
import { CheckCircle, Loader2, Sparkles } from 'lucide-react'

export interface ToolCallItem {
  label: string
  result: string
}

interface ToolCallAnimationProps {
  tools: ToolCallItem[]
  title?: string
  dark?: boolean
  flow?: 'distributed' | 'terminal'
}

const RUN_DURATION = 1200
const GAP_BETWEEN = 400
const PAUSE_AT_END = 2500

type ToolState = 'hidden' | 'running' | 'complete'

export default function ToolCallAnimation({
  tools,
  title = 'AI Activity',
  dark = false,
  flow = 'distributed',
}: ToolCallAnimationProps) {
  const [toolStates, setToolStates] = useState<ToolState[]>(
    tools.map(() => 'hidden')
  )
  const [started, setStarted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const stepRef = useRef(0)

  // Start when visible
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) setStarted(true)
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return

    function advance() {
      const step = stepRef.current

      if (step < tools.length * 2) {
        const toolIndex = Math.floor(step / 2)
        const isComplete = step % 2 === 1

        setToolStates(prev => {
          const next = [...prev]
          next[toolIndex] = isComplete ? 'complete' : 'running'
          return next
        })

        stepRef.current = step + 1
        timeoutRef.current = setTimeout(
          advance,
          isComplete ? GAP_BETWEEN : RUN_DURATION
        )
      } else {
        timeoutRef.current = setTimeout(() => {
          setToolStates(tools.map(() => 'hidden'))
          stepRef.current = 0
          timeoutRef.current = setTimeout(advance, 500)
        }, PAUSE_AT_END)
      }
    }

    timeoutRef.current = setTimeout(advance, 600)
    return () => clearTimeout(timeoutRef.current)
  }, [started, tools])

  const labelColor = dark ? 'text-gray-300' : 'text-gray-700'
  const headerColor = dark ? 'text-gray-500' : 'text-gray-500'
  const sparkleColor = dark ? 'text-[var(--accent-400)]' : 'text-[var(--accent-900)]'
  const resultColor = dark ? 'text-emerald-400/80' : 'text-emerald-600'
  const barBg = dark ? 'bg-gray-800' : 'bg-gray-200'
  const cursorColor = dark ? 'bg-[var(--accent-400)]/40' : 'bg-[var(--accent-900)]/30'
  const promptColor = dark ? 'text-[var(--accent-400)]/50' : 'text-[var(--accent-900)]/40'

  const isTerminalFlow = flow === 'terminal'
  const terminalVisibleIndices = isTerminalFlow
    ? toolStates
        .map((state, idx) => (state === 'hidden' ? -1 : idx))
        .filter((idx) => idx !== -1)
        .slice(-3)
    : []
  const terminalVisibleSet = isTerminalFlow ? new Set(terminalVisibleIndices) : null

  return (
    <div ref={containerRef} className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 px-1 mb-5">
        <Sparkles className={`w-3.5 h-3.5 ${sparkleColor}`} />
        <span className={`text-xs font-medium uppercase tracking-wider ${headerColor}`}>{title}</span>
      </div>

      {/* Tool calls */}
      <div
        className={`flex-1 overflow-hidden pr-1 ${isTerminalFlow ? 'space-y-2' : 'space-y-3'}`}
      >
        {tools.map((tool, i) => {
          const state = toolStates[i]
          if (state === 'hidden') return null
          if (isTerminalFlow && !terminalVisibleSet?.has(i)) return null

          return (
            <div key={tool.label} className="animate-fade-in">
              <div className="flex items-start gap-2.5">
                {state === 'running' ? (
                  <Loader2 className="w-4 h-4 text-amber-500 animate-spin flex-shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                )}
                <div className="min-w-0">
                  <p className={`${isTerminalFlow ? 'text-xs' : 'text-sm'} font-medium leading-snug ${labelColor}`}>
                    {tool.label}
                  </p>
                  {state === 'running' ? (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <div className={`h-1 ${isTerminalFlow ? 'w-16' : 'w-20'} rounded-full ${barBg} overflow-hidden`}>
                        <div className="h-full w-2/3 rounded-full bg-amber-400 animate-pulse" />
                      </div>
                    </div>
                  ) : (
                    <p className={`${isTerminalFlow ? 'text-[11px]' : 'text-xs'} mt-0.5 font-medium ${resultColor}`}>
                      {tool.result}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Blinking cursor */}
      <div className={`flex items-center gap-2 ${isTerminalFlow ? 'mt-3' : 'mt-4'}`}>
        <span className={`text-xs ${promptColor}`}>{'>'}</span>
        <span
          className={`inline-block w-[6px] h-[14px] rounded-sm ${cursorColor}`}
          style={{ animation: 'blink-caret 1s step-end infinite' }}
        />
      </div>
    </div>
  )
}
