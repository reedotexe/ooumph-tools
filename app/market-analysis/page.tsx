"use client"

import { Skeleton } from "@/components/ui/skeleton"
import SharedNavbar from "@/components/shared-navbar"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useOnboardingCheck } from "@/hooks/use-onboarding-check"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  TrendingUp,
  Users,
  Target,
  Download,
  Lightbulb,
  BarChart3,
  Zap,
  ArrowRight,
  Star,
  Eye,
  Heart,
  AlertTriangle,
  Building2,
  MapPin,
  GraduationCap,
  DollarSign,
} from "lucide-react"

interface MarketAnalysisResult {
  Overview: {
    industry: string
    product_category: string
    target_audience: string
    geographic_focus: string
  }
  trends: {
    summary_of_key_trends: Array<{
      title: string
      category: string
      insight: string
    }>
    opportunities_identified: Array<{
      opportunity_area: string
      description: string
      related_trends: string[]
    }>
    strategic_recommendations: Array<{
      action: string
      justification: string
      urgency: string
    }>
  }
  "best idea": {
    best_summary_of_key_trends: Array<{
      title: string
      category: string
      insight: string
    }>
  }
  "Persona for best idea": {
    personas: Array<{
      persona_id: string
      name: string
      demographics: {
        age_range: string
        income_range: string
        education: string
        location: string
        family_status: string
      }
      behaviors: string[]
      needs: string[]
    }>
  }
  "Brand Positioning for best idea": {
    uvp: string
    positioning_statement: string
    brand_promise: string
  }
}

