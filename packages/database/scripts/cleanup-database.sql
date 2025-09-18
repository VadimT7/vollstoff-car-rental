-- Database Cleanup Script (SQL Version)
-- This script safely deletes all data while preserving database structure
-- Execute this script to prepare the database for production

-- Disable foreign key checks temporarily (PostgreSQL)
SET session_replication_role = replica;

-- Delete data in dependency order
DELETE FROM "Notification";
DELETE FROM "DamageReport";
DELETE FROM "Contract";
DELETE FROM "Payment";
DELETE FROM "BookingAddOn";
DELETE FROM "Booking";
DELETE FROM "PaymentMethod";
DELETE FROM "Session";
DELETE FROM "Account";
DELETE FROM "VerificationToken";
DELETE FROM "User";
DELETE FROM "Maintenance";
DELETE FROM "Availability";
DELETE FROM "CarImage";
DELETE FROM "SeasonalRate";
DELETE FROM "PriceRule";
DELETE FROM "Car";
DELETE FROM "AddOn";
DELETE FROM "Testimonial";
DELETE FROM "Coupon";

-- Re-enable foreign key checks
SET session_replication_role = DEFAULT;

-- Reset sequences (auto-increment counters) if needed
-- This is optional but ensures clean ID sequences for new data

-- Verify cleanup
SELECT 
  schemaname,
  tablename,
  n_tup_ins as "Rows Inserted",
  n_tup_upd as "Rows Updated", 
  n_tup_del as "Rows Deleted",
  n_live_tup as "Live Rows",
  n_dead_tup as "Dead Rows"
FROM pg_stat_user_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

