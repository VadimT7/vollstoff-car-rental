import { PrismaClient, Role, CarCategory, BodyType, TransmissionType, FuelType, DrivetrainType, AddOnCategory, PriceType, UserStatus, DiscountType } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

// Luxury car data for Top Tier Rental fleet
const LUXURY_CARS = [
  {
    make: 'Ferrari',
    model: 'SF90 Stradale',
    year: 2024,
    trim: 'Stradale',
    displayName: 'Ferrari SF90 Stradale',
    category: CarCategory.SUPERCAR,
    bodyType: BodyType.COUPE,
    transmission: TransmissionType.AUTOMATIC,
    fuelType: FuelType.HYBRID,
    drivetrain: DrivetrainType.AWD,
    seats: 2,
    doors: 2,
    engineSize: 4.0,
    engineType: 'Twin-Turbo V8 + Electric',
    horsePower: 986,
    torque: 800,
    topSpeed: 340,
    acceleration: 2.5,
    fuelConsumption: 8.0,
    features: [
      'Plug-in Hybrid System',
      'Three Electric Motors',
      'Carbon Fiber Body',
      'Active Aerodynamics',
      'E-Manettino Drive Modes',
      'Side Slip Control',
      'Racing Telemetry',
      'Carbon Ceramic Brakes'
    ],
    basePricePerDay: 2999,
    depositAmount: 25000,
    primaryImageUrl: '/SF90-1.jpg'
  },
  {
    make: 'Bentley',
    model: 'Continental GT Speed',
    year: 2024,
    trim: 'Speed W12',
    displayName: 'Bentley Continental GT Speed W12',
    category: CarCategory.LUXURY,
    bodyType: BodyType.COUPE,
    transmission: TransmissionType.AUTOMATIC,
    fuelType: FuelType.PETROL,
    drivetrain: DrivetrainType.AWD,
    seats: 4,
    doors: 2,
    engineSize: 6.0,
    engineType: 'Twin-Turbo W12',
    horsePower: 650,
    torque: 900,
    topSpeed: 335,
    acceleration: 3.5,
    fuelConsumption: 15.0,
    features: [
      'All-Wheel Drive',
      'Air Suspension',
      'Naim Premium Audio',
      'Diamond Quilted Leather',
      'Rotating Display',
      'Night Vision',
      'Massage Seats',
      'Bentley Dynamic Ride'
    ],
    basePricePerDay: 1799,
    depositAmount: 15000,
    primaryImageUrl: '/Bentley Continental Speed W12 - 1.jpg'
  },
  {
    make: 'Bentley',
    model: 'Bentayga',
    year: 2024,
    trim: 'W12',
    displayName: 'Bentley Bentayga W12',
    category: CarCategory.SUV,
    bodyType: BodyType.SUV,
    transmission: TransmissionType.AUTOMATIC,
    fuelType: FuelType.PETROL,
    drivetrain: DrivetrainType.AWD,
    seats: 5,
    doors: 4,
    engineSize: 6.0,
    engineType: 'Twin-Turbo W12',
    horsePower: 626,
    torque: 900,
    topSpeed: 306,
    acceleration: 3.9,
    fuelConsumption: 14.5,
    features: [
      'All-Terrain Specification',
      'Bentley Dynamic Ride',
      'Diamond Illumination',
      'Rear Entertainment Tablets',
      'Panoramic Sunroof',
      'Night Vision',
      'Naim Audio System',
      'Picnic Tables'
    ],
    basePricePerDay: 1599,
    depositAmount: 14000,
    primaryImageUrl: '/Bentley Bentayga W12 - 1.jpg'
  },
  {
    make: 'Mercedes-Benz',
    model: 'S-Class',
    year: 2024,
    trim: 'S580 4MATIC',
    displayName: 'Mercedes-Benz S580',
    category: CarCategory.LUXURY,
    bodyType: BodyType.SEDAN,
    transmission: TransmissionType.AUTOMATIC,
    fuelType: FuelType.PETROL,
    drivetrain: DrivetrainType.AWD,
    seats: 5,
    doors: 4,
    engineSize: 4.0,
    engineType: 'Twin-Turbo V8',
    horsePower: 496,
    torque: 700,
    topSpeed: 250,
    acceleration: 4.4,
    fuelConsumption: 10.5,
    features: [
      '4MATIC All-Wheel Drive',
      'E-Active Body Control',
      'Burmester 4D Sound',
      'MBUX Rear Tablet',
      'Executive Rear Seats',
      'Massage Seats',
      'Augmented Reality Navigation',
      'Digital Light'
    ],
    basePricePerDay: 999,
    depositAmount: 10000,
    primaryImageUrl: '/Mercedes-Benz-S580-1.jpg'
  },
  {
    make: 'Rolls-Royce',
    model: 'Dawn',
    year: 2024,
    trim: 'Black Badge',
    displayName: 'Rolls-Royce Dawn',
    category: CarCategory.LUXURY,
    bodyType: BodyType.CONVERTIBLE,
    transmission: TransmissionType.AUTOMATIC,
    fuelType: FuelType.PETROL,
    drivetrain: DrivetrainType.RWD,
    seats: 4,
    doors: 2,
    engineSize: 6.6,
    engineType: 'Twin-Turbo V12',
    horsePower: 593,
    torque: 840,
    topSpeed: 250,
    acceleration: 4.3,
    fuelConsumption: 14.2,
    features: [
      'Spirit of Ecstasy',
      'Starlight Headliner',
      'Bespoke Audio System',
      'Lamb\'s Wool Floor Mats',
      'Umbrellas in Doors',
      'Satellite Aided Transmission',
      'Night Vision',
      'Soft-Close Doors'
    ],
    basePricePerDay: 2499,
    depositAmount: 20000,
    primaryImageUrl: '/Rolls-Royce-Dawn.jpg'
  },
  {
    make: 'Lamborghini',
    model: 'Urus',
    year: 2024,
    trim: 'S',
    displayName: 'Lamborghini Urus',
    category: CarCategory.SUV,
    bodyType: BodyType.SUV,
    transmission: TransmissionType.AUTOMATIC,
    fuelType: FuelType.PETROL,
    drivetrain: DrivetrainType.AWD,
    seats: 5,
    doors: 4,
    engineSize: 4.0,
    engineType: 'Twin-Turbo V8',
    horsePower: 666,
    torque: 850,
    topSpeed: 305,
    acceleration: 3.5,
    fuelConsumption: 12.7,
    features: [
      'Active Roll Stabilization',
      'Carbon Ceramic Brakes',
      'Adaptive Air Suspension',
      'Premium Bang & Olufsen Sound',
      'Lamborghini Infotainment System',
      'Night Vision',
      'Head-Up Display',
      'Massage Seats'
    ],
    basePricePerDay: 1399,
    depositAmount: 12000,
    primaryImageUrl: '/lamborghini-driving.mp4'
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
    content: 'Exceptional service from start to finish. The Ferrari SF90 was immaculate, and the delivery to my hotel was seamless. Top Tier Rental sets the standard for luxury car rentals.',
    rating: 5,
    carModel: 'Lamborghini Huracán',
    isPublished: true,
    publishedAt: new Date()
  },
  {
    authorName: 'Isabella Martinez',
    authorTitle: 'Fashion Designer',
    content: 'The Lamborghini Urus was perfect for my photoshoot in Dubai. The team at Top Tier Rental understood exactly what I needed and went above and beyond to accommodate my schedule.',
    rating: 5,
    carModel: 'Lamborghini Urus',
    isPublished: true,
    publishedAt: new Date()
  },
  {
    authorName: 'James Wellington',
    authorTitle: 'Private Investor',
    content: 'I\'ve rented luxury cars worldwide, but Top Tier Rental\'s attention to detail is unmatched. The Mercedes-Benz S580 was pristine, and their concierge service made everything effortless.',
    rating: 5,
    carModel: 'Mercedes-AMG SL63',
    isPublished: true,
    publishedAt: new Date()
  },
  {
    authorName: 'Sophia Laurent',
    authorTitle: 'Art Gallery Director',
    content: 'Driving the Bentley Continental GT through the city was a dream come true. Top Tier Rental\'s team curated the perfect route and even arranged a private lunch at a vineyard.',
    rating: 5,
    carModel: 'Lamborghini Huracán',
    isPublished: true,
    publishedAt: new Date()
  },
  {
    authorName: 'Michael Thompson',
    authorTitle: 'Film Producer',
    content: 'For my anniversary, I surprised my wife with the Rolls-Royce Dawn from Top Tier Rental. The car was stunning, and the premium experience made it unforgettable. Truly five-star service.',
    rating: 5,
    carModel: 'Mercedes-AMG SL63',
    isPublished: true,
    publishedAt: new Date()
  },
  {
    authorName: 'Daniel Rodriguez',
    authorTitle: 'Professional Racer',
    content: 'The Ferrari SF90 Stradale is an absolute masterpiece! Top Tier Rental delivered it in perfect condition. The hybrid power and raw performance exceeded my expectations. A true driver\'s car!',
    rating: 5,
    carModel: 'Porsche 911 GT3 RS',
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
    - ${cars.length} luxury cars with images and pricing (Huracán: 999 CAD/day, Urus: 1199 CAD/day, SL63: 899 CAD/day, GT3 RS: 949 CAD/day)
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
