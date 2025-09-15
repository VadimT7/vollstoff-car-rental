# FlyRentals Admin Dashboard Deployment Guide

This guide will help you deploy the admin dashboard to Vercel with the subdomain `admin.flyrentals.ca`.

## Prerequisites

- Vercel account with access to your `flyrentals.ca` domain
- Admin access to your domain DNS settings
- All environment variables from your web app deployment

## Step 1: Create New Vercel Project

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"

2. **Import Repository**
   - Select your FlyRentals repository
   - Choose "Import" (don't deploy yet)

3. **Configure Project Settings**
   - **Project Name**: `flyrentals-admin` (or similar)
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/admin`
   - **Build Command**: `cd ../.. && pnpm build:admin`
   - **Install Command**: `cd ../.. && pnpm install`
   - **Output Directory**: `.next`

## Step 2: Environment Variables

Configure these environment variables in your Vercel project settings:

### Required Environment Variables

```bash
# Application URLs
NEXT_PUBLIC_APP_URL=https://flyrentals.ca
ADMIN_URL=https://admin.flyrentals.ca
NEXTAUTH_URL=https://admin.flyrentals.ca

# Database
DATABASE_URL=your_production_database_url
DIRECT_DATABASE_URL=your_production_database_url

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret

# Stripe (same as web app)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# File Storage
CLOUDFLARE_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=flyrentals-assets
NEXT_PUBLIC_R2_PUBLIC_URL=https://assets.flyrentals.com

# Email
RESEND_API_KEY=re_your_api_key
EMAIL_FROM=flyrentalsca@gmail.com
EMAIL_REPLY_TO=flyrentalsca@gmail.com
ADMIN_EMAIL=flyrentalsca@gmail.com

# SMS/WhatsApp
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+14386803936

# Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_analytics_id

# Security
CORS_ALLOWED_ORIGINS=https://flyrentals.ca,https://admin.flyrentals.ca

# Feature Flags
NEXT_PUBLIC_ENABLE_3D_MODELS=true
NEXT_PUBLIC_ENABLE_STRIPE_IDENTITY=false
NEXT_PUBLIC_ENABLE_WHATSAPP=true
NEXT_PUBLIC_ENABLE_ABANDONED_CART_EMAILS=true

# Business Configuration
NEXT_PUBLIC_DEFAULT_CURRENCY=EUR
NEXT_PUBLIC_DEFAULT_LOCALE=en
MIN_RENTAL_AGE=25
DEFAULT_DEPOSIT_AMOUNT=300000
CASH_REQUIRES_CARD_HOLD=true
```

### Important Notes:
- Use the **same database** as your web app
- Use the **same Stripe keys** as your web app
- Use the **same file storage** configuration
- Set `NEXTAUTH_URL` to `https://admin.flyrentals.ca`

## Step 3: Domain Configuration

### Option A: Subdomain (Recommended - admin.flyrentals.ca)

1. **In Vercel Dashboard:**
   - Go to your admin project settings
   - Navigate to "Domains"
   - Add domain: `admin.flyrentals.ca`
   - Vercel will provide DNS records to configure

2. **In Your DNS Provider:**
   - Add a CNAME record:
     - **Name**: `admin`
     - **Value**: `cname.vercel-dns.com`
     - **TTL**: 300 (or default)

### Option B: Path-based (flyrentals.ca/admin)

If you prefer the path-based approach:

1. **In Vercel Dashboard:**
   - Add domain: `flyrentals.ca`
   - Configure path-based routing

2. **Update Vercel Configuration:**
   ```json
   {
     "rewrites": [
       {
         "source": "/admin/(.*)",
         "destination": "/$1"
       }
     ]
   }
   ```

## Step 4: Deploy

1. **Deploy the Project**
   - Click "Deploy" in Vercel
   - Wait for the build to complete

2. **Verify Deployment**
   - Check that the admin dashboard loads at your configured domain
   - Test authentication
   - Verify API endpoints work

## Step 5: Post-Deployment Configuration

### Update Web App CORS Settings

Update your web app's environment variables to include the admin domain:

```bash
CORS_ALLOWED_ORIGINS=https://flyrentals.ca,https://admin.flyrentals.ca
```

### Update Stripe Webhooks

If you have Stripe webhooks configured:
1. Go to Stripe Dashboard → Webhooks
2. Add new endpoint: `https://admin.flyrentals.ca/api/webhook/stripe`
3. Configure events as needed

### Update Authentication Providers

If using OAuth providers (Google, etc.):
1. Update redirect URIs to include `https://admin.flyrentals.ca/api/auth/callback/[provider]`

## Step 6: Security Considerations

### Admin-Only Access
The admin dashboard should be restricted to authorized users only. Consider:

1. **IP Whitelisting** (if needed):
   ```bash
   # Add to environment variables
   ADMIN_ALLOWED_IPS=your.office.ip,another.allowed.ip
   ```

2. **Strong Authentication**:
   - Use strong passwords
   - Enable 2FA if available
   - Consider SSO integration

3. **Rate Limiting**:
   - Admin endpoints should have stricter rate limits
   - Consider implementing admin-specific rate limiting

## Step 7: Monitoring & Maintenance

### Set Up Monitoring
1. **Vercel Analytics**: Already configured via environment variables
2. **Error Tracking**: Consider Sentry for admin-specific error tracking
3. **Uptime Monitoring**: Set up alerts for admin dashboard availability

### Regular Maintenance
1. **Database Backups**: Ensure admin data is included in backups
2. **Security Updates**: Keep dependencies updated
3. **Access Logs**: Monitor admin access patterns

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check that all workspace dependencies are properly configured
   - Verify build commands are correct
   - Check environment variables are set

2. **Authentication Issues**:
   - Verify `NEXTAUTH_URL` matches your domain
   - Check `NEXTAUTH_SECRET` is set
   - Ensure database connection is working

3. **CORS Issues**:
   - Verify `CORS_ALLOWED_ORIGINS` includes both domains
   - Check API endpoint configurations

4. **File Upload Issues**:
   - Verify R2/Cloudflare configuration
   - Check file size limits
   - Ensure proper permissions

### Support
- Check Vercel deployment logs
- Review application logs
- Test locally with production environment variables

## Environment Variables Checklist

Before deploying, ensure you have configured:

- [ ] `NEXT_PUBLIC_APP_URL=https://flyrentals.ca`
- [ ] `ADMIN_URL=https://admin.flyrentals.ca`
- [ ] `NEXTAUTH_URL=https://admin.flyrentals.ca`
- [ ] `DATABASE_URL` (production database)
- [ ] `NEXTAUTH_SECRET`
- [ ] Stripe keys (live keys for production)
- [ ] File storage configuration
- [ ] Email configuration
- [ ] CORS settings
- [ ] All feature flags

## Next Steps

After successful deployment:

1. **Test all admin functionality**
2. **Set up monitoring and alerts**
3. **Configure backup procedures**
4. **Document admin access procedures**
5. **Train team members on admin dashboard usage**

---

**Note**: This deployment creates a separate Vercel project for the admin dashboard, which is the recommended approach for monorepos. This provides better isolation, independent deployments, and easier management of environment variables.
