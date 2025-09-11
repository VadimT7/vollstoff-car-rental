import { NextRequest, NextResponse } from 'next/server'
import { vehicleService } from '@valore/database'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

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
      
      // Create upload directory if it doesn't exist
      let uploadDir = join(process.cwd(), 'apps/web/public/uploads')
      
      if (process.cwd().includes('apps/admin')) {
        uploadDir = join(process.cwd(), '../web/public/uploads')
      }
      
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true })
      }

      const timestamp = Date.now()
      const filename = `${slug}-primary-${timestamp}.${primaryImage.name.split('.').pop()}`
      const filepath = join(uploadDir, filename)
      
      try {
        const bytes = await primaryImage.arrayBuffer()
        const buffer = Buffer.from(bytes)
        await writeFile(filepath, buffer)
        primaryImageUrl = `/uploads/${filename}`
        console.log('✅ New primary image saved:', primaryImageUrl)
      } catch (error) {
        console.error('❌ Failed to save primary image:', error)
        return NextResponse.json({ error: 'Failed to save image' }, { status: 500 })
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
