import axios, { AxiosResponse } from 'axios';
import { AdData, Yad2ApiResponse, Yad2Marker } from '../types.js';
import { Logger } from '../utils/logger.js';
import { generateAdId, removeDuplicateAds, containsFilterWords } from '../utils/helpers.js';
import { REQUEST_HEADERS, FILTER_WORDS, YAD2_API_URLS } from '../config.js';

/**
 * Service for fetching Yad2 data from JSON API
 */
export class ScraperService {
    /**
     * Fetch JSON data from Yad2 API
     */
    public async fetchApiData(url: string): Promise<Yad2ApiResponse | null> {
        try {
            Logger.info(`Fetching Yad2 API data from: ${url}`);
            const response: AxiosResponse<Yad2ApiResponse> = await axios.get(url, {
                headers: REQUEST_HEADERS,
                timeout: 10000 // 10 second timeout
            });
            
            Logger.success(`Successfully fetched data from ${url}`);
            return response.data;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            Logger.error(`Error fetching API data from ${url}: ${errorMessage}`);
            return null;
        }
    }

    /**
     * Parse API response and extract ad information
     */
    public parseApiResponse(apiResponse: Yad2ApiResponse): AdData[] {
        const ads: AdData[] = [];

        if (apiResponse?.data?.markers) {
            const markers = apiResponse.data.markers;
            
            markers.forEach((marker: Yad2Marker) => {
                // Build address string
                const addressParts = [
                    marker.address.street?.text,
                    marker.address.house.number ? marker.address.house.number.toString() : '',
                    marker.address.neighborhood?.text,
                    marker.address.area.text,
                    marker.address.city.text
                ].filter(Boolean);
                
                const address = addressParts.join(', ');
                
                // Build title from property details
                const title = `${marker.additionalDetails.property.text} ${marker.additionalDetails.roomsCount} חדרים, ${marker.additionalDetails.squareMeter} מ"ר`;
                
                // Format price
                const price = `${marker.price.toLocaleString()} ₪`;
                
                // Create link using token
                const link = `https://www.yad2.co.il/item/${marker.token}`;
                
                // Determine if it's private based on adType
                const isPrivate = marker.adType === 'private' || marker.adType === 'פרטי';
                
                const ad: AdData = {
                    id: marker.token,
                    title: title,
                    link: link,
                    price: price,
                    address: address,
                    description: isPrivate ? 'Private' : marker.customer?.agencyName || 'Unknown',
                    timestamp: new Date().toISOString()
                };
                
                ads.push(ad);
            });
        }

        Logger.info(`Parsed ${ads.length} ads from API response`);
        return ads;
    }

    /**
     * Filter out ads containing unwanted words and brokerage ads
     */
    public filterAds(ads: AdData[]): AdData[] {
        let brokerageCount = 0;
        let privateCount = 0;
        
        const filteredAds = ads.filter(ad => {
            // Filter out brokerage ads (where description is not 'Private')
            const isBrokerage = ad.description !== 'Private';
            
            if (isBrokerage) {
                brokerageCount++;
            } else {
                privateCount++;
            }
            
            // Filter out ads with unwanted words
            const textToCheck = `${ad.title} ${ad.address}`;
            const hasUnwantedWords = containsFilterWords(textToCheck, FILTER_WORDS);
            
            return !isBrokerage && !hasUnwantedWords;
        });

        Logger.info(`Found ${brokerageCount} brokerage ads and ${privateCount} private ads`);
        Logger.info(`Filtered ${ads.length} ads down to ${filteredAds.length} ads (removed brokerage and unwanted words)`);
        return filteredAds;
    }

    /**
     * Fetch ads from multiple API endpoints and return combined results
     */
    public async fetchAdsFromApis(apiUrls: string[]): Promise<AdData[]> {
        let allAds: AdData[] = [];

        for (const url of apiUrls) {
            const apiResponse = await this.fetchApiData(url);
            if (apiResponse) {
                const ads = this.parseApiResponse(apiResponse);
                Logger.info(`Found ${ads.length} ads from ${url}`);
                allAds = allAds.concat(ads);
            }
        }

        // Remove duplicates based on ID
        const uniqueAds = removeDuplicateAds(allAds);
        Logger.info(`Total unique ads found: ${uniqueAds.length}`);

        return uniqueAds;
    }

    /**
     * Fetch ads from the working API endpoints
     */
    public async fetchAdsWithFallback(): Promise<AdData[]> {
        const ads = await this.fetchAdsFromApis(YAD2_API_URLS);
        
        if (ads.length === 0) {
            Logger.warning('No listings found. This might be normal if no listings match your criteria.');
        }

        return ads;
    }
}
