"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/lib/auth-context"
import { SignInModal } from "@/components/auth/sign-in-modal"
import { SignUpModal } from "@/components/auth/sign-up-modal"
import { UserButton } from "@/components/auth/user-button"
import { ChevronDown } from "lucide-react"

interface SharedNavbarProps {
  currentPage: string
}

export default function SharedNavbar({ currentPage }: SharedNavbarProps) {
  const [mounted, setMounted] = useState(false)
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false)
  const toolsDropdownRef = useRef<HTMLDivElement>(null)
  const { user, loading } = useAuth()

  useEffect(() => {
    setMounted(true)

    const handleClickOutside = (event: MouseEvent) => {
      if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(event.target as Node)) {
        setIsToolsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const navigateToPage = (path: string) => {
    window.location.href = path
  }

  const toggleToolsDropdown = () => {
    setIsToolsDropdownOpen(!isToolsDropdownOpen)
  }

  if (!mounted) {
    return null
  }

  return (
    <nav className="sticky top-4 z-50 mb-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="backdrop-blur-md bg-card/80 border border-border rounded-lg px-6 py-3 shadow-lg animate-in slide-in-from-top-4 duration-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <h1 className="text-xl font-bold text-foreground animate-in fade-in duration-1000">Ooumph Tools</h1>

              <div className="relative" ref={toolsDropdownRef}>
                <button
                  onClick={toggleToolsDropdown}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors duration-200 bg-transparent border-none cursor-pointer"
                >
                  <span>{currentPage}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${isToolsDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isToolsDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-border rounded-md shadow-lg z-50 animate-in slide-in-from-top-2 duration-200">
                    <button
                      onClick={() => {
                        navigateToPage("/")
                        setIsToolsDropdownOpen(false)
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-primary/10 hover:text-primary transition-colors duration-150 cursor-pointer border-none bg-transparent ${
                        currentPage === "Home" ? "bg-primary/10 text-primary" : ""
                      }`}
                    >
                      Home
                    </button>
                    <button
                      onClick={() => {
                        navigateToPage("/seo-audit")
                        setIsToolsDropdownOpen(false)
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-primary/10 hover:text-primary transition-colors duration-150 cursor-pointer border-none bg-transparent ${
                        currentPage === "SEO Audit Tool" ? "bg-primary/10 text-primary" : ""
                      }`}
                    >
                      SEO Audit Tool
                    </button>
                    <button
                      onClick={() => {
                        navigateToPage("/market-analysis")
                        setIsToolsDropdownOpen(false)
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-primary/10 hover:text-primary transition-colors duration-150 cursor-pointer border-none bg-transparent ${
                        currentPage === "Market Analysis" ? "bg-primary/10 text-primary" : ""
                      }`}
                    >
                      Market Analysis
                    </button>
                    <button
                      onClick={() => {
                        navigateToPage("/brandbook")
                        setIsToolsDropdownOpen(false)
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-primary/10 hover:text-primary transition-colors duration-150 cursor-pointer border-none bg-transparent ${
                        currentPage === "Brandbook Generator" ? "bg-primary/10 text-primary" : ""
                      }`}
                    >
                      Brandbook Generator
                    </button>
                    <button
                      onClick={() => {
                        navigateToPage("/content-ideas")
                        setIsToolsDropdownOpen(false)
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-primary/10 hover:text-primary transition-colors duration-150 cursor-pointer border-none bg-transparent ${
                        currentPage === "Content Ideas Generator" ? "bg-primary/10 text-primary" : ""
                      }`}
                    >
                      Content Ideas Generator
                    </button>
                    <button
                      onClick={() => {
                        navigateToPage("/landing-page-generator")
                        setIsToolsDropdownOpen(false)
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-primary/10 hover:text-primary transition-colors duration-150 cursor-pointer border-none bg-transparent ${
                        currentPage === "Landing Page Generator" ? "bg-primary/10 text-primary" : ""
                      }`}
                    >
                      Landing Page Generator
                    </button>
                    <button
                      onClick={() => {
                        navigateToPage("/linkedin-post-generator")
                        setIsToolsDropdownOpen(false)
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-primary/10 hover:text-primary transition-colors duration-150 cursor-pointer border-none bg-transparent ${
                        currentPage === "LinkedIn Post Generator" ? "bg-primary/10 text-primary" : ""
                      }`}
                    >
                      LinkedIn Post Generator
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {!loading && (
                <>
                  {!user ? (
                    <div className="flex items-center space-x-2">
                      <SignInModal />
                      <SignUpModal />
                    </div>
                  ) : (
                    <UserButton />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
