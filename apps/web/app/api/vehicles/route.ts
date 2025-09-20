import { NextRequest, NextResponse } from 'next/server'
import { vehicleService } from '@valore/database'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const featured = searchParams.get('featured') === 'true'
    const category = searchParams.get('category')
    const slug = searchParams.get('slug')

    // If slug is provided, return single vehicle
    if (slug) {
      const vehicle = await vehicleService.findUnique({ slug }, {
        include: {
          priceRules: {
            where: {
              isActive: true,
              validFrom: { lte: new Date() },
              OR: [
                { validUntil: null },
                { validUntil: { gte: new Date() } }
              ]
            },
            take: 1
          },
          images: true
        }
      })

      if (!vehicle) {
        return NextResponse.json(
          { error: 'Vehicle not found' },
          { status: 404 }
        )
      }

      // Transform to match frontend expectations
      const transformed = {
        id: vehicle.id,
        slug: vehicle.slug,
        displayName: vehicle.displayName,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        category: vehicle.category,
        bodyType: vehicle.bodyType,
        description: vehicle.description,
        primaryImage: vehicle.primaryImageUrl || '/placeholder-car.jpg',
        // Include all images (primary first, then gallery) for the carousel
        images: [
          vehicle.primaryImageUrl || '/placeholder-car.jpg',
          ...((vehicle as any).images?.filter((img: any) => img.isGallery)?.map((img: any) => img.url) || [])
        ].filter(Boolean), // Remove any null/undefined values
        pricePerDay: Number((vehicle as any).priceRules?.[0]?.basePricePerDay) || 0,
        features: vehicle.features as string[],
        specs: {
          transmission: vehicle.transmission,
          fuelType: vehicle.fuelType,
          drivetrain: vehicle.drivetrain,
          seats: vehicle.seats,
          doors: vehicle.doors,
          engineSize: vehicle.engineSize,
          engineType: vehicle.engineType,
          horsePower: vehicle.horsePower,
          torque: vehicle.torque,
          topSpeed: vehicle.topSpeed,
          acceleration: vehicle.acceleration,
          fuelConsumption: vehicle.fuelConsumption
        },
        pricing: {
          basePricePerDay: (vehicle as any).priceRules?.[0]?.basePricePerDay || 0,
          weekendMultiplier: (vehicle as any).priceRules?.[0]?.weekendMultiplier || 1,
          weeklyDiscount: (vehicle as any).priceRules?.[0]?.weeklyDiscount || 0,
          monthlyDiscount: (vehicle as any).priceRules?.[0]?.monthlyDiscount || 0,
          minimumDays: (vehicle as any).priceRules?.[0]?.minimumDays || 1,
          maximumDays: (vehicle as any).priceRules?.[0]?.maximumDays || 30,
          includedKmPerDay: (vehicle as any).priceRules?.[0]?.includedKmPerDay || 200,
          extraKmPrice: (vehicle as any).priceRules?.[0]?.extraKmPrice || 0.5,
          depositAmount: (vehicle as any).priceRules?.[0]?.depositAmount || 500
        }
      }

      return NextResponse.json(transformed)
    }

    // Build where clause
    const where: any = {
      status: 'ACTIVE'
    }
    
    if (featured) {
      where.featured = true
    }
    
    if (category && category !== 'all') {
      where.category = category
    }

    const vehicles = await vehicleService.findMany(where, {
      include: {
        priceRules: {
          where: {
            isActive: true,
            validFrom: { lte: new Date() },
            OR: [
              { validUntil: null },
              { validUntil: { gte: new Date() } }
            ]
          },
          take: 1
        },
        images: {
          orderBy: { order: 'asc' },
          take: 1
        }
      },
      orderBy: featured ? [
        { featuredOrder: 'asc' },
        { createdAt: 'desc' }
      ] : [
        { createdAt: 'desc' }
      ]
    })

    console.log('🚗 Raw vehicles from database:', {
      count: vehicles.length,
      vehicles: vehicles.map(v => ({
        id: v.id,
        displayName: v.displayName,
        primaryImageUrl: v.primaryImageUrl,
        hasImages: !!(v as any).images,
        imagesCount: (v as any).images?.length || 0
      }))
    })

    // Transform to match frontend expectations
    const transformed = vehicles.map((vehicle: any) => {
      console.log('🔍 Processing vehicle:', {
        id: vehicle.id,
        displayName: vehicle.displayName,
        primaryImageUrl: vehicle.primaryImageUrl,
        hasImages: !!vehicle.images,
        imagesCount: vehicle.images?.length || 0,
        firstImageUrl: vehicle.images?.[0]?.url
      })
      
      return {
        id: vehicle.id,
        slug: vehicle.slug,
        displayName: vehicle.displayName,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        category: vehicle.category,
        bodyType: vehicle.bodyType,
        description: vehicle.description,
        primaryImage: vehicle.primaryImageUrl || vehicle.images?.[0]?.url || '/placeholder-car.jpg',
        pricePerDay: Number((vehicle as any).priceRules?.[0]?.basePricePerDay) || 0,
        featured: vehicle.featured,
        featuredOrder: vehicle.featuredOrder,
        specs: {
          transmission: vehicle.transmission,
          seats: vehicle.seats,
          doors: vehicle.doors
        }
      }
    })

    return NextResponse.json(transformed)
  } catch (error) {
    console.error('Failed to fetch vehicles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicles' },
      { status: 500 }
    )
  }
}