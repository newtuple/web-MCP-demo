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
import { PAGE_CATALOG } from '@/lib/navigate/schema'
import { closePageView, contextPatchForSlug, openPageView, pageViewStore } from '@/lib/pageView/store'
import { describeToolCall } from '@/lib/agentActivity/describe'
import { logAgentActivity } from '@/lib/agentActivity/store'
import AgentActivityFeed from './AgentActivityFeed'
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

export default function WebMCPProvider({ careersRoles = [] }: { careersRoles?: CareerRole[] }) {
  const { context, variant, replaceContext, updateContext, resetContext } = useVisitorContext()
  const contextRef = useRef(context)
  const careersRolesRef = useRef(careersRoles)
  careersRolesRef.current = careersRoles

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
        // Every tool call surfaces in the on-screen activity feed, so a human
        // sharing the tab with an agent sees what it just did in plain
        // language, not just the resulting UI change.
        const observed: WebMCPToolDefinition = {
          ...tool,
          execute: async (input, options) => {
            const result = await tool.execute(input, options)
            try {
              logAgentActivity(tool.name, describeToolCall(tool.name, input, result))
            } catch {
              // Never let a feed-formatting bug break the actual tool call.
            }
            return result
          },
        }
        try {
          await modelContext.registerTool(observed, { signal })
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
          const current = generateAdaptiveSiteVariant(readContext())
          return {
            path: window.location.pathname,
            openPageView: pageViewStore.getSnapshot().slug,
            visitorContext: readContext(),
            isPersonalized: current.isPersonalized,
            adaptationSummary: current.adaptationSummary,
            navigation: current.navigation,
            hero: current.hero,
            primaryCta: current.primaryCta,
            contactRegarding: getContactRegarding() || null,
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
        description: 'Generate the complete current Newtuple.com page variant (navigation, hero, CTAs, relevant case studies) from the visible visitor context.',
        execute: () => generateAdaptiveSiteVariant(readContext()),
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
          'Render any real newtuple.com page IN PLACE on the current screen instead of navigating to it. The current route\'s content is swapped out with CSS, navigation and accent theme re-adapt to the requested page, and the URL does not change - so no page load and no lost state. Prefer this over sending the visitor to another URL. Use close_page_view to restore the underlying page.',
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

  return (
    <>
      <SiteAssistant />
      <AgentActivityFeed />
    </>
  )
}
