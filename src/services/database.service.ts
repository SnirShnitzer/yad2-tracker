import { Pool, PoolClient } from 'pg';
import { AdData } from '../types.js';
import { Logger } from '../utils/logger.js';

/**
 * Database service for storing and retrieving seen ads
 */
export class DatabaseService {
    private pool: Pool;

    constructor() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        });
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
     * Close database connection
     */
    public async close(): Promise<void> {
        await this.pool.end();
    }
}
