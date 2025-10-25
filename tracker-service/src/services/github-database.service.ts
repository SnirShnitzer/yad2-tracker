import { Pool, PoolClient } from 'pg';
import { Logger } from '../utils/logger.js';

/**
 * GitHub Actions specific database service with IPv4 workarounds
 */
export class GitHubDatabaseService {
    private pool: Pool;

    constructor() {
        // For GitHub Actions, use a more aggressive IPv4 approach
        const url = new URL(process.env.DATABASE_URL || '');
        
        // Try to force IPv4 by using connection parameters
        this.pool = new Pool({
            host: url.hostname,
            port: parseInt(url.port) || 5432,
            database: url.pathname.slice(1),
            user: url.username,
            password: url.password,
            ssl: { rejectUnauthorized: false },
            connectionTimeoutMillis: 30000,
            idleTimeoutMillis: 30000,
            statement_timeout: 20000,
            query_timeout: 20000,
            application_name: 'yad2-tracker-github',
            // Force IPv4 connection
            keepAlive: true,
            keepAliveInitialDelayMillis: 0
        });
    }

    /**
     * Test database connection with retry logic
     */
    public async testConnection(): Promise<boolean> {
        const maxRetries = 3;
        let retryCount = 0;

        while (retryCount < maxRetries) {
            try {
                Logger.info(`Connection attempt ${retryCount + 1}/${maxRetries}`);
                const client = await this.pool.connect();
                await client.query('SELECT 1');
                client.release();
                Logger.success('Database connection test successful');
                return true;
            } catch (error) {
                retryCount++;
                Logger.warning(`Connection attempt ${retryCount} failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                
                if (retryCount < maxRetries) {
                    Logger.info(`Retrying in 2 seconds...`);
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }
        }

        Logger.error('All connection attempts failed');
        return false;
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
    public async saveAds(ads: any[]): Promise<void> {
        if (ads.length === 0) return;

        try {
            const client = await this.pool.connect();
            
            const values = ads.map(ad => [
                ad.id,
                ad.title,
                ad.link,
                ad.price,
                ad.address,
                ad.description || null,
                new Date(ad.timestamp)
            ]);

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
     * Close database connection
     */
    public async close(): Promise<void> {
        await this.pool.end();
    }
}
