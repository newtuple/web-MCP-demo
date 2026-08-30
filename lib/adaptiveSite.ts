export type VisitorIntent = 'general' | 'services' | 'products' | 'careers'
export type VisitorRole = 'CIO' | 'CTO' | 'Data Leader' | 'Operations Leader' | 'Founder' | 'Candidate' | 'Unknown'
export type TechnicalDepth = 'low' | 'medium' | 'high'
export type BuyingStage = 'exploring' | 'evaluating' | 'ready' | 'implementation'

export interface VisitorContext {
  intent: VisitorIntent
  industry: string
  role: VisitorRole
  systems: string[]
  goal: string
  technical_depth: TechnicalDepth
  buying_stage: BuyingStage
}

export interface AdaptiveNavItem {
  label: string
  href: string
}

export interface AdaptiveSiteVariant {
  context: VisitorContext
  intent: VisitorIntent
  isPersonalized: boolean
  adaptationSummary: string
  reasonForVisitor: string
  navigation: AdaptiveNavItem[]
  hero: {
    eyebrow: string
    title: string
    description: string
  }
  primaryCta: { label: string; href: string }
  secondaryCta: { label: string; href: string }
  caseStudySlugs: string[]
  caseStudyHref: string
  suggestedPrompts: string[]
}

export const DEFAULT_VISITOR_CONTEXT: VisitorContext = {
  intent: 'general',
  industry: 'general',
  role: 'Unknown',
  systems: [],
  goal: 'AI transformation',
  technical_depth: 'medium',
  buying_stage: 'exploring',
}

export const VISITOR_CONTEXT_STORAGE_KEY = 'newtuple:visitor-context:v3'
export const VISITOR_CONTEXT_EVENT = 'newtuple-visitor-context-change'

const cleanUnique = (items: string[]) => Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)))
const includesAny = (value: string, keywords: string[]) => keywords.some((keyword) => value.includes(keyword))

const validIntents: VisitorIntent[] = ['general', 'services', 'products', 'careers']
const validRoles: VisitorRole[] = ['CIO', 'CTO', 'Data Leader', 'Operations Leader', 'Founder', 'Candidate', 'Unknown']
const validTechnicalDepths: TechnicalDepth[] = ['low', 'medium', 'high']
const validBuyingStages: BuyingStage[] = ['exploring', 'evaluating', 'ready', 'implementation']

const pickValid = <T extends string>(value: unknown, validValues: T[], fallback: T): T =>
  validValues.includes(value as T) ? (value as T) : fallback

export function normalizeVisitorContext(input: Partial<VisitorContext> = {}): VisitorContext {
  return {
    intent: pickValid(input.intent, validIntents, DEFAULT_VISITOR_CONTEXT.intent),
    industry: (input.industry || DEFAULT_VISITOR_CONTEXT.industry).trim().toLowerCase(),
    role: pickValid(input.role, validRoles, DEFAULT_VISITOR_CONTEXT.role),
    systems: cleanUnique(input.systems ?? DEFAULT_VISITOR_CONTEXT.systems),
    goal: (input.goal || DEFAULT_VISITOR_CONTEXT.goal).trim(),
    technical_depth: pickValid(input.technical_depth, validTechnicalDepths, DEFAULT_VISITOR_CONTEXT.technical_depth),
    buying_stage: pickValid(input.buying_stage, validBuyingStages, DEFAULT_VISITOR_CONTEXT.buying_stage),
  }
}

export function mergeVisitorContext(current: VisitorContext, patch: Partial<VisitorContext>): VisitorContext {
  return normalizeVisitorContext({
    ...current,
    ...patch,
    systems: patch.systems ? cleanUnique(patch.systems) : current.systems,
  })
}

const industrySlug: Record<string, string> = {
  retail: '/retail',
  'financial services': '/financial-services',
  healthcare: '/social-care-healthcare',
  aviation: '/aviation',
  agencies: '/agencies',
}

