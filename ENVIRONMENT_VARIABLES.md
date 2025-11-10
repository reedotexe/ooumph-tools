# Environment Variables Configuration Guide

## Overview

This document explains all environment variables used in the Ooumph Tools application. Each tool has its own dedicated webhook URL that can be customized via environment variables.

## Required Variables

### Clerk Authentication

These variables are **required** for user authentication to work:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
```

**How to get these:**
1. Sign up at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy your keys from the API Keys section
4. Use `pk_test_...` and `sk_test_...` for development
5. Use `pk_live_...` and `sk_live_...` for production

## Webhook URLs (Optional)

Each of the 6 tools has its own webhook URL. These are **optional** - if not set, default URLs will be used.

### 1. SEO Audit Tool

```bash
NEXT_PUBLIC_SEO_AUDIT_WEBHOOK_URL=https://n8n.ooumph.com/webhook/seo
```

**Default**: `https://n8n.ooumph.com/webhook/seo`  
**Used in**: `/app/seo-audit/page.tsx`  
**Purpose**: Webhook for SEO website analysis

### 2. Market Analysis Tool

```bash
NEXT_PUBLIC_MARKET_ANALYSIS_WEBHOOK_URL=https://n8n.ooumph.com/webhook/marketanalyzer
```

**Default**: `https://n8n.ooumph.com/webhook/marketanalyzer`  
**Used in**: `/app/market-analysis/page.tsx`  
**Purpose**: Webhook for market trend analysis and persona generation

### 3. Brandbook Generator

```bash
NEXT_PUBLIC_BRANDBOOK_WEBHOOK_URL=https://n8n.ooumph.com/webhook/brandbook
```

**Default**: `https://n8n.ooumph.com/webhook/brandbook`  
**Used in**: `/app/brandbook/page.tsx`  
**Purpose**: Webhook for brand identity and guidelines generation

### 4. Content Ideas Generator

```bash
NEXT_PUBLIC_CONTENT_IDEAS_WEBHOOK_URL=https://n8n.ooumph.com/webhook/content-ideas-generator
```

**Default**: `https://n8n.ooumph.com/webhook/content-ideas-generator`  
**Used in**: `/app/content-ideas/page.tsx`  
**Purpose**: Webhook for content strategy and ideas generation

### 5. Landing Page Generator

```bash
NEXT_PUBLIC_LANDING_PAGE_WEBHOOK_URL=https://n8n.ooumph.com/webhook/landing-page-generator
```

**Default**: `https://n8n.ooumph.com/webhook/landing-page-generator`  
**Used in**: `/app/landing-page-generator/page.tsx`  
**Purpose**: Webhook for landing page strategy and code generation

### 6. LinkedIn Post Generator

```bash
NEXT_PUBLIC_LINKEDIN_POST_WEBHOOK_URL=https://n8n.ooumph.com/webhook/linkedin-post
```

**Default**: `https://n8n.ooumph.com/webhook/linkedin-post`  
**Used in**: `/app/linkedin-post-generator/page.tsx`  
**Purpose**: Webhook for LinkedIn post and image generation

## Setup Instructions

### For Development

1. **Copy the example file**:
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local`** with your actual Clerk keys:
   ```bash
   # Required - Get from Clerk Dashboard
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
   CLERK_SECRET_KEY=sk_test_your_actual_secret_here
   ```

3. **Optionally customize webhook URLs** (if you have your own n8n instance):
   ```bash
   NEXT_PUBLIC_SEO_AUDIT_WEBHOOK_URL=https://your-n8n-instance.com/webhook/custom-seo
   NEXT_PUBLIC_MARKET_ANALYSIS_WEBHOOK_URL=https://your-n8n-instance.com/webhook/custom-market
   # ... etc
   ```

4. **Restart the development server**:
   ```bash
   npm run dev
   ```

### For Production (Vercel)

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add each variable:
   - Name: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - Value: `pk_live_your_production_key`
   - Select: Production, Preview, Development (as needed)

4. Add webhook URLs if you want to override defaults

5. Redeploy your application

## Environment Variables Summary Table

| Variable Name | Required | Default Value | Purpose |
|--------------|----------|---------------|---------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅ Yes | None | Clerk public key for auth |
| `CLERK_SECRET_KEY` | ✅ Yes | None | Clerk secret key for auth |
| `NEXT_PUBLIC_SEO_AUDIT_WEBHOOK_URL` | ❌ No | `https://n8n.ooumph.com/webhook/seo` | SEO audit webhook |
| `NEXT_PUBLIC_MARKET_ANALYSIS_WEBHOOK_URL` | ❌ No | `https://n8n.ooumph.com/webhook/marketanalyzer` | Market analysis webhook |
| `NEXT_PUBLIC_BRANDBOOK_WEBHOOK_URL` | ❌ No | `https://n8n.ooumph.com/webhook/brandbook` | Brandbook webhook |
| `NEXT_PUBLIC_CONTENT_IDEAS_WEBHOOK_URL` | ❌ No | `https://n8n.ooumph.com/webhook/content-ideas-generator` | Content ideas webhook |
| `NEXT_PUBLIC_LANDING_PAGE_WEBHOOK_URL` | ❌ No | `https://n8n.ooumph.com/webhook/landing-page-generator` | Landing page webhook |
| `NEXT_PUBLIC_LINKEDIN_POST_WEBHOOK_URL` | ❌ No | `https://n8n.ooumph.com/webhook/linkedin-post` | LinkedIn post webhook |

