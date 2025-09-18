import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Allow access to login page and API routes
  if (request.nextUrl.pathname.startsWith('/login') || 
      request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next()
  }
  
  // Check for session cookie
  const session = request.cookies.get('admin-session')
  
  if (!session || session.value !== 'authenticated') {
    // Redirect to login page if not authenticated
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
