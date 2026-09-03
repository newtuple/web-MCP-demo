// Turns a raw WebMCP tool call into one plain-language line for the human
// watching the activity feed. Falls back to the tool name for anything not
// covered here, so a new tool never breaks the feed, it just reads a bit
// more technical until someone adds a case.

type Json = Record<string, unknown>

function str(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

// Tool results come in two shapes in this codebase: tools built with
// lib/webmcpReply.ts's reply() carry a real `data` field alongside the
// MCP-standard content[].text an agent reads; tools registered directly in
// WebMCPProvider.tsx return a flat object with no wrapper at all. This
// normalizes both to one flat object so the cases below can read fields
// without caring which shape produced them. The text-parsing fallback only
// exists for older results that predate the `data` field - prefer the real
// field over ever re-parsing rendered text.
function flattenResult(result: unknown): Json {
  if (!result || typeof result !== 'object') return {}
  const flat = result as Json

  if ('data' in flat) return (flat.data ?? {}) as Json

  const maybeContent = flat.content
  if (!Array.isArray(maybeContent) || typeof maybeContent[0]?.text !== 'string') {
    return flat
  }
  // Legacy fallback: a content-wrapped result with no `data` field (should
  // no longer happen now every tool uses the shared reply() helper).
  const text = maybeContent[0].text as string
  const jsonStart = text.indexOf('\n\n{')
  if (jsonStart === -1) return {}
  try {
    return JSON.parse(text.slice(jsonStart + 2)) as Json
  } catch {
    return {}
  }
}

export function describeToolCall(name: string, input: Json | undefined, result: unknown): string {
  const inp = input ?? {}
  const res = flattenResult(result)

  switch (name) {
    case 'get_site_state':
      return 'Agent read the current page state'

    case 'infer_visitor_context': {
      const statement = str(inp.visitor_statement)
      return statement ? `Agent introduced you as: "${statement}"` : 'Agent inferred a visitor profile'
    }

    case 'set_visitor_context':
    case 'update_visitor_profile': {
      const role = str(inp.role)
      const industry = str(inp.industry)
      const bits = [role, industry].filter(Boolean).join(', ')
      return bits ? `Agent personalized the site for: ${bits}` : 'Agent updated your visitor profile'
    }

    case 'reorder_navigation':
      return 'Agent read the personalized navigation'

    case 'generate_page_variant':
      return 'Agent generated the current page variant'

    case 'select_case_studies':
      return 'Agent pulled the case studies shown to you'

    case 'choose_cta':
      return 'Agent read the active call to action'

    case 'reset_visitor_context':
      return 'Agent reset personalization to default'

    case 'render_page_view': {
      const page = str(inp.page)
      return page ? `Agent opened "${page}" in place, no reload` : 'Agent opened a page in place'
    }

    case 'close_page_view':
      return 'Agent closed the in-place page view'

    case 'navigate_site': {
      const message = str(inp.message)
      return message ? `Agent handled: "${message}"` : 'Agent navigated the site'
    }

    case 'list_site_pages':
      return 'Agent listed every page on the site'

    case 'prepare_contact_request':
      return 'Agent staged a contact request for you to confirm'

    case 'submit_contact_request': {
      const ok = res.ok === true
      return ok ? 'Agent submitted a contact request (consent given)' : 'Agent tried to submit a contact request, but it was not sent'
    }

    case 'list_open_roles':
      return 'Agent listed open roles'

    case 'get_role_details': {
      const title = str(inp.role_title)
      return title ? `Agent read the job description for "${title}"` : 'Agent read a job description'
    }

    case 'filter_careers_page': {
      const query = str(inp.query) ?? str(inp.location) ?? str(inp.level) ?? str(inp.type)
      if (res.needsClarification) {
        return query
          ? `No roles matched "${query}", agent asked you a clarifying question instead of guessing`
          : 'No roles matched that filter, agent asked you a clarifying question instead of guessing'
      }
      return query ? `Agent filtered open roles for: "${query}"` : 'Agent filtered the careers page'
    }

    default:
      return `Agent called ${name}`
  }
}
