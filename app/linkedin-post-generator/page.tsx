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
import { Loader2, Copy, CheckCircle, Linkedin, ImageIcon, Sparkles } from "lucide-react"
import SharedNavbar from "@/components/shared-navbar"

interface LinkedinPostData {
  "Linkedin Post": string
  "Image Url": string
}

export default function LinkedinPostGeneratorPage() {
  // Check onboarding status
  useOnboardingCheck()
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    brandName: "",
    platformPreferences: "",
    monetizationApproach: "",
    targetAudience: "",
    additionalInformation: "",
    businessDescription: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<LinkedinPostData | null>(null)
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set())

  // Pre-fill form with user profile data
  useEffect(() => {
    if (user?.profile) {
      setFormData({
        brandName: user.profile.brandName || user.profile.companyName || "",
        platformPreferences: user.profile.platformPreferences || "",
        monetizationApproach: user.profile.monetizationApproach || "",
        targetAudience: user.profile.targetAudience || "",
        additionalInformation: user.profile.additionalInfo || "",
        businessDescription: user.profile.businessDescription || "",
      })
    }
  }, [user])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResults(null)

    try {
      console.log("[v0] Starting LinkedIn post generation with data:", formData)

      const requestData = [
        {
          "Brand Name": formData.brandName,
          "Platfrom Prefrences": formData.platformPreferences,
          "Monetization Approach": formData.monetizationApproach,
          "Target Audience": formData.targetAudience,
          "Aditional Information & Preferences": formData.additionalInformation,
          "Buisness Description": formData.businessDescription,
        },
      ]

      const webhookUrl = process.env.NEXT_PUBLIC_LINKEDIN_POST_WEBHOOK_URL || "https://n8n.ooumph.com/webhook/linkedin-post"
      
      console.log("[v0] Sending request to webhook:", webhookUrl, "with data:", requestData)

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })

      console.log("[v0] Response status:", response.status, "ok:", response.ok)

      if (!response.ok) {
        const errorText = await response.text()
        console.log("[v0] Error response text:", errorText)
        throw new Error(`HTTP ${response.status}: ${errorText || "Failed to generate LinkedIn post"}`)
      }

      const responseText = await response.text()
      console.log("[v0] Response text length:", responseText.length)

      if (!responseText || responseText.trim() === "") {
        throw new Error("Empty response from server")
      }

      let data
      try {
        data = JSON.parse(responseText)
        console.log("[v0] Parsed JSON successfully, keys:", Object.keys(data))
      } catch (parseError) {
        console.error("[v0] JSON parse error:", parseError)
        console.log("[v0] Response text preview:", responseText.substring(0, 200))
        throw new Error(
          `Invalid JSON response: ${parseError instanceof Error ? parseError.message : "Unknown JSON error"}`,
        )
      }

      // Handle array response
      const postData = Array.isArray(data) ? data[0] : data
      console.log("[v0] Final post data:", postData)

      setResults(postData)
    } catch (error) {
      console.error("[v0] Error generating LinkedIn post:", error)

      let errorMessage = "Unknown error occurred"
      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          errorMessage =
            "Network error: Unable to connect to the server. Please check your internet connection and try again."
        } else {
          errorMessage = error.message
        }
      }

      alert(`Error generating LinkedIn post: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
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

  const isFormValid = formData.brandName && formData.businessDescription && formData.targetAudience

  return (
    <div className="min-h-screen bg-background">
      <SharedNavbar currentPage="LinkedIn Post Generator" />

      <div className="container mx-auto px-4 max-w-6xl py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-4">
            <Linkedin className="mr-2 h-4 w-4" />
            Professional LinkedIn Content
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">LinkedIn Post Generator</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Generate engaging LinkedIn posts with AI-powered content and custom images tailored to your brand and
            audience
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-primary" />
                Brand & Content Details
              </CardTitle>
              <CardDescription>Provide your brand information to generate targeted LinkedIn content</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="brandName">Brand Name *</Label>
                  <Input
                    id="brandName"
                    placeholder="e.g., Techsagelabs"
                    value={formData.brandName}
                    onChange={(e) => handleInputChange("brandName", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessDescription">Business Description *</Label>
                  <Textarea
                    id="businessDescription"
                    placeholder="e.g., We provide robotics kit and tutorials to help students learn AIoT hands on way"
                    value={formData.businessDescription}
                    onChange={(e) => handleInputChange("businessDescription", e.target.value)}
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target Audience *</Label>
                  <Input
                    id="targetAudience"
                    placeholder="e.g., School and College Students"
                    value={formData.targetAudience}
                    onChange={(e) => handleInputChange("targetAudience", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="platformPreferences">Platform Preferences</Label>
                  <Input
                    id="platformPreferences"
                    placeholder="e.g., Instagram, LinkedIn"
                    value={formData.platformPreferences}
                    onChange={(e) => handleInputChange("platformPreferences", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monetizationApproach">Monetization Approach</Label>
                  <Input
                    id="monetizationApproach"
                    placeholder="e.g., Selling AI and Robotics Kit"
                    value={formData.monetizationApproach}
                    onChange={(e) => handleInputChange("monetizationApproach", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalInformation">Additional Information & Preferences</Label>
                  <Textarea
                    id="additionalInformation"
                    placeholder="e.g., I also want to promote my innovator place, it's a platform for builders to showcase and build portfolio"
                    value={formData.additionalInformation}
                    onChange={(e) => handleInputChange("additionalInformation", e.target.value)}
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!isFormValid || isLoading}
                  style={{ backgroundColor: "#8B5CF6" }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating LinkedIn Post...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate LinkedIn Post
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Linkedin className="mr-2 h-5 w-5 text-blue-600" />
                Generated Content
              </CardTitle>
              <CardDescription>Your AI-generated LinkedIn post and image</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-muted-foreground text-center">
                    Generating your LinkedIn post...
                    <br />
                    <span className="text-sm">This may take a few minutes</span>
                  </p>
                </div>
              ) : results ? (
                <Tabs defaultValue="post" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="post">LinkedIn Post</TabsTrigger>
                    <TabsTrigger value="image">Generated Image</TabsTrigger>
                  </TabsList>

                  <TabsContent value="post" className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          <Linkedin className="mr-1 h-3 w-3" />
                          LinkedIn Post
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(results["Linkedin Post"], "post")}
                          className="flex items-center"
                        >
                          {copiedItems.has("post") ? (
                            <>
                              <CheckCircle className="mr-1 h-3 w-3 text-green-600" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="mr-1 h-3 w-3" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg border">
                        <pre className="whitespace-pre-wrap text-sm text-foreground font-sans">
                          {results["Linkedin Post"]}
                        </pre>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="image" className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <ImageIcon className="mr-1 h-3 w-3" />
                          Generated Image
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(results["Image Url"], "image")}
                          className="flex items-center"
                        >
                          {copiedItems.has("image") ? (
                            <>
                              <CheckCircle className="mr-1 h-3 w-3 text-green-600" />
                              Copied URL
                            </>
                          ) : (
                            <>
                              <Copy className="mr-1 h-3 w-3" />
                              Copy URL
                            </>
                          )}
                        </Button>
                      </div>
                      {results["Image Url"] ? (
                        <div className="space-y-3">
                          <div className="bg-muted/50 p-4 rounded-lg border">
                            <img
                              src={results["Image Url"] || "/placeholder.svg"}
                              alt="Generated LinkedIn post image"
                              className="w-full h-auto rounded-lg shadow-sm"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = "none"
                                const parent = target.parentElement
                                if (parent) {
                                  parent.innerHTML = `
                                    <div class="flex items-center justify-center h-48 bg-muted rounded-lg">
                                      <div class="text-center text-muted-foreground">
                                        <ImageIcon class="h-8 w-8 mx-auto mb-2" />
                                        <p>Image could not be loaded</p>
                                      </div>
                                    </div>
                                  `
                                }
                              }}
                            />
                          </div>
                          <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                            <strong>Image URL:</strong> {results["Image Url"]}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-48 bg-muted/50 rounded-lg border">
                          <div className="text-center text-muted-foreground">
                            <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                            <p>No image generated</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Linkedin className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Ready to Generate</h3>
                    <p className="text-muted-foreground text-sm">
                      Fill in your brand details and click generate to create your LinkedIn post
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>What You'll Get</CardTitle>
              <CardDescription>Professional LinkedIn content tailored to your brand</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Linkedin className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Engaging Posts</h3>
                  <p className="text-sm text-muted-foreground">
                    AI-crafted posts that resonate with your target audience and drive engagement
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <ImageIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Custom Images</h3>
                  <p className="text-sm text-muted-foreground">
                    Professional images generated to complement your post content and brand
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Brand Aligned</h3>
                  <p className="text-sm text-muted-foreground">
                    Content that perfectly matches your brand voice and business objectives
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
