# Generated demo pages over WebMCP

A visitor says what they want to see. The model **writes the page** - its own
HTML, CSS, JavaScript, layout, palette and interaction model - and it opens at
`/demo`. The page then hands its own JavaScript functions to AI agents as WebMCP
tools, so an agent can use the page a human is looking at.

Nothing here is a template. There is no renderer that takes generated data and
paints it into a fixed layout. Two requests for the same thing produce two
different pages, because a design direction is drawn per build and pushed into
the prompt.

## Request to running page

```
visitor or agent
   |
   |  build_demo_app({ statement })          WebMCP tool, always registered
   v
lib/demoApp/store.ts
   |-- routes the browser to /demo (client-side, tools stay registered)
   |-- POST /api/demo-app                    20-60s: the model writes the page
   v
functions/api/demo-app.ts -> lib/demoApp/generate.ts
   |  OpenAI chat completions, response_format json_schema (strict)
   |  DEMO_APP_SYSTEM_PROMPT + a random DesignSeed (direction/palette/layout/density)
   v
lib/demoApp/sanitize.ts                      strips frames, external refs, dead tools
   v
DemoSession in the store
   |-- app/demo/page.tsx                     builder, build screen, error, page
   |-- components/webmcp/GeneratedAppFrame   sandboxed iframe + activity drawer
   |-- lib/demoApp/frame.ts                  srcdoc: CSP, reset, notify(), tool bridge
   |-- lib/demoApp/toolBridge.ts             parent side of the postMessage channel
   |-- components/webmcp/demoAppTools.ts     the page's tools, registered with WebMCP
```

## The page's own tools become WebMCP tools

The model returns the page plus a manifest of the tools that page implements:

```js
// inside the generated page
window.tools = {
  send_message: async ({ message }) => { ...; notify('...'); return { ok: true, message: '...', data: {...} } },
  route_all_holiday_cases: async () => { ... },
}
```

For each declared tool the host registers a real WebMCP tool whose input schema
is built from the manifest (`toolInputSchema` in `sanitize.ts`), and whose
execute forwards the call into the frame by `postMessage`. The function that runs
is the page's own - the same one its buttons call - so an agent cannot reach
behaviour a human cannot, and the human sees the result immediately.

A tool the model declared but never actually wrote into the page is dropped
before registration, so an agent is never offered something that cannot run.

Host tools, registered alongside whatever the page declared:

- `build_demo_app({ statement })` - always available; writes a new page and opens it
- `demo_app_overview` - the manifest: what this page is, how it was generated, every tool with its arguments
- `demo_app_describe_page` - the live page as the visitor sees it: text, every control with labels and disabled state, and which tools the page really implemented
- `demo_app_reset` - reload the page from its generated source
- `close_demo_app` - close it and unregister its tools

`demo_app_describe_page` exists because the parent genuinely cannot read the
frame: the sandbox is on an opaque origin, so "read the page" is itself a bridge
call answered inside the frame.

## Why this is safe to run

The page is model-written code executing in the visitor's browser, so the
boundary matters more than the sanitizer:

1. **Opaque origin.** The iframe carries `sandbox="allow-scripts allow-forms"`
   and deliberately not `allow-same-origin`. The page cannot touch this site's
   DOM, cookies, `sessionStorage`, or same-origin APIs, and cannot navigate the
   top frame. The only channel out is `postMessage`.
2. **No network, in any direction.** The document declares
   `default-src 'none'; connect-src 'none'; form-action 'none'; base-uri 'none'`,
   with inline script and style only and images limited to `data:`. There is no
   exfiltration path and no remote code path, so a page cannot phone home even
   if it tried.
3. **Nothing to load.** Everything is inline by construction: no fonts, no CDNs,
   no images by URL.
4. **Sanitizer.** `lib/demoApp/sanitize.ts` removes `iframe`/`object`/`embed`/
   `base`/`link`/`meta`, drops `<script src>`, neutralises any remaining absolute
   URL, caps size, and refuses an empty page.
5. **Polite failure instead of a broken page.** The frame runtime shims `fetch`,
   `XMLHttpRequest`, `WebSocket`, `EventSource`, `localStorage` and
   `sessionStorage` so a page that reaches for them logs one line to the activity
   drawer and keeps working, rather than throwing halfway through render.
6. **Message authenticity.** The parent accepts frame messages only when
   `event.source` is that iframe's `contentWindow`, and every payload carries the
   `__newtuple` marker.

Generated content is marked `untrustedContentHint: true` on the tools that
return it, because it is text the model wrote, not text this site wrote.

## Files