export function inferVisitorContext(statement: string): VisitorContext {
  const text = statement.toLowerCase()
  const systems = [
    ['sap', 'SAP'],
    ['inriver', 'Inriver'],
    ['pim', 'PIM'],
    ['shopify', 'Shopify'],
    ['salesforce', 'Salesforce'],
    ['servicenow', 'ServiceNow'],
    ['snowflake', 'Snowflake'],
    ['databricks', 'Databricks'],
    ['azure', 'Azure'],
    ['aws', 'AWS'],
    ['gcp', 'Google Cloud'],
    ['oracle', 'Oracle'],
    ['hubspot', 'HubSpot'],
    ['netsuite', 'NetSuite'],
  ]
    .filter(([keyword]) => text.includes(keyword))
    .map(([, label]) => label)

  let intent: VisitorIntent = 'services'
  if (includesAny(text, ['career', 'careers', 'job', 'jobs', 'opening', 'open role', 'join the team', 'hiring', 'interview', 'resume', 'apply'])) {
    intent = 'careers'
  } else if (includesAny(text, ['product', 'accelerator', 'platform', 'dialogtuple', 'flowtuple', 'gaugetuple', 'omnituple', 'ai app', 'sdk'])) {
    intent = 'products'
  } else if (includesAny(text, ['service', 'consulting', 'help', 'business', 'retail', 'finance', 'healthcare', 'automation', 'transformation'])) {
    intent = 'services'
  }

  let industry = intent === 'careers' ? 'careers' : 'general'
  if (includesAny(text, ['retail', 'commerce', 'merchandising', 'supplier', 'catalog', 'pim'])) {
    industry = 'retail'
  } else if (includesAny(text, ['bank', 'finance', 'financial', 'investment', 'insurance'])) {
    industry = 'financial services'
  } else if (includesAny(text, ['healthcare', 'social care', 'patient', 'clinic', 'hospital'])) {
    industry = 'healthcare'
  } else if (includesAny(text, ['aviation', 'airline', 'oem', 'aircraft'])) {
    industry = 'aviation'
  } else if (includesAny(text, ['agency', 'marketing', 'campaign'])) {
    industry = 'agencies'
  } else if (includesAny(text, ['saas', 'software', 'b2b platform'])) {
    industry = 'enterprise saas'
  }

  let role: VisitorRole = intent === 'careers' ? 'Candidate' : 'Unknown'
  if (includesAny(text, ['cio', 'digital transformation', 'transformation lead'])) {
    role = 'CIO'
  } else if (includesAny(text, ['cto', 'architecture', 'engineering lead', 'engineering'])) {
    role = 'CTO'
  } else if (includesAny(text, ['data leader', 'analytics', 'data science', 'data team'])) {
    role = 'Data Leader'
  } else if (includesAny(text, ['operations', 'ops lead', 'process'])) {
    role = 'Operations Leader'
  } else if (includesAny(text, ['founder', 'ceo', 'startup'])) {
    role = 'Founder'
  }
  if (intent === 'careers') role = 'Candidate'

  let goal = intent === 'careers' ? 'career opportunity' : 'AI transformation'
  if (intent === 'products') goal = 'Newtuple product discovery'
  if (includesAny(text, ['dialogtuple', 'chatbot', 'conversation', 'support agent'])) {
    goal = 'Dialogtuple product fit'
  } else if (includesAny(text, ['flowtuple', 'workflow', 'approval', 'human in the loop'])) {
    goal = 'Flowtuple workflow automation'
  } else if (includesAny(text, ['gaugetuple', 'eval', 'evaluation', 'quality scoring', 'llm quality'])) {
    goal = 'Gaugetuple evaluation readiness'
  } else if (includesAny(text, ['product data', 'product-data', 'pim', 'catalog', 'supplier onboarding', 'merchandising'])) {
    goal = 'product-data automation'
  } else if (includesAny(text, ['production', 'reliability', 'observability', 'secure', 'security'])) {
    goal = 'production AI readiness'
  } else if (includesAny(text, ['agent', 'workflow', 'automation'])) {
    goal = 'AI agent workflow automation'
  }

  // Keep the visitor's actual brief when the classifier cannot identify a named play.
  // This prevents unrelated prompts from collapsing into the same generic surface.
  const visitorBrief = statement.trim().replace(/\s+/g, ' ')
  if (visitorBrief && ['AI transformation', 'Newtuple product discovery', 'career opportunity'].includes(goal)) {
    goal = visitorBrief.slice(0, 120)
  }

  let buying_stage: BuyingStage = intent === 'careers' ? 'ready' : 'exploring'
  if (includesAny(text, ['shortlist', 'compare', 'vendor', 'evaluating'])) {
    buying_stage = 'evaluating'
  } else if (includesAny(text, ['start', 'proposal', 'quote', 'budget', 'timeline', 'apply', 'application'])) {
    buying_stage = 'ready'
  } else if (includesAny(text, ['implementing', 'rollout', 'migration', 'in production'])) {
    buying_stage = 'implementation'
  }

  let technical_depth: TechnicalDepth = 'medium'
  if (role === 'CTO' || includesAny(text, ['architecture', 'sdk', 'api', 'observability', 'security'])) {
    technical_depth = 'high'
  } else if (role === 'Founder' || intent === 'careers' || includesAny(text, ['overview', 'business case', 'roi'])) {
    technical_depth = 'low'
  }

  return normalizeVisitorContext({ intent, industry, role, systems, goal, technical_depth, buying_stage })
}

