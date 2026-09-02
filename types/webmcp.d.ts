interface WebMCPToolExecuteOptions {
  signal: AbortSignal
}

interface WebMCPToolAnnotations {
  readOnlyHint?: boolean
  untrustedContentHint?: boolean
}

interface WebMCPToolDefinition {
  name: string
  title?: string
  description: string
  inputSchema?: Record<string, unknown>
  annotations?: WebMCPToolAnnotations
  execute: (input: Record<string, unknown>, options: WebMCPToolExecuteOptions) => unknown | Promise<unknown>
}

interface WebMCPRegisteredTool {
  name: string
  title?: string
  description: string
  inputSchema?: Record<string, unknown>
  annotations?: WebMCPToolAnnotations
}

interface WebMCPModelContext {
  registerTool: (
    tool: WebMCPToolDefinition,
    options?: { signal?: AbortSignal },
  ) => Promise<void>
  getTools?: () => Promise<WebMCPRegisteredTool[]>
  executeTool?: (
    tool: WebMCPRegisteredTool,
    args: Record<string, unknown>,
    options?: { signal?: AbortSignal },
  ) => Promise<string>
  ontoolchange?: (() => void) | null
}

interface Document {
  modelContext?: WebMCPModelContext
}

interface Navigator {
  modelContext?: WebMCPModelContext
}

interface Window {
  __newtupleWebMCPToolsRegistered?: boolean
}
