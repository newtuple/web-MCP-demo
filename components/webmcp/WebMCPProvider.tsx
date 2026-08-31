'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import {
  generateAdaptiveSiteVariant,
  inferVisitorContext,
  mergeVisitorContext,
  normalizeVisitorContext,
  type VisitorContext,
  type VisitorIntent,
} from '@/lib/adaptiveSite'
import { demoAppStore } from '@/lib/demoApp/store'
import DemoAppLauncher from './DemoAppLauncher'
import { createDemoAppTools, createDemoBuilderTools } from './demoAppTools'
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

export default function WebMCPProvider() {
  const { context, variant, replaceContext, updateContext, resetContext } = useVisitorContext()
  const contextRef = useRef(context)
  // Held in state, not a ref, so the demo-app effect below re-runs the moment
  // the browser hands us a modelContext.
  const [modelContext, setModelContext] = useState<WebMCPModelContext | null>(null)
  const demo = useSyncExternalStore(demoAppStore.subscribe, demoAppStore.getSnapshot, demoAppStore.getServerSnapshot)

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
      setModelContext(modelContext)

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

      void register({
        name: 'infer_visitor_context',
        description:
          'Infer a Newtuple visitor context from a plain-language statement and immediately rebuild Newtuple.com around that visitor: navigation, hero, and calls to action all change together.',
        inputSchema: {
          type: 'object',
          properties: {
            visitor_statement: {
              type: 'string',
              description: 'What the visitor or their agent says they are trying to improve, for example "I run digital transformation for a large retailer using SAP."',
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

      // Always possible: building a demo app needs nothing to be true first.
      createDemoBuilderTools().forEach((tool) => void register(tool))

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

  // Dynamic registration, per the WebMCP pattern: the demo_app_* tools exist
  // only while a demo app is on screen, and their action_id enums are built
  // from that app. Closing the app aborts the controller, so the tools leave
  // the agent's menu instead of failing when called.
  const demoAppId = demo.session?.app.id ?? ''
  // The page's own tool names are the tool surface, so they are the registration
  // key: a newly generated page brings a different set.
  const demoActionKey = demo.session?.app.tools.map((tool) => tool.name).join(',') ?? ''

  useEffect(() => {
    const session = demoAppStore.getSnapshot().session
    if (!modelContext || !session) return

    const controller = new AbortController()
    const tools = createDemoAppTools(session)
    let cancelled = false

    void (async () => {
      for (const tool of tools) {
        if (cancelled || controller.signal.aborted) return
        try {
          await modelContext.registerTool(tool, { signal: controller.signal })
        } catch {
          // a browser that rejects one tool should not lose the rest
        }
      }
      if (!cancelled) window.__newtupleDemoAppToolCount = tools.length
    })()

    return () => {
      cancelled = true
      controller.abort()
      window.__newtupleDemoAppToolCount = 0
    }
  }, [modelContext, demoAppId, demoActionKey])

  return <DemoAppLauncher />
}
