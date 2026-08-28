type Identifier = string

type RateLimitConfig = {
  windowMs: number
  maxRequests: number
}

type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSeconds: number | null }

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 60_000,
  maxRequests: 20,
}

const buckets = new Map<Identifier, number[]>()

function getConfig(): RateLimitConfig {
  const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS ?? DEFAULT_CONFIG.windowMs)
  const maxRequests = Number(process.env.RATE_LIMIT_MAX_REQUESTS ?? DEFAULT_CONFIG.maxRequests)

  return {
    windowMs: Number.isFinite(windowMs) && windowMs > 0 ? windowMs : DEFAULT_CONFIG.windowMs,
    maxRequests: Number.isFinite(maxRequests) && maxRequests > 0 ? maxRequests : DEFAULT_CONFIG.maxRequests,
  }
}

export function applyRateLimit(identifier: Identifier): RateLimitResult {
  const { windowMs, maxRequests } = getConfig()
  const now = Date.now()
  const windowStart = now - windowMs

  const existing = buckets.get(identifier) ?? []
  const recent = existing.filter((ts) => ts > windowStart)

  if (recent.length >= maxRequests) {
    const oldest = recent[0]
    const retryAfterMs = oldest + windowMs - now
    return {
      ok: false,
      retryAfterSeconds: retryAfterMs > 0 ? Math.ceil(retryAfterMs / 1000) : null,
    }
  }

  recent.push(now)
  buckets.set(identifier, recent)

  return { ok: true }
}

