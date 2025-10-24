# Yad2 Tracker

A TypeScript Node.js web scraper that monitors Yad2 rental listings and sends email notifications for new ads.

## Features

- **TypeScript** - Full type safety and better development experience
- Fetches listings from multiple Yad2 URLs
- Filters out brokerage, project, and office listings
- Tracks seen ads to detect new ones
- Sends email notifications with new listings
- Saves progress in JSON file
- Scheduled execution every 15 minutes

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your Gmail credentials:
   ```
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-16-character-app-password
   ```

3. To get a Gmail App Password:
   - Go to your Google Account settings
   - Security > 2-Step Verification > App passwords
   - Generate a new app password for "Mail"

## Usage

### Development (with TypeScript compilation)
```bash
# One-time run
npm run dev

# Scheduled run (every 15 minutes)
npm run dev:schedule
```

### Production (compiled JavaScript)
```bash
# One-time run
npm start

# Scheduled run (every 15 minutes)
npm run schedule
```

### Build only
```bash
npm run build
```

## Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Build and run once
- `npm run schedule` - Build and run continuously every 15 minutes
- `npm run dev` - Compile and run once (development)
- `npm run dev:schedule` - Compile and run continuously (development)

## Configuration

Edit the settings in `src/config.ts` to customize the tracker:
- `YAD2_URLS` array contains the URLs to monitor
- `FILTER_WORDS` array contains words to filter out
- `CRON_SCHEDULE` for scheduling frequency
- `TIMEZONE` for scheduling timezone

## Architecture

The project follows a modular architecture with clear separation of concerns:

- **Services**: Core business logic (scraping, email, storage, tracking)
- **Utils**: Reusable utility functions and logging
- **Config**: Centralized configuration management
- **Types**: TypeScript interfaces and type definitions

## Project Structure

```
yad2-tracker/
├── src/
│   ├── index.ts              # Main entry point
│   ├── config.ts             # Configuration settings
│   ├── types.ts              # Type definitions
│   ├── services/
│   │   ├── tracker.service.ts    # Main orchestrator service
│   │   ├── scraper.service.ts    # Yad2 data scraping
│   │   ├── email.service.ts      # Email notifications
│   │   └── storage.service.ts    # Ad tracking storage
│   └── utils/
│       ├── logger.ts             # Logging utility
│       └── helpers.ts            # Helper functions
├── dist/                     # Compiled JavaScript (auto-generated)
├── tsconfig.json             # TypeScript configuration
├── seen_ads.json             # Tracks previously seen ads (auto-generated)
├── .env                      # Your email configuration (create this file)
└── package.json
```

## TypeScript Features

- **Strict type checking** for better code quality
- **Interface definitions** for all data structures
- **Type safety** for API responses and data parsing
- **IntelliSense support** in your IDE
