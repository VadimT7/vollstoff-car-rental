import { PrismaClient, Role, CarCategory, BodyType, TransmissionType, FuelType, DrivetrainType, AddOnCategory, PriceType, UserStatus, DiscountType } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

// Luxury car data based on FlyRentals fleet
const LUXURY_CARS = [
  {
    make: 'Mercedes-Benz',
    model: 'CLA',
    year: 2024,
    trim: 'AMG',
    displayName: 'Mercedes-Benz CLA AMG',
    category: CarCategory.LUXURY,
    bodyType: BodyType.SEDAN,
    transmission: TransmissionType.AUTOMATIC,
    fuelType: FuelType.PETROL,
    drivetrain: DrivetrainType.AWD,
    seats: 5,
    doors: 4,
    engineSize: 2.0,
    engineType: 'Turbo I4',
    horsePower: 382,
    torque: 354,
    topSpeed: 270,
    acceleration: 4.0,
    fuelConsumption: 8.5,
    features: [
      'AMG Performance 4MATIC+',
      'MBUX Infotainment',
      'AMG Ride Control Suspension',
      'AMG Performance Exhaust',
      'Burmester Surround Sound',
      'Ambient Lighting',
      'Wireless Charging',
      'Head-Up Display'
    ],
    basePricePerDay: 549,
    depositAmount: 4500,
    primaryImageUrl: '/Mercedes-CLA-AMG-2024.jpg'
  },
  {
    make: 'Mercedes-Benz',
    model: 'C43',
    year: 2023,
    trim: 'AMG',
    displayName: 'Mercedes-Benz C43 AMG',
    category: CarCategory.LUXURY,
    bodyType: BodyType.SEDAN,
    transmission: TransmissionType.AUTOMATIC,
    fuelType: FuelType.HYBRID,
    drivetrain: DrivetrainType.AWD,
    seats: 5,
    doors: 4,
    engineSize: 2.0,
    engineType: 'Turbo I4 + Electric',
    horsePower: 402,
    torque: 500,
    topSpeed: 250,
    acceleration: 4.6,
    fuelConsumption: 7.8,
    features: [
      'AMG Performance 4MATIC+',
      'EQ Boost Hybrid System',
      'AMG Speedshift TCT',
      'Digital Cockpit',
      'Burmester Sound System',
      'Adaptive Damping',
      'Wireless Charging',
      'MBUX Navigation'
    ],
    basePricePerDay: 499,
    depositAmount: 4000,
    primaryImageUrl: '/C43Silver-1.jpg'
  },
  {
    make: 'Mercedes-Benz',
    model: 'CLA',
    year: 2018,
    trim: '250',
    displayName: 'Mercedes-Benz CLA 250',
    category: CarCategory.LUXURY,
    bodyType: BodyType.SEDAN,
    transmission: TransmissionType.AUTOMATIC,
    fuelType: FuelType.PETROL,
    drivetrain: DrivetrainType.FWD,
    seats: 5,
    doors: 4,
    engineSize: 2.0,
    engineType: 'Turbo I4',
    horsePower: 208,
    torque: 258,
    topSpeed: 210,
    acceleration: 6.9,
    fuelConsumption: 7.5,
    features: [
      '7G-DCT Transmission',
      'COMAND Navigation',
      'Panoramic Sunroof',
      'LED Headlights',
      'Apple CarPlay',
      'Android Auto',
      'Blind Spot Assist',
      'Parking Sensors'
    ],
    basePricePerDay: 299,
    depositAmount: 2500,
    primaryImageUrl: '/2018-CLA250.jpg'
  },
  {
    make: 'Porsche',
    model: 'Cayenne',
    year: 2024,
    trim: 'Base',
    displayName: 'Porsche Cayenne',
    category: CarCategory.SUV,
    bodyType: BodyType.SUV,
    transmission: TransmissionType.AUTOMATIC,
    fuelType: FuelType.PETROL,
    drivetrain: DrivetrainType.AWD,
    seats: 5,
    doors: 4,
    engineSize: 3.0,
    engineType: 'Turbo V6',
    horsePower: 335,
    torque: 332,
    topSpeed: 245,
    acceleration: 5.9,
    fuelConsumption: 9.2,
    features: [
      'Porsche Active Suspension Management',
      'Porsche Traction Management',
      'Sport Chrono Package',
      'Porsche Communication Management',
      'BOSE Surround Sound',
      'LED Matrix Headlights',
      'Adaptive Cruise Control',
      'Panoramic Roof'
    ],
    basePricePerDay: 699,
    depositAmount: 6000,
    primaryImageUrl: '/PorscheCayenneWhite-1.jpg'
  }
]

