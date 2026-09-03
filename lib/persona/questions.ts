// The persona elicitation model: the questions the site asks a visitor (or an
// agent asks its user) to tailor information to them. Questions BRANCH by
// track - a job seeker, a services buyer, and a product evaluator each get
// their own set - and the first question, when the track is unknown, decides
// the track. One model serves both surfaces: the WebMCP tools
// (get/answer_personalization_questions) and the chatbot's quick-reply chips.

import type { VisitorContext } from '@/lib/adaptiveSite'
import type { CareersFilters } from '@/lib/careers/roles'

export interface PersonaOption {
  value: string
  label: string
}

export interface PersonaQuestion {
  id: string
  question: string
  options: PersonaOption[]
}

/** What applying one answer does to the site. */
export interface PersonaAnswerEffect {
  patch?: Partial<VisitorContext>
  /** Filter the careers page (and go there) - careers-track answers use this. */
  careersFilters?: CareersFilters
  /** Render this page in place - product-track answers use this. */
  pageViewSlug?: string
}

interface PersonaQuestionDef extends PersonaQuestion {
  /** Answered already, judging by recorded answers or an already-set context field. */
  isAnswered: (context: VisitorContext, answers: Record<string, string>) => boolean
  apply: (value: string) => PersonaAnswerEffect
}

export type PersonaTrack = 'careers' | 'services' | 'products' | 'general'

const answered = (answers: Record<string, string>, id: string) => Boolean(answers[id])

const INTENT_QUESTION: PersonaQuestionDef = {
  id: 'intent',
  question: 'What brings you to Newtuple today?',
  options: [
    { value: 'services', label: "Exploring Newtuple's services" },
    { value: 'products', label: 'Looking at products & accelerators' },
    { value: 'careers', label: 'A career opportunity' },
    { value: 'general', label: 'Just researching' },
  ],
  isAnswered: (context, answers) => answered(answers, 'intent') || context.intent !== 'general',
  apply: (value) => {
    if (value === 'careers') return { patch: { intent: 'careers', role: 'Candidate' } }
    if (value === 'products') return { patch: { intent: 'products' } }
    if (value === 'services') return { patch: { intent: 'services' } }
    return { patch: { intent: 'general' } }
  },
}

const ROLE_QUESTION: PersonaQuestionDef = {
  id: 'role',
  question: "What's your role?",
  options: [
    { value: 'CIO', label: 'CIO / transformation leader' },
    { value: 'CTO', label: 'CTO / engineering leader' },
    { value: 'Data Leader', label: 'Data / analytics leader' },
    { value: 'Operations Leader', label: 'Operations leader' },
    { value: 'Founder', label: 'Founder / CEO' },
  ],
  isAnswered: (context, answers) => answered(answers, 'role') || context.role !== 'Unknown',
  apply: (value) => ({ patch: { role: value as VisitorContext['role'] } }),
}

const INDUSTRY_QUESTION: PersonaQuestionDef = {
  id: 'industry',
  question: 'Which industry are you in?',
  options: [
    { value: 'retail', label: 'Retail, CPG & distribution' },
    { value: 'financial services', label: 'Financial services' },
    { value: 'healthcare', label: 'Social care & healthcare' },
    { value: 'aviation', label: 'Aviation' },
    { value: 'agencies', label: 'Agencies' },
    { value: 'enterprise saas', label: 'Enterprise SaaS / other' },
  ],
  isAnswered: (context, answers) =>
    answered(answers, 'industry') || (context.industry !== 'general' && context.industry !== 'careers'),
  apply: (value) => {
    // Answering the industry question immediately shows that industry's page
    // in place - no one should have to ask for it to be rendered.
    const slugs: Record<string, string> = {
      retail: 'retail',
      'financial services': 'financial-services',
      healthcare: 'social-care-healthcare',
      aviation: 'aviation',
      agencies: 'agencies',
      'enterprise saas': 'newtuple-ai-apps',
    }
    return { patch: { industry: value }, pageViewSlug: slugs[value] }
  },
}

const GOAL_QUESTION: PersonaQuestionDef = {
  id: 'goal_area',
  question: 'What are you trying to improve first?',
  options: [
    { value: 'workflow-automation', label: 'Automating workflows & approvals' },
    { value: 'product-data', label: 'Product data & catalog operations' },
    { value: 'production-readiness', label: 'Getting AI safely into production' },
    { value: 'overall-transformation', label: 'Overall AI transformation' },
  ],
  isAnswered: (context, answers) => answered(answers, 'goal_area'),
  apply: (value) => {
    const goals: Record<string, string> = {
      'workflow-automation': 'Flowtuple workflow automation',
      'product-data': 'product-data automation',
      'production-readiness': 'production AI readiness',
      'overall-transformation': 'AI transformation',
    }
    return { patch: { goal: goals[value] ?? 'AI transformation' } }
  },
}

const BUYING_STAGE_QUESTION: PersonaQuestionDef = {
  id: 'buying_stage',
  question: 'Where are you in the process?',
  options: [
    { value: 'exploring', label: 'Just exploring' },
    { value: 'evaluating', label: 'Evaluating vendors' },
    { value: 'ready', label: 'Ready to start' },
    { value: 'implementation', label: 'Already implementing' },
  ],
  isAnswered: (context, answers) => answered(answers, 'buying_stage'),
  apply: (value) => ({ patch: { buying_stage: value as VisitorContext['buying_stage'] } }),
}

