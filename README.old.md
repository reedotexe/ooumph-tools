# Ooumph Tools - AI-Powered Marketing Suite

## Overview

Ooumph Tools is a comprehensive AI-powered marketing and SEO SaaS platform that provides professional-grade tools for website analysis, market research, brand development, content strategy, landing page creation, and social media management. Built with Next.js 15, React 19, TypeScript, and Tailwind CSS v4, the platform offers an intuitive interface with powerful AI-driven insights through seamless n8n workflow integration.

## Table of Contents

- [Features](#features)
- [Tools](#tools)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Authentication](#authentication)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Usage](#usage)
- [API Integration](#api-integration)
- [Design System](#design-system)
- [Project Structure](#project-structure)

## Features

### Core Capabilities

- **SEO Audit Tool** - Comprehensive website analysis with performance metrics and actionable recommendations
- **Market Analysis** - Deep market insights and competitive analysis
- **Brandbook Generator** - Create comprehensive brand guidelines from business ideas
- **Content Ideas Generator** - AI-powered content strategy and ideation
- **Landing Page Generator** - Complete landing page creation with strategy, wireframes, and code
- **LinkedIn Post Generator** - AI-generated LinkedIn posts with custom images

### Platform Features

- **User Authentication** - Secure authentication powered by Clerk
- **Responsive Design** - Mobile-first design that works on all devices
- **Real-time Analysis** - Live data processing and instant results
- **Modern UI/UX** - Clean, professional interface with smooth animations
- **Dark Mode Support** - Built-in dark mode theming
- **Analytics Integration** - Vercel Analytics for usage tracking

## Tools

### 1. SEO Audit Tool (`/seo-audit`)

**Purpose**: Analyze websites for SEO performance, technical issues, and optimization opportunities.

**Features**:
- Core Web Vitals analysis (FCP, LCP, TBT, CLS, Speed Index, TTI)
- Performance score (0-100 rating)
- Robots.txt validation and sitemap detection
- Mobile-friendliness assessment
- Technical SEO assessment with detailed metrics
- Priority fix recommendations with impact levels
- Performance highlights and issue identification
- Detailed appendix with network payload analysis
- Export functionality (downloadable text reports)
- 10-minute timeout with 3 automatic retry attempts

**Input**: Website URL (validated with URL format check)

**Output**: Comprehensive JSON audit report including:
- Site information (platform, device, audit date)
- Performance metrics and scores
- SEO status indicators
- Performance findings (highlights and issues)
- Priority fixes with actionable recommendations
- Technical details (requests, payload sizes, server response times)

**Webhook**: `https://n8n.ooumph.com/webhook/seo`

**Technical Implementation**:
- AbortController for timeout management
- Network error retry logic with exponential backoff
- Skeleton loading states during processing
- Animated result display with staggered reveals
- Color-coded badges for priorities and scores

### 2. Market Analysis (`/market-analysis`)

**Purpose**: Provide comprehensive market insights and competitive analysis for strategic decision-making.

**Features**:
- Industry and product category analysis
- Target audience identification
- Geographic focus assessment
- Key market trends summary with categories and insights
- Opportunity identification with related trends
- Strategic recommendations with urgency levels
- Best idea extraction from trend analysis
- Detailed persona development with demographics, behaviors, and needs
- Brand positioning framework (UVP, positioning statement, brand promise)
- Visual data presentation with animated cards
- Export functionality for reports

**Input**: 
- Business idea description (minimum 10 characters)
- Target market information
- Industry context

**Output**: Comprehensive JSON analysis including:
- Market overview (industry, product category, audience, geographic focus)
- Trend analysis with opportunities
- Strategic recommendations
- Customer personas with demographics (age, income, education, location, family status)
- Brand positioning framework

**Webhook**: `https://n8n.ooumph.com/webhook/marketanalyzer`

**Technical Implementation**:
- 10-minute processing timeout
- 3 automatic retry attempts for network failures
- Skeleton loaders during analysis
- Color-coded urgency indicators
- Responsive grid layouts for persona display

### 3. Brandbook Generator (`/brandbook`)

**Purpose**: Create comprehensive brand identity guidelines from business ideas and vision.

**Features**:
- Complete messaging framework development
- Visual identity design system
- Brand guidelines documentation
- Content strategy planning
- Campaign planning with timelines
- Color palette generation with hex codes and rationales
- Typography recommendations with Google Fonts links
- Style motifs and mood board prompts
- Export functionality for complete brandbook documents
- Tabbed navigation for organized content sections

**Input**: 
- Business idea description (minimum 50 characters required)
- Brand vision and values
- Target audience information

**Output**: Comprehensive JSON brandbook including:

1. **Messaging Framework**:
   - Voice and tone guidelines
   - Messaging pillars (core communication themes)
   - Multiple tagline options

2. **Visual Identity**:
   - Primary, secondary, and accent colors with hex codes
   - Color rationale and usage guidelines
   - Heading and body font recommendations
   - Google Fonts URLs for implementation
   - Style motifs and design patterns
   - Mood board prompts for visual direction

3. **Brand Guidelines**:
   - Complete brand standards document
   - Logo usage guidelines
   - Do's and don'ts

4. **Content Strategy**:
   - Content pillars with descriptions
   - Monthly themes with focus areas
   - Campaign ideas with detailed descriptions
   - Blog topic suggestions
   - Social media content topics

5. **Campaign Planner**:
   - Campaign objectives
   - Timeline with weekly milestones
   - Channel strategies and tactics
   - Deliverables with due dates and ownership
   - Key Performance Indicators (KPIs)

**Webhook**: `https://n8n.ooumph.com/webhook/brandbook`

**Technical Implementation**:
- 10-minute timeout for complex brand generation
- JSON parsing for structured visual identity data
- Tabbed interface for section navigation
- Copy-to-clipboard functionality for all sections
- Full brandbook export as formatted text document
- Active section highlighting in navigation
- Scroll-based section visibility

### 4. Content Ideas Generator (`/content-ideas`)

**Purpose**: Generate comprehensive content strategies and ideas tailored to brand and audience.

**Features**:
- Complete brand foundation framework
- Content strategy development
- Style guide creation
- Topic research and trend analysis
- Content drafting with outlines
- Advertisement variant generation
- Multi-tab organized interface
- Copy-to-clipboard for all content sections

**Input**:
- Brand name
- Business description
- Target audience
- Niche/industry
- Platform preferences
- Content goals

**Output**: Comprehensive JSON content package including:

1. **Brand Foundation** (`content writer output`):
   - Mission statement
   - Vision statement
   - Target audience definition
   - Messaging pillars (key themes)

2. **Content Strategy** (`conten strategy`):
   - Content pillars with descriptions
   - Monthly themes with focus areas
   - Campaign ideas with detailed descriptions
   - Blog topic suggestions (title, pillar, summary)
   - Social media content ideas (platforms, format, description)

3. **Style Guide** (`style guide`):
   - Brand voice definition
   - Persona characteristics
   - Tone guidelines
   - Language preferences
   - Content do's and don'ts
   - Example phrases for consistency

4. **Topic Research** (`Topic Research`):
   - Best summary of key trends (title, category, insight)
   - Top search queries relevant to niche
   - Suggested keywords for SEO
   - Content ideas with format and angle recommendations

5. **Content Drafting** (`Content Drafting`):
   - Ready-to-use content titles
   - Detailed outlines
   - Full content drafts
   - Niche-specific writing

6. **Advertisement Variants** (`Ad`):
   - Multiple ad variants
   - Hook lines for attention
   - Value propositions
   - Call-to-action (CTA) suggestions
   - Image prompts for visual creation

**Webhook**: `https://n8n.ooumph.com/webhook/content-ideas`

**Technical Implementation**:
- Tabbed interface with 6 organized sections
- Color-coded cards for different content types
- Copy buttons on every content element
- Responsive grid layouts
- Animated content reveals
- Error handling with user-friendly messages

### 5. Landing Page Generator (`/landing-page-generator`)

**Purpose**: Create high-converting landing pages with complete strategy, design, and implementation.

**Features**:
- Comprehensive page strategy development
- Interactive Mermaid.js wireframe diagrams
- Professional copywriting generation
- Web design recommendations
- HTML/CSS code generation
- A/B testing suggestions
- Multi-device preview (desktop, tablet, mobile)
- Section-by-section content breakdown
- Export and copy functionality

**Input**:
- Goal/objective of the landing page
- Target audience description
- Offer/product details
- Brand voice and tone
- Design constraints
- Industry context
- Competitor information (optional)

**Output**: Complete landing page package including:

1. **Page Strategy** (`page strategy`):
   - Layout structure recommendations
   - Section-by-section breakdown:
     - Hero section (headline, subheadline, CTA, visual)
     - Feature sections with benefits
     - Testimonials and social proof
     - Contact/signup forms
     - Footer elements
   - A/B testing variants and strategies
   - Primary and secondary CTA recommendations
   - Risk mitigation strategies

2. **Mermaid Wireframe** (`mermaid wireframe`):
   - Interactive flowchart visualization
   - Page structure diagram
   - Section relationships
   - User flow mapping
   - Rendered as SVG with sanitization

3. **Copywriting Content** (`copywriting content`):
   - Section-specific copy (headline, subhead, body, CTA)
   - Unique section IDs for implementation
   - Optimized messaging for conversions
   - Primary and secondary CTA copy

4. **Web Design Plan** (`Web Designing plan`):
   - Visual design recommendations
   - Color scheme suggestions
   - Typography guidelines
   - Layout specifications
   - Responsive design considerations

5. **Implementation Code** (`code`):
   - Ready-to-use HTML/CSS code
   - Responsive design implementation
   - Copy-to-clipboard functionality
   - Production-ready markup

6. **Live URL** (`url` - optional):
   - Deployed page URL if available

**Webhook**: `https://n8n.ooumph.com/webhook/landing-page-generator`

**Technical Implementation**:
- Mermaid.js initialization and rendering
- Character sanitization for diagram parsing
- Multi-device preview toggle (desktop/tablet/mobile)
- Tabbed interface for organized content
- Copy buttons for all sections
- Error handling for diagram rendering
- Responsive layout adaptation

### 6. LinkedIn Post Generator (`/linkedin-post-generator`)

**Purpose**: Generate engaging LinkedIn posts with AI-powered content and custom images.

**Features**:
- AI-generated professional LinkedIn post copy
- Custom image generation with URLs
- Brand-aligned messaging
- Audience-targeted content
- Platform-specific optimization
- Copy-to-clipboard functionality
- Dual-tab interface (post content and image)
- Real-time generation status

**Input**:
- Brand Name (required)
- Business Description (required)
- Target Audience (required)
- Platform Preferences (optional - e.g., "Instagram, LinkedIn")
- Monetization Approach (optional - e.g., "Selling AI and Robotics Kit")
- Additional Information & Preferences (optional)

**Request Format**:
```json
[{
  "Brand Name": "string",
  "Platfrom Prefrences": "string",
  "Monetization Approach": "string",
  "Target Audience": "string",
  "Aditional Information & Preferences": "string",
  "Buisness Description": "string"
}]
```

**Output**: LinkedIn content package including:

1. **LinkedIn Post** (`Linkedin Post`):
   - Professional post copy
   - Optimized for LinkedIn's algorithm
   - Engaging hooks and CTAs
   - Formatted for readability
   - Copy-to-clipboard enabled

2. **Generated Image** (`Image Url`):
   - AI-generated custom image URL
   - Brand-aligned visuals
   - Professional quality
   - Direct URL for downloading
   - Image preview in interface
   - Copy URL functionality

**Webhook**: `https://n8n.ooumph.com/webhook/linkedin-post`

**Technical Implementation**:
- Form validation (required fields)
- Array-based request payload
- JSON response parsing
- Tabbed interface for content organization
- Image loading with error handling
- Placeholder display for failed image loads
- Copy status indicators (checkmark feedback)
- Responsive layout for mobile devices

## Technology Stack

### Frontend
- **Framework**: Next.js 15.5.6 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4.1.9 with PostCSS
- **UI Components**: shadcn/ui (41+ components based on Radix UI primitives)
- **Icons**: Lucide React (v0.454.0)
- **Fonts**: Inter font family via next/font with variable font optimization
- **State Management**: React 19 hooks (useState, useEffect, useRef)
- **Form Management**: React Hook Form with Zod validation
- **Animations**: Custom CSS utilities with tw-animate-css
- **Charts**: Recharts v2.15.4
- **Diagrams**: Mermaid.js for wireframe visualization

### Backend
- **Runtime**: Next.js API Routes
- **Webhook Integration**: n8n workflows hosted at n8n.ooumph.com
- **External APIs**: Custom webhook endpoints for each tool

### Authentication
- **Provider**: Clerk (v6.34.5)
- **Features**: Sign in/sign up modals, user management, session handling

### Analytics
- **Provider**: Vercel Analytics
- **Tracking**: Page views, user interactions

### Deployment
- **Platform**: Vercel-ready
- **Package Manager**: npm/pnpm support
- **Environment**: Production and preview environments

## Architecture

### Application Structure

\`\`\`
app/
├── page.tsx                          # Homepage/landing page
├── layout.tsx                        # Root layout with Clerk provider
├── globals.css                       # Global styles and design tokens
├── loading.tsx                       # Global loading state
├── seo-audit/
│   ├── page.tsx                      # SEO audit tool
│   └── loading.tsx                   # Loading state
├── market-analysis/
│   └── page.tsx                      # Market analysis tool
├── brandbook/
│   └── page.tsx                      # Brandbook generator
├── content-ideas/
│   └── page.tsx                      # Content ideas generator
├── landing-page-generator/
│   └── page.tsx                      # Landing page generator
└── linkedin-post-generator/
    └── page.tsx                      # LinkedIn post generator
\`\`\`

### Component Architecture

\`\`\`
components/
├── shared-navbar.tsx                 # Shared navigation component
└── ui/                               # shadcn/ui components
    ├── button.tsx
    ├── card.tsx
    ├── input.tsx
    ├── label.tsx
    ├── tabs.tsx
    ├── textarea.tsx
    └── ... (other UI components)
\`\`\`

### Data Flow

1. **User Input** → Form submission on tool page
2. **Client Processing** → Data validation and formatting
3. **API Request** → POST to n8n webhook endpoint
4. **AI Processing** → n8n workflow processes request with AI
5. **Response** → JSON data returned to client
6. **Display** → Results rendered in UI with formatting

## Authentication

### Clerk Integration

The platform uses Clerk for user authentication with the following features:

- **Sign In/Sign Up**: Modal-based authentication flow
- **User Management**: Profile management via UserButton
- **Session Management**: Automatic session handling
- **Protected Routes**: Middleware-based route protection (optional)

### Configuration

\`\`\`typescript
// Environment variables required
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
\`\`\`

### Implementation

\`\`\`typescript
// Layout.tsx
<ClerkProvider publishableKey={publishableKey}>
  {children}
</ClerkProvider>

// Navbar component
<SignedOut>
  <SignInButton mode="modal">Sign In</SignInButton>
  <SignUpButton mode="modal">Sign Up</SignUpButton>
</SignedOut>
<SignedIn>
  <UserButton />
</SignedIn>
\`\`\`

## Environment Variables

### Required Variables

\`\`\`bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Webhook Integration
WEBHOOK_URL=https://n8n.ooumph.com/webhook/...
NEXT_PUBLIC_WEBHOOK_URL=https://n8n.ooumph.com/webhook/...
\`\`\`

### Webhook Endpoints

Each tool uses a specific webhook endpoint:

- SEO Audit: `https://n8n.ooumph.com/webhook/seo-audit`
- Market Analysis: `https://n8n.ooumph.com/webhook/market-analysis`
- Brandbook: `https://n8n.ooumph.com/webhook/brandbook`
- Content Ideas: `https://n8n.ooumph.com/webhook/content-ideas`
- Landing Page: `https://n8n.ooumph.com/webhook/landing-page-generator`
- LinkedIn Post: `https://n8n.ooumph.com/webhook/linkedin-post-generator`

## Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Clerk account (for authentication)
- n8n instance (for webhook processing)

### Setup Steps

1. **Clone the repository**
\`\`\`bash
git clone <repository-url>
cd seo-audit-saas
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
\`\`\`

3. **Configure environment variables**
\`\`\`bash
cp .env.example .env.local
# Edit .env.local with your credentials
\`\`\`

4. **Run development server**
\`\`\`bash
npm run dev
\`\`\`

5. **Open browser**
\`\`\`
http://localhost:3000
\`\`\`

## Usage

### Running the Application

\`\`\`bash
# Development mode
npm run dev

# Production build
npm run build
npm start

# Linting
npm run lint
\`\`\`

### Using the Tools

1. **Navigate to a tool** - Click on any tool from the homepage or use the navigation dropdown
2. **Fill in the form** - Provide required information (URL, business description, etc.)
3. **Submit** - Click the analyze/generate button
4. **Wait for results** - Processing typically takes 30-60 seconds
5. **Review output** - Results are displayed in organized sections with tabs
6. **Copy/Export** - Use copy buttons to save content

## API Integration

### Webhook Request Format

All tools send POST requests to n8n webhooks with JSON payloads:

\`\`\`typescript
// Example: SEO Audit
const response = await fetch(webhookUrl, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    url: websiteUrl,
    // Additional parameters
  }),
})
\`\`\`

### Response Format

Responses are JSON objects with tool-specific structures:

\`\`\`typescript
// Example: LinkedIn Post Generator
{
  "Linkedin Post": "Post content...",
  "Image Url": "https://...",
}
\`\`\`

### Error Handling

- Network errors are caught and displayed to users
- Timeout handling for long-running requests
- Retry logic for failed requests
- User-friendly error messages

## Design System

### Color Palette

The platform uses a modern, professional color scheme:

- **Primary**: Purple (#8B5CF6) - Main brand color
- **Secondary**: Blue, Green, Orange - Tool-specific accents
- **Neutrals**: White, grays, black variants
- **Semantic**: Success (green), Error (red), Warning (yellow)

### Typography

- **Font Family**: Inter (sans-serif)
- **Headings**: Bold, large sizes (text-4xl to text-6xl)
- **Body**: Regular weight, comfortable line-height (leading-relaxed)
- **Scale**: Consistent sizing using Tailwind classes

### Layout Principles

1. **Mobile-First**: Responsive design starting from mobile
2. **Flexbox Priority**: Use flex for most layouts
3. **Grid for Complex**: CSS Grid for 2D layouts
4. **Consistent Spacing**: Tailwind spacing scale (p-4, gap-6, etc.)
5. **Card-Based**: Content organized in cards for clarity

### Animation System

Custom animation delay utilities for staggered animations:

\`\`\`css
@utility delay-100 { animation-delay: 100ms; }
@utility delay-200 { animation-delay: 200ms; }
/* ... up to delay-1800 */
\`\`\`

Usage:
\`\`\`tsx
<div className="animate-in slide-in-from-bottom-4 duration-600 delay-200">
  Content
</div>
\`\`\`

## Project Structure

### Key Files

- **`app/layout.tsx`** - Root layout with Clerk provider and global styles
- **`app/page.tsx`** - Homepage with hero, tools showcase, testimonials
- **`app/globals.css`** - Design tokens, custom utilities, Tailwind config
- **`components/shared-navbar.tsx`** - Shared navigation across all pages
- **`middleware.ts`** - Route protection and authentication middleware

### Tool Pages Pattern

Each tool follows a consistent pattern:

\`\`\`typescript
"use client"
import { useState } from "react"
import SharedNavbar from "@/components/shared-navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ToolPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  
  const handleSubmit = async () => {
    setLoading(true)
    // API call to webhook
    setLoading(false)
  }
  
  return (
    <div>
      <SharedNavbar currentPage="Tool Name" />
      {/* Form */}
      {/* Results */}
    </div>
  )
}
\`\`\`

### UI Components

The platform uses shadcn/ui components:

- **Button** - Primary actions, variants (outline, ghost)
- **Card** - Content containers with header/content sections
- **Input/Textarea** - Form inputs with labels
- **Tabs** - Organized result display
- **Alert** - Status messages and notifications
- **Skeleton** - Loading states
- **Progress** - Loading indicators

## Performance Optimizations

- **Code Splitting** - Automatic with Next.js App Router
- **Image Optimization** - Next.js Image component
- **Font Optimization** - Next.js font loading
- **CSS Optimization** - Tailwind CSS purging
- **Analytics** - Lightweight Vercel Analytics
- **Lazy Loading** - Components loaded on demand

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

### Development Workflow

1. Create feature branch
2. Make changes
3. Test locally
4. Submit pull request
5. Code review
6. Merge to main

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Consistent naming conventions

## License

Proprietary - All rights reserved

## Support

For issues or questions:
- Email: support@ooumph.com
- Documentation: [Link to docs]
- GitHub Issues: [Link to repo]

## Changelog

### Version 1.0.0 (Current)

- Initial release
- 6 professional tools
- Clerk authentication
- Responsive design
- Dark mode support
- Analytics integration

---

**Built with ❤️ by the Ooumph Team**
