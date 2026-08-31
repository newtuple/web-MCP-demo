// Parked Next route handler, kept for parity with the other endpoints in this
// repo. The deployed site is a static export on Cloudflare Pages, so the live
// implementation is functions/api/demo-app.ts, and `next dev` uses
// app/api/demo-app/route.dev.ts. All three call the same handler.

import { handleDemoAppRequest } from '@/lib/demoApp/generate'

export const runtime = 'edge'

export async function POST(request: Request) {
  return handleDemoAppRequest(request, {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    DEMO_APP_MODEL: process.env.DEMO_APP_MODEL,
    DEMO_APP_REASONING_EFFORT: process.env.DEMO_APP_REASONING_EFFORT,
    DEMO_APP_RATE_LIMIT: process.env.DEMO_APP_RATE_LIMIT,
    DEMO_APP_TIMEOUT_MS: process.env.DEMO_APP_TIMEOUT_MS,
  })
}
