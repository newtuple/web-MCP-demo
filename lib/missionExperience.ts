import {
  generateAdaptiveSiteVariant,
  inferVisitorContext,
  normalizeVisitorContext,
  type VisitorContext,
  type VisitorIntent,
} from './adaptiveSite'

export type ExperienceLayout = 'command-center' | 'storyboard' | 'blueprint' | 'constellation'
export type ExperienceTheme = 'cyan' | 'amber' | 'emerald' | 'violet'
export type ExperienceSectionKind = 'outcome' | 'architecture' | 'proof'

export interface MissionExperience {
  context: VisitorContext
  build: {
    headline: string
    stages: string[]
    signals: string[]
  }
  ui: {
    layout: ExperienceLayout
    theme: ExperienceTheme
    eyebrow: string
    title: string
    summary: string
    navigation: Array<{ label: string; href: string }>
    journey: Array<{ label: string; detail: string }>
    metrics: Array<{ label: string; value: string; detail: string }>
    sections: Array<{
      kind: ExperienceSectionKind
      label: string
      title: string
      body: string
      bullets: string[]
    }>
    primaryCta: { label: string; href: string; rationale: string }
    secondaryCta: { label: string; href: string }
    proofKeywords: string[]
  }
}

const allowedLayouts: ExperienceLayout[] = ['command-center', 'storyboard', 'blueprint', 'constellation']
const allowedThemes: ExperienceTheme[] = ['cyan', 'amber', 'emerald', 'violet']
const allowedSectionKinds: ExperienceSectionKind[] = ['outcome', 'architecture', 'proof']
const allowedPaths = new Set([
  '/about-us', '/careers', '/contactus', '/dialogtuple', '/flowtuple', '/gaugetuple',
  '/genai-accelerators', '/life-at-newtuple', '/newtuple-agents', '/newtuple-ai-apps',
  '/retail', '/financial-services', '/social-care-healthcare', '/aviation', '/agencies',
])

const clean = (value: unknown, fallback: string, max = 180) => {
  const text = typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : ''
  return (text || fallback).slice(0, max)
}
const list = (value: unknown, fallback: string[], maxItems: number, maxLength = 90) => {
  if (!Array.isArray(value)) return fallback
  const result = value.map((item) => clean(item, '', maxLength)).filter(Boolean).slice(0, maxItems)
  return result.length ? result : fallback
}
const href = (value: unknown, fallback: string) => allowedPaths.has(String(value)) ? String(value) : fallback

const defaultLayout = (intent: VisitorIntent): ExperienceLayout =>
  intent === 'products' ? 'constellation' : intent === 'careers' ? 'storyboard' : 'command-center'

const defaultTheme = (intent: VisitorIntent): ExperienceTheme =>
  intent === 'products' ? 'amber' : intent === 'careers' ? 'emerald' : 'cyan'

