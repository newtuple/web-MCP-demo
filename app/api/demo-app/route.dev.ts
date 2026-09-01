// Dev-only handler for /api/demo-app.
//
// The deployed site is a static export, where the live endpoint is
// functions/api/demo-app.ts (a Cloudflare Pages Function). `next dev` does not
// serve Pages Functions, so without this file the demo window would always fall
// back to the local blueprint during development.
//
// The `.dev.ts` extension is only in `pageExtensions` when NODE_ENV is
// development (see next.config.mjs), so `next build` does not see this file at
// all and `output: 'export'` keeps working.

import { handleDemoAppRequest } from '@/lib/demoApp/generate'

export async function POST(request: Request) {
  return handleDemoAppRequest(request, {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    DEMO_APP_MODEL: process.env.DEMO_APP_MODEL,
    DEMO_APP_REASONING_EFFORT: process.env.DEMO_APP_REASONING_EFFORT,
    DEMO_APP_RATE_LIMIT: process.env.DEMO_APP_RATE_LIMIT,
    DEMO_APP_TIMEOUT_MS: process.env.DEMO_APP_TIMEOUT_MS,
  })
}
