"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/lib/auth-context"
import { useOnboardingCheck } from "@/hooks/use-onboarding-check"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import SharedNavbar from "@/components/shared-navbar"
import { CheckCircle, AlertTriangle, XCircle, Globe, Search, Clock, Zap, Copy, Download } from "lucide-react"

interface AuditResult {
  site: string
  platform: string
  audit_date: string
  device: string
  performance_score: string
  robots_txt: {
    found: boolean
    sitemap_url: string
    disallowed_paths: string[]
    user_agents: Record<string, string>
    recommendations: string[]
  }
  sitemap: {
    found: boolean
    sitemaps: string[]
    recommendations: string[]
  }
  performance_metrics: {
    FCP: string
    LCP: string
    TBT: string
    CLS: string
    SpeedIndex: string
    TTI: string
  }
  performance_findings: {
    highlights: string[]
    issues: string[]
  }
  seo_content_crawlability: {
    sitemap_and_robots: string
    allowed_paths: string[]
    blocked_parameters: string
    mobile_friendly: boolean
  }
  accessibility: {
    critical_issues: string
    minor_issues: string[]
  }
  recommendations: {
    performance_ux: string[]
    seo: string[]
  }
  priority_fixes: Array<{
    priority: string
    issue: string
    recommendation: string
    impact: string
  }>
  summary: {
    status: string
    main_bottlenecks: string[]
    final_note: string
  }
  appendix: {
    total_requests: number
    network_payload: string
    js_payload: string
    images: string
    fonts: string
    server_response_time: string
    lcp_element: string
  }
}

