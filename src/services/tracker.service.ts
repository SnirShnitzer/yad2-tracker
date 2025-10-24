import { AdData } from '../types.js';
import { Logger } from '../utils/logger.js';
import { ScraperService } from './scraper.service.js';
import { EmailService } from './email.service.js';
import { StorageService } from './storage.service.js';
import { YAD2_URLS, SEEN_ADS_FILE, EMAIL_CONFIG } from '../config.js';

/**
 * Main tracker service that orchestrates the entire process
 */
export class TrackerService {
    private scraperService: ScraperService;
    private emailService: EmailService;
    private storageService: StorageService;

    constructor() {
        this.scraperService = new ScraperService();
        this.emailService = new EmailService(EMAIL_CONFIG);
        this.storageService = new StorageService(SEEN_ADS_FILE);
    }

    /**
     * Main tracking function
     */
    public async trackListings(): Promise<void> {
        Logger.start('Starting Yad2 tracking...');
        
        try {
            // Scrape all URLs
            const allAds = await this.scraperService.scrapeUrls(YAD2_URLS);
            
            // Filter out unwanted ads
            const filteredAds = this.scraperService.filterAds(allAds);
            Logger.info(`After filtering: ${filteredAds.length} ads`);

            // Find new ads
            const newAds = this.storageService.findNewAds(filteredAds);

            if (newAds.length > 0) {
                Logger.success(`Found ${newAds.length} new ads`);
                this.logNewAds(newAds);

                // Send email notification
                await this.emailService.sendEmailNotification(newAds);
            } else {
                Logger.info('No new ads found');
            }

            // Update seen ads
            this.storageService.addSeenAds(newAds);
            this.storageService.saveSeenAds();

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
            Logger.info(`- ${ad.title} (${ad.price}) - ${ad.link}`);
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
