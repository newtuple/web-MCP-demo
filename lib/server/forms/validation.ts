import { CareersLead, ContactLead, IntentType, ValidationResult } from './types'
import { isDisposableEmail } from './disposableEmails'

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/

const PHONE_REGEX = /^[+]?[\d\s()-]{7,20}$/


function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function normalizeText(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

function getString(
  source: Record<string, unknown>,
  key: string,
  {
    required = false,
    min = 0,
    max = 5000,
    fieldLabel = key,
  }: {
    required?: boolean
    min?: number
    max?: number
    fieldLabel?: string
  } = {},
): ValidationResult<string> {
  const raw = source[key]
  if (raw == null || raw === '') {
    if (required) {
      return { ok: false, error: `${fieldLabel} is required.` }
    }
    return { ok: true, data: '' }
  }

  if (typeof raw !== 'string') {
    return { ok: false, error: `${fieldLabel} must be text.` }
  }

  const value = normalizeText(raw)
  if (required && value.length < min) {
    return { ok: false, error: `${fieldLabel} is too short.` }
  }
  if (!required && value.length > 0 && value.length < min) {
    return { ok: false, error: `${fieldLabel} is too short.` }
  }
  if (value.length > max) {
    return { ok: false, error: `${fieldLabel} is too long.` }
  }

  return { ok: true, data: value }
}

function ensureEmail(value: string, fieldLabel: string): ValidationResult<string> {
  if (!EMAIL_REGEX.test(value)) {
    return { ok: false, error: `${fieldLabel} must be a valid email address.` }
  }
  if (/[\r\n]/.test(value)) {
    return { ok: false, error: `${fieldLabel} contains invalid characters.` }
  }
  const lowered = value.toLowerCase()
  if (isDisposableEmail(lowered)) {
    return { ok: false, error: 'Please use a non-disposable email address.' }
  }
  return { ok: true, data: lowered }
}

function ensurePhone(value: string, fieldLabel: string): ValidationResult<string> {
  if (!value) return { ok: true, data: '' }
  if (!PHONE_REGEX.test(value)) {
    return { ok: false, error: `${fieldLabel} must be a valid phone number.` }
  }
  return { ok: true, data: value.replace(/[\s()-]/g, '') }
}

function ensureHttpUrl(
  value: string,
  fieldLabel: string,
  { required }: { required: boolean },
): ValidationResult<string> {
  if (!value) {
    if (required) {
      return { ok: false, error: `${fieldLabel} is required.` }
    }
    return { ok: true, data: '' }
  }

  try {
    const parsed = new URL(value)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { ok: false, error: `${fieldLabel} must be a valid http(s) URL.` }
    }
    return { ok: true, data: value }
  } catch {
    return { ok: false, error: `${fieldLabel} must be a valid URL.` }
  }
}

function parseIntentType(raw: unknown): ValidationResult<IntentType> {
  if (raw !== 'job' && raw !== 'services') {
    return { ok: false, error: 'Intent type must be either job or services.' }
  }
  return { ok: true, data: raw }
}

