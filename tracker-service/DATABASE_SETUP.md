# Database Setup Guide

This guide shows you how to set up a shared database for storing seen ads instead of using local JSON files.

## 🗄️ **Database Options**

### **1. Supabase (Recommended - Free PostgreSQL)**
- **Free tier**: 500MB database, 2GB bandwidth
- **Setup**: 5 minutes
- **Best for**: Production, multiple users

### **2. Railway (PostgreSQL)**
- **Free tier**: $5 credit monthly
- **Setup**: 3 minutes
- **Best for**: Production

### **3. Neon (PostgreSQL)**
- **Free tier**: 3GB storage, 10GB transfer
- **Setup**: 5 minutes
- **Best for**: Development and production

## 🚀 **Quick Setup with Supabase (Recommended)**

### **Step 1: Create Supabase Project**
1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub
3. Click "New Project"
4. Choose organization and enter project name
5. Set database password (save it!)
6. Choose region (closest to you)
7. Click "Create new project"

### **Step 2: Get Database URL**
1. Go to Settings → Database
2. Copy the "Connection string" under "Connection parameters"
3. It looks like: `postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres`

### **Step 3: Update Environment Variables**
Add to your `.env` file:
```env
DATABASE_URL=postgresql://postgres:[your-password]@db.[project].supabase.co:5432/postgres
```

### **Step 4: Install Dependencies**
```bash
npm install pg @types/pg
```

## 🔧 **Alternative: Railway Setup**

### **Step 1: Create Railway Project**
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"
4. Choose "Provision PostgreSQL"
5. Wait for database to be created

### **Step 2: Get Database URL**
1. Click on your PostgreSQL service
2. Go to "Variables" tab
3. Copy the `DATABASE_URL` value

### **Step 3: Update Environment Variables**
Add to your `.env` file:
```env
DATABASE_URL=[your-railway-database-url]
```

## 📊 **Database Schema**

The database will automatically create this table:

```sql
CREATE TABLE seen_ads (
    id VARCHAR(255) PRIMARY KEY,
    title TEXT NOT NULL,
    link TEXT NOT NULL,
    price TEXT NOT NULL,
    address TEXT NOT NULL,
    description TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎯 **Benefits of Database Storage**

### **✅ Advantages:**
- **Shared storage** - Multiple instances can share data
- **Reliability** - No file corruption issues
- **Scalability** - Handles large amounts of data
- **Backup** - Automatic backups with cloud providers
- **Analytics** - Easy to query and analyze data
- **Concurrent access** - Multiple trackers can run simultaneously

### **📈 Use Cases:**
- **Multiple users** - Family members tracking the same listings
- **Multiple locations** - Different servers running the same tracker
- **Backup and restore** - Easy to migrate between servers
- **Analytics** - Track trends over time
- **Maintenance** - Clean up old data automatically

## 🔄 **Migration from File Storage**

If you already have a `seen_ads.json` file:

1. **Export your data:**
   ```bash
   # Your existing seen_ads.json will be automatically imported
   ```

2. **Run the tracker:**
   ```bash
   npm run dev
   ```

3. **The tracker will:**
   - Create database tables automatically
   - Import existing seen ads from JSON file
   - Start using database for new ads

## 🛠️ **Manual Database Setup (Optional)**

If you want to set up the database manually:

```sql
-- Connect to your database and run:
CREATE TABLE seen_ads (
    id VARCHAR(255) PRIMARY KEY,
    title TEXT NOT NULL,
    link TEXT NOT NULL,
    price TEXT NOT NULL,
    address TEXT NOT NULL,
    description TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_seen_ads_id ON seen_ads(id);
```

## 🔍 **Monitoring Your Database**

### **Supabase Dashboard:**
- Go to your project dashboard
- Click "Table Editor" to see your data
- Use "SQL Editor" to run queries

### **Useful Queries:**
```sql
-- Count total ads
SELECT COUNT(*) FROM seen_ads;

-- Latest ads
SELECT * FROM seen_ads ORDER BY created_at DESC LIMIT 10;

-- Clean up old ads (older than 30 days)
DELETE FROM seen_ads WHERE created_at < NOW() - INTERVAL '30 days';
```

## 🚨 **Troubleshooting**

### **Connection Issues:**
```bash
# Test your database connection
node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT NOW()').then(console.log).catch(console.error);
"
```

### **Common Issues:**
1. **SSL Error**: Add `?sslmode=require` to your DATABASE_URL
2. **Connection Timeout**: Check your network/firewall
3. **Authentication**: Verify your database password

## 💰 **Cost Comparison**

| Provider | Free Tier | Paid Plans |
|----------|-----------|-----------|
| **Supabase** | 500MB, 2GB bandwidth | $25/month |
| **Railway** | $5 credit/month | $5-20/month |
| **Neon** | 3GB storage | $19/month |

## 🎉 **Ready to Go!**

Once you've set up your database:

1. **Add DATABASE_URL to your `.env`**
2. **Run the tracker** - It will automatically use the database
3. **Check your database** - See the data in your provider's dashboard
4. **Deploy to GitHub Actions** - Use the same DATABASE_URL in secrets

Your Yad2 Tracker is now using a shared database! 🏠✨
