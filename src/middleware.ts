import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl
  const pathname = url.pathname

  // Check if pathname contains double slashes
  if (pathname.includes('//')) {
    // Replace all occurrences of multiple slashes with a single slash
    const newPathname = pathname.replace(/\/+/g, '/')
    
    // Create new URL with cleaned pathname
    const newUrl = new URL(newPathname, url.origin)
    // Preserve search params
    newUrl.search = url.search

    // Return 301 Permanent Redirect
    return NextResponse.redirect(newUrl, {
      status: 301
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
