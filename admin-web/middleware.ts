import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Allow access to login page, root page, and API routes
  if (pathname === '/' || pathname === '/login' || pathname.startsWith('/api/auth/')) {
    return NextResponse.next()
  }
  
  // Check for session cookie
  const sessionToken = request.cookies.get('yad2-admin-session')?.value
  
  if (!sessionToken) {
    // Redirect to login if no session
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Verify session token
  try {
    const decoded = Buffer.from(sessionToken, 'base64').toString()
    const [timestamp] = decoded.split('-')
    const sessionAge = Date.now() - parseInt(timestamp)
    
    // Session expires after 7 days
    if (sessionAge > 7 * 24 * 60 * 60 * 1000) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  } catch {
    // Invalid session token
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}
