import type {
  ArchitectureExample,
  BuyerRole,
  Goal,
  HomepageSectionId,
  Industry,
  PersonalizedCta,
  PersonalizedNarrative,
  PersonalizedSectionCopy,
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
    id: 'healthcare-operations-intelligence',
    industries: ['healthcare'],
    roles: ['cio', 'cto', 'operations_leader', 'ai_leader'],
    goals: ['workflow_automation', 'document_processing', 'ai_agents'],
    priorities: ['security', 'compliance', 'accuracy', 'integration'],
    badge: 'Responsible AI for healthcare operations',
    headlines: [
      { text: 'Improve Care Operations with AI.', bold: 'Care Operations' },
      { text: 'Automate Workflows without Losing Control.', bold: 'Control' },
      { text: 'Build Secure Healthcare Intelligence.', bold: 'Secure' },
    ],
    description: 'Improve operational workflows with secure AI, traceable automation, and human review designed for healthcare environments.',
  },
  {
    id: 'aviation-connected-intelligence',
    industries: ['aviation'],
    roles: ['cio', 'cto', 'operations_leader', 'ai_leader'],
    goals: ['data_access', 'workflow_automation', 'ai_agents'],
    priorities: ['security', 'integration', 'accuracy', 'scale'],
    badge: 'AI for complex aviation operations',
    headlines: [
      { text: 'Turn Aviation Data into Decisions.', bold: 'Decisions' },
      { text: 'Connect Complex Operations with AI.', bold: 'Connect' },
      { text: 'Move from Hours to Seconds.', bold: 'Seconds' },
    ],
    description: 'Connect operational data, expert workflows, and governed AI agents across complex aviation systems.',
  },
  {
    id: 'saas-ai-product-platform',
    industries: ['technology_saas'],
    roles: ['cto', 'product_leader', 'engineering_leader', 'ai_leader'],
    goals: ['application_development', 'ai_agents', 'evaluation'],
    priorities: ['speed', 'cost', 'accuracy', 'scale'],
    badge: 'AI product engineering for SaaS teams',
    headlines: [
      { text: 'Ship AI Products that Scale.', bold: 'Scale' },
      { text: 'Move from Prototype to Platform.', bold: 'Platform' },
      { text: 'Build Reliable Agentic Software.', bold: 'Reliable' },
    ],
    description: 'Turn AI prototypes into reliable products with multi-tenant architecture, evaluation gates, cost controls, and production operations.',
  },
  {
    id: 'enterprise-agentic-ai',
    industries: ['general'],
    roles: ['cio', 'cto', 'product_leader', 'ai_leader', 'engineering_leader', 'operations_leader'],
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
    industries: ['retail', 'financial_services', 'technology_saas', 'general'],
    roles: ['cio', 'cto', 'ai_leader', 'operations_leader'],
    goals: ['customer_support', 'workflow_automation', 'ai_agents'],
    priorities: ['security', 'integration', 'cost', 'scale'],
  },
  {
    id: 'property-maintenance-ai-platform',
    slug: 'property-maintenance-ai-platform',
    industries: ['retail', 'healthcare', 'general'],
    roles: ['cio', 'product_leader', 'operations_leader'],
    goals: ['customer_support', 'workflow_automation', 'ai_agents'],
    priorities: ['integration', 'speed', 'scale'],
  },
  {
    id: 'b2b-sales-agency-data-transformation',
    slug: 'b2b-sales-agency-data-transformation',
    industries: ['retail', 'technology_saas', 'general'],
    roles: ['cio', 'cto', 'product_leader', 'operations_leader'],
    goals: ['data_access', 'workflow_automation'],
    priorities: ['cost', 'speed', 'integration'],
  },
  {
    id: 'alternative-investments-document-classification',
    slug: 'alternative-investments-document-classification',
    industries: ['financial_services'],
    roles: ['product_leader', 'ai_leader', 'cio', 'cto'],
    goals: ['document_processing', 'evaluation', 'application_development'],
    priorities: ['accuracy', 'compliance', 'scale'],
  },
  {
    id: 'data-intelligence-platform',
    slug: 'data-intelligence-platform',
    industries: ['financial_services'],
    roles: ['product_leader', 'engineering_leader', 'ai_leader', 'cto'],
    goals: ['data_access', 'ai_agents', 'application_development'],
    priorities: ['accuracy', 'speed', 'scale'],
  },
  {
    id: 'anti-hallucination-platform',
    slug: 'anti-hallucination-platform',
    industries: ['financial_services', 'technology_saas', 'general'],
    roles: ['product_leader', 'ai_leader', 'engineering_leader', 'cto'],
    goals: ['evaluation', 'application_development'],
    priorities: ['accuracy', 'compliance', 'scale'],
  },
  {
    id: 'msp-saas-platform',
    slug: 'msp-saas-platform',
    industries: ['technology_saas', 'general'],
    roles: ['cto', 'product_leader', 'engineering_leader'],
    goals: ['application_development', 'ai_agents'],
    priorities: ['speed', 'cost', 'scale'],
  },
  {
    id: 'aviation-oem-agentic-data-access',
    slug: 'aviation-oem-agentic-data-access',
    industries: ['aviation', 'general'],
    roles: ['cio', 'cto', 'product_leader', 'operations_leader'],
    goals: ['data_access', 'ai_agents'],
    priorities: ['integration', 'speed', 'security'],
  },
  {
    id: 'healthcare-laundry-rfid-automation',
    slug: 'healthcare-laundry-rfid-automation',
    industries: ['healthcare'],
    roles: ['cio', 'cto', 'operations_leader'],
    goals: ['workflow_automation', 'document_processing', 'data_access'],
    priorities: ['integration', 'accuracy', 'cost', 'scale'],
  },
  {
    id: 'secure-transcription-platform',
    slug: 'secure-transcription-platform',
    industries: ['healthcare', 'aviation', 'general'],
    roles: ['cio', 'cto', 'ai_leader'],
    goals: ['document_processing', 'application_development'],
    priorities: ['security', 'compliance', 'accuracy'],
  },
  {
    id: 'nocode-platform-productionization',
    slug: 'nocode-platform-productionization',
    industries: ['technology_saas'],
    roles: ['cto', 'product_leader', 'engineering_leader'],
    goals: ['application_development', 'ai_agents', 'evaluation'],
    priorities: ['speed', 'accuracy', 'scale'],
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
    industries: ['retail', 'financial_services', 'healthcare', 'aviation', 'technology_saas', 'general'],
    roles: ['cio', 'cto', 'product_leader', 'ai_leader', 'operations_leader'],
    goals: ['customer_support', 'ai_agents'],
    priorities: ['integration', 'speed', 'scale'],
  },
  {
    id: 'gaugetuple',
    name: 'Gaugetuple',
    href: '/gaugetuple',
    industries: ['financial_services', 'retail', 'healthcare', 'aviation', 'technology_saas', 'general'],
    roles: ['cto', 'product_leader', 'ai_leader', 'engineering_leader'],
    goals: ['evaluation', 'document_processing', 'application_development'],
    priorities: ['accuracy', 'compliance', 'cost'],
  },
  {
    id: 'flowtuple',
    name: 'Flowtuple',
    href: '/flowtuple',
    industries: ['retail', 'financial_services', 'healthcare', 'aviation', 'technology_saas', 'general'],
    roles: ['cio', 'cto', 'product_leader', 'engineering_leader', 'operations_leader'],
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
    industries: ['retail', 'financial_services', 'healthcare', 'aviation', 'technology_saas', 'general'],
    roles: ['cio', 'cto', 'ai_leader', 'operations_leader'],
    goals: ['ai_agents', 'workflow_automation', 'customer_support'],
    priorities: ['security', 'integration', 'scale'],
  },
  {
    id: 'financial-document-intelligence',
    title: 'Financial document intelligence',
    description: 'A traceable processing pipeline combines OCR, model routing, validation, and human review for regulated documents.',
    layers: ['Secure document intake', 'OCR and classification agents', 'Structured extraction and validation', 'Human review and audit trail'],
    industries: ['financial_services'],
    roles: ['product_leader', 'ai_leader', 'cio', 'cto'],
    goals: ['document_processing', 'evaluation'],
    priorities: ['accuracy', 'compliance', 'security'],
  },
  {
    id: 'ai-product-delivery-loop',
    title: 'AI product delivery loop',
    description: 'A product architecture joins application APIs, retrieval, model routing, evaluation, and cost controls in one release loop.',
    layers: ['Product experience and APIs', 'Retrieval and model routing', 'Automated evaluation gates', 'Telemetry and cost controls'],
    industries: ['financial_services', 'retail', 'technology_saas', 'general'],
    roles: ['cto', 'product_leader', 'engineering_leader'],
    goals: ['application_development', 'data_access', 'evaluation'],
    priorities: ['speed', 'accuracy', 'cost', 'scale'],
  },
  {
    id: 'retail-operations-automation',
    title: 'Connected retail operations',
    description: 'Event-driven workflows connect customer channels, store operations, enterprise data, and human approvals.',
    layers: ['Customer and store channels', 'Workflow and agent coordination', 'Commerce, CRM, and operations systems', 'Security and outcome telemetry'],
    industries: ['retail'],
    roles: ['cio', 'cto', 'product_leader', 'operations_leader'],
    goals: ['customer_support', 'workflow_automation', 'data_access'],
    priorities: ['integration', 'security', 'scale'],
  },
  {
    id: 'healthcare-human-review',
    title: 'Healthcare automation with human review',
    description: 'A controlled workflow combines secure intake, specialized AI processing, clinical or operational review, and complete traceability.',
    layers: ['Secure workflow intake', 'Specialized extraction and reasoning', 'Human approval and exception handling', 'Audit, quality, and outcome monitoring'],
    industries: ['healthcare'],
    roles: ['cio', 'cto', 'operations_leader', 'ai_leader'],
    goals: ['workflow_automation', 'document_processing', 'ai_agents'],
    priorities: ['security', 'compliance', 'accuracy'],
  },
  {
    id: 'aviation-agentic-data-layer',
    title: 'Aviation agentic data layer',
    description: 'A governed data and agent layer gives operations teams fast access to information across complex source systems.',
    layers: ['Operational systems and documents', 'Semantic data access and authorization', 'Specialized analysis agents', 'Verified answers and operational actions'],
    industries: ['aviation'],
    roles: ['cio', 'cto', 'operations_leader', 'ai_leader'],
    goals: ['data_access', 'workflow_automation', 'ai_agents'],
    priorities: ['integration', 'security', 'accuracy', 'scale'],
  },
  {
    id: 'multi-tenant-ai-saas',
    title: 'Multi-tenant AI product platform',
    description: 'A product platform isolates customer data while sharing agent services, evaluation, model routing, and operational controls.',
    layers: ['Tenant-aware product APIs', 'Agent services and retrieval', 'Evaluation and model routing', 'Usage, cost, and reliability operations'],
    industries: ['technology_saas'],
    roles: ['cto', 'product_leader', 'engineering_leader', 'ai_leader'],
    goals: ['application_development', 'ai_agents', 'evaluation'],
    priorities: ['speed', 'cost', 'accuracy', 'scale'],
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

export const HEALTHCARE_OPERATIONS_SECTION_ORDER: HomepageSectionId[] = [
  'hero', 'case_studies', 'architecture', 'paths', 'accelerators', 'client_logos', 'partners', 'testimonials', 'manifesto', 'faq', 'cta',
]

export const AVIATION_OPERATIONS_SECTION_ORDER: HomepageSectionId[] = [
  'hero', 'architecture', 'case_studies', 'paths', 'accelerators', 'client_logos', 'partners', 'testimonials', 'manifesto', 'faq', 'cta',
]

export const SAAS_PRODUCT_SECTION_ORDER: HomepageSectionId[] = [
  'hero', 'accelerators', 'case_studies', 'paths', 'architecture', 'testimonials', 'client_logos', 'partners', 'manifesto', 'faq', 'cta',
]

const DEFAULT_SECTION_COPY: PersonalizedSectionCopy = {
  pathsBefore: 'Two ways we accelerate',
  pathsHighlight: 'AI',
  pathsAfter: 'for you',
  caseStudiesTitle: "Work we've",
  caseStudiesAccent: 'done.',
  caseStudiesDescription: 'Production AI systems across aviation, finance, healthcare, and enterprise SaaS.',
  demosTitle: 'Production-ready GenAI accelerators',
  demosDescription: 'Start with working foundations for agents, workflows, and continuous evaluation.',
  demosActionLabel: 'Explore All Accelerators',
  architectureEyebrow: 'Architecture examples',
  architectureTitle: 'A practical path from use case to production',
  architectureDescription: 'Reference patterns for secure, measurable, and maintainable AI systems.',
  testimonialsTitle: 'Real stories, real results',
  testimonialsDescription: 'Voices from teams that shipped production AI with us.',
  faqTitle: 'Questions? We have answers',
  secondaryActionLabel: 'Explore Accelerators',
  secondaryActionHref: '/genai-accelerators',
}

export const SECTION_COPY_BY_INDUSTRY: Record<Industry, PersonalizedSectionCopy> = {
  general: DEFAULT_SECTION_COPY,
  retail: {
    ...DEFAULT_SECTION_COPY,
    pathsBefore: 'Two paths to modernize',
    pathsHighlight: 'retail',
    pathsAfter: 'with AI',
    caseStudiesTitle: 'AI outcomes for',
    caseStudiesAccent: 'connected operations.',
    caseStudiesDescription: 'Examples selected for customer service, workflow automation, and enterprise integration.',
    demosTitle: 'Retail AI experiences you can explore',
    demosDescription: 'See governed customer conversations and human-agent workflows in action.',
    architectureEyebrow: 'Retail architecture patterns',
    architectureTitle: 'Connect channels, agents, and operations',
    architectureDescription: 'Selected patterns for secure integration across commerce, CRM, support, and store systems.',
    testimonialsTitle: 'Production AI, proven in complex operations',
    faqTitle: 'Retail AI questions, answered',
    secondaryActionLabel: 'Explore retail AI',
    secondaryActionHref: '/retail',
  },
  financial_services: {
    ...DEFAULT_SECTION_COPY,
    pathsBefore: 'Build reliable',
    pathsHighlight: 'financial AI',
    pathsAfter: 'from product to platform',
    caseStudiesTitle: 'Evidence for',
    caseStudiesAccent: 'regulated AI.',
    caseStudiesDescription: 'Document intelligence, data access, and evaluation systems selected for financial product teams.',
    demosTitle: 'Evaluate financial AI before it ships',
    demosDescription: 'Explore continuous quality scoring, governed workflows, and customer-facing agent experiences.',
    architectureEyebrow: 'Financial AI architecture',
    architectureTitle: 'Design for accuracy, traceability, and scale',
    architectureDescription: 'Selected patterns for document processing, model evaluation, data controls, and product delivery.',
    testimonialsTitle: 'Trusted for high-stakes AI delivery',
    faqTitle: 'Financial AI delivery questions',
    secondaryActionLabel: 'Explore financial services',
    secondaryActionHref: '/financial-services',
  },
  healthcare: {
    ...DEFAULT_SECTION_COPY,
    pathsBefore: 'Improve',
    pathsHighlight: 'healthcare operations',
    pathsAfter: 'with controlled AI',
    caseStudiesTitle: 'Automation with',
    caseStudiesAccent: 'measurable impact.',
    caseStudiesDescription: 'Healthcare and secure-processing examples selected for operational reliability and human review.',
    demosTitle: 'Controlled AI workflows for healthcare teams',
    demosDescription: 'Explore agent workflows, quality evaluation, and guided conversations with clear approval points.',
    architectureEyebrow: 'Healthcare architecture patterns',
    architectureTitle: 'Keep people, policy, and quality in the loop',
    architectureDescription: 'Selected patterns for secure intake, specialized processing, human review, and audit.',
    testimonialsTitle: 'Delivery experience for critical workflows',
    faqTitle: 'Healthcare AI implementation questions',
    secondaryActionLabel: 'Explore healthcare AI',
    secondaryActionHref: '/social-care-healthcare',
  },
  aviation: {
    ...DEFAULT_SECTION_COPY,
    pathsBefore: 'Connect',
    pathsHighlight: 'aviation intelligence',
    pathsAfter: 'across complex systems',
    caseStudiesTitle: 'From operational data to',
    caseStudiesAccent: 'faster decisions.',
    caseStudiesDescription: 'Aviation, secure data access, and agent examples selected for complex operational environments.',
    demosTitle: 'Agent workflows for complex operations',
    demosDescription: 'Explore governed workflows, data evaluation, and conversational access to operational knowledge.',
    architectureEyebrow: 'Aviation architecture patterns',
    architectureTitle: 'Create a governed layer across operational data',
    architectureDescription: 'Selected patterns for authorized data access, specialized analysis, and verified operational actions.',
    testimonialsTitle: 'AI delivery for complex enterprise systems',
    faqTitle: 'Aviation AI implementation questions',
    secondaryActionLabel: 'Explore aviation AI',
    secondaryActionHref: '/aviation',
  },
  technology_saas: {
    ...DEFAULT_SECTION_COPY,
    pathsBefore: 'Turn your',
    pathsHighlight: 'AI prototype',
    pathsAfter: 'into a product platform',
    caseStudiesTitle: 'Patterns for',
    caseStudiesAccent: 'AI product scale.',
    caseStudiesDescription: 'Multi-tenant platforms, agent products, and evaluation systems selected for SaaS teams.',
    demosTitle: 'Product foundations your team can extend',
    demosDescription: 'Explore agent workflows, continuous evaluation, and customer-facing conversation systems.',
    architectureEyebrow: 'SaaS product architecture',
    architectureTitle: 'Ship reliable AI across tenants and models',
    architectureDescription: 'Selected patterns for tenant isolation, shared agent services, evaluation, cost, and operations.',
    testimonialsTitle: 'From AI prototype to commercial product',
    faqTitle: 'AI product engineering questions',
    secondaryActionLabel: 'Explore AI applications',
    secondaryActionHref: '/newtuple-ai-apps',
  },
}
