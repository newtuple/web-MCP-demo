export const PAGE_REGISTRY = {
  '0-to-genai': {
    path: '/0-to-genai',
    load: () => import('./0-to-genai/content'),
  },
  'about-us': {
    path: '/about-us',
    load: () => import('./about-us/content'),
  },
  agencies: {
    path: '/agencies',
    load: () => import('./agencies/content'),
  },
  'ai-transformation-for-the-enterprise': {
    path: '/ai-transformation-for-the-enterprise',
    load: () => import('./ai-transformation-for-the-enterprise/content'),
  },
  aviation: {
    path: '/aviation',
    load: () => import('./aviation/content'),
  },
  careers: {
    path: '/careers',
    load: () => import('./careers/content'),
  },
  contactus: {
    path: '/contactus',
    load: () => import('./contactus/content'),
  },
  dialogtuple: {
    path: '/dialogtuple',
    load: () => import('./dialogtuple/content'),
  },
  'financial-services': {
    path: '/financial-services',
    load: () => import('./financial-services/content'),
  },
  flowtuple: {
    path: '/flowtuple',
    load: () => import('./flowtuple/content'),
  },
  gaugetuple: {
    path: '/gaugetuple',
    load: () => import('./gaugetuple/content'),
  },
  'genai-accelerators': {
    path: '/genai-accelerators',
    load: () => import('./genai-accelerators/content'),
  },
  'genai-powered-business-automation': {
    path: '/genai-powered-business-automation',
    load: () => import('./genai-powered-business-automation/content'),
  },
  'life-at-newtuple': {
    path: '/life-at-newtuple',
    load: () => import('./life-at-newtuple/content'),
  },
  'newtuple-agents': {
    path: '/newtuple-agents',
    load: () => import('./newtuple-agents/content'),
  },
  'newtuple-ai-apps': {
    path: '/newtuple-ai-apps',
    load: () => import('./newtuple-ai-apps/content'),
  },
  // Temporarily hidden while Omnituple is not working.
  // omnituple: {
  //   path: '/omnituple',
  //   load: () => import('./omnituple/content'),
  // },
  retail: {
    path: '/retail',
    load: () => import('./retail/content'),
  },
  'social-care-healthcare': {
    path: '/social-care-healthcare',
    load: () => import('./social-care-healthcare/content'),
  },
  uttertuple: {
    path: '/uttertuple',
    load: () => import('./uttertuple/content'),
  },
} as const

export type PageSlug = keyof typeof PAGE_REGISTRY
