import { Pool, PoolClient } from 'pg';
import { AdData } from '../types.js';
import { Logger } from '../utils/logger.js';

/**
 * Database service for storing and retrieving seen ads
 */
export class DatabaseService {
    private pool: Pool;

    constructor() {
        // Enhanced connection configuration for Supabase Session Pooler
        const connectionConfig: any = {
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
            // Connection timeout settings - increased for pooler
            connectionTimeoutMillis: 30000,
            idleTimeoutMillis: 30000,
            // Additional options to help with connectivity
            statement_timeout: 20000,
            query_timeout: 20000,
            // Application name for identification
            application_name: 'yad2-tracker',
            // Force connection options
            keepAlive: true,
            keepAliveInitialDelayMillis: 0,
            // Pool configuration
            max: 10, // Maximum number of clients in the pool
            min: 0,  // Minimum number of clients in the pool
            // Allow pool to close idle connections
            allowExitOnIdle: true
        };

        // Session pooler specific settings
        if (process.env.SUPABASE_DB_POOLER === 'true') {
            // Session pooler uses different connection parameters
            const url = new URL(process.env.DATABASE_URL || '');
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

        this.pool = new Pool(connectionConfig);

        // Add error handling for pool events
        this.pool.on('error', (err) => {
            // Only log critical errors, not expected connection terminations
            const errorCode = (err as any).code;
            if (errorCode !== 'ECONNRESET' && errorCode !== 'ENOTFOUND' && 
                !err.message.includes('shutdown') && 
                !err.message.includes('termination')) {
                Logger.error('Database pool error:', err);
            }
        });

        this.pool.on('connect', () => {
            Logger.debug('New database client connected');
        });

        this.pool.on('remove', () => {
            Logger.debug('Database client removed from pool');
        });
    }

    /**
     * Get a database client from the pool
     */
    public async getClient() {
        return await this.pool.connect();
    }

    /**
     * Test database connection
     */
    public async testConnection(): Promise<boolean> {
        let client;
        try {
            client = await this.pool.connect();
            await client.query('SELECT 1');
            Logger.success('Database connection test successful');
            return true;
        } catch (error) {
            Logger.error('Database connection test failed:', error as Error);
            
            // If individual parameters fail, try connectionString approach
            if (error instanceof Error && error.message.includes('ENETUNREACH')) {
                Logger.info('Trying fallback connection method...');
                try {
                    await this.pool.end(); // Close the current pool
                    
                    // Create a new pool with connectionString
                    this.pool = new Pool({
                        connectionString: process.env.DATABASE_URL,
                        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
                        connectionTimeoutMillis: 20000,
                        idleTimeoutMillis: 30000,
                        max: 5,
                        min: 0,
                        allowExitOnIdle: true
                    });
                    
                    const fallbackClient = await this.pool.connect();
                    await fallbackClient.query('SELECT 1');
                    fallbackClient.release();
                    Logger.success('Database connection test successful with fallback method');
                    return true;
                } catch (fallbackError) {
                    Logger.error('Fallback connection also failed:', fallbackError as Error);
                    return false;
                }
            }
            
            return false;
        } finally {
            // Always release the client if it was acquired
            if (client) {
                try {
                    client.release();
                } catch (releaseError) {
                    // Ignore release errors
                }
            }
        }
    }

    /**
     * Initialize database tables
     */
    public async initializeDatabase(): Promise<void> {
        try {
            const client = await this.pool.connect();
            
            // Create seen_ads table if it doesn't exist
            await client.query(`
                CREATE TABLE IF NOT EXISTS seen_ads (
                    id VARCHAR(255) PRIMARY KEY,
                    title TEXT NOT NULL,
                    link TEXT NOT NULL,
                    price TEXT NOT NULL,
                    address TEXT NOT NULL,
                    description TEXT,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // Create urls table for storing Yad2 URLs
            await client.query(`
                CREATE TABLE IF NOT EXISTS urls (
                    id SERIAL PRIMARY KEY,
                    url TEXT NOT NULL UNIQUE,
                    name TEXT,
                    is_active BOOLEAN DEFAULT true,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // Create index for faster lookups
            await client.query(`
                CREATE INDEX IF NOT EXISTS idx_seen_ads_id ON seen_ads(id)
            `);

            client.release();
            Logger.success('Database initialized successfully');
        } catch (error) {
            Logger.error('Error initializing database:', error as Error);
            throw error;
        }
    }

    /**
     * Get all seen ad IDs
     */
    public async getSeenAdIds(): Promise<string[]> {
        try {
            const client = await this.pool.connect();
            const result = await client.query('SELECT id FROM seen_ads');
            client.release();
            
            return result.rows.map(row => row.id);
        } catch (error) {
            Logger.error('Error getting seen ad IDs:', error as Error);
            return [];
        }
    }

    /**
     * Save new ads to database
     */
    public async saveAds(ads: AdData[]): Promise<void> {
        if (ads.length === 0) return;

        try {
            const client = await this.pool.connect();
            
            // Prepare batch insert
            const values = ads.map(ad => [
                ad.id,
                ad.title,
                ad.link,
                ad.price,
                ad.address,
                ad.description || null,
                new Date(ad.timestamp)
            ]);

            // Use ON CONFLICT to handle duplicates
            const query = `
                INSERT INTO seen_ads (id, title, link, price, address, description, timestamp)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (id) DO NOTHING
            `;

            for (const value of values) {
                await client.query(query, value);
            }

            client.release();
            Logger.success(`Saved ${ads.length} ads to database`);
        } catch (error) {
            Logger.error('Error saving ads to database:', error as Error);
            throw error;
        }
    }

    /**
     * Get statistics about seen ads
     */
    public async getStats(): Promise<{ totalAds: number; latestAd: Date | null }> {
        try {
            const client = await this.pool.connect();
            
            const totalResult = await client.query('SELECT COUNT(*) as count FROM seen_ads');
            const latestResult = await client.query('SELECT MAX(created_at) as latest FROM seen_ads');
            
            client.release();
            
            return {
                totalAds: parseInt(totalResult.rows[0].count),
                latestAd: latestResult.rows[0].latest
            };
        } catch (error) {
            Logger.error('Error getting database stats:', error as Error);
            return { totalAds: 0, latestAd: null };
        }
    }

    /**
     * Clean up old ads (optional - for maintenance)
     */
    public async cleanupOldAds(daysToKeep: number = 30): Promise<void> {
        try {
            const client = await this.pool.connect();
            
            await client.query(
                'DELETE FROM seen_ads WHERE created_at < NOW() - INTERVAL \'$1 days\'',
                [daysToKeep]
            );
            
            client.release();
            Logger.info(`Cleaned up ads older than ${daysToKeep} days`);
        } catch (error) {
            Logger.error('Error cleaning up old ads:', error as Error);
        }
    }

    /**
     * Get all active URLs from database
     */
    public async getUrls(): Promise<string[]> {
        try {
            const client = await this.pool.connect();
            const result = await client.query('SELECT url FROM urls WHERE is_active = true ORDER BY id');
            client.release();
            
            return result.rows.map(row => row.url);
        } catch (error) {
            Logger.error('Error getting URLs from database:', error as Error);
            return [];
        }
    }

    /**
     * Add a new URL to the database
     */
    public async addUrl(url: string, name?: string): Promise<void> {
        try {
            const client = await this.pool.connect();
            
            await client.query(
                'INSERT INTO urls (url, name) VALUES ($1, $2) ON CONFLICT (url) DO NOTHING',
                [url, name || null]
            );
            
            client.release();
            Logger.success(`Added URL to database: ${url}`);
        } catch (error) {
            Logger.error('Error adding URL to database:', error as Error);
            throw error;
        }
    }

    /**
     * Update URL status (activate/deactivate)
     */
    public async updateUrlStatus(url: string, isActive: boolean): Promise<void> {
        try {
            const client = await this.pool.connect();
            
            await client.query(
                'UPDATE urls SET is_active = $1, updated_at = CURRENT_TIMESTAMP WHERE url = $2',
                [isActive, url]
            );
            
            client.release();
            Logger.success(`Updated URL status: ${url} -> ${isActive ? 'active' : 'inactive'}`);
        } catch (error) {
            Logger.error('Error updating URL status:', error as Error);
            throw error;
        }
    }

    /**
     * Get URLs with metadata
     */
    public async getUrlsWithMetadata(): Promise<Array<{url: string, name: string | null, is_active: boolean}>> {
        try {
            const client = await this.pool.connect();
            const result = await client.query('SELECT url, name, is_active FROM urls ORDER BY id');
            client.release();
            
            return result.rows;
        } catch (error) {
            Logger.error('Error getting URLs with metadata:', error as Error);
            return [];
        }
    }

    /**
     * Close database connection
     */
    public async close(): Promise<void> {
        try {
            await this.pool.end();
            Logger.debug('Database pool closed successfully');
        } catch (error) {
            // Ignore errors during shutdown as they're expected
            Logger.debug('Database pool close completed');
        }
    }
}
