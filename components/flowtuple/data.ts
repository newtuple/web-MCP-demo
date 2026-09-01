/**
 * Sample data for the Flowtuple workspace concept.
 *
 * Everything here is illustrative. Ported from
 * design_guidelines/Flowtuple_Screen_Concept.html and re-keyed onto the
 * Newtuple palette (the concept's violet stage colours become cobalt/cyan).
 */

export type Status = 'ok' | 'warn' | 'bad' | 'info' | 'mut'

export interface Action {
  act: 'approve' | 'back' | 'escalate' | 'resolve' | 'toast'
  label: string
  /** Label the button settles on once clicked. Omit for fire-and-forget actions. */
  done?: string
  doneStatus?: Status
  toast: string
  /** Appended to the live audit trail. */
  audit?: string
  /** Agent follow-up pushed into the chat thread. */
  chat?: string
  ghost?: boolean
}

export interface Row {
  ini?: string
  t: string
  time?: string
  p?: string
  st?: string
  stc?: Status
  acts?: Action[]
}

export interface TableRow {
  cells: string[]
  sub?: string[]
  flag?: boolean
  st?: string
  stc?: Status
  acts?: Action[]
}

export interface Step {
  state: 'done' | 'run' | 'warn' | 'todo'
  t: string
  sub?: string
}

export interface FormField {
  label: string
  value: string
  hint?: string
  type?: 'text' | 'select' | 'textarea'
  prefilled?: boolean
}

export type Card =
  | { kind: 'kpis'; items: [string, string][] }
  | { kind: 'list'; label: string; rows: Row[]; variant?: 'audit' | 'thread'; reply?: boolean }
  | { kind: 'table'; label: string; cols: string[]; rows: TableRow[] }
  | { kind: 'steps'; label: string; items: Step[] }
  | { kind: 'bars'; label: string; items: { l: string; v: string; h: number; warn?: boolean }[] }
  | { kind: 'form'; label: string; intro?: string; fields: FormField[]; submit: Action }
  | { kind: 'flowboard' }
  | { kind: 'docintel' }
  | { kind: 'timeline' }
  | { kind: 'candidate' }
  | { kind: 'resume' }

/**
 * The bounded component vocabulary the generative layer is allowed to draw
 * from. The arrangement is composed per request; the parts never vary.
 */
export const PRIMITIVES = [
  { id: 'dashboard', label: 'Dashboard objects' },
  { id: 'kanban', label: 'Kanban boards' },
  { id: 'list', label: 'Lists' },
  { id: 'table', label: 'Tables' },
  { id: 'form', label: 'Forms' },
  { id: 'actions', label: 'Task actions' },
] as const

export type PrimitiveId = (typeof PRIMITIVES)[number]['id']

/** Which primitives a given card is built from. */
export function primitivesFor(card: Card): PrimitiveId[] {
  const has = (rows: { acts?: Action[] }[]) => rows.some((r) => r.acts?.length)
  switch (card.kind) {
    case 'kpis':
    case 'bars':
      return ['dashboard']
    case 'flowboard':
      return ['kanban']
    case 'table':
      return has(card.rows) ? ['table', 'actions'] : ['table']
    case 'list':
      return has(card.rows) ? ['list', 'actions'] : ['list']
    case 'form':
      return ['form', 'actions']
    case 'candidate':
      return ['list', 'actions']
    case 'steps':
    case 'timeline':
    case 'docintel':
    case 'resume':
      return ['list']
  }
}

export interface Scenario {
  prompt: string
  reply: string
  cards: Card[]
}

/* ------------------------------------------------------------------ *
 * Supplier onboarding state machine: the practitioner-facing payload
 * ------------------------------------------------------------------ */

export const STAGES = [
  { k: 'INVITED', s: 'Invited', c: 'bg-[var(--accent-900)]' },
  { k: 'INTAKE_SUBMITTED', s: 'Intake', c: 'bg-[var(--accent-600)]' },
  { k: 'UNDER_VETTING', s: 'Vetting', c: 'bg-[var(--accent-400)]' },
  { k: 'DOCS_VALIDATION', s: 'Docs', c: 'bg-cyan-500' },
  { k: 'PENDING_APPROVALS', s: 'Approvals', c: 'bg-cyan-500' },
  { k: 'BANKING_VERIFICATION', s: 'Banking', c: 'bg-cyan-600' },
  { k: 'READY_FOR_HANDOFF', s: 'Handoff', c: 'bg-cyan-600' },
  { k: 'ACTIVE', s: 'Active', c: 'bg-emerald-500' },
  { k: 'REJECTED', s: 'Rejected', c: 'bg-rose-500' },
] as const

export type StageKey = (typeof STAGES)[number]['k']

/** Suppliers that sit in later stages purely to give the board context. */
export const STATIC_BOARD: Partial<Record<StageKey, string[]>> = {
  PENDING_APPROVALS: ['Summit Fixtures'],
  BANKING_VERIFICATION: ['Ironwood Displays'],
  READY_FOR_HANDOFF: ['Prairie Foods'],
  ACTIVE: ['Beacon Supply'],
}

export const UNSTARTED_SUPPLIERS = ['Meridian Polymers', 'Cascade Packaging', 'Harvest Foods Co.']

export type DocId = 'w9' | 'coi' | 'sqf' | 'bank'
export type DocState = 'pending' | 'reading' | 'ok' | 'miss'

