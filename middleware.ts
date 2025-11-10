import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

// Routes that require authentication
const protectedRoutes = [
  '/seo-audit',
  '/market-analysis',
  '/brandbook',
  '/content-ideas',
  '/landing-page-generator',
  '/linkedin-post-generator',
]

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route requires authentication
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  if (isProtectedRoute) {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value

    // If no token, redirect to home page
    if (!token) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }

    // Verify token
    const decoded = verifyToken(token)
    if (!decoded) {
      // If token is invalid or expired, clear cookie and redirect
      const response = NextResponse.redirect(new URL('/', request.url))
      response.cookies.set('auth-token', '', { maxAge: 0 })
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
