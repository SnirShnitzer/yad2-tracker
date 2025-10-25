#!/usr/bin/env node

// Test Supabase Session Pooler connection
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function testSessionPooler() {
    console.log('🔍 Testing Supabase Session Pooler connection...');
    
    if (!process.env.DATABASE_URL) {
        console.error('❌ DATABASE_URL not found in environment');
        process.exit(1);
    }

    // Parse the session pooler connection string
    const url = new URL(process.env.DATABASE_URL);
    console.log('📋 Connection details:');
    console.log(`  - Host: ${url.hostname}`);
    console.log(`  - Port: ${url.port}`);
    console.log(`  - Database: ${url.pathname.slice(1)}`);
    console.log(`  - User: ${url.username}`);
    console.log(`  - Password: ${url.password ? 'SET' : 'NOT SET'}`);

    const pool = new Pool({
        host: url.hostname,
        port: parseInt(url.port) || 5432,
        database: url.pathname.slice(1),
        user: url.username,
        password: url.password,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 30000,
        application_name: 'yad2-tracker-test'
    });

    try {
        console.log('\n📡 Attempting to connect...');
        const client = await pool.connect();
        
        console.log('✅ Connected successfully!');
        
        // Test a simple query
        const result = await client.query('SELECT NOW() as current_time, version() as postgres_version');
        console.log('📊 Database info:');
        console.log('  - Current time:', result.rows[0].current_time);
        console.log('  - PostgreSQL version:', result.rows[0].postgres_version);
        
        client.release();
        await pool.end();
        
        console.log('🎉 Session Pooler connection test completed successfully!');
        console.log('💡 This connection string should work in GitHub Actions!');
        
    } catch (error) {
        console.error('❌ Session Pooler connection failed:');
        console.error('  - Error:', error.message);
        console.error('  - Code:', error.code);
        console.error('  - Address:', error.address);
        console.error('  - Port:', error.port);
        
        if (error.code === 'ENETUNREACH') {
            console.error('\n💡 This looks like an IPv6 connectivity issue.');
            console.error('   The session pooler should handle this better than direct connections.');
        }
        
        process.exit(1);
    }
}

testSessionPooler();
