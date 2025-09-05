import { initTRPC, TRPCError } from '@trpc/server'
import { type Session } from 'next-auth'
import superjson from 'superjson'
import { ZodError } from 'zod'
import { prisma } from '@valore/database'

type CreateContextOptions = {
  session: Session | null
}

/**
 * This helper generates the "internals" for a tRPC context.
 */
export const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
  }
}

/**
 * This is the actual context you'll use in your router.
 */
export const createTRPCContext = async (_opts: { req: Request }) => {
  // Get the session from the server using the unstable_getServerSession wrapper
  const session = null // TODO: Implement getServerAuthSession

  return createInnerTRPCContext({
    session,
  })
}

/**
 * Initialize tRPC backend
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

/**
 * Create a server-side caller
 */
export const createCallerFactory = t.createCallerFactory

/**
 * Reusable middleware that enforces users are logged in before running the procedure
 */
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})

/**
 * Reusable middleware that enforces users have admin role
 */
const enforceUserIsAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  
  // TODO: Check user role from database
  // if (ctx.session.user.role !== 'ADMIN') {
  //   throw new TRPCError({ code: 'FORBIDDEN' })
  // }
  
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})

/**
 * Public (unauthenticated) procedure
 */
export const publicProcedure = t.procedure

/**
 * Protected (authenticated) procedure
 */
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed)

/**
 * Admin procedure
 */
export const adminProcedure = t.procedure.use(enforceUserIsAdmin)

export const router = t.router
export const middleware = t.middleware
