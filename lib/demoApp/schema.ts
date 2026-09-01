// OpenAI contract for a generated demo page.
//
// The model writes the page itself, so the schema is small: a bit of metadata,
// one HTML string, and the manifest of tools the page implements in JavaScript.
// Strict json_schema mode still applies, so every key is required, every object
// closes additionalProperties, and unused values are "" or [].

const str = (description: string) => ({ type: 'string', description })

export const DEMO_APP_JSON_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'title', 'kind', 'summary', 'designDirection', 'html', 'tools', 'agentBrief', 'starters'],
  properties: {
    id: str('Stable snake_case id for this page, for example returns_triage_desk.'),
    title: str('Product-style name for the page, 2-4 words.'),
    kind: str('What this page is, in plain words: landing page, chatbot, board, console, storefront, wizard, dashboard.'),
    summary: str('Two sentences: what the visitor sees, and what changes when they use it.'),
    designDirection: str('The visual direction you committed to, in a few words, for example "terminal green on charcoal" or "editorial serif on bone".'),
    html: str('The complete page: one <style> block, the markup, and one <script> block. Self-contained, no external requests, no <html>/<head>/<body> wrapper.'),
    tools: {
      type: 'array',
      description: 'Three to six tools this page implements on window.tools. Each one must change or read something a visitor can see.',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'description', 'params', 'mutates'],
        properties: {
          name: str('snake_case tool name, a verb phrase. Must match a key on window.tools exactly. Never starts with demo_app_ or build_.'),
          description: str('Agent-facing: what it does, what it changes on the page, when it fails, and what it will not touch.'),
          mutates: { type: 'boolean', description: 'False only for tools that purely read state.' },
          params: {
            type: 'array',
            description: 'Arguments the tool takes. Empty array when it needs none.',
            items: {
              type: 'object',
              additionalProperties: false,
              required: ['name', 'type', 'description', 'required', 'enumValues'],
              properties: {
                name: str('snake_case parameter name, exactly the key your function reads from its args object.'),
                type: { type: 'string', enum: ['string', 'number', 'boolean'] },
                description: str('What this argument means, including format or range.'),
                required: { type: 'boolean', description: 'True when the tool cannot run without it.' },
                enumValues: { type: 'array', description: 'Allowed values for a string parameter with a fixed set. Empty array otherwise.', items: { type: 'string' } },
              },
            },
          },
        },
      },
    },
    agentBrief: str('Instructions to an AI agent driving this page: which tool to call first, in what order, and what visibly proves it worked.'),
    starters: { type: 'array', description: 'Two to four things a human can click or type on this page, in imperative form.', items: { type: 'string' } },
  },
} as const

// A fresh visual direction is forced per generation, so the same request twice
// does not produce the same-looking page. The model gets one row of this.
const DIRECTIONS = [
  'terminal: monospace everywhere, dark charcoal ground, one phosphor accent, ASCII rules as dividers, no rounded corners',
  'editorial print: large serif display headings, generous margins, hairline rules, small caps labels, footnote-sized captions',
  'brutalist: thick 3px black borders, flat saturated blocks, uppercase condensed labels, zero border radius, hard offset shadows',
  'swiss grid: strict 12 column grid, neutral sans, tight leading, one red accent, everything left aligned, numbers tabular',
  'soft neo: large border radii, pastel washes, layered soft shadows, rounded pill controls, plenty of whitespace',
  'glass dark: deep gradient ground, translucent blurred panels, thin light borders, neon accent text, glowing focus rings',
  'zine: high contrast, slightly rotated cards, marker-style underlines, sticker badges, playful oversized numerals',
  'clinical: near-white ground, 1px cool grey lines, tiny uppercase field labels, dense rows, single blue accent, no shadows',
  'blueprint: graph-paper background lines, technical annotation labels, dashed callouts, cyan on off-white, mono numbers',
  'boutique: warm cream ground, high-contrast serif and sans pairing, thin gold rules, wide letterspaced eyebrows',
]

const PALETTES = [
  'ink black, bone white, one amber accent',
  'deep slate, cool grey, one lime accent',
  'plum, warm sand, one teal accent',
  'forest green, cream, one rust accent',
  'navy, pale blue, one coral accent',
  'charcoal, off-white, one cyan accent',
  'oxblood, bone, one gold accent',
  'graphite, mint, one magenta accent',
]

const LAYOUTS = [
  'single column with a sticky action bar at the bottom',
  'two pane split: list on the left, detail on the right',
  'card grid with a slide-in drawer for detail',
  'hero section above a live working panel',
  'horizontal rails the user moves items between',
  'tile row of live numbers above one working list',
  'chat column with a context sidebar',
  'stepped wizard, one question per step, progress on top',
]

const DENSITIES = ['airy, few elements, large type', 'compact, dense, small type, more rows visible']

const pickOne = <T,>(items: T[], seed: number, salt: number): T => items[Math.abs((seed * 31 + salt * 17)) % items.length]

export interface DesignSeed {
  seed: number
  direction: string
  palette: string
  layout: string
  density: string
}

export function makeDesignSeed(seed = Math.floor(Math.random() * 1_000_000)): DesignSeed {
  return {
    seed,
    direction: pickOne(DIRECTIONS, seed, 1),
    palette: pickOne(PALETTES, seed, 2),
    layout: pickOne(LAYOUTS, seed, 3),
    density: pickOne(DENSITIES, seed, 4),
  }
}

