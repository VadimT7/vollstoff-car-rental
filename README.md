# FlyRentals - Ultra-Luxury Exotic Car Rental Platform

> "If Louis Vuitton & Gucci ran a supercar fleet."

## 🚗 Overview

Valore Rental is a complete, production-ready luxury car rental platform featuring:

- 🏎️ Ultra-luxury fleet management (Lamborghini, Ferrari, BMW M8, Mercedes-AMG G63, etc.)
- 💳 Complete Stripe integration (payments, deposits, holds, refunds)
- 📅 Advanced booking system with real-time availability
- 🎨 Luxury design system with custom animations & 3D car showcases
- 📱 Responsive web app with 95+ Lighthouse scores
- 👤 Customer accounts and comprehensive admin panel
- 📧 Email/SMS/WhatsApp notifications via Resend & Twilio
- 🔒 Secure authentication with NextAuth.js v5
- 📊 Comprehensive reporting and analytics
- 🌍 Multi-language ready with full i18n support

## 🎯 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion
- **3D Graphics**: Three.js with React Three Fiber
- **UI Components**: Radix UI primitives with luxury customization
- **Backend**: tRPC for type-safe APIs, Prisma ORM
- **Database**: PostgreSQL with row-level security
- **Payments**: Stripe (full integration including SCA)
- **CMS**: Sanity for content management
- **Auth**: NextAuth.js v5 with magic links
- **File Storage**: Cloudflare R2 (S3-compatible)
- **Email**: Resend with React Email templates
- **SMS/WhatsApp**: Twilio
- **Infrastructure**: Docker, Vercel, Supabase, Cloudflare
- **Monorepo**: Turborepo with pnpm workspaces

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm 8+
- Docker Desktop
- PostgreSQL 15+
- Stripe account (test mode)
- Sanity account
- Resend account
- Twilio account (optional for SMS)
- Cloudflare account (for R2 storage)

### One-Command Setup

```bash
# Clone the repository
git clone <repo-url>
cd valore-rental

# Install dependencies
pnpm install

# Copy environment variables
cp env.example .env.local

# Edit .env.local with your API keys

# Start everything with Docker
pnpm docker:up

# Wait for services to be healthy, then:
pnpm setup
```

This will:
1. Start PostgreSQL, Redis, MinIO, and Mailhog
2. Run database migrations
3. Seed the database with luxury cars and demo data
4. Start the development servers

### Manual Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Set up environment
cp env.example .env.local
# Edit .env.local with your credentials

# 3. Start Docker services
docker compose up -d

# 4. Wait for PostgreSQL to be ready
docker compose logs -f postgres
# Look for "database system is ready to accept connections"

# 5. Run migrations
pnpm db:migrate:deploy

# 6. Seed the database
pnpm db:seed

# 7. Start development
pnpm dev
```

## 🚀 Deployment

### Deploy to Vercel

The easiest way to deploy Valore Rental is using Vercel:

#### Option 1: Using Deployment Scripts (Recommended)

**Windows (PowerShell)**:
```powershell
.\scripts\deploy-vercel.ps1
```

**Linux/macOS (Bash)**:
```bash
chmod +x scripts/deploy-vercel.sh
./scripts/deploy-vercel.sh
```

#### Option 2: Manual Deployment

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

#### Option 3: GitHub Integration

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on push

### Environment Variables

Before deploying, ensure you have all required environment variables:

```bash
# Database
DATABASE_URL=your_postgresql_connection_string

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-domain.vercel.app

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Resend)
RESEND_API_KEY=re_...

