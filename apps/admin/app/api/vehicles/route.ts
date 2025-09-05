import { NextRequest, NextResponse } from 'next/server'
import { vehicleService } from '@valore/database'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const featured = searchParams.get('featured') === 'true'
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const id = searchParams.get('id')

    // If ID is provided, return single vehicle
    if (id) {
      const vehicle = await vehicleService.findUnique({ id }, {
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
        return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
      }
      return NextResponse.json([vehicle]) // Return as array for compatibility
    }

    const where: any = {}
    
    if (featured) {
      where.featured = true
    }
    
    if (category && category !== 'all') {
      where.category = category
    }
    
    if (status && status !== 'all') {
      where.status = status
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
          orderBy: { order: 'asc' }
        },
        _count: {
          select: {
            bookings: true
          }
        }
      },
      orderBy: [
        { featured: 'desc' },
        { featuredOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    // Calculate additional stats
    const vehiclesWithStats = vehicles.map((vehicle: any) => {
      const bookingsCount = vehicle._count?.bookings || 0
      const priceRule = vehicle.priceRules?.[0]
      
      return {
        ...vehicle,
        pricePerDay: priceRule?.basePricePerDay ? Number(priceRule.basePricePerDay) : 0,
        bookingsCount,
        // Calculate utilization based on bookings (consistent calculation)
        utilization: Math.min(95, Math.max(0, bookingsCount * 15 + (vehicle.featured ? 10 : 0))),
        // Calculate revenue (mock for now - would need actual payment data)
        revenue: bookingsCount * (priceRule?.basePricePerDay ? Number(priceRule.basePricePerDay) : 0) * 3
      }
    })

    return NextResponse.json(vehiclesWithStats)
  } catch (error) {
    console.error('Failed to fetch vehicles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚗 Starting vehicle creation...')
    const formData = await request.formData()
    
    // Log all form data for debugging
    console.log('📋 Form data received:')
    const entries = Array.from(formData.entries())
    for (const [key, value] of entries) {
      if (value instanceof File) {
        console.log(`  ${key}: [File] ${value.name} (${value.size} bytes)`)
      } else {
        console.log(`  ${key}: ${value}`)
      }
    }
    
    // Extract form fields
    const displayName = formData.get('displayName') as string
    const slug = formData.get('slug') as string
    const make = formData.get('make') as string
    const model = formData.get('model') as string
    const year = parseInt(formData.get('year') as string)
    const trim = formData.get('trim') as string || ''
    const vin = formData.get('vin') as string
    const licensePlate = formData.get('licensePlate') as string
    const description = formData.get('description') as string || ''
    const featured = formData.get('featured') === 'true'
    const featuredOrder = parseInt(formData.get('featuredOrder') as string) || 0
    const status = formData.get('status') as string || 'ACTIVE'
    const category = formData.get('category') as string || 'LUXURY'
    const bodyType = formData.get('bodyType') as string || 'SEDAN'
    const transmission = formData.get('transmission') as string || 'AUTOMATIC'
    const fuelType = formData.get('fuelType') as string || 'PETROL' // Changed from GASOLINE to PETROL
    const drivetrain = formData.get('drivetrain') as string || 'RWD'
    
    console.log('🔍 Extracted basic fields:', {
      displayName, slug, make, model, year, vin, licensePlate, category, status
    })
    
    console.log('✅ Starting field validation...')
    
    // Validate required fields
    if (!displayName?.trim()) {
      console.log('❌ Validation failed: Display name is required')
      return NextResponse.json({ error: 'Display name is required' }, { status: 400 })
    }
    if (!make?.trim()) {
      console.log('❌ Validation failed: Make is required')
      return NextResponse.json({ error: 'Make is required' }, { status: 400 })
    }
    if (!model?.trim()) {
      console.log('❌ Validation failed: Model is required')
      return NextResponse.json({ error: 'Model is required' }, { status: 400 })
    }
    if (!vin?.trim()) {
      console.log('❌ Validation failed: VIN is required')
      return NextResponse.json({ error: 'VIN is required' }, { status: 400 })
    }
    if (!licensePlate?.trim()) {
      console.log('❌ Validation failed: License plate is required')
      return NextResponse.json({ error: 'License plate is required' }, { status: 400 })
    }
    if (!year || year < 1900 || year > new Date().getFullYear() + 2) {
      console.log('❌ Validation failed: Valid year is required, got:', year)
      return NextResponse.json({ error: 'Valid year is required' }, { status: 400 })
    }
    
    console.log('✅ Basic validation passed')
    const seats = parseInt(formData.get('seats') as string) || 5
    const doors = parseInt(formData.get('doors') as string) || 4
    const engineSize = parseFloat(formData.get('engineSize') as string) || 2.0
    const engineType = formData.get('engineType') as string || 'Turbocharged'
    const horsePower = parseInt(formData.get('horsePower') as string) || 300
    const torque = parseInt(formData.get('torque') as string) || 400
    const topSpeed = parseInt(formData.get('topSpeed') as string) || 250
    const acceleration = parseFloat(formData.get('acceleration') as string) || 5.5
    const fuelConsumption = parseFloat(formData.get('fuelConsumption') as string) || 8.5
    const features = JSON.parse(formData.get('features') as string || '[]')
    
    // Pricing fields
    const pricePerDay = parseFloat(formData.get('pricePerDay') as string) || 0
    const weekendMultiplier = parseFloat(formData.get('weekendMultiplier') as string) || 1.2
    const weeklyDiscount = parseFloat(formData.get('weeklyDiscount') as string) || 0.1
    const monthlyDiscount = parseFloat(formData.get('monthlyDiscount') as string) || 0.2
    const minimumDays = parseInt(formData.get('minimumDays') as string) || 1
    const maximumDays = parseInt(formData.get('maximumDays') as string) || 30
    const includedKmPerDay = parseInt(formData.get('includedKmPerDay') as string) || 200
    const extraKmPrice = parseFloat(formData.get('extraKmPrice') as string) || 0.5
    const depositAmount = parseFloat(formData.get('depositAmount') as string) || 500
    
    console.log('💰 Pricing fields:', { pricePerDay, depositAmount, weekendMultiplier, weeklyDiscount })
    
    // Validate pricing
    if (pricePerDay <= 0) {
      console.log('❌ Pricing validation failed: Price per day must be greater than 0, got:', pricePerDay)
      return NextResponse.json({ error: 'Price per day must be greater than 0' }, { status: 400 })
    }
    if (depositAmount < 0) {
      console.log('❌ Pricing validation failed: Deposit amount cannot be negative, got:', depositAmount)
      return NextResponse.json({ error: 'Deposit amount cannot be negative' }, { status: 400 })
    }
    
    console.log('✅ Pricing validation passed')
    
    console.log('📸 Processing image uploads...')
    
    // Handle image uploads
    const primaryImage = formData.get('primaryImage') as File | null
    const galleryImages: File[] = []
    
    console.log('Primary image:', primaryImage ? `${primaryImage.name} (${primaryImage.size} bytes)` : 'None')
    
    // Collect gallery images
    const galleryEntries = Array.from(formData.entries())
    for (const [key, value] of galleryEntries) {
      if (key.startsWith('galleryImage_')) {
        galleryImages.push(value as File)
      }
    }
    
    console.log(`Gallery images: ${galleryImages.length} files`)
    
    // Create upload directory if it doesn't exist
    // Try different possible paths based on where the API is running from
    let uploadDir = join(process.cwd(), 'apps/web/public/uploads')
    
    // If we're running from the admin app, we need to go up one level
    if (process.cwd().includes('apps/admin')) {
      uploadDir = join(process.cwd(), '../web/public/uploads')
    }
    
    console.log('📁 Current working directory:', process.cwd())
    console.log('📁 Upload directory path:', uploadDir)
    console.log('📁 Upload directory exists:', existsSync(uploadDir))
    
    if (!existsSync(uploadDir)) {
      console.log('📁 Creating upload directory...')
      await mkdir(uploadDir, { recursive: true })
      console.log('📁 Upload directory created successfully')
    }
    
    // Save primary image
    let primaryImageUrl = ''
    if (primaryImage) {
      console.log('💾 Saving primary image...')
      const timestamp = Date.now()
      const filename = `${slug}-primary-${timestamp}.${primaryImage.name.split('.').pop()}`
      const filepath = join(uploadDir, filename)
      console.log('💾 Image filepath:', filepath)
      
      try {
        const bytes = await primaryImage.arrayBuffer()
        const buffer = Buffer.from(bytes)
        console.log('💾 Image buffer size:', buffer.length, 'bytes')
        
        await writeFile(filepath, buffer)
        console.log('✅ Primary image saved successfully to:', filepath)
        
        primaryImageUrl = `/uploads/${filename}`
        console.log('✅ Primary image URL:', primaryImageUrl)
      } catch (error) {
        console.error('❌ Failed to save primary image:', error)
        throw new Error(`Failed to save primary image: ${error}`)
      }
    } else {
      console.log('⚠️ No primary image provided')
    }
    
    // Save gallery images
    const galleryImageUrls: { url: string; order: number }[] = []
    for (let i = 0; i < galleryImages.length; i++) {
      const image = galleryImages[i]
      const timestamp = Date.now()
      const filename = `${slug}-gallery-${i}-${timestamp}.${image.name.split('.').pop()}`
      const filepath = join(uploadDir, filename)
      const bytes = await image.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filepath, buffer)
      galleryImageUrls.push({
        url: `/uploads/${filename}`,
        order: i
      })
    }
    
    console.log('💾 Creating vehicle in database...')
    console.log('Vehicle data to create:', {
      slug, displayName, make, model, year, vin, licensePlate, category, status,
      seats, doors, engineSize, horsePower, pricePerDay, depositAmount,
      primaryImageUrl, galleryImagesCount: galleryImageUrls.length
    })
    
    // Create vehicle in database
    const vehicle = await vehicleService.create({
      slug,
      displayName,
      make,
      model,
      year,
      trim,
      vin,
      licensePlate,
      description,
      featured,
      featuredOrder,
      status: status as any,
      category: category as any,
      bodyType: bodyType as any,
      transmission: transmission as any,
      fuelType: fuelType as any,
      drivetrain: drivetrain as any,
      seats,
      doors,
      engineSize,
      engineType,
      horsePower,
      torque,
      topSpeed,
      acceleration,
      fuelConsumption,
      features,
      primaryImageUrl,
      images: {
        create: galleryImageUrls.map(img => ({
          url: img.url,
          order: img.order,
          isGallery: true
        }))
      },
      priceRules: {
        create: {
          basePricePerDay: pricePerDay,
          weekendMultiplier,
          weeklyDiscount,
          monthlyDiscount,
          minimumDays,
          maximumDays,
          includedKmPerDay,
          extraKmPrice,
          depositAmount,
          currency: 'CAD',
          isActive: true
        }
      }
    })
    
    console.log('✅ Vehicle created successfully:', vehicle.id)
    return NextResponse.json(vehicle)
  } catch (error) {
    console.error('❌ Failed to create vehicle - Full error details:')
    console.error('Error name:', error instanceof Error ? error.name : 'Unknown')
    console.error('Error message:', error instanceof Error ? error.message : String(error))
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    
    // More detailed error response
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { 
        error: 'Failed to create vehicle',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    let requestBody
    const contentType = request.headers.get('content-type')
    
    if (contentType?.includes('application/json')) {
      requestBody = await request.json()
    } else {
      // Handle FormData
      const formData = await request.formData()
      requestBody = {
        id: formData.get('id') as string,
        status: formData.get('status') as string,
        displayName: formData.get('displayName') as string,
        pricePerDay: formData.get('pricePerDay') ? parseFloat(formData.get('pricePerDay') as string) : undefined,
        featured: formData.get('featured') === 'true',
        // Add other fields as needed
      }
    }
    
    const { id, ...data } = requestBody
    
    if (!id) {
      return NextResponse.json(
        { error: 'Vehicle ID is required' },
        { status: 400 }
      )
    }
    
    const vehicle = await vehicleService.update(
      { id },
      data
    )
    
    return NextResponse.json(vehicle)
  } catch (error) {
    console.error('Failed to update vehicle:', error)
    return NextResponse.json(
      { error: 'Failed to update vehicle: ' + (error as Error).message },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    
    await vehicleService.delete({ id })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete vehicle:', error)
    return NextResponse.json(
      { error: 'Failed to delete vehicle' },
      { status: 500 }
    )
  }
}