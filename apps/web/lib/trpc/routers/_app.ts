import { router } from '@valore/lib'
import { carsRouter } from './cars'
import { bookingsRouter } from './bookings'
import { usersRouter } from './users'
import { paymentsRouter } from './payments'

export const appRouter = router({
  cars: carsRouter,
  bookings: bookingsRouter,
  users: usersRouter,
  payments: paymentsRouter,
})

export type AppRouter = typeof appRouter
