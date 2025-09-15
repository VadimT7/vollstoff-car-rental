# Valore Rental - API Documentation

## 🌐 Overview

The Valore Rental API is built with tRPC, providing end-to-end type safety between the frontend and backend. All endpoints are accessible via the tRPC client or direct HTTP requests.

**Base URL**: `https://api.valorerent.com/trpc`

## 🔐 Authentication

Authentication is handled via NextAuth.js with JWT tokens stored in HTTP-only cookies.

### Public Endpoints
No authentication required:
- `cars.getAll`
- `cars.getOne`
- `cars.getFeatured`
- `bookings.calculatePrice`

### Protected Endpoints
Require authenticated user:
- `users.*`
- `bookings.getUserBookings`
- `payments.*`

### Admin Endpoints
Require admin role:
- `admin.*`

## 📚 Endpoints

### Cars

#### `cars.getAll`
Get all available cars with optional filters.

**Input**:
```typescript
{
  category?: "LUXURY" | "SPORT" | "SUPERCAR" | "SUV" | "CONVERTIBLE" | "ELECTRIC"
  minPrice?: number
  maxPrice?: number
  available?: boolean
  startDate?: Date
  endDate?: Date
  featured?: boolean
}
```

**Output**:
```typescript
Array<{
  id: string
  slug: string
  make: string
  model: string
  displayName: string
  year: number
  category: string
  status: string
  priceRules: Array<{
    basePricePerDay: number
    currency: string
    depositAmount: number
  }>
  images: Array<{
    url: string
    alt?: string
  }>
}>
```

**Example**:
```typescript
const { data } = await trpc.cars.getAll.useQuery({
  category: 'SUPERCAR',
  minPrice: 2000,
  available: true,
  startDate: new Date('2024-07-01'),
  endDate: new Date('2024-07-05')
})
```

#### `cars.getOne`
Get a single car by ID or slug.

**Input**:
```typescript
{
  id?: string
  slug?: string
}
```

**Output**:
```typescript
{
  id: string
  slug: string
  make: string
  model: string
  displayName: string
  description: string
  year: number
  category: string
  bodyType: string
  transmission: string
  fuelType: string
  drivetrain: string
  seats: number
  doors: number
  engineSize?: number
  horsePower?: number
  topSpeed?: number
  acceleration?: number
  features: string[]
  images: Array<{
    id: string
    url: string
    alt?: string
    order: number
  }>
  priceRules: Array<{
    basePricePerDay: number
    weekendMultiplier: number
    minimumDays: number
    maximumDays?: number
    includedKmPerDay: number
    extraKmPrice: number
    depositAmount: number
    seasonalRates: Array<{
      name: string
      startDate: Date
      endDate: Date
      multiplier: number
    }>
  }>
}
```

#### `cars.getAvailability`
Get availability calendar for a specific car.

**Input**:
```typescript
{
  carId: string
  startDate: Date
  endDate: Date
}
```

**Output**:
```typescript
{
  [date: string]: boolean // ISO date string -> available
}
```

#### `cars.getFeatured`
Get featured cars for homepage display.

**Output**: Array of cars (max 6)

#### `cars.getSimilar`
Get similar cars based on category.

**Input**:
```typescript
{
  carId: string
  take?: number // default: 3
}
```

### Bookings

#### `bookings.calculatePrice`
Calculate total price for a booking.

**Input**:
```typescript
{
  carId: string
  startDate: Date
  endDate: Date
  addOnIds?: string[]
  couponCode?: string
}
```

**Output**:
```typescript
{
  basePricePerDay: Decimal
  numberOfDays: number
  baseTotal: Decimal
  weekendDays: number
  weekendSurcharge: Decimal
  seasonalSurcharge: Decimal
  discounts: {
    lengthDiscount: Decimal
    couponDiscount: Decimal
  }
  addOns: Array<{
    id: string
    name: string
    quantity: number
    unitPrice: Decimal
    total: Decimal
  }>
  delivery: {
    pickupFee: Decimal
    returnFee: Decimal
  }
  subtotal: Decimal
  taxes: Decimal
  deposit: Decimal
  total: Decimal
  includedKilometers: number
  extraKilometerPrice: Decimal
}
```

