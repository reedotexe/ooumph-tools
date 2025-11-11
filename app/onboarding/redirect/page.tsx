'use client'

import { useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function OnboardingRedirect() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (loading) return

      if (!user) {
        router.push('/')
        return
      }

      try {
        const response = await fetch('/api/profile/onboarding', {
          credentials: 'include',
        })

        if (response.ok) {
          const data = await response.json()
          
          if (data.onboardingCompleted) {
            router.push('/')
          } else {
            router.push('/onboarding')
          }
        } else {
          router.push('/onboarding')
        }
      } catch (error) {
        console.error('[OnboardingRedirect] Error checking status:', error)
        router.push('/onboarding')
      }
    }

    checkOnboardingStatus()
  }, [user, loading, router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Setting up your account...</p>
      </div>
    </div>
  )
}