// Add-ons data
const ADD_ONS = [
  {
    slug: 'premium-insurance',
    name: 'Premium Insurance Package',
    description: 'Comprehensive coverage with zero deductible',
    category: AddOnCategory.INSURANCE,
    priceType: PriceType.PER_DAY,
    price: 150,
    icon: 'shield'
  },
  {
    slug: 'extra-mileage-pack',
    name: 'Extra Mileage Pack',
    description: 'Additional 200km per day',
    category: AddOnCategory.SERVICE,
    priceType: PriceType.PER_DAY,
    price: 100,
    icon: 'road'
  },
  {
    slug: 'child-seat',
    name: 'Child Safety Seat',
    description: 'Premium child seat suitable for 0-4 years',
    category: AddOnCategory.EQUIPMENT,
    priceType: PriceType.PER_BOOKING,
    price: 50,
    icon: 'baby',
    maxQuantity: 2
  },
  {
    slug: 'personal-chauffeur',
    name: 'Personal Chauffeur',
    description: 'Professional driver for your journey',
    category: AddOnCategory.SERVICE,
    priceType: PriceType.PER_DAY,
    price: 500,
    icon: 'user-tie',
    requiresApproval: true
  },
  {
    slug: 'photographer-package',
    name: 'Professional Photoshoot',
    description: '2-hour photoshoot with your rental car',
    category: AddOnCategory.EXPERIENCE,
    priceType: PriceType.PER_BOOKING,
    price: 800,
    icon: 'camera',
    requiresApproval: true
  },
  {
    slug: 'champagne-flowers',
    name: 'Champagne & Flowers Welcome',
    description: 'Dom Pérignon and fresh flower arrangement',
    category: AddOnCategory.EXPERIENCE,
    priceType: PriceType.PER_BOOKING,
    price: 350,
    icon: 'champagne'
  }
]

// Coupons data
const COUPONS = [
  {
    code: 'WELCOME10',
    description: 'First-time customer discount',
    discountType: DiscountType.PERCENTAGE,
    discountValue: 10,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    minimumAmount: 1000
  },
  {
    code: 'SUMMER2024',
    description: 'Summer special offer',
    discountType: DiscountType.PERCENTAGE,
    discountValue: 15,
    validFrom: new Date('2024-06-01'),
    validUntil: new Date('2024-08-31'),
    minimumAmount: 2000
  },
  {
    code: 'VIP500',
    description: 'VIP customer flat discount',
    discountType: DiscountType.FIXED_AMOUNT,
    discountValue: 500,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months
    minimumAmount: 3000,
    usageLimit: 100
  }
]

