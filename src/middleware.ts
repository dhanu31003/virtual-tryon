// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Add CSP headers
  response.headers.set(
    'Content-Security-Policy',
    `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://unpkg.com;
      connect-src 'self' https://*.replicate.delivery https://*.replicate.com https://*.v.network;
      img-src 'self' blob: data:;
      style-src 'self' 'unsafe-inline';
      worker-src 'self' blob:;
    `.replace(/\s+/g, ' ').trim()
  )

  return response
}

export const config = {
  matcher: '/:path*',
}