export const DOC_META: Record<DocId, { file: string; type: string; fields: [string, string][] }> = {
  w9: {
    file: 'W9_Cascade_Harvest_Foods.pdf',
    type: 'W-9 · Taxpayer ID',
    fields: [
      ['Legal name', 'Cascade Harvest Foods LLC'],
      ['Classification', 'LLC (C corporation)'],
      ['EIN', '87-3456219'],
      ['Address', '2140 NW Quimby St, Portland OR'],
    ],
  },
  coi: {
    file: 'COI_Cascade_Harvest_Foods.pdf',
    type: 'Certificate of Insurance',
    fields: [
      ['Insurer', 'Travelers Property Casualty'],
      ['Policy', 'TRV-8842190'],
      ['Gen. liability', '$2,000,000 / occurrence'],
      ['Valid', '07/01/2026 to 07/01/2027'],
    ],
  },
  sqf: {
    file: 'SQF_Certificate_Cascade_Harvest.pdf',
    type: 'SQF Food-Safety Certificate',
    fields: [
      ['Certificate', 'SQF-2024-11847'],
      ['Scope', 'Granola, trail mixes, baked crisps'],
      ['Body', 'NSF Certification LLC'],
      ['Expiry', 'Mar 11, 2027'],
    ],
  },
  bank: {
    file: 'Bank_Letter_Cascade_Harvest.pdf',
    type: 'Bank Verification Letter',
    fields: [
      ['Bank', 'Wells Fargo Bank, N.A.'],
      ['Account', '4831009274'],
      ['ACH routing', '121000248'],
      ['Standing', 'Good · open since Apr 2016'],
    ],
  },
}

export const DOC_ORDER: DocId[] = ['w9', 'coi', 'sqf', 'bank']

/* ------------------------------------------------------------------ *
 * Storyboard: quick-action chips that drive the state machine
 * ------------------------------------------------------------------ */

export type SeqStep =
  | { type: 'choose'; name: string; to: StageKey }
  | { type: 'move'; to: StageKey; who: string }
  | { type: 'edit'; title: string; who: string }
  | { type: 'block'; to: StageKey; reason: string }
  | { type: 'docrun'; plan: { id: DocId; end: 'ok' | 'miss' }[] }
  | { type: 'audit'; state: string }

export interface Chip {
  label: string
  /** Switch the canvas to a different scenario. */
  run?: string
  /** Agent reply pushed to chat. `{co}` interpolates the focal supplier. */
  say?: string
  seq?: SeqStep[]
  /** Next chip node. */
  to?: string
  back?: boolean
}

export const CHIP_NODES: Record<string, Chip[]> = {
  vp_root: [
    { label: 'Supplier onboarding', run: 'vp1', to: 'sup_choose' },
    { label: 'Store incidents', run: 'vp2', to: 'vp_incidents' },
    { label: 'SLA watch', run: 'vp3', to: 'vp_sla' },
  ],
  sup_choose: [
    {
      label: 'Start intake · Meridian Polymers',
      seq: [{ type: 'choose', name: 'Meridian Polymers', to: 'INTAKE_SUBMITTED' }],
      say: 'Intake started for Meridian Polymers. The guided intake form came back complete and validated, ready for vetting.',
      to: 'sup_vet',
    },
    {
      label: 'Start intake · Cascade Packaging',
      seq: [{ type: 'choose', name: 'Cascade Packaging', to: 'INTAKE_SUBMITTED' }],
      say: 'Intake started for Cascade Packaging. The guided intake form came back complete and validated, ready for vetting.',
      to: 'sup_vet',
    },
    { label: '← Workflows', to: 'vp_root', back: true },
  ],
  sup_vet: [
    {
      label: 'Begin vetting',
      seq: [
        { type: 'move', to: 'UNDER_VETTING', who: 'Onboarding agent' },
        { type: 'edit', title: 'KYB verification: business registration + UBO confirmed', who: 'KYB agent' },
        { type: 'edit', title: 'Sanctions & adverse-media screening: potential match found', who: 'Screening agent' },
        {
          type: 'block',
          to: 'DOCS_VALIDATION',
          reason:
            'Potential OFAC watchlist match on {co} awaiting analyst clearance · guard vetting_passed requires sanctions_status = clear',
        },
      ],
      say: 'The vetting agent ran the checks on {co}: KYB verified against the business registration and beneficial owners, but sanctions screening flagged a potential OFAC watchlist match. The vetting_passed gate is blocked until an analyst clears it.',
      to: 'sup_blocked',
    },
    { label: '← Workflows', to: 'vp_root', back: true },
  ],
  sup_blocked: [
    {
      label: 'Why was it blocked?',
      say: 'Sanctions screening returned a possible match against an OFAC watchlist entry with a similar name. The vetting_passed guard requires sanctions_status = clear, so the move to document validation is physically blocked until an analyst confirms it is a false positive or a true hit. Nothing advances on a maybe.',
      to: 'sup_blocked',
    },
    {
      label: 'Clear sanctions (analyst reviewed)',
      seq: [
        { type: 'edit', title: 'Analyst cleared match as false positive · sanctions_status → clear', who: 'Analyst' },
        { type: 'move', to: 'DOCS_VALIDATION', who: 'Onboarding agent' },
        {
          type: 'edit',
          title: 'Document Intelligence agent: classifying & extracting uploaded documents',
          who: 'Document Intelligence agent',
        },
        { type: 'docrun', plan: [{ id: 'w9', end: 'ok' }, { id: 'coi', end: 'ok' }, { id: 'sqf', end: 'miss' }] },
        {
          type: 'block',
          to: 'PENDING_APPROVALS',
          reason: 'SQF food-safety certificate missing · guard docs_complete requires docs_outstanding = 0',
        },
      ],
      say: 'Analyst cleared the match as a false positive, so {co} advances to document validation. The Document Intelligence agent read and validated the W-9 and insurance certificate, but the SQF food-safety certificate is missing, so docs_complete is blocked.',
      to: 'sup_docs2',
    },
    { label: '← Workflows', to: 'vp_root', back: true },
  ],
  sup_docs2: [
    {
      label: 'Request the missing SQF certificate',
      seq: [
        { type: 'edit', title: 'SQF food-safety certificate received', who: 'Extraction agent' },
        { type: 'docrun', plan: [{ id: 'sqf', end: 'ok' }] },
        { type: 'move', to: 'PENDING_APPROVALS', who: 'Onboarding agent' },
        { type: 'edit', title: 'Approvals routed by risk tier · 1 approver (standard)', who: 'Onboarding agent' },
        { type: 'move', to: 'BANKING_VERIFICATION', who: 'Onboarding agent' },
      ],
      say: '{co} uploaded the SQF certificate; the Document Intelligence agent extracted and validated it (docs_outstanding → 0). The case advanced to approvals, the single standard-tier approval was recorded, and it moved on to banking verification.',
      to: 'sup_bank',
    },
    { label: '← Workflows', to: 'vp_root', back: true },
  ],
  sup_bank: [
    {
      label: 'Verify banking details',
      seq: [
        { type: 'docrun', plan: [{ id: 'bank', end: 'ok' }] },
        { type: 'edit', title: 'Bank verification: micro-deposit confirmed + fraud checks passed', who: 'Bank verification agent' },
        { type: 'move', to: 'READY_FOR_HANDOFF', who: 'Onboarding agent' },
      ],
      say: "The bank verification agent read the bank letter, confirmed {co}'s account by micro-deposit, and passed fraud checks. {co} is ready for the final audit review.",
      to: 'sup_audit',
    },
    { label: '← Workflows', to: 'vp_root', back: true },
  ],
  sup_audit: [
    {
      label: 'Run the audit review',
      seq: [{ type: 'audit', state: 'complete and defensible' }],
      say: 'The audit agent replayed every transition on {co}: each move carries an actor, a timestamp, a correlation id, and the guard it satisfied. Nothing is missing. The last gate is yours.',
      to: 'sup_approve',
    },
    { label: '← Workflows', to: 'vp_root', back: true },
  ],
  sup_approve: [
    {
      label: 'Approve & activate {co}',
      seq: [{ type: 'move', to: 'ACTIVE', who: 'You' }],
      say: '{co} is live. The transition is logged against your name, the ERP vendor record is queued, and the onboarding workflow closes. That final gate never leaves a human.',
      to: 'sup_done',
    },
    {
      label: 'Reject onboarding',
      seq: [{ type: 'move', to: 'REJECTED', who: 'You' }],
      say: '{co} is rejected and the workflow closes. The reason is written to the audit trail, and the supplier is notified with the standard template.',
      to: 'sup_done',
    },
    { label: '← Workflows', to: 'vp_root', back: true },
  ],
  sup_done: [
    { label: 'Onboard another supplier', to: 'sup_choose', say: 'Pick the next supplier and we will walk the same machine again.' },
    { label: '← Workflows', to: 'vp_root', back: true },
  ],
  vp_incidents: [
    { label: 'SLA watch', run: 'vp3', to: 'vp_sla' },
    { label: '← Workflows', to: 'vp_root', back: true },
  ],
  vp_sla: [
    { label: 'Store incidents', run: 'vp2', to: 'vp_incidents' },
    { label: '← Workflows', to: 'vp_root', back: true },
  ],
  rec_root: [
    { label: 'Meera Krishnan', run: 'rec1' },
    { label: "What's on my plate today?", run: 'rec2' },
    { label: 'Screen Backend Lead resumes', run: 'rec3' },
  ],
  reg_root: [
    { label: 'Filing CA-2026-Q2', run: 'reg1' },
    { label: 'Upcoming deadlines', run: 'reg2' },
    { label: 'FCC 499-Q draft', run: 'reg3' },
  ],
}

