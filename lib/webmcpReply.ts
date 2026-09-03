// Shared reply shape for every WebMCP tool's execute() in components/webmcp/.
// content[].text is the MCP-standard human-readable result an agent reads.
// `data` carries the same payload as a real object alongside it - not
// embedded in the text - so anything reading the result programmatically
// (the on-page activity feed, tests) doesn't have to re-parse JSON out of a
// rendered string.

export interface ToolReply {
  content: [{ type: 'text'; text: string }]
  data?: unknown
}

export function reply(summary: string, data?: unknown): ToolReply {
  return {
    content: [
      {
        type: 'text',
        text: data === undefined ? summary : `${summary}\n\n${JSON.stringify(data, null, 2)}`,
      },
    ],
    ...(data === undefined ? {} : { data }),
  }
}
