// The fixed set of real destinations navigate_site can send a visitor to,
// pulled from each page's own content/*.md frontmatter, not invented copy.
// Excludes legal/boilerplate pages (privacy-policy, service-agreement) and
// partial content (social-proof) - none of those are a sensible answer to
// "what are you trying to improve".

import { z } from 'zod'

export interface PageCatalogEntry {
  slug: string
  title: string
  description: string
}

export const PAGE_CATALOG: PageCatalogEntry[] = [
  { slug: 'home', title: 'Newtuple - Generative AI Experts', description: 'Generative AI experts that bring this technology to real outcomes. We get AI to production at warp speed.' },
  { slug: 'about-us', title: 'About', description: 'Committed to revolutionizing the business landscape by making cutting-edge AI accessible to every organization, regardless of size.' },
  { slug: 'life-at-newtuple', title: 'Life at Newtuple', description: 'Life at Newtuple is all about curiosity, creativity, and collaboration. A vibrant, AI-powered team where productivity meets playfulness.' },
  { slug: 'careers', title: 'Careers', description: 'Join Newtuple Technologies. We are hiring for multiple roles in AI, data engineering, and program management. Pune-based with flexible work culture.' },
  { slug: 'contactus', title: 'Contact Us', description: 'Get in touch with our team of world-class AI experts. Newtuple Technologies, Pune, India.' },
  { slug: 'newtuple-agents', title: 'Build AI Agents', description: 'We design, build, and operate enterprise AI agents. Combining deep generative AI skills with practical engineering discipline and hard-won production experience.' },
  { slug: 'newtuple-ai-apps', title: 'Build AI Apps', description: 'Strategy, architecture and engineering for AI-first startups and product teams. From roadmap to running product.' },
  { slug: 'genai-powered-business-automation', title: 'Agents as a Service', description: 'Production-grade AI agents that run all day, at scale, with governance, observability and measurable ROI. Proven across 40+ client engagements.' },
  { slug: 'ai-transformation-for-the-enterprise', title: 'AI Transformation for the Enterprise', description: 'Transform your data architecture to support AI-driven initiatives. Embed AI solutions into enterprise environments without disrupting core operations.' },
  { slug: 'genai-accelerators', title: 'GenAI Accelerators', description: 'Turn-key base applications that cover the repeatable mechanics of GenAI workloads. Informed by experience across 25+ GenAI deployments.' },
  { slug: 'dialogtuple', title: 'Dialogtuple', description: 'Multi-agent platform with 100+ LLM support, built-in prompt versioning and tracing, one-click MCP server and tool integration, and native autonomous AI agents based on OpenClaw architecture.' },
  { slug: 'flowtuple', title: 'Flowtuple - A shared workflow engine for agents and humans', description: 'A shared workflow engine for agents and humans. Flowtuple models your operational workflows as explicit state machines, staffs each step with people or specialist AI agents, and gates every transition that needs human judgment.' },
  { slug: 'gaugetuple', title: 'Gaugetuple', description: 'LLM evaluation platform with guided eval flows, scheduled runs, dataset management and integrated frameworks. Create custom ML-based and LLM-as-a-judge criteria for your specific project.' },
  { slug: 'omnituple', title: 'Omnituple', description: 'Voice-driven analytics dashboards. Speak a question and receive live dashboards and narrative insights from your data.' },
  { slug: 'uttertuple', title: 'Uttertuple', description: 'Voice AI accelerator built on top of the best STT, TTS and realtime models from cloud providers and cutting-edge startups. One platform, every voice model.' },
  { slug: 'agencies', title: 'Agencies', description: 'GenAI engineering teams and white-label accelerators for agencies. Land bigger AI deals and deliver them with production-grade expertise.' },
  { slug: 'retail', title: 'AI for Retail, CPG & Distribution', description: 'Newtuple builds production AI that connects your retail stack and turns the manual work between systems into measurable results.' },
  { slug: 'financial-services', title: 'Financial Services', description: 'Multi-agent document intelligence, data aggregation platforms, and compliance automation for financial services - built and running in production.' },
  { slug: 'aviation', title: 'Aviation', description: 'Multi-agent AI systems for aviation operations - turning millions of baggage, cargo, and ground-handling data points into decisions in seconds, not hours.' },
  { slug: 'social-care-healthcare', title: 'Social Care & Healthcare', description: 'AI-powered referral management, on-device note taking, and operational automation for social care and healthcare - deployed in sensitive, secure environments.' },
]

const PAGE_SLUGS = PAGE_CATALOG.map((p) => p.slug) as [string, ...string[]]

/** 'home' is a real catalog entry ("take me back to the homepage") but the
 * homepage itself lives at '/', not '/home' - every other slug is its own
 * route. Both call sites (the WebMCP tool and the UI popover) go through
 * this so the mapping only exists once. */
export function pageHref(slug: string): string {
  return slug === 'home' ? '/' : `/${slug}`
}

export const NavigationDecisionSchema = z.object({
  decision: z.enum(['navigate', 'clarify', 'build_demo', 'personalize']),
  // Constrained to the real catalog, not a free string, so the model cannot
  // hallucinate a page that does not exist.
  page: z.enum(PAGE_SLUGS).nullable(),
  question: z.string().nullable(),
  reason: z.string(),
})

export type NavigationDecision = z.infer<typeof NavigationDecisionSchema>

function catalogAsText(): string {
  return PAGE_CATALOG.map((p) => `- ${p.slug}: ${p.title} - ${p.description}`).join('\n')
}

export const NAVIGATION_SYSTEM_PROMPT = `You are the navigator for newtuple.com. A visitor, or an AI agent acting for one, says what they want in plain language. Your job is to decide exactly one of four things.

The complete, real list of pages on this site:
${catalogAsText()}

Decide:

1. "navigate" - the request clearly matches exactly one page above. Set page to that page's slug.
2. "clarify" - the request could reasonably match more than one page, or matches nothing above closely enough to be sure, and it is not a personalize or build_demo case either. Set question to one short, specific question that would resolve the ambiguity. Never guess. Never pick the closest page when you are not confident.
3. "build_demo" - the visitor is asking to see something built, tried, or prototyped rather than asking to read an existing page - for example "build me a chatbot", "make a dashboard for this", "can I try a demo of X". This site has a separate tool for that; you only detect the intent, you do not build anything yourself.
4. "personalize" - the visitor is describing themselves (their role, industry, systems, or goal) rather than asking to see a specific page or asking for something to be built - for example "I run digital transformation for a large retailer using SAP", "I'm a CTO evaluating vendors", "we're in financial services". This is the common case for a first message with no clear destination in mind. This site has a separate mechanism that reshapes the current page around that profile; you only detect that this is what the message is, you do not do the reshaping yourself.

How to tell "personalize" apart from "clarify": if the message gives real signal about who the visitor is or what they are working on, even if it does not point at one specific page, that is "personalize" - do not ask a clarifying question just because no single page matches. Only use "clarify" when the message is too vague to act on at all, in any of the other three ways - for example a single ambiguous word, or "tell me more" with nothing to go on.

Rules:
- Only ever return a page slug from the list above. Never invent one.
- If the visitor's own previous turns already answered what would otherwise need a clarifying question, use that context instead of asking again.
- reason is one short sentence explaining the decision, for logging - the visitor does not see it.
- question is one sentence, in plain language, never mentioning tools, schemas, or internal page slugs.
- Do not invent facts about Newtuple, its products, or its pricing beyond what the page descriptions above say.`
