import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import { WorkflowProvider } from "@/lib/workflow-context"
import "./globals.css"
import { Suspense } from "react"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Ooumph Tools - AI-Powered Marketing Suite",
  description: "Professional AI tools for SEO, marketing analysis, and content generation",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${inter.variable} tracking-tighter`} suppressHydrationWarning>
        <AuthProvider>
          <WorkflowProvider>
            <Suspense fallback={null}>{children}</Suspense>
            <Analytics />
          </WorkflowProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
