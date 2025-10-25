import cron from 'node-cron';
import dotenv from 'dotenv';
import { TrackerService } from './services/tracker.service.js';
import { Logger } from './utils/logger.js';
import { CRON_SCHEDULE, TIMEZONE } from './config.js';

// Load environment variables from .env file
dotenv.config();

// Graceful shutdown handler
process.on('SIGINT', async () => {
    Logger.info('Received SIGINT, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    Logger.info('Received SIGTERM, shutting down gracefully...');
    process.exit(0);
});

process.on('uncaughtException', (error) => {
    Logger.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    Logger.error('Unhandled Rejection:', reason as Error);
    process.exit(1);
});

// Validate database connection before starting
async function validateDatabaseConnection(): Promise<void> {
    if (!process.env.DATABASE_URL) {
        if (process.env.REQUIRE_DATABASE === 'true' || process.env.NODE_ENV === 'production') {
            throw new Error('DATABASE_URL is required but not provided');
        }
        Logger.warning('No DATABASE_URL provided, will use file storage fallback');
        return;
    }

    try {
        // Use the same DatabaseService for consistency
        const { DatabaseService } = await import('./services/database.service.js');
        const dbService = new DatabaseService();
        
        const isConnected = await dbService.testConnection();
        if (!isConnected) {
            throw new Error('Database connection test failed');
        }
        
        await dbService.close();
        Logger.success('Database connection validated successfully');
    } catch (error) {
        Logger.error('Database connection validation failed:', error as Error);
        throw new Error(`Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

// Main execution function
async function runTracker(): Promise<void> {
    const tracker = new TrackerService();
    
    try {
        await tracker.initialize();
        await tracker.trackListings();
    } catch (error) {
        Logger.error('Tracker initialization failed:', error as Error);
        
        // Check if it's a database-related error
        if (error instanceof Error) {
            if (error.message.includes('Database connection') || 
                error.message.includes('DATABASE_URL') ||
                error.message.includes('database') ||
                error.message.includes('connection')) {
                Logger.error('FATAL: Database connection failed. Exiting...');
                process.exit(1);
            }
        }
        
        throw error;
    } finally {
        // Ensure database connections are properly closed
        try {
            await tracker.close();
        } catch (closeError) {
            Logger.warning('Error closing tracker: ' + (closeError as Error).message);
        }
    }
}

// Check if running in scheduled mode or one-time mode
const isScheduled: boolean = process.argv.includes('--schedule') || process.argv.includes('-s');

if (isScheduled) {
    Logger.start('Starting Yad2 Tracker in scheduled mode (every 15 minutes)');
    Logger.info('Press Ctrl+C to stop the scheduler');
    
    // Validate database connection before starting scheduler
    validateDatabaseConnection().catch(error => {
        Logger.error('FATAL: Database validation failed:', error as Error);
        process.exit(1);
    });
    
    // Schedule to run every 15 minutes
    cron.schedule(CRON_SCHEDULE, async () => {
        Logger.schedule('Running scheduled check...');
        try {
            await runTracker();
        } catch (error) {
            Logger.error('Error in scheduled run:', error as Error);
            // If database connection fails, stop the scheduler
            if (error instanceof Error && (
                error.message.includes('Database connection') ||
                error.message.includes('DATABASE_URL') ||
                error.message.includes('database') ||
                error.message.includes('connection')
            )) {
                Logger.error('FATAL: Stopping scheduler due to database connection failure');
                process.exit(1);
            }
        }
    }, {
        timezone: TIMEZONE
    });
    
    // Run once immediately
    Logger.info('Running initial check...');
    runTracker().catch(error => {
        Logger.error('Error in initial run:', error as Error);
        // If database connection fails, exit immediately
        if (error instanceof Error && (
            error.message.includes('Database connection') ||
            error.message.includes('DATABASE_URL') ||
            error.message.includes('database') ||
            error.message.includes('connection')
        )) {
            Logger.error('FATAL: Exiting due to database connection failure');
            process.exit(1);
        }
    });
    
} else {
    // Run once and exit
    Logger.start('Running Yad2 Tracker (one-time mode)');
    Logger.info('Use --schedule flag to run continuously every 15 minutes');
    
    // Validate database connection before running
    validateDatabaseConnection()
        .then(() => runTracker())
        .catch(error => {
            Logger.error('FATAL: Database validation or tracker execution failed:', error as Error);
            process.exit(1);
        });
}
