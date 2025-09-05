# Vercel Deployment Guide for Valor Rental Web App

Since the monorepo setup is complex for Vercel CLI, here's the recommended approach:

## Option 1: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your Git repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `cd ../.. && pnpm build:web`
   - **Output Directory**: `apps/web/.next`
   - **Install Command**: `cd ../.. && pnpm install`

5. Add Environment Variables:
   ```
   # Required for build
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   
   # Database
   DATABASE_URL=your-production-database-url
   
   # Authentication
   NEXTAUTH_SECRET=generate-a-secret-key
   NEXTAUTH_URL=https://your-domain.vercel.app
   
   # Optional (for full functionality)
   STRIPE_SECRET_KEY=sk_live_your_key
   STRIPE_WEBHOOK_SECRET=whsec_your_secret
   RESEND_API_KEY=re_your_api_key
   ```

6. Click "Deploy"

## Option 2: Deploy via CLI (Alternative)

From the project root:

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Build the project first
pnpm build:web

# Deploy
vercel --prod
```

When prompted:
- Set up and deploy: Y
- Which scope: Choose your account
- Link to existing project: N
- Project name: valor-rental-web
- In which directory: ./apps/web
- Override settings: Y
- Build Command: cd ../.. && pnpm build:web
- Output Directory: apps/web/.next
- Development Command: cd ../.. && pnpm dev:web

## Post-Deployment

1. Set up your custom domain in Vercel dashboard
2. Configure environment variables in Project Settings
3. Set up webhooks for Stripe (if using payments)
4. Update NEXTAUTH_URL to match your production URL

## Build Successfully Completed ✅

Your web app has been built successfully and is ready for deployment!

Build output:
- Static pages: 7
- Dynamic pages: 4
- API routes: 4
- Total build size: ~160KB First Load JS

The application is optimized and ready for production deployment.
