# Valor Rental - Vercel Deployment Guide

This guide will help you deploy your Valor Rental application to Vercel.

## Prerequisites

1. **Vercel CLI** - Install globally:
   ```bash
   npm install -g vercel
   ```

2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)

3. **Production Database** - Set up a production PostgreSQL database (e.g., Neon, Supabase, Railway)

4. **Environment Variables** - Prepare your production environment variables

## Quick Start

### 1. Initial Setup (One-time)

#### For Windows (PowerShell):
```powershell
# Setup Vercel projects
.\scripts\setup-vercel.ps1

# Deploy both applications
.\scripts\deploy-all.ps1
```

#### For macOS/Linux:
```bash
# Make scripts executable
chmod +x scripts/*.sh

# Setup Vercel projects
./scripts/setup-vercel.sh

# Deploy both applications
./scripts/deploy-all.sh
```

### 2. Manual Setup (Alternative)

If you prefer to set up manually:

```bash
# Login to Vercel
vercel login

# Setup web app
cd apps/web
vercel --yes
cd ../..

# Setup admin app
cd apps/admin
vercel --yes
cd ../..
```

## Environment Variables

You need to configure these environment variables in your Vercel dashboard for both web and admin projects:

### Database
```
DATABASE_URL=your-production-database-url
DIRECT_DATABASE_URL=your-production-database-url
```

### Authentication
```
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://your-web-app.vercel.app
```

### Stripe Payments
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### Sanity CMS
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-sanity-token
```

### Email (Resend)
```
RESEND_API_KEY=re_your_api_key
EMAIL_FROM=flyrentalsca@gmail.com
```

### File Storage (Cloudflare R2)
```
CLOUDFLARE_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=your-bucket-name
```

## Deployment Scripts

### Available Scripts

| Script | Description | Platform |
|--------|-------------|----------|
| `deploy-all.sh` | Deploy both web and admin apps | macOS/Linux |
| `deploy-all.ps1` | Deploy both web and admin apps | Windows |
| `deploy-web.sh` | Deploy only web app | macOS/Linux |
| `deploy-admin.sh` | Deploy only admin app | macOS/Linux |
| `setup-vercel.sh` | Initial Vercel setup | macOS/Linux |
| `setup-vercel.ps1` | Initial Vercel setup | Windows |

### Script Options

#### Deploy All Applications
```bash
# Deploy both web and admin
./scripts/deploy-all.sh

# Deploy only web app
./scripts/deploy-all.sh --web-only

# Deploy only admin app
./scripts/deploy-all.sh --admin-only
```

#### PowerShell (Windows)
```powershell
# Deploy both web and admin
.\scripts\deploy-all.ps1

# Deploy only web app
.\scripts\deploy-all.ps1 -WebOnly

# Deploy only admin app
.\scripts\deploy-all.ps1 -AdminOnly
```

## Manual Deployment

If you prefer to deploy manually:

### Web Application
```bash
cd apps/web
vercel --prod
```

### Admin Application
```bash
cd apps/admin
vercel --prod
```

## Database Migration

Before deploying, ensure your database is migrated:

```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate:deploy

# Seed database (if needed)
pnpm db:seed
```

## Post-Deployment Checklist

1. **Verify Environment Variables** - Check that all environment variables are set correctly in Vercel dashboard

2. **Test Database Connection** - Ensure your production database is accessible

3. **Test Authentication** - Verify NextAuth.js is working with your production URLs

4. **Test Stripe Integration** - Verify payment processing works in production

5. **Test Email Notifications** - Ensure email notifications are being sent

6. **Test File Uploads** - Verify file uploads to Cloudflare R2 work

7. **Monitor Logs** - Check Vercel function logs for any errors

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check that all dependencies are installed
   - Verify TypeScript compilation passes
   - Ensure all environment variables are set

2. **Database Connection Issues**
   - Verify DATABASE_URL is correct
   - Check database is accessible from Vercel's IP ranges
   - Ensure database migrations have been run

3. **Authentication Issues**
   - Verify NEXTAUTH_URL matches your production URL
   - Check NEXTAUTH_SECRET is set correctly
   - Ensure OAuth providers are configured for production

4. **Stripe Webhook Issues**
   - Update webhook endpoints in Stripe dashboard
   - Verify STRIPE_WEBHOOK_SECRET is correct
   - Check webhook events are being received

### Getting Help

1. Check Vercel function logs in the dashboard
2. Review build logs for compilation errors
3. Verify environment variables are set correctly
4. Test locally with production environment variables

## Continuous Deployment

To enable automatic deployments:

1. Connect your GitHub repository to Vercel
2. Configure branch deployment rules
3. Set up preview deployments for pull requests
4. Configure production deployments for main branch

## Security Considerations

1. **Environment Variables** - Never commit sensitive data to version control
2. **Database Access** - Use connection pooling and limit database access
3. **API Keys** - Rotate API keys regularly
4. **CORS** - Configure CORS properly for production domains
5. **Rate Limiting** - Implement rate limiting for API endpoints

## Performance Optimization

1. **Image Optimization** - Use Next.js Image component with proper optimization
2. **Code Splitting** - Ensure proper code splitting is implemented
3. **Caching** - Implement appropriate caching strategies
4. **CDN** - Use Vercel's global CDN for static assets
5. **Database Queries** - Optimize database queries and use connection pooling

## Monitoring

1. **Vercel Analytics** - Enable Vercel Analytics for performance monitoring
2. **Error Tracking** - Set up Sentry or similar error tracking
3. **Uptime Monitoring** - Monitor application uptime
4. **Performance Monitoring** - Track Core Web Vitals and performance metrics

## Support

For deployment issues:
1. Check Vercel documentation
2. Review application logs
3. Test locally with production configuration
4. Contact Vercel support if needed
