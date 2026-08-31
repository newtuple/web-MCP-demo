// A generated demo app is a page the model wrote: its own HTML, CSS and
// JavaScript, with its own layout and visual language, different every time.
//
// Two things make that safe and drivable:
//   - the page runs in a sandboxed iframe on an opaque origin with a CSP that
//     allows no network at all, so it cannot read this site, its storage, or
//     reach anything outside the frame (see frame.ts);
//   - the page declares tools it implements as JavaScript functions, and the
//     parent registers those with WebMCP and bridges calls in by postMessage
//     (see toolBridge.ts), so an agent drives the real page a human is using.

export type DemoParamType = 'string' | 'number' | 'boolean'

export interface GeneratedToolParam {
  name: string
  type: DemoParamType
  description: string
  required: boolean
  /** string params only; empty when the value is free text */
  enumValues: string[]
}

export interface GeneratedTool {
  name: string
  description: string
  params: GeneratedToolParam[]
  /** false for tools that only read the page */
  mutates: boolean
}

export interface GeneratedApp {
  id: string
  title: string
  /** what kind of thing this is, in the model's words: landing page, chatbot, board, console */
  kind: string
  summary: string
  /** the visual direction it committed to, shown in the ribbon */
  designDirection: string
  /** a complete page: style, markup and script, self-contained */
  html: string
  tools: GeneratedTool[]
  /** how an agent should drive this specific page */
  agentBrief: string
  /** things a human can try on the page */
  starters: string[]
}

export interface DemoLogEntry {
  id: string
  at: number
  source: 'human' | 'agent' | 'page' | 'system'
  toolName: string
  message: string
}

export interface DemoSession {
  statement: string
  app: GeneratedApp
  source: 'openai'
  model: string | null
  /** bumped to force a fresh iframe, which resets the page's own state */
  generation: number
  log: DemoLogEntry[]
}
