# Vercel Monorepo Setup Guide

This guide shows you how to set up both your web and admin apps using Vercel's monorepo features with shared environment variables.

## 🎯 **Why This Approach is Best**

✅ **Shared Environment Variables**: Both projects use the same secrets  
✅ **Independent Deployments**: Deploy web and admin separately  
✅ **Shared Database**: Both apps connect to the same database  
✅ **Cost Effective**: Better resource utilization  
✅ **Easy Management**: One repository, organized deployments  

## 📋 **Setup Steps**

### Step 1: Create Web Project (Already Done)
Your web app is already deployed at `flyrentals.ca`

### Step 2: Create Admin Project

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"

2. **Import Same Repository**
   - Select your FlyRentals repository (same as web project)
   - Click "Import"

3. **Configure Admin Project Settings**
   ```
   Project Name: flyrentals-admin
   Framework: Next.js
   Root Directory: apps/admin
   Build Command: cd ../.. && pnpm build:admin
   Install Command: cd ../.. && pnpm install
   Output Directory: .next
   ```

### Step 3: Share Environment Variables

#### Method 1: Copy from Web Project (Easiest)
1. Go to your **web project** in Vercel
2. Go to **Settings** → **Environment Variables**
3. Copy all variables to your **admin project**

#### Method 2: Use Vercel CLI
```bash
# Export from web project
vercel env pull .env.production --project=your-web-project-id

# Import to admin project
vercel env add --from-file .env.production --project=your-admin-project-id
```

### Step 4: Update Admin-Specific Variables

In your **admin project** environment variables, update these:

```bash
# Update URLs for admin
NEXT_PUBLIC_APP_URL=https://flyrentals.ca
ADMIN_URL=https://admin.flyrentals.ca
NEXTAUTH_URL=https://admin.flyrentals.ca

# Update CORS to include both domains
CORS_ALLOWED_ORIGINS=https://flyrentals.ca,https://admin.flyrentals.ca

# Update email domains
EMAIL_FROM=flyrentalsca@gmail.com
EMAIL_REPLY_TO=flyrentalsca@gmail.com
ADMIN_EMAIL=flyrentalsca@gmail.com

# Update R2 public URL
NEXT_PUBLIC_R2_PUBLIC_URL=https://assets.flyrentals.ca
```

### Step 5: Configure Domains

#### For Admin Project:
1. Go to **Settings** → **Domains**
2. Add domain: `admin.flyrentals.ca`
3. Configure DNS: Add CNAME record `admin` → `cname.vercel-dns.com`

#### For Web Project:
1. Update CORS settings to include admin domain
2. Add `https://admin.flyrentals.ca` to allowed origins

### Step 6: Deploy Both Projects

1. **Deploy Admin Project**
   - Click "Deploy" in admin project
   - Wait for completion

2. **Redeploy Web Project** (if needed)
   - Update CORS settings
   - Redeploy to apply changes

## 🔧 **Environment Variables Management**

### Shared Variables (Same for Both Projects)
```bash
# Database
DATABASE_URL=your_production_database_url
DIRECT_DATABASE_URL=your_production_database_url

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# File Storage
CLOUDFLARE_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=flyrentals-assets

# Email
RESEND_API_KEY=re_your_api_key

# SMS
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+14386803936

# Feature Flags
NEXT_PUBLIC_ENABLE_3D_MODELS=true
NEXT_PUBLIC_ENABLE_STRIPE_IDENTITY=false
NEXT_PUBLIC_ENABLE_WHATSAPP=true
NEXT_PUBLIC_ENABLE_ABANDONED_CART_EMAILS=true

# Business Config
NEXT_PUBLIC_DEFAULT_CURRENCY=EUR
NEXT_PUBLIC_DEFAULT_LOCALE=en
MIN_RENTAL_AGE=25
DEFAULT_DEPOSIT_AMOUNT=300000
CASH_REQUIRES_CARD_HOLD=true
```

### Project-Specific Variables

#### Web Project Only:
```bash
NEXT_PUBLIC_APP_URL=https://flyrentals.ca
NEXTAUTH_URL=https://flyrentals.ca
CORS_ALLOWED_ORIGINS=https://flyrentals.ca,https://admin.flyrentals.ca
```

#### Admin Project Only:
```bash
NEXT_PUBLIC_APP_URL=https://flyrentals.ca
ADMIN_URL=https://admin.flyrentals.ca
NEXTAUTH_URL=https://admin.flyrentals.ca
CORS_ALLOWED_ORIGINS=https://flyrentals.ca,https://admin.flyrentals.ca
```

## 🚀 **Deployment Workflow**

### Initial Setup:
1. Create admin project
2. Copy environment variables from web project
3. Update admin-specific variables
4. Configure domains
5. Deploy both projects

### Ongoing Development:
1. **Web changes**: Deploy web project only
2. **Admin changes**: Deploy admin project only
3. **Shared changes**: Deploy both projects
4. **Environment changes**: Update both projects

## 🔒 **Security Benefits**

- **Shared secrets**: One place to manage database, Stripe, etc.
- **Independent access**: Admin can be restricted separately
- **CORS control**: Proper cross-origin configuration
- **Environment isolation**: Each app has its own deployment environment

## 📊 **Monitoring & Analytics**

- **Separate analytics**: Each app can have its own tracking
- **Shared monitoring**: Same database and services
- **Independent scaling**: Scale web and admin separately
- **Unified logging**: Both apps log to same services

## 🛠️ **Troubleshooting**

### Common Issues:

1. **Build Failures**:
   - Check root directory is set correctly
   - Verify build commands work locally
   - Check environment variables are set

2. **CORS Issues**:
   - Verify CORS_ALLOWED_ORIGINS includes both domains
   - Check API endpoint configurations

3. **Authentication Issues**:
   - Verify NEXTAUTH_URL matches the domain
   - Check NEXTAUTH_SECRET is set
   - Ensure database connection works

### Support Commands:
```bash
# Test builds locally
pnpm build:web
pnpm build:admin

# Check environment variables
vercel env ls --project=your-project-id

# View deployment logs
vercel logs --project=your-project-id
```

## ✅ **Final Checklist**

Before going live:

- [ ] Both projects deployed successfully
- [ ] Domains configured (flyrentals.ca + admin.flyrentals.ca)
- [ ] Environment variables copied and updated
- [ ] CORS settings configured
- [ ] Authentication working on both apps
- [ ] Database connections working
- [ ] File uploads working
- [ ] Email notifications working
- [ ] Payment processing working

---

This setup gives you the best of both worlds: shared configuration with independent deployments!
