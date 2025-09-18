import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Simple hardcoded check
    if (username === 'admin' && password === 'Flyrentals') {
      // Create a simple session
      const response = NextResponse.json({ 
        success: true, 
        user: { 
          id: 'admin-1', 
          name: 'Admin User', 
          email: 'admin@flyrentals.com' 
        } 
      })
      
      // Set a simple session cookie
      response.cookies.set('admin-session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })
      
      return response
    }

    return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
