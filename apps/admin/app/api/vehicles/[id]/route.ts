import { NextRequest, NextResponse } from 'next/server'
import { vehicleService, prisma } from '@valore/database'
import { saveImageToBothDirectories, deleteImageFromBothDirectories } from '../../../../lib/image-utils'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const vehicleId = params.id
    
    if (!vehicleId) {
      return NextResponse.json(
        { error: 'Vehicle ID is required' },
        { status: 400 }
      )
    }

    console.log('🔄 Starting vehicle update for ID:', vehicleId)
    
    const formData = await request.formData()
    
    console.log('📋 Form data received for update:')
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
    const fuelType = formData.get('fuelType') as string || 'PETROL'
    const drivetrain = formData.get('drivetrain') as string || 'RWD'

    console.log('🔍 Extracted basic fields:', {
      displayName, slug, make, model, year, vin, licensePlate, category, status
    })

    // Validate required fields
    if (!displayName?.trim()) {
      return NextResponse.json({ error: 'Display name is required' }, { status: 400 })
    }
    if (!make?.trim()) {
      return NextResponse.json({ error: 'Make is required' }, { status: 400 })
    }
    if (!model?.trim()) {
      return NextResponse.json({ error: 'Model is required' }, { status: 400 })
    }
    if (!vin?.trim()) {
      return NextResponse.json({ error: 'VIN is required' }, { status: 400 })
    }
    if (!licensePlate?.trim()) {
      return NextResponse.json({ error: 'License plate is required' }, { status: 400 })
    }
    if (!year || year < 1900 || year > new Date().getFullYear() + 2) {
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
      return NextResponse.json({ error: 'Price per day must be greater than 0' }, { status: 400 })
    }
    if (depositAmount < 0) {
      return NextResponse.json({ error: 'Deposit amount cannot be negative' }, { status: 400 })
    }

    console.log('✅ Pricing validation passed')

    // Handle image uploads
    const primaryImage = formData.get('primaryImage') as File | null
    let primaryImageUrl = ''

    if (primaryImage) {
      console.log('💾 Processing new primary image...')
      
      const timestamp = Date.now()
      const filename = `${slug}-primary-${timestamp}.${primaryImage.name.split('.').pop()}`
      
      try {
        const bytes = await primaryImage.arrayBuffer()
        const buffer = Buffer.from(bytes)
        
        // Use Vercel Blob Storage utility
        const result = await saveImageToBothDirectories({
          buffer,
          filename,
          baseDir: process.cwd()
        })
        
        if (!result.success) {
          console.error('❌ Failed to upload image to Blob Storage:', result.error)
          // Check if it's a configuration issue
          if (result.error?.includes('BLOB_READ_WRITE_TOKEN')) {
            console.warn('⚠️ Vercel Blob Storage not configured. Please set BLOB_READ_WRITE_TOKEN environment variable.')
            return NextResponse.json({ 
              error: 'Image storage not configured', 
              details: 'Vercel Blob Storage is not configured. Please contact the administrator.' 
            }, { status: 503 })
          }
          return NextResponse.json({ 
            error: 'Failed to save image', 
            details: result.error 
          }, { status: 500 })
        }
        
        if (!result.imageUrl) {
          console.error('❌ No image URL returned from Blob Storage')
          return NextResponse.json({ 
            error: 'Failed to save image', 
            details: 'No image URL was returned' 
          }, { status: 500 })
        }
        
        primaryImageUrl = result.imageUrl
        console.log('✅ New primary image uploaded successfully to Blob Storage:', primaryImageUrl)
        
      } catch (error) {
        console.error('❌ Failed to process primary image:', error)
        return NextResponse.json({ 
          error: 'Failed to process image', 
          details: error instanceof Error ? error.message : 'Unknown error' 
        }, { status: 500 })
      }
    }

    // Handle gallery image uploads
    console.log('📸 Processing gallery images...')
    const galleryImages: File[] = []
    
    // Extract gallery images from FormData
    const galleryEntries = Array.from(formData.entries())
    for (const [key, value] of galleryEntries) {
      if (key.startsWith('galleryImage_') && value instanceof File) {
        galleryImages.push(value)
        console.log(`  Found gallery image: ${value.name} (${value.size} bytes)`)
      }
    }

    // Process and upload gallery images
    const newGalleryImages: any[] = []
    if (galleryImages.length > 0) {
      console.log(`📸 Processing ${galleryImages.length} gallery images...`)
      
      for (let index = 0; index < galleryImages.length; index++) {
        const image = galleryImages[index]
        try {
          const timestamp = Date.now()
          const filename = `${slug}-gallery-${index + 1}-${timestamp}.${image.name.split('.').pop()}`
          
          const bytes = await image.arrayBuffer()
          const buffer = Buffer.from(bytes)
          
          // Use Vercel Blob Storage utility
          const result = await saveImageToBothDirectories({
            buffer,
            filename,
            baseDir: process.cwd()
          })
          
          if (result.success && result.imageUrl) {
            newGalleryImages.push({
              url: result.imageUrl,
              alt: displayName,
              caption: `Gallery image ${index + 1}`,
              order: index + 1,
              isGallery: true
            })
            console.log(`✅ Gallery image ${index + 1} uploaded successfully to Blob Storage`)
          } else {
            console.error(`⚠️ Failed to upload gallery image ${index + 1}:`, result.error)
            if (result.error?.includes('BLOB_READ_WRITE_TOKEN')) {
              console.warn('⚠️ Vercel Blob Storage not configured')
            }
          }
        } catch (error) {
          console.error(`❌ Failed to process gallery image ${index + 1}:`, error)
        }
      }
    }

    console.log('💾 Updating vehicle in database...')

    // Prepare update data
    const updateData: any = {
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
      features
    }

    // Only update primary image if a new one was uploaded
    if (primaryImageUrl) {
      updateData.primaryImageUrl = primaryImageUrl
    }

    // Update vehicle in database
    const vehicle = await vehicleService.update(
      { id: vehicleId },
      updateData
    )

    // If we have a new primary image, also update/create the CarImage record
    if (primaryImageUrl && vehicle) {
      try {
        // First, delete existing primary image records
        await prisma.carImage.deleteMany({
          where: {
            carId: vehicleId,
            isGallery: false
          }
        })

        // Create new primary image record
        await prisma.carImage.create({
          data: {
            carId: vehicleId,
            url: primaryImageUrl,
            alt: vehicle.displayName,
            caption: 'Primary image',
            order: 0,
            isGallery: false
          }
        })
        console.log('✅ Updated CarImage record for primary image')
      } catch (error) {
        console.error('❌ Failed to update CarImage record:', error)
        // Don't fail the whole operation for this
      }
    }

    // Handle new gallery images if any were uploaded
    if (newGalleryImages.length > 0 && vehicle) {
      try {
        console.log(`📸 Adding ${newGalleryImages.length} new gallery images to database...`)
        
        // Delete existing gallery images (we're replacing them)
        await prisma.carImage.deleteMany({
          where: {
            carId: vehicleId,
            isGallery: true
          }
        })
        console.log('🗑️ Deleted existing gallery images')

        // Create new gallery image records
        for (const imageData of newGalleryImages) {
          await prisma.carImage.create({
            data: {
              carId: vehicleId,
              ...imageData
            }
          })
        }
        console.log('✅ Created new gallery image records')
      } catch (error) {
        console.error('❌ Failed to update gallery CarImage records:', error)
        // Don't fail the whole operation for this
      }
    }

    // Update price rules
    if (vehicle) {
      console.log('💰 Updating price rules...')
      
      // Import prisma client directly for price rule operations
      const { prisma } = await import('@valore/database')
      
      try {
        // Find existing price rule for this vehicle
        const existingPriceRule = await prisma.priceRule.findFirst({
          where: { 
            carId: vehicleId,
            isActive: true 
          }
        })

        const priceRuleData = {
          basePricePerDay: pricePerDay,
          weekendMultiplier: weekendMultiplier,
          weeklyDiscount: weeklyDiscount,
          monthlyDiscount: monthlyDiscount,
          minimumDays,
          maximumDays,
          includedKmPerDay,
          extraKmPrice: extraKmPrice,
          depositAmount: depositAmount,
          currency: 'CAD',
          isActive: true,
          validFrom: new Date(),
          updatedAt: new Date()
        }

        if (existingPriceRule) {
          // Update existing price rule
          await prisma.priceRule.update({
            where: { id: existingPriceRule.id },
            data: priceRuleData
          })
          console.log('✅ Price rule updated successfully:', existingPriceRule.id)
        } else {
          // Create new price rule if none exists
          await prisma.priceRule.create({
            data: {
              ...priceRuleData,
              carId: vehicleId,
              createdAt: new Date()
            }
          })
          console.log('✅ New price rule created successfully')
        }
      } catch (priceRuleError) {
        console.error('❌ Failed to update price rules:', priceRuleError)
        // Don't fail the entire request if price rule update fails
        // The vehicle update was successful, just log the price rule error
      }
    }

    console.log('✅ Vehicle updated successfully:', vehicle?.id)

    return NextResponse.json({
      success: true,
      message: 'Vehicle updated successfully',
      vehicle
    })

  } catch (error) {
    console.error('❌ Failed to update vehicle:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    return NextResponse.json(
      {
        error: 'Failed to update vehicle',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const vehicleId = params.id
    
    if (!vehicleId) {
      return NextResponse.json(
        { error: 'Vehicle ID is required' },
        { status: 400 }
      )
    }

    console.log('🗑️ Deleting vehicle:', vehicleId)

    await vehicleService.delete({ id: vehicleId })

    console.log('✅ Vehicle deleted successfully')

    return NextResponse.json({
      success: true,
      message: 'Vehicle deleted successfully'
    })

  } catch (error) {
    console.error('❌ Failed to delete vehicle:', error)
    
    return NextResponse.json(
      {
        error: 'Failed to delete vehicle',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