export function createFallbackMissionExperience(statement: string, suppliedContext?: VisitorContext): MissionExperience {
  const context = suppliedContext ? normalizeVisitorContext(suppliedContext) : inferVisitorContext(statement)
  const variant = generateAdaptiveSiteVariant(context)
  const stack = context.systems.length ? context.systems.join(' + ') : 'existing stack'
  const career = context.intent === 'careers'
  const product = context.intent === 'products'
  const outcome = career ? 'Find the role where your craft has the most leverage' : product ? `Choose the shortest product path to ${context.goal}` : `Turn ${context.goal} into a measurable first move`

  return {
    context,
    build: {
      headline: `Composing a ${career ? 'candidate' : product ? 'product' : 'delivery'} surface`,
      stages: career ? ['Read skills signal', 'Map team fit', 'Select role proof', 'Compose application route'] : product ? ['Read product need', 'Match capabilities', 'Select evaluation proof', 'Compose demo route'] : ['Read business signal', 'Map stack reality', 'Select relevant proof', 'Compose pilot route'],
      signals: [context.intent, context.industry, stack, context.buying_stage],
    },
    ui: {
      layout: defaultLayout(context.intent),
      theme: defaultTheme(context.intent),
      eyebrow: variant.hero.eyebrow,
      title: variant.hero.title,
      summary: variant.hero.description,
      navigation: variant.navigation.slice(0, 4),
      journey: career
        ? [{ label: 'Role fit', detail: 'Match strengths to current opportunities' }, { label: 'Team signal', detail: 'Understand how the team builds' }, { label: 'Apply route', detail: 'Move forward with useful context' }]
        : product
          ? [{ label: 'Need scan', detail: context.goal }, { label: 'Capability map', detail: `Fit against ${stack}` }, { label: 'Evaluation route', detail: 'Reach a confident product decision' }]
          : [{ label: 'Outcome', detail: context.goal }, { label: 'Architecture', detail: `Work with ${stack}` }, { label: 'Pilot', detail: context.buying_stage === 'implementation' ? 'Build a rollout plan' : 'Prove value in 14 days' }],
      metrics: career
        ? [{ label: 'Primary signal', value: 'Role fit', detail: context.goal }, { label: 'Context', value: 'Team + craft', detail: 'Culture and working model' }, { label: 'Next move', value: 'Apply', detail: 'Human-controlled handoff' }]
        : [{ label: 'Mission', value: context.goal, detail: `${context.industry} priority` }, { label: 'Stack', value: stack, detail: `${context.technical_depth} technical depth` }, { label: 'Delivery', value: context.buying_stage === 'implementation' ? 'Rollout' : 'Pilot', detail: `${context.buying_stage} buying stage` }],
      sections: [
        { kind: 'outcome', label: career ? 'Opportunity' : 'Business impact', title: outcome, body: career ? 'This path prioritizes role relevance, team context, and a clear application decision.' : `The experience is organized around ${context.goal}, not a generic catalogue of services.`, bullets: career ? ['Relevant role families', 'Team operating model', 'Application readiness'] : ['Define one measurable outcome', 'Expose the decision owner', 'Choose a testable first scope'] },
        { kind: 'architecture', label: career ? 'Working model' : 'System design', title: career ? 'See how your work connects to the team' : `A practical route through ${stack}`, body: career ? 'Explore the craft, collaboration model, and expectations before applying.' : `Prioritize integration boundaries, evaluation, observability, and human control at ${context.technical_depth} depth.`, bullets: career ? ['Craft expectations', 'Collaboration signals', 'Growth path'] : [`Integrate with ${stack}`, 'Measure quality before rollout', 'Keep approvals explicit'] },
        { kind: 'proof', label: 'Selected evidence', title: career ? 'Work that shows the team’s ambition' : 'Proof relevant to this mission', body: 'Use approved Newtuple work as evidence. Do not invent client outcomes or unsupported performance claims.', bullets: variant.caseStudySlugs.slice(0, 3) },
      ],
      primaryCta: { ...variant.primaryCta, rationale: career ? 'Continue when the role and team fit are clear.' : `The next action matches a ${context.buying_stage} visitor.` },
      secondaryCta: variant.secondaryCta,
      proofKeywords: [context.industry, context.goal, ...context.systems].slice(0, 4),
    },
  }
}

