'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Paperclip,
  Send,
  ShieldAlert,
  Sparkles,
  SquarePen,
} from 'lucide-react'
import {
  CANDIDATE,
  CHIP_NODES,
  DOC_META,
  DOC_ORDER,
  PERSONAS,
  PRIMITIVES,
  SCENARIOS,
  STAGES,
  STATIC_BOARD,
  UNSTARTED_SUPPLIERS,
  primitivesFor,
  type Action,
  type Card,
  type Chip,
  type DocId,
  type DocState,
  type Persona,
  type PrimitiveId,
  type Row,
  type SeqStep,
  type StageKey,
  type Status,
} from './data'

/* ------------------------------------------------------------------ *
 * Shared bits
 * ------------------------------------------------------------------ */

const STATUS_CLASS: Record<Status, string> = {
  ok: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  warn: 'text-amber-700 bg-amber-50 border-amber-200',
  bad: 'text-rose-700 bg-rose-50 border-rose-200',
  info: 'text-[var(--accent-900)] bg-[var(--accent-50)] border-[var(--accent-200)]',
  mut: 'text-gray-600 bg-gray-50 border-gray-200',
}

function Pill({ status, children }: { status: Status; children: React.ReactNode }) {
  return (
    <span
      className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${STATUS_CLASS[status]}`}
    >
      {children}
    </span>
  )
}

function CanvasCard({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-premium">
      {label && (
        <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-900)]">{label}</div>
      )}
      {children}
    </div>
  )
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

/* ------------------------------------------------------------------ *
 * Live workflow state
 * ------------------------------------------------------------------ */

interface TimelineEvent {
  id: number
  kind: 'move' | 'block' | 'edit' | 'audit'
  to?: string
  from?: string
  who?: string
  reason?: string
  title?: string
  state?: string
}

interface Message {
  id: number
  role: 'user' | 'agent'
  text: string
}

const stageName = (k: StageKey) => STAGES.find((s) => s.k === k)?.s ?? k

export default function WorkspaceDemo() {
  const [personaId, setPersonaId] = useState<Persona['id']>('vp')
  const persona = useMemo(() => PERSONAS.find((p) => p.id === personaId)!, [personaId])

  const [scenarioId, setScenarioId] = useState(persona.def)
  const [chipNode, setChipNode] = useState(persona.chipRoot)
  const [messages, setMessages] = useState<Message[]>([])
  const [typing, setTyping] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  // Supplier state machine
  const [focal, setFocal] = useState<string | null>(null)
  const [stage, setStage] = useState<StageKey>('INVITED')
  const [blocked, setBlocked] = useState<{ to: StageKey; reason: string } | null>(null)
  const [docs, setDocs] = useState<Record<DocId, DocState>>({ w9: 'pending', coi: 'pending', sqf: 'pending', bank: 'pending' })
  const [timeline, setTimeline] = useState<TimelineEvent[]>([])
  const [doneActions, setDoneActions] = useState<Record<string, Action>>({})

  // Generative composition: the canvas rebuilds itself on every request.
  const [composing, setComposing] = useState(false)
  const [revealed, setRevealed] = useState(0)

  const uid = useRef(0)
  const nextId = () => ++uid.current
  const runToken = useRef(0)
  const threadRef = useRef<HTMLDivElement>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const scenario = SCENARIOS[scenarioId]

  /** The subset of the vocabulary this particular surface was composed from. */
  const usedPrimitives = useMemo(() => {
    const s = new Set<PrimitiveId>()
    scenario.cards.forEach((c) => primitivesFor(c).forEach((p) => s.add(p)))
    return s
  }, [scenario])

  /**
   * Re-compose whenever the request changes: think, then stream the selected
   * components in one at a time, in the order the model chose them.
   */
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    setComposing(true)
    setRevealed(0)
    timers.push(
      setTimeout(() => {
        setComposing(false)
        scenario.cards.forEach((_, i) => timers.push(setTimeout(() => setRevealed(i + 1), i * 140)))
      }, 700)
    )
    return () => timers.forEach(clearTimeout)
  }, [scenarioId, scenario.cards])

  /* --- persona switch resets everything --- */
  const selectPersona = useCallback((p: Persona) => {
    runToken.current += 1
    setPersonaId(p.id)
    setScenarioId(p.def)
    setChipNode(p.chipRoot)
    setFocal(null)
    setStage('INVITED')
    setBlocked(null)
    setDocs({ w9: 'pending', coi: 'pending', sqf: 'pending', bank: 'pending' })
    setTimeline([])
    setDoneActions({})
    setTyping(false)
    setMessages([{ id: nextId(), role: 'agent', text: p.welcome }])
  }, [])

  useEffect(() => {
    setMessages([{ id: nextId(), role: 'agent', text: PERSONAS[0].welcome }])
  }, [])

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current)
    },
    []
  )

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 3200)
  }, [])

  const pushAgent = useCallback(async (text: string, token: number) => {
    setTyping(true)
    await sleep(620)
    if (runToken.current !== token) return
    setTyping(false)
    setMessages((m) => [...m, { id: nextId(), role: 'agent', text }])
  }, [])

  /* --- run a scenario (pinned view or chip with `run`) --- */
  const runScenario = useCallback(
    async (id: string, promptOverride?: string) => {
      const token = ++runToken.current
      const sc = SCENARIOS[id]
      if (!sc) return
      setMessages((m) => [...m, { id: nextId(), role: 'user', text: promptOverride ?? sc.prompt }])
      setScenarioId(id)
      setDoneActions({})
      await pushAgent(sc.reply, token)
    },
    [pushAgent]
  )

  /* --- execute a storyboard sequence against the state machine --- */
  const runSeq = useCallback(
    async (steps: SeqStep[], token: number, co: string) => {
      for (const step of steps) {
        if (runToken.current !== token) return
        await sleep(520)
        if (runToken.current !== token) return

        switch (step.type) {
          case 'choose':
            setFocal(step.name)
            setStage(step.to)
            setBlocked(null)
            setTimeline((t) => [
              { id: nextId(), kind: 'move', from: 'Invited', to: stageName(step.to), who: 'Guided intake' },
              ...t,
            ])
            break
          case 'move':
            setBlocked(null)
            setStage((prev) => {
              setTimeline((t) => [
                { id: nextId(), kind: 'move', from: stageName(prev), to: stageName(step.to), who: step.who },
                ...t,
              ])
              return step.to
            })
            break
          case 'edit':
            setTimeline((t) => [{ id: nextId(), kind: 'edit', title: step.title, who: step.who }, ...t])
            break
          case 'block':
            setBlocked({ to: step.to, reason: step.reason.replace(/\{co\}/g, co) })
            setStage((prev) => {
              setTimeline((t) => [
                {
                  id: nextId(),
                  kind: 'block',
                  from: stageName(prev),
                  to: stageName(step.to),
                  who: 'Onboarding agent',
                  reason: step.reason.replace(/\{co\}/g, co),
                },
                ...t,
              ])
              return prev
            })
            break
          case 'docrun':
            for (const d of step.plan) {
              if (runToken.current !== token) return
              setDocs((prev) => ({ ...prev, [d.id]: 'reading' }))
              await sleep(760)
              if (runToken.current !== token) return
              setDocs((prev) => ({ ...prev, [d.id]: d.end }))
            }
            break
          case 'audit':
            setTimeline((t) => [{ id: nextId(), kind: 'audit', state: step.state }, ...t])
            break
        }
      }
    },
    []
  )

  const onChip = useCallback(
    async (chip: Chip) => {
      const co = focal ?? 'the supplier'
      const label = chip.label.replace(/\{co\}/g, co)

      if (chip.back) {
        setChipNode(chip.to!)
        return
      }

      const token = ++runToken.current
      setMessages((m) => [...m, { id: nextId(), role: 'user', text: label }])

      if (chip.run) {
        setScenarioId(chip.run)
        setDoneActions({})
      }
      if (chip.to) setChipNode(chip.to)

      // `choose` renames the focal supplier, so resolve it before interpolating.
      const chooseStep = chip.seq?.find((s) => s.type === 'choose')
      const nextCo = chooseStep && chooseStep.type === 'choose' ? chooseStep.name : co

      if (chip.seq) {
        setTyping(true)
        await runSeq(chip.seq, token, nextCo)
        if (runToken.current !== token) return
        setTyping(false)
      }

      const say = chip.say ?? (chip.run ? SCENARIOS[chip.run].reply : null)
      if (say) await pushAgent(say.replace(/\{co\}/g, nextCo), token)
    },
    [focal, pushAgent, runSeq]
  )

  const onAction = useCallback(
    async (key: string, a: Action) => {
      showToast(a.toast)
      if (a.done) setDoneActions((d) => ({ ...d, [key]: a }))
      if (a.audit) {
        setTimeline((t) => [{ id: nextId(), kind: 'edit', title: a.audit!, who: 'You' }, ...t])
      }
      if (a.chat) {
        const token = ++runToken.current
        await pushAgent(a.chat, token)
      }
    },
    [pushAgent, showToast]
  )

  const chips = CHIP_NODES[chipNode] ?? []

  return (
    <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-premium-xl">
      {/* ---------- header ---------- */}
      <header className="flex flex-wrap items-center gap-3 border-b border-gray-200 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent-900)]" />
          <b className="text-sm font-semibold tracking-tight text-gray-950">Flowtuple</b>
        </div>
        <span className="hidden rounded-full border border-gray-200 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-gray-400 sm:inline">
          Sample data · live actions
        </span>

        <div className="ml-auto flex flex-wrap items-center gap-1 rounded-full bg-gray-100 p-1">
          {PERSONAS.map((p) => (
            <button
              key={p.id}
              onClick={() => selectPersona(p)}
              aria-pressed={p.id === personaId}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:px-4 ${
                p.id === personaId ? 'bg-[var(--accent-900)] text-white' : 'text-gray-600 hover:text-gray-950'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-[11px] font-semibold text-[var(--accent-900)]">
          {persona.me}
        </div>
      </header>

      <div className="flex min-h-[640px] flex-col lg:h-[720px] lg:flex-row">
        {/* ---------- left rail ---------- */}
        <nav className="hidden w-56 shrink-0 flex-col gap-0.5 overflow-y-auto border-r border-gray-200 p-3 xl:flex">
          <div className="px-2 pb-2 pt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400">
            Workspace
          </div>
          {(['Approvals', 'Tasks'] as const).map((k) => (
            <div key={k} className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] text-gray-600">
              <CheckCircle2 className="h-4 w-4" strokeWidth={1.6} />
              {k}
              <span className="ml-auto rounded-full bg-[var(--accent-900)] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                {persona.badges[k]}
              </span>
            </div>
          ))}

          <div className="px-2 pb-2 pt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400">
            Pinned views
          </div>
          {persona.pins.map(([label, id]) => (
            <button
              key={id}
              onClick={() => runScenario(id)}
              className={`group flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors hover:bg-gray-50 ${
                scenarioId === id ? 'text-[var(--accent-900)]' : 'text-gray-600'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                  scenarioId === id ? 'bg-[var(--accent-900)]' : 'bg-gray-300 group-hover:bg-[var(--accent-900)]'
                }`}
              />
              {label}
            </button>
          ))}

          <div className="mt-auto pt-6 text-[9.5px] uppercase tracking-[0.14em] text-gray-400">
            One login · one window
          </div>
        </nav>

        {/* ---------- chat ---------- */}
        <div className="flex min-h-0 flex-col border-b border-gray-200 lg:w-[380px] lg:shrink-0 lg:border-b-0 lg:border-r">
          <div ref={threadRef} className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5" style={{ minHeight: 260 }}>
            {messages.map((m) =>
              m.role === 'user' ? (
                <div key={m.id} className="flex justify-end">
                  <p className="max-w-[85%] rounded-2xl rounded-br-md bg-gray-100 px-3.5 py-2 text-[13px] leading-relaxed text-gray-950">
                    {m.text}
                  </p>
                </div>
              ) : (
                <div key={m.id} className="flex gap-2.5">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent-900)]">
                    <Sparkles className="h-3 w-3 text-white" strokeWidth={2} />
                  </span>
                  <p className="text-[13px] leading-relaxed text-gray-700">{m.text}</p>
                </div>
              )
            )}
            {typing && (
              <div className="flex gap-2.5">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent-900)]">
                  <Sparkles className="h-3 w-3 text-white" strokeWidth={2} />
                </span>
                <span className="flex items-center gap-1 pt-2">
                  {[0, 1, 2].map((i) => (
                    <i
                      key={i}
                      className="h-1.5 w-1.5 animate-pulse rounded-full bg-gray-400"
                      style={{ animationDelay: `${i * 160}ms` }}
                    />
                  ))}
                </span>
              </div>
            )}
          </div>

          <div className="shrink-0 border-t border-gray-200 p-4">
            <div className="mb-3 flex flex-wrap gap-1.5">
              {chips.map((c) => (
                <button
                  key={c.label}
                  onClick={() => onChip(c)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    c.back
                      ? 'border-gray-200 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
                      : 'border-[var(--accent-900)]/25 bg-[var(--accent-900)]/5 text-[var(--accent-900)] hover:border-[var(--accent-900)] hover:bg-[var(--accent-900)]/10'
                  }`}
                >
                  {c.label.replace(/\{co\}/g, focal ?? 'supplier')}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white py-1 pl-4 pr-1">
              <input
                readOnly
                placeholder="Ask Flowtuple anything…"
                className="min-w-0 flex-1 bg-transparent py-1.5 text-[13px] text-gray-950 outline-none placeholder:text-gray-400"
                aria-label="Chat input (use the quick actions above)"
              />
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-900)] text-white">
                <Send className="h-3.5 w-3.5" strokeWidth={1.8} />
              </span>
            </div>
            <p className="mt-2.5 text-[11px] leading-snug text-gray-400">
              Chat is one way in. Quick actions, pinned views, and standard screens work without it.
            </p>
          </div>
        </div>

        {/* ---------- generated canvas ---------- */}
        <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col bg-gray-50">
          <div className="shrink-0 border-b border-gray-200 bg-white px-4 py-3 sm:px-5">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              {composing ? (
                <b className="flex items-center gap-2 text-[13px] font-semibold text-[var(--accent-900)]">
                  <span className="h-3 w-3 animate-spin rounded-full border-[1.5px] border-[var(--accent-200)] border-t-[var(--accent-900)]" />
                  Composing this surface…
                </b>
              ) : (
                <b className="text-[13px] font-semibold text-gray-950">Generated for this task</b>
              )}
              <span className="text-[11px] text-gray-400">
                composed on demand from a fixed component library · rendered via MCP UI · live actions
              </span>
            </div>

            {/* the bounded vocabulary; highlighted parts are the ones this request selected */}
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              {PRIMITIVES.map((p) => {
                const on = !composing && usedPrimitives.has(p.id)
                return (
                  <span
                    key={p.id}
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors duration-500 ${
                      on
                        ? 'border-[var(--accent-200)] bg-[var(--accent-50)] text-[var(--accent-900)]'
                        : 'border-gray-200 bg-white text-gray-300'
                    }`}
                  >
                    {p.label}
                  </span>
                )
              })}
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-5" style={{ minHeight: 320 }}>
            {composing && (
              <div className="space-y-3" aria-hidden>
                {[64, 120, 88].map((h, i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-2xl border border-gray-200 bg-white"
                    style={{ height: h, animationDelay: `${i * 120}ms` }}
                  />
                ))}
              </div>
            )}

            {!composing &&
              scenario.cards.slice(0, revealed).map((card, i) => (
                <div key={`${scenarioId}-${i}`} className="animate-fade-up">
                  <CardRenderer
                    card={card}
                    cardIndex={i}
                    doneActions={doneActions}
                    onAction={onAction}
                    focal={focal}
                    stage={stage}
                    blocked={blocked}
                    docs={docs}
                    timeline={timeline}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* ---------- toast ---------- */}
      <div
        aria-live="polite"
        className={`pointer-events-none absolute bottom-5 left-1/2 z-20 -translate-x-1/2 transition-all duration-300 ${
          toast ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
        }`}
      >
        {toast && (
          <div className="flex items-center gap-2 rounded-full bg-gray-950 px-4 py-2.5 text-xs font-medium text-white shadow-premium-lg">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2} />
            {toast}
          </div>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Card renderers
 * ------------------------------------------------------------------ */

interface RenderProps {
  card: Card
  cardIndex: number
  doneActions: Record<string, Action>
  onAction: (key: string, a: Action) => void
  focal: string | null
  stage: StageKey
  blocked: { to: StageKey; reason: string } | null
  docs: Record<DocId, DocState>
  timeline: TimelineEvent[]
}

function ActionButtons({
  acts,
  keyBase,
  doneActions,
  onAction,
}: {
  acts?: Action[]
  keyBase: string
  doneActions: Record<string, Action>
  onAction: (key: string, a: Action) => void
}) {
  if (!acts?.length) return null
  return (
    <div className="mt-2.5 flex flex-wrap gap-1.5">
      {acts.map((a, i) => {
        const key = `${keyBase}-${i}`
        const done = doneActions[key]
        if (done) {
          return (
            <span key={key} className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
              {done.done}
            </span>
          )
        }
        return (
          <button
            key={key}
            onClick={() => onAction(key, a)}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors ${
              a.ghost
                ? 'border border-gray-200 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
                : 'bg-[var(--accent-900)] text-white hover:bg-[var(--accent-800)]'
            }`}
          >
            {a.label}
          </button>
        )
      })}
    </div>
  )
}

