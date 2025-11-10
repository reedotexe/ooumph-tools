"use client"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SharedNavbar from "@/components/shared-navbar"
import {
  Search,
  BarChart3,
  Palette,
  Zap,
  Shield,
  TrendingUp,
  Users,
  Star,
  User,
  ArrowRight,
  CheckCircle,
  Globe,
  Target,
  Sparkles,
  Layout,
  Linkedin,
} from "lucide-react"

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  const [visibleSections, setVisibleSections] = useState({
    tools: false,
    benefits: false,
    testimonials: false,
    cta: false,
  })
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const toolsDropdownRef = useRef<HTMLDivElement>(null)
  const userDropdownRef = useRef<HTMLDivElement>(null)
  const toolsSectionRef = useRef<HTMLElement>(null)
  const benefitsSectionRef = useRef<HTMLElement>(null)
  const testimonialsSectionRef = useRef<HTMLElement>(null)
  const ctaSectionRef = useRef<HTMLElement>(null)

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

    const handleScroll = () => {
      const sections = [
        { ref: toolsSectionRef.current, key: "tools" as const },
        { ref: benefitsSectionRef.current, key: "benefits" as const },
        { ref: testimonialsSectionRef.current, key: "testimonials" as const },
        { ref: ctaSectionRef.current, key: "cta" as const },
      ]

      const newVisibleSections = { ...visibleSections }
      let hasChanges = false

      sections.forEach(({ ref, key }) => {
        if (ref) {
          const rect = ref.getBoundingClientRect()
          const isVisible = rect.top < window.innerHeight && rect.bottom > 0

          if (isVisible && !newVisibleSections[key]) {
            newVisibleSections[key] = true
            hasChanges = true
          }
        }
      })

      if (hasChanges) {
        setVisibleSections(newVisibleSections)
      }
    }

    // Initial check for sections in view
    handleScroll()

    document.addEventListener("mousedown", handleClickOutside)
    window.addEventListener("scroll", handleScroll)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [visibleSections])

  const navigateToPage = (path: string) => {
    window.location.href = path
  }

  const scrollToTools = () => {
    toolsSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
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
      {/* Shared Navbar */}
      <SharedNavbar currentPage="Home" />

      {/* Hero Section */}
      <section className="container mx-auto px-4 max-w-6xl pt-12 pb-20">
        <div className="text-center mb-16 animate-in fade-in duration-1000">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-800 text-sm font-medium mb-6 animate-in slide-in-from-top-4 duration-800">
            <Sparkles className="mr-2 h-4 w-4" />
            Professional SEO & Marketing Tools
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 animate-in slide-in-from-bottom-4 duration-800 delay-200 text-balance">
            Supercharge Your
            <span className="text-primary block">Digital Presence</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-in slide-in-from-bottom-4 duration-800 delay-400 text-pretty">
            Comprehensive suite of professional tools for SEO audits, market analysis, brand development, and content
            strategy. Everything you need to dominate your digital landscape.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in slide-in-from-bottom-4 duration-800 delay-600">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
              onClick={() => navigateToPage("/seo-audit")}
            >
              Start Free Audit
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-3 text-lg hover:bg-primary/5 hover:shadow-lg transition-all duration-300 bg-transparent text-foreground hover:text-foreground border-2 border-solid"
              style={{ borderColor: "#8B5CF6" }}
              onClick={scrollToTools}
            >
              View All Tools
            </Button>
          </div>
        </div>

        {/* Feature Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            { icon: Globe, label: "Websites Analyzed", value: "10,000+", color: "text-blue-600" },
            { icon: TrendingUp, label: "Performance Boost", value: "85%", color: "text-green-600" },
            { icon: Users, label: "Happy Clients", value: "2,500+", color: "text-[#8B5CF6]" },
          ].map((stat, index) => (
            <Card
              key={stat.label}
              className="text-center p-6 hover:shadow-lg transition-all duration-300 animate-in zoom-in-95 duration-600"
              style={{ animationDelay: `${800 + index * 200}ms` }}
            >
              <stat.icon className={`h-12 w-12 ${stat.color} mx-auto mb-4`} />
              <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* Tools Showcase */}
      <section
        ref={toolsSectionRef}
        className={`bg-muted/30 py-20 transition-all duration-800 ease-out ${
          visibleSections.tools ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        }`}
        id="tools-section"
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Powerful Tools for Every Need</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional-grade tools designed to elevate your digital strategy and drive measurable results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: "SEO Audit Tool",
                description:
                  "Comprehensive website analysis with performance metrics, SEO insights, and actionable recommendations",
                features: ["Core Web Vitals", "Technical SEO", "Performance Analysis", "Priority Fixes"],
                color: "bg-blue-500",
                path: "/seo-audit",
                delay: 0,
              },
              {
                icon: BarChart3,
                title: "Market Analysis",
                description: "Deep market insights and competitive analysis to inform your strategic decisions",
                features: ["Market Research", "Competitor Analysis", "Trend Identification", "Strategic Insights"],
                color: "bg-green-500",
                path: "/market-analysis",
                delay: 200,
              },
              {
                icon: Palette,
                title: "Brandbook Generator",
                description: "Create comprehensive brand guidelines from your business idea and vision",
                features: ["Brand Identity", "Visual Guidelines", "Messaging Framework", "Content Strategy"],
                color: "bg-[#8B5CF6]",
                path: "/brandbook",
                delay: 400,
              },
              {
                icon: Sparkles,
                title: "Content Ideas Generator",
                description: "Generate comprehensive content strategies and ideas tailored to your brand and audience",
                features: ["Content Strategy", "Brand Foundation", "Style Guidelines", "Research Insights"],
                color: "bg-orange-500",
                path: "/content-ideas",
                delay: 600,
              },
              {
                icon: Layout,
                title: "Landing Page Generator",
                description: "Create high-converting landing pages with complete strategy, wireframes, and code",
                features: ["Page Strategy", "Wireframe Design", "Copy Generation", "A/B Testing"],
                color: "bg-indigo-500",
                path: "/landing-page-generator",
                delay: 800,
              },
              {
                icon: Linkedin,
                title: "LinkedIn Post Generator",
                description: "Generate engaging LinkedIn posts with AI-powered content and custom images",
                features: ["AI Content", "Custom Images", "Brand Aligned", "Audience Targeted"],
                color: "bg-blue-600",
                path: "/linkedin-post-generator",
                delay: 1000,
              },
            ].map((tool, index) => (
              <Card
                key={tool.title}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-in slide-in-from-bottom-4 duration-600"
                style={{ animationDelay: `${tool.delay}ms` }}
              >
                <CardHeader className="pb-4">
                  <div
                    className={`w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <tool.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-2">{tool.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {tool.features.map((feature, i) => (
                      <li key={feature} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full text-white hover:shadow-lg transition-all duration-300"
                    style={{ backgroundColor: "#8B5CF6" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#7C3AED"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#8B5CF6"
                    }}
                    onClick={() => navigateToPage(tool.path)}
                  >
                    Try {tool.title}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section
        ref={benefitsSectionRef}
        className={`py-20 transition-all duration-800 ease-out ${
          visibleSections.benefits ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        }`}
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose Ooumph Tools?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built by experts, trusted by professionals, designed for results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Get comprehensive results in minutes, not hours",
              },
              {
                icon: Shield,
                title: "Enterprise Grade",
                description: "Professional-quality analysis you can trust",
              },
              {
                icon: Target,
                title: "Actionable Insights",
                description: "Clear recommendations with measurable impact",
              },
              {
                icon: TrendingUp,
                title: "Proven Results",
                description: "Tools that drive real business growth",
              },
            ].map((benefit, index) => (
              <div
                key={benefit.title}
                className="text-center animate-in slide-in-from-bottom-4 duration-600"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        ref={testimonialsSectionRef}
        className={`bg-muted/30 py-20 transition-all duration-800 ease-out ${
          visibleSections.testimonials ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        }`}
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Trusted by Professionals</h2>
            <p className="text-xl text-muted-foreground">See what our users are saying</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Digital Marketing Manager",
                company: "TechStart Inc.",
                content:
                  "The SEO audit tool identified critical issues we missed. Our organic traffic increased by 150% in just 3 months.",
                rating: 5,
              },
              {
                name: "Marcus Rodriguez",
                role: "Brand Strategist",
                company: "Creative Agency",
                content:
                  "The brandbook generator saved us weeks of work. It created comprehensive guidelines that perfectly captured our client's vision.",
                rating: 5,
              },
              {
                name: "Emily Watson",
                role: "Business Analyst",
                company: "Growth Partners",
                content:
                  "Market analysis tool provides insights that would cost thousands from consulting firms. Absolutely game-changing.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card
                key={testimonial.name}
                className="p-6 hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom-4 duration-600"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        ref={ctaSectionRef}
        className={`py-20 transition-all duration-800 ease-out ${
          visibleSections.cta ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        }`}
      >
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-4">Ready to Transform Your Digital Strategy?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who trust Ooumph Tools to drive their success
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                onClick={() => navigateToPage("/seo-audit")}
              >
                Start Your Free Audit
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-3 text-lg border-2 hover:bg-primary/5 hover:shadow-lg transition-all duration-300 bg-transparent text-foreground hover:text-foreground"
                style={{ borderColor: "#8B5CF6" }}
                onClick={scrollToTools}
              >
                Explore All Tools
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">Ooumph Tools</h3>
            <p className="text-muted-foreground mb-6">Professional SEO & Marketing Tools Suite</p>
            <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
              <span>© 2024 Ooumph Tools</span>
              <span>•</span>
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
              <span>•</span>
              <span>Support</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
