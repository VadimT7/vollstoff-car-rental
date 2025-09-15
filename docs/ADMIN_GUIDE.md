# Valore Rental - Admin Guide

## 🎯 Overview

This guide covers all administrative functions for managing the Valore Rental platform.

## 🚀 Getting Started

### Accessing the Admin Panel

1. Navigate to: https://admin.valorerent.com (or http://localhost:3001 for local)
2. Sign in with your admin credentials
3. Complete 2FA if enabled

### Admin Roles

- **Super Admin**: Full system access, user management, settings
- **Admin**: Fleet, bookings, customers, reports
- **Staff**: Bookings, customer support
- **Viewer**: Read-only access to reports

## 🚗 Fleet Management

### Adding a New Vehicle

1. Navigate to **Fleet → Add Vehicle**
2. Fill in required information:
   - Make, Model, Year, Trim
   - VIN and License Plate
   - Category (Supercar, Luxury, SUV, etc.)
   - Specifications (HP, acceleration, top speed)
3. Upload images:
   - Primary image (hero shot)
   - Gallery images (8-12 recommended)
   - Interior shots
   - Detail shots
4. Set status:
   - **Active**: Available for booking
   - **Maintenance**: Temporarily unavailable
   - **Coming Soon**: Display but not bookable
   - **Retired**: Hidden from customers

### Managing Vehicle Images

- **Recommended dimensions**: 1920x1080 minimum
- **File types**: JPEG, PNG, WebP
- **Optimization**: Images auto-optimized on upload
- **Order**: Drag to reorder in gallery
- **Alt text**: Add for SEO and accessibility

### 3D Models (Optional)

1. Upload `.glb` or `.gltf` files
2. Maximum size: 50MB
3. Test on multiple devices
4. Provide fallback image

### Vehicle Specifications

Essential specs to include:
- Engine type and size
- Horsepower and torque
- 0-100 km/h time
- Top speed
- Transmission type
- Fuel type and consumption
- Seating capacity
- Luggage capacity

## 💰 Pricing Management

### Base Pricing Structure

1. Navigate to **Pricing → Rules**
2. Select vehicle
3. Set base price per day
4. Configure:
   - Minimum rental days
   - Maximum rental days
   - Included kilometers per day
   - Extra kilometer charge

### Dynamic Pricing

#### Weekend Rates
- Set multiplier (e.g., 1.2 for 20% increase)
- Applies Friday-Sunday automatically

#### Seasonal Rates
1. Click **Add Seasonal Rate**
2. Set date range
3. Set multiplier or fixed adjustment
4. Name the season (e.g., "Summer Peak")

#### Long-term Discounts
- Weekly: 7+ days (e.g., 10% off)
- Monthly: 30+ days (e.g., 20% off)
- Auto-applied at checkout

### Creating Promotions

1. Navigate to **Marketing → Coupons**
2. Click **Create Coupon**
3. Configure:
   - Code (e.g., SUMMER20)
   - Type: Percentage or Fixed Amount
   - Minimum spend
   - Valid dates
   - Usage limit
   - Applicable vehicles

## 📅 Availability Management

### Blocking Dates

1. Go to **Fleet → Availability**
2. Select vehicle
3. Click dates to block
4. Choose reason:
   - Maintenance
   - Private use
   - Show/event
   - Other

### Maintenance Scheduling

1. **Fleet → Maintenance**
2. Click **Schedule Maintenance**
3. Select:
   - Vehicle
   - Type (routine, repair, inspection)
   - Date range
   - Estimated cost
   - Notes
4. System auto-blocks availability

### Managing Buffers

Set buffer time between rentals:
1. **Settings → Booking Rules**
2. Set hours required between bookings
3. Typically 2-4 hours for cleaning/inspection

## 📋 Booking Management

### Viewing Bookings

**Dashboard** shows:
- Today's pickups/returns
- Pending confirmations
- Upcoming week overview

**Bookings → All Bookings** for full list with filters:
- Status (Pending, Confirmed, Active, Completed)
- Date range
- Vehicle
- Customer

### Booking Statuses

- **Pending**: Awaiting payment confirmation
- **Confirmed**: Payment received, ready for pickup
- **In Progress**: Vehicle with customer
- **Completed**: Returned and finalized
- **Cancelled**: Cancelled by customer or admin
- **No Show**: Customer didn't pick up

### Processing a Booking

#### Confirmation
1. Payment automatically verified via Stripe
2. Review special requests
3. Send confirmation if needed
4. Prepare vehicle

#### Day Before Pickup
1. System sends automatic reminder
2. Verify license on file
3. Check special requests
4. Confirm vehicle ready

#### Pickup Day
1. Verify customer identity
2. Check driver's license
3. Inspect vehicle with customer
4. Document existing damage
5. Process security deposit
6. Have customer sign contract
7. Update status to "In Progress"
8. Hand over keys

#### Return Process
1. Inspect vehicle with customer
2. Check mileage
3. Document any new damage
4. Calculate extra charges if any
5. Process final payment
6. Release security deposit
7. Update status to "Completed"
8. Send receipt

### Modifying Bookings

1. Click booking to open details
2. Click **Edit Booking**
3. Available modifications:
   - Extend/shorten dates
   - Change vehicle (if available)
   - Add/remove add-ons
   - Update pickup method
4. System recalculates price
5. Process payment difference

### Cancellations

#### Customer Cancellation
- Review cancellation policy
- Calculate fees based on timing
- Process refund minus fees
- Release vehicle availability
- Send confirmation

#### Admin Cancellation
1. Select reason:
   - Vehicle issue
   - Customer request
   - Policy violation
   - Other
