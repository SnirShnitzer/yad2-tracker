import { EmailConfig } from './types.js';

// Yad2 API endpoints to monitor (filtering out brokerage ads)
export const YAD2_API_URLS: string[] = [
    'https://gw.yad2.co.il/realestate-feed/rent/map?city=5000&neighborhood=1520&area=1&topArea=2&minPrice=6000&maxPrice=14000&minRooms=3&maxRooms=4&zoom=15'
];

// File paths
export const SEEN_ADS_FILE: string = 'seen_ads.json';

// Words to filter out from ads (brokerage, projects, offices)
export const FILTER_WORDS: string[] = [
    'תיווך', 'פרויקט', 'משרד', 'brokerage', 'project', 'office',
    'משרד תיווך', 'סוכנות', 'נדלן', 'real estate', 'agency',
    'משרד נדלן', 'סוכנות נדלן', 'תיווך נדלן'
];

// Email configuration
export const EMAIL_CONFIG: EmailConfig = {
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER || '',
        pass: process.env.GMAIL_APP_PASSWORD || ''
    }
};

// HTTP headers for API requests
export const REQUEST_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

// Cron schedule (every 15 minutes)
export const CRON_SCHEDULE = '0 * * * *';

// Timezone for scheduling
export const TIMEZONE = 'Asia/Jerusalem';