# File Storage (Cloudflare R2)
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=valore-rental-assets
R2_ENDPOINT=https://...
```

### Post-Deployment Setup

1. **Database Migration**:
   ```bash
   pnpm db:migrate:deploy
   pnpm db:seed
   ```

2. **Configure External Services**:
   - Update Stripe webhook endpoints
   - Configure Resend domain verification
   - Set up Twilio webhook URLs

For detailed deployment instructions, see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

### Accessing the Applications

- **Customer Web App**: http://localhost:3000
- **Admin Panel**: http://localhost:3001
- **Sanity Studio**: http://localhost:3333
- **Mailhog (Email Testing)**: http://localhost:8025
- **MinIO Console**: http://localhost:9001
- **pgAdmin**: http://localhost:5050

### Default Credentials

#### Admin User
- Email: `flyrentalsca@gmail.com`
- Password: `admin123`

#### Test Customer
- Email: `customer@example.com`
- Password: `customer123`

#### Stripe Test Cards
- Success: `4242 4242 4242 4242`
- Requires Auth: `4000 0025 0000 3155`
- Decline: `4000 0000 0000 0002`

## 📁 Project Structure

```
valore-rental/
├── apps/
│   ├── web/                 # Customer-facing Next.js app
│   │   ├── app/            # App Router pages & API routes
│   │   ├── components/     # React components
│   │   └── lib/           # Utilities and helpers
│   │
│   ├── admin/              # Admin panel (Next.js)
│   │   ├── app/           # Admin routes
│   │   └── components/    # Admin-specific components
│   │
│   └── sanity/            # Sanity Studio configuration
│
├── packages/
│   ├── ui/                # Shared design system
│   │   ├── tokens/       # Design tokens (colors, typography, etc.)
│   │   ├── components/   # Reusable UI components
│   │   └── animations/   # Animation presets
│   │
│   ├── database/         # Prisma schema & migrations
│   │   ├── prisma/      # Schema and migrations
│   │   └── seed.ts      # Database seeding
│   │
│   ├── lib/             # Shared business logic
│   │   ├── api/        # tRPC setup and routers
│   │   ├── booking/    # Booking engine logic
│   │   ├── pricing/    # Pricing calculations
│   │   ├── payments/   # Stripe integration
│   │   └── notifications/ # Email/SMS handlers
│   │
│   ├── config/          # Shared configurations
│   │   ├── eslint/     # ESLint config
│   │   ├── typescript/ # TypeScript config
│   │   └── tailwind/   # Tailwind config
│   │
│   └── email-templates/ # React Email templates
│
├── infra/               # Infrastructure
│   ├── docker/         # Dockerfiles
│   └── scripts/        # Deployment scripts
│
├── tests/              # Test suites
│   ├── unit/          # Unit tests
│   └── e2e/           # End-to-end tests
│
└── docs/              # Documentation
```

## 🛠️ Development

### Available Scripts

```bash
# Development
pnpm dev              # Start all apps in dev mode
pnpm dev:web          # Start customer web app only
pnpm dev:admin        # Start admin panel only
pnpm dev:sanity       # Start Sanity Studio only

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:migrate:dev   # Create a new migration
pnpm db:migrate:deploy # Apply migrations
pnpm db:push          # Push schema changes (dev only)
pnpm db:seed          # Seed the database
pnpm db:studio        # Open Prisma Studio

# Testing
pnpm test            # Run all tests
pnpm test:unit       # Run unit tests
pnpm test:e2e        # Run E2E tests
pnpm test:e2e:ui     # Run E2E tests with UI

# Building
pnpm build           # Build all apps
pnpm build:web       # Build customer web app
pnpm build:admin     # Build admin panel

# Linting & Formatting
pnpm lint            # Lint all packages
pnpm format          # Format all files
pnpm typecheck       # Type check all packages

# Docker
pnpm docker:up       # Start Docker services
pnpm docker:down     # Stop Docker services
pnpm docker:logs     # View Docker logs
pnpm docker:build    # Build Docker images
pnpm docker:clean    # Remove volumes and containers

# Utilities
pnpm clean           # Clean all build artifacts
pnpm setup           # Full project setup
pnpm setup:clean     # Clean setup (removes all data)
```

### Working with the Monorepo

```bash
# Run commands in specific packages
pnpm --filter @valore/web dev
pnpm --filter @valore/database generate

# Add dependencies to specific packages
pnpm add react --filter @valore/web
pnpm add -D @types/node --filter @valore/lib

# Add shared dependencies
pnpm add -w turbo
```

### Database Migrations

```bash
# Create a new migration after schema changes
pnpm db:migrate:dev

# Apply migrations in production
pnpm db:migrate:deploy

# Reset database (CAUTION: deletes all data)
pnpm db:migrate:reset
```

### Testing Payments

1. Use Stripe test mode keys in `.env.local`
2. Install Stripe CLI: https://stripe.com/docs/stripe-cli
3. Forward webhooks to local:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook/stripe
   ```
4. Copy the webhook signing secret to `.env.local`

## 🏗️ Architecture

### Data Flow

```
User Action → Next.js Page → tRPC Client → API Route → 
tRPC Router → Business Logic → Prisma → PostgreSQL
                    ↓
            Side Effects (Stripe, Email, SMS)
```

### Key Design Decisions

1. **App Router**: Leverages React Server Components for optimal performance
2. **tRPC**: End-to-end type safety between frontend and backend
3. **Prisma**: Type-safe database queries with migration support
4. **Monorepo**: Shared code and consistent development experience
5. **Design System**: Centralized UI components ensure consistency

### Security Measures