// Testimonials data
const TESTIMONIALS = [
  {
    authorName: 'Alexander Chen',
    authorTitle: 'CEO, Tech Innovations',
    content: 'Exceptional service from start to finish. The Mercedes CLA AMG was immaculate, and the delivery to my hotel was seamless. FlyRentals sets the standard for luxury car rentals.',
    rating: 5,
    carModel: 'Mercedes-Benz CLA AMG',
    isPublished: true,
    publishedAt: new Date()
  },
  {
    authorName: 'Isabella Martinez',
    authorTitle: 'Fashion Designer',
    content: 'The Mercedes C43 AMG was perfect for my photoshoot in Monaco. The team at FlyRentals understood exactly what I needed and went above and beyond to accommodate my schedule.',
    rating: 5,
    carModel: 'Mercedes-Benz C43 AMG',
    isPublished: true,
    publishedAt: new Date()
  },
  {
    authorName: 'James Wellington',
    authorTitle: 'Private Investor',
    content: 'I\'ve rented luxury cars worldwide, but FlyRentals\' attention to detail is unmatched. The Porsche Cayenne was pristine, and their concierge service made everything effortless.',
    rating: 5,
    carModel: 'Porsche Cayenne',
    isPublished: true,
    publishedAt: new Date()
  },
  {
    authorName: 'Sophia Laurent',
    authorTitle: 'Art Gallery Director',
    content: 'Driving the Porsche Cayenne along the French Riviera was a dream come true. FlyRentals\' team curated the perfect route and even arranged a private lunch at a vineyard.',
    rating: 5,
    carModel: 'Porsche Cayenne',
    isPublished: true,
    publishedAt: new Date()
  },
  {
    authorName: 'Michael Thompson',
    authorTitle: 'Film Producer',
    content: 'For my anniversary, I surprised my wife with a Tesla Model X. The car was stunning, and the premium experience made it unforgettable. Truly five-star service.',
    rating: 5,
    carModel: 'Tesla Model X Plaid',
    isPublished: true,
    publishedAt: new Date()
  }
]

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  console.log('🧹 Clearing existing data...')
  await prisma.notification.deleteMany()
  await prisma.damageReport.deleteMany()
  await prisma.contract.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.bookingAddOn.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.maintenance.deleteMany()
  await prisma.availability.deleteMany()
  await prisma.seasonalRate.deleteMany()
  await prisma.priceRule.deleteMany()
  await prisma.carImage.deleteMany()
  await prisma.car.deleteMany()
  await prisma.addOn.deleteMany()
  await prisma.coupon.deleteMany()
  await prisma.testimonial.deleteMany()
  await prisma.paymentMethod.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.verificationToken.deleteMany()
  await prisma.user.deleteMany()

  // Create admin user
  console.log('👤 Creating admin user...')
  await prisma.user.create({
    data: {
      email: 'flyrentalsca@gmail.com',
      name: 'Admin User',
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      isVerified: true,
      emailVerified: new Date(),
      acceptedTermsAt: new Date()
    }
  })

  // Create test customer
  console.log('👤 Creating test customer...')
  const customerUser = await prisma.user.create({
    data: {
      email: 'customer@example.com',
      name: 'John Doe',
      phone: '+14386803936',
      role: Role.CUSTOMER,
      status: UserStatus.ACTIVE,
      isVerified: true,
      emailVerified: new Date(),
      acceptedTermsAt: new Date(),
      dateOfBirth: new Date('1990-01-01'),
      licenseNumber: 'DL123456789',
      licenseExpiry: new Date('2028-01-01'),
      licenseVerified: true,
      addressLine1: '123 Luxury Lane',
      city: 'Monaco',
      postalCode: '98000',
      country: 'Monaco'
    }
  })

  // Create cars with images and price rules
  console.log('🚗 Creating luxury cars...')
  const cars = []
  for (const carData of LUXURY_CARS) {
    const { basePricePerDay, depositAmount, primaryImageUrl, ...carInfo } = carData
    
    const car = await prisma.car.create({
      data: {
        ...carInfo,
        slug: `${carInfo.make}-${carInfo.model}-${carInfo.year}`.toLowerCase().replace(/\s+/g, '-'),
        description: `Experience the pinnacle of automotive excellence with the ${carInfo.displayName}. This ${carInfo.year} masterpiece combines breathtaking performance with uncompromising luxury, delivering ${carInfo.horsePower} horsepower and a top speed of ${carInfo.topSpeed} km/h.`,
        primaryImageUrl: primaryImageUrl,
        featured: Math.random() > 0.5,
        featuredOrder: Math.floor(Math.random() * 10),
        images: {
          create: [{
            url: primaryImageUrl,
            alt: `${carInfo.displayName} - Primary Image`,
            order: 0,
            isGallery: true
          }]
        },
        priceRules: {
          create: {
            basePricePerDay,
            depositAmount,
            weekendMultiplier: 1.15,
            weeklyDiscount: 0.10,
            monthlyDiscount: 0.20,
            minimumDays: 1,
            maximumDays: 30,
            includedKmPerDay: 200,
            extraKmPrice: 5
          }
        }
      },
      include: {
        priceRules: true,
        images: true
      }
    })
    cars.push(car)
  }

  // Create seasonal rates for summer
  console.log('📅 Creating seasonal rates...')
  for (const car of cars) {
    if (car.priceRules[0]) {
      await prisma.seasonalRate.create({
        data: {
          priceRuleId: car.priceRules[0].id,
          name: 'Summer Peak Season',
          startDate: new Date('2024-07-01'),
          endDate: new Date('2024-08-31'),
          multiplier: 1.25
        }
      })
    }
  }

  // Create add-ons
  console.log('🎁 Creating add-ons...')
  for (const addOnData of ADD_ONS) {
    await prisma.addOn.create({
      data: addOnData
    })
  }

  // Create coupons
  console.log('🎟️ Creating coupons...')
  for (const couponData of COUPONS) {
    await prisma.coupon.create({
      data: couponData
    })
  }

  // Create testimonials
  console.log('💬 Creating testimonials...')
  for (let i = 0; i < TESTIMONIALS.length; i++) {
    await prisma.testimonial.create({
      data: {
        ...TESTIMONIALS[i],
        order: i
      }
    })
  }

  // Create sample availability for the next 90 days
  console.log('📅 Creating availability data...')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  for (const car of cars) {
    const availabilityData = []
    for (let i = 0; i < 90; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)
      
      // Make some random dates unavailable (10% chance)
      const isAvailable = Math.random() > 0.1
      
      availabilityData.push({
        carId: car.id,
        date,
        isAvailable,
        reason: isAvailable ? null : faker.helpers.arrayElement(['maintenance', 'booked', 'blocked'])
      })
    }
    
    await prisma.availability.createMany({
      data: availabilityData
    })
  }

  // Create a sample booking
  console.log('📝 Creating sample booking...')
  const sampleCar = cars[0]
  const startDate = new Date(today)
  startDate.setDate(startDate.getDate() + 7)
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + 3)

  const booking = await prisma.booking.create({
    data: {
      bookingNumber: `VR${Date.now()}`,
      userId: customerUser.id,
      carId: sampleCar.id,
      startDate,
      endDate,
      pickupType: 'SHOWROOM',
      returnType: 'SHOWROOM',
      basePriceTotal: 7500, // 3 days * 2500
      feesTotal: 150,
      taxTotal: 765,
      totalAmount: 8415,
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      includedKm: 600, // 3 days * 200km
      confirmedAt: new Date(),
      addOns: {
        create: [
          {
            addOnId: (await prisma.addOn.findFirst({ where: { slug: 'premium-insurance' } }))!.id,
            quantity: 3,
            unitPrice: 150,
            totalPrice: 450
          }
        ]
      }
    }
  })

  // Create payment for the booking
  await prisma.payment.create({
    data: {
      bookingId: booking.id,
      stripePaymentIntentId: `pi_${faker.string.alphanumeric(24)}`,
      amount: booking.totalAmount,
      type: 'RENTAL_FEE',
      method: 'CARD',
      status: 'SUCCEEDED',
      processedAt: new Date()
    }
  })

  console.log('✅ Database seed completed successfully!')
  console.log(`
    Created:
    - 2 users (flyrentalsca@gmail.com, customer@example.com)
    - ${cars.length} luxury cars with images and pricing
    - ${ADD_ONS.length} add-ons
    - ${COUPONS.length} coupons
    - ${TESTIMONIALS.length} testimonials
    - 1 sample booking with payment
    - 90 days of availability data
  `)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
