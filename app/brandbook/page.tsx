"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/lib/auth-context"
import { useOnboardingCheck } from "@/hooks/use-onboarding-check"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  XCircle,
  Palette,
  Target,
  MessageSquare,
  Lightbulb,
  TrendingUp,
  Download,
  Copy,
  Eye,
  Calendar,
  BarChart3,
  ImageIcon,
  Type,
  Zap,
} from "lucide-react"
import SharedNavbar from "@/components/shared-navbar"

const BRANDBOOK_WEBHOOK_URL = process.env.NEXT_PUBLIC_BRANDBOOK_WEBHOOK_URL || "https://n8n.ooumph.com/webhook/brandbook"

interface BrandBookResult {
  "messaging framer worker": {
    voice_and_tone: string
    messaging_pillars: string[]
    taglines: string[]
  }
  "visual identity advisor": string
  "brand guidelines generator": string
  "content strategy": string
  "campaign planner": string
}

interface ParsedVisualIdentity {
  colors: {
    primary: { hex: string; rationale: string }
    secondary: { hex: string; rationale: string }
    accent: { hex: string; rationale: string }
  }
  fonts: {
    headings: { name: string; url: string }
    body: { name: string; url: string }
  }
  styleMotifs: string[]
  moodBoardPrompt: string
}

interface ParsedContentStrategy {
  content_strategy: {
    content_pillars: Array<{ name: string; description: string }>
    monthly_themes: Array<{ month: string; theme: string; focus: string }>
    campaign_ideas: Array<{ name: string; description: string }>
    content_topics: {
      blog: Array<{ title: string; pillar: string; summary: string }>
      social_media: Array<{ platforms: string; content_title: string; format: string; description: string }>
    }
  }
}

interface ParsedCampaignPlan {
  campaign_plan: {
    objectives: string[]
    timeline: Array<{ week: string; milestones: string[] }>
    channels: Array<{ name: string; tactics: string[] }>
    deliverables: Array<{ name: string; due_date: string; owner: string }>
    kpis: string[]
  }
}

