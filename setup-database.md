# Database Setup Instructions

## Step 1: Create Neon Database

1. Go to [neon.tech](https://neon.tech) and sign up/login
2. Click "Create Project"
3. Name it: `flyrentals-db`
4. Select region closest to you
5. Click "Create Project"

## Step 2: Get Connection String

1. In Neon dashboard, go to "Connection Details"
2. Copy the connection string (it will look like):
   ```
   postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

## Step 3: Update Environment Variables

1. Open `.env.local` file in project root
2. Replace the DATABASE_URL with your Neon connection string:
   ```env
   DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
   DIRECT_DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
   ```

## Step 4: Run Database Setup

Open a terminal in the project root and run:

```bash
# Install dependencies (if not already done)
pnpm install

# Generate Prisma Client
cd packages/database
npx prisma generate

# Push schema to database (creates all tables)
npx prisma db push

# Seed the database with initial data
npx prisma db seed

# Go back to root
cd ../..
```

## Step 5: Verify Setup

1. Check Neon dashboard - you should see tables created
2. Run the development servers:
   ```bash
   pnpm dev
   ```

3. Visit:
   - Admin Dashboard: http://localhost:3001
   - User Website: http://localhost:3000

## Troubleshooting

### If you get connection errors:

1. Make sure your `.env.local` file exists in the project root
2. Verify the connection string is correct
3. Check if Neon database is active (it may pause after inactivity)

### If seed fails:

1. Clear the database first:
   ```bash
   cd packages/database
   npx prisma db push --force-reset
   npx prisma db seed
   ```

### If you need to reset everything:

```bash
cd packages/database
npx prisma migrate reset
```

## What Gets Created

The seed script will create:
- 4 luxury vehicles (Mercedes-AMG C43, Porsche Cayenne, etc.)
- Admin user: flyrentalsca@gmail.com
- Test customer: customer@example.com
- Sample bookings
- Add-ons and pricing rules
- 90 days of availability data

## Next Steps

Once the database is connected:
1. The admin dashboard will show real vehicle data
2. You can create, edit, and delete vehicles
3. The user website will display vehicles from the database
4. All CRUD operations will work with real data

## For Production (Vercel)

Add these environment variables to your Vercel project:
- DATABASE_URL (your Neon connection string)
- DIRECT_DATABASE_URL (same as DATABASE_URL)
- NEXTAUTH_SECRET (generate with: openssl rand -base64 32)
