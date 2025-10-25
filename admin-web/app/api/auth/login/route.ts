import { NextRequest, NextResponse } from 'next/server'
import { createSession } from '../../../../lib/auth'
import { env } from '../../../../lib/env'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    
    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }
    
    const adminPassword = env.ADMIN_PASSWORD
    console.log('Environment check:', {
      NODE_ENV: env.NODE_ENV,
      ADMIN_PASSWORD: adminPassword ? 'SET' : 'NOT SET',
      DATABASE_URL: env.DATABASE_URL ? 'SET' : 'NOT SET'
    })
    
    if (!adminPassword) {
      return NextResponse.json(
        { error: 'Admin password not configured' },
        { status: 500 }
      )
    }
    
    // For simplicity, we're using plain text comparison
    // In production, you'd hash the stored password
    if (password !== adminPassword) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }
    
    // Create session
    const sessionToken = createSession()
    
    // Set cookie using NextResponse
    const response = NextResponse.json({ success: true })
    response.cookies.set('yad2-admin-session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    
    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
