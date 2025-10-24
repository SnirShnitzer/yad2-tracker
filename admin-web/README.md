# Yad2 Tracker Admin Panel

A Next.js 14 admin panel for managing the Yad2 Tracker service. This web interface provides full control over URLs, ads history, statistics, and settings.

## Features

- **Dashboard**: Overview of system statistics and recent activity
- **URL Management**: Add, edit, activate/deactivate Yad2 API URLs
- **Ads History**: View all tracked ads with search and pagination
- **Statistics**: Analytics and performance insights
- **Settings**: Email configuration and tracker controls
- **Authentication**: Simple password-based admin access

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Simple password protection
- **Deployment**: Vercel

## Setup

### 1. Install Dependencies

```bash
cd admin-web
npm install
```

### 2. Environment Variables

Create `.env.local` file:

```env
DATABASE_URL=postgresql://postgres:password@db.project.supabase.co:5432/postgres
ADMIN_PASSWORD=your-secure-password
```

### 3. Development

```bash
npm run dev
```

Visit `http://localhost:3000` and login with your admin password.

## Deployment to Vercel

### 1. Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select the `admin-web` folder as the root directory

### 2. Environment Variables

In Vercel dashboard, add these environment variables:

- `DATABASE_URL`: Your Supabase PostgreSQL connection string
- `ADMIN_PASSWORD`: Your secure admin password

### 3. Deploy

Vercel will automatically deploy on every push to your repository.

## Usage

### Login

Access the admin panel and login with your admin password.

### Managing URLs

1. Go to **URLs** page
2. Click **Add New URL** to add Yad2 API endpoints
3. Use **Edit** to modify URL names or parameters
4. **Activate/Deactivate** URLs to control which ones are monitored

### Viewing Ads

1. Go to **Ads** page to see all tracked ads
2. Use the search bar to find specific ads
3. Click **View** to open ads on Yad2

### Statistics

1. Go to **Statistics** page for analytics
2. View ads over time and system health
3. Monitor performance metrics

### Settings

1. Go to **Settings** page
2. Configure email notifications
3. Change admin password
4. Trigger manual tracker runs

## API Endpoints

- `GET /api/urls` - List all URLs
- `POST /api/urls` - Add new URL
- `PUT /api/urls/[id]` - Update URL
- `DELETE /api/urls/[id]` - Delete URL
- `GET /api/ads` - List ads with pagination
- `GET /api/ads/stats` - Get statistics
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout

## Security

- Password-based authentication with HTTP-only cookies
- Session expiration after 7 days
- Environment variable validation
- SQL injection protection via parameterized queries

## Cost

- **Vercel Free Tier**: Unlimited bandwidth, 100GB-hours compute/month
- **Total Cost**: $0/month

## Troubleshooting

### Database Connection Issues

1. Verify `DATABASE_URL` is correct
2. Check Supabase connection settings
3. Ensure database tables exist

### Authentication Issues

1. Verify `ADMIN_PASSWORD` is set
2. Clear browser cookies
3. Check session expiration

### Build Issues

1. Ensure all dependencies are installed
2. Check TypeScript compilation
3. Verify environment variables

## Support

For issues or questions:

1. Check the main tracker repository
2. Review Vercel deployment logs
3. Verify database connectivity