const isValidUrl = (string: string) => {
  try {
    const url = new URL(string)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch (_) {
    return false
  }
}

export default function SEOAuditTool() {
  // Check onboarding status
  useOnboardingCheck()
  const { user } = useAuth()

  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<AuditResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [urlError, setUrlError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const toolsDropdownRef = useRef<HTMLDivElement>(null)
  const userDropdownRef = useRef<HTMLDivElement>(null)

  // Pre-fill form with user profile data
  useEffect(() => {
    if (user?.profile?.website) {
      setUrl(user.profile.website)
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

  const handleAudit = async () => {
    if (!url) {
      setUrlError("Please enter a URL")
      return
    }

    if (!isValidUrl(url)) {
      setUrlError("Please enter a valid URL (e.g., https://example.com)")
      return
    }

    setUrlError(null)
    setIsLoading(true)
    setError(null)
    setResults(null)

    let isTimedOut = false
    const controller = new AbortController()

    const maxRetries = 3
    let retryCount = 0

    const attemptAudit = async (): Promise<AuditResult> => {
      try {
        const webhookUrl = process.env.NEXT_PUBLIC_SEO_AUDIT_WEBHOOK_URL || "https://n8n.ooumph.com/webhook/seo"

        console.log(`[v0] Sending audit request to webhook (attempt ${retryCount + 1}/${maxRetries}):`, webhookUrl)

        const timeoutId = setTimeout(() => {
          isTimedOut = true
          controller.abort()
        }, 600000) // 10 minute timeout for n8n workflow

        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            url: url,
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
          throw new Error(`Audit failed: ${response.status} ${response.statusText}`)
        }

        const responseText = await response.text()
        console.log("[v0] Raw response text:", responseText.substring(0, 200) + "...")

        if (!responseText || responseText.trim() === "") {
          throw new Error("Empty response received from audit service")
        }

        let responseData
        try {
          responseData = JSON.parse(responseText)
          console.log("[v0] Webhook response data:", responseData)
        } catch (jsonError) {
          console.error("[v0] JSON parsing error:", jsonError)
          console.log("[v0] Response text that failed to parse:", responseText)
          throw new Error("Invalid JSON response from audit service. The service may be processing your request.")
        }

        let auditData: AuditResult
        if (Array.isArray(responseData) && responseData.length > 0 && responseData[0]?.output) {
          auditData = responseData[0].output
        } else if (responseData?.output) {
          auditData = responseData.output
        } else if (responseData?.site) {
          auditData = responseData
        } else {
          throw new Error("Invalid response format from audit service")
        }

        if (!auditData.site || !auditData.performance_score) {
          throw new Error("Incomplete audit data received")
        }

        console.log("[v0] Processed audit data:", auditData)
        return auditData
      } catch (err) {
        if (err instanceof Error && err.message.includes("Failed to fetch") && retryCount < maxRetries - 1) {
          retryCount++
          console.log(`[v0] Network error, retrying in 2 seconds... (attempt ${retryCount + 1}/${maxRetries})`)
          await new Promise((resolve) => setTimeout(resolve, 2000)) // Wait 2 seconds before retry
          return attemptAudit() // Recursive retry
        }
        throw err // Re-throw if not a retryable error or max retries reached
      }
    }

    try {
      const auditData = await attemptAudit()
      setResults(auditData)
    } catch (err) {
      console.error("[v0] Audit error:", err)
      let errorMessage = "Failed to audit website. Please try again."

      if (err instanceof Error) {
        if (err.name === "AbortError") {
          if (isTimedOut) {
            errorMessage =
              "The audit is taking longer than expected (over 10 minutes). This can happen with complex websites. Please try again or contact support if the issue persists."
          } else {
            errorMessage = "Request was cancelled. Please check your internet connection and try again."
          }
        } else if (err.message.includes("Failed to fetch")) {
          const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL || "https://n8n.ooumph.com/webhook/seo"
          errorMessage = `Network error after ${maxRetries} attempts. Unable to reach audit service at ${webhookUrl}. The service may be temporarily unavailable. Please try again in a few minutes or contact support.`
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

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
    if (urlError) setUrlError(null)
  }

  const getScoreColor = (score: string) => {
    const numScore = Number.parseInt(score.replace("/100", ""))
    if (numScore >= 90) return "text-green-600"
    if (numScore >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getPriorityColor = (priority: string) => {
    const priorityLower = priority.toLowerCase()
    if (priorityLower.includes("priority 1") || priorityLower.includes("high")) {
      return "bg-red-100 text-red-800 border-red-200"
    }
    if (priorityLower.includes("priority 2") || priorityLower.includes("medium")) {
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
    return "bg-green-100 text-green-800 border-green-200"
  }

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase()
    if (statusLower.includes("excellent")) return "bg-green-100 text-green-800"
    if (statusLower.includes("good")) return "bg-blue-100 text-blue-800"
    if (statusLower.includes("needs improvement")) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const exportReport = () => {
    if (!results) return

    try {
      const reportContent = `
SEO AUDIT REPORT
================

Site: ${results.site}
Platform: ${results.platform}
Audit Date: ${new Date(results.audit_date).toLocaleDateString()}
Device: ${results.device}

PERFORMANCE METRICS
==================
Performance Score: ${results.performance_score}
First Contentful Paint (FCP): ${results.performance_metrics.FCP}
Largest Contentful Paint (LCP): ${results.performance_metrics.LCP}
Cumulative Layout Shift (CLS): ${results.performance_metrics.CLS}
Total Blocking Time (TBT): ${results.performance_metrics.TBT}
Speed Index: ${results.performance_metrics.SpeedIndex}
Time to Interactive (TTI): ${results.performance_metrics.TTI}

SEO STATUS
==========
Robots.txt Found: ${results.robots_txt.found ? "Yes" : "No"}
Sitemap Found: ${results.sitemap.found ? "Yes" : "No"}
Mobile Friendly: ${results.seo_content_crawlability.mobile_friendly ? "Yes" : "No"}

PERFORMANCE HIGHLIGHTS
=====================
${results.performance_findings.highlights.map((highlight) => `• ${highlight}`).join("\n")}

PERFORMANCE ISSUES
==================
${results.performance_findings.issues.map((issue) => `• ${issue}`).join("\n")}

PRIORITY FIXES
==============
${results.priority_fixes
  .map(
    (fix) => `
${fix.priority}: ${fix.issue}
Recommendation: ${fix.recommendation}
Impact: ${fix.impact}
`,
  )
  .join("\n")}

PERFORMANCE & UX RECOMMENDATIONS
===============================
${results.recommendations.performance_ux.map((rec) => `• ${rec}`).join("\n")}

SEO RECOMMENDATIONS
==================
${results.recommendations.seo.map((rec) => `• ${rec}`).join("\n")}

SUMMARY
=======
Status: ${results.summary.status}
Main Bottlenecks: ${results.summary.main_bottlenecks.join(", ")}
Final Assessment: ${results.summary.final_note}

TECHNICAL DETAILS
================
Total Requests: ${results.appendix.total_requests}
Network Payload: ${results.appendix.network_payload}
JavaScript Payload: ${results.appendix.js_payload}
Images: ${results.appendix.images}
Server Response Time: ${results.appendix.server_response_time}
LCP Element: ${results.appendix.lcp_element}

Generated by SEO Audit Pro - ${new Date().toLocaleDateString()}
      `.trim()

      const blob = new Blob([reportContent], { type: "text/plain" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `seo-audit-report-${new Date().toISOString().split("T")[0]}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error("[v0] Export error:", err)
      setError("Failed to export report. Please try again.")
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <SharedNavbar currentPage="SEO Audit Tool" />

      <div className="container mx-auto px-4 pb-12 max-w-6xl pt-[33px]">
        <div className="text-center mb-12 animate-in fade-in duration-1000 delay-300">
          <h2 className="text-4xl font-bold text-foreground mb-4 animate-in slide-in-from-bottom-4 duration-800 delay-400">
            SEO Audit Tool
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-800 delay-500">
            Analyze your website's SEO performance and get actionable insights to improve your search rankings
          </p>
        </div>

        <Card className="max-w-2xl mx-auto mb-12 backdrop-blur-sm bg-card/50 border-border shadow-lg hover:shadow-xl transition-all duration-300 animate-in zoom-in-95 duration-600 delay-600">
          <CardContent className="p-6 tracking-normal">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="url"
                  placeholder="Enter website URL (e.g., https://example.com)"
                  value={url}
                  onChange={handleUrlChange}
                  className="flex-1 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-primary transition-all duration-200"
                  disabled={isLoading}
                />
                {urlError && (
                  <p className="text-sm mt-2 animate-in slide-in-from-left-2 duration-300 text-destructive">
                    {urlError}
                  </p>
                )}
              </div>
              <Button
                onClick={handleAudit}
                disabled={!url || isLoading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 transition-all duration-200 disabled:hover:scale-100 shadow-xl"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                    <span className="animate-pulse">Auditing...</span>
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4 transition-transform duration-200" />
                    Audit Website
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <Card className="max-w-2xl mx-auto border-primary/20 bg-primary/5">
              <CardContent className="p-6 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-primary mb-2">Analyzing Your Website</h3>
                <p className="text-primary/80 mb-4">
                  Our comprehensive SEO audit is in progress. This may take several minutes as we analyze performance,
                  SEO factors, and accessibility.
                </p>
                <p className="text-sm text-primary/60">Please keep this tab open while we complete the analysis...</p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card
                  key={i}
                  className="animate-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <CardHeader>
                    <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 w-full bg-muted rounded mb-2 animate-pulse" />
                    <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {error && !results && (
          <Card className="max-w-2xl mx-auto border-destructive animate-in zoom-in-95 duration-500 shake">
            <CardContent className="p-6 text-center">
              <XCircle className="h-12 w-12 text-destructive mx-auto mb-4 animate-in zoom-in-50 duration-300" />
              <h3 className="text-lg font-semibold text-destructive mb-2 animate-in slide-in-from-bottom-2 duration-400 delay-100">
                Audit Failed
              </h3>
              <p className="text-muted-foreground mb-4 animate-in slide-in-from-bottom-2 duration-400 delay-200">
                {error}
              </p>
              <Button
                onClick={handleAudit}
                variant="outline"
                className="transition-transform duration-200 animate-in slide-in-from-bottom-2 duration-400 delay-300 bg-transparent"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {results && (
          <div className="space-y-8 animate-in fade-in duration-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[0, 1, 2].map((index) => (
                <Card
                  key={index}
                  className="backdrop-blur-sm bg-card/50 hover:bg-card/70 transition-all duration-300 hover:scale-105 hover:shadow-lg animate-in slide-in-from-bottom-4 duration-600"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {index === 0 && (
                    <>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Zap className="mr-2 h-5 w-5 text-accent animate-pulse" />
                          Performance Score
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold mb-2">
                          <span
                            className={`${getScoreColor(results.performance_score)} animate-in zoom-in-50 duration-500 delay-300`}
                          >
                            {results.performance_score}
                          </span>
                        </div>
                        <Progress
                          value={Number.parseInt(results.performance_score.replace("/100", ""))}
                          className="mb-4 animate-in slide-in-from-left-full duration-800 delay-400"
                        />
                        <div className="space-y-2 text-sm">
                          {Object.entries(results.performance_metrics)
                            .slice(0, 4)
                            .map(([key, value], i) => (
                              <div
                                key={key}
                                className="flex justify-between animate-in slide-in-from-right-2 duration-300"
                                style={{ animationDelay: `${500 + i * 100}ms` }}
                              >
                                <span>{key}:</span>
                                <span>{value}</span>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </>
                  )}

                  {index === 1 && (
                    <>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Globe className="mr-2 h-5 w-5 text-accent" />
                          Site Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {[
                            { label: "Platform", value: results.platform },
                            { label: "Audit Date", value: results.audit_date },
                            { label: "Device", value: results.device, icon: <Search className="mr-1 h-4 w-4" /> },
                            { label: "Site", value: results.site, className: "text-xs break-all" },
                          ].map((item, i) => (
                            <div
                              key={item.label}
                              className="animate-in slide-in-from-left-2 duration-300"
                              style={{ animationDelay: `${300 + i * 100}ms` }}
                            >
                              <span className="text-sm text-muted-foreground">{item.label}:</span>
                              <p className={`font-medium flex items-center ${item.className || ""}`}>
                                {item.icon}
                                {item.value}
                              </p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </>
                  )}

                  {index === 2 && (
                    <>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                          SEO Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {[
                            { label: "Robots.txt", found: results.robots_txt.found },
                            { label: "Sitemap", found: results.sitemap.found },
                            { label: "Mobile Friendly", found: results.seo_content_crawlability.mobile_friendly },
                          ].map((item, i) => (
                            <div
                              key={item.label}
                              className="flex items-center justify-between animate-in slide-in-from-right-2 duration-300"
                              style={{ animationDelay: `${300 + i * 100}ms` }}
                            >
                              <span className="text-sm">{item.label}:</span>
                              <Badge
                                variant="secondary"
                                className={`${item.found ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} animate-in zoom-in-50 duration-200`}
                                style={{ animationDelay: `${400 + i * 100}ms` }}
                              >
                                {item.found
                                  ? item.label === "Mobile Friendly"
                                    ? "Yes"
                                    : "Found"
                                  : item.label === "Mobile Friendly"
                                    ? "No"
                                    : "Missing"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </>
                  )}
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="backdrop-blur-sm bg-card/50 hover:bg-card/70 transition-all duration-300 animate-in slide-in-from-left-4 duration-600 delay-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-600">
                    <CheckCircle className="mr-2 h-5 w-5 animate-bounce" />
                    Performance Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {results.performance_findings.highlights.map((highlight, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 animate-in slide-in-from-left-2 duration-400"
                        style={{ animationDelay: `${400 + index * 100}ms` }}
                      >
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm">{highlight}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-card/50 hover:bg-card/70 transition-all duration-300 animate-in slide-in-from-right-4 duration-600 delay-400">
                <CardHeader>
                  <CardTitle className="flex items-center text-yellow-600">
                    <AlertTriangle className="mr-2 h-5 w-5 animate-pulse" style={{ animationDuration: "3s" }} />
                    Performance Issues
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {results.performance_findings.issues.map((issue, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 animate-in slide-in-from-right-2 duration-400"
                        style={{ animationDelay: `${400 + index * 100}ms` }}
                      >
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm">{issue}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="backdrop-blur-sm bg-card/50 hover:bg-card/70 transition-all duration-300 animate-in slide-in-from-bottom-4 duration-600 delay-500">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-accent animate-spin" style={{ animationDuration: "3s" }} />
                  Priority Fixes
                </CardTitle>
                <CardDescription>Recommended actions to improve your website's performance and SEO</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.priority_fixes.map((fix, index) => (
                    <Card
                      key={index}
                      className="border-l-4 border-l-accent hover:shadow-md transition-all duration-300 animate-in zoom-in-95 duration-500"
                      style={{ animationDelay: `${600 + index * 150}ms` }}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className={getPriorityColor(fix.priority)}>
                            {fix.priority}
                          </Badge>
                          <Button variant="ghost" size="sm" className="transition-transform duration-200">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <CardTitle className="text-base">{fix.issue}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground mb-2">{fix.recommendation}</p>
                        <p className="text-sm font-medium text-accent">{fix.impact}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                {
                  title: "Performance & UX Recommendations",
                  icon: Zap,
                  items: results.recommendations.performance_ux,
                  delay: 700,
                },
                { title: "SEO Recommendations", icon: Search, items: results.recommendations.seo, delay: 800 },
              ].map((section, sectionIndex) => (
                <Card
                  key={section.title}
                  className="backdrop-blur-sm bg-card/50 hover:bg-card/70 transition-all duration-300 animate-in slide-in-from-bottom-4 duration-600"
                  style={{ animationDelay: `${section.delay}ms` }}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <section.icon className="mr-2 h-5 w-5 text-accent" />
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {section.items.map((rec, index) => (
                        <li
                          key={index}
                          className="flex items-start space-x-2 animate-in slide-in-from-left-2 duration-300"
                          style={{ animationDelay: `${section.delay + 200 + index * 100}ms` }}
                        >
                          <CheckCircle className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="backdrop-blur-sm bg-card/50 hover:bg-card/70 transition-all duration-300 animate-in slide-in-from-bottom-4 duration-600 delay-900">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-accent" />
                    Summary
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportReport}
                    className="transition-all duration-200 hover:bg-primary/10 hover:text-primary hover:border-primary bg-transparent"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export Report
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="animate-in slide-in-from-left-2 duration-400 delay-1000">
                    <h4 className="font-medium mb-2">Overall Status</h4>
                    <Badge
                      variant="secondary"
                      className={`${getStatusColor(results.summary.status)} animate-in zoom-in-50 duration-300 delay-1100`}
                    >
                      {results.summary.status}
                    </Badge>
                  </div>

                  <Separator className="animate-in slide-in-from-left-full duration-500 delay-1200" />

                  <div className="animate-in slide-in-from-left-2 duration-400 delay-1300">
                    <h4 className="font-medium mb-3">Main Bottlenecks</h4>
                    <div className="flex flex-wrap gap-2">
                      {results.summary.main_bottlenecks.map((bottleneck, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-red-50 text-red-700 border-red-200 animate-in zoom-in-50 duration-300"
                          style={{ animationDelay: `${1400 + index * 100}ms` }}
                        >
                          {bottleneck}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator className="animate-in slide-in-from-left-full duration-500 delay-1500" />

                  <div className="animate-in slide-in-from-left-2 duration-400 delay-1600">
                    <h4 className="font-medium mb-3">Final Assessment</h4>
                    <p className="text-sm text-muted-foreground">{results.summary.final_note}</p>
                  </div>

                  <Separator className="animate-in slide-in-from-left-full duration-500 delay-1700" />

                  <div className="animate-in slide-in-from-left-2 duration-400 delay-1800">
                    <h4 className="font-medium mb-3">Technical Details</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      {[
                        { label: "Total Requests", value: results.appendix.total_requests },
                        { label: "Network Payload", value: results.appendix.network_payload },
                        { label: "JS Payload", value: results.appendix.js_payload },
                        { label: "Images", value: results.appendix.images },
                        { label: "Response Time", value: results.appendix.server_response_time },
                      ].map((item, index) => (
                        <div
                          key={item.label}
                          className="animate-in slide-in-from-bottom-2 duration-300"
                          style={{ animationDelay: `${1900 + index * 100}ms` }}
                        >
                          <span className="text-muted-foreground">{item.label}:</span>
                          <p className="font-medium">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