2. Waive fees if appropriate
3. Process full refund
4. Notify customer with explanation

## 💳 Payment Management

### Payment Overview

**Payments → Dashboard** shows:
- Daily revenue
- Pending captures
- Active holds
- Recent refunds

### Processing Payments

#### Security Deposits
- Automatically held on card
- Not captured (just authorized)
- Release after inspection
- Capture if damage/violations

#### Manual Charges
For damages or extras:
1. Go to booking
2. Click **Add Charge**
3. Enter amount and reason
4. Upload supporting docs
5. Charge saved card

#### Refunds
1. Go to payment
2. Click **Refund**
3. Choose full or partial
4. Enter reason
5. Confirm processing

### Cash Payments

If enabled:
1. Mark booking as "Cash Payment"
2. Still require card for deposit
3. Collect cash at pickup
4. Record in system
5. Issue manual receipt

## 👥 Customer Management

### Customer Profiles

View includes:
- Personal information
- Booking history
- Payment methods
- Documents
- Notes and flags

### License Verification

1. **Customers → Pending Verification**
2. Review uploaded license
3. Check:
   - Validity dates
   - Matching information
   - Restrictions
   - International validity
4. Mark as verified or request new upload

### Customer Flags

Set flags for:
- VIP status
- Blacklist
- Requires approval
- Special instructions

### Customer Communications

1. Click customer profile
2. **Send Message**
3. Choose channel:
   - Email
   - SMS
   - WhatsApp (if enabled)
4. Use template or custom
5. Track in history

## 📊 Reports & Analytics

### Available Reports

#### Revenue Reports
- Daily/Weekly/Monthly revenue
- Revenue by vehicle
- Revenue by category
- Add-on performance
- Coupon usage

#### Utilization Reports
- Fleet utilization rate
- Individual vehicle performance
- Peak booking times
- Average rental duration

#### Customer Reports
- New vs returning
- Customer lifetime value
- Geographic distribution
- Acquisition channels

### Exporting Data

1. Select report type
2. Set date range
3. Apply filters
4. Click **Export**
5. Choose format:
   - CSV
   - Excel
   - PDF

### Custom Reports

Request via **Reports → Custom**:
- Specify metrics needed
- Frequency
- Format
- Distribution list

## 🎨 Content Management

### Homepage Management

Via Sanity CMS:
1. Access studio.valorerent.com
2. Edit sections:
   - Hero content
   - Featured vehicles
   - Testimonials
   - Service highlights

### Adding Testimonials

1. **Content → Testimonials**
2. Click **Add Testimonial**
3. Enter:
   - Customer name and title
   - Quote
   - Rating
   - Vehicle rented
   - Photo (optional)
4. Set as published

### Blog/News (Optional)

1. **Content → Articles**
2. Create article
3. Add SEO metadata
4. Schedule or publish

## ⚙️ System Settings

### Booking Rules

Configure at **Settings → Booking**:
- Minimum/maximum rental period
- Advance booking window
- Buffer time between rentals
- Pickup/return hours
- Age requirements
- License requirements

### Payment Settings

**Settings → Payments**:
- Accepted payment methods
- Security deposit amounts
- Currency options
- Tax rates
- Invoice settings

### Notification Settings

**Settings → Notifications**:
- Email templates
- SMS templates
- Trigger timing
- Reminder schedules
- Admin alerts

### Delivery Zones

1. **Settings → Delivery**
2. Draw zones on map
3. Set pricing:
   - Free delivery radius
   - Per-km charges
   - Flat fees by zone

## 🚨 Handling Issues

### Common Scenarios

#### Vehicle Breakdown
1. Mark vehicle as maintenance
2. Contact customer immediately
3. Arrange replacement vehicle
4. Document incident
5. No charges to customer
6. Follow up post-resolution

#### Accident/Damage
1. Ensure customer safety
2. Document thoroughly
3. Contact insurance
4. File police report if needed
5. Process via insurance
6. Update vehicle status

#### Customer Complaints
1. Respond within 2 hours
2. Document in system
3. Investigate thoroughly
4. Offer resolution
5. Follow up
6. Log for patterns

#### Payment Disputes
1. Gather documentation
2. Respond to chargeback
3. Provide evidence:
   - Signed contract
   - Photos
   - Communications
4. Work with Stripe support

### Emergency Contacts

- Technical Support: flyrentalsca@gmail.com
- Stripe Support: [Dashboard](https://dashboard.stripe.com)
- Insurance: [Policy details]
- Legal: [Contact info]

## 📱 Mobile Admin (Coming Soon)

- View bookings
- Process pickups/returns
- Take photos
- Quick communications
- Emergency actions

## 🔐 Security Best Practices

1. **Use strong passwords**
2. **Enable 2FA**
3. **Don't share credentials**
4. **Log out when done**
5. **Report suspicious activity**
6. **Regular password updates**
7. **Verify customer identity**
8. **Secure payment handling**

## 📚 Training Resources

- Video tutorials: [Training portal]
- Documentation: This guide
- Practice environment: staging.valorerent.com
- Support: flyrentalsca@gmail.com

## 🆘 Getting Help

### Support Channels
- **Urgent**: Call admin hotline
- **Non-urgent**: flyrentalsca@gmail.com
- **Technical**: flyrentalsca@gmail.com
- **Feature requests**: Via admin panel feedback

### Useful Links
- [Admin Panel](https://admin.valorerent.com)
- [Stripe Dashboard](https://dashboard.stripe.com)
- [Sanity Studio](https://studio.valorerent.com)
- [Status Page](https://status.valorerent.com)

---

**Last Updated**: January 2024
**Version**: 1.0