const titleCase = (value: string) =>
  value.split(' ').filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')

const roleName = (role: VisitorRole) => (role === 'Unknown' ? 'Leader' : role)

export function generateAdaptiveSiteVariant(context: VisitorContext): AdaptiveSiteVariant {
  const normalizedContext = normalizeVisitorContext(context)
  const personalized = normalizedContext.intent !== DEFAULT_VISITOR_CONTEXT.intent || normalizedContext.industry !== DEFAULT_VISITOR_CONTEXT.industry

  const industry = titleCase(normalizedContext.industry)
  const systemsLabel = normalizedContext.systems.length > 0 ? normalizedContext.systems.join(' + ') : null
  const audience = `${industry} ${roleName(normalizedContext.role)}`

  if (!personalized) {
    return {
      context: normalizedContext,
      intent: 'general',
      isPersonalized: false,
      adaptationSummary: '',
      reasonForVisitor: 'No visitor context set yet — this is the neutral entry screen.',
      navigation: [
        { label: 'Services', href: '/newtuple-agents' },
        { label: 'Products', href: '/genai-accelerators' },
        { label: 'Industries', href: '/retail' },
        { label: 'Company', href: '/about-us' },
        { label: 'Contact', href: '/contactus' },
      ],
      hero: {
        eyebrow: 'A website that rebuilds itself for every visitor',
        title: 'What are you trying to improve?',
        description: 'Tell Newtuple what you need. The page rebuilds around you, and the same context is exposed to agents through WebMCP.',
      },
      primaryCta: { label: 'Talk to Newtuple', href: '/contactus' },
      secondaryCta: { label: 'See open roles', href: '/careers' },
      caseStudySlugs: ['enterprise-saas-ai-agents', 'data-intelligence-platform', 'aviation-oem-agentic-data-access'],
      caseStudyHref: '/newtuple-agents',
      suggestedPrompts: [
        'I am responsible for digital transformation at a large retailer.',
        'Show me Newtuple products for a SaaS platform.',
        'I am looking for a career opportunity with the Newtuple team.',
      ],
    }
  }

  if (normalizedContext.intent === 'careers') {
    return {
      context: normalizedContext,
      intent: 'careers',
      isPersonalized: true,
      adaptationSummary: 'Newtuple.com has been adapted for Careers.',
      reasonForVisitor: 'Your prompt mentioned careers or joining the team, so navigation and the primary path now point to hiring.',
      navigation: [
        { label: 'Open Roles', href: '/careers' },
        { label: 'Life at Newtuple', href: '/life-at-newtuple' },
        { label: 'About Us', href: '/about-us' },
        { label: 'Apply', href: '/careers' },
      ],
      hero: {
        eyebrow: 'Careers',
        title: 'Find your place on the Newtuple team.',
        description: 'Candidate intent detected — open roles and team culture are the priority for this visit.',
      },
      primaryCta: { label: 'View open roles', href: '/careers' },
      secondaryCta: { label: 'See life at Newtuple', href: '/life-at-newtuple' },
      caseStudySlugs: ['enterprise-saas-ai-agents', 'anti-hallucination-platform'],
      caseStudyHref: '/newtuple-agents',
      suggestedPrompts: [
        'Show open roles for generative AI engineers.',
        'What is life at Newtuple like?',
        'I want to join the Newtuple team.',
      ],
    }
  }

  if (normalizedContext.intent === 'products') {
    return {
      context: normalizedContext,
      intent: 'products',
      isPersonalized: true,
      adaptationSummary: `Newtuple.com has been adapted for ${normalizedContext.goal}.`,
      reasonForVisitor: 'Your prompt was about products or platforms, so navigation now leads with the product catalogue.',
      navigation: [
        { label: 'GenAI Accelerators', href: '/genai-accelerators' },
        { label: 'Dialogtuple', href: '/dialogtuple' },
        { label: 'Flowtuple', href: '/flowtuple' },
        { label: 'Gaugetuple', href: '/gaugetuple' },
        { label: 'Book Demo', href: '/contactus' },
      ],
      hero: {
        eyebrow: `Products for ${audience}`,
        title: 'Explore Newtuple products for AI apps, agents, workflows, and evaluations.',
        description: `Product interest detected${systemsLabel ? ` around ${systemsLabel}` : ''} — leading with accelerators and platforms that fit ${normalizedContext.goal}.`,
      },
      primaryCta: { label: 'Explore AI apps', href: '/newtuple-ai-apps' },
      secondaryCta: { label: 'Book a demo', href: '/contactus' },
      caseStudySlugs: ['enterprise-saas-ai-agents', 'anti-hallucination-platform', 'msp-saas-platform'],
      caseStudyHref: '/newtuple-ai-apps',
      suggestedPrompts: [
        'Which Newtuple product fits a SaaS support platform?',
        'Show me Flowtuple for human approval workflows.',
        'I need Gaugetuple to evaluate LLM quality.',
      ],
    }
  }

  const industryHref = industrySlug[normalizedContext.industry] ?? '/newtuple-agents'
  const retail = normalizedContext.industry === 'retail'

  return {
    context: normalizedContext,
    intent: 'services',
    isPersonalized: true,
    adaptationSummary: `Newtuple.com has been adapted for ${industry} + ${normalizedContext.goal}.`,
    reasonForVisitor: `Your prompt described a business need in ${industry}, so navigation and the hero now lead with that industry's AI work.`,
    navigation: retail
      ? [
          { label: 'Retail', href: '/retail' },
          { label: 'Build AI Agents', href: '/newtuple-agents' },
          { label: 'Build AI Apps', href: '/newtuple-ai-apps' },
          { label: 'Talk to Retail Team', href: '/contactus' },
        ]
      : [
          { label: industry, href: industryHref },
          { label: 'Build AI Agents', href: '/newtuple-agents' },
          { label: 'Build AI Apps', href: '/newtuple-ai-apps' },
          { label: 'Talk to Team', href: '/contactus' },
        ],
    hero: retail
      ? {
          eyebrow: `Retail services${systemsLabel ? ` for ${systemsLabel}` : ''}`,
          title: 'Improve merchandising, supplier onboarding, and product-data operations with AI.',
          description: `${roleName(normalizedContext.role)} context detected — prioritizing ${normalizedContext.goal}${systemsLabel ? ` and ${systemsLabel} integration` : ''}.`,
        }
      : {
          eyebrow: `Services for ${audience}`,
          title: `Accelerate ${normalizedContext.goal} for ${industry} teams.`,
          description: `The page is reordered around ${normalizedContext.goal}, ${normalizedContext.buying_stage} intent, and ${normalizedContext.technical_depth} technical depth.`,
        },
    primaryCta: { label: retail ? 'Talk to Retail Team' : 'Plan the AI roadmap', href: '/contactus' },
    secondaryCta: { label: `See ${industry} work`, href: industryHref },
    caseStudySlugs: retail
      ? ['enterprise-saas-ai-agents', 'data-intelligence-platform', 'b2b-sales-agency-data-transformation']
      : ['enterprise-saas-ai-agents', 'data-intelligence-platform', 'anti-hallucination-platform'],
    caseStudyHref: industryHref,
    suggestedPrompts: retail
      ? ['Which product-data workflows should we automate first?', `How would this integrate with ${systemsLabel ?? 'our stack'}?`]
      : [`Where should ${industry} teams apply AI agents first?`, 'What proof points should we review before a pilot?'],
  }
}