/* ------------------------------------------------------------------ *
 * Personas
 * ------------------------------------------------------------------ */

export interface Persona {
  id: 'vp' | 'rec' | 'reg'
  label: string
  me: string
  def: string
  welcome: string
  chipRoot: string
  badges: { Approvals: number; Tasks: number }
  pins: [string, string][]
}

export const PERSONAS: Persona[] = [
  {
    id: 'vp',
    label: 'VP · Retail Ops',
    me: 'RM',
    def: 'vp1',
    welcome:
      'Good morning, Rachel. Three supplier approvals are waiting on you, Meridian Polymers is six hours from SLA, and stores logged 11 new incidents overnight.',
    chipRoot: 'vp_root',
    badges: { Approvals: 3, Tasks: 5 },
    pins: [
      ['Supplier onboarding', 'vp1'],
      ['Store incidents', 'vp2'],
      ['SLA watch', 'vp3'],
    ],
  },
  {
    id: 'rec',
    label: 'Recruiter',
    me: 'EC',
    def: 'rec1',
    welcome:
      'Hi Emily. Three interviews today, Meera Krishnan’s final round is at 3:00 PM, and 18 new resumes came in for Backend Lead overnight.',
    chipRoot: 'rec_root',
    badges: { Approvals: 1, Tasks: 5 },
    pins: [
      ['Meera Krishnan', 'rec1'],
      ['Today', 'rec2'],
      ['Backend Lead · screening', 'rec3'],
    ],
  },
  {
    id: 'reg',
    label: 'Regulatory Consultant',
    me: 'DB',
    def: 'reg1',
    welcome:
      'Hello Daniel. Twelve filings tracked. CA-2026-Q2 is regenerated and waiting on your review, and the FCC 499-Q is due in thirteen days.',
    chipRoot: 'reg_root',
    badges: { Approvals: 2, Tasks: 3 },
    pins: [
      ['Filing CA-2026-Q2', 'reg1'],
      ['Filing calendar', 'reg2'],
      ['FCC 499-Q draft', 'reg3'],
    ],
  },
]

/* ------------------------------------------------------------------ *
 * Scenarios
 * ------------------------------------------------------------------ */

