interface WebMCPToolExecuteOptions {
  signal: AbortSignal
}

interface WebMCPToolDefinition {
  name: string
  description: string
  title?: string
  inputSchema?: Record<string, unknown>
  annotations?: {
    readOnlyHint?: boolean
    untrustedContentHint?: boolean
  }
  execute: (input: Record<string, unknown>, options: WebMCPToolExecuteOptions) => unknown | Promise<unknown>
}

interface WebMCPModelContext {
  registerTool: (
    tool: WebMCPToolDefinition,
    options?: { signal?: AbortSignal },
  ) => Promise<void>
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
