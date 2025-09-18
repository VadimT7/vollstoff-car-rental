import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@valore/database'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function GET(request: NextRequest) {
  try {
    console.log('🚗 Fetching vehicles for admin dashboard...')
    
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    const status = searchParams.get('status')

    // Build where clause
    const where: any = {}
    if (status) {
      where.status = status
    }

    // Fetch vehicles with booking counts and price rules
    const vehicles = await prisma.car.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { bookings: true }
        },
        priceRules: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        images: {
          where: { isGallery: false },
          orderBy: { order: 'asc' },
          take: 1
        }
      }
    })

    // Transform vehicles to include calculated fields
    const transformedVehicles = vehicles.map((vehicle: any) => {
      const activePriceRule = vehicle.priceRules[0]
      const primaryImage = vehicle.images[0]
      
      // Calculate utilization (mock calculation for now)
      const utilization = Math.floor(Math.random() * 100)
      
      // Calculate revenue (mock calculation for now)
      const basePrice = activePriceRule?.basePricePerDay ? Number(activePriceRule.basePricePerDay) : 0
      const revenue = vehicle._count.bookings * basePrice
      
      return {
        ...vehicle,
        pricePerDay: basePrice,
        bookingsCount: vehicle._count.bookings,
        revenue: revenue,
        utilization: utilization,
        primaryImageUrl: vehicle.primaryImageUrl || primaryImage?.url || '/placeholder-car.jpg'
      }
    })

    console.log(`✅ Found ${transformedVehicles.length} vehicles`)

    return NextResponse.json(transformedVehicles)
  } catch (error) {
    console.error('❌ Failed to fetch vehicles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚗 Creating new vehicle...')
    
    const contentType = request.headers.get('content-type') || ''
    let vehicleData: any = {}
    
    if (contentType.includes('multipart/form-data')) {
      // Handle FormData
      console.log('📝 Processing FormData...')
      const formData = await request.formData()
      
      // Convert FormData to object
      const entries = Array.from(formData.entries())
      for (const [key, value] of entries) {
        if (key.startsWith('galleryImage_')) {
          if (!vehicleData.galleryImages) vehicleData.galleryImages = []
          vehicleData.galleryImages.push(value)
        } else if (key === 'features') {
          try {
            vehicleData[key] = JSON.parse(value as string)
          } catch {
            vehicleData[key] = []
          }
        } else if (key === 'primaryImage') {
          vehicleData[key] = value
        } else {
          const stringValue = value as string
          if (stringValue === 'true') vehicleData[key] = true
          else if (stringValue === 'false') vehicleData[key] = false
          else if (!isNaN(Number(stringValue)) && stringValue !== '') {
            vehicleData[key] = Number(stringValue)
          } else {
            vehicleData[key] = stringValue
          }
        }
      }
    } else {
      // Handle JSON
      console.log('📝 Processing JSON...')
      vehicleData = await request.json()
    }
    
    console.log('📋 Parsed vehicle data:', vehicleData)
    
    // Validate required fields
    const requiredFields = ['displayName', 'make', 'model', 'year', 'category', 'bodyType', 'transmission', 'fuelType', 'drivetrain', 'seats', 'doors', 'description']
    const missingFields = requiredFields.filter(field => !vehicleData[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Generate slug from display name
    const slug = vehicleData.displayName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

     // Prepare vehicle data for creation
     const vehicleCreateData: any = {
       displayName: vehicleData.displayName,
       make: vehicleData.make,
       model: vehicleData.model,
       year: vehicleData.year,
       trim: vehicleData.trim || '',
       vin: vehicleData.vin || '',
       licensePlate: String(vehicleData.licensePlate || ''),
       slug,
       description: vehicleData.description || '',
       status: vehicleData.status || 'ACTIVE',
       featured: vehicleData.featured || false,
       featuredOrder: vehicleData.featuredOrder || 0,
       category: vehicleData.category,
       bodyType: vehicleData.bodyType,
       transmission: vehicleData.transmission,
       fuelType: vehicleData.fuelType,
       drivetrain: vehicleData.drivetrain,
       seats: vehicleData.seats,
       doors: vehicleData.doors,
       engineSize: vehicleData.engineSize || 0,
       engineType: vehicleData.engineType || '',
       horsePower: vehicleData.horsePower || 0,
       torque: vehicleData.torque || 0,
       topSpeed: vehicleData.topSpeed || 0,
       acceleration: vehicleData.acceleration || 0,
       fuelConsumption: vehicleData.fuelConsumption || 0,
       features: vehicleData.features || [],
       primaryImageUrl: '/placeholder-car.jpg', // Default placeholder
       priceRules: {
         create: {
           basePricePerDay: String(vehicleData.pricePerDay || 0),
           currency: 'EUR',
           weekendMultiplier: String(vehicleData.weekendMultiplier || 1.0),
           weeklyDiscount: String(vehicleData.weeklyDiscount || 0.0),
           monthlyDiscount: String(vehicleData.monthlyDiscount || 0.0),
           minimumDays: vehicleData.minimumDays || 1,
           maximumDays: vehicleData.maximumDays || 30,
           includedKmPerDay: vehicleData.includedKmPerDay || 200,
           extraKmPrice: String(vehicleData.extraKmPrice || 0.5),
           depositAmount: String(vehicleData.depositAmount || 1000),
           isActive: true
         }
       }
     }

    // Handle images if provided
    if (vehicleData.primaryImage || vehicleData.galleryImages) {
      vehicleCreateData.images = {
        create: []
      }
      
      // Create uploads directory if it doesn't exist (admin app)
      const adminUploadsDir = join(process.cwd(), 'public', 'uploads', 'vehicles')
      try {
        await mkdir(adminUploadsDir, { recursive: true })
      } catch (error) {
        // Directory might already exist
      }
      
      // Create uploads directory for web app
      const webUploadsDir = join(process.cwd(), '..', 'web', 'public', 'uploads', 'vehicles')
      try {
        await mkdir(webUploadsDir, { recursive: true })
      } catch (error) {
        // Directory might already exist
      }
      
      // Add primary image
      if (vehicleData.primaryImage) {
        try {
          const timestamp = Date.now()
          const fileName = `${timestamp}-${vehicleData.displayName.replace(/\s+/g, '-')}-primary.jpg`
          const adminFilePath = join(adminUploadsDir, fileName)
          const webFilePath = join(webUploadsDir, fileName)
          const imageUrl = `/uploads/vehicles/${fileName}`
          
          // Save the file to both locations
          const bytes = await vehicleData.primaryImage.arrayBuffer()
          const buffer = Buffer.from(bytes)
          await writeFile(adminFilePath, buffer)
          await writeFile(webFilePath, buffer)
          
          // Set the primary image URL on the vehicle
          vehicleCreateData.primaryImageUrl = imageUrl
          
          vehicleCreateData.images.create.push({
            url: imageUrl,
            alt: vehicleData.displayName,
            caption: 'Primary image',
            order: 0,
            isGallery: false
          })
        } catch (error) {
          console.error('Failed to save primary image:', error)
          // Keep default placeholder
          vehicleCreateData.images.create.push({
            url: '/placeholder-car.jpg',
            alt: vehicleData.displayName,
            caption: 'Primary image',
            order: 0,
            isGallery: false
          })
        }
      }
      
      // Add gallery images
      if (vehicleData.galleryImages && vehicleData.galleryImages.length > 0) {
        for (let index = 0; index < vehicleData.galleryImages.length; index++) {
          const image = vehicleData.galleryImages[index]
          try {
            const timestamp = Date.now()
            const fileName = `${timestamp}-${vehicleData.displayName.replace(/\s+/g, '-')}-gallery-${index + 1}.jpg`
            const adminFilePath = join(adminUploadsDir, fileName)
            const webFilePath = join(webUploadsDir, fileName)
            const imageUrl = `/uploads/vehicles/${fileName}`
            
            // Save the file to both locations
            const bytes = await image.arrayBuffer()
            const buffer = Buffer.from(bytes)
            await writeFile(adminFilePath, buffer)
            await writeFile(webFilePath, buffer)
            
            vehicleCreateData.images.create.push({
              url: imageUrl,
              alt: vehicleData.displayName,
              caption: `Gallery image ${index + 1}`,
              order: index + 1,
              isGallery: true
            })
          } catch (error) {
            console.error(`Failed to save gallery image ${index + 1}:`, error)
            // Skip this image if it fails
          }
        }
      }
    }

    // Create the vehicle
    const newVehicle = await prisma.car.create({
      data: vehicleCreateData,
      include: {
        priceRules: true,
        images: true,
        _count: {
          select: { bookings: true }
        }
      }
    })

    console.log(`✅ Vehicle created successfully: ${newVehicle.id}`)
    return NextResponse.json(newVehicle, { status: 201 })
  } catch (error) {
    console.error('❌ Failed to create vehicle:', error)
    return NextResponse.json(
      { error: 'Failed to create vehicle', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, ...updateData } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Vehicle ID is required' },
        { status: 400 }
      )
    }

    const updatedVehicle = await prisma.car.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(updatedVehicle)
  } catch (error) {
    console.error('❌ Failed to update vehicle:', error)
    return NextResponse.json(
      { error: 'Failed to update vehicle' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('🗑️ Deleting vehicle...')
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Vehicle ID is required' },
        { status: 400 }
      )
    }

    // Check if vehicle has any active bookings
    const activeBookings = await prisma.booking.count({
      where: {
        carId: id,
        status: {
          in: ['CONFIRMED', 'IN_PROGRESS']
        }
      }
    })

    if (activeBookings > 0) {
      return NextResponse.json(
        { error: 'Cannot delete vehicle with active bookings' },
        { status: 400 }
      )
    }

    // Delete the vehicle (this will cascade delete related records due to Prisma schema)
    const deletedVehicle = await prisma.car.delete({
      where: { id },
      include: {
        _count: {
          select: { bookings: true }
        }
      }
    })

    console.log(`✅ Vehicle deleted successfully: ${deletedVehicle.id}`)
    return NextResponse.json({
      success: true,
      message: 'Vehicle deleted successfully',
      deletedVehicle: {
        id: deletedVehicle.id,
        displayName: deletedVehicle.displayName,
        bookingsCount: deletedVehicle._count.bookings
      }
    })
  } catch (error) {
    console.error('❌ Failed to delete vehicle:', error)
    
    // Handle specific Prisma errors
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to delete vehicle', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}