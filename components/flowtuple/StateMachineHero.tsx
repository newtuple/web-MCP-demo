'use client'

import { useEffect, useState } from 'react'

/**
 * The hero motif: a modelled workflow where agents take over slots one at a
 * time and people migrate up to the judgment rail. Loops on a 12s cycle.
 */

const NODES = [
  { x: 35, label: 'INVITED' },
  { x: 275, label: 'INTAKE' },
  { x: 515, label: 'VETTED' },
  { x: 755, label: 'DOCS VALIDATED' },
  { x: 995, label: 'ACTIVE' },
]

/** Migration offsets carry each avatar up onto the human rail. */
const AVATARS = [
  { cx: 120, tx: 345 },
  { cx: 360, tx: 195 },
  { cx: 600, tx: 45 },
  { cx: 840, tx: -105 },
  { cx: 1080, tx: 0, stays: true },
]

const SWAP_ORDER = [1, 2, 3, 0]

const PINGS = [
  { x: 512, w: 172, label: 'Sanctions cleared' },
  { x: 756, w: 150, label: 'Bank verified' },
  { x: 1000, w: 182, label: 'ERP vendor created' },
]

export default function StateMachineHero() {
  const [swapped, setSwapped] = useState<number[]>([])
  const [pings, setPings] = useState(0)
  const [approval, setApproval] = useState<'off' | 'waiting' | 'done'>('off')

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms))

    const cycle = () => {
      setSwapped([])
      setPings(0)
      setApproval('off')
      SWAP_ORDER.forEach((idx, i) => at(900 + i * 1100, () => setSwapped((s) => [...s, idx])))
      PINGS.forEach((_, i) => at(5400 + i * 700, () => setPings(i + 1)))
      at(6200, () => setApproval('waiting'))
      at(8300, () => setApproval('done'))
      at(12000, () => {
        timers.forEach(clearTimeout)
        timers.length = 0
        cycle()
      })
    }
    cycle()
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="rounded-3xl border border-gray-200 bg-white/90 p-5 shadow-premium-lg backdrop-blur-sm sm:p-6">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <b className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-900)]">
          A live workflow · supplier onboarding
        </b>
        <span className="text-[11px] text-gray-400">agents fill the slots · people keep judgment</span>
      </div>

      <svg
        viewBox="0 0 1200 400"
        className="block h-auto w-full"
        role="img"
        aria-label="A supplier-onboarding workflow modelled as a state machine, running from invited through intake, vetting, and document validation to active. Specialist agents take over each state one at a time while the people who held those states migrate up to a rail where they verify, approve, and handle exceptions. The final activation stays behind a human approval gate."
      >
        {/* human rail */}
        <rect
          x="330"
          y="22"
          width="540"
          height="64"
          rx="32"
          fill="#F9FAFB"
          stroke="#E5E7EB"
          strokeDasharray="5 4"
        />
        <text
          x="600"
          y="14"
          textAnchor="middle"
          fill="#9CA3AF"
          style={{ fontSize: 12, fontWeight: 500, letterSpacing: '.2em' }}
        >
          PEOPLE · VERIFY · APPROVE · HANDLE EXCEPTIONS
        </text>

        {/* edges */}
        {[207, 447, 687, 927].map((x1) => (
          <g key={x1}>
            <line x1={x1} y1={266} x2={x1 + 64} y2={266} stroke="#D1D5DB" strokeWidth={1.5} />
            <polygon points={`${x1 + 64},260 ${x1 + 76},266 ${x1 + 64},272`} fill="#D1D5DB" />
          </g>
        ))}

        {/* states */}
        {NODES.map((n) => (
          <g key={n.label}>
            <rect x={n.x} y={238} width={170} height={56} rx={13} fill="#F9FAFB" stroke="#E5E7EB" strokeWidth={1.3} />
            <text
              x={n.x + 85}
              y={272}
              textAnchor="middle"
              fill="#374151"
              style={{ fontSize: 14, fontWeight: 500, letterSpacing: '.14em' }}
            >
              {n.label}
            </text>
          </g>
        ))}

        {/* agents taking the slots */}
        {AVATARS.slice(0, 4).map((a, i) => {
          const on = swapped.includes(i)
          return (
            <g
              key={`agent-${i}`}
              style={{
                opacity: on ? 1 : 0,
                transform: on ? 'scale(1)' : 'scale(.3)',
                transformBox: 'fill-box',
                transformOrigin: 'center',
                transition: 'opacity .5s ease, transform .6s cubic-bezier(.34,1.4,.5,1)',
              }}
            >
              <rect x={a.cx - 20} y={196} width={40} height={40} rx={11} fill="#0047AB" />
              <path d={`M${a.cx} 203 l4 9 9 4 -9 4 -4 9 -4 -9 -9 -4 9 -4 z`} fill="#fff" />
            </g>
          )
        })}

        {/* people migrating to the rail */}
        {AVATARS.map((a, i) => {
          const migrate = !a.stays && swapped.includes(i)
          return (
            <g
              key={`human-${i}`}
              style={{
                transform: migrate ? `translate(${a.tx}px, -162px) scale(.85)` : 'none',
                transformBox: 'fill-box',
                transformOrigin: 'center',
                transition: 'transform 1.2s cubic-bezier(.5,0,.2,1)',
              }}
            >
              <circle cx={a.cx} cy={216} r={22} fill="#fff" stroke="#D1D5DB" strokeWidth={1.3} />
              <path
                d={`M${a.cx} 205 a6.5 6.5 0 1 1 0 13 a6.5 6.5 0 1 1 0 -13 M${a.cx - 13} 229 q13 -11 26 0 v2 h-26 z`}
                fill="#6B7280"
              />
            </g>
          )
        })}

        {/* systems of record staying current */}
        {PINGS.map((p, i) => (
          <g
            key={p.label}
            style={{
              opacity: pings > i ? 1 : 0,
              transform: pings > i ? 'none' : 'translateY(8px)',
              transition: 'opacity .5s ease, transform .5s ease',
            }}
          >
            <rect x={p.x} y={322} width={p.w} height={34} rx={17} fill="#fff" stroke="#E5E7EB" />
            <text x={p.x + 18} y={344} fill="#6B7280" style={{ fontSize: 12.5 }}>
              {p.label}{' '}
              <tspan fill="#059669" style={{ fontWeight: 600 }}>
                ✓
              </tspan>
            </text>
          </g>
        ))}

        {/* the gate that never leaves a human */}
        <g style={{ opacity: approval === 'waiting' ? 1 : 0, transition: 'opacity .4s ease' }}>
          <rect x={758} y={134} width={196} height={34} rx={17} fill="#FFFBEB" stroke="#FDE68A" />
          <text x={778} y={156} fill="#B45309" style={{ fontSize: 12.5, fontWeight: 500 }}>
            Awaiting your approval…
          </text>
        </g>
        <g style={{ opacity: approval === 'done' ? 1 : 0, transition: 'opacity .4s ease' }}>
          <rect x={762} y={134} width={188} height={34} rx={17} fill="#ECFDF5" stroke="#A7F3D0" />
          <text x={782} y={156} fill="#047857" style={{ fontSize: 12.5, fontWeight: 500 }}>
            Approved · activated ✓
          </text>
        </g>
      </svg>
    </div>
  )
}
