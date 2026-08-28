import { handleCareersSubmitRequest } from '../../../lib/server/http/submitHandlers'

type PagesFunctionContext = {
  request: Request
  env: Record<string, string | undefined>
}

export async function onRequestPost(context: PagesFunctionContext) {
  return handleCareersSubmitRequest(context.request, context.env)
}
