// WebMCP surface for site navigation. Additive: these two tools sit alongside
// every tool already registered in WebMCPProvider.tsx.
//
// list_site_pages is read-only and always safe: an agent unsure what exists
// can check before guessing.
//
// navigate_site is the single, complete handler for "what brings you to
// Newtuple"-shaped requests - exactly what the site assistant chatbot does,
// so an agent gets the same four outcomes a human typing there does: sent to
// a real page, the current page personalized around their profile, the
// in-chat contact flow opened (with Regarding prefilled), or asked one
// clarifying question. The decision itself happens server-side
// (lib/navigate/agent.ts); this file only carries out whichever of the four
// it returns. Its session (lib/navigate/session.ts) lives in this browser
// tab, expires after ten minutes of inactivity, and is never sent anywhere
// but back to the same endpoint on the next call.

import { inferVisitorContext, productSlugForGoal, type VisitorContext } from '@/lib/adaptiveSite'
import { openAssistant } from '@/lib/assistant/store'
import { askNavigator } from '@/lib/navigate/client'
import { goToSitePage } from '@/lib/navigate/router'
import { PAGE_CATALOG } from '@/lib/navigate/schema'
import { closePageView, openPageView } from '@/lib/pageView/store'

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
        'The single, complete handler for a plain-language visitor request - exactly what the site\'s own assistant chatbot does. Depending on what the message actually is, this will: send the visitor to the one real newtuple.com page that matches it; personalize the current page around their role, industry or goal when the message is a profile statement rather than a request for one specific page; open the on-page contact flow (with the Regarding field prefilled) when the visitor wants to talk to the Newtuple team; or ask a single clarifying question when the message is too vague to act on any of those three ways. Remembers roughly the last ten minutes of this conversation in this browser tab; after that period of inactivity it starts over.',
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
          // WebMCP-native navigation: the current screen morphs into the
          // requested page (render_page_view mechanics) instead of routing.
          // "home" means the underlying site itself, so that one closes the
          // view and routes for real.
          if (decision.page === 'home') {
            closePageView()
            goToSitePage('/')
            return reply('Taking you back to the homepage.', decision)
          }
          // PageView itself patches the visitor context (contextPatchForSlug)
          // when the view opens, so theming follows without a second write here.
          openPageView(decision.page)
          return reply(
            `Rendered ${decision.page} in place on the current screen - no page load, URL unchanged. close_page_view restores the underlying page.`,
            decision,
          )
        }

        if (decision.decision === 'contact') {
          openAssistant({ contact: true, regarding: decision.regarding ?? undefined })
          return reply(
            'Opened the on-page contact flow so the visitor can leave their details. Use prepare_contact_request to prefill it further.',
            decision,
          )
        }

        if (decision.decision === 'personalize') {
          const context = replaceContext(inferVisitorContext(message))
          // A profile that clearly points at one product also brings that
          // product's view onto the screen - same as the human chatbot path.
          const productSlug = productSlugForGoal(context.goal)
          if (productSlug) openPageView(productSlug)
          return reply(
            `Personalized the current page around: ${context.goal}.${productSlug ? ` Also rendered ${productSlug} in place on the current screen.` : ''}`,
            { decision, context, renderedPageView: productSlug },
          )
        }

        return reply(decision.question || 'Could you say more about what you are looking for?', decision)
      },
    },
  ]
}
