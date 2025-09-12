import { authOptions } from '@/lib/auth'
import NextAuth from 'next-auth'

const handler = NextAuth(authOptions)

export const GET = handler as any
export const POST = handler as any