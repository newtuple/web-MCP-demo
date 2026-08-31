// Server side of page generation. Workers runtime, so fetch/Response/Map only.
//
// There is deliberately no local fallback page. The whole point is that every
// page is written for the request that asked for it, so when generation fails
// the visitor is told why instead of being handed a canned screen.

import { normalizeGeneratedApp } from './sanitize'
import { DEMO_APP_JSON_SCHEMA, DEMO_APP_SYSTEM_PROMPT, buildDemoAppUserPrompt, makeDesignSeed } from './schema'
import type { DesignSeed } from './schema'
import type { GeneratedApp } from './types'

export interface DemoAppEnv {
  OPENAI_API_KEY?: string
  /** Unused here; kept so the shared env type matches the rest of the site. */
  OPENAI_MODEL?: string
  /** Model that writes the page. Defaults to a fast one because the visitor waits. */
  DEMO_APP_MODEL?: string
  /** low | medium | high for reasoning-tier models ('minimal' is rejected) */
  DEMO_APP_REASONING_EFFORT?: string
  DEMO_APP_RATE_LIMIT?: string
  DEMO_APP_TIMEOUT_MS?: string
}

export interface DemoAppGeneration {
  app: GeneratedApp
  model: string
  design: DesignSeed
}

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'
const DEFAULT_MODEL = 'gpt-5.4-mini'
const EFFORTS = ['low', 'medium', 'high']
const REASONING_MODEL = /^(gpt-5|o[1-9])/
const MAX_STATEMENT = 600
const TIMEOUT_MS = 150_000

export class GenerationError extends Error {}

/** The statement reaches a model, so it is data: flattened, capped, no control characters. */
export const sanitizeStatement = (input: unknown): string =>
  String(input ?? '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_STATEMENT)

export async function generateDemoApp(statement: string, env: DemoAppEnv, seed?: number): Promise<DemoAppGeneration> {
  const apiKey = env.OPENAI_API_KEY
  if (!apiKey) throw new GenerationError('OPENAI_API_KEY is not set for this environment, so no page can be generated')

  const model = env.DEMO_APP_MODEL || DEFAULT_MODEL
  const configured = Number(env.DEMO_APP_TIMEOUT_MS ?? TIMEOUT_MS)
  const timeoutMs = Number.isFinite(configured) && configured > 5000 ? configured : TIMEOUT_MS
  const design = makeDesignSeed(seed)

  let response: Response
  try {
    response = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      signal: typeof AbortSignal.timeout === 'function' ? AbortSignal.timeout(timeoutMs) : undefined,
      body: JSON.stringify({
        model,
        ...(REASONING_MODEL.test(model)
          ? { reasoning_effort: EFFORTS.includes(env.DEMO_APP_REASONING_EFFORT ?? '') ? env.DEMO_APP_REASONING_EFFORT : 'low' }
          : {}),
        messages: [
          { role: 'system', content: DEMO_APP_SYSTEM_PROMPT },
          { role: 'user', content: buildDemoAppUserPrompt(statement, design) },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: { name: 'newtuple_generated_page', strict: true, schema: DEMO_APP_JSON_SCHEMA },
        },
      }),
    })
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'unknown error'
    throw new GenerationError(`the model did not answer in time (${reason})`)
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new GenerationError(`OpenAI returned ${response.status}${detail ? `: ${detail.slice(0, 200)}` : ''}`)
  }

  const payload = (await response.json()) as {
    model?: string
    choices?: Array<{ message?: { content?: string; refusal?: string }; finish_reason?: string }>
  }
  const choice = payload.choices?.[0]
  if (choice?.message?.refusal) throw new GenerationError(`the model declined: ${choice.message.refusal.slice(0, 200)}`)
  if (choice?.finish_reason === 'length') throw new GenerationError('the page came back truncated, try a smaller request')
  const content = choice?.message?.content
  if (!content) throw new GenerationError('the model returned no content')

  let parsed: unknown
  try {
    parsed = JSON.parse(content)
  } catch {
    throw new GenerationError('the model returned malformed JSON')
  }

  const app = normalizeGeneratedApp(parsed)
  return { app, model: payload.model ?? model, design }
}

// Per-isolate limiter. Cloudflare spreads requests across isolates, so this is
// a courtesy brake on a single hot client, not a hard quota.
const hits = new Map<string, number[]>()

export function allowDemoAppRequest(identifier: string, maxPerMinute = 6): boolean {
  const now = Date.now()
  const recent = (hits.get(identifier) ?? []).filter((at) => at > now - 60_000)
  if (recent.length >= maxPerMinute) {
    hits.set(identifier, recent)
    return false
  }
  recent.push(now)
  hits.set(identifier, recent)
  if (hits.size > 500) hits.clear()
  return true
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } })

/** Shared by the Cloudflare Pages Function and the dev route handler. */
export async function handleDemoAppRequest(request: Request, env: DemoAppEnv): Promise<Response> {
  if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405)

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return json({ error: 'invalid_json' }, 400)
  }

  const statement = sanitizeStatement(body.statement)
  if (statement.length < 4) return json({ error: 'statement_too_short', detail: 'Say what to build in a sentence.' }, 400)

  const identifier = request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for') ?? 'anonymous'
  const max = Number(env.DEMO_APP_RATE_LIMIT ?? 6)
  if (!allowDemoAppRequest(identifier, Number.isFinite(max) && max > 0 ? max : 6)) {
    return json({ error: 'rate_limited', detail: 'Too many pages generated in the last minute. Try again shortly.', retryAfterSeconds: 60 }, 429)
  }

  const seed = typeof body.seed === 'number' && Number.isFinite(body.seed) ? body.seed : undefined

  try {
    const generated = await generateDemoApp(statement, env, seed)
    return json({
      statement,
      app: generated.app,
      model: generated.model,
      design: generated.design,
      source: 'openai',
    })
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'unknown error'
    return json({ error: 'generation_failed', detail }, 502)
  }
}
