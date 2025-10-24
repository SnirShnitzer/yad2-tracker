import { DatabaseService } from './database.service.js';
import { Logger } from '../utils/logger.js';

/**
 * Service for managing Yad2 URLs in the database
 */
export class UrlManagerService {
    private databaseService: DatabaseService | null = null;

    constructor() {
        if (process.env.DATABASE_URL) {
            this.databaseService = new DatabaseService();
        }
    }

    /**
     * Initialize the URL manager
     */
    public async initialize(): Promise<void> {
        if (this.databaseService) {
            try {
                await this.databaseService.initializeDatabase();
                Logger.success('URL manager initialized with database');
            } catch (error) {
                Logger.error('Error initializing URL manager:', error as Error);
                this.databaseService = null;
            }
        } else {
            Logger.warning('No database URL provided, URL manager will use config fallback');
        }
    }

    /**
     * Add a new URL to the database
     */
    public async addUrl(url: string, name?: string): Promise<void> {
        if (!this.databaseService) {
            Logger.warning('No database connection, cannot add URL');
            return;
        }

        try {
            await this.databaseService.addUrl(url, name);
        } catch (error) {
            Logger.error('Error adding URL:', error as Error);
            throw error;
        }
    }

    /**
     * Get all URLs with metadata
     */
    public async getAllUrls(): Promise<Array<{url: string, name: string | null, is_active: boolean}>> {
        if (!this.databaseService) {
            Logger.warning('No database connection, cannot get URLs');
            return [];
        }

        try {
            return await this.databaseService.getUrlsWithMetadata();
        } catch (error) {
            Logger.error('Error getting URLs:', error as Error);
            return [];
        }
    }

    /**
     * Get only active URLs
     */
    public async getActiveUrls(): Promise<string[]> {
        if (!this.databaseService) {
            Logger.warning('No database connection, cannot get URLs');
            return [];
        }

        try {
            return await this.databaseService.getUrls();
        } catch (error) {
            Logger.error('Error getting active URLs:', error as Error);
            return [];
        }
    }

    /**
     * Update URL status (activate/deactivate)
     */
    public async updateUrlStatus(url: string, isActive: boolean): Promise<void> {
        if (!this.databaseService) {
            Logger.warning('No database connection, cannot update URL status');
            return;
        }

        try {
            await this.databaseService.updateUrlStatus(url, isActive);
        } catch (error) {
            Logger.error('Error updating URL status:', error as Error);
            throw error;
        }
    }

    /**
     * List all URLs with their status
     */
    public async listUrls(): Promise<void> {
        const urls = await this.getAllUrls();
        
        if (urls.length === 0) {
            Logger.info('No URLs found in database');
            return;
        }

        Logger.info('URLs in database:');
        urls.forEach((urlData, index) => {
            const status = urlData.is_active ? '✅ Active' : '❌ Inactive';
            const name = urlData.name ? ` (${urlData.name})` : '';
            Logger.info(`${index + 1}. ${status}${name}: ${urlData.url}`);
        });
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
