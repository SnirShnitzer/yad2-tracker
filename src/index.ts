import cron from 'node-cron';
import dotenv from 'dotenv';
import { TrackerService } from './services/tracker.service.js';
import { Logger } from './utils/logger.js';
import { CRON_SCHEDULE, TIMEZONE } from './config.js';

// Load environment variables from .env file
dotenv.config();

// Main execution function
async function runTracker(): Promise<void> {
    const tracker = new TrackerService();
    await tracker.trackListings();
}

// Check if running in scheduled mode or one-time mode
const isScheduled: boolean = process.argv.includes('--schedule') || process.argv.includes('-s');

if (isScheduled) {
    Logger.start('Starting Yad2 Tracker in scheduled mode (every 15 minutes)');
    Logger.info('Press Ctrl+C to stop the scheduler');
    
    // Schedule to run every 15 minutes
    cron.schedule(CRON_SCHEDULE, async () => {
        Logger.schedule('Running scheduled check...');
        try {
            await runTracker();
        } catch (error) {
            Logger.error('Error in scheduled run:', error as Error);
        }
    }, {
        timezone: TIMEZONE
    });
    
    // Run once immediately
    Logger.info('Running initial check...');
    runTracker().catch(error => {
        Logger.error('Error in initial run:', error as Error);
    });
    
} else {
    // Run once and exit
    Logger.start('Running Yad2 Tracker (one-time mode)');
    Logger.info('Use --schedule flag to run continuously every 15 minutes');
    
    runTracker().catch(error => {
        Logger.error('Error running tracker:', error as Error);
        process.exit(1);
    });
}
