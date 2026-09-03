import { applyRateLimit } from '../../rateLimit'
import { sendLeadEmail } from '../email/mailer'
import { buildCareersLeadEmail, buildContactLeadEmail } from '../forms/emailBuilders'
import { validateCareersSubmitPayload, validateContactSubmitPayload } from '../forms/validation'
import { verifyTurnstileToken } from '../turnstile'

type RuntimeEnv = Record<string, string | undefined>

const MIN_SUBMIT_TIME_MS = 3000

function getEnvValue(name: string, env?: RuntimeEnv): string | undefined {
  const value = env?.[name] ?? process.env[name]
  return typeof value === 'string' ? value.trim() : undefined
}

function jsonResponse(status: number, body: Record<string, unknown>, extraHeaders?: HeadersInit) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...(extraHeaders ?? {}),
    },
  })
}

function getClientIp(request: Request) {
  const cfIp = request.headers.get('cf-connecting-ip')?.trim()
  if (cfIp) return cfIp

  const forwardedFor = request.headers.get('x-forwarded-for') ?? ''
  const ip = forwardedFor.split(',')[0]?.trim()
  return ip || 'unknown'
}

function isSpamPayload(payload: Record<string, unknown>): boolean {
  // Honeypot: bots fill hidden fields that real users never see
  if (typeof payload._hp === 'string' && payload._hp.length > 0) return true

  // Time check: reject if form was submitted in under 3 seconds
  if (typeof payload._t === 'number') {
    const elapsed = Date.now() - payload._t
    if (elapsed < MIN_SUBMIT_TIME_MS) return true
  }

  return false
}

async function verifyTurnstile(
  payload: Record<string, unknown>,
  ip: string,
  env?: RuntimeEnv,
): Promise<boolean> {
  const secretKey = getEnvValue('TURNSTILE_SECRET_KEY', env)
  if (!secretKey) return true // skip in dev when not configured

  const token = typeof payload._cf_turnstile === 'string' ? payload._cf_turnstile : ''
  if (!token) return false

  const result = await verifyTurnstileToken(token, secretKey, ip)
  return result.success
}

async function sendLeadWithOptionalEnv(
  payload: Parameters<typeof sendLeadEmail>[0],
  env?: RuntimeEnv,
) {
  if (env) {
    await sendLeadEmail(payload, { env })
    return
  }
  await sendLeadEmail(payload)
}

async function safeParseJson(request: Request) {
  try {
    return await request.json()
  } catch {
    return null
  }
}

/** True when delivery can actually work: a recipient plus either SMTP or SES credentials. */
function emailConfigured(toVar: string, env?: RuntimeEnv): boolean {
  if (!getEnvValue(toVar, env)) return false
  const smtp =
    getEnvValue('SMTP_HOST', env) && getEnvValue('SMTP_USER', env) && getEnvValue('SMTP_PASSWORD', env)
  const ses =
    getEnvValue('AWS_ACCESS_KEY_ID', env) &&
    getEnvValue('AWS_SECRET_ACCESS_KEY', env) &&
    getEnvValue('SES_FROM_EMAIL', env)
  return Boolean(smtp || ses)
}

/**
 * Local development without SES credentials: accept the lead and log it to
 * the dev server console instead of failing with a 500, so the contact flow
 * can be demoed end to end. Production (NODE_ENV !== 'development') still
 * requires real configuration.
 */
function devLogFallback(kind: string, subject: string, text: string): Response | null {
  if (process.env.NODE_ENV !== 'development') return null
  console.warn(`[dev] ${kind} email not configured - logging lead instead of sending:\n${subject}\n${text}`)
  return jsonResponse(200, { ok: true, delivered: false, note: 'Email not configured; lead logged to the dev server console.' })
}

export async function handleContactSubmitRequest(request: Request, env?: RuntimeEnv) {
  const clientIp = getClientIp(request)
  const identifier = `${clientIp}:contact-submit`
  const result = applyRateLimit(identifier)

  if (!result.ok) {
    return jsonResponse(
      429,
      { error: 'Too many requests. Please try again later.' },
      result.retryAfterSeconds ? { 'Retry-After': String(result.retryAfterSeconds) } : undefined,
    )
  }

  const payload = await safeParseJson(request)
  if (payload === null) {
    return jsonResponse(400, { error: 'Invalid JSON payload.' })
  }

  // Silent discard for honeypot/timing spam
  if (isSpamPayload(payload)) {
    return jsonResponse(200, { ok: true })
  }

  // Turnstile verification
  const turnstileOk = await verifyTurnstile(payload, clientIp, env)
  if (!turnstileOk) {
    return jsonResponse(400, { error: 'Bot verification failed. Please try again.' })
  }

  const validated = validateContactSubmitPayload(payload)
  if (!validated.ok) {
    return jsonResponse(400, { error: validated.error })
  }

  const email = buildContactLeadEmail(validated.data)

  const to = getEnvValue('CONTACT_LEADS_EMAIL', env)
  if (!to || !emailConfigured('CONTACT_LEADS_EMAIL', env)) {
    const fallback = devLogFallback('contact', email.subject, email.text)
    if (fallback) return fallback
    return jsonResponse(500, { error: 'Email not configured.' })
  }

  try {
    await sendLeadWithOptionalEnv(
      {
        to,
        subject: email.subject,
        text: email.text,
        replyTo: validated.data.email,
      },
      env,
    )

    return jsonResponse(200, { ok: true })
  } catch (err) {
    console.error('Contact email error:', err)
    return jsonResponse(500, { error: 'Failed to send lead email.' })
  }
}

export async function handleCareersSubmitRequest(request: Request, env?: RuntimeEnv) {
  const clientIp = getClientIp(request)
  const identifier = `${clientIp}:careers-submit`
  const result = applyRateLimit(identifier)

  if (!result.ok) {
    return jsonResponse(
      429,
      { error: 'Too many requests. Please try again later.' },
      result.retryAfterSeconds ? { 'Retry-After': String(result.retryAfterSeconds) } : undefined,
    )
  }

  const payload = await safeParseJson(request)
  if (payload === null) {
    return jsonResponse(400, { error: 'Invalid JSON payload.' })
  }

  // Silent discard for honeypot/timing spam
  if (isSpamPayload(payload)) {
    return jsonResponse(200, { ok: true })
  }

  // Turnstile verification
  const turnstileOk = await verifyTurnstile(payload, clientIp, env)
  if (!turnstileOk) {
    return jsonResponse(400, { error: 'Bot verification failed. Please try again.' })
  }

  const validated = validateCareersSubmitPayload(payload)
  if (!validated.ok) {
    return jsonResponse(400, { error: validated.error })
  }

  const email = buildCareersLeadEmail(validated.data)

  const to = getEnvValue('CAREERS_LEADS_EMAIL', env)
  if (!to || !emailConfigured('CAREERS_LEADS_EMAIL', env)) {
    const fallback = devLogFallback('careers', email.subject, email.text)
    if (fallback) return fallback
    return jsonResponse(500, { error: 'Email not configured.' })
  }

  try {
    await sendLeadWithOptionalEnv(
      {
        to,
        subject: email.subject,
        text: email.text,
        replyTo: validated.data.email,
      },
      env,
    )

    return jsonResponse(200, { ok: true })
  } catch {
    return jsonResponse(500, { error: 'Failed to send lead email.' })
  }
}
