"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useOnboardingCheck } from "@/hooks/use-onboarding-check"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import mermaid from "mermaid"
import {
  Copy,
  CheckCircle,
  Target,
  Layout,
  FileText,
  Palette,
  Eye,
  Code,
  TestTube,
  Loader2,
  Download,
  Smartphone,
  Monitor,
  Tablet,
  Zap,
} from "lucide-react"
import SharedNavbar from "@/components/shared-navbar"

interface LandingPageData {
  "page strategy": {
    layout: string[]
    sections: Array<{
      type: string
      headline: string
      subheadline: string
      cta: string
      visual: string
      bullets: string[]
      paragraph: string
      feature_list: Array<{
        feature: string
        benefit: string
      }>
      elements: string[]
      fields: string[]
      consent: string
    }>
    ab_tests: Array<{
      test: string
      variants: string[]
    }>
    primary_cta: string
    secondary_cta: string
    risks: string[]
  }
  "mermaid wireframe": string
  "copywriting content": {
    section_copy: Array<{
      id: string
      headline: string
      subhead: string
      body: string
      cta: string
    }>
    primary_cta: string
    secondary_cta: string
  }
  "Web Designing plan": string
  code: string
  url?: string
}

export default function LandingPageGeneratorPage() {
  // Check onboarding status
  useOnboardingCheck()
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    goal: "",
    audience: "",
    offer: "",
    brand_voice: "",
    constraints: "",
    industry: "",
    competitors: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<LandingPageData | null>(null)
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set())
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [mermaidSvg, setMermaidSvg] = useState<string>("")

  // Pre-fill form with user profile data
  useEffect(() => {
    if (user?.profile) {
      setFormData({
        goal: user.profile.contentGoals || "",
        audience: user.profile.targetAudience || "",
        offer: user.profile.valueProposition || "",
        brand_voice: user.profile.brandVoice || "",
        constraints: user.profile.constraints || "",
        industry: user.profile.industry || "",
        competitors: user.profile.competitors || "",
      })
    }
  }, [user])

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "default",
      securityLevel: "loose",
    })
  }, [])

  useEffect(() => {
    if (results?.["mermaid wireframe"]) {
      const renderMermaid = async () => {
        try {
          let mermaidCode = results["mermaid wireframe"]

          // Remove or escape problematic characters that break mermaid parsing
          mermaidCode = mermaidCode
            .replace(/"/g, "'") // Replace double quotes with single quotes
            .replace(/\[([^\]]*)"([^"]*)"([^\]]*)\]/g, "[$1'$2'$3]") // Fix quotes in brackets
            .replace(/$$([^)]*)"([^"]*)"([^)]*)$$/g, "($1'$2'$3)") // Fix quotes in parentheses
            .replace(/:/g, " -") // Replace colons that might cause issues
            .replace(/\s+/g, " ") // Normalize whitespace
            .trim()

          console.log("[v0] Sanitized mermaid code:", mermaidCode.substring(0, 200))

          const { svg } = await mermaid.render("mermaid-diagram", mermaidCode)
          setMermaidSvg(svg)
        } catch (error) {
          console.error("[v0] Error rendering mermaid diagram:", error)
          setMermaidSvg("")
        }
      }
      renderMermaid()
    }
  }, [results])

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

    try {
      console.log("[v0] Submitting landing page form with data:", JSON.stringify(formData))

      const webhookUrl = process.env.NEXT_PUBLIC_LANDING_PAGE_WEBHOOK_URL || "https://n8n.ooumph.com/webhook/landing-page-generator"
      
      console.log("[v0] Sending request to webhook:", webhookUrl)

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        // No timeout - let the AI agent take as long as it needs
      })

      console.log("[v0] Response status:", response.status)
      console.log("[v0] Response ok:", response.ok)

      if (!response.ok) {
        const errorText = await response.text()
        console.log("[v0] Error response text:", errorText)
        throw new Error(`HTTP ${response.status}: ${errorText || "Failed to generate landing page"}`)
      }

      const responseText = await response.text()
      console.log("[v0] Raw response text length:", responseText.length)

      if (!responseText || responseText.trim().length === 0) {
        throw new Error("Empty response received from server")
      }

      let data
      try {
        data = JSON.parse(responseText)
        console.log("[v0] Successfully parsed JSON data")
      } catch (jsonError) {
        console.log("[v0] JSON parse error:", jsonError)
        console.log("[v0] Response text preview:", responseText.substring(0, 200))
        throw new Error(
          `Invalid JSON response: ${jsonError instanceof Error ? jsonError.message : "Unknown JSON error"}`,
        )
      }

      let landingPageData
      if (Array.isArray(data)) {
        landingPageData = data[0]
      } else if (data && typeof data === "object") {
        landingPageData = data
      } else {
        throw new Error("Invalid data structure received from server")
      }

      console.log("[v0] Processed landing page data keys:", Object.keys(landingPageData || {}))
      console.log("[v0] Data structure:", JSON.stringify(landingPageData, null, 2))

      if (!landingPageData || typeof landingPageData !== "object") {
        throw new Error("Invalid data structure received from server")
      }

      setResults(landingPageData)
    } catch (error) {
      console.error("[v0] Error generating landing page:", error)

      let errorMessage = "Unknown error occurred"
      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          errorMessage =
            "Network error: Unable to connect to the server. Please check your internet connection and try again."
        } else {
          errorMessage = error.message
        }
      }

      alert(`Error generating landing page: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case "desktop":
        return Monitor
      case "tablet":
        return Tablet
      case "mobile":
        return Smartphone
      default:
        return Monitor
    }
  }

  if (results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <SharedNavbar currentPage="Landing Page Generator" />

        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Landing Page Dashboard</h1>
            <Button onClick={() => setResults(null)} variant="outline" className="mb-6">
              Generate New Landing Page
            </Button>
          </div>

          <Tabs defaultValue="strategy" className="w-full">
            <TabsList className="grid w-full grid-cols-7 mb-8">
              <TabsTrigger value="strategy" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Strategy
              </TabsTrigger>
              <TabsTrigger value="wireframe" className="flex items-center gap-2">
                <Layout className="h-4 w-4" />
                Wireframe
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Content
              </TabsTrigger>
              <TabsTrigger value="design" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Design
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Code
              </TabsTrigger>
              <TabsTrigger value="testing" className="flex items-center gap-2">
                <TestTube className="h-4 w-4" />
                A/B Testing
              </TabsTrigger>
            </TabsList>

            {/* Strategy Overview Tab */}
            <TabsContent value="strategy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layout className="h-5 w-5" />
                    Page Layout Flow
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(() => {
                      console.log("[v0] Strategy data:", results["page strategy"])
                      const strategy = results["page strategy"]
                      const layout = strategy?.layout || []

                      if (Array.isArray(layout) && layout.length > 0) {
                        return layout.map((section, index) => (
                          <div key={index} className="p-4 border rounded-lg bg-blue-50">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <Badge variant="outline">{index + 1}</Badge>
                                <h4 className="font-semibold text-gray-900">{section}</h4>
                              </div>
                              <CopyButton text={section} itemId={`layout-${index}`} />
                            </div>
                          </div>
                        ))
                      } else {
                        return (
                          <div className="p-4 border rounded-lg bg-yellow-50">
                            <p className="text-gray-600">Layout data structure: {JSON.stringify(layout)}</p>
                            <p className="text-gray-600 mt-2">
                              Full strategy keys: {Object.keys(strategy || {}).join(", ")}
                            </p>
                          </div>
                        )
                      }
                    })()}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Page Sections</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {results["page strategy"]?.sections?.map((section, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">{section.type}</Badge>
                            <h4 className="font-semibold text-gray-900">{section.headline}</h4>
                          </div>
                          <CopyButton
                            text={`${section.headline}: ${section.subheadline}`}
                            itemId={`section-${index}`}
                          />
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{section.subheadline}</p>
                        {section.bullets && section.bullets.length > 0 && (
                          <div className="mb-3">
                            <ul className="list-disc list-inside space-y-1">
                              {section.bullets.map((bullet, bulletIndex) => (
                                <li key={bulletIndex} className="text-sm text-gray-700">
                                  {bullet}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {section.paragraph && <p className="text-gray-700 text-sm mb-3">{section.paragraph}</p>}
                        <div className="flex flex-wrap gap-2">
                          {section.elements?.map((element, elemIndex) => (
                            <Badge key={elemIndex} variant="secondary" className="text-xs">
                              {element}
                            </Badge>
                          ))}
                        </div>
                        {section.cta && (
                          <div className="mt-2">
                            <Badge className="bg-purple-100 text-purple-800">CTA: {section.cta}</Badge>
                          </div>
                        )}
                      </div>
                    )) || <p className="text-gray-600">No sections information available</p>}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Primary CTA
                    </CardTitle>
                    <CopyButton text={results["page strategy"]?.primary_cta || ""} itemId="primary-cta" />
                  </CardHeader>
                  <CardContent>
                    <div className="p-3 bg-purple-50 rounded-lg border-2 border-purple-200">
                      <p className="text-purple-800 font-semibold text-center">
                        {results["page strategy"]?.primary_cta}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Secondary CTA
                    </CardTitle>
                    <CopyButton text={results["page strategy"]?.secondary_cta || ""} itemId="secondary-cta" />
                  </CardHeader>
                  <CardContent>
                    <div className="p-3 bg-gray-50 rounded-lg border-2 border-gray-200">
                      <p className="text-gray-700 font-medium text-center">{results["page strategy"]?.secondary_cta}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {results["page strategy"]?.risks?.map((risk, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Badge className="bg-yellow-100 text-yellow-800">Risk</Badge>
                            <h4 className="font-semibold text-gray-900">Risk #{index + 1}</h4>
                          </div>
                          <CopyButton text={risk} itemId={`risk-${index}`} />
                        </div>
                        <p className="text-gray-600 text-sm">{risk}</p>
                      </div>
                    )) || <p className="text-gray-600">No risk assessment available</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Wireframe Tab */}
            <TabsContent value="wireframe" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layout className="h-5 w-5" />
                    Interactive Wireframe
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {mermaidSvg ? (
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-3">Visual Diagram</h4>
                      <div
                        className="bg-white p-4 rounded-lg border overflow-auto"
                        dangerouslySetInnerHTML={{ __html: mermaidSvg }}
                      />
                    </div>
                  ) : results?.["mermaid wireframe"] ? (
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-3">Wireframe Structure</h4>
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <p className="text-yellow-800 text-sm mb-2">
                          <strong>Note:</strong> The mermaid diagram contains special characters that prevent visual
                          rendering. The raw wireframe structure is shown below.
                        </p>
                      </div>
                    </div>
                  ) : null}

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Wireframe Code</h4>
                      <CopyButton text={results?.["mermaid wireframe"] || ""} itemId="wireframe-code" />
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 overflow-x-auto">
                        {results?.["mermaid wireframe"] || "No wireframe data available"}
                      </pre>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export PNG
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export SVG
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-6">
              {(() => {
                console.log("[v0] Content data:", results["copywriting content"])
                const content = results["copywriting content"]
                const sections = content?.section_copy || []

                if (Array.isArray(sections) && sections.length > 0) {
                  return sections.map((section, index) => (
                    <Card key={section.id || index}>
                      <CardHeader>
                        <CardTitle className="capitalize">
                          {section.id?.replace(/_/g, " ") || `Section ${index + 1}`}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Headline</h5>
                          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <p className="text-gray-800 font-semibold">{section.headline}</p>
                            <CopyButton text={section.headline} itemId={`headline-${section.id}`} />
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Subheadline</h5>
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <p className="text-gray-700">{section.subhead}</p>
                            <CopyButton text={section.subhead} itemId={`subhead-${section.id}`} />
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Body Text</h5>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-start justify-between">
                              <p className="text-gray-700 text-sm flex-1">{section.body}</p>
                              <CopyButton text={section.body} itemId={`body-${section.id}`} className="ml-2" />
                            </div>
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Call to Action</h5>
                          <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg border border-purple-200">
                            <span className="text-purple-800 font-medium">{section.cta}</span>
                            <CopyButton text={section.cta} itemId={`cta-${section.id}`} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                } else {
                  return (
                    <div className="p-4 border rounded-lg bg-yellow-50">
                      <p className="text-gray-600">Content data structure: {JSON.stringify(sections)}</p>
                      <p className="text-gray-600 mt-2">Full content keys: {Object.keys(content || {}).join(", ")}</p>
                    </div>
                  )
                }
              })()}
            </TabsContent>

            {/* Design System Tab */}
            <TabsContent value="design" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Design Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    console.log("[v0] Design data:", results["Web Designing plan"])
                    const designPlan = results["Web Designing plan"]

                    if (designPlan && typeof designPlan === "string") {
                      return (
                        <>
                          <div className="bg-gray-50 p-6 rounded-lg">
                            <pre className="whitespace-pre-wrap text-sm text-gray-700 overflow-x-auto">
                              {designPlan}
                            </pre>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <CopyButton text={designPlan} itemId="design-plan" />
                          </div>
                        </>
                      )
                    } else {
                      return (
                        <div className="p-4 border rounded-lg bg-yellow-50">
                          <p className="text-gray-600">Design plan data: {JSON.stringify(designPlan)}</p>
                        </div>
                      )
                    }
                  })()}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Live Preview Tab */}
            <TabsContent value="preview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Deployed Landing Page
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {results.url ? (
                    <div className="space-y-4">
                      <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Landing Page is Live! 🚀</h3>
                        <p className="text-gray-600 mb-4">
                          Your landing page has been deployed and is ready to view. Click the link below to see it in
                          action:
                        </p>
                        <a
                          href={results.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          <Eye className="h-5 w-5" />
                          View Live Landing Page
                        </a>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg border">
                        <p className="text-sm text-gray-600 mb-2">Deployment URL:</p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 px-3 py-2 bg-white rounded border text-sm text-gray-800 overflow-x-auto">
                            {results.url}
                          </code>
                          <CopyButton text={results.url} itemId="deployment-url" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-yellow-800">
                        No deployment URL available. The landing page code is available in the Code tab.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Code Export Tab */}
            <TabsContent value="code" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Complete HTML Code
                    </span>
                    <div className="flex gap-2">
                      <CopyButton text={results.code || ""} itemId="full-code" />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const blob = new Blob([results.code || ""], { type: "text/html" })
                          const url = URL.createObjectURL(blob)
                          const a = document.createElement("a")
                          a.href = url
                          a.download = "index.html"
                          document.body.appendChild(a)
                          a.click()
                          document.body.removeChild(a)
                          URL.revokeObjectURL(url)
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download HTML
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto max-h-96">
                    <pre className="text-sm">
                      <code>{results.code || "No code available"}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* A/B Testing Tab */}
            <TabsContent value="testing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TestTube className="h-5 w-5" />
                    A/B Test Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {results["page strategy"]?.ab_tests?.map((test, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-yellow-50">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900">Test: {test.test}</h4>
                          <CopyButton text={`${test.test}: ${test.variants.join(" vs ")}`} itemId={`test-${index}`} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          {test.variants.map((variant, variantIndex) => (
                            <div
                              key={variantIndex}
                              className={`p-3 rounded border-l-4 ${
                                variantIndex === 0 ? "bg-blue-50 border-blue-500" : "bg-green-50 border-green-500"
                              }`}
                            >
                              <h5
                                className={`font-medium mb-1 ${
                                  variantIndex === 0 ? "text-blue-800" : "text-green-800"
                                }`}
                              >
                                Variant {String.fromCharCode(65 + variantIndex)}
                              </h5>
                              <p className={`text-sm ${variantIndex === 0 ? "text-blue-700" : "text-green-700"}`}>
                                {variant}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )) || <p className="text-gray-600">No A/B test recommendations available</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <SharedNavbar currentPage="Landing Page Generator" />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Landing Page Generator</h1>
          <p className="text-xl text-gray-600 mb-8">
            Create high-converting landing pages with comprehensive strategy, design, and code generation
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6" />
              Landing Page Requirements
            </CardTitle>
            <CardDescription>
              Provide details about your landing page goals to generate a complete strategy and implementation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="goal">Primary Goal</Label>
                  <Input
                    id="goal"
                    placeholder="e.g., Generate leads, Sell product, Sign-ups"
                    value={formData.goal}
                    onChange={(e) => handleInputChange("goal", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    placeholder="e.g., SaaS, E-commerce, Consulting"
                    value={formData.industry}
                    onChange={(e) => handleInputChange("industry", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="audience">Target Audience</Label>
                <Textarea
                  id="audience"
                  placeholder="Describe your ideal visitors (demographics, pain points, motivations, behavior)"
                  value={formData.audience}
                  onChange={(e) => handleInputChange("audience", e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="offer">Value Proposition & Offer</Label>
                <Textarea
                  id="offer"
                  placeholder="What are you offering? What makes it unique and valuable?"
                  value={formData.offer}
                  onChange={(e) => handleInputChange("offer", e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand_voice">Brand Voice & Tone</Label>
                <Textarea
                  id="brand_voice"
                  placeholder="Describe your brand personality (professional, friendly, authoritative, casual, etc.)"
                  value={formData.brand_voice}
                  onChange={(e) => handleInputChange("brand_voice", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="competitors">Competitors (Optional)</Label>
                <Input
                  id="competitors"
                  placeholder="List 2-3 competitor websites for reference"
                  value={formData.competitors}
                  onChange={(e) => handleInputChange("competitors", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="constraints">Constraints & Requirements</Label>
                <Textarea
                  id="constraints"
                  placeholder="Any specific requirements, limitations, or preferences (colors, layout, features, etc.)"
                  value={formData.constraints}
                  onChange={(e) => handleInputChange("constraints", e.target.value)}
                  rows={3}
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
                    Generating Landing Page...
                  </>
                ) : (
                  <>
                    <Target className="mr-2 h-5 w-5" />
                    Generate Landing Page
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