export const SCENARIOS: Record<string, Scenario> = {
  /* ---------- VP · Retail Operations ---------- */
  vp1: {
    prompt: 'Pull up supplier onboarding.',
    reply:
      'Here’s the full onboarding picture for Retail Northeast: nine suppliers in motion, three waiting on you, one at risk in Review. The approve and send-back actions on the right are live.',
    cards: [
      {
        kind: 'kpis',
        items: [
          ['9', 'suppliers in flight'],
          ['3', 'waiting on your approval'],
          ['11.2 days', 'avg. cycle · down 2.1'],
          ['96.4%', 'SLA · last 30 days'],
        ],
      },
      { kind: 'flowboard' },
      { kind: 'docintel' },
      {
        kind: 'form',
        label: 'Form · credit exception · Cascade Packaging',
        intro: 'The agent pre-filled this from the credit memo. Anything you change is attributed to you.',
        fields: [
          { label: 'Requested credit limit', value: '$255,000', prefilled: true },
          { label: 'Policy threshold', value: '$250,000', hint: 'Standard tier · 2.1% over' },
          { label: 'Decision', value: 'Approve with covenant', type: 'select' },
          {
            label: 'Rationale',
            value: 'Four years trading history, no late payments, DSO 34 days.',
            type: 'textarea',
            prefilled: true,
          },
        ],
        submit: {
          act: 'approve',
          label: 'Submit exception',
          done: 'Submitted ✓',
          doneStatus: 'ok',
          toast: 'Exception submitted · covenant attached · audit logged',
          audit: 'You submitted the Cascade Packaging credit exception',
        },
      },
      {
        kind: 'list',
        label: 'Task list · waiting on you',
        rows: [
          {
            ini: 'MP',
            t: 'Meridian Polymers · compliance review',
            p: 'All checks passed · margin terms within policy · 6h to SLA',
            st: 'Pending',
            stc: 'warn',
            acts: [
              {
                act: 'approve',
                label: 'Approve',
                done: 'Approved ✓',
                doneStatus: 'ok',
                toast: 'Approved · transition logged · ERP sync queued',
                audit: 'You approved Meridian Polymers · compliance review',
                chat: 'Meridian Polymers approved. The transition is logged, the ERP vendor record is queued, and the SLA timer is cleared.',
              },
              {
                act: 'back',
                label: 'Send back',
                ghost: true,
                toast: 'Sent back to Docs with a note · owner notified',
                audit: 'You sent Meridian Polymers back to Docs',
              },
            ],
          },
          {
            ini: 'CP',
            t: 'Cascade Packaging · credit exception',
            p: 'Requested limit is 2.1% over policy threshold · agent attached rationale',
            st: 'Pending',
            stc: 'warn',
            acts: [
              {
                act: 'approve',
                label: 'Approve exception',
                done: 'Approved ✓',
                doneStatus: 'ok',
                toast: 'Exception approved · audit logged',
                audit: 'You approved the Cascade Packaging credit exception',
              },
              {
                act: 'back',
                label: 'Send back',
                ghost: true,
                toast: 'Sent back with a note · assignee notified',
                audit: 'You declined the Cascade Packaging credit exception',
              },
            ],
          },
          {
            ini: 'SF',
            t: 'Summit Fixtures · final onboarding approval',
            p: 'Compliance passed · contract executed · ready to go live',
            st: 'Pending',
            stc: 'warn',
            acts: [
              {
                act: 'approve',
                label: 'Approve',
                done: 'Approved ✓',
                doneStatus: 'ok',
                toast: 'Approved · Summit Fixtures moving to Live',
                audit: 'You gave final approval · Summit Fixtures',
              },
            ],
          },
        ],
      },
      {
        kind: 'list',
        label: 'Workflow SLAs · by stage',
        rows: [
          { t: 'Invited → Docs', p: 'Target 3 days · running 1.8', st: 'Healthy', stc: 'ok' },
          { t: 'Docs → Review', p: 'Target 5 days · running 4.1', st: 'Healthy', stc: 'ok' },
          { t: 'Review → Approved', p: 'Target 2 days · running 2.6', st: 'Watch', stc: 'warn' },
          { t: 'Approved → Live', p: 'Target 4 days · running 2.9', st: 'Healthy', stc: 'ok' },
        ],
      },
      {
        kind: 'bars',
        label: 'Analytics · cycle time by stage (days)',
        items: [
          { l: 'Invited', v: '1.8', h: 26 },
          { l: 'Docs', v: '4.1', h: 58 },
          { l: 'Review', v: '2.6', h: 38, warn: true },
          { l: 'Approved', v: '2.9', h: 42 },
          { l: 'Live', v: '·', h: 8 },
        ],
      },
      { kind: 'timeline' },
    ],
  },
  vp2: {
    prompt: 'What’s happening with store incidents?',
    reply:
      'Forty-one open, mostly untagged items. The photo-to-SKU agent resolved 28 this week on its own; three need your call, and the actions are live.',
    cards: [
      {
        kind: 'kpis',
        items: [
          ['41', 'open incidents'],
          ['28', 'agent-resolved this week'],
          ['3.1h', 'median resolution'],
          ['6', 'stores above baseline'],
        ],
      },
      {
        kind: 'list',
        label: 'Task list · needs a human decision',
        rows: [
          {
            ini: '114',
            t: 'Store 114 · untagged denim jacket',
            p: 'Photo-to-SKU agent matched SKU 88213 · 94% confidence · price $79.50',
            st: 'Pending',
            stc: 'warn',
            acts: [
              {
                act: 'approve',
                label: 'Approve match',
                done: 'Matched ✓',
                doneStatus: 'ok',
                toast: 'SKU match approved · price tag queued for print',
                audit: 'You approved SKU 88213 · Store 114',
                chat: 'Store 114 is done. The tag prints at the store, and the MDM record is updated.',
              },
              {
                act: 'back',
                label: 'Reject',
                ghost: true,
                toast: 'Rejected · routed to merchandising queue',
                audit: 'You rejected the SKU match · Store 114',
              },
            ],
          },
          {
            ini: '207',
            t: 'Store 207 · unlabeled cookware set',
            p: 'Two candidate SKUs at 61% and 58% · agent requests human pick',
            st: 'Pending',
            stc: 'warn',
            acts: [
              {
                act: 'approve',
                label: 'Pick SKU 90411',
                done: 'Matched ✓',
                doneStatus: 'ok',
                toast: 'SKU 90411 selected · agent learns from your pick',
                audit: 'You selected SKU 90411 · Store 207',
              },
            ],
          },
          {
            ini: '052',
            t: 'Store 052 · register price mismatch',
            p: 'Shelf $24.99 vs. system $27.99 · recurring at this store',
            st: 'Open',
            stc: 'bad',
            acts: [
              {
                act: 'escalate',
                label: 'Escalate',
                toast: 'Escalated to pricing ops · SLA timer started',
                audit: 'You escalated the Store 052 price mismatch',
              },
            ],
          },
        ],
      },
      {
        kind: 'bars',
        label: 'Analytics · incidents by type',
        items: [
          { l: 'Untagged', v: '22', h: 78 },
          { l: 'Price', v: '9', h: 34, warn: true },
          { l: 'Damaged', v: '6', h: 22 },
          { l: 'Other', v: '4', h: 15 },
        ],
      },
      {
        kind: 'list',
        label: 'Assignment & audit history',
        variant: 'audit',
        rows: [
          { t: '10:02 AM', p: 'Photo-to-SKU agent resolved 4 incidents · Stores 88, 114, 190, 233' },
          { t: '9:31 AM', p: 'Store 052 mismatch auto-flagged as recurring · 3rd time in 30 days' },
          { t: 'Yesterday', p: 'You approved 6 SKU matches in one pass' },
        ],
      },
    ],
  },
  vp3: {
    prompt: 'Any SLA breaches this week?',
    reply:
      'One breach, two at risk. The breach auto-escalated an hour ago; you can escalate the other two from the right if you want them moving now.',
    cards: [
      {
        kind: 'kpis',
        items: [
          ['1', 'breached'],
          ['2', 'at risk'],
          ['96.4%', 'on time · 30 days'],
          ['14m', 'avg. time to escalate'],
        ],
      },
      {
        kind: 'list',
        label: 'Task list · SLA watch',
        rows: [
          {
            ini: 'MP',
            t: 'Meridian Polymers · Review',
            p: '6 hours to SLA · assigned to you',
            st: 'At risk',
            stc: 'warn',
            acts: [
              {
                act: 'approve',
                label: 'Review now',
                done: 'In review',
                doneStatus: 'info',
                toast: 'Opened for review · timer paused',
                audit: 'You started the Meridian Polymers review',
              },
            ],
          },
          {
            ini: 'CP',
            t: 'Cascade Packaging · Docs',
            p: '22 hours to SLA · waiting on supplier upload',
            st: 'At risk',
            stc: 'warn',
            acts: [
              {
                act: 'escalate',
                label: 'Nudge supplier',
                toast: 'Reminder sent · third follow-up scheduled',
                audit: 'You triggered a supplier nudge · Cascade Packaging',
              },
            ],
          },
          { ini: '052', t: 'Store 052 · price mismatch', p: 'Breached by 3h · auto-escalated to pricing ops', st: 'Breached', stc: 'bad' },
        ],
      },
      {
        kind: 'list',
        label: 'Workflow SLAs · this workflow',
        rows: [
          { t: 'Docs stage', p: 'Target 5 days · supplier-side wait excluded', st: 'Healthy', stc: 'ok' },
          { t: 'Review stage', p: 'Target 2 days · trending up 0.4 this month', st: 'Watch', stc: 'warn' },
          { t: 'Escalation rule', p: 'Breach → auto-assign to stage owner’s manager', st: 'Active', stc: 'info' },
        ],
      },
    ],
  },

  /* ---------- Recruiter ---------- */
  rec1: {
    prompt: 'Pull up Meera Krishnan’s file before the final round.',
    reply:
      'Here’s her full file: resume, the comment chain from all three rounds, and prepared next steps. She’s in at 3:00 PM. You can reply to the thread or open the offer draft from the right.',
    cards: [
      { kind: 'candidate' },
      { kind: 'resume' },
      {
        kind: 'form',
        label: 'Form · final-round scorecard',
        intro: 'Rendered because she is in a final round today. It will not appear on a candidate who is not.',
        fields: [
          { label: 'System design', value: 'Strong · 4 of 4', prefilled: true, hint: 'Carried from the technical round' },
          { label: 'Stakeholder communication', value: 'Probe today', type: 'select', hint: 'Flagged by the panel' },
          { label: 'Recommendation', value: 'Hire', type: 'select' },
          { label: 'Notes for the panel', value: '', type: 'textarea' },
        ],
        submit: {
          act: 'approve',
          label: 'Save scorecard',
          done: 'Saved ✓',
          doneStatus: 'ok',
          toast: 'Scorecard saved · attached to the 3:00 PM interview',
          audit: 'You saved the final-round scorecard · Meera Krishnan',
        },
      },
      {
        kind: 'list',
        label: 'Comment thread · 3 rounds',
        variant: 'thread',
        reply: true,
        rows: [
          {
            ini: 'MR',
            t: 'Mark Reynolds · Technical',
            time: '2d ago',
            p: '“Designed a clean event-driven rollback path. Senior-level tradeoff reasoning throughout.”',
          },
          {
            ini: 'JW',
            t: 'J. Whitfield · Panel',
            time: 'yesterday',
            p: '“Deep on data modeling. Less crisp when pushed on cross-team alignment; recommend probing in the final.”',
            st: 'Open',
            stc: 'warn',
            acts: [
              {
                act: 'resolve',
                label: 'Resolve',
                ghost: true,
                done: 'Resolved ✓',
                doneStatus: 'ok',
                toast: 'Comment resolved · thread updated for the panel',
                audit: 'You resolved J. Whitfield’s panel comment',
              },
            ],
          },
          {
            ini: 'AG',
            t: 'Notes agent',
            time: 'today, 8:05 AM',
            p: 'Compiled this brief from all three rounds. Offer draft prepared and parked pending your sign-off.',
            st: 'Agent',
            stc: 'info',
          },
        ],
      },
      {
        kind: 'list',
        label: 'Assignment & audit history',
        variant: 'audit',
        rows: [
          { t: '8:05 AM', p: 'Notes agent compiled the final-round brief' },
          { t: 'Yesterday', p: 'Panel scorecards submitted · J. Whitfield, M. Okafor' },
          { t: 'Mon', p: 'Interview scheduling agent booked the final round · 2 reschedules handled' },
          { t: 'Last week', p: 'Resume screening agent shortlisted Meera · you approved' },
        ],
      },
    ],
  },
  rec2: {
    prompt: 'What’s on my plate today?',
    reply:
      'Three interviews, two evaluations, and one offer sign-off. The agent drafted both evaluation summaries; everything actionable is on the right.',
    cards: [
      {
        kind: 'list',
        label: 'Task list · today',
        rows: [
          { t: '10:30 · Technical · Jake Morrison', p: 'Backend Lead · question set attached', st: 'Interview', stc: 'mut' },
          { t: '3:00 · Final round · Meera Krishnan', p: 'Brief ready · tap her pinned view any time', st: 'Final', stc: 'info' },
          { t: '4:30 · Screens · two Backend Lead candidates', p: 'Agent-shortlisted this morning', st: 'Interview', stc: 'mut' },
        ],
      },
      {
        kind: 'list',
        label: 'Task list · waiting on you',
        rows: [
          {
            t: 'Assignment evaluation · R. Alvarez',
            p: 'Agent summary attached · your call decides',
            st: 'Pending',
            stc: 'warn',
            acts: [
              {
                act: 'approve',
                label: 'Advance',
                done: 'Advanced ✓',
                doneStatus: 'ok',
                toast: 'Advanced to panel · candidate notified',
                audit: 'You advanced R. Alvarez to panel',
              },
              {
                act: 'back',
                label: 'Decline',
                ghost: true,
                toast: 'Declined with feedback · template sent',
                audit: 'You declined R. Alvarez',
              },
            ],
          },
          {
            t: 'Assignment evaluation · T. Nakamura',
            p: 'Agent summary attached · borderline score',
            st: 'Pending',
            stc: 'warn',
            acts: [
              {
                act: 'approve',
                label: 'Advance',
                done: 'Advanced ✓',
                doneStatus: 'ok',
                toast: 'Advanced to panel · candidate notified',
                audit: 'You advanced T. Nakamura to panel',
              },
            ],
          },
          {
            t: 'Offer · Product Analyst',
            p: 'Compensation approved · needs your sign-off',
            st: 'Sign-off',
            stc: 'warn',
            acts: [
              {
                act: 'approve',
                label: 'Sign off',
                done: 'Signed ✓',
                doneStatus: 'ok',
                toast: 'Offer released · e-sign sent to candidate',
                audit: 'You signed the Product Analyst offer',
                chat: 'Offer released. The e-sign went out, and the start-date workflow kicks off when it comes back.',
              },
            ],
          },
        ],
      },
      {
        kind: 'list',
        label: 'Assignment & audit history',
        variant: 'audit',
        rows: [
          { t: '7:58 AM', p: 'Screening agent processed 18 overnight resumes · 5 shortlisted' },
          { t: 'Yesterday', p: 'You approved 2 shortlists · 9 candidates advanced' },
          { t: 'Yesterday', p: 'Scheduling agent rebooked J. Kim’s panel · conflict resolved' },
        ],
      },
    ],
  },
  rec3: {
    prompt: 'Screen the new resumes for Backend Lead.',
    reply:
      'Handed to the Resume Screening agent: 18 resumes against the Backend Lead rubric. The shortlist lands in your review queue; nothing advances without you.',
    cards: [
      {
        kind: 'kpis',
        items: [
          ['18', 'resumes queued'],
          ['~9 min', 'estimated'],
          ['0', 'auto-advanced'],
          ['92%', 'precision · last 30 days'],
        ],
      },
      {
        kind: 'steps',
        label: 'Agent run · Resume Screening #142',
        items: [
          { state: 'done', t: 'Rubric loaded', sub: 'Backend Lead v3 · updated by you last week' },
          { state: 'run', t: 'Parsing and scoring 18 resumes', sub: '7 of 18 complete' },
          { state: 'todo', t: 'Shortlist with reasoning', sub: 'Lands in your review queue' },
          { state: 'todo', t: 'Your review', sub: 'Approve, reject, or edit each recommendation' },
        ],
      },
      {
        kind: 'list',
        label: 'Assignment & audit history',
        variant: 'audit',
        rows: [
          { t: 'Just now', p: 'You started Resume Screening run #142 · 18 resumes' },
          { t: 'This week', p: 'Runs #139–141 · 41 resumes · 11 shortlisted · all reviewed by you' },
          { t: 'Note', p: 'This step runs on approval-loop autonomy; you can dial it up to standing rules any time' },
        ],
      },
    ],
  },

  /* ---------- Regulatory Consultant ---------- */
  reg1: {
    prompt: 'Open the California Q2 filing.',
    reply:
      'CA-2026-Q2 is in review, due July 18. The whole filing is on the right: eight line items against the Q1 baseline, evidence, the comment chain, and the lifecycle. One line is flagged and two comments are open; every action is live, and submission stays with you.',
    cards: [
      {
        kind: 'kpis',
        items: [
          ['9 days', 'to deadline · July 18'],
          ['1', 'flagged line item'],
          ['2', 'open comments'],
          ['11 / 12', 'evidence documents'],
        ],
      },
      {
        kind: 'steps',
        label: 'Workflow · filing lifecycle',
        items: [
          { state: 'done', t: 'Data pull', sub: 'Billing, licensing, prior filings · Filing Prep agent' },
          { state: 'done', t: 'Draft generated', sub: 'v2 · exact CPUC submission format' },
          { state: 'warn', t: 'Self-check', sub: '1 flag · Line 4 vs. Q1 baseline' },
          { state: 'run', t: 'Review', sub: 'Owner: you · SLA July 15' },
          { state: 'todo', t: 'Submission', sub: 'Human-confirmed, always' },
        ],
      },
      {
        kind: 'list',
        label: 'Task view · Filing CA-2026-Q2',
        rows: [
          { t: 'State: REVIEW', p: 'CPUC quarterly return · entered review Tuesday, 9:04 AM', st: 'On track', stc: 'ok' },
          { t: 'Assignment', p: 'Owner: you · preparer: Filing Prep agent · reviewer: A. Romero', st: 'You', stc: 'info' },
          {
            t: 'Your decision',
            p: 'Approve to queue for submission · the filing itself never leaves your control',
            st: 'Pending',
            stc: 'warn',
            acts: [
              {
                act: 'approve',
                label: 'Approve & queue',
                done: 'Queued ✓',
                doneStatus: 'ok',
                toast: 'Queued for submission · final confirm stays with you',
                audit: 'You approved CA-2026-Q2 for submission',
                chat: 'CA-2026-Q2 is queued. The submission step never leaves the approval loop: it files only when you confirm.',
              },
              {
                act: 'back',
                label: 'Send back to draft',
                ghost: true,
                toast: 'Returned to draft · Filing Prep agent notified',
                audit: 'You sent CA-2026-Q2 back to draft',
              },
            ],
          },
        ],
      },
      {
        kind: 'list',
        label: 'Evidence · 12 documents',
        rows: [
          { t: 'Schedules A–D', p: 'Generated and validated by the Filing Prep agent', st: 'Validated', stc: 'ok' },
          { t: 'Revenue certification', p: 'Signed copy attached by S. Patel', st: 'Attached', stc: 'ok' },
          { t: 'Q1 filed return', p: 'Reference copy · baseline for the delta checks', st: 'Attached', stc: 'ok' },
          {
            t: 'Bank certificate',
            p: 'Treasury · requested twice · outstanding',
            st: 'Missing',
            stc: 'warn',
            acts: [
              {
                act: 'escalate',
                label: 'Request again',
                toast: 'Request sent to treasury · escalates to their lead at T-5',
                audit: 'You re-requested the bank certificate · treasury notified',
              },
            ],
          },
        ],
      },
      {
        kind: 'table',
        label: 'Filing report · CA-2026-Q2 line items',
        cols: ['Line item', 'Q2 value', 'Q1 baseline', 'Δ', ''],
        rows: [
          {
            cells: ['Intrastate revenue', '$2.41M', '$2.36M', '+2.3%'],
            sub: ['Line 4 · from billing export'],
            flag: true,
            st: 'Check',
            stc: 'warn',
            acts: [
              {
                act: 'approve',
                label: 'Accept',
                done: 'Accepted ✓',
                doneStatus: 'ok',
                toast: 'Delta accepted · June rate change cited in the filing note',
                audit: 'You accepted the Line 4 revenue delta',
              },
            ],
          },
          { cells: ['Local exchange revenue', '$1.62M', '$1.60M', '+1.2%'], sub: ['Line 5 · from billing export'], st: 'Ties', stc: 'ok' },
          { cells: ['Toll revenue', '$312K', '$329K', '−5.2%'], sub: ['Line 6 · seasonal dip, see workpaper W-6'], st: 'Noted', stc: 'mut' },
          { cells: ['Access lines', '18,240', '18,105', '+0.7%'], sub: ['Line 7 · from provisioning'], st: 'Ties', stc: 'ok' },
          { cells: ['Interstate allocation', '$1.13M', '$1.10M', '+2.7%'], sub: ['Line 9 · computed'], st: 'Ties', stc: 'ok' },
          { cells: ['USF contribution', '$96,400', '$94,200', '+2.3%'], sub: ['Line 12 · computed from Line 4'], st: 'Recomputed', stc: 'info' },
          { cells: ['Regulatory user fees', '$8,120', '$8,120', '0.0%'], sub: ['Line 14 · fixed schedule'], st: 'Ties', stc: 'ok' },
          { cells: ['Attachments', '9 of 9', 'n/a', 'n/a'], sub: ['Schedules A-D, certifications'], st: 'Validated', stc: 'ok' },
        ],
      },
      {
        kind: 'form',
        label: 'Form · filing note · Line 4',
        intro: 'A filing note is required whenever a line item deviates from baseline by more than 2%. The agent drafted it; the words that get filed are yours.',
        fields: [
          { label: 'Line item', value: 'Line 4 · Intrastate revenue', prefilled: true },
          { label: 'Deviation', value: '+2.3% vs. Q1 baseline', prefilled: true, hint: 'Exceeds the 2.0% note threshold' },
          { label: 'Cause', value: 'Rate change', type: 'select' },
          {
            label: 'Note to the commission',
            value: 'Increase reflects the June 2026 intrastate rate adjustment filed under Advice Letter 4412-G.',
            type: 'textarea',
            prefilled: true,
          },
        ],
        submit: {
          act: 'approve',
          label: 'Attach note to filing',
          done: 'Attached ✓',
          doneStatus: 'ok',
          toast: 'Filing note attached to Line 4 · included in the submission package',
          audit: 'You attached the Line 4 filing note · CA-2026-Q2',
        },
      },
      {
        kind: 'list',
        label: 'Comment thread · CA-2026-Q2',
        variant: 'thread',
        reply: true,
        rows: [
          {
            ini: 'AR',
            t: 'A. Romero · Reviewer',
            time: '2d ago',
            p: '“Line 4 doesn’t tie to the billing export. Recheck before this goes anywhere.”',
            st: 'Open',
            stc: 'warn',
            acts: [
              {
                act: 'resolve',
                label: 'Resolve',
                ghost: true,
                done: 'Resolved ✓',
                doneStatus: 'ok',
                toast: 'Resolved · A. Romero notified',
                audit: 'You resolved A. Romero’s Line 4 comment',
              },
            ],
          },
          {
            ini: 'SP',
            t: 'S. Patel · Compliance',
            time: 'yesterday',
            p: '“License references updated to the 2026 format across all schedules.”',
            st: 'Resolved',
            stc: 'ok',
          },
          {
            ini: 'MC',
            t: 'M. Chen · Analyst',
            time: 'yesterday',
            p: '“Toll revenue dip is seasonal; workpaper W-6 documents the pattern for the last three years.”',
            st: 'Resolved',
            stc: 'ok',
          },
          {
            ini: 'AG',
            t: 'Filing Prep agent',
            time: 'today, 7:40 AM',
            p: 'Regenerated Line 4 from the billing source. The delta is a June rate change; supporting rows are linked.',
            st: 'Open',
            stc: 'warn',
            acts: [
              {
                act: 'resolve',
                label: 'Resolve',
                ghost: true,
                done: 'Resolved ✓',
                doneStatus: 'ok',
                toast: 'Resolved · noted in the filing record',
                audit: 'You resolved the Filing Prep agent’s note',
              },
            ],
          },
        ],
      },
      {
        kind: 'list',
        label: 'Workflow SLAs · this filing',
        rows: [
          { t: 'Evidence complete', p: 'Target July 11 · one document outstanding', st: 'Watch', stc: 'warn' },
          { t: 'Review complete', p: 'Target July 15 · owner: you', st: 'You', stc: 'info' },
          { t: 'Submission', p: 'July 18 · T-3 trigger warms up Wednesday', st: 'Locked to human', stc: 'info' },
        ],
      },
      {
        kind: 'list',
        label: 'Assignment & audit history',
        variant: 'audit',
        rows: [
          { t: '7:40 AM', p: 'Filing Prep agent regenerated the draft · v2 · Line 4 corrected' },
          { t: 'Yesterday', p: 'S. Patel resolved the license-format comment' },
          { t: 'Yesterday', p: 'M. Chen attached workpaper W-6 · toll revenue seasonality' },
          { t: 'Tuesday', p: 'Review assigned to you · SLA timer started' },
          { t: 'Monday', p: 'Agent pulled source data from billing, licensing, prior filings' },
        ],
      },
    ],
  },
  reg2: {
    prompt: 'What deadlines are coming up?',
    reply:
      'Four in the next three weeks. California is closest at nine days and is already in your review; drafts exist for all four.',
    cards: [
      {
        kind: 'kpis',
        items: [
          ['4', 'due in 21 days'],
          ['4', 'drafts ready'],
          ['0', 'overdue'],
          ['12', 'filings tracked'],
        ],
      },
      {
        kind: 'table',
        label: 'Filing calendar · next 21 days',
        cols: ['Filing', 'Agency', 'Due', 'Owner', ''],
        rows: [
          { cells: ['CA-2026-Q2', 'California PUC', 'July 18', 'You'], sub: ['Quarterly return'], st: 'In review', stc: 'warn' },
          { cells: ['FCC 499-Q', 'FCC', 'July 22', 'You'], sub: ['Quarterly worksheet'], st: 'Self-check', stc: 'info' },
          { cells: ['NY-2026-Q2', 'New York PSC', 'July 25', 'M. Chen'], sub: ['Assessment report'], st: 'Drafted', stc: 'mut' },
          { cells: ['TX-2026-Q2', 'Texas PUC', 'July 29', 'M. Chen'], sub: ['Quarterly return'], st: 'Drafted', stc: 'mut' },
        ],
      },
      {
        kind: 'list',
        label: 'Assignment & audit history',
        variant: 'audit',
        rows: [
          { t: 'Overnight', p: 'Filing Prep agent generated the TX draft · exact submission format' },
          { t: 'Yesterday', p: 'NY assessment reassigned to M. Chen · workload balancing' },
          { t: 'Rule', p: 'Every deadline has a T-14 and T-3 trigger · escalates to you on silence' },
        ],
      },
    ],
  },
  reg3: {
    prompt: 'Where is the FCC 499-Q draft?',
    reply:
      'Drafted and self-checked. One inconsistency is flagged against last quarter; accept the fix or send it back, and nothing files without your confirmation.',
    cards: [
      {
        kind: 'steps',
        label: 'Agent run · Filing Prep · FCC 499-Q',
        items: [
          { state: 'done', t: 'Data pulled from 3 systems', sub: 'Billing, licensing, prior filings' },
          { state: 'done', t: 'Draft generated', sub: 'v2 · exact submission format' },
          { state: 'warn', t: 'Self-check: 1 inconsistency flagged', sub: 'Line 115 revenue vs. Q1 baseline' },
          { state: 'todo', t: 'Your review and submission', sub: 'This step never leaves the approval loop' },
        ],
      },
      {
        kind: 'list',
        label: 'Task list · flagged for you',
        rows: [
          {
            t: 'Line 115 revenue differs 2.3% from Q1',
            p: 'Agent traced it to a June rate change · source rows linked',
            st: 'Check',
            stc: 'warn',
            acts: [
              {
                act: 'approve',
                label: 'Accept fix',
                done: 'Accepted ✓',
                doneStatus: 'ok',
                toast: 'Fix accepted · draft finalized for your review',
                audit: 'You accepted the Line 115 correction · FCC 499-Q',
              },
              {
                act: 'back',
                label: 'Send back',
                ghost: true,
                toast: 'Returned to the agent with your note',
                audit: 'You sent the 499-Q draft back for rework',
              },
            ],
          },
          { t: 'Attachments', p: '9 of 9 present and validated', st: 'Ready', stc: 'ok' },
        ],
      },
      {
        kind: 'list',
        label: 'Assignment & audit history',
        variant: 'audit',
        rows: [
          { t: '6:15 AM', p: 'Filing Prep agent completed self-check · 1 flag raised' },
          { t: 'Yesterday', p: 'Draft v1 discarded · source data refreshed after billing correction' },
          { t: 'Policy', p: 'Submission autonomy: approval-loop · unchanged since go-live' },
        ],
      },
    ],
  },
}

export const CANDIDATE = {
  initials: 'MK',
  name: 'Meera Krishnan',
  meta: 'Senior Backend Engineer · final round today, 3:00 PM',
  rounds: [
    { label: 'Screen', done: true },
    { label: 'Technical', done: true },
    { label: 'Panel', done: true },
    { label: 'Final · 3:00 PM', done: false },
  ],
  synthesis:
    'Strong system design across all three rounds. Panel flagged stakeholder communication: worth probing today.',
  actions: [
    {
      act: 'toast' as const,
      label: 'Open offer draft',
      toast: 'Offer draft opened · compensation pre-approved · your sign-off required',
      audit: 'You opened the offer draft · Meera Krishnan',
    },
    {
      act: 'toast' as const,
      label: 'Add question set',
      ghost: true,
      toast: 'Question set added to your 3:00 PM invite',
      audit: 'Final-round question set attached to the 3:00 PM interview',
    },
  ],
}
