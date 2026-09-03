'use client'

import { useEffect, useRef } from 'react'
import {
  generateAdaptiveSiteVariant,
  inferVisitorContext,
  mergeVisitorContext,
  normalizeVisitorContext,
  type VisitorContext,
  type VisitorIntent,
} from '@/lib/adaptiveSite'
import { type CareerRole } from '@/lib/careers/roles'
import { getContactRegarding } from '@/lib/contactRegarding'
import { applyCareersFilters } from '@/lib/careers/store'
import { goToSitePage } from '@/lib/navigate/router'
import { PAGE_CATALOG } from '@/lib/navigate/schema'
import { applyPersonaAnswers, missingPersonaQuestions, personaTrack } from '@/lib/persona/questions'
import { getPersonaAnswers, recordPersonaAnswers } from '@/lib/persona/store'
import { type PageDetails } from '@/lib/pageView/details'
import { closePageView, contextPatchForSlug, openPageView, pageViewStore } from '@/lib/pageView/store'
import SiteAssistant from './SiteAssistant'
import { createCareersTools } from './careersTools'
import { createContactTools } from './contactTools'
import { createNavigateTools } from './navigateTools'
import { useVisitorContext } from './useVisitorContext'

const ACCENT_VARS: Record<VisitorIntent, Record<string, string>> = {
  general: {
    '--accent-50': '#eff4ff', '--accent-100': '#dbe6fe', '--accent-200': '#bfd3fe', '--accent-300': '#93b4fd',
    '--accent-400': '#6090fa', '--accent-500': '#3b6cf6', '--accent-600': '#254beb', '--accent-700': '#1d38d8',
    '--accent-800': '#1e2eaf', '--accent-900': '#0047AB', '--accent-950': '#001a45',
  },
  services: {
    '--accent-50': '#ecfeff', '--accent-100': '#cffafe', '--accent-200': '#a5f3fc', '--accent-300': '#67e8f9',
    '--accent-400': '#22d3ee', '--accent-500': '#06b6d4', '--accent-600': '#0891b2', '--accent-700': '#0e7490',
    '--accent-800': '#155e75', '--accent-900': '#164e63', '--accent-950': '#083344',
  },
  products: {
    '--accent-50': '#fffbeb', '--accent-100': '#fef3c7', '--accent-200': '#fde68a', '--accent-300': '#fcd34d',
    '--accent-400': '#fbbf24', '--accent-500': '#f59e0b', '--accent-600': '#d97706', '--accent-700': '#b45309',
    '--accent-800': '#92400e', '--accent-900': '#78350f', '--accent-950': '#451a03',
  },
  careers: {
    '--accent-50': '#ecfdf5', '--accent-100': '#d1fae5', '--accent-200': '#a7f3d0', '--accent-300': '#6ee7b7',
    '--accent-400': '#34d399', '--accent-500': '#10b981', '--accent-600': '#059669', '--accent-700': '#047857',
    '--accent-800': '#065f46', '--accent-900': '#064e3b', '--accent-950': '#022c22',
  },
}

const visitorContextSchema = {
  type: 'object',
  properties: {
    intent: { type: 'string', enum: ['general', 'services', 'products', 'careers'] },
    industry: { type: 'string', description: 'Visitor industry, for example retail, financial services, healthcare, aviation, or agencies.' },
    role: { type: 'string', enum: ['CIO', 'CTO', 'Data Leader', 'Operations Leader', 'Founder', 'Candidate', 'Unknown'] },
    systems: { type: 'array', description: 'Enterprise systems or platforms the visitor cares about.', items: { type: 'string' } },
    goal: { type: 'string', description: 'Primary outcome the visitor wants, such as product-data automation or production AI readiness.' },
    technical_depth: { type: 'string', enum: ['low', 'medium', 'high'] },
    buying_stage: { type: 'string', enum: ['exploring', 'evaluating', 'ready', 'implementation'] },
  },
}

