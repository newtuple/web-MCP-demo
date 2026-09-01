import { handleDemoAppRequest, type DemoAppEnv } from './lib/demoApp/generate'

interface AssetsBinding {
  fetch(request: Request): Promise<Response>
}

interface WorkerEnv extends DemoAppEnv {
  ASSETS: AssetsBinding
}

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    const { pathname } = new URL(request.url)

    if (pathname === '/api/demo-app') {
      return handleDemoAppRequest(request, env)
    }

    return env.ASSETS.fetch(request)
  },
}
