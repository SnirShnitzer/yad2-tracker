# Yad2 Tracker

A TypeScript Node.js web scraper that monitors Yad2 rental listings and sends email notifications for new ads, with a full-featured admin panel for management.

## Features

- **TypeScript** - Full type safety and better development experience
- Fetches listings from multiple Yad2 URLs
- Filters out brokerage, project, and office listings
- Tracks seen ads to detect new ones
- Sends email notifications with new listings
- Saves progress in JSON file or PostgreSQL database
- Scheduled execution every hour
- **Admin Panel** - Web interface for managing URLs, viewing ads, and configuring settings

## Admin Panel

The project includes a Next.js admin panel (`admin-web/` folder) that provides:

- **Dashboard**: System overview and statistics
- **URL Management**: Add, edit, activate/deactivate Yad2 API URLs
- **Ads History**: View all tracked ads with search and pagination
- **Statistics**: Performance analytics and charts
- **Settings**: Email configuration and manual tracker controls

### Quick Start for Admin Panel

1. Navigate to the admin panel:
   ```bash
   cd admin-web
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your database URL and admin password
   ```

3. Run locally:
   ```bash
   npm run dev
   ```

4. Deploy to Vercel (see `ADMIN_DEPLOYMENT.md` for detailed instructions)

**Cost**: Free on Vercel (unlimited bandwidth for hobby projects)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your Gmail credentials:
   ```
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-16-character-app-password
   EMAIL_RECIPIENTS=recipient1@gmail.com,recipient2@gmail.com
   SEND_EMAILS=true
   ```
   
   **Email Configuration:**
   - `GMAIL_USER`: Your Gmail address (sender)
   - `GMAIL_APP_PASSWORD`: Your Gmail app password
   - `EMAIL_RECIPIENTS`: Comma-separated list of recipients (optional, defaults to GMAIL_USER)
   - `SEND_EMAILS`: Set to `true`/`1` to enable emails, `false`/`0` to disable (default: `true`)
   
   **Database Configuration (Optional):**
   - `DATABASE_URL`: PostgreSQL connection string for shared storage (see DATABASE_SETUP.md)

3. To get a Gmail App Password:
   - Go to your Google Account settings
   - Security > 2-Step Verification > App passwords
   - Generate a new app password for "Mail"

## Usage

### Development (with TypeScript compilation)
```bash
# One-time run
npm run dev

# Scheduled run (every hour)
npm run dev:schedule
```

### Production (compiled JavaScript)
```bash
# One-time run
npm start

# Scheduled run (every hour)
npm run schedule
```

### Build only
```bash
npm run build
```

## Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Build and run once
- `npm run schedule` - Build and run continuously every hour
- `npm run dev` - Compile and run once (development)
- `npm run dev:schedule` - Compile and run continuously every hour (development)

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
├── src/                      # Tracker service (Node.js/TypeScript)
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
├── admin-web/                # Admin panel (Next.js/TypeScript)
│   ├── app/                  # Next.js App Router pages
│   ├── components/           # React components
│   ├── lib/                  # Database and auth utilities
│   ├── package.json          # Admin panel dependencies
│   └── README.md             # Admin panel documentation
├── .github/workflows/        # GitHub Actions for tracker
├── dist/                     # Compiled JavaScript (auto-generated)
├── tsconfig.json             # TypeScript configuration
├── seen_ads.json             # Tracks previously seen ads (auto-generated)
├── .env                      # Your email configuration (create this file)
├── ADMIN_DEPLOYMENT.md        # Admin panel deployment guide
└── package.json              # Tracker dependencies
```

## TypeScript Features

- **Strict type checking** for better code quality
- **Interface definitions** for all data structures
- **Type safety** for API responses and data parsing
- **IntelliSense support** in your IDE