function ListRow({
  row,
  keyBase,
  doneActions,
  onAction,
  audit,
}: {
  row: Row
  keyBase: string
  doneActions: Record<string, Action>
  onAction: (key: string, a: Action) => void
  audit?: boolean
}) {
  return (
    <div className="flex items-start gap-3 border-t border-gray-100 py-2.5 first:border-t-0 first:pt-0">
      {row.ini && (
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent-50)] text-[10px] font-semibold text-[var(--accent-900)]">
          {row.ini}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <b className={`block text-[12.5px] font-semibold ${audit ? 'text-gray-500' : 'text-gray-950'}`}>
          {row.t}
          {row.time && <em className="ml-2 font-normal not-italic text-gray-400">{row.time}</em>}
        </b>
        {row.p && <p className="mt-0.5 text-[12px] leading-relaxed text-gray-600">{row.p}</p>}
        <ActionButtons acts={row.acts} keyBase={keyBase} doneActions={doneActions} onAction={onAction} />
      </div>
      {row.st && row.stc && <Pill status={row.stc}>{row.st}</Pill>}
    </div>
  )
}

function CardRenderer(props: RenderProps) {
  const { card, cardIndex, doneActions, onAction, focal, stage, blocked, docs, timeline } = props

  switch (card.kind) {
    case 'kpis':
      return (
        <CanvasCard label="Analytics · at a glance">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {card.items.map(([v, l]) => (
              <div key={l}>
                <b className="block text-xl font-semibold tracking-tight text-gray-950">{v}</b>
                <span className="text-[11px] leading-snug text-gray-500">{l}</span>
              </div>
            ))}
          </div>
        </CanvasCard>
      )

    case 'list':
      return (
        <CanvasCard label={card.label}>
          <div>
            {card.rows.map((r, i) => (
              <ListRow
                key={i}
                row={r}
                keyBase={`${cardIndex}-${i}`}
                doneActions={doneActions}
                onAction={onAction}
                audit={card.variant === 'audit'}
              />
            ))}
          </div>
          {card.reply && (
            <div className="mt-3 rounded-full border border-gray-200 px-3.5 py-2 text-[12px] text-gray-400">
              Add a comment…
            </div>
          )}
        </CanvasCard>
      )

    case 'table':
      return (
        <CanvasCard label={card.label}>
          <div className="-mx-1 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left">
              <thead>
                <tr>
                  {card.cols.map((c, i) => (
                    <th
                      key={i}
                      className="border-b border-gray-200 px-1 pb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400"
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {card.rows.map((r, i) => (
                  <tr key={i} className={r.flag ? 'bg-amber-50/60' : undefined}>
                    <td className="border-b border-gray-100 px-1 py-2.5">
                      <b className="block text-[12.5px] font-semibold text-gray-950">{r.cells[0]}</b>
                      {r.sub?.[0] && <span className="text-[11px] text-gray-500">{r.sub[0]}</span>}
                    </td>
                    {r.cells.slice(1).map((c, j) => (
                      <td key={j} className="border-b border-gray-100 px-1 py-2.5 text-[12.5px] tabular-nums text-gray-700">
                        {c}
                      </td>
                    ))}
                    <td className="border-b border-gray-100 px-1 py-2.5">
                      <div className="flex flex-col items-start gap-1">
                        {r.st && r.stc && <Pill status={r.stc}>{r.st}</Pill>}
                        <ActionButtons
                          acts={r.acts}
                          keyBase={`${cardIndex}-${i}`}
                          doneActions={doneActions}
                          onAction={onAction}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CanvasCard>
      )

    case 'steps':
      return (
        <CanvasCard label={card.label}>
          <div className="space-y-0">
            {card.items.map((s, i) => (
              <div key={i} className="flex gap-3 pb-3 last:pb-0">
                <div className="flex flex-col items-center">
                  <span
                    className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                      s.state === 'done'
                        ? 'bg-emerald-500'
                        : s.state === 'run'
                          ? 'bg-[var(--accent-900)] ring-4 ring-[var(--accent-100)]'
                          : s.state === 'warn'
                            ? 'bg-amber-500'
                            : 'bg-gray-300'
                    }`}
                  />
                  {i < card.items.length - 1 && <span className="mt-1 w-px flex-1 bg-gray-200" />}
                </div>
                <div className="pb-1">
                  <b className="block text-[12.5px] font-semibold text-gray-950">{s.t}</b>
                  {s.sub && <span className="text-[11.5px] text-gray-500">{s.sub}</span>}
                </div>
              </div>
            ))}
          </div>
        </CanvasCard>
      )

    case 'bars': {
      const max = Math.max(...card.items.map((i) => i.h))
      return (
        <CanvasCard label={card.label}>
          <div className="flex items-end gap-4 pt-2">
            {card.items.map((b) => (
              <div key={b.l} className="flex flex-1 flex-col items-center gap-1.5">
                <b className="text-[11px] font-semibold text-gray-950">{b.v}</b>
                <div
                  className={`w-full rounded-t-md transition-all ${b.warn ? 'bg-amber-400' : 'bg-[var(--accent-900)]'}`}
                  style={{ height: `${Math.max(6, (b.h / max) * 92)}px` }}
                />
                <span className="text-[10px] text-gray-500">{b.l}</span>
              </div>
            ))}
          </div>
        </CanvasCard>
      )
    }

    case 'form': {
      const key = `${cardIndex}-submit`
      const done = doneActions[key]
      return (
        <CanvasCard label={card.label}>
          {card.intro && <p className="-mt-1 mb-3 text-[11.5px] leading-relaxed text-gray-500">{card.intro}</p>}
          <div className="grid gap-3 sm:grid-cols-2">
            {card.fields.map((f) => (
              <label key={f.label} className={f.type === 'textarea' ? 'sm:col-span-2' : undefined}>
                <span className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  {f.label}
                  {f.prefilled && (
                    <span className="rounded-full bg-[var(--accent-50)] px-1.5 py-0.5 text-[9px] font-semibold normal-case tracking-normal text-[var(--accent-900)]">
                      agent-filled
                    </span>
                  )}
                </span>
                {f.type === 'textarea' ? (
                  <textarea
                    readOnly
                    rows={2}
                    defaultValue={f.value}
                    placeholder="Add a note…"
                    className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-[12px] leading-relaxed text-gray-950 outline-none focus:border-[var(--accent-900)]"
                  />
                ) : (
                  <div
                    className={`flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-[12.5px] text-gray-950 ${
                      f.type === 'select' ? 'cursor-default' : ''
                    }`}
                  >
                    <span>{f.value}</span>
                    {f.type === 'select' && <span className="text-[9px] text-gray-400">▾</span>}
                  </div>
                )}
                {f.hint && <span className="mt-1 block text-[10.5px] text-gray-400">{f.hint}</span>}
              </label>
            ))}
          </div>
          <div className="mt-3.5">
            {done ? (
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                {done.done}
              </span>
            ) : (
              <button
                onClick={() => onAction(key, card.submit)}
                className="rounded-full bg-[var(--accent-900)] px-3.5 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-[var(--accent-800)]"
              >
                {card.submit.label}
              </button>
            )}
          </div>
        </CanvasCard>
      )
    }

    case 'flowboard':
      return <FlowBoard focal={focal} stage={stage} blocked={blocked} />

    case 'docintel':
      return <DocIntel docs={docs} />

    case 'timeline':
      return <Timeline events={timeline} />

    case 'candidate':
      return (
        <CanvasCard label="Candidate">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent-50)] text-sm font-semibold text-[var(--accent-900)]">
              {CANDIDATE.initials}
            </span>
            <div>
              <b className="block text-sm font-semibold text-gray-950">{CANDIDATE.name}</b>
              <span className="text-[11.5px] text-gray-500">{CANDIDATE.meta}</span>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {CANDIDATE.rounds.map((r) => (
              <span
                key={r.label}
                className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                  r.done ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-[var(--accent-200)] bg-[var(--accent-50)] text-[var(--accent-900)]'
                }`}
              >
                {r.label} {r.done && '✓'}
              </span>
            ))}
          </div>
          <p className="mt-3 border-l-2 border-[var(--accent-900)] pl-3 text-[12px] leading-relaxed text-gray-600">
            {CANDIDATE.synthesis}
          </p>
          <ActionButtons
            acts={CANDIDATE.actions as Action[]}
            keyBase={`${cardIndex}-cand`}
            doneActions={doneActions}
            onAction={onAction}
          />
        </CanvasCard>
      )

    case 'resume':
      return (
        <CanvasCard label="Task view · attachment">
          <div className="mb-3 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-[11.5px] text-gray-950">
            <Paperclip className="h-3.5 w-3.5 shrink-0 text-[var(--accent-900)]" strokeWidth={1.6} />
            <b className="font-semibold">Meera_Krishnan_Resume.pdf</b>
            <span className="text-gray-500">· 2 pages · parsed by the intake agent</span>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 text-[11.5px] leading-relaxed">
            <div className="text-base font-semibold text-gray-950">Meera Krishnan</div>
            <div className="text-gray-500">Senior Backend Engineer · Seattle, WA · meera.krishnan@mail.com</div>
            <div className="mt-3 border-b border-gray-200 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--accent-900)]">
              Experience
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <b className="font-semibold text-gray-950">Corewave</b>
              <span className="text-gray-500">Staff Engineer · 2021 – present</span>
            </div>
            <ul className="mt-1 list-disc space-y-0.5 pl-4 text-gray-600">
              <li>Led event-driven rebuild of the payments platform; settlement failures down 38%</li>
              <li>Designed idempotent transaction pipeline handling 12M events/day</li>
            </ul>
            <div className="mt-2 flex items-baseline justify-between">
              <b className="font-semibold text-gray-950">Northbeam</b>
              <span className="text-gray-500">Senior Engineer · 2017 – 2021</span>
            </div>
            <ul className="mt-1 list-disc space-y-0.5 pl-4 text-gray-600">
              <li>Built order-routing services · 40M requests/day at 99.98% availability</li>
            </ul>
            <div className="mt-3 border-b border-gray-200 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--accent-900)]">
              Skills
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {['Go', 'Postgres', 'Kafka', 'Kubernetes', 'AWS'].map((s) => (
                <span key={s} className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[10.5px] text-gray-700">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </CanvasCard>
      )
  }
}

/* ------------------------------------------------------------------ *
 * Live, state-driven cards
 * ------------------------------------------------------------------ */

function FlowBoard({
  focal,
  stage,
  blocked,
}: {
  focal: string | null
  stage: StageKey
  blocked: { to: StageKey; reason: string } | null
}) {
  return (
    <CanvasCard label="Board · Supplier onboarding · assigned to Rachel">
      <div className="-mx-1 overflow-x-auto pb-1">
        <div className="flex min-w-max gap-2 px-1">
          {STAGES.map((st) => {
            const cards: { name: string; assigned: boolean }[] = []
            if (st.k === 'INVITED') {
              UNSTARTED_SUPPLIERS.filter((n) => n !== focal).forEach((n) => cards.push({ name: n, assigned: true }))
            }
            if (focal && st.k === stage) cards.push({ name: focal, assigned: true })
            ;(STATIC_BOARD[st.k] ?? []).forEach((n) => cards.push({ name: n, assigned: false }))

            const isBlockTarget = blocked?.to === st.k
            return (
              <div
                key={st.k}
                className={`w-[132px] shrink-0 rounded-xl border p-2 transition-colors ${
                  isBlockTarget ? 'border-dashed border-amber-400 bg-amber-50/50' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="mb-2 flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${st.c}`} />
                  <span className="text-[10.5px] font-semibold text-gray-700">{st.s}</span>
                  <i className="ml-auto not-italic text-[10px] text-gray-400">{cards.length}</i>
                </div>
                <div className="space-y-1.5">
                  {cards.map((c) => (
                    <div
                      key={c.name}
                      className={`rounded-lg border bg-white px-2 py-1.5 transition-all ${
                        c.name === focal ? 'border-[var(--accent-900)] shadow-premium' : 'border-gray-200'
                      }`}
                    >
                      <b className="block truncate text-[11px] font-semibold text-gray-950">{c.name}</b>
                      <span className="text-[9.5px] text-gray-400">
                        supplier{c.assigned ? ' · assigned' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      {blocked ? (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" strokeWidth={1.7} />
          <p className="text-[11.5px] leading-relaxed text-amber-900">
            <b className="font-semibold">Move blocked.</b> {blocked.reason}
          </p>
        </div>
      ) : (
        <p className="mt-3 text-[11px] text-gray-400">
          {focal
            ? `${focal} is in ${stageName(stage)}. Use the quick actions to advance it one transition at a time.`
            : 'Pick a supplier from the quick actions to start the machine.'}
        </p>
      )}
    </CanvasCard>
  )
}

function DocIntel({ docs }: { docs: Record<DocId, DocState> }) {
  return (
    <CanvasCard label="Document Intelligence agent">
      <div className="space-y-2">
        {DOC_ORDER.map((id) => {
          const m = DOC_META[id]
          const state = docs[id]
          return (
            <div key={id} className="rounded-xl border border-gray-200 p-2.5">
              <div className="flex items-center gap-2.5">
                <FileText className="h-4 w-4 shrink-0 text-[var(--accent-900)]" strokeWidth={1.6} />
                <div className="min-w-0 flex-1">
                  <b className="block truncate text-[11.5px] font-semibold text-gray-950">{m.file}</b>
                  <span className="text-[10px] text-gray-400">{m.type}</span>
                </div>
                {state === 'reading' && (
                  <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--accent-900)]">
                    <span className="h-2.5 w-2.5 animate-spin rounded-full border-[1.5px] border-[var(--accent-200)] border-t-[var(--accent-900)]" />
                    Reading
                  </span>
                )}
                {state === 'pending' && <Pill status="mut">Awaiting</Pill>}
                {state === 'ok' && <Pill status="ok">Extracted</Pill>}
                {state === 'miss' && <Pill status="warn">Missing</Pill>}
              </div>
              {state === 'ok' && (
                <div className="mt-2.5 grid grid-cols-2 gap-2 border-t border-gray-100 pt-2.5 sm:grid-cols-4">
                  {m.fields.map(([k, v]) => (
                    <div key={k}>
                      <b className="block truncate text-[11px] font-semibold text-gray-950">{v}</b>
                      <span className="text-[9.5px] uppercase tracking-wide text-gray-400">{k}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </CanvasCard>
  )
}

function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <CanvasCard label="Activity log">
      {events.length === 0 ? (
        <p className="py-4 text-center text-[11.5px] text-gray-400">
          Activity appears here as you advance the supplier, one step per click.
        </p>
      ) : (
        <div className="space-y-0">
          {events.map((e) => (
            <div key={e.id} className="flex items-start gap-2.5 border-t border-gray-100 py-2.5 first:border-t-0 first:pt-0">
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                  e.kind === 'block'
                    ? 'bg-amber-50 text-amber-600'
                    : e.kind === 'audit'
                      ? 'bg-emerald-50 text-emerald-700'
                      : e.kind === 'edit'
                        ? 'bg-gray-100 text-gray-500'
                        : 'bg-[var(--accent-50)] text-[var(--accent-900)]'
                }`}
              >
                {e.kind === 'block' ? (
                  <ShieldAlert className="h-3.5 w-3.5" strokeWidth={1.7} />
                ) : e.kind === 'audit' ? (
                  <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.7} />
                ) : e.kind === 'edit' ? (
                  <SquarePen className="h-3.5 w-3.5" strokeWidth={1.7} />
                ) : (
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.7} />
                )}
              </span>
              <div className="min-w-0 flex-1">
                {e.kind === 'move' && (
                  <>
                    <div className="text-[12px] text-gray-950">
                      Moved to <b className="font-semibold">{e.to}</b>
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-1 text-[11px] text-gray-500">
                      {e.who}
                      <code className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600">{e.from}</code>
                      <span className="text-gray-400">→</span>
                      <code className="rounded bg-[var(--accent-50)] px-1.5 py-0.5 text-[10px] text-[var(--accent-900)]">{e.to}</code>
                    </div>
                  </>
                )}
                {e.kind === 'block' && (
                  <>
                    <div className="text-[12px] text-gray-950">
                      Move blocked: {e.from} → {e.to}
                    </div>
                    <div className="mt-0.5 text-[11px] text-amber-700">{e.reason}</div>
                  </>
                )}
                {e.kind === 'edit' && (
                  <>
                    <div className="text-[12px] text-gray-950">{e.title}</div>
                    <div className="mt-0.5 text-[11px] text-gray-500">{e.who}</div>
                  </>
                )}
                {e.kind === 'audit' && (
                  <>
                    <div className="text-[12px] text-gray-950">
                      Audit trail verified: <b className="font-semibold text-emerald-700">{e.state}</b>
                    </div>
                    <div className="mt-0.5 text-[11px] text-gray-500">Audit agent</div>
                  </>
                )}
              </div>
              <span className="shrink-0 text-[10px] text-gray-400">just now</span>
            </div>
          ))}
        </div>
      )}
    </CanvasCard>
  )
}
