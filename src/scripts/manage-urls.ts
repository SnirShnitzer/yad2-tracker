#!/usr/bin/env node

import dotenv from 'dotenv';
import { UrlManagerService } from '../services/url-manager.service.js';
import { Logger } from '../utils/logger.js';

// Load environment variables
dotenv.config();

/**
 * CLI script for managing Yad2 URLs in the database
 */
class UrlManagerCLI {
    private urlManager: UrlManagerService;

    constructor() {
        this.urlManager = new UrlManagerService();
    }

    /**
     * Initialize the URL manager
     */
    public async initialize(): Promise<void> {
        await this.urlManager.initialize();
    }

    /**
     * Add a new URL
     */
    public async addUrl(url: string, name?: string): Promise<void> {
        await this.urlManager.addUrl(url, name);
        Logger.success(`Added URL: ${url}${name ? ` (${name})` : ''}`);
    }

    /**
     * List all URLs
     */
    public async listUrls(): Promise<void> {
        await this.urlManager.listUrls();
    }

    /**
     * Update URL status
     */
    public async updateUrlStatus(url: string, isActive: boolean): Promise<void> {
        await this.urlManager.updateUrlStatus(url, isActive);
        Logger.success(`Updated URL status: ${url} -> ${isActive ? 'active' : 'inactive'}`);
    }

    /**
     * Close connections
     */
    public async close(): Promise<void> {
        await this.urlManager.close();
    }
}

/**
 * Main CLI function
 */
async function main(): Promise<void> {
    const args = process.argv.slice(2);
    const command = args[0];

    const cli = new UrlManagerCLI();
    
    try {
        await cli.initialize();

        switch (command) {
            case 'add':
                const url = args[1];
                const name = args[2];
                if (!url) {
                    Logger.error('Usage: npm run manage-urls add <url> [name]');
                    process.exit(1);
                }
                await cli.addUrl(url, name);
                break;

            case 'list':
                await cli.listUrls();
                break;

            case 'activate':
                const activateUrl = args[1];
                if (!activateUrl) {
                    Logger.error('Usage: npm run manage-urls activate <url>');
                    process.exit(1);
                }
                await cli.updateUrlStatus(activateUrl, true);
                break;

            case 'deactivate':
                const deactivateUrl = args[1];
                if (!deactivateUrl) {
                    Logger.error('Usage: npm run manage-urls deactivate <url>');
                    process.exit(1);
                }
                await cli.updateUrlStatus(deactivateUrl, false);
                break;

            default:
                Logger.info('Yad2 URL Manager');
                Logger.info('');
                Logger.info('Usage:');
                Logger.info('  npm run manage-urls add <url> [name]     - Add a new URL');
                Logger.info('  npm run manage-urls list                 - List all URLs');
                Logger.info('  npm run manage-urls activate <url>        - Activate a URL');
                Logger.info('  npm run manage-urls deactivate <url>      - Deactivate a URL');
                Logger.info('');
                Logger.info('Examples:');
                Logger.info('  npm run manage-urls add "https://gw.yad2.co.il/realestate-feed/rent/map?city=5000" "Tel Aviv Rentals"');
                Logger.info('  npm run manage-urls list');
                Logger.info('  npm run manage-urls activate "https://gw.yad2.co.il/realestate-feed/rent/map?city=5000"');
                break;
        }
    } catch (error) {
        Logger.error('Error:', error as Error);
        process.exit(1);
    } finally {
        await cli.close();
    }
}

// Run the CLI
main().catch(error => {
    Logger.error('Fatal error:', error as Error);
    process.exit(1);
});
