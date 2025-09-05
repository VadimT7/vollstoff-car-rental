import prisma from './client'
import { MOCK_VEHICLES, MOCK_BOOKINGS } from './mock-data'

// Helper to check if database is connected
async function isDatabaseConnected(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.log('Database not connected, using mock data')
    return false
  }
}

// Vehicle service with automatic fallback
export const vehicleService = {
  async findMany(where?: any, options?: any) {
    const isConnected = await isDatabaseConnected()
    
    if (isConnected) {
      try {
        return await prisma.car.findMany({
          where,
          ...options
        })
      } catch (error) {
        console.error('Database query failed:', error)
      }
    }
    
    // Fallback to mock data
    let vehicles = [...MOCK_VEHICLES]
    
    // Apply filters
    if (where) {
      if (where.featured !== undefined) {
        vehicles = vehicles.filter(v => v.featured === where.featured)
      }
      if (where.status) {
        vehicles = vehicles.filter(v => v.status === where.status)
      }
      if (where.category) {
        vehicles = vehicles.filter(v => v.category === where.category)
      }
    }
    
    return vehicles
  },

  async findUnique(where: { id?: string, slug?: string }, options?: any) {
    const isConnected = await isDatabaseConnected()
    
    if (isConnected) {
      try {
        return await prisma.car.findUnique({ 
          where: where as any,
          ...options
        })
      } catch (error) {
        console.error('Database query failed:', error)
      }
    }
    
    // Fallback to mock data
    if (where.id) {
      return MOCK_VEHICLES.find(v => v.id === where.id)
    }
    if (where.slug) {
      return MOCK_VEHICLES.find(v => v.slug === where.slug)
    }
    return null
  },

  async create(data: any) {
    console.log('🔗 Checking database connection for vehicle creation...')
    const isConnected = await isDatabaseConnected()
    
    if (isConnected) {
      try {
        console.log('✅ Database connected, creating vehicle with data:', {
          slug: data.slug,
          displayName: data.displayName,
          make: data.make,
          model: data.model,
          hasImages: !!data.images,
          hasPriceRules: !!data.priceRules
        })
        
        const result = await prisma.car.create({ data })
        console.log('✅ Vehicle created successfully in database:', result.id)
        return result
      } catch (error) {
        console.error('❌ Database create failed with error:', error)
        console.error('❌ Failed data structure:', JSON.stringify(data, null, 2))
        throw error
      }
    }
    
    // Mock create - add to array with generated ID
    console.log('⚠️ Database not connected, creating mock vehicle')
    const newVehicle = {
      ...data,
      id: `mock-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    MOCK_VEHICLES.push(newVehicle)
    return newVehicle
  },

  async update(where: any, data: any) {
    const isConnected = await isDatabaseConnected()
    
    if (isConnected) {
      try {
        return await prisma.car.update({ where, data })
      } catch (error) {
        console.error('Database update failed:', error)
        throw error
      }
    }
    
    // Mock update
    const index = MOCK_VEHICLES.findIndex(v => v.id === where.id)
    if (index !== -1) {
      MOCK_VEHICLES[index] = { ...MOCK_VEHICLES[index], ...data }
      return MOCK_VEHICLES[index]
    }
    throw new Error('Vehicle not found')
  },

  async delete(where: any) {
    const isConnected = await isDatabaseConnected()
    
    if (isConnected) {
      try {
        return await prisma.car.delete({ where })
      } catch (error) {
        console.error('Database delete failed:', error)
        throw error
      }
    }
    
    // Mock delete
    const index = MOCK_VEHICLES.findIndex(v => v.id === where.id)
    if (index !== -1) {
      const deleted = MOCK_VEHICLES[index]
      MOCK_VEHICLES.splice(index, 1)
      return deleted
    }
    throw new Error('Vehicle not found')
  }
}

// Booking service with automatic fallback
export const bookingService = {
  async findMany(where?: any, options?: any) {
    const isConnected = await isDatabaseConnected()
    
    if (isConnected) {
      try {
        return await prisma.booking.findMany({
          where,
          ...options
        })
      } catch (error) {
        console.error('Database query failed:', error)
      }
    }
    
    // Return empty array for mock bookings
    return MOCK_BOOKINGS
  },

  async count(where?: any) {
    const isConnected = await isDatabaseConnected()
    
    if (isConnected) {
      try {
        return await prisma.booking.count({ where })
      } catch (error) {
        console.error('Database query failed:', error)
      }
    }
    
    return MOCK_BOOKINGS.length
  }
}

// User service
export const userService = {
  async findMany(where?: any, options?: any) {
    const isConnected = await isDatabaseConnected()
    
    if (isConnected) {
      try {
        return await prisma.user.findMany({
          where,
          ...options
        })
      } catch (error) {
        console.error('Database query failed:', error)
      }
    }
    
    return []
  }
}

// Export the service as default
export default {
  vehicle: vehicleService,
  booking: bookingService,
  user: userService,
  prisma
}
