# Ooumph Tools - AI-Powered Marketing Suite# Ooumph Tools - AI-Powered Marketing Suite



## Overview## Overview



Ooumph Tools is a comprehensive AI-powered marketing and SEO SaaS platform that provides professional-grade tools for website analysis, market research, brand development, content strategy, landing page creation, and social media management. Built with Next.js 15, React 19, TypeScript, and Tailwind CSS v4, the platform offers an intuitive interface with powerful AI-driven insights through seamless n8n workflow integration.Ooumph Tools is a comprehensive AI-powered marketing and SEO SaaS platform that provides professional-grade tools for website analysis, market research, brand development, content strategy, landing page creation, and social media management. Built with Next.js 15, React 19, TypeScript, and Tailwind CSS v4, the platform offers an intuitive interface with powerful AI-driven insights through seamless n8n workflow integration.



## Table of Contents## Table of Contents



- [Features](#features)- [Features](#features)

- [Tools](#tools)- [Tools](#tools)

- [Technology Stack](#technology-stack)- [Technology Stack](#technology-stack)

- [Architecture](#architecture)- [Architecture](#architecture)

- [Installation](#installation)- [Authentication](#authentication)

- [Environment Variables](#environment-variables)- [Environment Variables](#environment-variables)

- [Usage](#usage)- [Installation](#installation)

- [Design System](#design-system)- [Usage](#usage)

- [API Integration](#api-integration)- [API Integration](#api-integration)

- [Authentication](#authentication)- [Design System](#design-system)

- [Performance](#performance)- [Project Structure](#project-structure)

- [Contributing](#contributing)

## Features

## Features

### Core Capabilities

### Core Capabilities

- **SEO Audit Tool** - Comprehensive website analysis with performance metrics and actionable recommendations

- **SEO Audit Tool** - Comprehensive website analysis with Core Web Vitals and actionable recommendations- **Market Analysis** - Deep market insights and competitive analysis

- **Market Analysis** - Deep market insights, trend analysis, and customer persona development- **Brandbook Generator** - Create comprehensive brand guidelines from business ideas

- **Brandbook Generator** - Complete brand identity system with visual guidelines and messaging framework- **Content Ideas Generator** - AI-powered content strategy and ideation

- **Content Ideas Generator** - AI-powered content strategy with style guides and topic research- **Landing Page Generator** - Complete landing page creation with strategy, wireframes, and code

- **Landing Page Generator** - Full landing page creation with strategy, Mermaid wireframes, and code- **LinkedIn Post Generator** - AI-generated LinkedIn posts with custom images

- **LinkedIn Post Generator** - AI-generated LinkedIn posts with custom image generation

### Platform Features

### Platform Features

- **User Authentication** - Secure authentication powered by Clerk

- **User Authentication** - Secure authentication powered by Clerk with modal sign-in- **Responsive Design** - Mobile-first design that works on all devices

- **Responsive Design** - Mobile-first design that works flawlessly on all devices- **Real-time Analysis** - Live data processing and instant results

- **Real-time Analysis** - Live data processing with instant AI-powered results- **Modern UI/UX** - Clean, professional interface with smooth animations

- **Modern UI/UX** - Clean, professional interface with smooth animations and transitions- **Dark Mode Support** - Built-in dark mode theming

- **Dark Mode Support** - Built-in dark mode theming with OKLCH color space- **Analytics Integration** - Vercel Analytics for usage tracking

- **Analytics Integration** - Vercel Analytics for comprehensive usage tracking

- **Export Functionality** - Download reports and copy content to clipboard## Tools

- **Error Handling** - Robust retry logic and user-friendly error messages

### 1. SEO Audit Tool (`/seo-audit`)

## Tools

**Purpose**: Analyze websites for SEO performance, technical issues, and optimization opportunities.

### 1. SEO Audit Tool (`/seo-audit`)

**Features**:

**Purpose**: Analyze websites for SEO performance, technical issues, and optimization opportunities.- Core Web Vitals analysis (FCP, LCP, TBT, CLS, Speed Index, TTI)

- Performance score (0-100 rating)

**Features**:- Robots.txt validation and sitemap detection

- Core Web Vitals analysis (FCP, LCP, TBT, CLS, Speed Index, TTI)- Mobile-friendliness assessment

- Performance score (0-100 rating)- Technical SEO assessment with detailed metrics

- Robots.txt validation and sitemap detection- Priority fix recommendations with impact levels

- Mobile-friendliness assessment- Performance highlights and issue identification

- Technical SEO assessment with detailed metrics- Detailed appendix with network payload analysis

- Priority fix recommendations with impact levels- Export functionality (downloadable text reports)

- Performance highlights and issue identification- 10-minute timeout with 3 automatic retry attempts

- Detailed appendix with network payload analysis

- Export functionality (downloadable text reports)**Input**: Website URL (validated with URL format check)

- 10-minute timeout with 3 automatic retry attempts

**Output**: Comprehensive JSON audit report including:

**Input**: Website URL (validated with URL format check)- Site information (platform, device, audit date)

- Performance metrics and scores

**Output**: Comprehensive JSON audit report including:- SEO status indicators

- Site information (platform, device, audit date)- Performance findings (highlights and issues)

- Performance metrics and scores- Priority fixes with actionable recommendations

- SEO status indicators- Technical details (requests, payload sizes, server response times)

- Performance findings (highlights and issues)

- Priority fixes with actionable recommendations**Webhook**: `https://n8n.ooumph.com/webhook/seo`

- Technical details (requests, payload sizes, server response times)

**Technical Implementation**:

**Webhook**: `https://n8n.ooumph.com/webhook/seo`- AbortController for timeout management

- Network error retry logic with exponential backoff

**Technical Implementation**:- Skeleton loading states during processing

- AbortController for timeout management- Animated result display with staggered reveals

- Network error retry logic with exponential backoff- Color-coded badges for priorities and scores

- Skeleton loading states during processing

- Animated result display with staggered reveals### 2. Market Analysis (`/market-analysis`)

- Color-coded badges for priorities and scores

**Purpose**: Provide comprehensive market insights and competitive analysis for strategic decision-making.

---

**Features**:

### 2. Market Analysis (`/market-analysis`)- Industry and product category analysis

- Target audience identification

**Purpose**: Provide comprehensive market insights and competitive analysis for strategic decision-making.- Geographic focus assessment

- Key market trends summary with categories and insights

**Features**:- Opportunity identification with related trends

- Industry and product category analysis- Strategic recommendations with urgency levels

- Target audience identification- Best idea extraction from trend analysis

- Geographic focus assessment- Detailed persona development with demographics, behaviors, and needs

- Key market trends summary with categories and insights- Brand positioning framework (UVP, positioning statement, brand promise)

- Opportunity identification with related trends- Visual data presentation with animated cards

- Strategic recommendations with urgency levels- Export functionality for reports

- Best idea extraction from trend analysis

- Detailed persona development with demographics, behaviors, and needs**Input**: 

- Brand positioning framework (UVP, positioning statement, brand promise)- Business idea description (minimum 10 characters)

- Visual data presentation with animated cards- Target market information

- Export functionality for reports- Industry context



**Input**: **Output**: Comprehensive JSON analysis including:

- Business idea description (minimum 10 characters)- Market overview (industry, product category, audience, geographic focus)

- Target market information- Trend analysis with opportunities

- Industry context- Strategic recommendations

- Customer personas with demographics (age, income, education, location, family status)

**Output**: Comprehensive JSON analysis including:- Brand positioning framework

- Market overview (industry, product category, audience, geographic focus)

- Trend analysis with opportunities**Webhook**: `https://n8n.ooumph.com/webhook/marketanalyzer`

- Strategic recommendations

- Customer personas with demographics (age, income, education, location, family status)**Technical Implementation**:

- Brand positioning framework- 10-minute processing timeout

- 3 automatic retry attempts for network failures

**Webhook**: `https://n8n.ooumph.com/webhook/marketanalyzer`- Skeleton loaders during analysis

- Color-coded urgency indicators

**Technical Implementation**:- Responsive grid layouts for persona display

- 10-minute processing timeout

- 3 automatic retry attempts for network failures### 3. Brandbook Generator (`/brandbook`)

- Skeleton loaders during analysis

- Color-coded urgency indicators**Purpose**: Create comprehensive brand identity guidelines from business ideas and vision.

- Responsive grid layouts for persona display

**Features**:

---- Complete messaging framework development

- Visual identity design system

### 3. Brandbook Generator (`/brandbook`)- Brand guidelines documentation

- Content strategy planning

**Purpose**: Create comprehensive brand identity guidelines from business ideas and vision.- Campaign planning with timelines

- Color palette generation with hex codes and rationales

**Features**:- Typography recommendations with Google Fonts links

- Complete messaging framework development- Style motifs and mood board prompts

- Visual identity design system- Export functionality for complete brandbook documents

- Brand guidelines documentation- Tabbed navigation for organized content sections

- Content strategy planning

- Campaign planning with timelines**Input**: 

- Color palette generation with hex codes and rationales- Business idea description (minimum 50 characters required)

- Typography recommendations with Google Fonts links- Brand vision and values

- Style motifs and mood board prompts- Target audience information

- Export functionality for complete brandbook documents

- Tabbed navigation for organized content sections**Output**: Comprehensive JSON brandbook including:



**Input**: 1. **Messaging Framework**:

- Business idea description (minimum 50 characters required)   - Voice and tone guidelines

- Brand vision and values   - Messaging pillars (core communication themes)

- Target audience information   - Multiple tagline options



**Output**: Comprehensive JSON brandbook including:2. **Visual Identity**:

   - Primary, secondary, and accent colors with hex codes

1. **Messaging Framework**:   - Color rationale and usage guidelines

   - Voice and tone guidelines   - Heading and body font recommendations

   - Messaging pillars (core communication themes)   - Google Fonts URLs for implementation

   - Multiple tagline options   - Style motifs and design patterns

   - Mood board prompts for visual direction

2. **Visual Identity**:

   - Primary, secondary, and accent colors with hex codes3. **Brand Guidelines**:

   - Color rationale and usage guidelines   - Complete brand standards document

   - Heading and body font recommendations   - Logo usage guidelines

   - Google Fonts URLs for implementation   - Do's and don'ts

   - Style motifs and design patterns

   - Mood board prompts for visual direction4. **Content Strategy**:

   - Content pillars with descriptions

3. **Brand Guidelines**:   - Monthly themes with focus areas

   - Complete brand standards document   - Campaign ideas with detailed descriptions

   - Logo usage guidelines   - Blog topic suggestions

   - Do's and don'ts   - Social media content topics



4. **Content Strategy**:5. **Campaign Planner**:

   - Content pillars with descriptions   - Campaign objectives

   - Monthly themes with focus areas   - Timeline with weekly milestones

   - Campaign ideas with detailed descriptions   - Channel strategies and tactics

   - Blog topic suggestions   - Deliverables with due dates and ownership

   - Social media content topics   - Key Performance Indicators (KPIs)



5. **Campaign Planner**:**Webhook**: `https://n8n.ooumph.com/webhook/brandbook`

   - Campaign objectives

   - Timeline with weekly milestones**Technical Implementation**:

   - Channel strategies and tactics- 10-minute timeout for complex brand generation

   - Deliverables with due dates and ownership- JSON parsing for structured visual identity data

   - Key Performance Indicators (KPIs)- Tabbed interface for section navigation

- Copy-to-clipboard functionality for all sections

**Webhook**: `https://n8n.ooumph.com/webhook/brandbook`- Full brandbook export as formatted text document

- Active section highlighting in navigation

**Technical Implementation**:- Scroll-based section visibility

- 10-minute timeout for complex brand generation

- JSON parsing for structured visual identity data### 4. Content Ideas Generator (`/content-ideas`)

- Tabbed interface for section navigation

- Copy-to-clipboard functionality for all sections**Purpose**: Generate comprehensive content strategies and ideas tailored to brand and audience.

- Full brandbook export as formatted text document

- Active section highlighting in navigation**Features**:

- Scroll-based section visibility- Complete brand foundation framework

- Content strategy development

---- Style guide creation

- Topic research and trend analysis

### 4. Content Ideas Generator (`/content-ideas`)- Content drafting with outlines

- Advertisement variant generation

**Purpose**: Generate comprehensive content strategies and ideas tailored to brand and audience.- Multi-tab organized interface

- Copy-to-clipboard for all content sections

**Features**:

- Complete brand foundation framework**Input**:

- Content strategy development- Brand name

- Style guide creation- Business description

- Topic research and trend analysis- Target audience

- Content drafting with outlines- Niche/industry

- Advertisement variant generation- Platform preferences

- Multi-tab organized interface- Content goals

- Copy-to-clipboard for all content sections

**Output**: Comprehensive JSON content package including:

**Input**:

- Brand name1. **Brand Foundation** (`content writer output`):

- Business description   - Mission statement

- Target audience   - Vision statement

- Niche/industry   - Target audience definition

- Platform preferences   - Messaging pillars (key themes)

- Content goals

2. **Content Strategy** (`conten strategy`):

**Output**: Comprehensive JSON content package including:   - Content pillars with descriptions

   - Monthly themes with focus areas

1. **Brand Foundation** (`content writer output`):   - Campaign ideas with detailed descriptions

   - Mission statement   - Blog topic suggestions (title, pillar, summary)

   - Vision statement   - Social media content ideas (platforms, format, description)

   - Target audience definition

   - Messaging pillars (key themes)3. **Style Guide** (`style guide`):

   - Brand voice definition

2. **Content Strategy** (`conten strategy`):   - Persona characteristics

   - Content pillars with descriptions   - Tone guidelines

   - Monthly themes with focus areas   - Language preferences

   - Campaign ideas with detailed descriptions   - Content do's and don'ts

   - Blog topic suggestions (title, pillar, summary)   - Example phrases for consistency

   - Social media content ideas (platforms, format, description)

4. **Topic Research** (`Topic Research`):

3. **Style Guide** (`style guide`):   - Best summary of key trends (title, category, insight)

   - Brand voice definition   - Top search queries relevant to niche

   - Persona characteristics   - Suggested keywords for SEO

   - Tone guidelines   - Content ideas with format and angle recommendations

   - Language preferences

   - Content do's and don'ts5. **Content Drafting** (`Content Drafting`):

   - Example phrases for consistency   - Ready-to-use content titles

   - Detailed outlines

4. **Topic Research** (`Topic Research`):   - Full content drafts

   - Best summary of key trends (title, category, insight)   - Niche-specific writing

   - Top search queries relevant to niche

   - Suggested keywords for SEO6. **Advertisement Variants** (`Ad`):

   - Content ideas with format and angle recommendations   - Multiple ad variants

   - Hook lines for attention

5. **Content Drafting** (`Content Drafting`):   - Value propositions

   - Ready-to-use content titles   - Call-to-action (CTA) suggestions

   - Detailed outlines   - Image prompts for visual creation

   - Full content drafts

   - Niche-specific writing**Webhook**: `https://n8n.ooumph.com/webhook/content-ideas`



6. **Advertisement Variants** (`Ad`):**Technical Implementation**:

   - Multiple ad variants- Tabbed interface with 6 organized sections

   - Hook lines for attention- Color-coded cards for different content types

   - Value propositions- Copy buttons on every content element

   - Call-to-action (CTA) suggestions- Responsive grid layouts

   - Image prompts for visual creation- Animated content reveals

- Error handling with user-friendly messages

**Webhook**: `https://n8n.ooumph.com/webhook/content-ideas`

### 5. Landing Page Generator (`/landing-page-generator`)

**Technical Implementation**:

- Tabbed interface with 6 organized sections**Purpose**: Create high-converting landing pages with complete strategy, design, and implementation.

- Color-coded cards for different content types

- Copy buttons on every content element**Features**:

- Responsive grid layouts- Comprehensive page strategy development

- Animated content reveals- Interactive Mermaid.js wireframe diagrams

- Error handling with user-friendly messages- Professional copywriting generation

- Web design recommendations

---- HTML/CSS code generation

- A/B testing suggestions

### 5. Landing Page Generator (`/landing-page-generator`)- Multi-device preview (desktop, tablet, mobile)

- Section-by-section content breakdown

**Purpose**: Create high-converting landing pages with complete strategy, design, and implementation.- Export and copy functionality



**Features**:**Input**:

- Comprehensive page strategy development- Goal/objective of the landing page

- Interactive Mermaid.js wireframe diagrams- Target audience description

- Professional copywriting generation- Offer/product details

- Web design recommendations- Brand voice and tone

- HTML/CSS code generation- Design constraints

- A/B testing suggestions- Industry context

- Multi-device preview (desktop, tablet, mobile)- Competitor information (optional)

- Section-by-section content breakdown

- Export and copy functionality**Output**: Complete landing page package including:



**Input**:1. **Page Strategy** (`page strategy`):

- Goal/objective of the landing page   - Layout structure recommendations

- Target audience description   - Section-by-section breakdown:

- Offer/product details     - Hero section (headline, subheadline, CTA, visual)

- Brand voice and tone     - Feature sections with benefits

- Design constraints     - Testimonials and social proof

- Industry context     - Contact/signup forms

- Competitor information (optional)     - Footer elements

   - A/B testing variants and strategies

**Output**: Complete landing page package including:   - Primary and secondary CTA recommendations

   - Risk mitigation strategies

1. **Page Strategy** (`page strategy`):

   - Layout structure recommendations2. **Mermaid Wireframe** (`mermaid wireframe`):

   - Section-by-section breakdown:   - Interactive flowchart visualization

     - Hero section (headline, subheadline, CTA, visual)   - Page structure diagram

     - Feature sections with benefits   - Section relationships

     - Testimonials and social proof   - User flow mapping

     - Contact/signup forms   - Rendered as SVG with sanitization

     - Footer elements

   - A/B testing variants and strategies3. **Copywriting Content** (`copywriting content`):

   - Primary and secondary CTA recommendations   - Section-specific copy (headline, subhead, body, CTA)

   - Risk mitigation strategies   - Unique section IDs for implementation

   - Optimized messaging for conversions

2. **Mermaid Wireframe** (`mermaid wireframe`):   - Primary and secondary CTA copy

   - Interactive flowchart visualization

   - Page structure diagram4. **Web Design Plan** (`Web Designing plan`):

   - Section relationships   - Visual design recommendations

   - User flow mapping   - Color scheme suggestions

   - Rendered as SVG with sanitization   - Typography guidelines

   - Layout specifications

3. **Copywriting Content** (`copywriting content`):   - Responsive design considerations

   - Section-specific copy (headline, subhead, body, CTA)

   - Unique section IDs for implementation5. **Implementation Code** (`code`):

   - Optimized messaging for conversions   - Ready-to-use HTML/CSS code

   - Primary and secondary CTA copy   - Responsive design implementation

   - Copy-to-clipboard functionality

4. **Web Design Plan** (`Web Designing plan`):   - Production-ready markup

   - Visual design recommendations

   - Color scheme suggestions6. **Live URL** (`url` - optional):

   - Typography guidelines   - Deployed page URL if available

   - Layout specifications

   - Responsive design considerations**Webhook**: `https://n8n.ooumph.com/webhook/landing-page-generator`



5. **Implementation Code** (`code`):**Technical Implementation**:

   - Ready-to-use HTML/CSS code- Mermaid.js initialization and rendering

   - Responsive design implementation- Character sanitization for diagram parsing

   - Copy-to-clipboard functionality- Multi-device preview toggle (desktop/tablet/mobile)

   - Production-ready markup- Tabbed interface for organized content

- Copy buttons for all sections

6. **Live URL** (`url` - optional):- Error handling for diagram rendering

   - Deployed page URL if available- Responsive layout adaptation



**Webhook**: `https://n8n.ooumph.com/webhook/landing-page-generator`### 6. LinkedIn Post Generator (`/linkedin-post-generator`)



**Technical Implementation**:**Purpose**: Generate engaging LinkedIn posts with AI-powered content and custom images.

- Mermaid.js initialization and rendering

- Character sanitization for diagram parsing**Features**:

- Multi-device preview toggle (desktop/tablet/mobile)- AI-generated professional LinkedIn post copy

- Tabbed interface for organized content- Custom image generation with URLs

- Copy buttons for all sections- Brand-aligned messaging

- Error handling for diagram rendering- Audience-targeted content

- Responsive layout adaptation- Platform-specific optimization

- Copy-to-clipboard functionality

---- Dual-tab interface (post content and image)

- Real-time generation status

### 6. LinkedIn Post Generator (`/linkedin-post-generator`)

**Input**:

**Purpose**: Generate engaging LinkedIn posts with AI-powered content and custom images.- Brand Name (required)

- Business Description (required)

**Features**:- Target Audience (required)

- AI-generated professional LinkedIn post copy- Platform Preferences (optional - e.g., "Instagram, LinkedIn")

- Custom image generation with URLs- Monetization Approach (optional - e.g., "Selling AI and Robotics Kit")

- Brand-aligned messaging- Additional Information & Preferences (optional)

- Audience-targeted content

- Platform-specific optimization**Request Format**:

- Copy-to-clipboard functionality```json

- Dual-tab interface (post content and image)[{

- Real-time generation status  "Brand Name": "string",

  "Platfrom Prefrences": "string",

**Input**:  "Monetization Approach": "string",

- Brand Name (required)  "Target Audience": "string",

- Business Description (required)  "Aditional Information & Preferences": "string",

- Target Audience (required)  "Buisness Description": "string"

- Platform Preferences (optional - e.g., "Instagram, LinkedIn")}]

- Monetization Approach (optional - e.g., "Selling AI and Robotics Kit")```

- Additional Information & Preferences (optional)

**Output**: LinkedIn content package including:

**Request Format**:

```json1. **LinkedIn Post** (`Linkedin Post`):

[{   - Professional post copy

  "Brand Name": "string",   - Optimized for LinkedIn's algorithm

  "Platfrom Prefrences": "string",   - Engaging hooks and CTAs

  "Monetization Approach": "string",   - Formatted for readability

  "Target Audience": "string",   - Copy-to-clipboard enabled

  "Aditional Information & Preferences": "string",

  "Buisness Description": "string"2. **Generated Image** (`Image Url`):

}]   - AI-generated custom image URL

```   - Brand-aligned visuals

   - Professional quality

**Output**: LinkedIn content package including:   - Direct URL for downloading

   - Image preview in interface

1. **LinkedIn Post** (`Linkedin Post`):   - Copy URL functionality

   - Professional post copy

   - Optimized for LinkedIn's algorithm**Webhook**: `https://n8n.ooumph.com/webhook/linkedin-post`

   - Engaging hooks and CTAs

   - Formatted for readability**Technical Implementation**:

   - Copy-to-clipboard enabled- Form validation (required fields)

- Array-based request payload

2. **Generated Image** (`Image Url`):- JSON response parsing

   - AI-generated custom image URL- Tabbed interface for content organization

   - Brand-aligned visuals- Image loading with error handling

   - Professional quality- Placeholder display for failed image loads

   - Direct URL for downloading- Copy status indicators (checkmark feedback)

   - Image preview in interface- Responsive layout for mobile devices

   - Copy URL functionality

## Technology Stack

**Webhook**: `https://n8n.ooumph.com/webhook/linkedin-post`

### Frontend

**Technical Implementation**:- **Framework**: Next.js 15.5.6 (App Router)

- Form validation (required fields)- **Language**: TypeScript 5

- Array-based request payload- **Styling**: Tailwind CSS v4.1.9 with PostCSS

- JSON response parsing- **UI Components**: shadcn/ui (41+ components based on Radix UI primitives)

- Tabbed interface for content organization- **Icons**: Lucide React (v0.454.0)

- Image loading with error handling- **Fonts**: Inter font family via next/font with variable font optimization

- Placeholder display for failed image loads- **State Management**: React 19 hooks (useState, useEffect, useRef)

- Copy status indicators (checkmark feedback)- **Form Management**: React Hook Form with Zod validation

- Responsive layout for mobile devices- **Animations**: Custom CSS utilities with tw-animate-css

- **Charts**: Recharts v2.15.4

## Technology Stack- **Diagrams**: Mermaid.js for wireframe visualization



### Frontend### Backend

- **Framework**: Next.js 15.5.6 (App Router)- **Runtime**: Next.js API Routes

- **Language**: TypeScript 5 with strict mode- **Webhook Integration**: n8n workflows hosted at n8n.ooumph.com

- **Runtime**: React 19.2.0- **External APIs**: Custom webhook endpoints for each tool

- **Styling**: Tailwind CSS v4.1.9 with PostCSS

- **UI Library**: shadcn/ui (41+ components based on Radix UI v1.x)### Authentication

- **Icons**: Lucide React v0.454.0 (450+ icons)- **Provider**: Clerk (v6.34.5)

- **Fonts**: Inter font family via next/font with variable font optimization- **Features**: Sign in/sign up modals, user management, session handling

- **State Management**: React hooks (useState, useEffect, useRef)

- **Form Management**: React Hook Form v7.60.0 with Zod v3.25.67 validation### Analytics

- **Animations**: tw-animate-css v1.3.3 with custom utilities- **Provider**: Vercel Analytics

- **Charts**: Recharts v2.15.4- **Tracking**: Page views, user interactions

- **Diagrams**: Mermaid.js (latest) for wireframe visualization

- **Toast Notifications**: Sonner v1.7.4### Deployment

- **Utilities**: - **Platform**: Vercel-ready

  - clsx v2.1.1 for conditional classes- **Package Manager**: npm/pnpm support

  - tailwind-merge v2.5.5 for class deduplication- **Environment**: Production and preview environments

  - class-variance-authority v0.7.1 for component variants

## Architecture

### Backend/Integration

- **Runtime**: Next.js Edge Runtime### Application Structure

- **API Architecture**: Client-side fetch to external n8n webhooks

- **Webhook Service**: n8n workflows hosted at n8n.ooumph.com\`\`\`

- **Processing**: AI-powered workflows for each toolapp/

- **Error Handling**: AbortController, retry logic, timeout management├── page.tsx                          # Homepage/landing page

├── layout.tsx                        # Root layout with Clerk provider

### Authentication├── globals.css                       # Global styles and design tokens

- **Provider**: Clerk v6.34.5├── loading.tsx                       # Global loading state

- **Features**: ├── seo-audit/

  - Modal-based sign in/sign up│   ├── page.tsx                      # SEO audit tool

  - UserButton component for profile management│   └── loading.tsx                   # Loading state

  - Session handling with cookies├── market-analysis/

  - Publishable key authentication│   └── page.tsx                      # Market analysis tool

├── brandbook/

### Analytics & Monitoring│   └── page.tsx                      # Brandbook generator

- **Provider**: Vercel Analytics (latest)├── content-ideas/

- **Tracking**: Page views, user interactions, conversion events│   └── page.tsx                      # Content ideas generator

- **Performance**: Real User Monitoring (RUM)├── landing-page-generator/

│   └── page.tsx                      # Landing page generator

### Development Tools└── linkedin-post-generator/

- **Package Manager**: npm/pnpm    └── page.tsx                      # LinkedIn post generator

- **Build Tool**: Next.js built-in (Turbopack in dev mode)\`\`\`

- **TypeScript Config**: ES6 target, strict mode, path aliases

- **Linting**: ESLint with Next.js config### Component Architecture

- **Git**: Version control ready

\`\`\`

### Deploymentcomponents/

- **Platform**: Vercel-optimized├── shared-navbar.tsx                 # Shared navigation component

- **Build**: Static & Server-Side Generation└── ui/                               # shadcn/ui components

- **Environment**: Production and preview environments    ├── button.tsx

- **Configuration**:     ├── card.tsx

  - `ignoreBuildErrors: true` for TypeScript    ├── input.tsx

  - `unoptimized: true` for external images    ├── label.tsx

    ├── tabs.tsx

## Architecture    ├── textarea.tsx

    └── ... (other UI components)

### Application Structure\`\`\`



```### Data Flow

ooumph-tools/

├── app/1. **User Input** → Form submission on tool page

│   ├── page.tsx                          # Homepage with hero, tools grid, testimonials2. **Client Processing** → Data validation and formatting

│   ├── layout.tsx                        # Root layout with Clerk provider & Analytics3. **API Request** → POST to n8n webhook endpoint

│   ├── globals.css                       # Design tokens, OKLCH colors, animations4. **AI Processing** → n8n workflow processes request with AI

│   ├── loading.tsx                       # Global loading state5. **Response** → JSON data returned to client

│   ├── seo-audit/6. **Display** → Results rendered in UI with formatting

│   │   ├── page.tsx                      # SEO audit tool (Core Web Vitals)

│   │   └── loading.tsx                   # Loading state## Authentication

│   ├── market-analysis/

│   │   └── page.tsx                      # Market analysis tool (trends, personas)### Clerk Integration

│   ├── brandbook/

│   │   └── page.tsx                      # Brandbook generator (visual identity)The platform uses Clerk for user authentication with the following features:

│   ├── content-ideas/

│   │   └── page.tsx                      # Content ideas generator (strategy)- **Sign In/Sign Up**: Modal-based authentication flow

│   ├── landing-page-generator/- **User Management**: Profile management via UserButton

│   │   └── page.tsx                      # Landing page generator (Mermaid)- **Session Management**: Automatic session handling

│   └── linkedin-post-generator/- **Protected Routes**: Middleware-based route protection (optional)

│       └── page.tsx                      # LinkedIn post generator (AI + images)

│### Configuration

├── components/

│   ├── shared-navbar.tsx                 # Navigation with Clerk & dropdown\`\`\`typescript

│   ├── theme-provider.tsx                # Dark mode context provider// Environment variables required

│   ├── theme-toggle.tsx                  # Dark mode toggle buttonNEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...

│   └── ui/                               # 41 shadcn/ui componentsCLERK_SECRET_KEY=sk_test_...

│       ├── button.tsx\`\`\`

│       ├── card.tsx

│       ├── input.tsx### Implementation

│       ├── textarea.tsx

│       ├── tabs.tsx\`\`\`typescript

│       ├── badge.tsx// Layout.tsx

│       ├── progress.tsx<ClerkProvider publishableKey={publishableKey}>

│       ├── skeleton.tsx  {children}

│       ├── alert.tsx</ClerkProvider>

│       ├── dialog.tsx

│       └── ... (32 more components)// Navbar component

│<SignedOut>

├── lib/  <SignInButton mode="modal">Sign In</SignInButton>

│   └── utils.ts                          # cn() utility for class merging  <SignUpButton mode="modal">Sign Up</SignUpButton>

│</SignedOut>

├── hooks/<SignedIn>

│   ├── use-toast.ts                      # Toast notification hook  <UserButton />

│   └── use-mobile.ts                     # Mobile detection hook</SignedIn>

│\`\`\`

├── public/                               # Static assets

├── styles/## Environment Variables

│   └── globals.css                       # Additional global styles

│### Required Variables

├── middleware.ts                         # Route middleware (Clerk integration)

├── next.config.mjs                       # Next.js configuration\`\`\`bash

├── tsconfig.json                         # TypeScript configuration# Clerk Authentication

├── components.json                       # shadcn/ui configurationNEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...

├── postcss.config.mjs                    # PostCSS configurationCLERK_SECRET_KEY=sk_test_...

├── package.json                          # Dependencies and scripts

└── README.md                             # This file# Webhook Integration

```WEBHOOK_URL=https://n8n.ooumph.com/webhook/...

NEXT_PUBLIC_WEBHOOK_URL=https://n8n.ooumph.com/webhook/...

### Data Flow Architecture\`\`\`



```### Webhook Endpoints

┌─────────────┐

│ User Input  │Each tool uses a specific webhook endpoint:

│ (Form Data) │

└──────┬──────┘- SEO Audit: `https://n8n.ooumph.com/webhook/seo-audit`

       │- Market Analysis: `https://n8n.ooumph.com/webhook/market-analysis`

       ▼- Brandbook: `https://n8n.ooumph.com/webhook/brandbook`

┌─────────────────────┐- Content Ideas: `https://n8n.ooumph.com/webhook/content-ideas`

│ Client Validation   │- Landing Page: `https://n8n.ooumph.com/webhook/landing-page-generator`

│ (Zod/React Hook Form)│- LinkedIn Post: `https://n8n.ooumph.com/webhook/linkedin-post-generator`

└──────┬──────────────┘

       │## Installation

       ▼

┌─────────────────────┐### Prerequisites

│ Fetch POST Request  │

│ to n8n Webhook      │- Node.js 18+ 

└──────┬──────────────┘- npm or yarn

       │- Clerk account (for authentication)

       ▼- n8n instance (for webhook processing)

┌─────────────────────┐

│ n8n Workflow        │### Setup Steps

│ - AI Processing     │

│ - Data Aggregation  │1. **Clone the repository**

│ - API Calls         │\`\`\`bash

└──────┬──────────────┘git clone <repository-url>

       │cd seo-audit-saas

       ▼\`\`\`

┌─────────────────────┐

│ JSON Response       │2. **Install dependencies**

│ Parsing & Validation│\`\`\`bash

└──────┬──────────────┘npm install

       │\`\`\`

       ▼

┌─────────────────────┐3. **Configure environment variables**

│ UI Rendering        │\`\`\`bash

│ - Tabs              │cp .env.example .env.local

│ - Cards             │# Edit .env.local with your credentials

│ - Animations        │\`\`\`

│ - Copy Functions    │

└─────────────────────┘4. **Run development server**

```\`\`\`bash

npm run dev

### Error Handling Flow\`\`\`



```5. **Open browser**

Request → Try Fetch\`\`\`

            │http://localhost:3000

            ├─ Success → Parse JSON → Display Results\`\`\`

            │

            ├─ Network Error → Retry (3x with 2s delay)## Usage

            │                  │

            │                  ├─ Success → Continue### Running the Application

            │                  └─ Fail → Show Error

            │\`\`\`bash

            ├─ Timeout (10min) → Abort → Show Timeout Message# Development mode

            │npm run dev

            └─ Invalid JSON → Show Parse Error

```# Production build

npm run build

## Installationnpm start



### Prerequisites# Linting

npm run lint

- **Node.js**: 18.x or higher\`\`\`

- **npm** or **pnpm**: Latest version

- **Clerk Account**: For authentication (free tier available)### Using the Tools

- **n8n Instance**: For webhook processing (or use provided endpoints)

1. **Navigate to a tool** - Click on any tool from the homepage or use the navigation dropdown

### Setup Steps2. **Fill in the form** - Provide required information (URL, business description, etc.)

3. **Submit** - Click the analyze/generate button

1. **Clone the repository**4. **Wait for results** - Processing typically takes 30-60 seconds

```bash5. **Review output** - Results are displayed in organized sections with tabs

git clone <repository-url>6. **Copy/Export** - Use copy buttons to save content

cd ooumph-tools

```## API Integration



2. **Install dependencies**### Webhook Request Format

```bash

npm installAll tools send POST requests to n8n webhooks with JSON payloads:

```

\`\`\`typescript

3. **Configure environment variables**// Example: SEO Audit

const response = await fetch(webhookUrl, {

Create a `.env.local` file in the root directory:  method: "POST",

  headers: {

```bash    "Content-Type": "application/json",

# Clerk Authentication  },

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...  body: JSON.stringify({

CLERK_SECRET_KEY=sk_test_...    url: websiteUrl,

    // Additional parameters

# Webhook URLs (optional - defaults provided)  }),

NEXT_PUBLIC_WEBHOOK_URL=https://n8n.ooumph.com/webhook/seo})

```\`\`\`



4. **Run development server**### Response Format

```bash

npm run devResponses are JSON objects with tool-specific structures:

```

\`\`\`typescript

5. **Open browser**// Example: LinkedIn Post Generator

```{

http://localhost:3000  "Linkedin Post": "Post content...",

```  "Image Url": "https://...",

}

### Build for Production\`\`\`



```bash### Error Handling

npm run build

npm start- Network errors are caught and displayed to users

```- Timeout handling for long-running requests

- Retry logic for failed requests

### Docker Deployment (Optional)- User-friendly error messages



```dockerfile## Design System

FROM node:18-alpine

WORKDIR /app### Color Palette

COPY package*.json ./

RUN npm installThe platform uses a modern, professional color scheme:

COPY . .

RUN npm run build- **Primary**: Purple (#8B5CF6) - Main brand color

EXPOSE 3000- **Secondary**: Blue, Green, Orange - Tool-specific accents

CMD ["npm", "start"]- **Neutrals**: White, grays, black variants

```- **Semantic**: Success (green), Error (red), Warning (yellow)



## Environment Variables### Typography



### Required Variables- **Font Family**: Inter (sans-serif)

- **Headings**: Bold, large sizes (text-4xl to text-6xl)

```bash- **Body**: Regular weight, comfortable line-height (leading-relaxed)

# Clerk Authentication (Required)- **Scale**: Consistent sizing using Tailwind classes

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx

CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxx### Layout Principles

```

1. **Mobile-First**: Responsive design starting from mobile

### Optional Variables2. **Flexbox Priority**: Use flex for most layouts

3. **Grid for Complex**: CSS Grid for 2D layouts

```bash4. **Consistent Spacing**: Tailwind spacing scale (p-4, gap-6, etc.)

# Custom Webhook URLs (defaults provided in code)5. **Card-Based**: Content organized in cards for clarity

NEXT_PUBLIC_WEBHOOK_URL=https://n8n.ooumph.com/webhook/seo

```### Animation System



### Webhook EndpointsCustom animation delay utilities for staggered animations:



Each tool uses a specific n8n webhook endpoint:\`\`\`css

@utility delay-100 { animation-delay: 100ms; }

| Tool | Webhook URL |@utility delay-200 { animation-delay: 200ms; }

|------|-------------|/* ... up to delay-1800 */

| SEO Audit | `https://n8n.ooumph.com/webhook/seo` |\`\`\`

| Market Analysis | `https://n8n.ooumph.com/webhook/marketanalyzer` |

| Brandbook | `https://n8n.ooumph.com/webhook/brandbook` |Usage:

| Content Ideas | `https://n8n.ooumph.com/webhook/content-ideas` |\`\`\`tsx

| Landing Page | `https://n8n.ooumph.com/webhook/landing-page-generator` |<div className="animate-in slide-in-from-bottom-4 duration-600 delay-200">

| LinkedIn Post | `https://n8n.ooumph.com/webhook/linkedin-post` |  Content

</div>

## Usage\`\`\`



### Running the Application## Project Structure



```bash### Key Files

# Development mode (with hot reload)

npm run dev- **`app/layout.tsx`** - Root layout with Clerk provider and global styles

- **`app/page.tsx`** - Homepage with hero, tools showcase, testimonials

# Production build- **`app/globals.css`** - Design tokens, custom utilities, Tailwind config

npm run build- **`components/shared-navbar.tsx`** - Shared navigation across all pages

- **`middleware.ts`** - Route protection and authentication middleware

# Start production server

npm start### Tool Pages Pattern



# LintingEach tool follows a consistent pattern:

npm run lint

```\`\`\`typescript

"use client"

### Using the Toolsimport { useState } from "react"

import SharedNavbar from "@/components/shared-navbar"

1. **Navigate to a tool**: Click on any tool from the homepage or use the navigation dropdownimport { Button } from "@/components/ui/button"

2. **Fill in the form**: Provide required information (URL, business description, etc.)import { Input } from "@/components/ui/input"

3. **Submit**: Click the analyze/generate buttonimport { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

4. **Wait for results**: Processing typically takes 30-60 seconds (up to 10 minutes for complex requests)

5. **Review output**: Results are displayed in organized sections with tabsexport default function ToolPage() {

6. **Copy/Export**: Use copy buttons to save content or export full reports  const [loading, setLoading] = useState(false)

  const [results, setResults] = useState(null)

### Common Workflows  

  const handleSubmit = async () => {

#### SEO Audit Workflow    setLoading(true)

```    // API call to webhook

1. Enter website URL → 2. Click "Audit Website"    setLoading(false)

3. Wait for analysis (30-60s) → 4. Review performance score  }

5. Check priority fixes → 6. Export report  

```  return (

    <div>

#### Brandbook Generation Workflow      <SharedNavbar currentPage="Tool Name" />

```      {/* Form */}

1. Describe business (50+ chars) → 2. Click "Generate Brandbook"      {/* Results */}

3. Wait for generation (2-5 min) → 4. Navigate tabs (Messaging, Visual, etc.)    </div>

5. Copy sections as needed → 6. Export complete brandbook  )

```}

\`\`\`

#### Content Ideas Workflow

```### UI Components

1. Fill brand details → 2. Click "Generate Content Ideas"

3. Wait for strategy (1-3 min) → 4. Explore 6 tabsThe platform uses shadcn/ui components:

5. Copy individual ideas → 6. Use for content calendar

```- **Button** - Primary actions, variants (outline, ghost)

- **Card** - Content containers with header/content sections

## Design System- **Input/Textarea** - Form inputs with labels

- **Tabs** - Organized result display

### Color Palette- **Alert** - Status messages and notifications

- **Skeleton** - Loading states

The platform uses a sophisticated color system with **OKLCH color space** for perceptually uniform colors:- **Progress** - Loading indicators



#### Light Mode## Performance Optimizations

- **Primary Brand**: `#8B5CF6` (Purple) - CTAs, highlights, brand elements

- **Tool-Specific Accents**:- **Code Splitting** - Automatic with Next.js App Router

  - Blue `#2563EB` - SEO Audit, LinkedIn tools- **Image Optimization** - Next.js Image component

  - Green `#10B981` - Success states, positive metrics- **Font Optimization** - Next.js font loading

  - Orange `#F59E0B` - Content tools, warnings- **CSS Optimization** - Tailwind CSS purging

  - Red `#EF4444` - Errors, critical issues- **Analytics** - Lightweight Vercel Analytics

  - Indigo `#6366F1` - Landing Page Generator- **Lazy Loading** - Components loaded on demand

- **Neutrals**: OKLCH-based grays (background, text, borders)

- **Semantic**: Success (green), Error (red), Warning (yellow), Info (blue)## Browser Support



#### Dark Mode- Chrome (latest)

- Full dark mode support with inverted OKLCH values- Firefox (latest)

- Maintained WCAG contrast ratios- Safari (latest)

- Adjusted foreground/background relationships- Edge (latest)

- Consistent semantic color meanings- Mobile browsers (iOS Safari, Chrome Mobile)



### Typography## Contributing



- **Font**: Inter (variable font)### Development Workflow

- **Loading**: Variable font with `swap` strategy

- **Font Variable**: `--font-inter`1. Create feature branch

- **Tracking**: `tracking-tighter` on body2. Make changes

- **Scales**:3. Test locally

  - Headlines: `text-4xl`, `text-5xl`, `text-6xl`4. Submit pull request

  - Body: `text-sm`, `text-base`, `text-lg`5. Code review

  - Line Height: `leading-relaxed` for readability6. Merge to main



### Component Library### Code Style



**41 shadcn/ui Components organized by category:**- TypeScript for type safety

- ESLint for code quality

#### Layout (5)- Prettier for formatting

Card, Separator, Tabs, Accordion, Collapsible- Consistent naming conventions



#### Forms (9)## License

Input, Textarea, Label, Checkbox, Radio Group, Select, Switch, Slider, Form

Proprietary - All rights reserved

#### Feedback (6)

Alert, Badge, Progress, Skeleton, Toast, Sonner## Support



#### Overlay (8)For issues or questions:

Dialog, Alert Dialog, Sheet, Drawer, Popover, Tooltip, Hover Card, Context Menu- Email: support@ooumph.com

- Documentation: [Link to docs]

#### Navigation (6)- GitHub Issues: [Link to repo]

Button, Dropdown Menu, Navigation Menu, Menubar, Breadcrumb, Pagination

## Changelog

#### Data Display (5)

Table, Avatar, Calendar, Chart, Carousel### Version 1.0.0 (Current)



#### Utility (2)- Initial release

Scroll Area, Resizable Panels- 6 professional tools

- Clerk authentication

#### Custom (3)- Responsive design

SharedNavbar, ThemeProvider, ThemeToggle- Dark mode support

- Analytics integration

### Animation System

---

#### Custom Utilities

```css**Built with ❤️ by the Ooumph Team**

/* Animation delays from 100ms to 1800ms */
@utility delay-100 { animation-delay: 100ms; }
@utility delay-200 { animation-delay: 200ms; }
/* ... up to delay-1800 */
```

#### Animation Patterns

**Entrance Animations:**
```tsx
// Fade in
<div className="animate-in fade-in duration-1000">

// Slide from bottom
<div className="animate-in slide-in-from-bottom-4 duration-600">

// Zoom in
<div className="animate-in zoom-in-95 duration-500">

// Staggered cards
<Card className="animate-in slide-in-from-bottom-4 duration-600 delay-200">
<Card className="animate-in slide-in-from-bottom-4 duration-600 delay-400">
```

**Loading States:**
```tsx
// Spinner
<div className="animate-spin rounded-full h-8 w-8 border-b-2" />

// Pulse
<Icon className="animate-pulse" style={{ animationDuration: '3s' }} />

// Skeleton
<Skeleton className="h-4 w-full" />
```

**Hover Effects:**
```tsx
// Scale up
<Card className="hover:scale-105 transition-transform duration-300">

// Shadow expansion
<Button className="hover:shadow-xl transition-shadow duration-300">

// Color shift
<div className="hover:bg-primary/10 transition-colors duration-200">
```

### Layout Principles

1. **Mobile-First**: Responsive from 320px upwards
2. **Container System**: `max-w-6xl` for content, `container mx-auto px-4`
3. **Spacing Scale**: Consistent use of Tailwind spacing (4px increments)
4. **Grid Layouts**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
5. **Flexbox**: One-dimensional layouts, alignment
6. **Card-Based**: Elevated cards with hover effects
7. **Sticky Nav**: `sticky top-4 z-50` with backdrop blur
8. **Glass Morphism**: `backdrop-blur-md bg-card/80`

### Accessibility

- ✅ Semantic HTML5 elements
- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ Focus visible states with outline-ring
- ✅ WCAG AA contrast ratios (4.5:1 text, 3:1 UI)
- ✅ Screen reader friendly
- ✅ Proper heading hierarchy (h1 → h6)
- ✅ Alt text on images
- ✅ Form label associations

## API Integration

### Webhook Architecture

All tools communicate with external n8n webhooks using a consistent pattern:

#### Request Format

```typescript
const response = await fetch(webhookUrl, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  body: JSON.stringify({
    // Tool-specific payload
    url: "https://example.com",
    timestamp: new Date().toISOString(),
    requestId: Math.random().toString(36).substring(7)
  }),
  signal: controller.signal // For timeout handling
})
```

#### Response Handling

```typescript
// Parse response
const responseText = await response.text()
const data = JSON.parse(responseText)

// Handle array or object responses
let toolData = Array.isArray(data) ? data[0] : data
if (toolData.output) toolData = toolData.output
```

#### Error Handling

**Network Errors:**
- 3 automatic retries with 2-second delays
- Exponential backoff (optional)
- User-friendly error messages

**Timeout Management:**
- 10-minute maximum (600,000ms)
- AbortController for cancellation
- Clear timeout messaging

**Validation Errors:**
- JSON parsing with try/catch
- Empty response detection
- Schema validation (optional)

### Example: SEO Audit Request

```typescript
const auditWebsite = async (url: string) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 600000)
  
  try {
    const response = await fetch('https://n8n.ooumph.com/webhook/seo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, timestamp: new Date().toISOString() }),
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    
    const data = await response.json()
    return data
    
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - analysis took too long')
    }
    throw error
  }
}
```

### Rate Limiting

- No built-in rate limiting (relies on n8n workflows)
- Client-side debouncing recommended for rapid submissions
- Consider implementing request queuing for bulk operations

## Authentication

### Clerk Integration

The platform uses **Clerk** for modern, secure authentication:

#### Features
- Modal-based sign in/sign up (no redirect)
- UserButton component for profile management
- Automatic session handling
- Social login support (Google, GitHub, etc.)
- Email verification
- Password reset flows

#### Implementation

**Layout Setup (app/layout.tsx):**
```typescript
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({ children }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
```

**Navbar Integration (components/shared-navbar.tsx):**
```typescript
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

<SignedOut>
  <SignInButton mode="modal">
    <button>Sign In</button>
  </SignInButton>
  <SignUpButton mode="modal">
    <button>Sign Up</button>
  </SignUpButton>
</SignedOut>

<SignedIn>
  <UserButton />
</SignedIn>
```

#### Middleware (middleware.ts)

```typescript
export default function middleware() {
  // Simple middleware - Clerk handles auth client-side
  return
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
```

#### Environment Variables

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
```

### Protected Routes (Optional)

To protect specific routes, update middleware.ts:

```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/seo-audit(.*)',
  '/market-analysis(.*)',
  // Add more protected routes
])

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect()
})
```

## Performance

### Optimization Techniques

1. **Code Splitting**: Automatic with Next.js App Router
2. **Font Optimization**: Variable font loading with `swap` strategy
3. **Image Optimization**: Next.js Image component (currently `unoptimized: true`)
4. **CSS Optimization**: Tailwind CSS tree-shaking removes unused styles
5. **Bundle Analysis**: Use `@next/bundle-analyzer` (optional)
6. **Lazy Loading**: Dynamic imports for heavy components
7. **Edge Runtime**: Serverless functions for API routes
8. **Static Generation**: Pre-render pages where possible

### Performance Metrics

**Target Metrics:**
- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.8s
- Cumulative Layout Shift (CLS): < 0.1
- First Input Delay (FID): < 100ms

**Current Optimizations:**
- Staggered animations to reduce layout shifts
- Skeleton loaders during data fetching
- Optimized font loading (variable Inter)
- Efficient state management (minimal re-renders)
- Memoization where appropriate

### Bundle Size

```bash
# Analyze bundle (requires @next/bundle-analyzer)
npm run build
npm run analyze
```

**Approximate Sizes:**
- First Load JS: ~200-250 KB
- App CSS: ~50-75 KB
- Total Page Weight: ~300-400 KB (excluding images)

## Browser Support

### Supported Browsers

- ✅ Chrome 90+ (latest recommended)
- ✅ Firefox 88+ (latest recommended)
- ✅ Safari 14+ (latest recommended)
- ✅ Edge 90+ (latest recommended)
- ✅ Opera 76+ (latest recommended)

### Mobile Browsers

- ✅ iOS Safari 14+
- ✅ Chrome Mobile (Android)
- ✅ Samsung Internet
- ✅ Firefox Mobile

### Progressive Enhancement

- Core functionality works without JavaScript (forms)
- Enhanced animations require JavaScript
- Fallback for older browsers (CSS Grid/Flexbox)
- Polyfills not included (modern browsers only)

## Contributing

### Development Workflow

1. **Fork & Clone**
```bash
git clone <your-fork-url>
cd ooumph-tools
```

2. **Create Branch**
```bash
git checkout -b feature/your-feature-name
```

3. **Make Changes**
```bash
# Edit files
npm run dev  # Test locally
```

4. **Commit Changes**
```bash
git add .
git commit -m "feat: add new feature"
```

5. **Push & PR**
```bash
git push origin feature/your-feature-name
# Create PR on GitHub
```

### Code Style

- **TypeScript**: Strict mode enabled, no implicit `any`
- **ESLint**: Follow Next.js ESLint config
- **Formatting**: Consistent indentation (2 spaces)
- **Naming**: 
  - Components: PascalCase (`SharedNavbar.tsx`)
  - Functions: camelCase (`handleSubmit`)
  - Constants: UPPER_SNAKE_CASE (`WEBHOOK_URL`)
- **Comments**: Use JSDoc for complex functions
- **File Structure**: Group by feature, not by type

### Testing (Optional)

```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom jest

# Run tests
npm test

# Coverage
npm run test:coverage
```

### Commit Convention

Use conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance

## License

**Proprietary** - All rights reserved © 2025 Ooumph Tools

## Support

### Get Help

- **Email**: support@ooumph.com
- **Documentation**: [Link to full docs]
- **GitHub Issues**: [Link to repository issues]
- **Discord**: [Link to community] (optional)

### Common Issues

**Issue: `npm install` fails with dependency conflict**
```bash
# Solution: Use legacy peer deps
npm install --legacy-peer-deps
```

**Issue: Clerk authentication not working**
```bash
# Check environment variables
echo $NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
# Ensure it starts with pk_test_ or pk_live_
```

**Issue: Webhook timeouts**
```
# n8n workflow may be slow or unavailable
# Check webhook URL accessibility
# Increase timeout if needed (600000ms = 10 minutes)
```

## Changelog

### Version 1.0.0 (Current - November 2025)

**Features:**
- ✅ 6 AI-powered marketing tools
- ✅ Clerk authentication integration
- ✅ Responsive mobile-first design
- ✅ Dark mode support (OKLCH colors)
- ✅ Vercel Analytics integration
- ✅ Export/copy functionality
- ✅ Staggered animations
- ✅ Error handling with retries
- ✅ Mermaid.js wireframe rendering

**Technology Updates:**
- Next.js 15.5.6 (upgraded from 14.2.25)
- React 19.2.0 (upgraded from 18)
- Tailwind CSS 4.1.9
- Clerk 6.34.5
- Vaul 1.1.1 (upgraded for React 19 compatibility)

**Bug Fixes:**
- Fixed dependency conflicts between React 19 and Next.js
- Updated vaul to support React 19
- Resolved security vulnerabilities in Next.js
- Fixed CORS issues with webhook requests

---

**Built with ❤️ by the Ooumph Team**
