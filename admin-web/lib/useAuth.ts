'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if session cookie exists
        const sessionToken = document.cookie
          .split('; ')
          .find(row => row.startsWith('yad2-admin-session='))
          ?.split('=')[1]

        if (!sessionToken) {
          setIsAuthenticated(false)
          setLoading(false)
          return
        }

        // Verify session with server
        const response = await fetch('/api/auth/verify', {
          method: 'GET',
          credentials: 'include'
        })

        if (response.ok) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
          // Clear invalid session
          document.cookie = 'yad2-admin-session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setIsAuthenticated(false)
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return { isAuthenticated, loading, logout }
}