## Testing Your Configuration

### Test Clerk Authentication

1. Start the dev server: `npm run dev`
2. Open `http://localhost:3000`
3. Click "Sign In" button
4. If you see the Clerk sign-in modal, it's working correctly

### Test Webhook URLs

1. Open browser console (F12)
2. Navigate to any tool page
3. Submit the form
4. Check console logs for:
   ```
   [v0] Sending request to webhook: https://...
   ```
5. Verify the correct webhook URL is being used

## Troubleshooting

### Clerk Authentication Not Working

**Problem**: "Sign In" button doesn't work or shows error

**Solutions**:
1. Check that `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` starts with `pk_test_` or `pk_live_`
2. Verify the key is from your Clerk dashboard
3. Make sure you restarted the dev server after changing `.env.local`
4. Clear browser cache and cookies

### Webhook Not Responding

**Problem**: Tool submission fails with network error

**Solutions**:
1. Check that webhook URL is accessible (test in browser/Postman)
2. Verify n8n workflow is active
3. Check console logs for actual URL being called
4. Ensure URL doesn't have typos or extra spaces
5. Test with default URL first before using custom ones

### Environment Variables Not Loading

**Problem**: Variables show as `undefined` in console

**Solutions**:
1. Ensure file is named `.env.local` (not `.env`)
2. Check that variables start with `NEXT_PUBLIC_` for client-side access
3. Restart the Next.js dev server
4. Don't use quotes around values in `.env.local`
5. Make sure `.env.local` is in the project root directory

## Security Best Practices

1. **Never commit** `.env.local` to version control
2. `.env.local` is already in `.gitignore` by default
3. Use `.env.example` to document required variables without exposing secrets
4. Rotate Clerk keys if they're accidentally exposed
5. Use different keys for development and production
6. Store production secrets in Vercel/hosting platform, not in code

## Additional Notes

- All webhook URLs use `NEXT_PUBLIC_` prefix because they're accessed from client-side code
- The `CLERK_SECRET_KEY` doesn't need `NEXT_PUBLIC_` as it's only used server-side
- Default webhook URLs point to the production n8n instance
- You can use different webhook URLs per environment (dev, staging, prod)
- Environment variables are loaded at build time, so changes require a rebuild

## Example Complete `.env.local`

```bash
# Clerk Authentication (Required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_Y291bnQtY2hpY2tAZGVlLTM4LmNsZXJrLmFjY291bnRzLmRldg
CLERK_SECRET_KEY=sk_test_abcdefghijklmnopqrstuvwxyz123456789

# Webhook URLs (Optional - only set if overriding defaults)
NEXT_PUBLIC_SEO_AUDIT_WEBHOOK_URL=https://n8n.ooumph.com/webhook/seo
NEXT_PUBLIC_MARKET_ANALYSIS_WEBHOOK_URL=https://n8n.ooumph.com/webhook/marketanalyzer
NEXT_PUBLIC_BRANDBOOK_WEBHOOK_URL=https://n8n.ooumph.com/webhook/brandbook
NEXT_PUBLIC_CONTENT_IDEAS_WEBHOOK_URL=https://n8n.ooumph.com/webhook/content-ideas-generator
NEXT_PUBLIC_LANDING_PAGE_WEBHOOK_URL=https://n8n.ooumph.com/webhook/landing-page-generator
NEXT_PUBLIC_LINKEDIN_POST_WEBHOOK_URL=https://n8n.ooumph.com/webhook/linkedin-post
```

---

**Last Updated**: November 10, 2025  
**Version**: 1.0.0
