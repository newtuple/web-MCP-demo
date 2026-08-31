// Everything the model returns passes through here before it is rendered.
//
// The sandbox and the CSP in frame.ts are the real security boundary: this layer
// exists so a page that ignored the rules still renders as something working
// rather than as a broken shell with dead images and a script that throws.

import type { DemoParamType, GeneratedApp, GeneratedTool, GeneratedToolParam } from './types'

const MAX_HTML = 80_000
const MAX_TOOLS = 8
const MAX_PARAMS = 6
const PARAM_TYPES: DemoParamType[] = ['string', 'number', 'boolean']

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : {}
const asArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : [])
const asText = (value: unknown, fallback = ''): string => {
  const text = typeof value === 'string' ? value : typeof value === 'number' || typeof value === 'boolean' ? String(value) : ''
  return text.trim() || fallback
}
const clamp = (value: string, max: number) => (value.length > max ? `${value.slice(0, max - 1).trimEnd()}…` : value)

const slug = (value: unknown, fallback: string): string => {
  const base = asText(value).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')
  return base || fallback
}

/** Tags that either escape the frame's intent or load something the CSP will kill anyway. */
const STRIP_TAGS = ['iframe', 'object', 'embed', 'applet', 'frame', 'frameset', 'noscript']
const SELF_CLOSING_STRIP = ['base', 'link', 'meta']

export function sanitizeGeneratedHtml(input: unknown): string {
  let html = typeof input === 'string' ? input : ''

  // Models sometimes wrap the page even when told not to; keep the body.
  html = html.replace(/^\s*```(?:html)?/i, '').replace(/```\s*$/i, '')
  html = html.replace(/<!DOCTYPE[^>]*>/gi, '')
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i)
  if (bodyMatch) {
    const headStyles = headMatch ? (headMatch[1].match(/<style[\s\S]*?<\/style>/gi) ?? []).join('\n') : ''
    html = `${headStyles}\n${bodyMatch[1]}`
  }
  html = html.replace(/<\/?(?:html|head|body)[^>]*>/gi, '')

  STRIP_TAGS.forEach((tag) => {
    html = html.replace(new RegExp(`<${tag}[\\s\\S]*?<\\/${tag}>`, 'gi'), '')
    html = html.replace(new RegExp(`<${tag}[^>]*>`, 'gi'), '')
  })
  SELF_CLOSING_STRIP.forEach((tag) => {
    html = html.replace(new RegExp(`<${tag}[^>]*>`, 'gi'), '')
  })

  // Scripts with a src are always external, so they are always dead here.
  html = html.replace(/<script[^>]*\bsrc\s*=[^>]*>\s*<\/script>/gi, '')

  // Any remaining absolute reference would be blocked by the CSP and render as
  // a broken box, so it is neutralised into something inert instead.
  html = html.replace(/\s(src|href|poster|data|action)\s*=\s*("|')(https?:|\/\/|ftp:)[^"']*\2/gi, (match, attr) =>
    attr.toLowerCase() === 'href' ? ' href="#"' : ' data-blocked-src="external"')
  html = html.replace(/url\(\s*("|')?(https?:|\/\/)[^)]*\)/gi, 'none')

  if (html.length > MAX_HTML) html = `${html.slice(0, MAX_HTML)}\n<!-- truncated -->`
  return html.trim()
}

function sanitizeParam(input: unknown, taken: Set<string>, index: number): GeneratedToolParam | null {
  const raw = asRecord(input)
  const name = slug(raw.name, `arg_${index + 1}`)
  if (taken.has(name)) return null
  taken.add(name)
  const type = PARAM_TYPES.includes(raw.type as DemoParamType) ? (raw.type as DemoParamType) : 'string'
  return {
    name,
    type,
    description: clamp(asText(raw.description, name.replace(/_/g, ' ')), 220),
    required: raw.required === true,
    enumValues: type === 'string'
      ? Array.from(new Set(asArray(raw.enumValues).map((value) => asText(value)).filter(Boolean))).slice(0, 12)
      : [],
  }
}

const RESERVED = /^(demo_app_|build_|close_demo)/

function sanitizeTool(input: unknown, taken: Set<string>, index: number): GeneratedTool | null {
  const raw = asRecord(input)
  let name = slug(raw.name, `page_tool_${index + 1}`)
  // The parent owns the demo_app_* namespace; a page tool must not shadow it.
  if (RESERVED.test(name)) name = `page_${name}`
  if (taken.has(name)) return null
  taken.add(name)

  const description = asText(raw.description)
  const paramNames = new Set<string>()
  return {
    name,
    description: clamp(description || `Runs ${name.replace(/_/g, ' ')} on the page.`, 600),
    mutates: raw.mutates !== false,
    params: asArray(raw.params)
      .slice(0, MAX_PARAMS)
      .map((param, i) => sanitizeParam(param, paramNames, i))
      .filter((param): param is GeneratedToolParam => param !== null),
  }
}

/** JSON Schema for WebMCP, built from the page's own manifest. */
export function toolInputSchema(tool: GeneratedTool): Record<string, unknown> {
  const properties: Record<string, unknown> = {}
  tool.params.forEach((param) => {
    properties[param.name] = {
      type: param.type,
      description: param.description,
      ...(param.enumValues.length > 0 ? { enum: param.enumValues } : {}),
    }
  })
  return {
    type: 'object',
    properties,
    required: tool.params.filter((param) => param.required).map((param) => param.name),
    additionalProperties: false,
  }
}

export function normalizeGeneratedApp(input: unknown): GeneratedApp {
  const raw = asRecord(input)
  const html = sanitizeGeneratedHtml(raw.html)
  // A page with no markup and no script is not a demo, it is an error message.
  if (html.length < 200) throw new Error('generated page was empty or unusable')

  const taken = new Set<string>()
  const tools = asArray(raw.tools)
    .slice(0, MAX_TOOLS)
    .map((tool, index) => sanitizeTool(tool, taken, index))
    .filter((tool): tool is GeneratedTool => tool !== null)
    // A tool the page never implemented is worse than no tool: keep only the
    // ones whose name actually appears in the page's script.
    .filter((tool) => html.includes(tool.name))

  const title = clamp(asText(raw.title, 'Generated Demo'), 48)
  return {
    id: slug(raw.id ?? title, 'generated_demo'),
    title,
    kind: clamp(asText(raw.kind, 'working page').toLowerCase(), 32),
    summary: clamp(asText(raw.summary, 'A working page generated for this request.'), 400),
    designDirection: clamp(asText(raw.designDirection, 'generated'), 90),
    html,
    tools,
    agentBrief: asText(
      raw.agentBrief,
      tools.length > 0
        ? `Call ${tools[0].name} first, then demo_app_describe_page to read what changed on the page.`
        : 'This page exposes no tools of its own. Use demo_app_describe_page to read it.',
    ),
    starters: asArray(raw.starters).map((entry) => clamp(asText(entry), 120)).filter(Boolean).slice(0, 4),
  }
}
