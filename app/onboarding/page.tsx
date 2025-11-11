'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Building2, 
  Target, 
  Lightbulb, 
  TrendingUp, 
  Loader2,
  Check,
  ArrowRight,
  ArrowLeft
} from 'lucide-react'

export default function OnboardingPage() {
  const { user, loading, refreshUser } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    // Step 1: Company Basics
    companyName: '',
    brandName: '',
    businessDescription: '',
    industry: '',
    website: '',
    
    // Step 2: Target Audience
    targetAudience: '',
    customerDemographics: '',
    
    // Step 3: Business Strategy
    monetizationApproach: '',
    valueProposition: '',
    competitors: '',
    
    // Step 4: Brand Identity
    brandVoice: '',
    brandValues: '',
    brandMission: '',
    brandVision: '',
    
    // Step 5: Marketing
    platformPreferences: '',
    contentGoals: '',
    additionalInfo: '',
    constraints: '',
  })

  const totalSteps = 5
  const progress = (step / totalSteps) * 100

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  const handleNext = () => {
    // Validate current step
    if (step === 1) {
      if (!formData.companyName || !formData.businessDescription || !formData.industry) {
        setError('Please fill in all required fields')
        return
      }
    } else if (step === 2) {
      if (!formData.targetAudience) {
        setError('Please describe your target audience')
        return
      }
    }
    
    setError('')
    setStep(prev => Math.min(prev + 1, totalSteps))
  }

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1))
    setError('')
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError('')

    console.log('[Onboarding Frontend] Submitting data:', formData)

    try {
      const response = await fetch('/api/profile/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      })

      const data = await response.json()
      console.log('[Onboarding Frontend] Response status:', response.status)
      console.log('[Onboarding Frontend] Response data:', data)

      if (response.ok) {
        console.log('[Onboarding Frontend] Success! Refreshing user data...')
        // Refresh user data to get updated profile
        await refreshUser()
        console.log('[Onboarding Frontend] User refreshed, redirecting to home...')
        // Redirect to home or dashboard
        router.push('/')
      } else {
        console.error('[Onboarding Frontend] Error:', data.error)
        setError(data.error || 'Failed to complete onboarding')
      }
    } catch (err) {
      console.error('[Onboarding] Submit error:', err)
      setError('Failed to save profile. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to Ooumph Tools! 👋</h1>
          <p className="text-xl text-gray-600">
            Let's set up your profile to get the most out of our AI-powered marketing tools
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Step 1: Company Basics */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-primary" />
                Company & Business Information
              </CardTitle>
              <CardDescription>
                Tell us about your business so we can tailor content for your brand
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  placeholder="Enter your company name"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brandName">Brand Name (if different from company)</Label>
                <Input
                  id="brandName"
                  placeholder="Enter your brand name"
                  value={formData.brandName}
                  onChange={(e) => handleInputChange('brandName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessDescription">Business Description *</Label>
                <Textarea
                  id="businessDescription"
                  placeholder="What does your business do? What products/services do you offer?"
                  value={formData.businessDescription}
                  onChange={(e) => handleInputChange('businessDescription', e.target.value)}
                  rows={4}
                  required
                />
                <p className="text-xs text-gray-500">
                  Be detailed - this helps all our tools understand your business better
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry *</Label>
                  <Input
                    id="industry"
                    placeholder="e.g., SaaS, E-commerce, Consulting"
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://yourwebsite.com"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Target Audience */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                Target Audience
              </CardTitle>
              <CardDescription>
                Understanding your audience helps us create more effective content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="targetAudience">Who are your ideal customers? *</Label>
                <Textarea
                  id="targetAudience"
                  placeholder="Describe your target audience: demographics, behaviors, pain points, interests..."
                  value={formData.targetAudience}
                  onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                  rows={5}
                  required
                />
                <p className="text-xs text-gray-500">
                  Include age ranges, job titles, locations, interests, and challenges they face
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerDemographics">Customer Demographics (Optional)</Label>
                <Textarea
                  id="customerDemographics"
                  placeholder="Additional demographic information like income level, education, family status..."
                  value={formData.customerDemographics}
                  onChange={(e) => handleInputChange('customerDemographics', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Business Strategy */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                Business Strategy
              </CardTitle>
              <CardDescription>
                Help us understand your business model and competitive landscape
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="monetizationApproach">How do you make money?</Label>
                <Textarea
                  id="monetizationApproach"
                  placeholder="e.g., Subscriptions, one-time sales, freemium model, advertising, services..."
                  value={formData.monetizationApproach}
                  onChange={(e) => handleInputChange('monetizationApproach', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valueProposition">What makes you unique?</Label>
                <Textarea
                  id="valueProposition"
                  placeholder="Your unique value proposition - why should customers choose you?"
                  value={formData.valueProposition}
                  onChange={(e) => handleInputChange('valueProposition', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="competitors">Who are your competitors?</Label>
                <Input
                  id="competitors"
                  placeholder="List 2-3 main competitors"
                  value={formData.competitors}
                  onChange={(e) => handleInputChange('competitors', e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  This helps us position your content effectively
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Brand Identity */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-6 w-6 text-primary" />
                Brand Identity
              </CardTitle>
              <CardDescription>
                Define your brand personality and values for consistent messaging
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="brandVoice">Brand Voice & Tone</Label>
                <Textarea
                  id="brandVoice"
                  placeholder="How should your brand sound? (e.g., professional, friendly, authoritative, playful...)"
                  value={formData.brandVoice}
                  onChange={(e) => handleInputChange('brandVoice', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brandValues">Brand Values</Label>
                <Input
                  id="brandValues"
                  placeholder="e.g., Innovation, Trust, Sustainability"
                  value={formData.brandValues}
                  onChange={(e) => handleInputChange('brandValues', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brandMission">Brand Mission</Label>
                <Textarea
                  id="brandMission"
                  placeholder="What is your company's mission? What are you trying to achieve?"
                  value={formData.brandMission}
                  onChange={(e) => handleInputChange('brandMission', e.target.value)}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brandVision">Brand Vision</Label>
                <Textarea
                  id="brandVision"
                  placeholder="Where do you see your company in the future?"
                  value={formData.brandVision}
                  onChange={(e) => handleInputChange('brandVision', e.target.value)}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Marketing & Final Details */}
        {step === 5 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="h-6 w-6 text-primary" />
                Marketing Preferences & Final Details
              </CardTitle>
              <CardDescription>
                Last step! Tell us about your marketing goals and any specific requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="platformPreferences">Platform Preferences</Label>
                <Input
                  id="platformPreferences"
                  placeholder="e.g., LinkedIn, Instagram, Twitter, Blog, YouTube"
                  value={formData.platformPreferences}
                  onChange={(e) => handleInputChange('platformPreferences', e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Which platforms do you use or plan to use for marketing?
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contentGoals">Content Goals</Label>
                <Textarea
                  id="contentGoals"
                  placeholder="What do you want to achieve with your content? (e.g., brand awareness, lead generation, thought leadership...)"
                  value={formData.contentGoals}
                  onChange={(e) => handleInputChange('contentGoals', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="constraints">Constraints & Requirements</Label>
                <Textarea
                  id="constraints"
                  placeholder="Any specific requirements or limitations? (e.g., brand guidelines, restricted topics, compliance requirements...)"
                  value={formData.constraints}
                  onChange={(e) => handleInputChange('constraints', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Additional Information</Label>
                <Textarea
                  id="additionalInfo"
                  placeholder="Anything else we should know to serve you better?"
                  value={formData.additionalInfo}
                  onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>✓ Your profile will be saved and used to personalize all tools</li>
                  <li>✓ Generated content will match your brand voice and style</li>
                  <li>✓ You can update your profile anytime from your account settings</li>
                  <li>✓ Get better results with more accurate, brand-aligned content</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1 || isSubmitting}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {step < totalSteps ? (
            <Button onClick={handleNext} disabled={isSubmitting}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Complete Setup
                  <Check className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
