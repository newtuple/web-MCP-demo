export const INDUSTRIES = ['retail', 'financial_services', 'healthcare', 'aviation', 'technology_saas', 'general'] as const
export const BUYER_ROLES = ['cio', 'cto', 'product_leader', 'ai_leader', 'engineering_leader', 'operations_leader'] as const
export const BUYER_STAGES = ['discovery', 'evaluation', 'pilot', 'scale'] as const
export const GOALS = [
  'customer_support',
  'document_processing',
  'workflow_automation',
  'ai_agents',
  'evaluation',
  'data_access',
  'application_development',
] as const
export const PRIORITIES = ['security', 'compliance', 'integration', 'speed', 'cost', 'accuracy', 'scale'] as const
export const COMPANY_SIZES = ['startup', 'mid_market', 'enterprise'] as const
export const DESIRED_ACTIONS = ['explore', 'view_cases', 'view_demo', 'review_architecture', 'contact_newtuple'] as const

export type Industry = (typeof INDUSTRIES)[number]
export type BuyerRole = (typeof BUYER_ROLES)[number]
export type BuyerStage = (typeof BUYER_STAGES)[number]
export type Goal = (typeof GOALS)[number]
export type Priority = (typeof PRIORITIES)[number]
export type CompanySize = (typeof COMPANY_SIZES)[number]
export type DesiredAction = (typeof DESIRED_ACTIONS)[number]

export interface BuyerContext {
  industry: Industry
  role: BuyerRole
  goals: Goal[]
  stage: BuyerStage
  priorities: Priority[]
  companySize?: CompanySize
  desiredAction: DesiredAction
}

export type HomepageSectionId =
  | 'hero'
  | 'manifesto'
  | 'paths'
  | 'case_studies'
  | 'client_logos'
  | 'partners'
  | 'testimonials'
  | 'accelerators'
  | 'architecture'
  | 'faq'
  | 'cta'

export interface PersonalizedHeadline {
  text: string
  bold: string
}

export interface PersonalizedNarrative {
  id: string
  badge: string
  headlines: PersonalizedHeadline[]
  description: string
}

export interface ArchitectureExample {
  id: string
  title: string
  description: string
  layers: string[]
}

export interface PersonalizedCta {
  id: string
  title: string
  description: string
  label: string
  href: string
}

export interface PersonalizedSectionCopy {
  pathsBefore: string
  pathsHighlight: string
  pathsAfter: string
  caseStudiesTitle: string
  caseStudiesAccent: string
  caseStudiesDescription: string
  demosTitle: string
  demosDescription: string
  demosActionLabel: string
  architectureEyebrow: string
  architectureTitle: string
  architectureDescription: string
  testimonialsTitle: string
  testimonialsDescription: string
  faqTitle: string
  secondaryActionLabel: string
  secondaryActionHref: string
}

export interface ExperienceManifest {
  version: 2
  experienceId: string
  audienceSummary: string
  context: BuyerContext
  narrative: PersonalizedNarrative
  caseStudySlugs: string[]
  demoIds: string[]
  architectureExamples: ArchitectureExample[]
  pathOrder: Array<'agents' | 'apps'>
  sectionCopy: PersonalizedSectionCopy
  testimonialIndustryOrder: string[]
  sectionOrder: HomepageSectionId[]
  cta: PersonalizedCta
  confidence: number
  reasons: string[]
}
