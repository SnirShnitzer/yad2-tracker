import { EmailConfig } from './types.js';

// Yad2 URLs to monitor
export const YAD2_URLS: string[] = [
    'https://www.yad2.co.il/realestate/rent?minPrice=6000&maxPrice=14000&minRooms=3&maxRooms=4&brokerage=1&topArea=2&area=1&city=5000&neighborhood=1520&zoom=14',
    'https://www.yad2.co.il/realestate/rent?minPrice=6000&maxPrice=14000&minRooms=3&maxRooms=4&topArea=2&area=1&city=5000&neighborhood=1520&zoom=14'
];

// File paths
export const SEEN_ADS_FILE: string = 'seen_ads.json';

// Words to filter out from ads
export const FILTER_WORDS: string[] = ['תיווך', 'פרויקט', 'משרד', 'brokerage', 'project', 'office'];

// Email configuration
export const EMAIL_CONFIG: EmailConfig = {
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER || '',
        pass: process.env.GMAIL_APP_PASSWORD || ''
    }
};

// HTTP headers for requests
export const REQUEST_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
};

// Cron schedule (every 15 minutes)
export const CRON_SCHEDULE = '*/15 * * * *';

// Timezone for scheduling
export const TIMEZONE = 'Asia/Jerusalem';