#### `bookings.create`
Create a new booking.

**Input**:
```typescript
{
  carId: string
  startDate: Date
  endDate: Date
  pickupType: "SHOWROOM" | "DELIVERY"
  returnType: "SHOWROOM" | "DELIVERY"
  pickupLocation?: string
  returnLocation?: string
  deliveryAddress?: string
  addOnIds?: string[]
  couponCode?: string
  guestEmail?: string
  guestName?: string
  guestPhone?: string
  customerNotes?: string
  paymentMethodId: string
  payWithCash?: boolean
}
```

**Output**:
```typescript
{
  id: string
  bookingNumber: string
  status: string
  car: Car
  startDate: Date
  endDate: Date
  totalAmount: number
  // ... full booking details
}
```

#### `bookings.getUserBookings`
Get authenticated user's bookings.

**Input**:
```typescript
{
  status?: "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
  limit?: number // default: 10, max: 100
  cursor?: string
}
```

**Output**:
```typescript
{
  bookings: Booking[]
  nextCursor?: string
}
```

#### `bookings.getById`
Get booking details by ID.

**Input**: `string` (booking ID)

**Output**: Full booking object with relations

#### `bookings.cancel`
Cancel a booking.

**Input**:
```typescript
{
  bookingId: string
  reason?: string
}
```

**Output**:
```typescript
{
  booking: Booking
  cancellationFee: number
  refundAmount: number
}
```

### Users

#### `users.getProfile`
Get current user's profile.

**Output**:
```typescript
{
  id: string
  email: string
  name?: string
  phone?: string
  dateOfBirth?: Date
  licenseNumber?: string
  licenseExpiry?: Date
  licenseVerified: boolean
  addressLine1?: string
  city?: string
  country?: string
  isVerified: boolean
}
```

#### `users.updateProfile`
Update user profile information.

**Input**:
```typescript
{
  name?: string
  phone?: string
  dateOfBirth?: Date
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
}
```

#### `users.uploadLicense`
Upload driver's license information.

**Input**:
```typescript
{
  licenseNumber: string
  licenseExpiry: Date
  licenseImageUrl: string
}
```

### Payments

#### `payments.createSetupIntent`
Create a Stripe SetupIntent for saving payment methods.

**Output**:
```typescript
{
  clientSecret: string
}
```

#### `payments.savePaymentMethod`
Save a payment method to user's account.

**Input**:
```typescript
{
  paymentMethodId: string
  setAsDefault?: boolean
}
```

#### `payments.getPaymentMethods`
Get user's saved payment methods.

**Output**:
```typescript
Array<{
  id: string
  type: string
  card?: {
    brand: string
    last4: string
    exp_month: number
    exp_year: number
  }
  isDefault: boolean
}>
```

#### `payments.deletePaymentMethod`
Delete a saved payment method.

**Input**: `string` (payment method ID)

#### `payments.getPaymentHistory`
Get user's payment history.

**Input**:
```typescript
{
  limit?: number // default: 10
  cursor?: string
}
```

**Output**:
```typescript
{
  payments: Array<{
    id: string
    amount: number
    currency: string
    type: string
    status: string
    createdAt: Date
    booking: {
      bookingNumber: string
      car: {
        displayName: string
      }
    }
  }>
  nextCursor?: string
}
```

## 🔄 Webhooks

### Stripe Webhooks

**Endpoint**: `POST /api/webhook/stripe`

**Events Handled**:
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.refunded`
- `customer.created`

**Headers Required**:
- `stripe-signature`: Webhook signature for verification

**Security**: Validates webhook signature using `STRIPE_WEBHOOK_SECRET`

## 📊 Data Types

### Enums

```typescript
enum CarCategory {
  LUXURY = "LUXURY"
  SPORT = "SPORT"
  SUPERCAR = "SUPERCAR"
  SUV = "SUV"
  CONVERTIBLE = "CONVERTIBLE"
  ELECTRIC = "ELECTRIC"
}

