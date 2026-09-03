// Dev-only handler for /api/navigate.
//
// functions/api/navigate.ts is the real, deployed Cloudflare Pages Function;
// `next dev` does not serve Pages Functions, so this stands in locally. The
// `.dev.ts` extension is only in pageExtensions when NODE_ENV is development
// (see next.config.mjs), so `next build` never sees this file and
// `output: 'export'` keeps working.

import { handleNavigateRequest } from '@/lib/navigate/agent'

export async function POST(request: Request) {
  return handleNavigateRequest(request, {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    NAVIGATE_MODEL: process.env.NAVIGATE_MODEL,
    NAVIGATE_RATE_LIMIT: process.env.NAVIGATE_RATE_LIMIT,
  })
}
