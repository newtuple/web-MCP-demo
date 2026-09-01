import { handleNavigateRequest, type NavigateEnv } from '../../lib/navigate/agent'

type PagesFunctionContext = {
  request: Request
  env: NavigateEnv
}

export async function onRequestPost(context: PagesFunctionContext) {
  return handleNavigateRequest(context.request, context.env)
}
