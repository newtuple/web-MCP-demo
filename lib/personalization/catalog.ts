import type {
  ArchitectureExample,
  BuyerRole,
  Goal,
  HomepageSectionId,
  Industry,
  PersonalizedCta,
  PersonalizedNarrative,
  Priority,
} from './types'

export interface TaggedContent {
  id: string
  industries: Industry[]
  roles: BuyerRole[]
  goals: Goal[]
  priorities: Priority[]
}

export interface NarrativeDefinition extends PersonalizedNarrative, TaggedContent {}

export const NARRATIVES: NarrativeDefinition[] = [
  {
    id: 'retail-enterprise-transformation',
    industries: ['retail'],
    roles: ['cio', 'ai_leader'],
    goals: ['customer_support', 'workflow_automation', 'ai_agents'],
    priorities: ['security', 'integration', 'scale'],
    badge: 'Enterprise AI for retail',
    headlines: [
      { text: 'Modernize Retail with Secure AI.', bold: 'Secure AI' },
      { text: 'Connect Every Retail Workflow.', bold: 'Every' },
      { text: 'Scale AI Across Your Enterprise.', bold: 'Scale AI' },
    ],
    description: 'Connect customer service, store operations, and enterprise systems with secure AI agents built for measurable retail outcomes.',
  },
  {
    id: 'financial-product-velocity',
    industries: ['financial_services'],
    roles: ['product_leader', 'engineering_leader'],
    goals: ['document_processing', 'data_access', 'application_development', 'evaluation'],
    priorities: ['accuracy', 'compliance', 'speed', 'cost'],
    badge: 'Production AI for financial products',
    headlines: [
      { text: 'Launch Reliable Financial AI.', bold: 'Reliable' },
      { text: 'Turn Complex Data into Products.', bold: 'Products' },
      { text: 'Move from Pilot to Production.', bold: 'Production' },
    ],
    description: 'Build accurate AI products with document intelligence, evaluation controls, traceable data access, and production-ready engineering.',
  },
  {
    id: 'enterprise-agentic-ai',
    industries: ['general'],
    roles: ['cio', 'product_leader', 'ai_leader', 'engineering_leader'],
    goals: ['ai_agents', 'workflow_automation', 'application_development'],
    priorities: ['security', 'speed', 'scale'],
    badge: 'Production-grade agentic AI',
    headlines: [
      { text: 'Build Your Agentic Enterprise.', bold: 'Agentic' },
      { text: 'Scale Your AI Operations.', bold: 'AI' },
      { text: 'Ship Production-Grade Intelligence.', bold: 'Production-Grade' },
    ],
    description: 'Design, build, and operate reliable AI agents and applications that connect to the systems your business already uses.',
  },
]

export interface CaseStudyDefinition extends TaggedContent {
  slug: string
}

export const CASE_STUDY_CATALOG: CaseStudyDefinition[] = [
  {
    id: 'enterprise-saas-ai-agents',
    slug: 'enterprise-saas-ai-agents',
    industries: ['retail', 'financial_services', 'general'],
    roles: ['cio', 'ai_leader'],
    goals: ['customer_support', 'workflow_automation', 'ai_agents'],
    priorities: ['security', 'integration', 'cost', 'scale'],
  },
  {
    id: 'property-maintenance-ai-platform',
    slug: 'property-maintenance-ai-platform',
    industries: ['retail', 'general'],
    roles: ['cio', 'product_leader'],
    goals: ['customer_support', 'workflow_automation', 'ai_agents'],
    priorities: ['integration', 'speed', 'scale'],
  },
  {
    id: 'b2b-sales-agency-data-transformation',
    slug: 'b2b-sales-agency-data-transformation',
    industries: ['retail', 'general'],
    roles: ['cio', 'product_leader'],
    goals: ['data_access', 'workflow_automation'],
    priorities: ['cost', 'speed', 'integration'],
  },
  {
    id: 'alternative-investments-document-classification',
    slug: 'alternative-investments-document-classification',
    industries: ['financial_services'],
    roles: ['product_leader', 'ai_leader', 'cio'],
    goals: ['document_processing', 'evaluation', 'application_development'],
    priorities: ['accuracy', 'compliance', 'scale'],
  },
  {
    id: 'data-intelligence-platform',
    slug: 'data-intelligence-platform',
    industries: ['financial_services'],
    roles: ['product_leader', 'engineering_leader', 'ai_leader'],
    goals: ['data_access', 'ai_agents', 'application_development'],
    priorities: ['accuracy', 'speed', 'scale'],
  },
  {
    id: 'anti-hallucination-platform',
    slug: 'anti-hallucination-platform',
    industries: ['financial_services', 'general'],
    roles: ['product_leader', 'ai_leader', 'engineering_leader'],
    goals: ['evaluation', 'application_development'],
    priorities: ['accuracy', 'compliance', 'scale'],
  },
  {
    id: 'msp-saas-platform',
    slug: 'msp-saas-platform',
    industries: ['general'],
    roles: ['product_leader', 'engineering_leader'],
    goals: ['application_development', 'ai_agents'],
    priorities: ['speed', 'cost', 'scale'],
  },
  {
    id: 'aviation-oem-agentic-data-access',
    slug: 'aviation-oem-agentic-data-access',
    industries: ['general'],
    roles: ['cio', 'product_leader'],
    goals: ['data_access', 'ai_agents'],
    priorities: ['integration', 'speed', 'security'],
  },
]

export interface DemoDefinition extends TaggedContent {
  name: string
  href: string
}

