import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { db } from '@/lib/db'

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string
    email: string
    name: string
  }
}

/**
 * Authentication middleware to protect API routes
 * Usage: export const GET = withAuth(async (request: AuthenticatedRequest) => { ... })
 */
export function withAuth(
  handler: (request: AuthenticatedRequest) => Promise<NextResponse>
) {
  return async (request: AuthenticatedRequest) => {
    try {
      // Get token from cookie
      const token = request.cookies.get('auth-token')?.value

      if (!token) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }

      // Verify token
      const decoded = verifyToken(token)
      if (!decoded) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        )
      }

      // Verify user still exists
      const user = await db.users.findById(decoded.userId)
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 401 }
        )
      }

      // Attach user to request
      request.user = {
        userId: decoded.userId,
        email: decoded.email,
        name: decoded.name,
      }

      // Call the actual handler
      return handler(request)
    } catch (error) {
      console.error('[Middleware] Auth error:', error)
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      )
    }
  }
}