export function normalizeMissionExperience(input: unknown, fallback: MissionExperience): MissionExperience {
  const raw = input && typeof input === 'object' ? input as Record<string, any> : {}
  const rawUi = raw.ui && typeof raw.ui === 'object' ? raw.ui as Record<string, any> : {}
  const rawBuild = raw.build && typeof raw.build === 'object' ? raw.build as Record<string, any> : {}
  const context = normalizeVisitorContext(raw.context && typeof raw.context === 'object' ? raw.context : fallback.context)

  const navigation = Array.isArray(rawUi.navigation) ? rawUi.navigation.slice(0, 5).map((item: any, index: number) => ({
    label: clean(item?.label, fallback.ui.navigation[index]?.label ?? 'Explore', 40),
    href: href(item?.href, fallback.ui.navigation[index]?.href ?? '/newtuple-agents'),
  })) : fallback.ui.navigation

  const journey = Array.isArray(rawUi.journey) ? rawUi.journey.slice(0, 4).map((item: any, index: number) => ({
    label: clean(item?.label, fallback.ui.journey[index]?.label ?? 'Next', 45),
    detail: clean(item?.detail, fallback.ui.journey[index]?.detail ?? context.goal, 120),
  })) : fallback.ui.journey

  const metrics = Array.isArray(rawUi.metrics) ? rawUi.metrics.slice(0, 4).map((item: any, index: number) => ({
    label: clean(item?.label, fallback.ui.metrics[index]?.label ?? 'Signal', 40),
    value: clean(item?.value, fallback.ui.metrics[index]?.value ?? context.goal, 80),
    detail: clean(item?.detail, fallback.ui.metrics[index]?.detail ?? 'Generated for this mission', 120),
  })) : fallback.ui.metrics

  const sections = allowedSectionKinds.map((kind, index) => {
    const match = Array.isArray(rawUi.sections) ? rawUi.sections.find((item: any) => item?.kind === kind) : null
    const base = fallback.ui.sections.find((section) => section.kind === kind) ?? fallback.ui.sections[index]
    return {
      kind,
      label: clean(match?.label, base.label, 45),
      title: clean(match?.title, base.title, 120),
      body: clean(match?.body, base.body, 360),
      bullets: list(match?.bullets, base.bullets, 4, 110),
    }
  })

  return {
    context,
    build: {
      headline: clean(rawBuild.headline, fallback.build.headline, 100),
      stages: list(rawBuild.stages, fallback.build.stages, 4, 65),
      signals: list(rawBuild.signals, fallback.build.signals, 5, 65),
    },
    ui: {
      layout: allowedLayouts.includes(rawUi.layout) ? rawUi.layout : fallback.ui.layout,
      theme: allowedThemes.includes(rawUi.theme) ? rawUi.theme : fallback.ui.theme,
      eyebrow: clean(rawUi.eyebrow, fallback.ui.eyebrow, 80),
      title: clean(rawUi.title, fallback.ui.title, 140),
      summary: clean(rawUi.summary, fallback.ui.summary, 320),
      navigation: navigation.length ? navigation : fallback.ui.navigation,
      journey: journey.length ? journey : fallback.ui.journey,
      metrics: metrics.length ? metrics : fallback.ui.metrics,
      sections,
      primaryCta: {
        label: clean(rawUi.primaryCta?.label, fallback.ui.primaryCta.label, 45),
        href: href(rawUi.primaryCta?.href, fallback.ui.primaryCta.href),
        rationale: clean(rawUi.primaryCta?.rationale, fallback.ui.primaryCta.rationale, 180),
      },
      secondaryCta: {
        label: clean(rawUi.secondaryCta?.label, fallback.ui.secondaryCta.label, 45),
        href: href(rawUi.secondaryCta?.href, fallback.ui.secondaryCta.href),
      },
      proofKeywords: list(rawUi.proofKeywords, fallback.ui.proofKeywords, 5, 60),
    },
  }
}

const string = (maxLength: number) => ({ type: 'string', maxLength })
const strictObject = (properties: Record<string, unknown>, required = Object.keys(properties)) => ({ type: 'object', additionalProperties: false, properties, required })
const fixedArray = (items: unknown, minItems: number, maxItems = minItems) => ({ type: 'array', items, minItems, maxItems })

export const missionExperienceSchema = strictObject({
  context: strictObject({
    intent: { type: 'string', enum: ['general', 'services', 'products', 'careers'] },
    industry: string(60),
    role: { type: 'string', enum: ['CIO', 'CTO', 'Data Leader', 'Operations Leader', 'Founder', 'Candidate', 'Unknown'] },
    systems: fixedArray(string(50), 0, 6),
    goal: string(120),
    technical_depth: { type: 'string', enum: ['low', 'medium', 'high'] },
    buying_stage: { type: 'string', enum: ['exploring', 'evaluating', 'ready', 'implementation'] },
  }),
  build: strictObject({ headline: string(100), stages: fixedArray(string(65), 4), signals: fixedArray(string(65), 4, 5) }),
  ui: strictObject({
    layout: { type: 'string', enum: allowedLayouts },
    theme: { type: 'string', enum: allowedThemes },
    eyebrow: string(80),
    title: string(140),
    summary: string(320),
    navigation: fixedArray(strictObject({ label: string(40), href: { type: 'string', enum: Array.from(allowedPaths) } }), 3, 5),
    journey: fixedArray(strictObject({ label: string(45), detail: string(120) }), 3, 4),
    metrics: fixedArray(strictObject({ label: string(40), value: string(80), detail: string(120) }), 3, 4),
    sections: fixedArray(strictObject({ kind: { type: 'string', enum: allowedSectionKinds }, label: string(45), title: string(120), body: string(360), bullets: fixedArray(string(110), 3, 4) }), 3),
    primaryCta: strictObject({ label: string(45), href: { type: 'string', enum: Array.from(allowedPaths) }, rationale: string(180) }),
    secondaryCta: strictObject({ label: string(45), href: { type: 'string', enum: Array.from(allowedPaths) } }),
    proofKeywords: fixedArray(string(60), 3, 5),
  }),
})
