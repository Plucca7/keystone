import path from 'node:path'

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // The app's own directory is the file-tracing root. Without this, Next
  // walks up looking for a lockfile to infer a "workspace root" -- and any
  // stray lockfile in a parent directory triggers a build warning and wrong
  // tracing. A generated project is standalone, so its root IS the app.
  outputFileTracingRoot: path.join(__dirname),
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-XSS-Protection', value: '0' },
        ],
      },
    ]
  },
  // Always use next/image
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