const toolResult = (context: VisitorContext) => {
  const variant = generateAdaptiveSiteVariant(context)
  return {
    context,
    adaptationSummary: variant.adaptationSummary,
    intent: variant.intent,
    navigation: variant.navigation,
    hero: variant.hero,
    primaryCta: variant.primaryCta,
  }
}

export default function WebMCPProvider({
  careersRoles = [],
  pageDetails = {},
}: {
  careersRoles?: CareerRole[]
  pageDetails?: Record<string, PageDetails>
}) {
  const { context, variant, replaceContext, updateContext, resetContext } = useVisitorContext()
  const contextRef = useRef(context)
  const careersRolesRef = useRef(careersRoles)
  careersRolesRef.current = careersRoles
  const pageDetailsRef = useRef(pageDetails)
  pageDetailsRef.current = pageDetails

  useEffect(() => {
    contextRef.current = context
  }, [context])

  useEffect(() => {
    const vars = ACCENT_VARS[variant.intent]
    const root = document.documentElement
    Object.entries(vars).forEach(([key, value]) => root.style.setProperty(key, value))
  }, [variant.intent])

  useEffect(() => {
    let disposed = false
    let retryTimer: number | undefined
    let controller: AbortController | null = null

    const getModelContext = () => document.modelContext ?? navigator.modelContext

    const registerTools = (modelContext: WebMCPModelContext) => {
      if (window.__newtupleWebMCPToolsRegistered || disposed) return true

      window.__newtupleWebMCPToolsRegistered = true
      controller = new AbortController()

      const register = async (tool: WebMCPToolDefinition) => {
        const signal = controller?.signal
        if (!signal || signal.aborted) return
        try {
          await modelContext.registerTool(tool, { signal })
        } catch {
          if (!signal.aborted) window.__newtupleWebMCPToolsRegistered = false
        }
      }

      const readContext = () => contextRef.current

      // Read-before-act entry point: one call tells an agent everything about
      // the tab it is driving, so it never has to guess or "look" at pixels.
      void register({
        name: 'get_site_state',
        description:
          'Read the complete current state of newtuple.com in this tab: URL path, which in-place page view is open (if any), the visitor context, whether the site is personalized, the adaptive navigation and hero being rendered, and what a contact request would currently be regarding. Call this first to orient. Changes nothing.',
        annotations: { readOnlyHint: true },
        execute: () => {
          const context = readContext()
          const current = generateAdaptiveSiteVariant(context)
          const nextQuestions = missingPersonaQuestions(context, getPersonaAnswers())
          return {
            path: window.location.pathname,
            openPageView: pageViewStore.getSnapshot().slug,
            visitorContext: context,
            isPersonalized: current.isPersonalized,
            adaptationSummary: current.adaptationSummary,
            navigation: current.navigation,
            hero: current.hero,
            primaryCta: current.primaryCta,
            contactRegarding: getContactRegarding() || null,
            personalization: {
              complete: nextQuestions.length === 0,
              nextQuestions: nextQuestions.slice(0, 2),
              hint:
                nextQuestions.length > 0
                  ? 'The site can be tailored further: ask the visitor these questions, then call answer_personalization_questions.'
                  : 'Persona is complete for this track.',
            },
          }
        },
      })

      // THE entry point: an agent whose user asks "how can Newtuple help me?"
      // calls this first. It returns the guided script - the WebMCP-protocol
      // prompt for this site - that walks the agent through eliciting the
      // persona, customizing the site, grounding answers in real experience,
      // and (with consent) initiating contact.
      void register({
        name: 'how_can_newtuple_help',
        title: 'How can Newtuple help me? (start here)',
        description:
          'START HERE when the visitor wants to know how Newtuple can help them. Returns the guided script for this site: the questions to ask the visitor (use case, industry, role), the tools that then customize the whole website for their persona, the tool that grounds your answers in Newtuple\'s real case studies and testimonials, and how to initiate contact with Newtuple on the visitor\'s behalf. Changes nothing by itself.',
        annotations: { readOnlyHint: true },
        execute: () => {
          const context = readContext()
          const questions = missingPersonaQuestions(context, getPersonaAnswers())
          return {
            prompt: [
              'You are helping this visitor discover how Newtuple (production AI agents, apps, and accelerators) can help THEM. Follow these steps:',
              '1. ASK the visitor the questions listed under "questions" (fixed options included). Start with their use case and industry in their own words too. These are the ONLY questions to ask - never ask whether to render, show, or change the page.',
              '2. APPLY their answers with answer_personalization_questions (and/or set_visitor_context for details like industry, systems, goal). The whole website re-themes immediately, and industry or product answers AUTOMATICALLY render the matching page on the visitor\'s screen - no extra call and no permission needed.',
              '3. If no page rendered automatically (check the tool result\'s renderedPageView), call render_page_view yourself for the most relevant page (e.g. social-care-healthcare for a shelter or care provider). Do this proactively - never ask the visitor for permission to show a page; rendering is instant, non-destructive, and reversible with close_page_view.',
              '4. GROUND your answers in get_page_details for that page: it returns what Newtuple can do, production case studies, and client testimonials. Quote this real experience - do not invent claims.',
              '5. OFFER a clear next step: with the visitor\'s explicit consent, submit_contact_request sends their details and use case to the Newtuple team (or prepare_contact_request lets them confirm on screen).',
            ].join('\n'),
            questions,
            currentPersonaComplete: questions.length === 0,
            pagesYouCanRender: PAGE_CATALOG.filter((p) => p.slug !== 'home').map((p) => p.slug),
          }
        },
      })

      // Real page substance for grounded answers: what Newtuple can do on
      // that page's topic, case-study proof, and the client testimonial -
      // extracted from the page's own content, not invented.
      void register({
        name: 'get_page_details',
        description:
          'Read the full substance of one newtuple.com page: what Newtuple can do in that area, production case-study proof points, client testimonial, and the page\'s call to action. Use this to answer "what can you do for me?" and "do you have experience with X?" from real site content. Changes nothing.',
        inputSchema: {
          type: 'object',
          properties: {
            page: {
              type: 'string',
              enum: PAGE_CATALOG.filter((p) => p.slug !== 'home').map((p) => p.slug),
              description: 'The page to read. Same slugs list_site_pages returns.',
            },
          },
          required: ['page'],
        },
        annotations: { readOnlyHint: true },
        execute: (input = {}) => {
          const slug = String(input.page ?? '')
          const catalogEntry = PAGE_CATALOG.find((p) => p.slug === slug)
          const detail = pageDetailsRef.current[slug]
          if (!catalogEntry) return { ok: false, error: `Unknown page: ${slug}. Call list_site_pages for valid slugs.` }
          return { ok: true, page: catalogEntry, details: detail ?? null }
        },
      })

      // Elicitation: information requests answered WITH questions when the
      // persona is still unknown. The agent relays these to its user, then
      // writes the answers back - the site reshapes and, for careers and
      // product answers, the matching page comes up on screen too.
      void register({
        name: 'get_personalization_questions',
        description:
          'Get the questions that would let newtuple.com tailor its information to this visitor. Questions BRANCH by visitor type: a job seeker, a services buyer, and a product evaluator each get different questions, and the first question decides which track applies. Ask the visitor these (each has fixed answer options), then call answer_personalization_questions with their answers. Already-answered questions are not repeated. Changes nothing.',
        annotations: { readOnlyHint: true },
        execute: () => {
          const context = readContext()
          const questions = missingPersonaQuestions(context, getPersonaAnswers())
          return {
            track: personaTrack(context),
            complete: questions.length === 0,
            questions,
            howToAnswer:
              'Call answer_personalization_questions with {"answers": {"<question id>": "<option value>"}}. Batch several at once.',
          }
        },
      })

      void register({
        name: 'answer_personalization_questions',
        description:
          'Apply the visitor\'s answers to the personalization questions from get_personalization_questions. The site rebuilds around the answers immediately: theme, navigation and hero adapt; a product-area answer also renders that product\'s page in place; career answers filter the careers page like a human using its controls. Returns the remaining questions (the track can add new ones after the first answer) - keep going until complete.',
        inputSchema: {
          type: 'object',
          properties: {
            answers: {
              type: 'object',
              description: 'Map of question id to chosen option value, e.g. {"intent": "careers", "career_focus": "business analyst"}.',
            },
          },
          required: ['answers'],
        },
        annotations: { readOnlyHint: false },
        execute: (input = {}) => {
          const result = applyPersonaAnswers((input.answers ?? {}) as Record<string, unknown>)
          if (Object.keys(result.applied).length === 0) {
            return { ok: false, invalid: result.invalid, error: 'No valid answers. Use question ids and option values from get_personalization_questions.' }
          }

          recordPersonaAnswers(result.applied)
          const context = Object.keys(result.patch).length > 0 ? updateContext(result.patch) : readContext()
          if (result.pageViewSlug) openPageView(result.pageViewSlug)
          if (result.careersFilters) {
            applyCareersFilters(result.careersFilters)
            if (window.location.pathname !== '/careers') goToSitePage('/careers')
          }

          const remaining = missingPersonaQuestions(context, getPersonaAnswers())
          return {
            ok: true,
            applied: result.applied,
            invalid: result.invalid,
            renderedPageView: result.pageViewSlug,
            careersFiltered: Boolean(result.careersFilters),
            remainingQuestions: remaining,
            complete: remaining.length === 0,
            site: toolResult(context),
          }
        },
      })

      void register({
        name: 'infer_visitor_context',
        description:
          'Infer a Newtuple visitor context from a plain-language statement and immediately rebuild Newtuple.com around that visitor: navigation, hero, and calls to action all change together.',
        inputSchema: {
          type: 'object',
          properties: {
            visitor_statement: {
              type: 'string',
              description: 'What brings the visitor (or the agent acting for them) to Newtuple, for example "I run digital transformation for a large retailer using SAP."',
            },
          },
          required: ['visitor_statement'],
        },
        execute: (input = {}) => {
          const statement = String(input.visitor_statement ?? '')
          const inferred = inferVisitorContext(statement)
          replaceContext(inferred)
          return toolResult(inferred)
        },
      })

      void register({
        name: 'set_visitor_context',
        description:
          'Set a structured Newtuple visitor context before or during a visit. An agent can call this to introduce its principal before the human ever sees the page.',
        inputSchema: visitorContextSchema,
        execute: (input = {}) => toolResult(replaceContext(normalizeVisitorContext(input as Partial<VisitorContext>))),
      })

      void register({
        name: 'update_visitor_profile',
        description: 'Partially update the current visitor profile and rebuild the visible site while preserving existing known context.',
        inputSchema: visitorContextSchema,
        execute: (input = {}) => toolResult(updateContext(input as Partial<VisitorContext>)),
      })

      void register({
        name: 'reorder_navigation',
        description: 'Return the current adaptive Newtuple navigation for the visitor.',
        execute: () => generateAdaptiveSiteVariant(readContext()).navigation,
      })

      void register({
        name: 'generate_page_variant',
        description: 'Generate the complete current Newtuple.com page variant (navigation, hero, CTAs, relevant case studies) from the visible visitor context. When the persona is still incomplete, the result includes the questions that would sharpen it - ask the visitor, then call answer_personalization_questions.',
        execute: () => {
          const context = readContext()
          const nextQuestions = missingPersonaQuestions(context, getPersonaAnswers())
          return {
            ...generateAdaptiveSiteVariant(context),
            personalization: { complete: nextQuestions.length === 0, nextQuestions: nextQuestions.slice(0, 2) },
          }
        },
      })

      void register({
        name: 'select_case_studies',
        description: 'Return the case study slugs Newtuple is emphasizing for this visitor.',
        execute: () => generateAdaptiveSiteVariant(readContext()).caseStudySlugs,
      })

      void register({
        name: 'choose_cta',
        description: 'Return the primary and secondary call to action Newtuple selected for the current visitor.',
        execute: () => {
          const variant = generateAdaptiveSiteVariant(readContext())
          return { primary: variant.primaryCta, secondary: variant.secondaryCta }
        },
      })

      void register({
        name: 'reset_visitor_context',
        description: 'Reset Newtuple.com to its neutral, non-adapted state.',
        execute: () => toolResult(resetContext()),
      })

      // In-place rendering: the WebMCP-native way to "go" somewhere. The
      // current screen morphs into the requested page with CSS (the route's
      // own content is hidden, the view renders in its place) and the
      // visitor-context theme re-paints to match - no page load, no route
      // change, all other tools stay registered.
      void register({
        name: 'render_page_view',
        description:
          'Render any real newtuple.com page IN PLACE on the current screen instead of navigating to it. The current route\'s content is swapped out with CSS, navigation and accent theme re-adapt to the requested page, and the URL does not change - so no page load and no lost state. Prefer this over sending the visitor to another URL, and render PROACTIVELY: never ask the visitor for permission to show a page - it is instant and close_page_view reverses it. Use close_page_view to restore the underlying page.',
        inputSchema: {
          type: 'object',
          properties: {
            page: {
              type: 'string',
              enum: PAGE_CATALOG.filter((p) => p.slug !== 'home').map((p) => p.slug),
              description: 'The catalog page to render in place. Same slugs list_site_pages returns.',
            },
          },
          required: ['page'],
        },
        annotations: { readOnlyHint: false },
        execute: (input = {}) => {
          const slug = String(input.page ?? '')
          const opened = openPageView(slug)
          if (!opened) return { ok: false, error: `Unknown page: ${slug}. Call list_site_pages for valid slugs.` }
          const context = updateContext(contextPatchForSlug(slug))
          const page = PAGE_CATALOG.find((p) => p.slug === slug)
          return {
            ok: true,
            rendered: { slug, title: page?.title, description: page?.description },
            // The same substance the visitor now sees on screen, so answers
            // can be grounded without a second call.
            details: pageDetailsRef.current[slug] ?? null,
            note: 'Page rendered in place - the URL did not change. close_page_view restores the underlying page.',
            adaptedContext: context,
          }
        },
      })

      void register({
        name: 'close_page_view',
        description:
          'Close the in-place page view opened by render_page_view and restore the underlying page\'s own content. Does nothing when no view is open.',
        execute: () => {
          const wasOpen = pageViewStore.getSnapshot().slug
          closePageView()
          return { ok: true, closed: wasOpen ?? null }
        },
      })

      // Routing to a real page needs nothing to be true first. Its own
      // session lives client-side only, see lib/navigate/session.ts.
      createNavigateTools(replaceContext).forEach((tool) => void register(tool))

      // Contact: prepare opens the on-page flow; submit sends a lead
      // directly with the visitor's consent.
      createContactTools().forEach((tool) => void register(tool))

      // Careers: list roles, read JDs, and filter the careers page UI the
      // way a human using the on-page controls would.
      createCareersTools(careersRolesRef.current).forEach((tool) => void register(tool))

      return true
    }

    const tryRegister = () => {
      const modelContext = getModelContext()
      if (!modelContext) return false
      return registerTools(modelContext)
    }

    if (!tryRegister()) {
      retryTimer = window.setInterval(() => {
        if (tryRegister() && retryTimer) {
          window.clearInterval(retryTimer)
          retryTimer = undefined
        }
      }, 250)
    }

    return () => {
      disposed = true
      if (retryTimer) window.clearInterval(retryTimer)
      controller?.abort()
      window.__newtupleWebMCPToolsRegistered = false
    }
  }, [replaceContext, resetContext, updateContext])

  useEffect(() => {
    contextRef.current = mergeVisitorContext(contextRef.current, context)
  }, [context])

  return <SiteAssistant />
}
