# FlyRentals - System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            VALOR RENTAL SYSTEM                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────┐    ┌──────────────┐    ┌─────────────┐              │
│  │   Next.js   │    │   Sanity     │    │   Stripe    │              │
│  │  Web App    │◄───┤   CMS        │    │  Payments   │              │
│  └──────┬──────┘    └──────────────┘    └──────┬──────┘              │
│         │                                        │                      │
│         ▼                                        ▼                      │
│  ┌─────────────────────────────────────────────────────┐              │
│  │                    API Layer (tRPC)                  │              │
│  │  ┌─────────┐  ┌──────────┐  ┌─────────┐  ┌───────┐ │              │
│  │  │Booking  │  │Inventory │  │Payment  │  │Auth   │ │              │
│  │  │Engine   │  │Management│  │Handler  │  │System │ │              │
│  │  └─────────┘  └──────────┘  └─────────┘  └───────┘ │              │
│  └────────────────────────┬────────────────────────────┘              │
│                           ▼                                            │
│  ┌─────────────────────────────────────────────────────┐              │
│  │               PostgreSQL (via Prisma)                │              │
│  │  ┌─────────┐  ┌──────────┐  ┌─────────┐  ┌───────┐ │              │
│  │  │Cars     │  │Bookings  │  │Users    │  │Pricing│ │              │
│  │  │Inventory│  │Payments  │  │Profiles │  │Rules  │ │              │
│  │  └─────────┘  └──────────┘  └─────────┘  └───────┘ │              │
│  └─────────────────────────────────────────────────────┘              │
│                                                                        │
│  ┌─────────────┐    ┌──────────────┐    ┌─────────────┐             │
│  │   Redis     │    │  Cloudflare  │    │   Resend    │             │
│  │  Session/   │    │  R2 Storage  │    │   Email     │             │
│  │  Cache      │    │  (Assets)    │    │   Service   │             │
│  └─────────────┘    └──────────────┘    └─────────────┘             │
│                                                                        │
└─────────────────────────────────────────────────────────────────────────┘
```

## Request Flow - Booking Creation

```
User                Web App              API              DB            Stripe
 │                    │                   │               │               │
 ├─Select Car/Dates──►│                   │               │               │
 │                    ├─Check Availability►│               │               │
 │                    │                   ├─Query Locks──►│               │
 │                    │◄──Available────────┤◄──────────────┤               │
 │◄─Show Pricing──────┤                   │               │               │
 │                    │                   │               │               │
 ├─Submit Booking────►│                   │               │               │
 │                    ├─Create Booking───►│               │               │
 │                    │                   ├─Begin Trans──►│               │
 │                    │                   ├─Lock Inventory┤               │
 │                    │                   ├─Create Record─┤               │
 │                    │                   │               │               │
 │                    │                   ├─Create Payment Intent─────────►│
 │                    │                   │◄──Intent ID───────────────────┤
 │                    │                   │               │               │
 │                    │                   ├─Update Booking┤               │
 │                    │                   ├─Commit Trans─►│               │
 │                    │◄──Booking Ref─────┤               │               │
 │◄─Confirm Page──────┤                   │               │               │
 │                    │                   │               │               │
 │                    ├─Process Payment──►│               │               │
 │                    │                   ├─Confirm Payment──────────────►│
 │                    │                   │◄──Success─────────────────────┤
 │                    │                   ├─Update Status─►│               │
 │                    │                   ├─Send Email────┤               │
 │◄─Success───────────┤◄──Complete────────┤               │               │
```

## Payment Flow - Deposit Hold & Release

```
Booking Start          API              Stripe           DB
     │                  │                 │               │
     ├─Card on File────►│                 │               │
     │                  ├─Create Hold─────►│               │
     │                  │◄─Hold ID─────────┤               │
     │                  ├─Store Hold──────────────────────►│
     │◄─Confirmed───────┤                 │               │
                                         
   [Car Rental Period]
                                         
Return Process         API              Stripe           DB
     │                  │                 │               │
     ├─Return Car──────►│                 │               │
     │                  ├─Check Damages───┤               │
     │                  ├─Calculate Final─┤               │
     │                  ├─Release Hold────►│               │
     │                  │◄─Released────────┤               │
     │                  ├─Update Status───────────────────►│
     │◄─Receipt─────────┤                 │               │
