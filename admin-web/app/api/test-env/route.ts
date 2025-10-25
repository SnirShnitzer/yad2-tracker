import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    NODE_ENV: process.env.NODE_ENV,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? 'SET' : 'NOT SET',
    DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
    allEnvVars: Object.keys(process.env).filter(key => key.includes('ADMIN') || key.includes('DATABASE'))
  })
}
