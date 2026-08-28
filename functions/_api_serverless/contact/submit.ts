import { handleContactSubmitRequest } from '../../../lib/server/http/submitHandlers'

type PagesFunctionContext = {
  request: Request
  env: Record<string, string | undefined>
}

export async function onRequestPost(context: PagesFunctionContext) {
  return handleContactSubmitRequest(context.request, context.env)
}
