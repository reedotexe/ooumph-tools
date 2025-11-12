"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useWorkflow } from "@/lib/workflow-context"
import { useOnboardingCheck } from "@/hooks/use-onboarding-check"
import { WorkflowNavigation, WORKFLOW_STEPS } from "@/components/workflow-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, CheckCircle, Lightbulb, Target, Palette, TrendingUp, FileText, Megaphone, Loader2 } from "lucide-react"
import SharedNavbar from "@/components/shared-navbar"

console.log("[v0] Content Ideas Generator component loading")

interface ContentIdeasData {
  "content writer output": {
    brand_overview: {
      mission: string
      vision: string
    }
    target_audience: string
    messaging_pillars: {
      [key: string]: string
    }
  }
  "conten strategy": {
    content_strategy: {
      content_pillars: Array<{
        name: string
        description: string
      }>
      monthly_themes: Array<{
        month: string
        theme: string
        focus: string
      }>
      campaign_ideas: Array<{
        name: string
        description: string
      }>
      content_topics: {
        blog: Array<{
          title: string
          pillar: string
          summary: string
        }>
        social_media: Array<{
          content_title: string
          platforms: string
          format: string
          description: string
        }>
      }
    }
  }
  "style guide": {
    style_guide: {
      voice: string
      persona: string
      tone: string
      language: string
      content_dos: string[]
      content_donts: string[]
      example_phrases: string[]
    }
  }
  "Topic Research": {
    best_summary_of_key_trends: Array<{
      title: string
      category: string
      insight: string
    }>
    top_search_queries: string[]
    suggested_keywords: string[]
    content_ideas: Array<{
      title: string
      format: string
      angle: string
      alignment: string
    }>
  }
  "Content Drafting": {
    title: string
    niche: string
    outline: string[]
    content: string
  }
  Ad: {
    ads: Array<{
      ad_variant: string
      hook: string
      value_proposition: string
      cta: string
      image_prompt: string
    }>
  }
}