| File | Role |
| --- | --- |
| `lib/demoApp/types.ts` | `GeneratedApp`, its tool manifest, the session and the log |
| `lib/demoApp/schema.ts` | Strict JSON schema, the generation prompt, and the design-seed table |
| `lib/demoApp/sanitize.ts` | Repair and refusal layer; builds each tool's JSON Schema |
| `lib/demoApp/frame.ts` | The sandbox: CSP, reset CSS, `notify()`, API shims, tool bridge, `__describe` |
| `lib/demoApp/toolBridge.ts` | Parent side of the channel: call, timeout, ready, notify |
| `lib/demoApp/generate.ts` | Server: OpenAI call, rate limit, request handler. Workers-safe |
| `lib/demoApp/store.ts` | Session, navigation, activity log, single place a tool call is recorded |
| `app/demo/page.tsx` | The route: builder screen, build screen, error state, the page |
| `components/webmcp/GeneratedAppFrame.tsx` | Mounts the sandbox, keeps the bridge attached, activity drawer |
| `components/webmcp/demoAppTools.ts` | Host tools and the bridged page tools |
| `components/webmcp/DemoAppLauncher.tsx` | Site-wide entry pill, and the router bridge the store uses |
| `components/layout/ChromeGate.tsx` | Hides site header and footer on `/demo` |
| `functions/api/demo-app.ts` | Cloudflare Pages Function serving `/api/demo-app` in production |
| `app/api/demo-app/route.dev.ts` | Dev-only handler for the same path; invisible to `next build` |
| `tests/demoApp.test.ts` | Sanitizer, tool-schema, sandbox-policy and design-seed invariants |

## Variety is enforced, not hoped for

`makeDesignSeed()` draws a direction, palette, layout and density per build from
`lib/demoApp/schema.ts` and passes them in the user message. The prompt then
spends a section on committing to that direction rather than decorating a
generic card layout with it. Pass `seed` in the request body to reproduce a
specific look.

Observed, same request twice: "soft neo pastel, forest green and rust" then
"zine, high contrast, marker underlines" - different layout, different type,
different controls.

## No fallback page, on purpose

If generation fails - no key, a timeout, a refusal, malformed output - `/demo`
shows what went wrong and offers a retry. Handing over a canned screen would
contradict the whole point.

## Configuration

Set on the Pages project (Settings > Variables and Secrets), or locally in
`.env`:

| Key | Default | Notes |
| --- | --- | --- |
| `OPENAI_API_KEY` | - | Without it `/demo` reports that no page can be generated |
| `DEMO_APP_MODEL` | `gpt-5.4-mini` | Writes the page in ~25s. `OPENAI_MODEL` is intentionally ignored here |
| `DEMO_APP_REASONING_EFFORT` | `low` | `low` / `medium` / `high`. `minimal` is rejected by these models |
| `DEMO_APP_RATE_LIMIT` | `6` | Page generations per minute per IP, per isolate |
| `DEMO_APP_TIMEOUT_MS` | `150000` | Writing a page takes longer than answering a question |

## Running it locally

`npm run dev` serves `/api/demo-app` from `app/api/demo-app/route.dev.ts`, which
reads `OPENAI_API_KEY` from `.env`. That file exists only in dev, by two switches
in `next.config.mjs`: `pageExtensions` includes `dev.ts` only when `NODE_ENV` is
development, and `output: 'export'` is applied only outside dev. The production
export therefore contains no `/api` output, and the live endpoint stays
`functions/api/demo-app.ts`:

```bash
npm run build
npx wrangler pages dev out --port 8788 --binding OPENAI_API_KEY="$OPENAI_API_KEY"
```

## Driving it from a script

ChatGPT desktop and Codex discover the tools natively in their built-in browser,
and Chrome 149+ exposes them behind `chrome://flags/#enable-webmcp-testing`. To
drive them from a script, install a shim before page scripts run:

```js
// puppeteer: page.evaluateOnNewDocument(...)
const tools = new Map()
Object.defineProperty(document, 'modelContext', {
  configurable: true,
  value: {
    async registerTool(tool, options) {
      tools.set(tool.name, tool)
      options?.signal?.addEventListener('abort', () => tools.delete(tool.name))
    },
    async getTools() {
      return Array.from(tools.values()).map(({ name, description, inputSchema }) => ({ name, description, inputSchema }))
    },
  },
})
window.__call = (name, args) =>
  tools.get(name).execute(args ?? {}, { signal: new AbortController().signal })
```

Then `build_demo_app`, wait for the page tools to appear, and call them. The
tools that appear depend on what the model wrote, so read
`demo_app_overview` rather than assuming names.

## Offline checks

```bash
npm test    # sanitizer, tool schemas, sandbox policy, design seeds. No API calls
```