- JWT-based authentication with secure HTTP-only cookies
- CSRF protection on all mutations
- Rate limiting on API endpoints
- Input validation with Zod schemas
- SQL injection prevention via Prisma
- XSS protection with React's built-in escaping
- Secure headers via Next.js configuration

## 🚢 Deployment

### Production Checklist

- [ ] Set all production environment variables
- [ ] Configure Stripe webhooks for production URL
- [ ] Set up production database (Supabase recommended)
- [ ] Configure CDN for static assets (Cloudflare)
- [ ] Enable Vercel Analytics and Speed Insights
- [ ] Configure custom domain and SSL
- [ ] Set up monitoring (Sentry)
- [ ] Configure backup strategy
- [ ] Test payment flows with real cards
- [ ] Review and update robots.txt and sitemap

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables
vercel env pull
```

### Manual Deployment

```bash
# Build all applications
pnpm build

# The build outputs will be in:
# - apps/web/.next
# - apps/admin/.next

# Deploy these to your hosting provider
```

### Database Deployment

1. Create a PostgreSQL instance (Supabase, Neon, or Railway)
2. Update `DATABASE_URL` in production
3. Run migrations:
   ```bash
   pnpm db:migrate:deploy
   ```
4. Optionally seed with initial data

## 📊 Features

### Customer Features

- **Browse Fleet**: Filter by category, price, availability
- **3D Car Views**: Interactive models with 360° rotation
- **Real-time Availability**: Live calendar with instant booking
- **Flexible Payments**: Card or cash with security deposits
- **Add-on Services**: Insurance, chauffeur, photography packages
- **Delivery Options**: Showroom pickup or doorstep delivery
- **Account Dashboard**: Booking history, saved cards, documents
- **Multi-language**: i18n-ready architecture

### Admin Features

- **Fleet Management**: Add/edit vehicles, manage specifications
- **Booking Management**: View, modify, cancel reservations
- **Dynamic Pricing**: Base rates, seasonal adjustments, promotions
- **Availability Control**: Block dates, schedule maintenance
- **Customer Management**: KYC verification, document review
- **Financial Reports**: Revenue analytics, utilization metrics
- **Content Management**: Homepage, testimonials via Sanity CMS
- **Policy Configuration**: Age limits, deposits, cancellations

### Technical Features

- **Performance**: 95+ Lighthouse scores, optimized Core Web Vitals
- **SEO**: SSG/ISR, structured data, dynamic sitemaps
- **Accessibility**: WCAG 2.2 AA compliant
- **Progressive Enhancement**: Works without JavaScript
- **Offline Support**: Service worker for reliability
- **Real-time Updates**: WebSocket support ready

## 🧪 Testing

### Unit Tests

```bash
# Run unit tests
pnpm test:unit

# Watch mode
pnpm test:unit:watch

# Coverage report
pnpm test:unit:coverage
```

### E2E Tests

```bash
# Run E2E tests (headless)
pnpm test:e2e

# Run with UI
pnpm test:e2e:ui

# Debug mode
pnpm test:e2e:debug
```

### Test Coverage

- Business logic: 90%+ coverage required
- API routes: Integration tests for all endpoints
- UI components: Interaction and accessibility tests
- E2E: Critical user journeys (booking, payment, cancellation)

## 📖 Documentation

### For Developers

- [Architecture Guide](docs/ARCHITECTURE.md)
- [API Reference](docs/API.md)
- [Design System](docs/DESIGN_SYSTEM.md)
- [Contributing Guide](docs/CONTRIBUTING.md)

### For Operations

- [Admin Guide](docs/ADMIN_GUIDE.md)
- [Booking Operations](docs/BOOKING_OPS.md)
- [Payment Handling](docs/PAYMENTS.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)

## 🤝 Support

### Getting Help

- **Documentation**: Check `/docs` folder
- **Issues**: GitHub Issues for bug reports
- **Discussions**: GitHub Discussions for questions
- **Email**: flyrentalsca@gmail.com

### Common Issues

1. **Database connection failed**
   - Ensure PostgreSQL is running: `docker compose ps`
   - Check credentials in `.env.local`

2. **Stripe webhooks not working**
   - Ensure Stripe CLI is forwarding to correct URL
   - Check webhook secret in `.env.local`

3. **Emails not sending**
   - Check Resend API key
   - In development, check Mailhog at http://localhost:8025

## 📄 License

Copyright © 2025 FlyRentals. All rights reserved.

This is proprietary software. Unauthorized copying, modification, or distribution is strictly prohibited.

---

Built with ❤️ for the luxury automotive experience.
