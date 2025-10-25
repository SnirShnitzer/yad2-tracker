import { Pool } from 'pg'
import { env } from './env'

// Database connection
console.log('Database connection debug:', {
  DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
  NODE_ENV: env.NODE_ENV,
  URL_PREVIEW: env.DATABASE_URL ? env.DATABASE_URL.substring(0, 30) + '...' : 'NOT SET'
})

if (!env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required')
}

// Enhanced connection configuration for Supabase Session Pooler
const connectionConfig: any = {
  connectionString: env.DATABASE_URL,
  ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  // Connection timeout settings - increased for pooler
  connectionTimeoutMillis: 30000,
  idleTimeoutMillis: 30000,
  // Additional options to help with connectivity
  statement_timeout: 20000,
  query_timeout: 20000,
  // Application name for identification
  application_name: 'yad2-tracker-admin',
  // Force connection options
  keepAlive: true,
  keepAliveInitialDelayMillis: 0,
  // Pool configuration
  max: 10, // Maximum number of clients in the pool
  min: 0,  // Minimum number of clients in the pool
  // Allow pool to close idle connections
  allowExitOnIdle: true
}

// Session pooler specific settings
if (process.env.SUPABASE_DB_POOLER === 'true') {
  // Session pooler uses different connection parameters
  const url = new URL(env.DATABASE_URL || '');
  connectionConfig.host = url.hostname;
  connectionConfig.port = parseInt(url.port) || 5432;
  connectionConfig.database = url.pathname.slice(1);
  connectionConfig.user = url.username;
  connectionConfig.password = url.password;
  
  // Session pooler specific SSL settings
  connectionConfig.ssl = { rejectUnauthorized: false };
  
  // Remove connectionString when using individual parameters
  delete connectionConfig.connectionString;
}

const pool = new Pool(connectionConfig)

// Test database connection
pool.on('connect', () => {
  console.log('Database connected successfully')
})

pool.on('error', (err) => {
  // Only log critical errors, not expected connection terminations
  const errorCode = (err as any).code;
  if (errorCode !== 'ECONNRESET' && errorCode !== 'ENOTFOUND' && 
      !err.message.includes('shutdown') && 
      !err.message.includes('termination')) {
    console.error('Database connection error:', err)
  }
})

// Types
export interface Url {
  id: number
  url: string
  name: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Ad {
  id: string
  title: string
  link: string
  price: string
  address: string
  description: string | null
  timestamp: string
  created_at: string
}

export interface Stats {
  totalUrls: number
  activeUrls: number
  totalAds: number
  adsToday: number
  adsThisWeek: number
}

// URL Management
export async function getAllUrls(): Promise<Url[]> {
  const client = await pool.connect()
  try {
    const result = await client.query('SELECT * FROM urls ORDER BY created_at DESC')
    return result.rows
  } finally {
    client.release()
  }
}

export async function getActiveUrls(): Promise<string[]> {
  const client = await pool.connect()
  try {
    const result = await client.query('SELECT url FROM urls WHERE is_active = true ORDER BY id')
    return result.rows.map(row => row.url)
  } finally {
    client.release()
  }
}

export async function addUrl(url: string, name?: string): Promise<Url> {
  const client = await pool.connect()
  try {
    const result = await client.query(
      'INSERT INTO urls (url, name) VALUES ($1, $2) RETURNING *',
      [url, name || null]
    )
    return result.rows[0]
  } finally {
    client.release()
  }
}

export async function updateUrl(id: number, updates: Partial<Pick<Url, 'name' | 'is_active'>>): Promise<Url> {
  const client = await pool.connect()
  try {
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ')
    
    const values = Object.values(updates)
    const result = await client.query(
      `UPDATE urls SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      [id, ...values]
    )
    return result.rows[0]
  } finally {
    client.release()
  }
}

export async function deleteUrl(id: number): Promise<void> {
  const client = await pool.connect()
  try {
    await client.query('DELETE FROM urls WHERE id = $1', [id])
  } finally {
    client.release()
  }
}

// Ads Management
export async function getAds(limit: number = 50, offset: number = 0, search?: string): Promise<Ad[]> {
  const client = await pool.connect()
  try {
    let query = 'SELECT * FROM seen_ads'
    const params: any[] = []
    
    if (search) {
      query += ' WHERE title ILIKE $1 OR address ILIKE $1'
      params.push(`%${search}%`)
    }
    
    query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2)
    params.push(limit, offset)
    
    const result = await client.query(query, params)
    return result.rows
  } finally {
    client.release()
  }
}

export async function getAdsCount(search?: string): Promise<number> {
  const client = await pool.connect()
  try {
    let query = 'SELECT COUNT(*) FROM seen_ads'
    const params: any[] = []
    
    if (search) {
      query += ' WHERE title ILIKE $1 OR address ILIKE $1'
      params.push(`%${search}%`)
    }
    
    const result = await client.query(query, params)
    return parseInt(result.rows[0].count)
  } finally {
    client.release()
  }
}

export async function getAdsStats(): Promise<Stats> {
  const client = await pool.connect()
  try {
    // Get URL stats
    const urlStats = await client.query(`
      SELECT 
        COUNT(*) as total_urls,
        COUNT(*) FILTER (WHERE is_active = true) as active_urls
      FROM urls
    `)
    
    // Get ad stats
    const adStats = await client.query(`
      SELECT 
        COUNT(*) as total_ads,
        COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) as ads_today,
        COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as ads_this_week
      FROM seen_ads
    `)
    
    return {
      totalUrls: parseInt(urlStats.rows[0].total_urls),
      activeUrls: parseInt(urlStats.rows[0].active_urls),
      totalAds: parseInt(adStats.rows[0].total_ads),
      adsToday: parseInt(adStats.rows[0].ads_today),
      adsThisWeek: parseInt(adStats.rows[0].ads_this_week)
    }
  } finally {
    client.release()
  }
}

export async function clearOldAds(daysToKeep: number = 30): Promise<number> {
  const client = await pool.connect()
  try {
    const result = await client.query(
      'DELETE FROM seen_ads WHERE created_at < NOW() - INTERVAL \'$1 days\'',
      [daysToKeep]
    )
    return result.rowCount || 0
  } finally {
    client.release()
  }
}

// Close connection pool
export async function closePool(): Promise<void> {
  await pool.end()
}
