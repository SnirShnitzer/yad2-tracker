import { AdData } from '../types.js';

/**
 * Generate unique ID for an ad based on title and link
 */
export function generateAdId(title: string, link: string): string {
    return Buffer.from(`${title}-${link}`).toString('base64').slice(0, 20);
}

/**
 * Create full URL if link is relative
 */
export function createFullUrl(link: string | undefined): string {
    if (!link) return '';
    return link.startsWith('/') ? `https://www.yad2.co.il${link}` : link;
}

/**
 * Remove duplicate ads based on ID
 */
export function removeDuplicateAds(ads: AdData[]): AdData[] {
    return ads.filter((ad, index, self) => 
        index === self.findIndex(a => a.id === ad.id)
    );
}

/**
 * Check if text contains any filter words
 */
export function containsFilterWords(text: string, filterWords: string[]): boolean {
    const textToCheck = text.toLowerCase();
    return filterWords.some(word => 
        textToCheck.includes(word.toLowerCase())
    );
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(date: Date = new Date()): string {
    return date.toISOString();
}

/**
 * Validate email configuration
 */
export function validateEmailConfig(): boolean {
    return !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

/**
 * Get environment variable with fallback
 */
export function getEnvVar(key: string, fallback: string = ''): string {
    return process.env[key] || fallback;
}
