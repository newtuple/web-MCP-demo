// WebMCP surface for contacting Newtuple. Two levels:
//
// prepare_contact_request - opens the on-page contact flow prefilled; the
// human completes and sends. Always works.
//
// submit_contact_request - submits directly, no on-screen form and no click,
// for agents acting with the visitor's explicit consent. Works wherever the
// endpoint's Turnstile check is not enforced (local/dev, or prod with it
// disabled); when Turnstile rejects the agent-side POST, the tool says so and
// points at prepare_contact_request as the human-confirmed fallback.

import { openAssistant } from '@/lib/assistant/store'
import { getContactRegarding } from '@/lib/contactRegarding'

// The endpoint discards submissions "filled in" faster than a human could
// have; anchoring the timestamp to page load reflects reality for an agent
// that has been on the page since it opened.
const PAGE_LOADED_AT = Date.now()

const isEmail = (value: string) =>
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/.test(value)

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
    {
      name: 'submit_contact_request',
      title: 'Submit a contact request to Newtuple',
      description:
        'Submit a contact request to the Newtuple team directly - no on-screen form, no clicks. Only call this when the visitor you act for has explicitly agreed to be contacted by Newtuple (consent must be true). regarding defaults to the page the visitor navigated from when omitted. If the endpoint\'s bot verification rejects the request (production configurations), fall back to prepare_contact_request so the visitor can confirm on screen.',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: "The visitor's name." },
          email: { type: 'string', description: "The visitor's email address." },
          phone: { type: 'string', description: 'Optional phone number.' },
          message: { type: 'string', description: 'What the visitor wants to say to the Newtuple team.' },
          regarding: { type: 'string', description: 'What this is about, e.g. "Flowtuple". Defaults to the page the visitor came from.' },
          consent: { type: 'boolean', description: 'Must be true: the visitor agreed to be contacted by Newtuple.' },
        },
        required: ['name', 'email', 'message', 'consent'],
      },
      annotations: { readOnlyHint: false },
      execute: async (input = {}) => {
        const name = String(input.name ?? '').trim().slice(0, 120)
        const email = String(input.email ?? '').trim().slice(0, 254)
        const phone = String(input.phone ?? '').trim().slice(0, 20)
        const message = String(input.message ?? '').trim().slice(0, 2500)
        const regarding = (String(input.regarding ?? '').trim() || getContactRegarding()).slice(0, 200)
        const consent = input.consent === true

        if (!consent) return reply('Not submitted: consent must be true - the visitor has to agree to be contacted by Newtuple.')
        if (name.length < 2) return reply('Not submitted: name is required.')
        if (!isEmail(email)) return reply('Not submitted: a valid email address is required.')
        if (!message) return reply('Not submitted: message is required.')

        let response: Response
        try {
          response = await fetch('/api/contact/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              lead: {
                name,
                email,
                phone,
                intentType: 'services',
                intent: regarding ? `Contact regarding ${regarding}` : 'Contact via WebMCP agent',
                resumeLink: '',
                message,
                consent: true,
                regarding,
              },
              transcript: 'Submitted through the submit_contact_request WebMCP tool by an agent acting for the visitor.',
              _hp: '',
              _t: PAGE_LOADED_AT,
              _cf_turnstile: '',
            }),
          })
        } catch {
          return reply('Network error reaching /api/contact/submit. Try again in a moment.')
        }

        const payload = (await response.json().catch(() => ({}))) as { error?: string }
        if (!response.ok) {
          const botBlocked = (payload.error ?? '').toLowerCase().includes('bot verification')
          return reply(
            botBlocked
              ? 'The endpoint requires on-screen bot verification here. Call prepare_contact_request instead - it opens the flow prefilled for the visitor to confirm.'
              : `Submission failed: ${payload.error ?? `HTTP ${response.status}`}`,
            { status: response.status },
          )
        }

        return reply(`Contact request submitted to the Newtuple team${regarding ? ` regarding ${regarding}` : ''}. They reply by email.`, {
          ok: true,
          regarding: regarding || null,
        })
      },
    },
  ]
}
