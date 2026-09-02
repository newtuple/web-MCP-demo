// WebMCP surface for contacting Newtuple. Deliberately does NOT submit the
// form itself: it opens the site assistant's in-chat contact flow, prefilled,
// and the human confirms and sends. Submitting stays a human action - the
// endpoint's bot checks (Turnstile) would reject an agent-side POST anyway.

import { openAssistant } from '@/lib/assistant/store'

const reply = (summary: string, data?: unknown) => ({
  content: [
    {
      type: 'text',
      text: data === undefined ? summary : `${summary}\n\n${JSON.stringify(data, null, 2)}`,
    },
  ],
})

export function createContactTools(): WebMCPToolDefinition[] {
  return [
    {
      name: 'prepare_contact_request',
      title: 'Prepare a contact request to Newtuple',
      description:
        'Open the on-page Newtuple contact flow, prefilled with what the contact is regarding (a product name or topic) and an optional draft message. The visitor reviews, completes their own name and email, and submits it themselves - this tool never sends anything on its own. The "regarding" value also auto-fills from the page the visitor navigated from, so pass it only when you know the topic better than the current page does.',
      inputSchema: {
        type: 'object',
        properties: {
          regarding: {
            type: 'string',
            description: 'What the contact request is about, e.g. "Flowtuple" or "retail AI automation".',
          },
          draft_message: {
            type: 'string',
            description: 'Optional draft message to prefill for the visitor to review and edit.',
          },
        },
      },
      annotations: { readOnlyHint: false },
      execute: (input = {}) => {
        const regarding = String(input.regarding ?? '').trim().slice(0, 200)
        const draft = String(input.draft_message ?? '').trim().slice(0, 2500)
        openAssistant({ contact: true, regarding: regarding || undefined, message: draft || undefined })
        return reply(
          'Contact flow opened on the page. The visitor completes their name and email and submits it themselves.',
          { regarding: regarding || null, draftPrefilled: Boolean(draft) },
        )
      },
    },
  ]
}