export const DEMOS: DemoDefinition[] = [
  {
    id: 'dialogtuple',
    name: 'Dialogtuple',
    href: '/dialogtuple',
    industries: ['retail', 'financial_services', 'general'],
    roles: ['cio', 'product_leader', 'ai_leader'],
    goals: ['customer_support', 'ai_agents'],
    priorities: ['integration', 'speed', 'scale'],
  },
  {
    id: 'gaugetuple',
    name: 'Gaugetuple',
    href: '/gaugetuple',
    industries: ['financial_services', 'retail', 'general'],
    roles: ['product_leader', 'ai_leader', 'engineering_leader'],
    goals: ['evaluation', 'document_processing', 'application_development'],
    priorities: ['accuracy', 'compliance', 'cost'],
  },
  {
    id: 'flowtuple',
    name: 'Flowtuple',
    href: '/flowtuple',
    industries: ['retail', 'financial_services', 'general'],
    roles: ['cio', 'product_leader', 'engineering_leader'],
    goals: ['workflow_automation', 'ai_agents', 'application_development'],
    priorities: ['integration', 'speed', 'scale'],
  },
]

export interface ArchitectureDefinition extends ArchitectureExample, TaggedContent {}

export const ARCHITECTURES: ArchitectureDefinition[] = [
  {
    id: 'secure-enterprise-agent-platform',
    title: 'Secure enterprise agent platform',
    description: 'A governed agent layer connects business workflows to enterprise systems without bypassing identity or security controls.',
    layers: ['Channels and employee experiences', 'Agent orchestration and policy', 'Enterprise APIs and identity', 'Observability, evaluation, and audit'],
    industries: ['retail', 'financial_services', 'general'],
    roles: ['cio', 'ai_leader'],
    goals: ['ai_agents', 'workflow_automation', 'customer_support'],
    priorities: ['security', 'integration', 'scale'],
  },
  {
    id: 'financial-document-intelligence',
    title: 'Financial document intelligence',
    description: 'A traceable processing pipeline combines OCR, model routing, validation, and human review for regulated documents.',
    layers: ['Secure document intake', 'OCR and classification agents', 'Structured extraction and validation', 'Human review and audit trail'],
    industries: ['financial_services'],
    roles: ['product_leader', 'ai_leader', 'cio'],
    goals: ['document_processing', 'evaluation'],
    priorities: ['accuracy', 'compliance', 'security'],
  },
  {
    id: 'ai-product-delivery-loop',
    title: 'AI product delivery loop',
    description: 'A product architecture joins application APIs, retrieval, model routing, evaluation, and cost controls in one release loop.',
    layers: ['Product experience and APIs', 'Retrieval and model routing', 'Automated evaluation gates', 'Telemetry and cost controls'],
    industries: ['financial_services', 'retail', 'general'],
    roles: ['product_leader', 'engineering_leader'],
    goals: ['application_development', 'data_access', 'evaluation'],
    priorities: ['speed', 'accuracy', 'cost', 'scale'],
  },
  {
    id: 'retail-operations-automation',
    title: 'Connected retail operations',
    description: 'Event-driven workflows connect customer channels, store operations, enterprise data, and human approvals.',
    layers: ['Customer and store channels', 'Workflow and agent coordination', 'Commerce, CRM, and operations systems', 'Security and outcome telemetry'],
    industries: ['retail'],
    roles: ['cio', 'product_leader'],
    goals: ['customer_support', 'workflow_automation', 'data_access'],
    priorities: ['integration', 'security', 'scale'],
  },
]

export const CTAS: Array<PersonalizedCta & { actions: string[] }> = [
  {
    id: 'architecture-workshop',
    actions: ['review_architecture'],
    title: 'Plan your AI architecture',
    description: 'Review the systems, controls, and delivery plan for your first production workflow.',
    label: 'Plan an architecture workshop',
    href: '/contactus',
  },
  {
    id: 'product-proof-of-concept',
    actions: ['view_demo', 'explore'],
    title: 'Move from product idea to proof',
    description: 'Select a focused use case and build a measurable proof of concept with production constraints in view.',
    label: 'Build a product proof of concept',
    href: '/contactus',
  },
  {
    id: 'case-study-review',
    actions: ['view_cases'],
    title: 'See how the pattern applies to you',
    description: 'Review relevant delivery examples with a Newtuple AI specialist.',
    label: 'Review relevant case studies',
    href: '/contactus',
  },
  {
    id: 'talk-to-newtuple',
    actions: ['contact_newtuple'],
    title: 'Build your AI advantage',
    description: 'Tell us where you want to start. We will help you define a practical path to production.',
    label: 'Talk to our AI experts',
    href: '/contactus',
  },
]

export const DEFAULT_SECTION_ORDER: HomepageSectionId[] = [
  'hero',
  'manifesto',
  'paths',
  'case_studies',
  'client_logos',
  'partners',
  'testimonials',
  'accelerators',
  'architecture',
  'faq',
  'cta',
]

export const RETAIL_CIO_SECTION_ORDER: HomepageSectionId[] = [
  'hero',
  'paths',
  'architecture',
  'case_studies',
  'accelerators',
  'client_logos',
  'partners',
  'testimonials',
  'manifesto',
  'faq',
  'cta',
]

export const FINANCIAL_PRODUCT_SECTION_ORDER: HomepageSectionId[] = [
  'hero',
  'accelerators',
  'case_studies',
  'architecture',
  'paths',
  'testimonials',
  'client_logos',
  'partners',
  'manifesto',
  'faq',
  'cta',
]

