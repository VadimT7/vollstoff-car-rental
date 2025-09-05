# Database Setup - Quick Start Guide

## Current Status
The application is configured to work with or without a database connection. When no database is connected, it uses mock data (3 vehicles) to demonstrate functionality.

## Option 1: Use Mock Data (No Database Needed)
The app will automatically use mock data if no database is configured. This includes:
- Mercedes-AMG C43 ($450/day)
- Porsche Cayenne ($550/day)
- Mercedes CLA 250 ($350/day)

## Option 2: Connect to Neon Database (Recommended)

### Step 1: Create Neon Account
1. Go to [neon.tech](https://neon.tech)
2. Sign up for free account
3. Create new project called "flyrentals"

### Step 2: Get Connection String
1. In Neon dashboard, go to "Connection Details"
2. Copy the connection string

### Step 3: Update Environment
1. Create `.env.local` file in project root:
```env
DATABASE_URL="postgresql://[your-neon-connection-string]"
DIRECT_DATABASE_URL="postgresql://[your-neon-connection-string]"
```

### Step 4: Initialize Database
```bash
cd packages/database
npx prisma generate
npx prisma db push
npx prisma db seed
cd ../..
```

### Step 5: Start Application
```bash
pnpm dev
```

## What You'll Get With Database

### Seeded Data:
- 4 luxury vehicles with full specifications
- Admin user (admin@flyrentals.com)
- Test customer
- Sample booking
- Add-ons and pricing rules
- 90 days of availability data

### Full Features:
- Real-time CRUD operations
- Booking management
- Customer profiles
- Analytics and reporting
- Payment tracking

## Verifying Connection

Visit http://localhost:3001/api/vehicles

- **With Database**: Returns real vehicle data from database
- **Without Database**: Returns 3 mock vehicles

## Troubleshooting

### Database Not Connecting?
1. Check `.env.local` exists in root directory
2. Verify connection string is correct
3. Ensure Neon database is active

### Want to Reset?
```bash
cd packages/database
npx prisma migrate reset
```

## For Production (Vercel)

Add these to Vercel environment variables:
- `DATABASE_URL` - Your Neon connection string
- `DIRECT_DATABASE_URL` - Same as DATABASE_URL
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
