# Quick Start Guide - Environment Variables

## 🚀 Quick Setup (2 Minutes)

### Step 1: Copy Environment File
```bash
cp .env.example .env.local
```

### Step 2: Get Clerk Keys
1. Go to https://clerk.com
2. Sign up or log in
3. Create a new application
4. Copy your keys from the API Keys section

### Step 3: Update `.env.local`
Replace the placeholder values:
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY_HERE
CLERK_SECRET_KEY=sk_test_YOUR_ACTUAL_SECRET_HERE
```

### Step 4: Start Development Server
```bash
npm run dev
```

### Step 5: Test
Open http://localhost:3000 and click "Sign In" to verify Clerk is working.

---

## 📋 What Each Tool Uses

| Tool | Environment Variable |
|------|---------------------|
| SEO Audit | `NEXT_PUBLIC_SEO_AUDIT_WEBHOOK_URL` |
| Market Analysis | `NEXT_PUBLIC_MARKET_ANALYSIS_WEBHOOK_URL` |
| Brandbook | `NEXT_PUBLIC_BRANDBOOK_WEBHOOK_URL` |
| Content Ideas | `NEXT_PUBLIC_CONTENT_IDEAS_WEBHOOK_URL` |
| Landing Page | `NEXT_PUBLIC_LANDING_PAGE_WEBHOOK_URL` |
| LinkedIn Post | `NEXT_PUBLIC_LINKEDIN_POST_WEBHOOK_URL` |

---

## ✅ Default Behavior

**Good News:** All webhook URLs have sensible defaults!

If you **don't set** webhook environment variables, the app automatically uses:
- `https://n8n.ooumph.com/webhook/[tool-name]`

**You only need to set webhook URLs if:**
- You have your own n8n instance
- You want to use different endpoints
- You're testing with custom backends

---

## 🔧 Using Custom Webhooks (Optional)

Only add these lines to `.env.local` if you need custom webhooks:

```bash
# Example: Using your own n8n instance
NEXT_PUBLIC_SEO_AUDIT_WEBHOOK_URL=https://my-n8n.mycompany.com/webhook/seo-custom
NEXT_PUBLIC_MARKET_ANALYSIS_WEBHOOK_URL=https://my-n8n.mycompany.com/webhook/market-custom
```

---

## 🐛 Troubleshooting

### Problem: "Sign In" button doesn't work
**Solution:** 
- Check that your Clerk key starts with `pk_test_` or `pk_live_`
- Restart dev server: `Ctrl+C` then `npm run dev`

### Problem: Tool says "Network error"
**Solution:**
- Check your internet connection
- Verify webhook URL is correct (check console logs)
- Test with default webhooks first

### Problem: Changes not taking effect
**Solution:**
- Make sure file is named `.env.local` (not `.env`)
- Restart the dev server
- Clear browser cache

---

## 📚 More Information

- Full documentation: See `ENVIRONMENT_VARIABLES.md`
- Implementation details: See `IMPLEMENTATION_SUMMARY.md`
- Example values: See `.env.example`

---

## ✨ That's It!

You're ready to use Ooumph Tools. All 6 tools will work with their default webhooks, and you can customize individual webhooks whenever needed.

**Happy coding! 🎉**
