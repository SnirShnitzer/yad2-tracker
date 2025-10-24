#!/usr/bin/env node

import dotenv from 'dotenv';
import { Pool } from 'pg';
import { Logger } from '../utils/logger.js';

// Load environment variables
dotenv.config();

/**
 * Database connection test script
 */
class DatabaseTest {
    private pool: Pool | null = null;

    constructor() {
        if (process.env.DATABASE_URL) {
            this.pool = new Pool({
                connectionString: process.env.DATABASE_URL,
                ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
            });
        }
    }

    /**
     * Test database connection
     */
    public async testConnection(): Promise<boolean> {
        if (!this.pool) {
            Logger.error('❌ No DATABASE_URL found in environment variables');
            return false;
        }

        try {
            Logger.info('🔍 Testing database connection...');
            const client = await this.pool.connect();
            
            // Test basic connection
            const result = await client.query('SELECT NOW() as current_time');
            Logger.success(`✅ Database connection successful!`);
            Logger.info(`📅 Database time: ${result.rows[0].current_time}`);
            
            client.release();
            return true;
        } catch (error) {
            Logger.error('❌ Database connection failed:', error as Error);
            return false;
        }
    }

    /**
     * Test table creation
     */
    public async testTableCreation(): Promise<boolean> {
        if (!this.pool) {
            Logger.error('❌ No database connection available');
            return false;
        }

        try {
            Logger.info('🔍 Testing table creation...');
            const client = await this.pool.connect();
            
            // Create seen_ads table
            await client.query(`
                CREATE TABLE IF NOT EXISTS seen_ads (
                    id VARCHAR(255) PRIMARY KEY,
                    title TEXT NOT NULL,
                    link TEXT NOT NULL,
                    price TEXT NOT NULL,
                    address TEXT NOT NULL,
                    description TEXT,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
            Logger.success('✅ seen_ads table created/verified');

            // Create urls table
            await client.query(`
                CREATE TABLE IF NOT EXISTS urls (
                    id SERIAL PRIMARY KEY,
                    url TEXT NOT NULL UNIQUE,
                    name TEXT,
                    is_active BOOLEAN DEFAULT true,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
            Logger.success('✅ urls table created/verified');

            // Create indexes
            await client.query(`
                CREATE INDEX IF NOT EXISTS idx_seen_ads_id ON seen_ads(id)
            `);
            Logger.success('✅ Indexes created/verified');

            client.release();
            return true;
        } catch (error) {
            Logger.error('❌ Table creation failed:', error as Error);
            return false;
        }
    }

    /**
     * Test URL operations
     */
    public async testUrlOperations(): Promise<boolean> {
        if (!this.pool) {
            Logger.error('❌ No database connection available');
            return false;
        }

        try {
            Logger.info('🔍 Testing URL operations...');
            const client = await this.pool.connect();
            
            // Test adding a URL
            const testUrl = 'https://gw.yad2.co.il/realestate-feed/rent/map?city=5000&neighborhood=1520&area=1&topArea=2&minPrice=6000&maxPrice=14000&minRooms=3&maxRooms=4&zoom=15';
            const testName = 'Tel Aviv Center Rentals';
            
            await client.query(
                'INSERT INTO urls (url, name) VALUES ($1, $2) ON CONFLICT (url) DO NOTHING',
                [testUrl, testName]
            );
            Logger.success('✅ URL added successfully');

            // Test retrieving URLs
            const result = await client.query('SELECT * FROM urls WHERE url = $1', [testUrl]);
            if (result.rows.length > 0) {
                Logger.success('✅ URL retrieved successfully');
                Logger.info(`📝 URL: ${result.rows[0].url}`);
                Logger.info(`📝 Name: ${result.rows[0].name}`);
                Logger.info(`📝 Active: ${result.rows[0].is_active}`);
            } else {
                Logger.error('❌ URL not found after insertion');
                return false;
            }

            client.release();
            return true;
        } catch (error) {
            Logger.error('❌ URL operations failed:', error as Error);
            return false;
        }
    }

    /**
     * List all tables
     */
    public async listTables(): Promise<void> {
        if (!this.pool) {
            Logger.error('❌ No database connection available');
            return;
        }

        try {
            Logger.info('🔍 Listing all tables...');
            const client = await this.pool.connect();
            
            const result = await client.query(`
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                ORDER BY table_name
            `);
            
            if (result.rows.length > 0) {
                Logger.success('✅ Tables found:');
                result.rows.forEach(row => {
                    Logger.info(`📋 ${row.table_name}`);
                });
            } else {
                Logger.warning('⚠️  No tables found in database');
            }

            client.release();
        } catch (error) {
            Logger.error('❌ Failed to list tables:', error as Error);
        }
    }

    /**
     * Close database connection
     */
    public async close(): Promise<void> {
        if (this.pool) {
            await this.pool.end();
        }
    }
}

/**
 * Main test function
 */
async function main(): Promise<void> {
    Logger.start('🧪 Database Test Suite');
    
    const tester = new DatabaseTest();
    
    try {
        // Test 1: Connection
        Logger.info('\n📡 Test 1: Database Connection');
        const connectionOk = await tester.testConnection();
        if (!connectionOk) {
            Logger.error('❌ Connection test failed - stopping tests');
            return;
        }

        // Test 2: List existing tables
        Logger.info('\n📋 Test 2: List Existing Tables');
        await tester.listTables();

        // Test 3: Table creation
        Logger.info('\n🔨 Test 3: Table Creation');
        const tablesOk = await tester.testTableCreation();
        if (!tablesOk) {
            Logger.error('❌ Table creation test failed - stopping tests');
            return;
        }

        // Test 4: List tables after creation
        Logger.info('\n📋 Test 4: List Tables After Creation');
        await tester.listTables();

        // Test 5: URL operations
        Logger.info('\n🔗 Test 5: URL Operations');
        const urlsOk = await tester.testUrlOperations();
        if (!urlsOk) {
            Logger.error('❌ URL operations test failed');
            return;
        }

        Logger.success('\n🎉 All database tests passed!');
        Logger.info('✅ Your DATABASE_URL is working correctly');
        Logger.info('✅ Tables are created successfully');
        Logger.info('✅ URL operations are working');

    } catch (error) {
        Logger.error('❌ Test suite failed:', error as Error);
    } finally {
        await tester.close();
    }
}

// Run the test
main().catch(error => {
    Logger.error('❌ Fatal error:', error as Error);
    process.exit(1);
});
