#!/usr/bin/env tsx

/**
 * Database Cleanup Script
 * 
 * This script safely deletes all data from the database while preserving:
 * - Table structures
 * - Indexes
 * - Constraints
 * - Enums
 * - Triggers
 * 
 * The deletion order respects foreign key constraints.
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanupDatabase() {
  console.log('🧹 Starting database cleanup...')
  console.log('⚠️  This will delete ALL data while preserving structure')
  
  try {
    // Delete data in reverse dependency order to respect foreign keys
    
    // 1. Delete dependent records first
    console.log('🗑️  Deleting notifications...')
    const notificationCount = await prisma.notification.deleteMany()
    console.log(`   ✓ Deleted ${notificationCount.count} notifications`)

    console.log('🗑️  Deleting damage reports...')
    const damageReportCount = await prisma.damageReport.deleteMany()
    console.log(`   ✓ Deleted ${damageReportCount.count} damage reports`)

    console.log('🗑️  Deleting contracts...')
    const contractCount = await prisma.contract.deleteMany()
    console.log(`   ✓ Deleted ${contractCount.count} contracts`)

    console.log('🗑️  Deleting payments...')
    const paymentCount = await prisma.payment.deleteMany()
    console.log(`   ✓ Deleted ${paymentCount.count} payments`)

    console.log('🗑️  Deleting booking add-ons...')
    const bookingAddOnCount = await prisma.bookingAddOn.deleteMany()
    console.log(`   ✓ Deleted ${bookingAddOnCount.count} booking add-ons`)

    // 2. Delete bookings (after their dependencies)
    console.log('🗑️  Deleting bookings...')
    const bookingCount = await prisma.booking.deleteMany()
    console.log(`   ✓ Deleted ${bookingCount.count} bookings`)

    // 3. Delete user-related data
    console.log('🗑️  Deleting payment methods...')
    const paymentMethodCount = await prisma.paymentMethod.deleteMany()
    console.log(`   ✓ Deleted ${paymentMethodCount.count} payment methods`)

    console.log('🗑️  Deleting sessions...')
    const sessionCount = await prisma.session.deleteMany()
    console.log(`   ✓ Deleted ${sessionCount.count} sessions`)

    console.log('🗑️  Deleting accounts...')
    const accountCount = await prisma.account.deleteMany()
    console.log(`   ✓ Deleted ${accountCount.count} accounts`)

    console.log('🗑️  Deleting verification tokens...')
    const verificationTokenCount = await prisma.verificationToken.deleteMany()
    console.log(`   ✓ Deleted ${verificationTokenCount.count} verification tokens`)

    // 4. Delete users (after their dependencies)
    console.log('🗑️  Deleting users...')
    const userCount = await prisma.user.deleteMany()
    console.log(`   ✓ Deleted ${userCount.count} users`)

    // 5. Delete car-related data
    console.log('🗑️  Deleting maintenance records...')
    const maintenanceCount = await prisma.maintenance.deleteMany()
    console.log(`   ✓ Deleted ${maintenanceCount.count} maintenance records`)

    console.log('🗑️  Deleting availability records...')
    const availabilityCount = await prisma.availability.deleteMany()
    console.log(`   ✓ Deleted ${availabilityCount.count} availability records`)

    console.log('🗑️  Deleting car images...')
    const carImageCount = await prisma.carImage.deleteMany()
    console.log(`   ✓ Deleted ${carImageCount.count} car images`)

    console.log('🗑️  Deleting seasonal rates...')
    const seasonalRateCount = await prisma.seasonalRate.deleteMany()
    console.log(`   ✓ Deleted ${seasonalRateCount.count} seasonal rates`)

    console.log('🗑️  Deleting price rules...')
    const priceRuleCount = await prisma.priceRule.deleteMany()
    console.log(`   ✓ Deleted ${priceRuleCount.count} price rules`)

    // 6. Delete cars (after their dependencies)
    console.log('🗑️  Deleting cars...')
    const carCount = await prisma.car.deleteMany()
    console.log(`   ✓ Deleted ${carCount.count} cars`)

    // 7. Delete standalone entities
    console.log('🗑️  Deleting add-ons...')
    const addOnCount = await prisma.addOn.deleteMany()
    console.log(`   ✓ Deleted ${addOnCount.count} add-ons`)

    console.log('🗑️  Deleting testimonials...')
    const testimonialCount = await prisma.testimonial.deleteMany()
    console.log(`   ✓ Deleted ${testimonialCount.count} testimonials`)

    console.log('🗑️  Deleting coupons...')
    const couponCount = await prisma.coupon.deleteMany()
    console.log(`   ✓ Deleted ${couponCount.count} coupons`)

    console.log('✅ All data deleted successfully!')

    console.log('🎉 Database cleanup completed successfully!')
    console.log('📋 Summary:')
    console.log('   • All data has been removed')
    console.log('   • Database structure is preserved')
    console.log('   • All tables, indexes, and constraints remain intact')
    console.log('   • Database is ready for production use')

  } catch (error) {
    console.error('❌ Error during cleanup:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the cleanup
cleanupDatabase()
  .then(() => {
    console.log('🏁 Cleanup script finished')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Cleanup script failed:', error)
    process.exit(1)
  })
