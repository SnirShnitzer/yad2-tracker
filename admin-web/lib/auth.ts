import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

const SESSION_COOKIE_NAME = 'yad2-admin-session'
const SESSION_SECRET = process.env.ADMIN_PASSWORD || 'default-password'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function createSession(): string {
  // Simple session token (in production, use JWT or similar)
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2)
  return Buffer.from(`${timestamp}-${random}`).toString('base64')
}

export function setSessionCookie(sessionToken: string): void {
  const cookieStore = cookies()
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export function clearSessionCookie(): void {
  const cookieStore = cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export function getSessionToken(): string | undefined {
  const cookieStore = cookies()
  return cookieStore.get(SESSION_COOKIE_NAME)?.value
}

export function isAuthenticated(): boolean {
  const sessionToken = getSessionToken()
  return !!sessionToken
}

export function verifySession(sessionToken: string): boolean {
  // In a real app, you'd verify the session token
  // For simplicity, we just check if it exists and is valid format
  try {
    const decoded = Buffer.from(sessionToken, 'base64').toString()
    const [timestamp] = decoded.split('-')
    const sessionAge = Date.now() - parseInt(timestamp)
    
    // Session expires after 7 days
    return sessionAge < 7 * 24 * 60 * 60 * 1000
  } catch {
    return false
  }
}
