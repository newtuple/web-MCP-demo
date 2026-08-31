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

    const updateRegistrationState = (state: WebMCPRegistrationState) => {
      window.__newtupleWebMCPRegistration = state
      document.documentElement.dataset.webmcpStatus = state.status
      document.documentElement.dataset.webmcpToolCount = String(state.registered)
    }

    const getModelContext = () => {
      if (document.modelContext) return { modelContext: document.modelContext, surface: 'document' as const }
      if (navigator.modelContext) return { modelContext: navigator.modelContext, surface: 'navigator' as const }
      return null
    }

    const registerTools = async (modelContext: WebMCPModelContext, surface: 'document' | 'navigator') => {
      if (window.__newtupleWebMCPToolsRegistered || disposed) return true

      window.__newtupleWebMCPToolsRegistered = true
      controller = new AbortController()
      const tools: WebMCPToolDefinition[] = []

      // Collect definitions first. Registration is awaited below so discovery
      // cannot be marked ready before the browser has accepted the tools.
      const register = (tool: WebMCPToolDefinition) => tools.push(tool)

      const readContext = () => contextRef.current
      const readGeneratedExperience = () => {
        try {
          const stored = window.sessionStorage.getItem('newtuple:generated-experience:v1')
          return stored ? JSON.parse(stored) : null
        } catch {
          return null
        }
      }

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
        name: 'get_current_experience',
        title: 'Read current ZeroNav experience',
        description: 'Return the currently compiled Newtuple experience, including generated navigation, hero, CTAs, proof, and visitor context.',
        annotations: { readOnlyHint: true },
        execute: () => readGeneratedExperience() ?? { experience: generateAdaptiveSiteVariant(readContext()), source: 'local_context' },
      })

      void register({
        name: 'get_generated_experience',
        title: 'Read generated experience blueprint',
        description: 'Return the exact OpenAI or fallback experience blueprint currently rendered for the visitor, including layout, theme, journey, metrics, sections, CTAs, and generation source.',
        annotations: { readOnlyHint: true },
        execute: () => readGeneratedExperience() ?? { status: 'not_generated', next: 'compile_experience' },
      })

      void register({
        name: 'explain_current_experience',
        title: 'Explain current experience',
        description: 'Explain why ZeroNav selected the current website structure and content for this visitor.',
        annotations: { readOnlyHint: true },
        execute: () => {
          const current = readContext()
          const currentVariant = generateAdaptiveSiteVariant(current)
          return { reason: currentVariant.reasonForVisitor, context: current, selectedNavigation: currentVariant.navigation.map((item) => item.label), selectedProof: currentVariant.caseStudySlugs }
        },
      })

      void register({
        name: 'request_deeper_technical_view',
        title: 'Request technical view',
        description: 'Recompile the current ZeroNav experience for a technically deep visitor, prioritizing architecture, integrations, APIs, and implementation proof.',
        annotations: { readOnlyHint: false },
        execute: () => toolResult(updateContext({ technical_depth: 'high' })),
      })

      void register({
        name: 'request_business_view',
        title: 'Request business view',
        description: 'Recompile the current ZeroNav experience for a business audience, prioritizing outcomes, proof, ROI, and the next decision.',
        annotations: { readOnlyHint: false },
        execute: () => toolResult(updateContext({ technical_depth: 'low' })),
      })

      void register({
        name: 'select_goal',
        title: 'Select visitor goal',
        description: 'Set the visitor mission from a plain-language goal and recompile the entire website around it.',
        inputSchema: { type: 'object', properties: { goal: { type: 'string', description: 'The outcome the visitor wants to accomplish.' } }, required: ['goal'] },
        annotations: { readOnlyHint: false },
        execute: (input = {}) => {
          const goal = String(input.goal ?? '')
          return toolResult(updateContext({ goal, intent: goal.toLowerCase().includes('product') ? 'products' : 'services' }))
        },
      })

      void register({
        name: 'compile_experience',
        title: 'Compile a new experience',
        description: 'Start a visible ZeroNav compile: interpret a visitor mission, select fresh content and proof, then reveal a newly generated interface after a short reasoning phase.',
        inputSchema: { type: 'object', properties: { statement: { type: 'string', description: 'The visitor mission to compile into a tailored Newtuple experience.' } }, required: ['statement'] },
        annotations: { readOnlyHint: false },
        execute: (input = {}) => {
          const statement = String(input.statement ?? '')
          window.dispatchEvent(new CustomEvent('newtuple-zeronav-compile', { detail: { statement } }))
          return { status: 'compiling', statement, next: 'wait_for_generated_experience' }
        },
      })

      void register({
        name: 'find_relevant_case_studies',
        title: 'Find relevant case studies',
        description: 'Return approved Newtuple case studies selected for the current visitor mission.',
        annotations: { readOnlyHint: true },
        execute: () => {
          const currentVariant = generateAdaptiveSiteVariant(readContext())
          return { slugs: currentVariant.caseStudySlugs, href: currentVariant.caseStudyHref }
        },
      })

      void register({
        name: 'generate_recommended_path',
        title: 'Generate recommended path',
        description: 'Return the current ZeroNav path in order: navigation, primary CTA, secondary CTA, proof, and suggested next prompts.',
        annotations: { readOnlyHint: true },
        execute: () => {
          const currentVariant = generateAdaptiveSiteVariant(readContext())
          return { steps: currentVariant.navigation, primaryCta: currentVariant.primaryCta, secondaryCta: currentVariant.secondaryCta, proof: currentVariant.caseStudySlugs, prompts: currentVariant.suggestedPrompts }
        },
      })

      void register({
        name: 'start_consultation',
        title: 'Prepare consultation',
        description: 'Prepare a consultation handoff from the current visitor mission. This creates no lead and sends no message until a human approves it.',
        annotations: { readOnlyHint: false },
        execute: () => ({ status: 'awaiting_human', approvalRequired: true, context: readContext(), next: 'human_review' }),
      })

      const emitSimulation = (input: Record<string, unknown>) => {
        window.dispatchEvent(new CustomEvent('newtuple-simulation-change', { detail: input }))
      }

      void register({
        name: 'create_business_scenario',
        title: 'Create business scenario',
        description: 'Configure the visible Reality Engine for supplier onboarding, customer support, or LLM evaluation.',
        inputSchema: { type: 'object', properties: { scenario: { type: 'string', enum: ['supplier', 'support', 'evaluation'] } }, required: ['scenario'] },
        annotations: { readOnlyHint: false },
        execute: (input = {}) => {
          const scenario = String(input.scenario ?? 'supplier')
          emitSimulation({ scenario })
          return { scenario, status: 'configured', next: 'run_transformation_simulation' }
        },
      })

      void register({
        name: 'run_transformation_simulation',
        title: 'Run transformation simulation',
        description: 'Run the visible before-and-after business impact simulation using monthly volume, manual work percentage, error rate, and approval handoffs.',
        inputSchema: {
          type: 'object',
          properties: {
            scenario: { type: 'string', enum: ['supplier', 'support', 'evaluation'] },
            volume: { type: 'number', description: 'Monthly work volume.' },
            manual: { type: 'number', description: 'Current manual work percentage.' },
            errors: { type: 'number', description: 'Current error or rework percentage.' },
            approvals: { type: 'number', description: 'Current approval handoffs.' },
          },
          required: ['volume', 'manual', 'errors', 'approvals'],
        },
        annotations: { readOnlyHint: false },
        execute: (input = {}) => {
          const volume = Number(input.volume ?? 10000)
          const manual = Number(input.manual ?? 70)
          const errors = Number(input.errors ?? 18)
          const approvals = Number(input.approvals ?? 5)
          emitSimulation({ ...input, volume, manual, errors, approvals, run: true })
          return {
            before: { volume, manual, errors, approvals },
            projected: { manual: Math.max(8, Math.round(manual * 0.28)), errors: Math.max(1, Math.round(errors * 0.2)), approvals: Math.max(1, approvals - 2) },
            approvalRequired: true,
          }
        },
      })

      void register({
        name: 'map_current_workflow',
        title: 'Map current workflow',
        description: 'Return the four-stage workflow map for the selected business scenario so an agent can inspect the bottleneck before recommending change.',
        inputSchema: { type: 'object', properties: { scenario: { type: 'string', enum: ['supplier', 'support', 'evaluation'] } }, required: ['scenario'] },
        annotations: { readOnlyHint: true },
        execute: (input = {}) => {
          const stages = {
            supplier: ['Supplier forms', 'Data validation', 'Human review', 'ERP / PIM sync'],
            support: ['Customer question', 'Intent routing', 'Agent response', 'Human escalation'],
            evaluation: ['Test set', 'Model run', 'Quality scoring', 'Release gate'],
          }[String(input.scenario ?? 'supplier') as 'supplier' | 'support' | 'evaluation'] ?? ['Supplier forms', 'Data validation', 'Human review', 'ERP / PIM sync']
          return { stages, bottleneck: stages[1], status: 'mapped' }
        },
      })

      void register({
        name: 'detect_bottleneck',
        title: 'Detect bottleneck',
        description: 'Inspect the visible operation and identify the stage where work is accumulating. This is read-only.',
        annotations: { readOnlyHint: true },
        execute: () => ({ stage: 'validation queue', severity: 'high', reason: 'manual review is serializing otherwise safe work', recommendedNextTool: 'deploy_newtuple_agents' }),
      })

      void register({
        name: 'deploy_newtuple_agents',
        title: 'Deploy Newtuple agents',
        description: 'Start the visible agent takeover sequence for the current operation. Safe work is automated and risky work remains behind human approval.',
        annotations: { readOnlyHint: false },
        execute: () => {
          emitSimulation({ action: 'deploy' })
          return { status: 'recovered', safeWorkAutomated: true, humanApproval: 'required_for_risky_records' }
        },
      })

      void register({
        name: 'request_human_approval',
        title: 'Request human approval',
        description: 'Surface the next risky operation for a human decision. This tool never approves or submits the action itself.',
        annotations: { readOnlyHint: false },
        execute: () => ({ status: 'awaiting_human', action: 'review_risky_records', approvalRequired: true }),
      })

      void register({
        name: 'stress_test_operation',
        title: 'Stress test operation',
        description: 'Increase the visible workload and run the operation under pressure to reveal whether the proposed controls hold.',
        annotations: { readOnlyHint: false },
        execute: () => {
          emitSimulation({ action: 'stress' })
          return { status: 'stress_test_started', volumeMultiplier: 1.67, next: 'deploy_newtuple_agents' }
        },
      })

      void register({
        name: 'compare_solution_paths',
        title: 'Compare solution paths',
        description: 'Compare the approved Newtuple solution paths for the visitor scenario with a clear trade-off between speed, control, and depth.',
        annotations: { readOnlyHint: true },
        execute: () => ({ paths: [{ name: 'Accelerator-first', fit: 'fastest proof', tradeoff: 'narrower initial scope' }, { name: 'Workflow-first', fit: 'best for governed operations', tradeoff: 'requires process mapping' }, { name: 'Agent-platform build', fit: 'highest long-term flexibility', tradeoff: 'larger implementation surface' }] }),
      })

      void register({
        name: 'generate_architecture',
        title: 'Generate architecture',
        description: 'Generate a bounded architecture outline from the visitor context. Returns components and integration questions; it does not deploy anything.',
        annotations: { readOnlyHint: true },
        execute: () => ({ sourceSystems: readContext().systems.length ? readContext().systems : ['ERP / CRM / data platform'], intelligence: ['Newtuple agents', 'workflow orchestration', 'evaluation and observability'], destination: readContext().goal, deploymentStatus: 'design_only', questions: ['Where does human approval remain mandatory?', 'What is the baseline metric?', 'Which data may leave the system boundary?'] }),
      })

      void register({
        name: 'calculate_business_impact',
        title: 'Calculate business impact',
        description: 'Return a conservative impact estimate from the currently supplied simulation assumptions.',
        inputSchema: { type: 'object', properties: { manual: { type: 'number' }, errors: { type: 'number' } }, required: ['manual', 'errors'] },
        annotations: { readOnlyHint: true },
        execute: (input = {}) => {
          const manual = Number(input.manual ?? 70)
          const errors = Number(input.errors ?? 18)
          return { manualReductionPercent: Math.round((1 - Math.max(8, manual * 0.28) / manual) * 100), errorReductionPercent: Math.round((1 - Math.max(1, errors * 0.2) / errors) * 100), method: 'conservative scenario estimate' }
        },
      })

      void register({
        name: 'create_executive_brief',
        title: 'Create executive brief',
        description: 'Prepare a concise executive brief from the current visitor context and recommended Newtuple path. This does not send anything.',
        annotations: { readOnlyHint: true },
        execute: () => {
          const current = readContext()
          const currentVariant = generateAdaptiveSiteVariant(current)
          return { title: 'Newtuple transformation brief', context: current, recommendation: currentVariant.primaryCta, evidence: currentVariant.caseStudySlugs, status: 'ready_to_copy' }
        },
      })

      void register({
        name: 'prepare_human_approved_workshop',
        title: 'Prepare human-approved workshop',
        description: 'Prepare a workshop proposal from the current mission. It never submits a lead, sends a message, or books a meeting without explicit human approval.',
        annotations: { readOnlyHint: true },
        execute: () => ({ status: 'awaiting_human', approvalRequired: true, deliverables: ['current-state workflow', 'simulation assumptions', 'recommended architecture questions', 'selected evidence'] }),
      })

      void register({
        name: 'reorder_navigation',
        title: 'Reorder navigation',
        description: 'Return the current adaptive Newtuple navigation for the visitor.',
        annotations: { readOnlyHint: true },
        execute: () => generateAdaptiveSiteVariant(readContext()).navigation,
      })

      void register({
        name: 'generate_page_variant',
        title: 'Generate page variant',
        description: 'Generate the complete current Newtuple.com page variant (navigation, hero, CTAs, relevant case studies) from the visible visitor context.',
        annotations: { readOnlyHint: true },
        execute: () => generateAdaptiveSiteVariant(readContext()),
      })

      void register({
        name: 'get_current_mission',
        title: 'Read current mission',
        description: 'Read the current visitor mission, including goal, role, industry, systems, confidence inputs, and the next recommended action.',
        annotations: { readOnlyHint: true },
        execute: () => {
          const current = readContext()
          const currentVariant = generateAdaptiveSiteVariant(current)
          return { context: current, mission: currentVariant.hero, primaryCta: currentVariant.primaryCta, caseStudySlugs: currentVariant.caseStudySlugs }
        },
      })

      void register({
        name: 'select_evidence',
        title: 'Select mission evidence',
        description: 'Select the approved Newtuple case studies and proof paths that best support the current visitor goal.',
        inputSchema: { type: 'object', properties: { goal: { type: 'string', description: 'Optional business goal to use when selecting evidence.' } } },
        annotations: { readOnlyHint: true },
        execute: () => {
          const currentVariant = generateAdaptiveSiteVariant(readContext())
          return { goal: currentVariant.context.goal, caseStudySlugs: currentVariant.caseStudySlugs, href: currentVariant.caseStudyHref }
        },
      })

      void register({
        name: 'prepare_next_action',
        title: 'Prepare next action',
        description: 'Prepare the next recommended Newtuple action for the visitor. This only returns a proposal; it never submits a lead or sends a message.',
        inputSchema: { type: 'object', properties: { approval: { type: 'string', enum: ['required'], description: 'Human approval is always required.' } }, required: ['approval'] },
        annotations: { readOnlyHint: true },
        execute: () => {
          const currentVariant = generateAdaptiveSiteVariant(readContext())
          return { action: currentVariant.primaryCta.label, href: currentVariant.primaryCta.href, approvalRequired: true, status: 'awaiting_human' }
        },
      })

      void register({
        name: 'select_case_studies',
        title: 'Select case studies',
        description: 'Return the case study slugs Newtuple is emphasizing for this visitor.',
        annotations: { readOnlyHint: true },
        execute: () => generateAdaptiveSiteVariant(readContext()).caseStudySlugs,
      })

      void register({
        name: 'choose_cta',
        title: 'Choose call to action',
        description: 'Return the primary and secondary call to action Newtuple selected for the current visitor.',
        annotations: { readOnlyHint: true },
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

      const signal = controller.signal
      const registeredTools: string[] = []
      const failedTools: Array<{ name: string; error: string }> = []

      updateRegistrationState({
        status: 'registering',
        surface,
        registered: 0,
        total: tools.length,
        toolNames: [],
        failedTools: [],
      })

      for (const tool of tools) {
        if (disposed || signal.aborted) return false

        try {
          try {
            await Promise.resolve(modelContext.registerTool(tool, { signal }))
          } catch {
            if (signal.aborted) return false
            // WebMCP is still a draft. Some implementations expose the same
            // method without the registration-options argument.
            await Promise.resolve(modelContext.registerTool(tool))
          }
          registeredTools.push(tool.name)
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error)
          failedTools.push({ name: tool.name, error: message })
          console.warn(`[WebMCP] Failed to register ${tool.name}: ${message}`)
        }
      }

      const ready = registeredTools.length > 0
      window.__newtupleWebMCPToolsRegistered = ready
      updateRegistrationState({
        status: ready ? 'ready' : 'error',
        surface,
        registered: registeredTools.length,
        total: tools.length,
        toolNames: registeredTools,
        failedTools,
      })

      if (ready) {
        window.dispatchEvent(new CustomEvent('newtuple-webmcp-ready', {
          detail: window.__newtupleWebMCPRegistration,
        }))
      }

      return ready
    }

    const waitBeforeRetry = (delay = 500) => new Promise<void>((resolve) => {
      retryTimer = window.setTimeout(resolve, delay)
    })

    const startRegistration = async () => {
      // Yield once so React Strict Mode can complete its development-only
      // setup/cleanup probe without leaving duplicate tools in draft hosts
      // that do not implement AbortSignal-based unregistration yet.
      await waitBeforeRetry(0)

      while (!disposed) {
        const availableContext = getModelContext()
        if (!availableContext) {
          updateRegistrationState({
            status: 'waiting',
            surface: 'none',
            registered: 0,
            total: 0,
            toolNames: [],
            failedTools: [],
          })
        } else if (typeof availableContext.modelContext.registerTool === 'function') {
          const ready = await registerTools(availableContext.modelContext, availableContext.surface)
          if (ready) return
        }

        await waitBeforeRetry()
      }
    }

    void startRegistration()

    return () => {
      disposed = true
      if (retryTimer) window.clearTimeout(retryTimer)
      controller?.abort()
      window.__newtupleWebMCPToolsRegistered = false
    }
  }, [replaceContext, resetContext, updateContext])

  useEffect(() => {
    contextRef.current = mergeVisitorContext(contextRef.current, context)
  }, [context])

  return null
}