export function validateContactSubmitPayload(payload: unknown): ValidationResult<ContactLead> {
  if (!isObject(payload)) {
    return { ok: false, error: 'Invalid payload.' }
  }
  if (!isObject(payload.lead)) {
    return { ok: false, error: 'Invalid payload: lead is required.' }
  }

  const lead = payload.lead
  const name = getString(lead, 'name', { required: true, min: 2, max: 120, fieldLabel: 'Name' })
  if (!name.ok) return name

  const email = getString(lead, 'email', {
    required: true,
    min: 5,
    max: 254,
    fieldLabel: 'Email',
  })
  if (!email.ok) return email
  const validEmail = ensureEmail(email.data, 'Email')
  if (!validEmail.ok) return validEmail

  const intentType = parseIntentType(lead.intentType)
  if (!intentType.ok) return intentType

  const intent = getString(lead, 'intent', { max: 1200, fieldLabel: 'Intent' })
  if (!intent.ok) return intent

  const resumeLink = getString(lead, 'resumeLink', { max: 600, fieldLabel: 'Resume link' })
  if (!resumeLink.ok) return resumeLink
  const validResume = ensureHttpUrl(resumeLink.data, 'Resume link', {
    required: intentType.data === 'job',
  })
  if (!validResume.ok) return validResume

  const phone = getString(lead, 'phone', { max: 20, fieldLabel: 'Phone' })
  if (!phone.ok) return phone
  const validPhone = ensurePhone(phone.data, 'Phone')
  if (!validPhone.ok) return validPhone

  const message = getString(lead, 'message', { max: 2500, fieldLabel: 'Message' })
  if (!message.ok) return message

  const consentRaw = lead.consent
  const consentValue = typeof consentRaw === 'boolean' ? consentRaw : false
  if (!consentValue) {
    return { ok: false, error: 'Consent is required to submit this form.' }
  }

  const transcriptRaw = typeof payload.transcript === 'string' ? payload.transcript : ''
  const transcript = normalizeText(transcriptRaw).slice(0, 12_000)

  if (!intent.data && !message.data) {
    return { ok: false, error: 'Please provide a message or intent.' }
  }

  if (intentType.data === 'job' && !validResume.data) {
    return { ok: false, error: 'Resume link is required for job inquiries.' }
  }

  return {
    ok: true,
    data: {
      name: name.data,
      email: validEmail.data,
      phone: validPhone.data,
      intentType: intentType.data,
      intent: intent.data,
      resumeLink: validResume.data,
      message: message.data,
      consent: consentValue,
      transcript,
    },
  }
}

export function validateCareersSubmitPayload(payload: unknown): ValidationResult<CareersLead> {
  if (!isObject(payload)) {
    return { ok: false, error: 'Invalid payload.' }
  }
  if (!isObject(payload.application)) {
    return { ok: false, error: 'Invalid payload: application is required.' }
  }

  const application = payload.application
  const name = getString(application, 'name', {
    required: true,
    min: 2,
    max: 120,
    fieldLabel: 'Name',
  })
  if (!name.ok) return name

  const email = getString(application, 'email', {
    required: true,
    min: 5,
    max: 254,
    fieldLabel: 'Email',
  })
  if (!email.ok) return email
  const validEmail = ensureEmail(email.data, 'Email')
  if (!validEmail.ok) return validEmail

  const role = getString(application, 'role', {
    required: true,
    min: 2,
    max: 200,
    fieldLabel: 'Role',
  })
  if (!role.ok) return role

  const location = getString(application, 'location', { max: 120, fieldLabel: 'Location' })
  if (!location.ok) return location

  const level = getString(application, 'level', { max: 120, fieldLabel: 'Level' })
  if (!level.ok) return level

  const employmentType = getString(application, 'employmentType', {
    max: 120,
    fieldLabel: 'Employment type',
  })
  if (!employmentType.ok) return employmentType

  const resumeLink = getString(application, 'resumeLink', {
    required: true,
    min: 10,
    max: 600,
    fieldLabel: 'Resume link',
  })
  if (!resumeLink.ok) return resumeLink
  const validResume = ensureHttpUrl(resumeLink.data, 'Resume link', { required: true })
  if (!validResume.ok) return validResume

  const message = getString(application, 'message', {
    required: true,
    min: 10,
    max: 2500,
    fieldLabel: 'Message',
  })
  if (!message.ok) return message

  const consentRaw = application.consent
  const consent = typeof consentRaw === 'boolean' ? consentRaw : false
  if (!consent) {
    return { ok: false, error: 'Consent is required to submit this form.' }
  }

  return {
    ok: true,
    data: {
      name: name.data,
      email: validEmail.data,
      role: role.data,
      location: location.data,
      level: level.data,
      employmentType: employmentType.data,
      resumeLink: validResume.data,
      message: message.data,
      consent,
    },
  }
}