export default function BrandbookTool() {
  // Check onboarding status
  useOnboardingCheck()
  const { user } = useAuth()

  const [brandIdea, setBrandIdea] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<BrandBookResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [ideaError, setIdeaError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("brand-overview")
  const toolsDropdownRef = useRef<HTMLDivElement>(null)
  const userDropdownRef = useRef<HTMLDivElement>(null)

  // Pre-fill form with user profile data
  useEffect(() => {
    if (user?.profile) {
      const profileInfo = [
        user.profile.businessDescription,
        user.profile.targetAudience && `Target Audience: ${user.profile.targetAudience}`,
        user.profile.brandMission && `Mission: ${user.profile.brandMission}`,
        user.profile.brandValues && `Values: ${user.profile.brandValues}`,
        user.profile.valueProposition && `USP: ${user.profile.valueProposition}`,
        user.profile.additionalInfo,
      ].filter(Boolean).join('\n\n')
      
      setBrandIdea(profileInfo)
    }
  }, [user])

  useEffect(() => {
    setMounted(true)

    const handleClickOutside = (event: MouseEvent) => {
      if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(event.target as Node)) {
        setIsToolsDropdownOpen(false)
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleGenerate = async () => {
    if (!brandIdea.trim()) {
      setIdeaError("Please describe your business idea")
      return
    }

    if (brandIdea.trim().length < 50) {
      setIdeaError(
        "Please provide more details about your business idea, target audience, and vision (at least 50 characters)",
      )
      return
    }

    setIdeaError(null)
    setIsLoading(true)
    setError(null)
    setResults(null)

    let timeoutReached = false
    const controller = new AbortController()

    const maxRetries = 3
    let retryCount = 0

    const attemptGeneration = async (): Promise<BrandBookResult> => {
      try {
        console.log(
          `[v0] Sending brandbook request to webhook (attempt ${retryCount + 1}/${maxRetries}):`,
          BRANDBOOK_WEBHOOK_URL,
        )

        const timeoutId = setTimeout(() => {
          timeoutReached = true
          controller.abort()
        }, 600000) // 10 minute timeout for n8n workflow

        const response = await fetch(BRANDBOOK_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            brandIdea: brandIdea.trim(),
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
          throw new Error(`Brand guidelines generation failed: ${response.status} ${response.statusText}`)
        }

        const responseText = await response.text()
        console.log("[v0] Raw response text:", responseText.substring(0, 200) + "...")

        if (!responseText || responseText.trim() === "") {
          throw new Error("Empty response received from brand guidelines service")
        }

        let responseData
        try {
          responseData = JSON.parse(responseText)
          console.log("[v0] Webhook response data:", responseData)
        } catch (jsonError) {
          console.error("[v0] JSON parsing error:", jsonError)
          console.log("[v0] Response text that failed to parse:", responseText)
          throw new Error(
            "Invalid JSON response from brand guidelines service. The service may be processing your request.",
          )
        }

        let brandData: BrandBookResult
        if (Array.isArray(responseData) && responseData.length > 0 && responseData[0]) {
          brandData = responseData[0]
        } else if (responseData) {
          brandData = responseData
        } else {
          throw new Error("Invalid response format from brand guidelines service")
        }

        if (!brandData["messaging framer worker"] || !brandData["brand guidelines generator"]) {
          throw new Error("Incomplete brand guidelines data received")
        }

        console.log("[v0] Processed brand data:", brandData)
        setIsLoading(false)
        return brandData
      } catch (err) {
        if (err instanceof Error && err.message.includes("Failed to fetch") && retryCount < maxRetries - 1) {
          retryCount++
          console.log(`[v0] Network error, retrying in 2 seconds... (attempt ${retryCount + 1}/${maxRetries})`)
          await new Promise((resolve) => setTimeout(resolve, 2000))
          return attemptGeneration()
        }
        throw err
      }
    }

    try {
      const brandData = await attemptGeneration()
      setResults(brandData)
    } catch (err) {
      console.error("[v0] Brand generation error:", err)
      let errorMessage = "Failed to generate brand guidelines. Please try again."

      if (err instanceof Error) {
        if (err.name === "AbortError") {
          if (timeoutReached) {
            errorMessage =
              "The brand guidelines generation is taking longer than expected (over 10 minutes). This can happen with complex brand ideas. Please try again or contact support if the issue persists."
          } else {
            errorMessage = "Request was cancelled. Please check your internet connection and try again."
          }
        } else if (err.message.includes("Failed to fetch")) {
          errorMessage = `Network error after ${maxRetries} attempts. Unable to reach brand guidelines service at ${BRANDBOOK_WEBHOOK_URL}. The service may be temporarily unavailable. Please try again in a few minutes or contact support.`
        } else if (err.message.includes("CORS")) {
          errorMessage = "Cross-origin request blocked. Please try again or contact support."
        } else {
          errorMessage = err.message
        }
      }

      setError(errorMessage)
      setResults(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleIdeaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBrandIdea(e.target.value)
    if (ideaError) setIdeaError(null)
  }

  const parseVisualIdentity = (visualIdentityString: string): ParsedVisualIdentity | null => {
    try {
      return JSON.parse(visualIdentityString)
    } catch {
      return null
    }
  }

  const parseContentStrategy = (contentStrategyString: string): ParsedContentStrategy | null => {
    try {
      return JSON.parse(contentStrategyString)
    } catch {
      return null
    }
  }

  const parseCampaignPlan = (campaignPlanString: string): ParsedCampaignPlan | null => {
    try {
      return JSON.parse(campaignPlanString)
    } catch {
      return null
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const exportBrandbook = () => {
    if (!results) return

    try {
      const visualIdentity = parseVisualIdentity(results["visual identity advisor"])
      const contentStrategy = parseContentStrategy(results["content strategy"])
      const campaignPlan = parseCampaignPlan(results["campaign planner"])

      const brandbookContent = `
BRAND GUIDELINES DOCUMENT
========================

Generated on: ${new Date().toLocaleDateString()}

BRAND VOICE & TONE
==================
${results["messaging framer worker"].voice_and_tone}

MESSAGING PILLARS
=================
${results["messaging framer worker"].messaging_pillars.map((pillar, index) => `${index + 1}. ${pillar}`).join("\n")}

TAGLINES
========
${results["messaging framer worker"].taglines.map((tagline, index) => `${index + 1}. ${tagline}`).join("\n")}

${
  visualIdentity
    ? `
VISUAL IDENTITY
===============

COLOR PALETTE
Primary Color: ${visualIdentity.colors.primary.hex}
Rationale: ${visualIdentity.colors.primary.rationale}

Secondary Color: ${visualIdentity.colors.secondary.hex}
Rationale: ${visualIdentity.colors.secondary.rationale}

Accent Color: ${visualIdentity.colors.accent.hex}
Rationale: ${visualIdentity.colors.accent.hex}

TYPOGRAPHY
Headings: ${visualIdentity.fonts.headings.name}
Body Text: ${visualIdentity.fonts.body.name}

STYLE MOTIFS
${visualIdentity.styleMotifs.map((motif, index) => `${index + 1}. ${motif}`).join("\n")}

MOOD BOARD DESCRIPTION
${visualIdentity.moodBoardPrompt}
`
    : ""
}

COMPLETE BRAND GUIDELINES
=========================
${results["brand guidelines generator"]}

${
  contentStrategy
    ? `
CONTENT STRATEGY
================

CONTENT PILLARS
${contentStrategy.content_strategy.content_pillars.map((pillar, index) => `${index + 1}. ${pillar.name}: ${pillar.description}`).join("\n")}

MONTHLY THEMES
${contentStrategy.content_strategy.monthly_themes.map((theme, index) => `${index + 1}. ${theme.month}: ${theme.theme}\n   Focus: ${theme.focus}`).join("\n")}

CAMPAIGN IDEAS
${contentStrategy.content_strategy.campaign_ideas.map((campaign, index) => `${index + 1}. ${campaign.name}: ${campaign.description}`).join("\n")}
`
    : ""
}

${
  campaignPlan
    ? `
CAMPAIGN PLANNING
=================

OBJECTIVES
${campaignPlan.campaign_plan.objectives.map((objective, index) => `${index + 1}. ${objective}`).join("\n")}

KEY PERFORMANCE INDICATORS
${campaignPlan.campaign_plan.kpis.map((kpi, index) => `${index + 1}. ${kpi}`).join("\n")}
`
    : ""
}

Generated by Brandbook Generator - Ooumph Tools
      `.trim()

      const blob = new Blob([brandbookContent], { type: "text/plain" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `brandbook-${new Date().toISOString().split("T")[0]}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error("[v0] Export error:", err)
      setError("Failed to export brandbook. Please try again.")
    }
  }

  const navigateToPage = (path: string) => {
    window.location.href = path
  }

  const toggleToolsDropdown = () => {
    setIsToolsDropdownOpen(!isToolsDropdownOpen)
    setIsUserDropdownOpen(false)
  }

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen)
    setIsToolsDropdownOpen(false)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <SharedNavbar currentPage="Brandbook Generator" />

      <div className="container mx-auto px-4 pb-12 max-w-6xl pt-[33px]">
        {!results && (
          <>
            <div className="text-center mb-12 animate-in fade-in duration-1000 delay-300">
              <h2 className="text-4xl font-bold text-foreground mb-4 animate-in slide-in-from-bottom-4 duration-800 delay-400">
                Brandbook Generator
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-800 delay-500">
                Transform your business idea into a complete brand identity with comprehensive guidelines, visual
                identity, and strategic planning
              </p>
            </div>

            <Card className="max-w-4xl mx-auto mb-12 backdrop-blur-sm bg-card/50 border-border shadow-lg hover:shadow-xl transition-all duration-300 animate-in zoom-in-95 duration-600 delay-600">
              <CardContent className="p-6 tracking-normal">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="brand-idea" className="block text-sm font-medium text-foreground mb-2">
                      Tell us about your business idea and vision
                    </label>
                    <Textarea
                      id="brand-idea"
                      placeholder="Describe your business idea, target audience, mission, values, unique selling points, and any specific
                      requirements (minimum 50 characters)"
                      value={brandIdea}
                      onChange={handleIdeaChange}
                      className="min-h-[120px] bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 border border-dashed border-gray-500"
                      disabled={isLoading}
                    />
                    {ideaError && (
                      <p className="text-sm mt-2 animate-in slide-in-from-left-2 duration-300 text-red-500">
                        {ideaError}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Include: your idea, target audience, mission, values, unique selling points, and any specific
                      requirements (minimum 50 characters)
                    </p>
                  </div>
                  <Button
                    onClick={handleGenerate}
                    disabled={!brandIdea.trim() || isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 transition-all duration-200 disabled:hover:scale-100 shadow-xl"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        <span className="animate-pulse">Creating Your Brand Identity...</span>
                      </>
                    ) : (
                      <>
                        <Palette className="mr-2 h-4 w-4 transition-transform duration-200" />
                        Create My Brand Identity
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {isLoading && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <Card className="max-w-4xl mx-auto border-blue-200 bg-blue-50">
              <CardContent className="p-6 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Creating Your Brand Guidelines</h3>
                <p className="text-blue-700 mb-4">
                  Our AI is analyzing your brand idea and creating comprehensive guidelines including messaging, visual
                  identity, content strategy, and campaign planning.
                </p>
                <p className="text-sm text-blue-600">
                  This process may take several minutes. Please keep this tab open...
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: MessageSquare, title: "Messaging Framework" },
                { icon: Palette, title: "Visual Identity" },
                { icon: Lightbulb, title: "Content Strategy" },
                { icon: TrendingUp, title: "Campaign Planning" },
              ].map((item, i) => (
                <Card
                  key={i}
                  className="animate-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <CardHeader className="text-center">
                    <item.icon className="h-8 w-8 mx-auto text-blue-600 animate-pulse" />
                    <CardTitle className="text-sm">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {error && !results && (
          <Card className="max-w-4xl mx-auto border-destructive animate-in zoom-in-95 duration-500 shake">
            <CardContent className="p-6 text-center">
              <XCircle className="h-12 w-12 text-destructive mx-auto mb-4 animate-in zoom-in-50 duration-300" />
              <h3 className="text-lg font-semibold text-destructive mb-2 animate-in slide-in-from-bottom-2 duration-400 delay-100">
                Generation Failed
              </h3>
              <p className="text-muted-foreground mb-4 animate-in slide-in-from-bottom-2 duration-400 delay-200">
                {error}
              </p>
              <Button
                onClick={handleGenerate}
                variant="outline"
                className="transition-transform duration-200 animate-in slide-in-from-bottom-2 duration-400 delay-300 bg-transparent"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {results && (
          <div className="animate-in fade-in duration-700">
            {/* Dashboard Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">Your Brand Guidelines</h1>
                  <p className="text-muted-foreground">Complete brand identity and strategic framework</p>
                </div>
                <Button onClick={exportBrandbook} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Download className="mr-2 h-4 w-4" />
                  Export Brandbook
                </Button>
              </div>
            </div>

            {/* Dashboard Layout */}
            <div className="flex gap-6">
              {/* Sidebar Navigation */}
              <div className="w-64 flex-shrink-0">
                <Card className="sticky top-6">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Sections</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      { id: "brand-overview", label: "Brand Overview", icon: Lightbulb },
                      { id: "visual-identity", label: "Visual Identity", icon: Palette },
                      { id: "voice-messaging", label: "Voice & Messaging", icon: MessageSquare },
                      { id: "content-strategy", label: "Content Strategy", icon: TrendingUp },
                      { id: "campaign-planning", label: "Campaign Planning", icon: BarChart3 },
                    ].map((section) => (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors duration-200 flex items-center space-x-2 ${
                          activeSection === section.id
                            ? "bg-blue-100 text-blue-900 font-medium"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        <section.icon className="h-4 w-4" />
                        <span className="text-sm">{section.label}</span>
                      </button>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                {/* Brand Overview Section */}
                {activeSection === "brand-overview" && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Lightbulb className="mr-2 h-5 w-5 text-blue-600" />
                          Brand Overview
                        </CardTitle>
                        <CardDescription>Core brand foundation and mission</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {(() => {
                          let brandData
                          try {
                            // First try to parse the main response
                            const parsedResults = typeof results === "string" ? JSON.parse(results) : results

                            // Handle array response format
                            if (Array.isArray(parsedResults) && parsedResults.length > 0) {
                              const firstResult = parsedResults[0]

                              // Look for brand guidelines in various possible keys
                              brandData =
                                firstResult["brand guidelines generator"] ||
                                firstResult["messaging framer worker"] ||
                                firstResult

                              // If brandData is a string, try to parse it as JSON
                              if (typeof brandData === "string") {
                                brandData = JSON.parse(brandData)
                              }
                            } else {
                              brandData =
                                parsedResults["brand guidelines generator"] ||
                                parsedResults["messaging framer worker"] ||
                                parsedResults
                            }
                          } catch (error) {
                            console.log("[v0] Error parsing brand data:", error)
                            brandData = null
                          }

                          return brandData ? (
                            <div className="space-y-6">
                              {/* Hero Section */}
                              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                                <div className="text-center mb-6">
                                  <h2 className="text-2xl font-bold text-blue-900 mb-2">
                                    {brandData.brand_name || brandData.name || "Your Brand"}
                                  </h2>
                                  {(brandData.tagline || brandData.taglines?.[0]) && (
                                    <p className="text-blue-700 italic text-lg">
                                      "{brandData.tagline || brandData.taglines?.[0]}"
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Mission, Vision, Values Grid */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {brandData.mission && (
                                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-l-blue-500">
                                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                                      <Target className="mr-2 h-4 w-4" />
                                      Mission
                                    </h4>
                                    <p className="text-blue-800 text-sm">{brandData.mission}</p>
                                  </div>
                                )}

                                {brandData.vision && (
                                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-l-green-500">
                                    <h4 className="font-semibold text-green-900 mb-2 flex items-center">
                                      <Eye className="mr-2 h-4 w-4" />
                                      Vision
                                    </h4>
                                    <p className="text-green-800 text-sm">{brandData.vision}</p>
                                  </div>
                                )}

                                {brandData.values && (
                                  <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-l-purple-500">
                                    <h4 className="font-semibold text-purple-900 mb-2 flex items-center">
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Values
                                    </h4>
                                    {Array.isArray(brandData.values) ? (
                                      <ul className="space-y-1">
                                        {brandData.values.slice(0, 3).map((value: string, index: number) => (
                                          <li key={index} className="text-purple-800 text-sm">
                                            • {value}
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <p className="text-purple-800 text-sm">{brandData.values}</p>
                                    )}
                                  </div>
                                )}
                              </div>

                              {/* Brand Positioning & Personality */}
                              {(brandData.positioning || brandData.personality || brandData.voice_and_tone) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {(brandData.positioning || brandData.voice_and_tone) && (
                                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                                      <h4 className="font-semibold text-orange-900 mb-2">
                                        {brandData.positioning ? "Brand Positioning" : "Voice & Tone"}
                                      </h4>
                                      <p className="text-orange-800 text-sm">
                                        {brandData.positioning || brandData.voice_and_tone}
                                      </p>
                                    </div>
                                  )}

                                  {brandData.personality && (
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                      <h4 className="font-semibold text-gray-900 mb-2">Brand Personality</h4>
                                      {Array.isArray(brandData.personality) ? (
                                        <div className="flex flex-wrap gap-2">
                                          {brandData.personality.map((trait: string, index: number) => (
                                            <Badge
                                              key={index}
                                              variant="secondary"
                                              className="bg-gray-200 text-gray-800 text-xs"
                                            >
                                              {trait}
                                            </Badge>
                                          ))}
                                        </div>
                                      ) : (
                                        <p className="text-gray-800 text-sm">{brandData.personality}</p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Additional brand overview information */}
                              {brandData.overview && (
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                  <h4 className="font-semibold text-slate-900 mb-2">Brand Overview</h4>
                                  <p className="text-slate-800 text-sm">{brandData.overview}</p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                              <p className="text-yellow-800 text-sm">
                                Unable to parse brand overview data. Please try generating the brandbook again.
                              </p>
                            </div>
                          )
                        })()}
                      </CardContent>
                    </Card>

                    {/* Target Audience Card */}
                    {(() => {
                      const contentStrategy = parseContentStrategy(results["content strategy"])
                      return (
                        contentStrategy && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center">
                                <Target className="mr-2 h-5 w-5 text-green-600" />
                                Target Audience & Personas
                              </CardTitle>
                              <CardDescription>Who your brand serves and their characteristics</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {contentStrategy.content_strategy.content_pillars.map((pillar, index) => (
                                  <div
                                    key={index}
                                    className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200"
                                  >
                                    <div className="flex items-center mb-2">
                                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2">
                                        {index + 1}
                                      </div>
                                      <h5 className="font-semibold text-blue-900 text-sm">{pillar.name}</h5>
                                    </div>
                                    <p className="text-blue-800 text-sm leading-relaxed">{pillar.description}</p>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )
                      )
                    })()}
                  </div>
                )}

                {/* Visual Identity Section */}
                {activeSection === "visual-identity" && (
                  <div className="space-y-6">
                    {(() => {
                      const visualIdentity = parseVisualIdentity(results["visual identity advisor"])
                      return visualIdentity ? (
                        <>
                          {/* Color Palette */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center">
                                <Palette className="mr-2 h-5 w-5 text-purple-600" />
                                Color Palette
                              </CardTitle>
                              <CardDescription>Your brand's color system with hex codes and rationale</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {Object.entries(visualIdentity.colors).map(([colorType, colorData]) => (
                                  <div key={colorType} className="text-center">
                                    <div
                                      className="w-full h-24 rounded-lg mb-3 border-2 border-gray-200 shadow-sm"
                                      style={{ backgroundColor: colorData.hex }}
                                    />
                                    <h4 className="font-semibold text-gray-900 capitalize mb-1">{colorType}</h4>
                                    <div className="flex items-center justify-center space-x-2 mb-2">
                                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                                        {colorData.hex}
                                      </code>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => copyToClipboard(colorData.hex)}
                                        className="h-6 w-6 p-0"
                                      >
                                        <Copy className="h-3 w-3" />
                                      </Button>
                                    </div>
                                    <p className="text-xs text-gray-600">{colorData.rationale}</p>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>

                          {/* Typography */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center">
                                <Type className="mr-2 h-5 w-5 text-blue-600" />
                                Typography
                              </CardTitle>
                              <CardDescription>Font pairings and usage guidelines</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                  <h4 className="font-semibold text-gray-900 mb-2">Headings</h4>
                                  <div className="mb-3">
                                    <p
                                      className="text-2xl font-bold"
                                      style={{ fontFamily: visualIdentity.fonts.headings.name }}
                                    >
                                      {visualIdentity.fonts.headings.name}
                                    </p>
                                    <p className="text-sm text-gray-600">Sample heading text</p>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <code className="bg-white px-2 py-1 rounded text-sm">
                                      {visualIdentity.fonts.headings.name}
                                    </code>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => copyToClipboard(visualIdentity.fonts.headings.name)}
                                      className="h-6 w-6 p-0"
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                  <h4 className="font-semibold text-gray-900 mb-2">Body Text</h4>
                                  <div className="mb-3">
                                    <p className="text-base" style={{ fontFamily: visualIdentity.fonts.body.name }}>
                                      {visualIdentity.fonts.body.name}
                                    </p>
                                    <p
                                      className="text-sm text-gray-600"
                                      style={{ fontFamily: visualIdentity.fonts.body.name }}
                                    >
                                      Sample body text for readability
                                    </p>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <code className="bg-white px-2 py-1 rounded text-sm">
                                      {visualIdentity.fonts.body.name}
                                    </code>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => copyToClipboard(visualIdentity.fonts.body.name)}
                                      className="h-6 w-6 p-0"
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Logo Usage */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center">
                                <Zap className="mr-2 h-5 w-5 text-orange-600" />
                                Logo Usage Guidelines
                              </CardTitle>
                              <CardDescription>Best practices for logo implementation</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <h4 className="font-semibold text-gray-900 mb-3">Do's</h4>
                                    <ul className="space-y-2">
                                      <li className="flex items-start space-x-2">
                                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-gray-700">
                                          Use on clean, uncluttered backgrounds
                                        </span>
                                      </li>
                                      <li className="flex items-start space-x-2">
                                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-gray-700">Maintain minimum clear space</span>
                                      </li>
                                      <li className="flex items-start space-x-2">
                                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-gray-700">Use approved color variations</span>
                                      </li>
                                    </ul>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-gray-900 mb-3">Don'ts</h4>
                                    <ul className="space-y-2">
                                      <li className="flex items-start space-x-2">
                                        <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-gray-700">Stretch or distort proportions</span>
                                      </li>
                                      <li className="flex items-start space-x-2">
                                        <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-gray-700">Use on busy backgrounds</span>
                                      </li>
                                      <li className="flex items-start space-x-2">
                                        <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-gray-700">Apply unauthorized effects</span>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Imagery Style */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center">
                                <ImageIcon className="mr-2 h-5 w-5 text-green-600" />
                                Imagery Style
                              </CardTitle>
                              <CardDescription>Visual style and mood board direction</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                  <h4 className="font-semibold text-green-900 mb-2">Mood Board Description</h4>
                                  <p className="text-green-800 text-sm leading-relaxed">
                                    {visualIdentity.moodBoardPrompt}
                                  </p>
                                </div>

                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-3">Style Motifs</h4>
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {visualIdentity.styleMotifs.map((motif, index) => (
                                      <div
                                        key={index}
                                        className="bg-white border border-gray-200 rounded-lg p-3 text-center"
                                      >
                                        <Badge variant="outline" className="text-xs">
                                          {motif}
                                        </Badge>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </>
                      ) : (
                        <Card>
                          <CardHeader>
                            <CardTitle>Visual Identity</CardTitle>
                            <CardDescription>Raw visual identity data</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg overflow-auto max-h-64">
                              {results["visual identity advisor"]}
                            </pre>
                          </CardContent>
                        </Card>
                      )
                    })()}
                  </div>
                )}

                {/* Voice & Messaging Section */}
                {activeSection === "voice-messaging" && (
                  <div className="space-y-6">
                    {/* Brand Voice */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <MessageSquare className="mr-2 h-5 w-5 text-green-600" />
                          Brand Voice & Tone Guidelines
                        </CardTitle>
                        <CardDescription>How your brand communicates and sounds</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                          <div className="flex items-start space-x-4">
                            <div className="bg-green-600 p-3 rounded-full">
                              <MessageSquare className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-green-900 mb-3 text-lg">Your Brand Voice</h4>
                              <div className="prose prose-green max-w-none">
                                <p className="text-green-800 leading-relaxed text-base">
                                  {results["messaging framer worker"].voice_and_tone}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Messaging Pillars */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Lightbulb className="mr-2 h-5 w-5 text-blue-600" />
                          Messaging Pillars
                        </CardTitle>
                        <CardDescription>Core messages that define your brand communication</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 gap-4">
                          {results["messaging framer worker"].messaging_pillars.map((pillar, index) => (
                            <div
                              key={index}
                              className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all duration-200"
                            >
                              <div className="flex items-start space-x-4">
                                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                                  {index + 1}
                                </div>
                                <div className="flex-1">
                                  <p className="text-gray-800 leading-relaxed">{pillar}</p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => copyToClipboard(pillar)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Sample Taglines */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Zap className="mr-2 h-5 w-5 text-purple-600" />
                          Sample Taglines
                        </CardTitle>
                        <CardDescription>Memorable taglines for your brand</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {results["messaging framer worker"].taglines.map((tagline, index) => (
                            <div
                              key={index}
                              className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 text-center hover:shadow-md transition-all duration-200"
                            >
                              <p className="text-purple-900 font-medium text-lg mb-2">"{tagline}"</p>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(tagline)}
                                className="h-6 w-6 p-0"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Content Strategy Section */}
                {activeSection === "content-strategy" && (
                  <div className="space-y-6">
                    {(() => {
                      const contentStrategy = parseContentStrategy(results["content strategy"])
                      return contentStrategy ? (
                        <>
                          {/* Content Pillars */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center">
                                <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
                                Content Pillars
                              </CardTitle>
                              <CardDescription>Foundation themes for your content strategy</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {contentStrategy.content_strategy.content_pillars.map((pillar, index) => (
                                  <div
                                    key={index}
                                    className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-200"
                                  >
                                    <div className="flex items-center mb-3">
                                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                        {index + 1}
                                      </div>
                                      <h5 className="font-semibold text-blue-900">{pillar.name}</h5>
                                    </div>
                                    <p className="text-blue-800 leading-relaxed text-sm">{pillar.description}</p>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>

                          {/* Monthly Themes */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center">
                                <Calendar className="mr-2 h-5 w-5 text-green-600" />
                                Monthly Themes
                              </CardTitle>
                              <CardDescription>Year-round content calendar themes</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {contentStrategy.content_strategy.monthly_themes.map((theme, index) => (
                                  <div key={index} className="bg-green-50 p-4 rounded-lg border border-green-200">
                                    <h5 className="font-semibold text-green-900 mb-1">{theme.month}</h5>
                                    <p className="text-green-800 font-medium text-sm mb-2">{theme.theme}</p>
                                    <p className="text-green-700 text-xs">{theme.focus}</p>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>

                          {/* Campaign Ideas */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center">
                                <Lightbulb className="mr-2 h-5 w-5 text-orange-600" />
                                Campaign Ideas
                              </CardTitle>
                              <CardDescription>Strategic campaign concepts for your brand</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                {contentStrategy.content_strategy.campaign_ideas.map((campaign, index) => (
                                  <div key={index} className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                                    <h5 className="font-semibold text-orange-900 mb-2">{campaign.name}</h5>
                                    <p className="text-orange-800 text-sm">{campaign.description}</p>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>

                          {/* Content Topics */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center">
                                <MessageSquare className="mr-2 h-5 w-5 text-purple-600" />
                                Content Topics
                              </CardTitle>
                              <CardDescription>Specific content ideas for blog and social media</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Blog Topics */}
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-3">Blog Posts</h4>
                                  <div className="space-y-3">
                                    {contentStrategy.content_strategy.content_topics.blog
                                      .slice(0, 5)
                                      .map((blog, index) => (
                                        <div
                                          key={index}
                                          className="bg-purple-50 p-3 rounded-lg border border-purple-200"
                                        >
                                          <h6 className="font-medium text-purple-900 text-sm mb-1">{blog.title}</h6>
                                          <p className="text-purple-700 text-xs mb-1">Pillar: {blog.pillar}</p>
                                          <p className="text-purple-800 text-xs">{blog.summary}</p>
                                        </div>
                                      ))}
                                  </div>
                                </div>

                                {/* Social Media Topics */}
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-3">Social Media</h4>
                                  <div className="space-y-3">
                                    {contentStrategy.content_strategy.content_topics.social_media
                                      .slice(0, 5)
                                      .map((social, index) => (
                                        <div key={index} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                          <h6 className="font-medium text-blue-900 text-sm mb-1">
                                            {social.content_title}
                                          </h6>
                                          <p className="text-blue-700 text-xs mb-1">
                                            {social.platforms} • {social.format}
                                          </p>
                                          <p className="text-blue-800 text-xs">{social.description}</p>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </>
                      ) : (
                        <Card>
                          <CardHeader>
                            <CardTitle>Content Strategy</CardTitle>
                            <CardDescription>Raw content strategy data</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg overflow-auto max-h-64">
                              {results["content strategy"]}
                            </pre>
                          </CardContent>
                        </Card>
                      )
                    })()}
                  </div>
                )}

                {/* Campaign Planning Section */}
                {activeSection === "campaign-planning" && (
                  <div className="space-y-6">
                    {(() => {
                      const campaignPlan = parseCampaignPlan(results["campaign planner"])
                      return campaignPlan ? (
                        <>
                          {/* Campaign Objectives */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center">
                                <Target className="mr-2 h-5 w-5 text-blue-600" />
                                Campaign Objectives
                              </CardTitle>
                              <CardDescription>Strategic goals for your marketing campaigns</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {campaignPlan.campaign_plan.objectives.map((objective, index) => (
                                  <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <div className="flex items-start space-x-3">
                                      <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                        {index + 1}
                                      </div>
                                      <p className="text-blue-800 text-sm">{objective}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>

                          {/* Campaign Timeline */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center">
                                <Calendar className="mr-2 h-5 w-5 text-green-600" />
                                Campaign Timeline
                              </CardTitle>
                              <CardDescription>Week-by-week campaign milestones</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                {campaignPlan.campaign_plan.timeline.map((week, index) => (
                                  <div key={index} className="bg-green-50 p-4 rounded-lg border border-green-200">
                                    <h5 className="font-semibold text-green-900 mb-2">{week.week}</h5>
                                    <ul className="space-y-1">
                                      {week.milestones.map((milestone, mIndex) => (
                                        <li key={mIndex} className="flex items-start space-x-2">
                                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                          <span className="text-green-800 text-sm">{milestone}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>

                          {/* Channel Strategy */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center">
                                <BarChart3 className="mr-2 h-5 w-5 text-purple-600" />
                                Channel Strategy
                              </CardTitle>
                              <CardDescription>Marketing channels and tactics</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {campaignPlan.campaign_plan.channels.map((channel, index) => (
                                  <div key={index} className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                                    <h5 className="font-semibold text-purple-900 mb-2">{channel.name}</h5>
                                    <ul className="space-y-1">
                                      {channel.tactics.map((tactic, tIndex) => (
                                        <li key={tIndex} className="flex items-start space-x-2">
                                          <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                                          <span className="text-purple-800 text-sm">{tactic}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>

                          {/* KPIs */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center">
                                <TrendingUp className="mr-2 h-5 w-5 text-orange-600" />
                                Key Performance Indicators
                              </CardTitle>
                              <CardDescription>Metrics to track campaign success</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {campaignPlan.campaign_plan.kpis.map((kpi, index) => (
                                  <div
                                    key={index}
                                    className="bg-orange-50 p-4 rounded-lg border border-orange-200 text-center"
                                  >
                                    <BarChart3 className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                                    <p className="text-orange-800 text-sm font-medium">{kpi}</p>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>

                          {/* Summary & Export */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center">
                                <Download className="mr-2 h-5 w-5 text-gray-600" />
                                Summary & Export
                              </CardTitle>
                              <CardDescription>Complete brand guidelines summary and download options</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg">
                                <div className="text-center mb-6">
                                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Your Brand Identity is Complete!
                                  </h3>
                                  <p className="text-gray-600">
                                    You now have a comprehensive brand guidelines document including visual identity,
                                    messaging framework, content strategy, and campaign planning.
                                  </p>
                                </div>

                                <div className="flex justify-center space-x-4">
                                  <Button
                                    onClick={exportBrandbook}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                  >
                                    <Download className="mr-2 h-4 w-4" />
                                    Download Complete Brandbook
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() => copyToClipboard(JSON.stringify(results, null, 2))}
                                  >
                                    <Copy className="mr-2 h-4 w-4" />
                                    Copy Raw Data
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </>
                      ) : (
                        <Card>
                          <CardHeader>
                            <CardTitle>Campaign Planning</CardTitle>
                            <CardDescription>Raw campaign planning data</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg overflow-auto max-h-64">
                              {results["campaign planner"]}
                            </pre>
                          </CardContent>
                        </Card>
                      )
                    })()}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
