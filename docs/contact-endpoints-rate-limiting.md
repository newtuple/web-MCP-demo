# Security audit: contact endpoints rate limiting

## Audit summary

A full security review of the codebase identified **one actionable vulnerability**: the two public contact endpoints had no abuse protection, exposing paid infrastructure (Resend email and LiteLLM) to uncontrolled consumption.

All other areas - secret handling, XSS surface, path traversal, SSRF, injection vectors, dependency security - were verified clean. No fabricated or theoretical issues; only the rate limiting gap warranted a code change.

## Vulnerability

This project exposes two unauthenticated contact-related endpoints backed by paid infrastructure:

- `_api_serverless/contact/submit/route.ts` – sends contact form leads via Resend email.
- `_api_serverless/contact/chat/stream/route.ts` – streams responses from a LiteLLM-compatible chat backend.

Without any protection, these endpoints could be abused to:

- Generate large volumes of outbound email, consuming Resend quota and spamming the configured inbox.
- Drive uncontrolled traffic to the LiteLLM backend, increasing cost and creating a potential denial-of-service vector.

## What was changed

Three files were added or modified. No existing behavior was altered for normal users.

### 1. New file: `lib/rateLimit.ts`

A small, reusable in-memory rate limiter:

- Uses a sliding window of request timestamps per client identifier.
- Enforces a configurable maximum number of requests per time window.
- Returns structured results including an optional `Retry-After` value.
- Configuration is environment-driven with safe defaults:
  - `RATE_LIMIT_WINDOW_MS` (default: `60000` - 60 seconds)
  - `RATE_LIMIT_MAX_REQUESTS` (default: `20` requests per window)

### 2. Modified: `_api_serverless/contact/submit/route.ts`

- Added import of `applyRateLimit` from `@/lib/rateLimit`.
- Added `getClientIdentifier()` helper that derives a per-IP key from `x-forwarded-for`.
- Rate limiting is applied **before** reading the request body or sending email.
- Returns HTTP `429 Too Many Requests` with a JSON error and optional `Retry-After` header when the limit is exceeded.

### 3. Modified: `_api_serverless/contact/chat/stream/route.ts`

- Same pattern as the submit endpoint: import, identifier derivation, early rate-limit check.
- Returns `429` with a consistent JSON error structure if the client exceeds limits.

## Items verified as NOT vulnerabilities

The following were explicitly investigated and confirmed safe:

| Area | Finding |
|---|---|
| Secrets in source | No `.env` files committed; all secrets use `process.env` |
| XSS via `dangerouslySetInnerHTML` | Used only for static JSON-LD and an empty `customHtml` config value |
| Markdown rendering | `ReactMarkdown` without `rehypeRaw` - raw HTML in markdown is not rendered |
| Email header injection | Resend uses a REST API, not raw SMTP; subject/body are JSON fields with no known injection vectors |
| Path traversal | Slugs are validated against `PAGE_REGISTRY` whitelist before reaching `fs` calls |
| SSRF | Chat endpoint fetches from `process.env.LITELLM_BASE_URL` (server-controlled, not user input) |
| Dynamic code execution | No `eval()`, `Function()`, or equivalent anywhere in the codebase |
| Missing security headers | Site uses `output: 'export'` (static); headers must be configured at the hosting layer, not in `next.config.mjs` |

## Operational notes

- **Serverless in-memory behavior**: Rate limiting is applied per warm instance. It effectively reduces burst abuse against a single instance, but for strict cross-instance enforcement, complement with an external store (e.g. Redis, Upstash) or a gateway-level limit.
- **Configuration**: Tune limits via environment variables without code changes:
  - Increase `RATE_LIMIT_WINDOW_MS` or decrease `RATE_LIMIT_MAX_REQUESTS` for stricter protection.
  - Use more permissive values for internal/staging environments if needed.
- **Backwards compatibility**: Existing client behavior is unchanged under normal traffic patterns; only abusive or unusually high request rates trigger `429` responses.
