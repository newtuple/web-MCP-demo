// WebMCP surface for site navigation. Additive: these two tools sit alongside
// every tool already registered in WebMCPProvider.tsx and the demo builder in
// demoAppTools.ts. Nothing existing is touched.
//
// list_site_pages is read-only and always safe: an agent unsure what exists
// can check before guessing, same "read before act" shape as get_current_experience.
//
// navigate_site is the single, complete handler for "what brings you to
// Newtuple"-shaped requests - exactly what the homepage's own Send button
// does, so an agent gets the same four outcomes a human clicking Send does:
// sent to a real page, told this is a build_demo_app case, the current page
// personalized around their profile, or asked one clarifying question. The
// decision itself happens server-side (lib/navigate/agent.ts); this file
// only carries out whichever of the four it returns. Its session
// (lib/navigate/session.ts) lives in this browser tab, expires after ten
// minutes of inactivity, and is never sent anywhere but back to the same
// endpoint on the next call.

import { inferVisitorContext, type VisitorContext } from '@/lib/adaptiveSite'
import { askNavigator } from '@/lib/navigate/client'
import { goToSitePage } from '@/lib/navigate/router'
import { PAGE_CATALOG, pageHref } from '@/lib/navigate/schema'

const reply = (summary: string, data?: unknown) => ({
  content: [
    {
      type: 'text',
      text: data === undefined ? summary : `${summary}\n\n${JSON.stringify(data, null, 2)}`,
    },
  ],
})

export function createNavigateTools(replaceContext: (input: Partial<VisitorContext>) => VisitorContext): WebMCPToolDefinition[] {
  return [
    {
      name: 'list_site_pages',
      title: 'List real Newtuple pages',
      description:
        'Read every real page on newtuple.com a visitor can be sent to, with its title and description. Call this before navigate_site if you are unsure what exists on the site. Changes nothing.',
      annotations: { readOnlyHint: true },
      execute: () => reply('Real pages on newtuple.com:', PAGE_CATALOG),
    },
    {
      name: 'navigate_site',
      title: 'Handle a "what brings you to Newtuple" request',
      description:
        'The single, complete handler for a plain-language visitor request - exactly what the homepage\'s own Send button does. Depending on what the message actually is, this will: send the visitor to the one real newtuple.com page that matches it; personalize the current page around their role, industry or goal when the message is a profile statement rather than a request for one specific page; say this sounds like something to build instead (call build_demo_app with the same request, this tool never builds anything itself); or ask a single clarifying question when the message is too vague to act on any of those three ways. Remembers roughly the last ten minutes of this conversation in this browser tab; after that period of inactivity it starts over.',
      inputSchema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'What the visitor, or the agent acting for them, said - in their own words.',
          },
        },
        required: ['message'],
      },
      annotations: { readOnlyHint: false },
      execute: async (input = {}) => {
        const message = String(input.message ?? '').trim()
        if (!message) return reply('Say what you want to do or see on newtuple.com.')

        const result = await askNavigator(message)
        if (!result.ok || !result.decision) {
          return reply(result.error ?? 'Navigation failed. Try again in a moment.')
        }

        const decision = result.decision

        if (decision.decision === 'navigate' && decision.page) {
          goToSitePage(pageHref(decision.page))
          return reply(`Taking you to ${decision.page}.`, decision)
        }

        if (decision.decision === 'build_demo') {
          return reply(
            'This sounds like something to build, not a page to visit. Call build_demo_app with the same request.',
            decision,
          )
        }

        if (decision.decision === 'personalize') {
          const context = replaceContext(inferVisitorContext(message))
          return reply(`Personalized the current page around: ${context.goal}.`, { decision, context })
        }

        return reply(decision.question || 'Could you say more about what you are looking for?', decision)
      },
    },
  ]
}
