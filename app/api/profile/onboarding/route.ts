import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    console.log('[Onboarding] POST request received')
    
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      console.log('[Onboarding] No auth token found')
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify token
    const decoded = verifyToken(token)
    if (!decoded) {
      console.log('[Onboarding] Invalid token')
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    console.log('[Onboarding] Token verified for user:', decoded.email)

    // Get profile data from request
    const profileData = await request.json()
    console.log('[Onboarding] Profile data received:', Object.keys(profileData))

    // Validate required fields
    const requiredFields = ['companyName', 'businessDescription', 'industry', 'targetAudience']
    const missingFields = requiredFields.filter(field => !profileData[field])
    
    if (missingFields.length > 0) {
      console.log('[Onboarding] Missing required fields:', missingFields)
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    console.log('[Onboarding] All required fields present, updating user:', decoded.userId)

    // Update user profile
    const updatedUser = await db.users.update(decoded.userId, {
      profile: {
        ...profileData,
        onboardingCompleted: true,
      }
    })

    if (!updatedUser) {
      console.log('[Onboarding] User not found:', decoded.userId)
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    console.log('[Onboarding] Profile updated successfully for user:', decoded.email)
    console.log('[Onboarding] Updated user object keys:', Object.keys(updatedUser))
    console.log('[Onboarding] Profile exists:', !!updatedUser.profile)
    console.log('[Onboarding] Profile onboardingCompleted:', updatedUser.profile?.onboardingCompleted)

    // Verify by fetching the user again
    console.log('[Onboarding] Verifying update by fetching user again...')
    const verifiedUser = await db.users.findById(decoded.userId)
    console.log('[Onboarding] Verified profile exists:', !!verifiedUser?.profile)
    console.log('[Onboarding] Verified onboardingCompleted:', verifiedUser?.profile?.onboardingCompleted)

    return NextResponse.json(
      { 
        message: 'Onboarding completed successfully',
        profile: updatedUser.profile
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('[Onboarding] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
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

    // Get user profile
    const user = await db.users.findById(decoded.userId)
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { 
        profile: user.profile || null,
        onboardingCompleted: user.profile?.onboardingCompleted || false
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('[Onboarding] Get profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
