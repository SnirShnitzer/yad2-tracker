// Environment variable loader with validation
export const env = {
  DATABASE_URL: process.env.DATABASE_URL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  NODE_ENV: process.env.NODE_ENV || 'development'
}

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL', 'ADMIN_PASSWORD'] as const
const missingVars = requiredEnvVars.filter(varName => !env[varName])

if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars)
  if (env.NODE_ENV === 'production') {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
  }
}

console.log('Environment variables loaded:', {
  DATABASE_URL: env.DATABASE_URL ? 'SET' : 'NOT SET',
  ADMIN_PASSWORD: env.ADMIN_PASSWORD ? 'SET' : 'NOT SET',
  NODE_ENV: env.NODE_ENV
})
