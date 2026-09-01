// Server side of site navigation. Workers runtime, so fetch/Response/Map only -
// same constraint lib/demoApp/generate.ts already documents and follows.
//
// No database, no server-side session. The full conversation transcript
// (AgentInputItem[]) round-trips as a plain request field on every call; the
// only place it is ever kept between calls is the visitor's own browser
// (lib/navigate/session.ts), under a sliding 10-minute inactivity window.
// This function is a pure request-in, decision-and-history-out endpoint - it
// has no memory of its own.

import { Agent, Runner, setDefaultOpenAIKey, type AgentInputItem } from '@openai/agents'
import { NAVIGATION_SYSTEM_PROMPT, NavigationDecisionSchema, type NavigationDecision } from './schema'

export interface NavigateEnv {
  OPENAI_API_KEY?: string
  /** Defaults to a fast model, since a visitor is waiting on this in real time. */
  NAVIGATE_MODEL?: string
  NAVIGATE_RATE_LIMIT?: string
}

const DEFAULT_MODEL = 'gpt-5.4-nano'
const MAX_MESSAGE = 400
// Defense in depth: lib/navigate/session.ts already caps what a well-behaved
// client sends, but the server should never trust that on its own.
const MAX_HISTORY_ITEMS = 40

export class NavigationError extends Error {}

export interface NavigationResult {
  decision: NavigationDecision
  history: AgentInputItem[]
}

/** The message reaches a model, so it is data: flattened, capped, no control characters. */
const sanitizeMessage = (input: unknown): string =>
  String(input ?? '')
        .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_MESSAGE)

export async function runNavigation(message: string, history: AgentInputItem[], env: NavigateEnv): Promise<NavigationResult> {
  const apiKey = env.OPENAI_API_KEY
  if (!apiKey) throw new NavigationError('OPENAI_API_KEY is not set for this environment, so navigation cannot be classified')

  // Cloudflare Pages Functions pass secrets via context.env, read here as
  // `env`, never process.env - setDefaultOpenAIKey configures the SDK
  // explicitly instead of letting it look for a process.env value that may
  // not exist in this runtime.
  setDefaultOpenAIKey(apiKey)

  const agent = new Agent({
    name: 'Site Navigator',
    instructions: NAVIGATION_SYSTEM_PROMPT,
    model: env.NAVIGATE_MODEL || DEFAULT_MODEL,
    outputType: NavigationDecisionSchema,
    modelSettings: {
      reasoning: { effort: 'low' },
      // No server-side retention on OpenAI's side either - matches the
      // no-persistence requirement this feature was built around.
      store: false,
    },
  })

  const runner = new Runner()
  const nextHistory: AgentInputItem[] = [
    ...history,
    { role: 'user', content: [{ type: 'input_text', text: message }] },
  ]

  const result = await runner.run(agent, nextHistory)
  if (!result.finalOutput) throw new NavigationError('Site Navigator returned no output')

  const updatedHistory: AgentInputItem[] = [
    ...nextHistory,
    ...result.newItems.map((item) => item.rawItem),
  ]

  return { decision: result.finalOutput, history: updatedHistory }
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } })

// Same shape as lib/demoApp/generate.ts's allowDemoAppRequest: a module-scope
// Map, fixed one-minute window, per isolate. Not persisted, not shared across
// isolates - a best-effort throttle, not a source of truth, which is the
// correct level of rigor for this and matches the sibling feature exactly.
const buckets = new Map<string, number[]>()

function allowNavigateRequest(identifier: string, max: number): boolean {
  const now = Date.now()
  const windowStart = now - 60_000
  const recent = (buckets.get(identifier) ?? []).filter((ts) => ts > windowStart)
  if (recent.length >= max) return false
  recent.push(now)
  buckets.set(identifier, recent)
  return true
}

/** Shared by the Cloudflare Pages Function and the dev route handler. */
export async function handleNavigateRequest(request: Request, env: NavigateEnv): Promise<Response> {
  if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405)

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return json({ error: 'invalid_json' }, 400)
  }

  const message = sanitizeMessage(body.message)
  if (!message) return json({ error: 'empty_message', detail: 'Say what you want to do or see.' }, 400)

  const rawHistory = Array.isArray(body.history) ? body.history : []
  const history = rawHistory.slice(-MAX_HISTORY_ITEMS) as AgentInputItem[]

  const identifier = request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for') ?? 'anonymous'
  const max = Number(env.NAVIGATE_RATE_LIMIT ?? 20)
  if (!allowNavigateRequest(identifier, Number.isFinite(max) && max > 0 ? max : 20)) {
    return json({ error: 'rate_limited', detail: 'Too many navigation requests. Try again shortly.', retryAfterSeconds: 60 }, 429)
  }

  try {
    const result = await runNavigation(message, history, env)
    return json({ decision: result.decision, history: result.history })
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'unknown error'
    return json({ error: 'navigation_failed', detail }, 502)
  }
}
