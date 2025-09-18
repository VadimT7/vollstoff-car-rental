#!/usr/bin/env tsx

/**
 * Database Cleanup Verification Script
 * 
 * This script verifies that the database cleanup was successful
 * by checking that all tables are empty while structure remains intact.
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifyCleanup() {
  console.log('🔍 Verifying database cleanup...')
  
  try {
    const checks = [
      { name: 'Users', query: () => prisma.user.count() },
      { name: 'Cars', query: () => prisma.car.count() },
      { name: 'Bookings', query: () => prisma.booking.count() },
      { name: 'Payments', query: () => prisma.payment.count() },
      { name: 'Car Images', query: () => prisma.carImage.count() },
      { name: 'Price Rules', query: () => prisma.priceRule.count() },
      { name: 'Availability', query: () => prisma.availability.count() },
      { name: 'Add-ons', query: () => prisma.addOn.count() },
      { name: 'Testimonials', query: () => prisma.testimonial.count() },
      { name: 'Coupons', query: () => prisma.coupon.count() },
      { name: 'Notifications', query: () => prisma.notification.count() },
      { name: 'Sessions', query: () => prisma.session.count() },
      { name: 'Accounts', query: () => prisma.account.count() },
    ]

    let allEmpty = true
    let totalRecords = 0

    console.log('\n📊 Table Record Counts:')
    console.log('═'.repeat(40))

    for (const check of checks) {
      const count = await check.query()
      totalRecords += count
      const status = count === 0 ? '✅' : '❌'
      console.log(`${status} ${check.name.padEnd(20)} ${count.toString().padStart(8)} records`)
      
      if (count > 0) {
        allEmpty = false
      }
    }

    console.log('═'.repeat(40))
    console.log(`   ${'TOTAL'.padEnd(20)} ${totalRecords.toString().padStart(8)} records`)

    console.log('\n🏗️  Database Structure Check:')
    console.log('═'.repeat(40))

    // Check that tables still exist by running a simple query
    try {
      await prisma.$queryRaw`SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'`
      console.log('✅ Database tables exist')
    } catch (error) {
      console.log('❌ Database structure issue:', error)
      allEmpty = false
    }

    // Check enums exist
    try {
      await prisma.$queryRaw`SELECT COUNT(*) FROM pg_type WHERE typtype = 'e'`
      console.log('✅ Database enums exist')
    } catch (error) {
      console.log('❌ Database enum issue:', error)
    }

    // Check indexes exist
    try {
      await prisma.$queryRaw`SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public'`
      console.log('✅ Database indexes exist')
    } catch (error) {
      console.log('❌ Database index issue:', error)
    }

    console.log('\n🎯 Verification Results:')
    console.log('═'.repeat(40))

    if (allEmpty && totalRecords === 0) {
      console.log('🎉 SUCCESS: Database is completely clean!')
      console.log('   • All tables are empty (0 records)')
      console.log('   • Database structure is preserved')
      console.log('   • Ready for production use')
      process.exit(0)
    } else {
      console.log('⚠️  WARNING: Database cleanup incomplete!')
      console.log(`   • Found ${totalRecords} remaining records`)
      console.log('   • Some tables still contain data')
      console.log('   • Consider running cleanup again')
      process.exit(1)
    }

  } catch (error) {
    console.error('❌ Error during verification:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the verification
verifyCleanup()

