import axios, { AxiosResponse } from 'axios';
import * as cheerio from 'cheerio';
import { AdData, ParsedAd } from '../types.js';
import { Logger } from '../utils/logger.js';
import { generateAdId, createFullUrl, removeDuplicateAds, containsFilterWords } from '../utils/helpers.js';
import { REQUEST_HEADERS, FILTER_WORDS } from '../config.js';

/**
 * Service for scraping Yad2 data
 */
export class ScraperService {
    /**
     * Fetch HTML from a URL
     */
    public async fetchUrl(url: string): Promise<string | null> {
        try {
            Logger.info('Fetching Yad2 data...');
            const response: AxiosResponse<string> = await axios.get(url, {
                headers: REQUEST_HEADERS
            });
            return response.data;
        } catch (error) {
            Logger.error(`Error fetching ${url}:`, error as Error);
            return null;
        }
    }

    /**
     * Parse HTML and extract ad information
     */
    public parseAds(html: string): AdData[] {
        const $ = cheerio.load(html);
        const ads: AdData[] = [];

        $('.feed_item').each((index: number, element: cheerio.Element) => {
            const $ad = $(element);
            
            // Extract ad information
            const title: string = $ad.find('.feed_title a').text().trim();
            const link: string | undefined = $ad.find('.feed_title a').attr('href');
            const price: string = $ad.find('.price').text().trim();
            const location: string = $ad.find('.location').text().trim();
            const description: string = $ad.find('.feed_description').text().trim();

            // Create full URL if link is relative
            const fullLink: string = createFullUrl(link);

            if (title && fullLink) {
                ads.push({
                    id: generateAdId(title, fullLink),
                    title,
                    link: fullLink,
                    price,
                    location,
                    description,
                    timestamp: new Date().toISOString()
                });
            }
        });

        Logger.info(`Parsed ${ads.length} ads from HTML`);
        return ads;
    }

    /**
     * Filter out ads containing unwanted words
     */
    public filterAds(ads: AdData[]): AdData[] {
        const filteredAds = ads.filter(ad => {
            const textToCheck = `${ad.title} ${ad.description}`;
            return !containsFilterWords(textToCheck, FILTER_WORDS);
        });

        Logger.info(`Filtered ${ads.length} ads down to ${filteredAds.length} ads`);
        return filteredAds;
    }

    /**
     * Scrape multiple URLs and return combined results
     */
    public async scrapeUrls(urls: string[]): Promise<AdData[]> {
        let allAds: AdData[] = [];

        for (const url of urls) {
            const html = await this.fetchUrl(url);
            if (html) {
                const ads = this.parseAds(html);
                Logger.info(`Found ${ads.length} ads from ${url}`);
                allAds = allAds.concat(ads);
            }
        }

        // Remove duplicates based on ID
        const uniqueAds = removeDuplicateAds(allAds);
        Logger.info(`Total unique ads found: ${uniqueAds.length}`);

        return uniqueAds;
    }
}