enum BookingStatus {
  PENDING = "PENDING"
  CONFIRMED = "CONFIRMED"
  IN_PROGRESS = "IN_PROGRESS"
  COMPLETED = "COMPLETED"
  CANCELLED = "CANCELLED"
  NO_SHOW = "NO_SHOW"
}

enum PaymentStatus {
  PENDING = "PENDING"
  PROCESSING = "PROCESSING"
  PAID = "PAID"
  PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED"
  REFUNDED = "REFUNDED"
  FAILED = "FAILED"
}

enum PickupType {
  SHOWROOM = "SHOWROOM"
  DELIVERY = "DELIVERY"
}
```

### Common Types

```typescript
interface PriceBreakdown {
  basePricePerDay: number
  numberOfDays: number
  baseTotal: number
  weekendSurcharge: number
  seasonalSurcharge: number
  discounts: {
    lengthDiscount: number
    couponDiscount: number
  }
  addOnsTotal: number
  deliveryFees: number
  subtotal: number
  taxes: number
  deposit: number
  total: number
}

interface AvailabilityCheck {
  available: boolean
  reason?: string
  conflictingBookings?: Array<{
    id: string
    startDate: Date
    endDate: Date
  }>
  blockedDates?: Date[]
}
```

## 🚨 Error Handling

### Error Codes

- `BAD_REQUEST` (400): Invalid input parameters
- `UNAUTHORIZED` (401): Authentication required
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `CONFLICT` (409): Resource conflict (e.g., car already booked)
- `INTERNAL_SERVER_ERROR` (500): Server error

### Error Response Format

```typescript
{
  error: {
    message: string
    code: string
    httpStatus: number
    data?: {
      zodError?: ZodError // Validation errors
      [key: string]: any
    }
  }
}
```

## 🔒 Rate Limiting

API endpoints are rate limited to prevent abuse:

- **Public endpoints**: 100 requests per minute
- **Authenticated endpoints**: 300 requests per minute
- **Payment endpoints**: 20 requests per minute

Rate limit headers:
- `X-RateLimit-Limit`: Total allowed requests
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset timestamp

## 🧪 Testing

### Test Environment

Base URL: `https://staging-api.valorerent.com/trpc`

### Test Credentials

```
Email: flyrentalsca@gmail.com
Password: test123
```

### Test Payment Cards

```
Success: 4242 4242 4242 4242
3D Secure: 4000 0025 0000 3155
Decline: 4000 0000 0000 0002
```

## 📝 Examples

### Complete Booking Flow

```typescript
// 1. Check availability
const availability = await trpc.cars.getAvailability.query({
  carId: 'car_123',
  startDate: new Date('2024-07-01'),
  endDate: new Date('2024-07-05')
})

// 2. Calculate price
const pricing = await trpc.bookings.calculatePrice.query({
  carId: 'car_123',
  startDate: new Date('2024-07-01'),
  endDate: new Date('2024-07-05'),
  addOnIds: ['addon_insurance'],
  couponCode: 'SUMMER20'
})

// 3. Create booking
const booking = await trpc.bookings.create.mutate({
  carId: 'car_123',
  startDate: new Date('2024-07-01'),
  endDate: new Date('2024-07-05'),
  pickupType: 'SHOWROOM',
  returnType: 'SHOWROOM',
  addOnIds: ['addon_insurance'],
  couponCode: 'SUMMER20',
  paymentMethodId: 'pm_123',
  customerNotes: 'Celebrating anniversary'
})
```

### Error Handling

```typescript
try {
  const booking = await trpc.bookings.create.mutate(bookingData)
} catch (error) {
  if (error.code === 'CONFLICT') {
    // Car no longer available
    alert('This car is no longer available for your dates')
  } else if (error.data?.zodError) {
    // Validation error
    const firstError = error.data.zodError.errors[0]
    alert(`Invalid ${firstError.path}: ${firstError.message}`)
  } else {
    // Generic error
    alert('Something went wrong. Please try again.')
  }
}
```

---

**Version**: 1.0
**Last Updated**: January 2024

For SDK documentation, see `/packages/lib/src/api/`
