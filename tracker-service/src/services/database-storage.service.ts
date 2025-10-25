import { AdData } from '../types.js';
import { Logger } from '../utils/logger.js';
import { DatabaseService } from './database.service.js';

/**
 * Database-enabled storage service for managing seen ads
 */
export class DatabaseStorageService {
    private databaseService: DatabaseService | null = null;
    private seenAds: Set<string> = new Set();
    private useDatabase: boolean = false;

    constructor() {
        this.useDatabase = !!process.env.DATABASE_URL;
        
        if (this.useDatabase) {
            this.databaseService = new DatabaseService();
        }
    }

    /**
     * Initialize storage (database or fallback to file)
     */
    public async initialize(): Promise<void> {
        if (this.useDatabase && this.databaseService) {
            try {
                // Test database connection first
                const connectionTest = await this.databaseService.testConnection();
                if (!connectionTest) {
                    throw new Error('Database connection test failed');
                }

                await this.databaseService.initializeDatabase();
                const seenIds = await this.databaseService.getSeenAdIds();
                this.seenAds = new Set(seenIds);
                Logger.success(`Loaded ${this.seenAds.size} seen ads from database`);
            } catch (error) {
                Logger.error('Error initializing database, falling back to file storage:', error as Error);
                this.useDatabase = false;
                this.databaseService = null;
            }
        }
    }

    /**
     * Add new ads to seen ads
     */
    public async addSeenAds(ads: AdData[]): Promise<void> {
        if (this.useDatabase && this.databaseService) {
            try {
                await this.databaseService.saveAds(ads);
                // Update local cache
                ads.forEach(ad => this.seenAds.add(ad.id));
            } catch (error) {
                Logger.error('Error saving ads to database:', error as Error);
                // Fallback to local cache only
                ads.forEach(ad => this.seenAds.add(ad.id));
            }
        } else {
            ads.forEach(ad => this.seenAds.add(ad.id));
        }
    }

    /**
     * Find new ads that haven't been seen before
     */
    public findNewAds(allAds: AdData[]): AdData[] {
        return allAds.filter(ad => !this.seenAds.has(ad.id));
    }

    /**
     * Get statistics about seen ads
     */
    public async getStats(): Promise<{ seenAdsCount: number; totalAds?: number; latestAd?: Date | null }> {
        if (this.useDatabase && this.databaseService) {
            try {
                const dbStats = await this.databaseService.getStats();
                return {
                    seenAdsCount: this.seenAds.size,
                    totalAds: dbStats.totalAds,
                    latestAd: dbStats.latestAd
                };
            } catch (error) {
                Logger.error('Error getting database stats:', error as Error);
            }
        }
        
        return {
            seenAdsCount: this.seenAds.size
        };
    }

    /**
     * Check if database is available
     */
    public isDatabaseAvailable(): boolean {
        return this.useDatabase && this.databaseService !== null;
    }

    /**
     * Close database connection
     */
    public async close(): Promise<void> {
        if (this.databaseService) {
            await this.databaseService.close();
        }
    }
}
