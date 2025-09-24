import { PrismaClient, Role, CarCategory, BodyType, TransmissionType, FuelType, DrivetrainType, AddOnCategory, PriceType, UserStatus, DiscountType } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

// Luxury car data based on VollStoff Rentals fleet
const LUXURY_CARS = [
  {
    make: 'Audi',
    model: 'S5',
    year: 2020,
    trim: 'Sportback',
    displayName: 'Audi S5 Sportback',
    category: CarCategory.SPORT,
    bodyType: BodyType.SEDAN,
    transmission: TransmissionType.AUTOMATIC,
    fuelType: FuelType.PETROL,
    drivetrain: DrivetrainType.AWD,
    seats: 5,
    doors: 4,
    engineSize: 3.0,
    engineType: 'Turbo V6',
    horsePower: 349,
    torque: 369,
    topSpeed: 250,
    acceleration: 4.7,
    fuelConsumption: 8.3,
    features: [
      'quattro All-Wheel Drive',
      'Virtual Cockpit',
      'MMI Navigation Plus',
      'Bang & Olufsen Sound System',
      'Audi Drive Select',
      'Sport Differential',
      'Adaptive Cruise Control',
      'Audi Pre Sense'
    ],
    basePricePerDay: 220,
    depositAmount: 2200,
    primaryImageUrl: '/AudiS5-1.jpg'
  },
  {
    make: 'Audi',
    model: 'S3',
    year: 2019,
    trim: 'Sedan',
    displayName: 'Audi S3 Sedan',
    category: CarCategory.SPORT,
    bodyType: BodyType.SEDAN,
    transmission: TransmissionType.AUTOMATIC,
    fuelType: FuelType.PETROL,
    drivetrain: DrivetrainType.AWD,
    seats: 5,
    doors: 4,
    engineSize: 2.0,
    engineType: 'Turbo I4',
    horsePower: 288,
    torque: 280,
    topSpeed: 250,
    acceleration: 4.8,
    fuelConsumption: 7.4,
    features: [
      'quattro All-Wheel Drive',
      'Virtual Cockpit',
      'MMI Navigation',
      'Audi Sound System',
      'Audi Drive Select',
      'Sport Suspension',
      'LED Headlights',
      'Audi Pre Sense'
    ],
    basePricePerDay: 200,
    depositAmount: 2000,
    primaryImageUrl: '/AudiS3-1.jpg'
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
    currency: 'CAD',
    icon: 'shield'
  },
  {
    slug: 'extra-mileage-pack',
    name: 'Extra Mileage Pack',
    description: 'Additional 200km per day',
    category: AddOnCategory.SERVICE,
    priceType: PriceType.PER_DAY,
    price: 100,
    currency: 'CAD',
    icon: 'road'
  },
  {
    slug: 'child-seat',
    name: 'Child Safety Seat',
    description: 'Premium child seat suitable for 0-4 years',
    category: AddOnCategory.EQUIPMENT,
    priceType: PriceType.PER_BOOKING,
    price: 50,
    currency: 'CAD',
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
    currency: 'CAD',
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
    currency: 'CAD',
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
    currency: 'CAD',
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
    content: 'Exceptional service from start to finish. The Audi S5 Sportback was immaculate, and the delivery to my hotel was seamless. VollStoff Rentals sets the standard for luxury car rentals.',
    rating: 5,
    carModel: 'Audi S5 Sportback',
    isPublished: true,
    publishedAt: new Date()
  },
  {
    authorName: 'Isabella Martinez',
    authorTitle: 'Fashion Designer',
    content: 'The Audi S3 Sedan was perfect for my photoshoot in Toronto. The team at VollStoff Rentals understood exactly what I needed and went above and beyond to accommodate my schedule.',
    rating: 5,
    carModel: 'Audi S3 Sedan',
    isPublished: true,
    publishedAt: new Date()
  },
  {
    authorName: 'James Wellington',
    authorTitle: 'Private Investor',
    content: 'I\'ve rented luxury cars worldwide, but VollStoff Rentals\' attention to detail is unmatched. The Audi S5 was pristine, and their concierge service made everything effortless.',
    rating: 5,
    carModel: 'Audi S5 Sportback',
    isPublished: true,
    publishedAt: new Date()
  },
  {
    authorName: 'Sophia Laurent',
    authorTitle: 'Art Gallery Director',
    content: 'Driving the Audi S3 through the city was a dream come true. VollStoff Rentals\' team curated the perfect route and even arranged a private lunch at a vineyard.',
    rating: 5,
    carModel: 'Audi S3 Sedan',
    isPublished: true,
    publishedAt: new Date()
  },
  {
    authorName: 'Michael Thompson',
    authorTitle: 'Film Producer',
    content: 'For my anniversary, I surprised my wife with an Audi S5. The car was stunning, and the premium experience made it unforgettable. Truly five-star service.',
    rating: 5,
    carModel: 'Audi S5 Sportback',
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
            currency: 'CAD',
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
      basePriceTotal: 660, // 3 days * 220 CAD
      feesTotal: 15,
      taxTotal: 67.5,
      totalAmount: 742.5,
      currency: 'CAD',
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
      currency: 'CAD',
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
    - ${cars.length} Audi cars with images and pricing (S5: 220 CAD/day, S3: 200 CAD/day)
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
