import { handleDemoAppRequest, type DemoAppEnv } from './lib/demoApp/generate'

const NEWTUPLE_SITE_URL = 'https://www.newtuple.com'

interface AssetsBinding {
  fetch(request: Request): Promise<Response>
}

interface WorkerEnv extends DemoAppEnv {
  ASSETS: AssetsBinding
}

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    const requestUrl = new URL(request.url)
    const { pathname } = requestUrl

    if (pathname === '/api/demo-app') {
      return handleDemoAppRequest(request, env)
    }

    if (pathname === '/blog' || pathname.startsWith('/blog/') || pathname.startsWith('/post/')) {
      const redirectUrl = new URL(`${pathname}${requestUrl.search}`, NEWTUPLE_SITE_URL)
      return Response.redirect(redirectUrl.toString(), 301)
    }

    return env.ASSETS.fetch(request)
  },
}