```

## Data Model ERD

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│      User       │     │     Booking     │     │      Car        │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id              │◄────┤ userId          │────►│ id              │
│ email           │     │ carId           │     │ make            │
│ name            │     │ startDate       │     │ model           │
│ licenseUrl      │     │ endDate         │     │ year            │
│ verified        │     │ status          │     │ specs           │
│ role            │     │ totalAmount     │     │ images[]        │
└─────────────────┘     │ depositHoldId   │     │ featured        │
                        └────────┬────────┘     └────────┬────────┘
                                 │                       │
                                 ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Payment      │     │   AddOnUsage    │     │   PriceRule     │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id              │     │ bookingId       │     │ carId           │
│ bookingId       │◄────┤ addOnId         │     │ basePrice       │
│ stripeIntentId  │     │ quantity        │     │ weekendMulti    │
│ amount          │     │ price           │     │ seasonMulti     │
│ status          │     └─────────────────┘     │ minDays         │
│ method          │                             │ maxDays         │
└─────────────────┘                             └─────────────────┘

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     AddOn       │     │  Availability   │     │    Contract     │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id              │     │ carId           │     │ bookingId       │
│ name            │     │ date            │     │ pdfUrl          │
│ description     │     │ isAvailable     │     │ signedAt        │
│ priceType       │     │ blockReason     │     │ signerName      │
│ price           │     └─────────────────┘     │ ipHash          │
│ icon            │                             └─────────────────┘
└─────────────────┘
```

## Component Architecture

```
apps/
├── web/                    # Customer-facing Next.js app
│   ├── app/               # App Router pages
│   │   ├── (public)/      # Public routes (SSG)
│   │   ├── (booking)/     # Booking flow (CSR)
│   │   ├── (account)/     # Protected routes
│   │   └── api/           # API routes
│   ├── components/        # React components
│   │   ├── ui/           # Design system usage
│   │   ├── booking/      # Booking-specific
│   │   ├── fleet/        # Car displays
│   │   └── three/        # 3D components
│   └── lib/              # Utilities
│
├── admin/                 # Admin panel (separate app)
│   ├── app/              # Admin routes
│   └── components/       # Admin components
│
packages/
├── ui/                   # Shared design system
│   ├── tokens/          # Design tokens
│   ├── components/      # Base components
│   └── animations/      # Motion specs
│
├── database/            # Prisma schema & client
│   ├── prisma/
│   └── seed/
│
├── lib/                # Shared utilities
│   ├── api/           # tRPC routers
│   ├── booking/       # Booking logic
│   ├── pricing/       # Pricing engine
│   └── payments/      # Payment handlers
│
└── config/            # Shared configs
    ├── eslint/
    ├── typescript/
    └── tailwind/
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Production                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐        ┌──────────────┐                 │
│  │   Vercel     │        │  Cloudflare  │                 │
│  │              │        │              │                 │
│  │  ┌────────┐  │        │  ┌────────┐  │                 │
│  │  │Next.js │  │        │  │   R2   │  │                 │
│  │  │  App   │  │◄──────►│  │Storage │  │                 │
│  │  └────────┘  │        │  └────────┘  │                 │
│  │              │        │              │                 │
│  │  ┌────────┐  │        │  ┌────────┐  │                 │
│  │  │ Edge   │  │        │  │  CDN   │  │                 │
│  │  │Functions│ │        │  │        │  │                 │
│  │  └────────┘  │        │  └────────┘  │                 │
│  └──────┬───────┘        └──────────────┘                 │
│         │                                                  │
│         ▼                                                  │
│  ┌──────────────┐        ┌──────────────┐                │
│  │  Supabase    │        │   Sanity     │                │
│  │              │        │   Studio     │                │
│  │  ┌────────┐  │        │              │                │
│  │  │Postgres│  │        │  ┌────────┐  │                │
│  │  │   DB   │  │◄──────►│  │  CMS   │  │                │
│  │  └────────┘  │        │  │  API   │  │                │
│  │              │        │  └────────┘  │                │
│  │  ┌────────┐  │        └──────────────┘                │
│  │  │ Redis  │  │                                         │
│  │  │ Cache  │  │        External Services                │
│  │  └────────┘  │        ┌──────────────┐                │
│  └──────────────┘        │   Stripe     │                │
│                          │   Resend     │                │
│                          │   Twilio     │                │
│                          └──────────────┘                │
└─────────────────────────────────────────────────────────────┘
```