export default function MarketAnalysisApp() {
  // Check onboarding status
  useOnboardingCheck()
  const { user } = useAuth()

  const [businessIdea, setBusinessIdea] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<MarketAnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [ideaError, setIdeaError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)

  // Pre-fill form with user profile data
  useEffect(() => {
    if (user?.profile) {
      const profileInfo = [
        user.profile.businessDescription,
        user.profile.valueProposition && `Value Proposition: ${user.profile.valueProposition}`,
        user.profile.industry && `Industry: ${user.profile.industry}`,
        user.profile.targetAudience && `Target Audience: ${user.profile.targetAudience}`,
      ].filter(Boolean).join('\n\n')
      
      setBusinessIdea(profileInfo)
    }
  }, [user])

  useEffect(() => {
    setMounted(true)

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest(".tools-dropdown")) {
        setIsToolsDropdownOpen(false)
      }
      if (!target.closest(".user-dropdown")) {
        setIsUserDropdownOpen(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  const handleNavigation = (path: string) => {
    try {
      window.location.href = path
    } catch (error) {
      console.error("[v0] Navigation error:", error)
    }
  }

  const handleAnalysis = async () => {
    if (!businessIdea.trim()) {
      setIdeaError("Please enter your business idea")
      return
    }

    if (businessIdea.trim().length < 10) {
      setIdeaError("Please provide more details about your business idea (at least 10 characters)")
      return
    }

    setIdeaError(null)
    setIsLoading(true)
    setError(null)
    setResults(null)

    const maxRetries = 3
    let attempt = 0

    while (attempt < maxRetries) {
      attempt++

      let timeoutReached = false

      try {
        const webhookUrl = process.env.NEXT_PUBLIC_MARKET_ANALYSIS_WEBHOOK_URL || "https://n8n.ooumph.com/webhook/marketanalyzer"

        console.log(`[v0] Sending analysis request to webhook (attempt ${attempt}/${maxRetries}):`, webhookUrl)

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
            businessIdea: businessIdea.trim(),
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
          throw new Error(`Analysis failed: ${response.status} ${response.statusText}`)
        }

        const responseText = await response.text()
        console.log("[v0] Raw response text:", responseText.substring(0, 200) + "...")

        if (!responseText || responseText.trim() === "") {
          throw new Error("Empty response from analysis service")
        }

        let responseData
        try {
          responseData = JSON.parse(responseText)
        } catch (parseError) {
          console.error("[v0] JSON parse error:", parseError)
          throw new Error("Invalid response format from analysis service")
        }

        console.log("[v0] Webhook response data:", JSON.stringify(responseData, null, 2))

        let analysisData: MarketAnalysisResult | null = null

        if (Array.isArray(responseData) && responseData.length > 0) {
          if (responseData[0]?.output) {
            analysisData = responseData[0].output
          } else {
            analysisData = responseData[0]
          }
          console.log("[v0] Response is array, using first element:", analysisData)
        } else if (responseData?.output) {
          analysisData = responseData.output
          console.log("[v0] Using responseData.output")
        } else if (responseData?.Overview) {
          analysisData = responseData
          console.log("[v0] Using responseData directly")
        } else {
          console.log("[v0] Unexpected response format:", responseData)
          throw new Error("Invalid response format from analysis service")
        }

        console.log("[v0] Processed analysis data:", JSON.stringify(analysisData, null, 2))

        if (!analysisData) {
          throw new Error("No analysis data received from the server")
        }

        const missingFields = []
        if (!analysisData.Overview) missingFields.push("Overview")
        if (!analysisData.trends) missingFields.push("trends")
        if (!analysisData["Persona for best idea"]) missingFields.push("Persona for best idea")
        if (!analysisData["Brand Positioning for best idea"]) missingFields.push("Brand Positioning for best idea")

        if (missingFields.length > 0) {
          console.log("[v0] Missing required fields:", missingFields)
          console.log("[v0] Available fields:", Object.keys(analysisData))
          throw new Error(`Analysis incomplete. Missing: ${missingFields.join(", ")}`)
        }

        if (!analysisData.Overview.industry || !analysisData.trends.summary_of_key_trends) {
          throw new Error("Analysis data is incomplete or corrupted")
        }

        setResults(analysisData)
        console.log("[v0] Successfully set analysis results")
        setIsLoading(false) // Set loading to false after successful completion
        return // Success, exit retry loop
      } catch (err) {
        console.error(`[v0] Analysis error (attempt ${attempt}/${maxRetries}):`, err)

        if (err instanceof Error) {
          if (err.name === "AbortError") {
            if (timeoutReached) {
              setError(
                "Analysis is taking longer than expected. The n8n workflow may need more time to complete. Please try again or contact support if the issue persists.",
              )
            } else {
              setError("Analysis was cancelled. Please try again.")
            }
            break // Don't retry on abort
          } else if (err.message.includes("Failed to fetch")) {
            if (attempt < maxRetries) {
              console.log(`[v0] Network error, retrying in 2 seconds... (attempt ${attempt + 1}/${maxRetries})`)
              await new Promise((resolve) => setTimeout(resolve, 2000))
              continue // Retry on network error
            } else {
              setError(
                "Unable to connect to the analysis service. Please check your internet connection and try again.",
              )
            }
          } else if (err.message.includes("CORS")) {
            setError("Cross-origin request blocked. Please contact support.")
            break
          } else {
            if (attempt < maxRetries) {
              console.log(`[v0] Error occurred, retrying... (attempt ${attempt + 1}/${maxRetries})`)
              await new Promise((resolve) => setTimeout(resolve, 2000))
              continue
            } else {
              setError(err.message)
            }
          }
        } else {
          if (attempt < maxRetries) {
            console.log(`[v0] Unknown error, retrying... (attempt ${attempt + 1}/${maxRetries})`)
            await new Promise((resolve) => setTimeout(resolve, 2000))
            continue
          } else {
            setError("An unexpected error occurred. Please try again.")
          }
        }

        break // Exit retry loop on non-retryable errors
      }
    }

    setResults(null)
    setIsLoading(false)
  }

  const handleIdeaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBusinessIdea(e.target.value)
    if (ideaError) setIdeaError(null)
  }

  const exportReport = () => {
    if (!results) return

    try {
      const reportContent = `
MARKET ANALYSIS REPORT
=====================

Business Idea Analysis
Generated on: ${new Date().toLocaleDateString()}

OVERVIEW
========
Industry: ${results.Overview.industry}
Product Category: ${results.Overview.product_category}
Target Audience: ${results.Overview.target_audience}
Geographic Focus: ${results.Overview.geographic_focus}

MARKET TRENDS & INSIGHTS
========================
${results.trends.summary_of_key_trends
  .map(
    (trend) => `
Category: ${trend.category}
Title: ${trend.title}
Insight: ${trend.insight}
`,
  )
  .join("\n")}

OPPORTUNITIES IDENTIFIED
=======================
${results.trends.opportunities_identified
  .map(
    (opportunity) => `
Area: ${opportunity.opportunity_area}
Description: ${opportunity.description}
Related Trends: ${opportunity.related_trends.join(", ")}
`,
  )
  .join("\n")}

STRATEGIC RECOMMENDATIONS
========================
${results.trends.strategic_recommendations
  .map(
    (rec) => `
Action: ${rec.action}
Justification: ${rec.justification}
Urgency: ${rec.urgency}
`,
  )
  .join("\n")}

CUSTOMER PERSONAS
=================
${results["Persona for best idea"].personas
  .map(
    (persona) => `
Name: ${persona.name}
Demographics: ${persona.demographics.age_range}, ${persona.demographics.location}
Income: ${persona.demographics.income_range}
Education: ${persona.demographics.education}
Family Status: ${persona.demographics.family_status}

Behaviors:
${persona.behaviors.map((behavior) => `• ${behavior}`).join("\n")}

Needs:
${persona.needs.map((need) => `• ${need}`).join("\n")}
`,
  )
  .join("\n")}

BRAND POSITIONING STRATEGY
==========================
Unique Value Proposition: ${results["Brand Positioning for best idea"].uvp}

Positioning Statement: ${results["Brand Positioning for best idea"].positioning_statement}

Brand Promise: ${results["Brand Positioning for best idea"].brand_promise}

Generated by Market Analysis Pro - ${new Date().toLocaleDateString()}
      `.trim()

      const blob = new Blob([reportContent], { type: "text/plain" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `market-analysis-report-${new Date().toISOString().split("T")[0]}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error("[v0] Export error:", err)
      setError("Failed to export report. Please try again.")
    }
  }

  const getCategoryColor = (category: string) => {
    const categoryLower = category.toLowerCase()
    if (categoryLower.includes("target") || categoryLower.includes("audience")) {
      return "bg-blue-100 text-blue-800 border-blue-200"
    }
    if (categoryLower.includes("policy") || categoryLower.includes("regulation")) {
      return "bg-purple-100 text-purple-800 border-purple-200"
    }
    if (categoryLower.includes("technology") || categoryLower.includes("tech")) {
      return "bg-blue-100 text-blue-800 border-blue-200"
    }
    if (categoryLower.includes("market") || categoryLower.includes("trend")) {
      return "bg-blue-100 text-blue-800 border-blue-200"
    }
    return "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getUrgencyColor = (urgency: string) => {
    const urgencyLower = urgency.toLowerCase()
    if (urgencyLower === "high") {
      return "bg-red-100 text-red-800 border-red-200"
    }
    if (urgencyLower === "medium") {
      return "bg-blue-100 text-blue-800 border-blue-200"
    }
    return "bg-blue-100 text-blue-800 border-blue-200"
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
      {/* Shared Navbar */}
      <SharedNavbar currentPage="Market Analysis" />

      <div className="container mx-auto px-4 pb-12 max-w-6xl pt-[33px]">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-in fade-in duration-1000 delay-300">
          <h2 className="text-4xl font-bold text-foreground mb-4 animate-in slide-in-from-bottom-4 duration-800 delay-400">
            Market Analysis Tool
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-800 delay-500">
            Transform your business idea into comprehensive market intelligence with AI-powered analysis
          </p>
        </div>

        {/* Input Section */}
        <Card className="max-w-2xl mx-auto mb-12 backdrop-blur-sm bg-card/50 border-border shadow-lg hover:shadow-xl transition-all duration-300 animate-in zoom-in-95 duration-600 delay-600">
          <CardContent className="p-6 tracking-normal">
            <div className="flex flex-col gap-4">
              <div className="flex-1">
                <Textarea
                  placeholder="Describe your business idea in detail..."
                  value={businessIdea}
                  onChange={handleIdeaChange}
                  className="min-h-[120px] bg-gray-200 border-gray-300 text-gray-900 placeholder:text-gray-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none"
                  disabled={isLoading}
                />
                {ideaError && (
                  <p className="text-sm mt-2 animate-in slide-in-from-left-2 duration-300 text-red-500">{ideaError}</p>
                )}
              </div>
              <Button
                onClick={handleAnalysis}
                disabled={!businessIdea.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white border-0 px-8 transition-all duration-200 disabled:hover:scale-100 shadow-sm"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    <span className="animate-pulse">Analyzing...</span>
                  </>
                ) : (
                  <>
                    <BarChart3 className="mr-2 h-4 w-4 transition-transform duration-200" />
                    Analyze Market
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card
                  key={i}
                  className="animate-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <CardHeader>
                    <Skeleton className="h-4 w-3/4 animate-pulse" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-full mb-2 animate-pulse" />
                    <Skeleton className="h-4 w-1/2 animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !results && (
          <Card className="max-w-2xl mx-auto border-destructive animate-in zoom-in-95 duration-500 shake">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4 animate-in zoom-in-50 duration-300" />
              <h3 className="text-lg font-semibold text-destructive mb-2 animate-in slide-in-from-bottom-2 duration-400 delay-100">
                Analysis Failed
              </h3>
              <p className="text-muted-foreground mb-4 animate-in slide-in-from-bottom-2 duration-400 delay-200">
                {error}
              </p>
              <Button
                onClick={handleAnalysis}
                variant="outline"
                size="sm"
                className="transition-transform duration-200 animate-in slide-in-from-bottom-2 duration-400 delay-300 bg-transparent"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {results && (
          <div className="space-y-8 animate-in fade-in duration-700">
            <Card className="backdrop-blur-sm bg-card/50 hover:bg-card/70 transition-all duration-300 animate-in slide-in-from-bottom-4 duration-600">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Building2 className="mr-2 h-5 w-5 text-blue-600" />
                    Business Overview
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportReport}
                    className="transition-all duration-200 hover:bg-blue-50 hover:text-blue-900 hover:border-blue-300 bg-transparent"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export Report
                  </Button>
                </CardTitle>
                <CardDescription>Key details about your business concept and market focus</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Industry
                      </Badge>
                      <span className="font-medium">{results.Overview.industry}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Category
                      </Badge>
                      <span className="font-medium">{results.Overview.product_category}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        Audience
                      </Badge>
                      <span className="font-medium">{results.Overview.target_audience}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                        Geography
                      </Badge>
                      <span className="font-medium">{results.Overview.geographic_focus}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-card/50 hover:bg-card/70 transition-all duration-300 animate-in slide-in-from-bottom-4 duration-600">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-accent animate-pulse" />
                  Market Trends & Insights
                </CardTitle>
                <CardDescription>Key market opportunities and trends for your business idea</CardDescription>
              </CardHeader>
              <CardContent>
                {results.trends?.summary_of_key_trends && results.trends.summary_of_key_trends.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.trends.summary_of_key_trends.map((trend, index) => (
                      <Card
                        key={index}
                        className="border-l-4 border-l-accent hover:shadow-md transition-all duration-300 animate-in zoom-in-95 duration-500"
                        style={{ animationDelay: `${300 + index * 150}ms` }}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className={getCategoryColor(trend.category || "General")}>
                              {trend.category || "General"}
                            </Badge>
                            <Lightbulb className="h-4 w-4 text-accent" />
                          </div>
                          <CardTitle className="text-base">{trend.title || "Market Insight"}</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm text-muted-foreground">{trend.insight || "No insight available"}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No market insights available</p>
                )}
              </CardContent>
            </Card>

            {results.trends?.opportunities_identified && results.trends.opportunities_identified.length > 0 && (
              <Card className="backdrop-blur-sm bg-card/50 hover:bg-card/70 transition-all duration-300 animate-in slide-in-from-bottom-4 duration-600 delay-100">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="mr-2 h-5 w-5 text-blue-500" />
                    Market Opportunities
                  </CardTitle>
                  <CardDescription>Identified opportunities for your business concept</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {results.trends.opportunities_identified.map((opportunity, index) => (
                      <Card
                        key={index}
                        className="border-l-4 border-l-blue-500 hover:shadow-md transition-all duration-300 animate-in zoom-in-95 duration-500"
                        style={{ animationDelay: `${400 + index * 150}ms` }}
                      >
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base text-blue-700">{opportunity.opportunity_area}</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-3">
                          <p className="text-sm text-muted-foreground">{opportunity.description}</p>
                          {opportunity.related_trends && opportunity.related_trends.length > 0 && (
                            <div>
                              <p className="text-xs font-medium text-muted-foreground mb-2">Related Trends:</p>
                              <div className="flex flex-wrap gap-1">
                                {opportunity.related_trends.map((trend, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {trend}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {results.trends?.strategic_recommendations && results.trends.strategic_recommendations.length > 0 && (
              <Card className="backdrop-blur-sm bg-card/50 hover:bg-card/70 transition-all duration-300 animate-in slide-in-from-bottom-4 duration-600 delay-200">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="mr-2 h-5 w-5 text-blue-600" />
                    Strategic Recommendations
                  </CardTitle>
                  <CardDescription>Actionable recommendations for your business strategy</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {results.trends.strategic_recommendations.map((recommendation, index) => (
                      <Card
                        key={index}
                        className="border-l-4 border-l-blue-500 hover:shadow-md transition-all duration-300 animate-in zoom-in-95 duration-500"
                        style={{ animationDelay: `${500 + index * 150}ms` }}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base text-blue-700">{recommendation.action}</CardTitle>
                            <Badge variant="outline" className={getUrgencyColor(recommendation.urgency)}>
                              {recommendation.urgency} Priority
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm text-muted-foreground">{recommendation.justification}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="backdrop-blur-sm bg-card/50 hover:bg-card/70 transition-all duration-300 animate-in slide-in-from-bottom-4 duration-600 delay-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-accent" />
                  Customer Personas
                </CardTitle>
                <CardDescription>Detailed profiles of your target customers</CardDescription>
              </CardHeader>
              <CardContent>
                {results["Persona for best idea"]?.personas && results["Persona for best idea"].personas.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {results["Persona for best idea"].personas.map((persona, index) => (
                      <Card
                        key={index}
                        className="hover:shadow-md transition-all duration-300 animate-in zoom-in-95 duration-500"
                        style={{ animationDelay: `${500 + index * 200}ms` }}
                      >
                        <CardHeader>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-accent/10 text-accent font-semibold">
                                {(persona.name || "User")
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{persona.name || "Customer"}</CardTitle>
                              <p className="text-sm text-muted-foreground">{persona.demographics.age_range || "N/A"}</p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 gap-3 text-sm">
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-blue-500" />
                              <span className="text-muted-foreground">Location:</span>
                              <p className="font-medium">{persona.demographics.location || "N/A"}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4 text-green-500" />
                              <span className="text-muted-foreground">Income:</span>
                              <p className="font-medium">{persona.demographics.income_range || "N/A"}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <GraduationCap className="h-4 w-4 text-purple-500" />
                              <span className="text-muted-foreground">Education:</span>
                              <p className="font-medium">{persona.demographics.education || "N/A"}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Heart className="h-4 w-4 text-red-500" />
                              <span className="text-muted-foreground">Family:</span>
                              <p className="font-medium">{persona.demographics.family_status || "N/A"}</p>
                            </div>
                          </div>

                          <Separator />

                          {persona.behaviors && persona.behaviors.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2 flex items-center">
                                <Eye className="mr-1 h-4 w-4 text-blue-500" />
                                Behaviors
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {persona.behaviors.map((behavior, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {behavior}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {persona.needs && persona.needs.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2 flex items-center">
                                <Heart className="mr-1 h-4 w-4 text-green-500" />
                                Needs
                              </h4>
                              <ul className="text-sm space-y-1">
                                {persona.needs.slice(0, 4).map((need, i) => (
                                  <li key={i} className="flex items-start">
                                    <ArrowRight className="h-3 w-3 mt-1 mr-2 text-green-500 flex-shrink-0" />
                                    {need}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No customer personas available</p>
                )}
              </CardContent>
            </Card>

            {results["Brand Positioning for best idea"] && (
              <Card className="backdrop-blur-sm bg-card/50 hover:bg-card/70 transition-all duration-300 animate-in slide-in-from-bottom-4 duration-600 delay-400">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="mr-2 h-4 w-4 text-accent" />
                    Brand Positioning Strategy
                  </CardTitle>
                  <CardDescription>Strategic positioning elements for your brand</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* UVP */}
                    {results["Brand Positioning for best idea"].uvp && (
                      <div className="animate-in slide-in-from-left-2 duration-400 delay-700">
                        <div className="flex items-center mb-3">
                          <Star className="mr-2 h-5 w-5 text-yellow-500" />
                          <h4 className="font-semibold text-lg">Unique Value Proposition</h4>
                        </div>
                        <Card className="bg-accent/5 border-accent/20">
                          <CardContent className="p-4">
                            <p className="text-sm font-medium">{results["Brand Positioning for best idea"].uvp}</p>
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    {results["Brand Positioning for best idea"].positioning_statement && (
                      <>
                        <Separator className="animate-in slide-in-from-left-full duration-500 delay-800" />

                        {/* Positioning Statement */}
                        <div className="animate-in slide-in-from-left-2 duration-400 delay-900">
                          <div className="flex items-center mb-3">
                            <Target className="mr-2 h-4 w-4 text-blue-500" />
                            <h4 className="font-semibold">Positioning Statement</h4>
                          </div>
                          <p className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg">
                            {results["Brand Positioning for best idea"].positioning_statement}
                          </p>
                        </div>
                      </>
                    )}

                    {results["Brand Positioning for best idea"].brand_promise && (
                      <>
                        <Separator className="animate-in slide-in-from-left-full duration-500 delay-1000" />

                        {/* Brand Promise */}
                        <div className="animate-in slide-in-from-left-2 duration-400 delay-1100">
                          <div className="flex items-center mb-3">
                            <Heart className="mr-2 h-4 w-4 text-blue-500" />
                            <h4 className="font-semibold">Brand Promise</h4>
                          </div>
                          <Card className="bg-gradient-to-r from-accent/5 to-primary/5 border-accent/20">
                            <CardContent className="p-4">
                              <p className="text-sm font-medium italic">
                                {results["Brand Positioning for best idea"].brand_promise}
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