const TECH_DEPTH_QUESTION: PersonaQuestionDef = {
  id: 'technical_depth',
  question: 'How technical should we get?',
  options: [
    { value: 'low', label: 'Business overview' },
    { value: 'medium', label: 'Balanced' },
    { value: 'high', label: 'Technical deep dive' },
  ],
  isAnswered: (context, answers) => answered(answers, 'technical_depth'),
  apply: (value) => ({ patch: { technical_depth: value as VisitorContext['technical_depth'] } }),
}

const PRODUCT_AREA_QUESTION: PersonaQuestionDef = {
  id: 'product_area',
  question: 'Which problem area are you looking at?',
  options: [
    { value: 'evals', label: 'LLM evaluation & quality' },
    { value: 'multi-agent', label: 'Multi-agent & conversational AI' },
    { value: 'workflows', label: 'Human + agent workflows' },
    { value: 'voice', label: 'Voice AI' },
    { value: 'accelerators', label: 'GenAI accelerators / base apps' },
  ],
  isAnswered: (context, answers) => answered(answers, 'product_area'),
  apply: (value) => {
    const map: Record<string, { goal: string; slug: string }> = {
      evals: { goal: 'Gaugetuple evaluation readiness', slug: 'gaugetuple' },
      'multi-agent': { goal: 'Dialogtuple product fit', slug: 'dialogtuple' },
      workflows: { goal: 'Flowtuple workflow automation', slug: 'flowtuple' },
      voice: { goal: 'Uttertuple voice AI', slug: 'uttertuple' },
      accelerators: { goal: 'Newtuple product discovery', slug: 'genai-accelerators' },
    }
    const hit = map[value]
    if (!hit) return {}
    return { patch: { goal: hit.goal }, pageViewSlug: hit.slug }
  },
}

const CAREER_FOCUS_QUESTION: PersonaQuestionDef = {
  id: 'career_focus',
  question: 'Which kind of role are you looking for?',
  options: [
    { value: 'engineer', label: 'Engineering' },
    { value: 'business analyst', label: 'Business analysis' },
    { value: 'project manager', label: 'Project / program management' },
    { value: 'growth', label: 'Growth & operations' },
  ],
  isAnswered: (context, answers) => answered(answers, 'career_focus'),
  apply: (value) => ({
    patch: { goal: 'career opportunity' },
    careersFilters: { query: value },
  }),
}

const CAREER_LEVEL_QUESTION: PersonaQuestionDef = {
  id: 'career_level',
  question: 'How much experience do you have?',
  options: [
    { value: 'Junior', label: 'Early career' },
    { value: 'Mid-Level', label: 'Mid-level' },
    { value: 'Senior', label: 'Senior' },
  ],
  isAnswered: (context, answers) => answered(answers, 'career_level'),
  apply: (value) => ({ careersFilters: { level: value } }),
}

const TRACKS: Record<PersonaTrack, PersonaQuestionDef[]> = {
  careers: [CAREER_FOCUS_QUESTION, CAREER_LEVEL_QUESTION],
  services: [INDUSTRY_QUESTION, ROLE_QUESTION, GOAL_QUESTION, BUYING_STAGE_QUESTION],
  products: [PRODUCT_AREA_QUESTION, TECH_DEPTH_QUESTION, BUYING_STAGE_QUESTION],
  general: [ROLE_QUESTION, INDUSTRY_QUESTION],
}

const ALL_QUESTIONS: PersonaQuestionDef[] = [
  INTENT_QUESTION,
  ROLE_QUESTION,
  INDUSTRY_QUESTION,
  GOAL_QUESTION,
  BUYING_STAGE_QUESTION,
  TECH_DEPTH_QUESTION,
  PRODUCT_AREA_QUESTION,
  CAREER_FOCUS_QUESTION,
  CAREER_LEVEL_QUESTION,
]

export function personaTrack(context: VisitorContext): PersonaTrack {
  return context.intent
}

const asPublic = ({ id, question, options }: PersonaQuestionDef): PersonaQuestion => ({ id, question, options })

/**
 * The questions still worth asking this visitor, in order. The intent
 * question always comes first while the track is unknown; after that, only
 * the visitor's own track's unanswered questions - a job seeker is never
 * asked about buying stages, a CTO never about experience levels.
 */
export function missingPersonaQuestions(context: VisitorContext, answers: Record<string, string>): PersonaQuestion[] {
  if (!INTENT_QUESTION.isAnswered(context, answers)) {
    return [asPublic(INTENT_QUESTION)]
  }
  return TRACKS[personaTrack(context)]
    .filter((question) => !question.isAnswered(context, answers))
    .map(asPublic)
}

export interface AppliedPersonaAnswers {
  patch: Partial<VisitorContext>
  careersFilters: CareersFilters | null
  pageViewSlug: string | null
  applied: Record<string, string>
  invalid: string[]
}

/** Validate and merge a batch of {questionId: optionValue} answers into one combined effect. */
export function applyPersonaAnswers(answersInput: Record<string, unknown>): AppliedPersonaAnswers {
  const result: AppliedPersonaAnswers = { patch: {}, careersFilters: null, pageViewSlug: null, applied: {}, invalid: [] }

  for (const [id, raw] of Object.entries(answersInput ?? {})) {
    const def = ALL_QUESTIONS.find((question) => question.id === id)
    const value = String(raw ?? '')
    const option = def?.options.find((o) => o.value === value || o.label === value)
    if (!def || !option) {
      result.invalid.push(id)
      continue
    }
    const effect = def.apply(option.value)
    result.patch = { ...result.patch, ...effect.patch }
    if (effect.careersFilters) result.careersFilters = { ...(result.careersFilters ?? {}), ...effect.careersFilters }
    if (effect.pageViewSlug) result.pageViewSlug = effect.pageViewSlug
    result.applied[id] = option.value
  }

  return result
}
