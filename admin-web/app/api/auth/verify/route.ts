import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '../../../../lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('yad2-admin-session')?.value
    
    if (!sessionToken) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const isValid = verifySession(sessionToken)
    
    if (!isValid) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({ authenticated: true })
  } catch (error) {
    console.error('Session verification error:', error)
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
