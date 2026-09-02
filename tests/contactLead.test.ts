import { describe, expect, it } from 'vitest'
import { buildContactLeadEmail } from '../lib/server/forms/emailBuilders'
import { validateContactSubmitPayload } from '../lib/server/forms/validation'
import { NavigationDecisionSchema } from '../lib/navigate/schema'

const basePayload = {
  lead: {
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    phone: '',
    intentType: 'services',
    intent: 'Contact regarding Flowtuple',
    regarding: 'Flowtuple',
    resumeLink: '',
    message: 'We want approval workflows for our ops team.',
    consent: true,
  },
  transcript: 'User: hello',
}

describe('contact lead with regarding', () => {
  it('accepts and normalizes a regarding value', () => {
    const result = validateContactSubmitPayload(basePayload)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.data.regarding).toBe('Flowtuple')
  })

  it('treats regarding as optional', () => {
    const result = validateContactSubmitPayload({
      ...basePayload,
      lead: { ...basePayload.lead, regarding: undefined },
    })
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.data.regarding).toBe('')
  })

  it('rejects an over-long regarding value', () => {
    const result = validateContactSubmitPayload({
      ...basePayload,
      lead: { ...basePayload.lead, regarding: 'x'.repeat(201) },
    })
    expect(result.ok).toBe(false)
  })

  it('carries regarding into the lead email subject and body', () => {
    const validated = validateContactSubmitPayload(basePayload)
    expect(validated.ok).toBe(true)
    if (!validated.ok) return
    const email = buildContactLeadEmail(validated.data)
    expect(email.subject).toContain('regarding Flowtuple')
    expect(email.text).toContain('Regarding: Flowtuple')
  })
})

describe('navigation decision schema', () => {
  it('accepts a contact decision with regarding', () => {
    const parsed = NavigationDecisionSchema.safeParse({
      decision: 'contact',
      page: null,
      question: null,
      regarding: 'Flowtuple',
      reason: 'visitor asked to book a demo',
    })
    expect(parsed.success).toBe(true)
  })

  it('no longer accepts the removed build_demo decision', () => {
    const parsed = NavigationDecisionSchema.safeParse({
      decision: 'build_demo',
      page: null,
      question: null,
      regarding: null,
      reason: 'x',
    })
    expect(parsed.success).toBe(false)
  })
})
