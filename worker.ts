import { handleNavigateRequest, type NavigateEnv } from './lib/navigate/agent'
import { handleCareersSubmitRequest, handleContactSubmitRequest } from './lib/server/http/submitHandlers'

interface AssetsBinding {
  fetch(request: Request): Promise<Response>
}

interface WorkerEnv extends NavigateEnv {
  ASSETS: AssetsBinding
}

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    const { pathname } = new URL(request.url)

    if (pathname === '/api/navigate') {
      return handleNavigateRequest(request, env)
    }

    if (pathname === '/api/careers/submit') {
      return handleCareersSubmitRequest(request, env as unknown as Record<string, string | undefined>)
    }

    if (pathname === '/api/contact/submit') {
      return handleContactSubmitRequest(request, env as unknown as Record<string, string | undefined>)
    }

    return env.ASSETS.fetch(request)
  },
}
