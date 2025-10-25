// Environment variable loader
export const env = {
  DATABASE_URL: process.env.DATABASE_URL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  NODE_ENV: process.env.NODE_ENV || 'development'
}

console.log('Environment variables loaded:', {
  DATABASE_URL: env.DATABASE_URL ? 'SET' : 'NOT SET',
  ADMIN_PASSWORD: env.ADMIN_PASSWORD ? 'SET' : 'NOT SET',
  NODE_ENV: env.NODE_ENV
})