export default function ContentIdeasPage() {
  console.log("[v0] Content Ideas Generator component rendering")

  // Check onboarding status
  useOnboardingCheck()
  const { user } = useAuth()
  const { getInputForAgent, setWorkflowData } = useWorkflow()

  const [formData, setFormData] = useState({
    brand_name: "",
    business_description: "",
    monetization_approach: "",
    target_audience: "",
    platform_preferences: "",
    additional_info: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<ContentIdeasData | null>(null)
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set())

  // Pre-fill form with user profile data OR workflow data from brandbook
  useEffect(() => {
    // First priority: Use workflow data from brandbook if available
    const workflowInput = getInputForAgent('content')
    if (workflowInput?.brandContext) {
      const bc = workflowInput.brandContext
      setFormData(prev => ({
        ...prev,
        additional_info: `Brand Voice: ${bc.voiceAndTone || ''}\n\nMessaging Pillars: ${bc.messagingPillars?.join(', ') || ''}\n\nTaglines: ${bc.taglines?.join(', ') || ''}`,
      }))
    }

    // Second priority: Use user profile data
    if (user?.profile) {
      const profile = user.profile
      setFormData(prev => ({
        ...prev,
        brand_name: profile.brandName || profile.companyName || prev.brand_name,
        business_description: profile.businessDescription || prev.business_description,
        monetization_approach: profile.monetizationApproach || prev.monetization_approach,
        target_audience: profile.targetAudience || prev.target_audience,
        platform_preferences: profile.platformPreferences || prev.platform_preferences,
        additional_info: profile.additionalInfo || prev.additional_info,
      }))
    }
  }, [user, getInputForAgent])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const copyToClipboard = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItems((prev) => new Set([...prev, itemId]))
      setTimeout(() => {
        setCopiedItems((prev) => {
          const newSet = new Set(prev)
          newSet.delete(itemId)
          return newSet
        })
      }, 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const CopyButton = ({ text, itemId, className = "" }: { text: string; itemId: string; className?: string }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => copyToClipboard(text, itemId)}
      className={`h-8 w-8 p-0 ${className}`}
    >
      {copiedItems.has(itemId) ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
    </Button>
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    console.log("[v0] Form submitted with data:", formData)

    const maxRetries = 3
    let attempt = 0

    while (attempt < maxRetries) {
      attempt++
      let timeoutReached = false

      try {
        const webhookUrl = process.env.NEXT_PUBLIC_CONTENT_IDEAS_WEBHOOK_URL || "https://n8n.ooumph.com/webhook/content-ideas-generator"

        console.log(`[v0] Sending request to webhook (attempt ${attempt}/${maxRetries}):`, webhookUrl)

        const controller = new AbortController()

        const timeoutId = setTimeout(() => {
          timeoutReached = true
          controller.abort()
        }, 600000) // 10 minutes timeout

        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            ...formData,
            timestamp: new Date().toISOString(),
            requestId: Math.random().toString(36).substring(7),
          }),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        console.log("[v0] Webhook response status:", response.status)

        if (!response.ok) {
          const errorText = await response.text()
          console.log("[v0] Webhook error response:", errorText)
          throw new Error(`Content Ideas generation failed: ${response.status} ${response.statusText}`)
        }

        // Get response as text first to check if it's empty
        const responseText = await response.text()
        console.log("[v0] Raw response:", responseText)

        if (!responseText || responseText.trim() === "") {
          throw new Error("Webhook returned empty response")
        }

        // Try to parse JSON
        let data
        try {
          data = JSON.parse(responseText)
          console.log("[v0] Parsed response data:", data)
        } catch (parseError) {
          console.error("[v0] JSON parse error:", parseError)
          console.log("[v0] Response text that failed to parse:", responseText)
          throw new Error(`Invalid JSON response from webhook: ${parseError}`)
        }

        const contentData = Array.isArray(data) ? data[0] : data
        setResults(contentData)

        // Save to workflow context for next agent
        setWorkflowData({
          contentIdeas: {
            result: contentData,
            timestamp: new Date().toISOString(),
          }
        })

        console.log("[v0] Content Ideas results saved to workflow context")
        setIsLoading(false)
        return // Success - exit the retry loop

      } catch (error) {
        console.error(`[v0] Error on attempt ${attempt}:`, error)

        if (timeoutReached) {
          console.log("[v0] Request timed out after 10 minutes")
        }

        // If this was the last attempt, show error
        if (attempt >= maxRetries) {
          console.error("[v0] All retry attempts failed")
          alert(`Failed to generate content ideas after ${maxRetries} attempts. The n8n webhook may be unreachable. Please check:\n\n1. Is the n8n server running?\n2. Is the webhook URL correct in your .env file?\n3. Check browser console for details.`)
        } else {
          // Wait before retrying (exponential backoff)
          const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 10000)
          console.log(`[v0] Waiting ${waitTime}ms before retry...`)
          await new Promise(resolve => setTimeout(resolve, waitTime))
        }
      }
    }

    setIsLoading(false)
  }

  if (results) {
    console.log("[v0] Rendering results view")
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <SharedNavbar currentPage="Content Ideas Generator" />

        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Content Ideas Dashboard</h1>
            <Button onClick={() => setResults(null)} variant="outline" className="mb-6">
              Generate New Ideas
            </Button>
          </div>

          <Tabs defaultValue="brand-foundation" className="w-full">
            <TabsList className="grid w-full grid-cols-6 mb-8">
              <TabsTrigger value="brand-foundation" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Brand Foundation
              </TabsTrigger>
              <TabsTrigger value="content-strategy" className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Content Strategy
              </TabsTrigger>
              <TabsTrigger value="style-guide" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Style Guide
              </TabsTrigger>
              <TabsTrigger value="research" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Research
              </TabsTrigger>
              <TabsTrigger value="content-samples" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Content Samples
              </TabsTrigger>
              <TabsTrigger value="advertisements" className="flex items-center gap-2">
                <Megaphone className="h-4 w-4" />
                Advertisements
              </TabsTrigger>
            </TabsList>

            {/* Brand Foundation Tab */}
            <TabsContent value="brand-foundation" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Mission
                    </CardTitle>
                    <CopyButton
                      text={results["content writer output"]?.brand_overview?.mission || ""}
                      itemId="mission"
                    />
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      {results["content writer output"]?.brand_overview?.mission}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      Vision
                    </CardTitle>
                    <CopyButton text={results["content writer output"]?.brand_overview?.vision || ""} itemId="vision" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      {results["content writer output"]?.brand_overview?.vision}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Target Audience</CardTitle>
                  <CopyButton text={results["content writer output"]?.target_audience || ""} itemId="target-audience" />
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{results["content writer output"]?.target_audience}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Messaging Pillars</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results["content writer output"]?.messaging_pillars &&
                      typeof results["content writer output"].messaging_pillars === "object" ? (
                      Object.entries(results["content writer output"].messaging_pillars).map(([key, value], index) => (
                        <div key={index} className="p-4 border rounded-lg bg-gray-50">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900 capitalize">{key.replace("_", " ")}</h4>
                            <CopyButton text={`${key}: ${value}`} itemId={`pillar-${index}`} />
                          </div>
                          <p className="text-gray-600 text-sm">{value as string}</p>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2">
                        <p className="text-gray-600">No messaging pillars available</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Content Strategy Tab */}
            <TabsContent value="content-strategy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Content Pillars</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results["conten strategy"]?.content_strategy?.content_pillars?.map((pillar, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-blue-50">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{pillar.name}</h4>
                          <CopyButton
                            text={`${pillar.name}: ${pillar.description}`}
                            itemId={`content-pillar-${index}`}
                          />
                        </div>
                        <p className="text-gray-600 text-sm">{pillar.description}</p>
                      </div>
                    )) || <p className="text-gray-600">No content pillars available</p>}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Themes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {results["conten strategy"]?.content_strategy?.monthly_themes?.map((theme, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-green-50">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">
                            {theme.month}: {theme.theme}
                          </h4>
                          <CopyButton
                            text={`${theme.month}: ${theme.theme} - ${theme.focus}`}
                            itemId={`theme-${index}`}
                          />
                        </div>
                        <p className="text-gray-600 text-sm">{theme.focus}</p>
                      </div>
                    )) || <p className="text-gray-600">No monthly themes available</p>}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Campaign Ideas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {results["conten strategy"]?.content_strategy?.campaign_ideas?.map((campaign, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-purple-50">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{campaign.name}</h4>
                          <CopyButton text={`${campaign.name}: ${campaign.description}`} itemId={`campaign-${index}`} />
                        </div>
                        <p className="text-gray-600 text-sm">{campaign.description}</p>
                      </div>
                    )) || <p className="text-gray-600">No campaign ideas available</p>}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Content Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Blog Topics</h4>
                      <div className="space-y-3">
                        {results["conten strategy"]?.content_strategy?.content_topics?.blog?.map((topic, index) => (
                          <div key={index} className="p-3 border rounded-lg bg-orange-50">
                            <div className="flex items-center justify-between mb-1">
                              <h5 className="font-medium text-gray-900">{topic.title}</h5>
                              <CopyButton text={`${topic.title}: ${topic.summary}`} itemId={`blog-${index}`} />
                            </div>
                            <p className="text-xs text-purple-600 mb-1">Pillar: {topic.pillar}</p>
                            <p className="text-gray-600 text-sm">{topic.summary}</p>
                          </div>
                        )) || <p className="text-gray-600">No blog topics available</p>}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Social Media Content</h4>
                      <div className="space-y-3">
                        {results["conten strategy"]?.content_strategy?.content_topics?.social_media?.map(
                          (content, index) => (
                            <div key={index} className="p-3 border rounded-lg bg-pink-50">
                              <div className="flex items-center justify-between mb-1">
                                <h5 className="font-medium text-gray-900">{content.content_title}</h5>
                                <CopyButton
                                  text={`${content.content_title}: ${content.description}`}
                                  itemId={`social-${index}`}
                                />
                              </div>
                              <p className="text-xs text-blue-600 mb-1">
                                Platforms: {content.platforms} | Format: {content.format}
                              </p>
                              <p className="text-gray-600 text-sm">{content.description}</p>
                            </div>
                          ),
                        ) || <p className="text-gray-600">No social media content available</p>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Style Guide Tab */}
            <TabsContent value="style-guide" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Voice & Persona</CardTitle>
                    <CopyButton text={results["style guide"]?.style_guide?.voice || ""} itemId="voice" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{results["style guide"]?.style_guide?.voice}</p>
                    <div className="mt-4">
                      <h5 className="font-medium text-gray-900 mb-2">Persona</h5>
                      <p className="text-gray-600 text-sm">{results["style guide"]?.style_guide?.persona}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Tone</CardTitle>
                    <CopyButton text={results["style guide"]?.style_guide?.tone || ""} itemId="tone" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{results["style guide"]?.style_guide?.tone}</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Language Guidelines</CardTitle>
                  <CopyButton text={results["style guide"]?.style_guide?.language || ""} itemId="language" />
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed mb-4">{results["style guide"]?.style_guide?.language}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Content Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-green-700 mb-3">Do's</h5>
                      <div className="space-y-2">
                        {results["style guide"]?.style_guide?.content_dos?.map((item, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <div className="flex-1 flex items-center justify-between">
                              <p className="text-gray-700 text-sm">{item}</p>
                              <CopyButton text={item} itemId={`do-${index}`} className="ml-2" />
                            </div>
                          </div>
                        )) || <p className="text-gray-600">No guidelines available</p>}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-red-700 mb-3">Don'ts</h5>
                      <div className="space-y-2">
                        {results["style guide"]?.style_guide?.content_donts?.map((item, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                            <div className="flex-1 flex items-center justify-between">
                              <p className="text-gray-700 text-sm">{item}</p>
                              <CopyButton text={item} itemId={`dont-${index}`} className="ml-2" />
                            </div>
                          </div>
                        )) || <p className="text-gray-600">No guidelines available</p>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Example Phrases</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {results["style guide"]?.style_guide?.example_phrases?.map((phrase, index) => (
                      <div key={index} className="p-3 border rounded-lg bg-blue-50 flex items-center justify-between">
                        <p className="text-gray-700 text-sm italic">{phrase}</p>
                        <CopyButton text={phrase} itemId={`phrase-${index}`} />
                      </div>
                    )) || <p className="text-gray-600">No example phrases available</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Research Tab */}
            <TabsContent value="research" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Key Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {results["Topic Research"]?.best_summary_of_key_trends?.map((trend, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-indigo-50">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{trend.title}</h4>
                          <CopyButton text={`${trend.title}: ${trend.insight}`} itemId={`trend-${index}`} />
                        </div>
                        <p className="text-xs text-indigo-600 mb-2">Category: {trend.category}</p>
                        <p className="text-gray-600 text-sm">{trend.insight}</p>
                      </div>
                    )) || <p className="text-gray-600">No trends available</p>}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Search Queries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {results["Topic Research"]?.top_search_queries?.map((query, index) => (
                      <div key={index} className="p-3 border rounded-lg bg-yellow-50 flex items-center justify-between">
                        <p className="text-gray-700 font-medium">{query}</p>
                        <CopyButton text={query} itemId={`query-${index}`} />
                      </div>
                    )) || <p className="text-gray-600">No search queries available</p>}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Suggested Keywords</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {results["Topic Research"]?.suggested_keywords?.map((keyword, index) => (
                      <div key={index} className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                        <span className="text-gray-700 text-sm">{keyword}</span>
                        <CopyButton text={keyword} itemId={`keyword-${index}`} />
                      </div>
                    )) || <p className="text-gray-600">No keywords available</p>}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Content Ideas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {results["Topic Research"]?.content_ideas?.map((idea, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-teal-50">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{idea.title}</h4>
                          <CopyButton text={`${idea.title}: ${idea.angle}`} itemId={`idea-${index}`} />
                        </div>
                        <p className="text-xs text-teal-600 mb-2">Format: {idea.format}</p>
                        <p className="text-gray-600 text-sm mb-2">{idea.angle}</p>
                        <p className="text-xs text-gray-500">Alignment: {idea.alignment}</p>
                      </div>
                    )) || <p className="text-gray-600">No content ideas available</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Content Samples Tab */}
            <TabsContent value="content-samples" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{results["Content Drafting"]?.title || "Content Sample"}</CardTitle>
                  <CopyButton text={results["Content Drafting"]?.title || ""} itemId="content-title" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Niche</h5>
                      <p className="text-gray-600 text-sm">{results["Content Drafting"]?.niche}</p>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Outline</h5>
                      <div className="space-y-2">
                        {results["Content Drafting"]?.outline?.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <p className="text-gray-700 text-sm">{item}</p>
                            <CopyButton text={item} itemId={`outline-${index}`} />
                          </div>
                        )) || <p className="text-gray-600">No outline available</p>}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">Full Content</h5>
                        <CopyButton text={results["Content Drafting"]?.content || ""} itemId="full-content" />
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg max-h-96 overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                          {results["Content Drafting"]?.content}
                        </pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Advertisements Tab */}
            <TabsContent value="advertisements" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results["Ad"]?.ads?.map((ad, index) => (
                  <Card key={index} className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Ad Variant {ad.ad_variant}</span>
                        <CopyButton
                          text={`${ad.hook}\n\n${ad.value_proposition}\n\nCTA: ${ad.cta}`}
                          itemId={`ad-${index}`}
                        />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Hook</h5>
                        <div className="flex items-start justify-between">
                          <p className="text-gray-700 text-sm flex-1">{ad.hook}</p>
                          <CopyButton text={ad.hook} itemId={`hook-${index}`} className="ml-2" />
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Value Proposition</h5>
                        <div className="flex items-start justify-between">
                          <p className="text-gray-700 text-sm flex-1">{ad.value_proposition}</p>
                          <CopyButton text={ad.value_proposition} itemId={`value-${index}`} className="ml-2" />
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Call to Action</h5>
                        <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                          <span className="text-purple-700 font-medium">{ad.cta}</span>
                          <CopyButton text={ad.cta} itemId={`cta-${index}`} />
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Image Prompt</h5>
                        <div className="flex items-start justify-between">
                          <p className="text-gray-600 text-xs flex-1">{ad.image_prompt}</p>
                          <CopyButton text={ad.image_prompt} itemId={`image-${index}`} className="ml-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )) || <p className="text-gray-600">No advertisements available</p>}
              </div>
            </TabsContent>
          </Tabs>

          {/* Workflow Navigation */}
          <WorkflowNavigation
            currentAgent={WORKFLOW_STEPS['content-ideas'].name}
            nextAgent={WORKFLOW_STEPS['content-ideas'].next}
          />
        </div>
      </div>
    )
  }

  console.log("[v0] Rendering form view")
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <SharedNavbar currentPage="Content Ideas Generator" />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Content Ideas Generator</h1>
          <p className="text-xl text-gray-600 mb-8">
            Generate comprehensive content strategies, style guides, and campaign ideas for your brand
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-6 w-6" />
              Tell Us About Your Brand
            </CardTitle>
            <CardDescription>
              Provide details about your brand to generate personalized content ideas and strategies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="brand_name">Brand Name</Label>
                  <Input
                    id="brand_name"
                    placeholder="Enter your brand name"
                    value={formData.brand_name}
                    onChange={(e) => handleInputChange("brand_name", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="platform_preferences">Platform Preferences</Label>
                  <Input
                    id="platform_preferences"
                    placeholder="e.g., Instagram, LinkedIn, TikTok, Blog"
                    value={formData.platform_preferences}
                    onChange={(e) => handleInputChange("platform_preferences", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_description">What does your business do?</Label>
                <Textarea
                  id="business_description"
                  placeholder="Describe your business, products, or services in detail"
                  value={formData.business_description}
                  onChange={(e) => handleInputChange("business_description", e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="monetization_approach">Monetization Approach</Label>
                <Textarea
                  id="monetization_approach"
                  placeholder="How do you make money? (e.g., subscriptions, one-time sales, advertising, services)"
                  value={formData.monetization_approach}
                  onChange={(e) => handleInputChange("monetization_approach", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target_audience">Target Audience</Label>
                <Textarea
                  id="target_audience"
                  placeholder="Describe your ideal customers (demographics, interests, pain points, behaviors)"
                  value={formData.target_audience}
                  onChange={(e) => handleInputChange("target_audience", e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additional_info">Additional Information & Preferences</Label>
                <Textarea
                  id="additional_info"
                  placeholder="Any other important details, brand values, content preferences, or specific requirements"
                  value={formData.additional_info}
                  onChange={(e) => handleInputChange("additional_info", e.target.value)}
                  rows={4}
                />
              </div>

              <Button
                type="submit"
                className="w-full text-lg py-6"
                style={{ backgroundColor: "#8B5CF6" }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Content Ideas...
                  </>
                ) : (
                  <>
                    <Lightbulb className="mr-2 h-5 w-5" />
                    Generate Content Ideas
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
