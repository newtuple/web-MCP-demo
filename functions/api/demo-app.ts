import { handleDemoAppRequest, type DemoAppEnv } from '../../lib/demoApp/generate'

type PagesFunctionContext = {
  request: Request
  env: DemoAppEnv
}

export async function onRequestPost(context: PagesFunctionContext) {
  return handleDemoAppRequest(context.request, context.env)
}
