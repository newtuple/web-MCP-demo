import {
  ARCHITECTURES,
  CASE_STUDY_CATALOG,
  CTAS,
  DEFAULT_SECTION_ORDER,
  DEMOS,
  FINANCIAL_PRODUCT_SECTION_ORDER,
  NARRATIVES,
  RETAIL_CIO_SECTION_ORDER,
  type TaggedContent,
} from './catalog'
import {
  BUYER_ROLES,
  BUYER_STAGES,
  COMPANY_SIZES,
  DESIRED_ACTIONS,
  GOALS,
  INDUSTRIES,
  PRIORITIES,
  type BuyerContext,
  type ExperienceManifest,
  type HomepageSectionId,
} from './types'

const includesValue = <T extends string>(values: readonly T[], value: unknown): value is T =>
  typeof value === 'string' && values.includes(value as T)

const parseArray = <T extends string>(name: string, value: unknown, allowed: readonly T[]): T[] => {
  if (!Array.isArray(value)) throw new Error(`${name} must be an array.`)
  const result = Array.from(new Set(value.map(item => {
    if (!includesValue(allowed, item)) throw new Error(`${name} contains an unsupported value.`)
    return item
  })))
  if (result.length === 0) throw new Error(`${name} must contain at least one value.`)
  return result
}

export function parseBuyerContext(value: unknown): BuyerContext {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Buyer context must be an object.')
  }

  const input = value as Record<string, unknown>
  if (!includesValue(INDUSTRIES, input.industry)) throw new Error('industry is not supported.')
  if (!includesValue(BUYER_ROLES, input.role)) throw new Error('role is not supported.')
  if (!includesValue(BUYER_STAGES, input.stage)) throw new Error('stage is not supported.')
  if (!includesValue(DESIRED_ACTIONS, input.desiredAction)) throw new Error('desiredAction is not supported.')
  if (input.companySize !== undefined && !includesValue(COMPANY_SIZES, input.companySize)) {
    throw new Error('companySize is not supported.')
  }

  return {
    industry: input.industry,
    role: input.role,
    goals: parseArray('goals', input.goals, GOALS),
    stage: input.stage,
    priorities: parseArray('priorities', input.priorities, PRIORITIES),
    companySize: input.companySize,
    desiredAction: input.desiredAction,
  }
}

function scoreContent(item: TaggedContent, context: BuyerContext): number {
  const industryScore = item.industries.includes(context.industry) ? 8 : item.industries.includes('general') ? 2 : 0
  const roleScore = item.roles.includes(context.role) ? 5 : 0
  const goalScore = context.goals.filter(goal => item.goals.includes(goal)).length * 4
  const priorityScore = context.priorities.filter(priority => item.priorities.includes(priority)).length * 2
  return industryScore + roleScore + goalScore + priorityScore
}

function selectTop<T extends TaggedContent>(items: T[], context: BuyerContext, limit: number): T[] {
  return items
    .map((item, index) => ({ item, index, score: scoreContent(item, context) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map(result => result.item)
}

function getSectionOrder(context: BuyerContext): HomepageSectionId[] {
  if (context.industry === 'retail' && context.role === 'cio') return RETAIL_CIO_SECTION_ORDER
  if (context.industry === 'financial_services' && context.role === 'product_leader') return FINANCIAL_PRODUCT_SECTION_ORDER
  return DEFAULT_SECTION_ORDER
}

function makeExperienceId(context: BuyerContext): string {
  const primaryGoal = context.goals[0]
  return `${context.industry}-${context.role}-${context.stage}-${primaryGoal}-v1`
}

function makeAudienceSummary(context: BuyerContext): string {
  const industry = context.industry === 'financial_services' ? 'financial services' : context.industry
  const role = context.role.replaceAll('_', ' ')
  return `${context.companySize ? `${context.companySize.replaceAll('_', ' ')} ` : ''}${industry} ${role} in the ${context.stage} stage`
}

function calculateConfidence(context: BuyerContext, narrativeScore: number): number {
  const industry = context.industry === 'general' ? 0.12 : 0.24
  const contextDepth = Math.min(context.goals.length * 0.06 + context.priorities.length * 0.04, 0.3)
  const role = 0.18
  const stageAndAction = 0.14
  const match = Math.min(narrativeScore / 100, 0.09)
  return Number(Math.min(industry + contextDepth + role + stageAndAction + match, 0.96).toFixed(2))
}

export function buildExperienceManifest(value: unknown): ExperienceManifest {
  const context = parseBuyerContext(value)
  const narrative = selectTop(NARRATIVES, context, 1)[0]
  const caseStudies = selectTop(CASE_STUDY_CATALOG, context, 4)
  const demos = selectTop(DEMOS, context, 2)
  const architectures = selectTop(ARCHITECTURES, context, 2)
  const cta = CTAS.find(item => item.actions.includes(context.desiredAction)) ?? CTAS[CTAS.length - 1]
  const narrativeScore = scoreContent(narrative, context)

  const reasons = [
    `${context.industry.replaceAll('_', ' ')} matched the selected narrative and examples.`,
    `${context.role.replaceAll('_', ' ')} changed the content priority and section order.`,
    `${context.desiredAction.replaceAll('_', ' ')} selected the final call to action.`,
  ]

  return {
    version: 1,
    experienceId: makeExperienceId(context),
    audienceSummary: makeAudienceSummary(context),
    context,
    narrative: {
      id: narrative.id,
      badge: narrative.badge,
      headlines: narrative.headlines,
      description: narrative.description,
    },
    caseStudySlugs: caseStudies.map(item => item.slug),
    demoIds: demos.map(item => item.id),
    architectureExamples: architectures.map(({ id, title, description, layers }) => ({ id, title, description, layers })),
    sectionOrder: getSectionOrder(context),
    cta: {
      id: cta.id,
      title: cta.title,
      description: cta.description,
      label: cta.label,
      href: cta.href,
    },
    confidence: calculateConfidence(context, narrativeScore),
    reasons,
  }
}

export function isExperienceManifest(value: unknown): value is ExperienceManifest {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const manifest = value as Partial<ExperienceManifest>
  return manifest.version === 1
    && typeof manifest.experienceId === 'string'
    && Array.isArray(manifest.sectionOrder)
    && manifest.sectionOrder[0] === 'hero'
    && manifest.sectionOrder[manifest.sectionOrder.length - 1] === 'cta'
    && Array.isArray(manifest.caseStudySlugs)
    && Array.isArray(manifest.demoIds)
    && Array.isArray(manifest.architectureExamples)
    && Boolean(manifest.narrative)
    && Boolean(manifest.cta)
}

export function getPersonalizationCapabilities() {
  return {
    industries: INDUSTRIES,
    roles: BUYER_ROLES,
    stages: BUYER_STAGES,
    goals: GOALS,
    priorities: PRIORITIES,
    companySizes: COMPANY_SIZES,
    desiredActions: DESIRED_ACTIONS,
    tools: [
      'get_personalization_capabilities',
      'preview_personalized_experience',
      'apply_personalized_experience',
      'get_current_experience',
      'reset_personalized_experience',
      'submit_experience_feedback',
    ],
  }
}
