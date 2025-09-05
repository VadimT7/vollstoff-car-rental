# Changelog

## [1.1.0] - 2024-12-19

### 🎉 Major Rebrand: Proper Rentals → FlyRentals

#### ✨ Added
- Complete rebrand from "Proper Rentals" to "FlyRentals"
- New FlyRentals logo and branding assets
- Updated fleet with 4 real luxury vehicles based on actual FlyRentals images:
  - Mercedes-Benz CLA AMG (2024)
  - Mercedes-Benz C43 AMG (2023)
  - Mercedes-Benz CLA 250 (2018)
  - Porsche Cayenne (2024)
- New fleet.ts file with structured car data
- Guard script to prevent old company name from appearing in codebase
- Brand verification tests

#### 🔄 Changed
- Updated all company references from "Proper Rentals" to "FlyRentals"
- Updated email addresses to @flyrentals.com domain
- Updated SEO metadata and structured data
- Updated navigation, footer, and all content pages
- Updated admin panel branding
- Updated email templates
- Updated environment configuration
- Updated documentation and README

#### 🗑️ Removed
- Old ProperRentalsLogo.png
- Unused video files (M3Competition-Pipes.mp4, M5.mp4)
- All traces of old company name across codebase

#### 🚀 Deployed
- Production deployment to Vercel: https://fly-rentals-pjl5ndwh9-tuchilavadim-1785s-projects.vercel.app

#### 🧪 Testing
- Added brand verification tests
- Added CI guardrails to prevent old company name
- Pre-build validation script

---

## [1.0.0] - 2024-12-18

### 🎉 Initial Release
- Complete luxury car rental platform
- Next.js 14 with App Router
- TypeScript and Tailwind CSS
- Stripe payment integration
- Admin panel
- Responsive design
- SEO optimized
