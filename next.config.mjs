const isDev = process.env.NODE_ENV === 'development'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export is a production concern. `next dev` runs as a normal Next
  // server so app/api/**/route.dev.ts can serve /api/demo-app locally, standing
  // in for the Cloudflare Pages Function that serves it in production.
  ...(isDev ? {} : { output: 'export' }),
  // `.dev.ts` route files exist only for `next dev`; the production export never
  // resolves them, so app/api/**/route.dev.ts cannot break `output: 'export'`.
  pageExtensions: isDev ? ['dev.ts', 'dev.tsx', 'ts', 'tsx', 'js', 'jsx'] : ['ts', 'tsx', 'js', 'jsx'],
  transpilePackages: ['geist'],
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
