import * as fs from 'fs';
import { AdData } from '../types.js';
import { Logger } from '../utils/logger.js';

/**
 * Service for managing ad storage and tracking
 */
export class StorageService {
    private seenAds: AdData[] = [];
    private readonly filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
        this.seenAds = this.loadSeenAds();
    }

    /**
     * Load previously seen ads from JSON file
     */
    private loadSeenAds(): AdData[] {
        try {
            if (fs.existsSync(this.filePath)) {
                const data = fs.readFileSync(this.filePath, 'utf8');
                const parsed = JSON.parse(data) as AdData[];
                Logger.info(`Loaded ${parsed.length} previously seen ads`);
                return parsed;
            }
        } catch (error) {
            Logger.warning('No existing seen ads file found, starting fresh');
        }
        return [];
    }

    /**
     * Save seen ads to JSON file
     */
    public saveSeenAds(): void {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(this.seenAds, null, 2));
            Logger.success(`Saved ${this.seenAds.length} seen ads to ${this.filePath}`);
        } catch (error) {
            Logger.error('Error saving seen ads:', error as Error);
        }
    }

    /**
     * Get all seen ads
     */
    public getSeenAds(): AdData[] {
        return this.seenAds;
    }

    /**
     * Add new ads to seen ads
     */
    public addSeenAds(newAds: AdData[]): void {
        this.seenAds = this.seenAds.concat(newAds);
    }

    /**
     * Find new ads by comparing with seen ads
     */
    public findNewAds(currentAds: AdData[]): AdData[] {
        const seenIds = new Set(this.seenAds.map(ad => ad.id));
        const newAds = currentAds.filter(ad => !seenIds.has(ad.id));
        
        Logger.info(`Found ${newAds.length} new ads out of ${currentAds.length} total ads`);
        return newAds;
    }

    /**
     * Get seen ads count
     */
    public getSeenAdsCount(): number {
        return this.seenAds.length;
    }
}
