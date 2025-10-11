import { PrismaClient, Role, CarCategory, BodyType, TransmissionType, FuelType, DrivetrainType, AddOnCategory, PriceType, UserStatus, DiscountType } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

// Luxury car data based on Elite Motion Rentals fleet
const LUXURY_CARS = [
  {
    make: 'Lamborghini',
    model: 'Huracán',
    year: 2023,
    trim: 'EVO',
    displayName: 'Lamborghini Huracán',
    category: CarCategory.SPORT,
    bodyType: BodyType.COUPE,
    transmission: TransmissionType.AUTOMATIC,
    fuelType: FuelType.PETROL,
    drivetrain: DrivetrainType.AWD,
    seats: 2,
    doors: 2,
    engineSize: 5.2,
    engineType: 'V10',
    horsePower: 631,
    torque: 600,
    topSpeed: 325,
    acceleration: 2.9,
    fuelConsumption: 14.9,
    features: [
      'All-Wheel Drive',
      'Carbon Ceramic Brakes',
      'Alcantara Interior',
      'Performance Data Recorder',
      'Lamborghini Dynamic Steering',
      'Adaptive Suspension',
      'Launch Control',
      'Race Telemetry'
    ],
    basePricePerDay: 999,
    depositAmount: 10000,
    primaryImageUrl: '/Lamborghini-Huracan-Yellow.jpg'
  },
  {
    make: 'Lamborghini',
    model: 'Urus',
    year: 2023,
    trim: 'S',
    displayName: 'Lamborghini Urus',
    category: CarCategory.LUXURY,
    bodyType: BodyType.SUV,
    transmission: TransmissionType.AUTOMATIC,
    fuelType: FuelType.PETROL,
    drivetrain: DrivetrainType.AWD,
    seats: 5,
    doors: 4,
    engineSize: 4.0,
    engineType: 'Twin-Turbo V8',
    horsePower: 641,
    torque: 850,
    topSpeed: 305,
    acceleration: 3.6,
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
    basePricePerDay: 1199,
    depositAmount: 12000,
    primaryImageUrl: '/Lamborghini-Urus-Green.png'
  },
  {
    make: 'Mercedes-Benz',
    model: 'AMG SL63',
    year: 2023,
    trim: 'AMG',
    displayName: 'Mercedes-AMG SL63',
    category: CarCategory.LUXURY,
    bodyType: BodyType.CONVERTIBLE,
    transmission: TransmissionType.AUTOMATIC,
    fuelType: FuelType.PETROL,
    drivetrain: DrivetrainType.AWD,
    seats: 2,
    doors: 2,
    engineSize: 4.0,
    engineType: 'Twin-Turbo V8',
    horsePower: 577,
    torque: 800,
    topSpeed: 315,
    acceleration: 3.5,
    fuelConsumption: 11.8,
    features: [
      '4MATIC+ All-Wheel Drive',
      'AMG Active Ride Control',
      'Burmester 3D Surround Sound',
      'AMG Performance Steering Wheel',
      'Airscarf Neck-Level Heating',
      'AMG Track Pace',
      'Digital Light',
      'Active Multicontour Seats'
    ],
    basePricePerDay: 899,
    depositAmount: 9000,
    primaryImageUrl: '/Mercedes-AMG-SL63.png'
  },
  {
    make: 'Porsche',
    model: '911 GT3 RS',
    year: 2023,
    trim: 'GT3 RS',
    displayName: 'Porsche 911 GT3 RS',
    category: CarCategory.SPORT,
    bodyType: BodyType.COUPE,
    transmission: TransmissionType.AUTOMATIC,
    fuelType: FuelType.PETROL,
    drivetrain: DrivetrainType.RWD,
    seats: 2,
    doors: 2,
    engineSize: 4.0,
    engineType: 'Flat-6',
    horsePower: 518,
    torque: 465,
    topSpeed: 296,
    acceleration: 3.2,
    fuelConsumption: 12.4,
    features: [
      'Rear-Wheel Drive',
      'Carbon Ceramic Brakes',
      'Active Aerodynamics',
      'GT Sport Steering Wheel',
      'Track Precision App',
      'Rear-Axle Steering',
      'DRS Wing',
      'Racing Seats'
    ],
    basePricePerDay: 949,
    depositAmount: 9500,
    primaryImageUrl: '/Porsche-GT3RS-Grey-Black.jpg'
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
    content: 'Exceptional service from start to finish. The Lamborghini Huracán was immaculate, and the delivery to my hotel was seamless. Elite Motion Rentals sets the standard for luxury car rentals.',
    rating: 5,
    carModel: 'Lamborghini Huracán',
    isPublished: true,
    publishedAt: new Date()
  },
  {
    authorName: 'Isabella Martinez',
    authorTitle: 'Fashion Designer',
    content: 'The Lamborghini Urus was perfect for my photoshoot in Dubai. The team at Elite Motion Rentals understood exactly what I needed and went above and beyond to accommodate my schedule.',
    rating: 5,
    carModel: 'Lamborghini Urus',
    isPublished: true,
    publishedAt: new Date()
  },
  {
    authorName: 'James Wellington',
    authorTitle: 'Private Investor',
    content: 'I\'ve rented luxury cars worldwide, but Elite Motion Rentals\' attention to detail is unmatched. The Mercedes-AMG SL63 was pristine, and their concierge service made everything effortless.',
    rating: 5,
    carModel: 'Mercedes-AMG SL63',
    isPublished: true,
    publishedAt: new Date()
  },
  {
    authorName: 'Sophia Laurent',
    authorTitle: 'Art Gallery Director',
    content: 'Driving the Lamborghini Huracán through the city was a dream come true. Elite Motion Rentals\' team curated the perfect route and even arranged a private lunch at a vineyard.',
    rating: 5,
    carModel: 'Lamborghini Huracán',
    isPublished: true,
    publishedAt: new Date()
  },
  {
    authorName: 'Michael Thompson',
    authorTitle: 'Film Producer',
    content: 'For my anniversary, I surprised my wife with the Mercedes-AMG SL63 from Elite Motion Rentals. The car was stunning, and the premium experience made it unforgettable. Truly five-star service.',
    rating: 5,
    carModel: 'Mercedes-AMG SL63',
    isPublished: true,
    publishedAt: new Date()
  },
  {
    authorName: 'Daniel Rodriguez',
    authorTitle: 'Professional Racer',
    content: 'The Porsche 911 GT3 RS is an absolute track weapon! Elite Motion Rentals delivered it in perfect condition. The precision and raw performance exceeded my expectations. A true driver\'s car!',
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
