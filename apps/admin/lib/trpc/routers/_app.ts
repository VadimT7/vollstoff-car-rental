import { router } from '@valore/lib'
import { adminRouter } from './admin'

// Re-export the main app router with admin extensions
export const appRouter = router({
  admin: adminRouter,
})

export type AppRouter = typeof appRouter
