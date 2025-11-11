// Test script to verify onboarding data saves correctly
// Run with: node --loader ts-node/esm test-onboarding.mjs

import { db } from './lib/db.ts'

async function testOnboarding() {
  try {
    console.log('Testing onboarding flow...')
    
    // Find a user (you'll need to replace with your actual email)
    const testEmail = 'your-email@example.com' // CHANGE THIS
    const user = await db.users.findByEmail(testEmail)
    
    if (!user) {
      console.error('User not found with email:', testEmail)
      console.log('Please update the test script with your actual email')
      return
    }
    
    console.log('Found user:', user.email, 'ID:', user.id)
    console.log('Current profile:', user.profile)
    
    // Test update with profile data
    const testProfile = {
      profile: {
        companyName: 'Test Company',
        businessDescription: 'A test business',
        industry: 'Technology',
        targetAudience: 'Developers',
        onboardingCompleted: true
      }
    }
    
    console.log('\nUpdating user with test profile...')
    const updated = await db.users.update(user.id, testProfile)
    
    if (updated) {
      console.log('✅ Update successful!')
      console.log('Updated profile:', updated.profile)
    } else {
      console.error('❌ Update failed - user not found or update error')
    }
    
    // Verify by fetching again
    console.log('\nVerifying update by fetching user again...')
    const verified = await db.users.findById(user.id)
    console.log('Verified profile:', verified?.profile)
    console.log('Onboarding completed:', verified?.profile?.onboardingCompleted)
    
  } catch (error) {
    console.error('Test error:', error)
  }
  
  process.exit(0)
}

testOnboarding()
