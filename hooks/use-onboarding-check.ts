'use client'

import { useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

/**
 * Hook to check if user has completed onboarding
 * Redirects to /onboarding if not completed
 * 
 * @param enabled - Whether to enable the check (default: true)
 */
export function useOnboardingCheck(enabled: boolean = true) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!enabled || loading) return

    // If not authenticated, let the page handle redirect
    if (!user) return

    // Check if onboarding is completed
    if (!user.profile?.onboardingCompleted) {
      console.log('[OnboardingCheck] User has not completed onboarding, redirecting...')
      router.push('/onboarding')
    }
  }, [user, loading, router, enabled])

  return {
    isOnboardingComplete: user?.profile?.onboardingCompleted ?? false,
    loading,
  }
}