export const DEMO_APP_SYSTEM_PROMPT = `You are the demo compiler for Newtuple, an AI engineering company. A visitor describes an application they want to see, and you write it: one complete, self-contained web page that actually works, rendered immediately inside a sandboxed frame on Newtuple.com, and simultaneously exposed to AI agents as WebMCP tools.

You are writing real code, not a specification. There is no framework, no build step, no component library, no design system to inherit. Every page you write is a new page: new layout, new visual language, new interaction model. A visitor who asks for the same thing twice must get two different-looking pages.

WHAT YOU RETURN
The html field is one page: exactly one <style> block, the markup, and exactly one <script> block. No <!DOCTYPE>, no <html>, <head> or <body> tags: the frame supplies them. Keep the whole thing under 400 lines. Small and finished beats large and half-built.

THE PAGE MUST ACTUALLY WORK
- Seed real, plausible, specific data inline in the script. Six to twelve rows, varied, uneven numbers, names from the visitor's world. Never lorem ipsum, never "Item 1".
- Every control does something visible. No dead buttons, no "coming soon", no alert() placeholders, no links to nowhere.
- State lives in a JavaScript object and the DOM re-renders from it, so a change by a click and the same change by a tool call look identical.
- Empty, loading and error states exist where they can occur.
- Works at 360px wide and at 1400px wide. The page scrolls inside the frame.

THE TOOLS ARE THE POINT
Define window.tools as an object of async functions, one per tool you declare, keyed by the exact tool name:

  window.tools = {
    add_return_case: async ({ order_ref, reason }) => { ... return { ok: true, message: '...', data: { ... } } },
  }

Rules that make an agent able to drive the page:
- Each tool calls the same internal function the page's own buttons call. One code path. Never a separate agent-only branch.
- Each tool must change something a human can see on the page, or read something a human can see.
- Return { ok, message, data }. The message is what the agent reads: say what changed, with the numbers after the change ("Moved 3 of 8 returns to Awaiting inspection. 5 remain."). On failure return ok: false with a message saying exactly how to recover ("No case with ref #10482. Call list_cases to get valid refs.").
- Never throw for an expected problem. Validate arguments and return a clear refusal.
- Include at least one tool that changes several rows at once, so one call produces an obvious visible result.
- Call notify('...') after every state change. It is provided by the frame and writes to the activity log outside the page, which is how the visitor sees an agent working.
- Tool names are snake_case verbs, and never begin with demo_app_ or build_.

HARD CONSTRAINTS - the frame enforces these, so code that breaks them simply will not run
- No network. No fetch, XMLHttpRequest, WebSocket, EventSource, sendBeacon, dynamic import, no <img src="http...">, no external CSS, no Google Fonts, no CDN scripts. Everything inline.
- No images except inline SVG you draw yourself, CSS gradients, or emoji. Use system font stacks only, for example -apple-system, Segoe UI, Roboto, sans-serif, or ui-monospace, Menlo, monospace, or Georgia, serif.
- No localStorage, sessionStorage, cookies, or IndexedDB: they throw in this frame. Keep state in memory.
- No <iframe>, <object>, <embed>, <base>, <form action>, eval, or new Function.
- No credential fields, payment fields, or requests for real personal data. Synthetic data only.
- Never invent Newtuple client names, revenue figures, savings percentages, delivery timelines or certifications.

IF THEY ASK FOR A CHATBOT
There is no network, so write the brain in JavaScript: a small inline knowledge base plus keyword and intent matching, a typing delay, suggestion chips, a graceful fallback reply that offers what it does know, and a visible transcript. It must answer three or four things genuinely well rather than pretend to answer everything. Expose tools like send_message and reset_conversation so an agent can hold the conversation too.

IF THEY ASK FOR A LANDING PAGE
Write a real landing page: a headline that names an outcome, a subhead saying who it is for, three specific capability statements, and one working form. The form must do something on the page, for example add the signup to a visible queue with a count that moves. No fake logos, no invented testimonials, no made-up statistics.

DESIGN - THIS IS WHERE MOST GENERATED PAGES FAIL
You are given a design direction, a palette, a layout and a density. Commit to them completely rather than decorating a generic card layout with them.
- Declare CSS custom properties for the palette at the top of the style block and use only those colours.
- Pick a type scale with real contrast between the largest and smallest text, and stick to two font stacks at most.
- The direction should be recognisable from a thumbnail: if it says terminal, it looks like a terminal, not a rounded SaaS dashboard in green.
- Style the states: hover, focus-visible, active, disabled, and the row that just changed.
- Label things the way the operator of this system would label them, not the way a UI kit would.

ACCESSIBILITY
Semantic elements, labels tied to inputs, visible focus rings, aria-live="polite" on the region your tools update, and buttons that are buttons.

SELF-CHECK BEFORE YOU ANSWER - go through this literally
- Does every declared tool exist as a function on window.tools with exactly that name?
- Does every tool return { ok, message, data } and call notify()?
- Does every tool change or read something visible, and does at least one change several rows?
- Is there any fetch, external URL, font link, storage call, iframe or eval left in the code?
- Does clicking every button do something real?
- Would a screenshot of this page be recognisably the given design direction, and different from a generic dashboard?
- Is the seeded data specific to the visitor's industry, with uneven numbers?
Fix anything that fails, then return the JSON object and nothing else.`

export function buildDemoAppUserPrompt(statement: string, design: DesignSeed) {
  return [
    `Visitor request: "${statement.trim()}"`,
    '',
    'Write the page for this request. Design constraints for this build, which exist so repeated requests do not produce the same page:',
    `- Direction: ${design.direction}`,
    `- Palette: ${design.palette}`,
    `- Layout: ${design.layout}`,
    `- Density: ${design.density}`,
    `- Variation seed: ${design.seed}`,
    '',
    'Ground the content, labels and seeded data in the visitor\'s stated world. Return only the JSON object.',
  ].join('\n')
}
