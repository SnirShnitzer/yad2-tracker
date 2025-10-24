import { AdData } from '../types.js';
import { Logger } from '../utils/logger.js';
import { ScraperService } from './scraper.service.js';
import { EmailService } from './email.service.js';
import { StorageService } from './storage.service.js';
import { DatabaseStorageService } from './database-storage.service.js';
import { YAD2_API_URLS, SEEN_ADS_FILE, EMAIL_CONFIG } from '../config.js';

/**
 * Main tracker service that orchestrates the entire process
 */
export class TrackerService {
    private scraperService: ScraperService;
    private emailService: EmailService;
    private storageService: StorageService;
    private databaseStorageService: DatabaseStorageService;

    constructor() {
        this.scraperService = new ScraperService();
        this.emailService = new EmailService(EMAIL_CONFIG);
        this.storageService = new StorageService(SEEN_ADS_FILE);
        this.databaseStorageService = new DatabaseStorageService();
    }

    /**
     * Initialize the tracker service
     */
    public async initialize(): Promise<void> {
        // Initialize database storage if available
        await this.databaseStorageService.initialize();
        
        const stats = await this.databaseStorageService.getStats();
        Logger.info(`Loaded ${stats.seenAdsCount} previously seen ads`);
    }

    /**
     * Main tracking function
     */
    public async trackListings(): Promise<void> {
        Logger.start('Starting Yad2 tracking...');
        
        try {
            // Fetch ads from API endpoints with fallback
            const allAds = await this.scraperService.fetchAdsWithFallback();
            
            // Filter out unwanted ads
            const filteredAds = this.scraperService.filterAds(allAds);
            Logger.info(`After filtering: ${filteredAds.length} ads`);

            // Find new ads using database storage
            const newAds = this.databaseStorageService.findNewAds(filteredAds);

            if (newAds.length > 0) {
                Logger.success(`Found ${newAds.length} new ads`);
                this.logNewAds(newAds);

                // Send email notification
                await this.emailService.sendEmailNotification(newAds);
            } else {
                Logger.info('No new ads found');
            }

            // Update seen ads in database
            await this.databaseStorageService.addSeenAds(newAds);

            Logger.success('Tracking completed!');
        } catch (error) {
            Logger.error('Error in tracking process:', error as Error);
            throw error;
        }
    }

    /**
     * Log new ads to console
     */
    private logNewAds(newAds: AdData[]): void {
        Logger.info('New ads:');
        newAds.forEach(ad => {
            Logger.info(`- ${ad.title} (${ad.price}) - ${ad.address} - ${ad.link}`);
        });
    }

    /**
     * Get statistics about the tracker
     */
    public getStats(): { seenAdsCount: number } {
        return {
            seenAdsCount: this.storageService.getSeenAdsCount()
        };
    }

    /**
     * Test email configuration
     */
    public async testEmailConfiguration(): Promise<boolean> {
        return await this.emailService.testEmailConfiguration();
    }
}
