# URL Management Guide

This guide explains how to manage Yad2 URLs using the database instead of hardcoded configuration.

## 🎯 **Overview**

Instead of hardcoding URLs in `src/config.ts`, you can now store and manage URLs in the database with separate columns for better organization.

## 🗄️ **Database Schema**

### **URLs Table:**
```sql
CREATE TABLE urls (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL UNIQUE,
    name TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Columns:**
- **`id`** - Auto-incrementing primary key
- **`url`** - The Yad2 API URL (unique)
- **`name`** - Human-readable name for the URL
- **`is_active`** - Whether the URL should be used (true/false)
- **`created_at`** - When the URL was added
- **`updated_at`** - When the URL was last modified

## 🚀 **Setup**

### **1. Database Setup:**
Follow the `DATABASE_SETUP.md` guide to set up your database.

### **2. Environment Variables:**
Make sure you have `DATABASE_URL` in your `.env` file:
```env
DATABASE_URL=postgresql://user:pass@host:port/db
```

## 🔧 **URL Management Commands**

### **Add a New URL:**
```bash
npm run manage-urls add "https://gw.yad2.co.il/realestate-feed/rent/map?city=5000&neighborhood=1520" "Tel Aviv Rentals"
```

### **List All URLs:**
```bash
npm run manage-urls list
```

### **Activate a URL:**
```bash
npm run manage-urls activate "https://gw.yad2.co.il/realestate-feed/rent/map?city=5000"
```

### **Deactivate a URL:**
```bash
npm run manage-urls deactivate "https://gw.yad2.co.il/realestate-feed/rent/map?city=5000"
```

## 📝 **Examples**

### **Add Multiple URLs:**
```bash
# Tel Aviv rentals
npm run manage-urls add "https://gw.yad2.co.il/realestate-feed/rent/map?city=5000&neighborhood=1520" "Tel Aviv Center"

# Jerusalem rentals  
npm run manage-urls add "https://gw.yad2.co.il/realestate-feed/rent/map?city=3000" "Jerusalem Rentals"

# Haifa rentals
npm run manage-urls add "https://gw.yad2.co.il/realestate-feed/rent/map?city=4000" "Haifa Rentals"
```

### **Manage URL Status:**
```bash
# List all URLs
npm run manage-urls list

# Temporarily disable a URL
npm run manage-urls deactivate "https://gw.yad2.co.il/realestate-feed/rent/map?city=4000"

# Re-enable a URL
npm run manage-urls activate "https://gw.yad2.co.il/realestate-feed/rent/map?city=4000"
```

## 🎯 **How It Works**

### **Priority Order:**
1. **Database URLs** - If `DATABASE_URL` is set and URLs exist in database
2. **Config URLs** - Falls back to `YAD2_API_URLS` in `src/config.ts`
3. **Error handling** - Graceful fallback if database fails

### **Automatic Detection:**
The tracker automatically:
- **✅ Checks database first** - For active URLs
- **✅ Falls back to config** - If no database URLs found
- **✅ Logs the source** - Shows whether using database or config URLs

## 🔄 **Migration from Config**

### **Current Setup (Config-based):**
```typescript
// src/config.ts
export const YAD2_API_URLS: string[] = [
    'https://gw.yad2.co.il/realestate-feed/rent/map?city=5000&neighborhood=1520&area=1&topArea=2&minPrice=6000&maxPrice=14000&minRooms=3&maxRooms=4&zoom=15'
];
```

### **New Setup (Database-based):**
```bash
# Add your existing URLs to database
npm run manage-urls add "https://gw.yad2.co.il/realestate-feed/rent/map?city=5000&neighborhood=1520&area=1&topArea=2&minPrice=6000&maxPrice=14000&minRooms=3&maxRooms=4&zoom=15" "Tel Aviv Center"
```

## 🎉 **Benefits**

### **✅ Dynamic Management:**
- **Add URLs without code changes** - No need to modify config files
- **Enable/disable URLs** - Temporarily disable problematic URLs
- **Multiple environments** - Different URLs for dev/prod

### **✅ Better Organization:**
- **Named URLs** - Human-readable names for each URL
- **Status tracking** - Know which URLs are active/inactive
- **Audit trail** - Track when URLs were added/modified

### **✅ Scalability:**
- **Multiple users** - Share URL configurations
- **Easy updates** - Change URLs without redeploying
- **Backup/restore** - Database backups include URL configurations

## 🚨 **Troubleshooting**

### **"No database connection"**
- Check your `DATABASE_URL` environment variable
- Ensure your database is accessible
- Verify your database credentials

### **"No URLs found"**
- Add URLs using `npm run manage-urls add`
- Check if URLs are active using `npm run manage-urls list`
- Verify database connection

### **"Error getting URLs from database"**
- Check database connectivity
- Verify table exists (run tracker once to create tables)
- Check database permissions

## 📊 **Monitoring**

### **Check URL Status:**
```bash
npm run manage-urls list
```

### **Database Queries:**
```sql
-- See all URLs
SELECT * FROM urls ORDER BY created_at;

-- See only active URLs
SELECT * FROM urls WHERE is_active = true;

-- See URL usage statistics
SELECT 
    url,
    name,
    is_active,
    created_at,
    updated_at
FROM urls 
ORDER BY created_at DESC;
```

## 🎯 **Best Practices**

### **1. Naming Convention:**
- Use descriptive names: "Tel Aviv Center", "Jerusalem Rentals"
- Include location and type: "Haifa 3-4 Rooms"
- Add date for temporary URLs: "Special Search 2024"

### **2. URL Management:**
- **Test URLs first** - Verify they work before adding
- **Use descriptive names** - Easy to identify in the list
- **Deactivate instead of delete** - Keep history for debugging

### **3. Environment Setup:**
- **Development** - Use test URLs with different parameters
- **Production** - Use real URLs with proper filters
- **Staging** - Use subset of production URLs

## 🚀 **Ready to Use!**

Your Yad2 Tracker now supports:
- **✅ Database URL storage** - Separate columns for better organization
- **✅ Dynamic URL management** - Add/remove URLs without code changes
- **✅ Status control** - Enable/disable URLs as needed
- **✅ Fallback support** - Graceful fallback to config if database fails
- **✅ Easy management** - Simple CLI commands for URL operations

Start managing your URLs with the database! 🏠✨
