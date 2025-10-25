import { NextRequest, NextResponse } from 'next/server'
import { getSessionToken, verifySession } from '../../../../lib/auth'

export async function GET(request: NextRequest) {
  try {
    const sessionToken = getSessionToken()
    
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
