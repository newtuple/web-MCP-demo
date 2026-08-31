'use client'

// WebMCP surface for generated pages.
//
// Two layers, following the registration pattern in the WebMCP guidance:
//   - build_demo_app is always registered, because it is always possible.
//   - the page's own tools are registered only while that page is open, under
//     their own AbortController, with names and schemas taken from the manifest
//     the page shipped with. Every call is forwarded into the sandbox, so the
//     function that runs is the page's own, the same one its buttons call.

import { toolInputSchema } from '@/lib/demoApp/sanitize'
import {
  buildDemoApp, closeDemoApp, getDemoSession, readPage, resetDemoApp, runPageTool,
} from '@/lib/demoApp/store'
import type { DemoSession } from '@/lib/demoApp/types'

/** Spec return shape: one text block the agent reads, carrying a summary and the data. */
const reply = (summary: string, data?: unknown) => ({
  content: [
    {
      type: 'text',
      text: data === undefined ? summary : `${summary}\n\n${JSON.stringify(data, null, 2)}`,
    },
  ],
})

const toolMenu = (session: DemoSession) =>
  session.app.tools
    .map((tool) => {
      const args = tool.params
        .map((param) => `${param.name}: ${param.type}${param.enumValues.length ? ` one of [${param.enumValues.join(' | ')}]` : ''}${param.required ? ' (required)' : ''}`)
        .join(', ')
      return `- ${tool.name}: ${tool.description}${args ? ` Args: ${args}.` : ' No arguments.'}${tool.mutates ? '' : ' Read only.'}`
    })
    .join('\n') || '(this page declared no tools of its own)'

const manifest = (session: DemoSession) => ({
  page: {
    id: session.app.id,
    title: session.app.title,
    kind: session.app.kind,
    design: session.app.designDirection,
    summary: session.app.summary,
    route: '/demo',
    builtFrom: session.statement,
    generatedBy: session.model,
  },
  agentBrief: session.app.agentBrief,
  humanStarters: session.app.starters,
  tools: session.app.tools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    mutates: tool.mutates,
    params: tool.params,
  })),
})

/** Always available: nothing about the page has to be true for this to work. */
export function createDemoBuilderTools(): WebMCPToolDefinition[] {
  return [
    {
      name: 'build_demo_app',
      title: 'Generate a working demo page',
      description:
        'Generate a working web application from a plain-language description and open it on newtuple.com at /demo. The page is written from scratch for the request - its own HTML, CSS, JavaScript, layout and visual design - so a landing page arrives as a landing page, a chatbot as a working chatbot, a dashboard as a dashboard, and the same request twice produces two different-looking pages. It runs in a sandboxed frame with no network access and synthetic data only. When this returns, the page has declared its own tools and they are registered for you: read them from the result or call demo_app_overview. Building another page replaces this one. Takes 20-60 seconds, because the page is being written.',
      annotations: { readOnlyHint: false },
      inputSchema: {
        type: 'object',
        properties: {
          statement: {
            type: 'string',
            description: 'What to build, in the visitor\'s own words. One or two sentences. Say what kind of thing it is, who uses it, and any systems or industry it belongs to, because the layout, the seeded data and the tools all come from this.',
          },
        },
        required: ['statement'],
      },
      execute: async (input = {}) => {
        const statement = String(input.statement ?? '')
        const result = await buildDemoApp(statement, 'agent')
        if (!result.ok || !result.session) return reply(result.message)
        const session = result.session
        return reply(
          `${result.message}\n\nHow to drive it:\n${session.app.agentBrief}\n\nTools this page implements, now registered:\n${toolMenu(session)}\n\nAlso available: demo_app_describe_page, demo_app_overview, demo_app_reset, close_demo_app.`,
          manifest(session),
        )
      },
    },
  ]
}

/** Registered only while a generated page is open. */
export function createDemoAppTools(session: DemoSession): WebMCPToolDefinition[] {
  const app = session.app

  const pageTools: WebMCPToolDefinition[] = app.tools.map((tool) => ({
    name: tool.name,
    title: tool.name.replace(/_/g, ' '),
    description: `${tool.description} (Implemented by the generated page "${app.title}" currently open at /demo. Calling it runs the page's own function, so the human sees the result immediately.)`,
    annotations: { readOnlyHint: !tool.mutates, untrustedContentHint: true },
    inputSchema: toolInputSchema(tool),
    execute: async (input = {}) => {
      const result = await runPageTool(tool.name, input, 'agent')
      return reply(`${result.ok ? 'Done' : 'Refused'}. ${result.message}`, result.data ?? null)
    },
  }))

  return [
    ...pageTools,
    {
      name: 'demo_app_overview',
      title: 'Read the demo page manifest',
      description: `Read what the page currently open at /demo is ("${app.title}", a ${app.kind}): its purpose, how it was generated, every tool it implements with the exact arguments, and how to drive it. Costs nothing and changes nothing. For the live contents of the page, use demo_app_describe_page.`,
      annotations: { readOnlyHint: true, untrustedContentHint: true },
      execute: () => {
        const current = getDemoSession()
        if (!current) return reply('No demo page is open. Call build_demo_app to generate one.')
        return reply(
          `"${current.app.title}" (${current.app.kind}) is open at /demo.\n\n${current.app.agentBrief}\n\nTools:\n${toolMenu(current)}`,
          manifest(current),
        )
      },
    },
    {
      name: 'demo_app_describe_page',
      title: 'Read the live demo page',
      description:
        'Read the current visible state of the generated page: its text as the human sees it, every control on it with labels and disabled state, and which tools the page actually implemented. Use it before acting to find real values, and after acting to confirm what changed. Changes nothing.',
      annotations: { readOnlyHint: true, untrustedContentHint: true },
      execute: async () => {
        const result = await readPage('agent')
        if (!result.ok) return reply(result.message)
        return reply('Live page state follows. Text is what the visitor sees right now.', result.data)
      },
    },
    {
      name: 'demo_app_reset',
      title: 'Reload the demo page',
      description: `Reload "${app.title}" from its generated source, which puts its data and its conversation back to how they loaded. The page itself is not regenerated and its tools stay registered.`,
      annotations: { readOnlyHint: false },
      execute: () => reply(resetDemoApp('agent').message),
    },
    {
      name: 'close_demo_app',
      title: 'Close the demo page',
      description: 'Close the generated page and send the browser back to the Newtuple homepage. Every tool belonging to the page is unregistered when this returns.',
      annotations: { readOnlyHint: false },
      execute: () => reply(closeDemoApp('agent').message),
    },
  ]
}
