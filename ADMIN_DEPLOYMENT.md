# Admin Panel Deployment Guide

This guide explains how to deploy the Yad2 Tracker Admin Panel to Vercel.

## Overview

The admin panel is a Next.js 14 application that provides a web interface for managing the Yad2 Tracker. It connects to the same Supabase database and offers full CRUD operations.

## Deployment Steps

### 1. Prepare the Repository

The admin panel is located in the `admin-web/` folder. No changes needed to the main repository structure.

### 2. Deploy to Vercel

#### Option A: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to admin-web folder
cd admin-web

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name: yad2-tracker-admin
# - Directory: ./
# - Override settings? N
```

#### Option B: Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. **Important**: Set the root directory to `admin-web`
5. Configure environment variables (see below)
6. Deploy

### 3. Environment Variables

In Vercel dashboard, add these environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Supabase PostgreSQL connection string | `postgresql://postgres:password@db.project.supabase.co:5432/postgres` |
| `ADMIN_PASSWORD` | Admin login password | `your-secure-password-123` |

### 4. Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click "Domains"
3. Add your custom domain
4. Configure DNS settings as instructed

## Configuration

### Database Setup

The admin panel uses the same database as the tracker:

- **URLs table**: Manages Yad2 API endpoints
- **Seen ads table**: Stores tracked advertisements

No additional setup required - the admin panel will work with your existing database.

### Authentication

- Simple password-based authentication
- Session cookies with 7-day expiration
- No user registration - single admin access

### Features

- **Dashboard**: System overview and statistics
- **URL Management**: Add/edit/delete Yad2 API URLs
- **Ads History**: View all tracked ads with search
- **Statistics**: Performance analytics
- **Settings**: Email config and manual controls

## Cost Analysis

### Vercel Free Tier

- **Bandwidth**: Unlimited for hobby projects
- **Compute**: 100GB-hours per month
- **Builds**: 100 builds per month
- **Functions**: 100GB-hours per month

### Estimated Usage

- **Monthly visits**: ~100 admin sessions
- **Database queries**: ~1,000 per month
- **Build time**: ~2 minutes per deployment

**Total Cost: $0/month**

## Monitoring

### Vercel Analytics

1. Go to your project in Vercel dashboard
2. Click "Analytics" tab
3. Monitor:
   - Page views
   - Performance metrics
   - Error rates

### Database Monitoring

1. Check Supabase dashboard
2. Monitor:
   - Connection count
   - Query performance
   - Storage usage

## Troubleshooting

### Common Issues

#### Build Failures

```bash
# Check build logs in Vercel dashboard
# Common fixes:
npm install
npm run build
```

#### Database Connection

```bash
# Test connection locally
cd admin-web
npm run dev
# Check browser console for errors
```

#### Authentication Issues

1. Verify `ADMIN_PASSWORD` is set correctly
2. Clear browser cookies
3. Check session expiration

### Debug Mode

Enable debug logging by adding to `.env.local`:

```env
NODE_ENV=development
DEBUG=true
```

## Security Considerations

### Production Checklist

- [ ] Strong admin password (12+ characters)
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Database connection secured
- [ ] Environment variables protected
- [ ] Regular password rotation

### Access Control

- Single admin account
- Session-based authentication
- No user registration
- IP restrictions (if needed)

## Maintenance

### Regular Tasks

1. **Monthly**: Review access logs
2. **Quarterly**: Rotate admin password
3. **As needed**: Update dependencies

### Updates

```bash
# Update admin panel
cd admin-web
npm update
git add .
git commit -m "Update admin panel dependencies"
git push

# Vercel will auto-deploy
```

## Support

### Getting Help

1. Check Vercel deployment logs
2. Review browser console errors
3. Test database connectivity
4. Verify environment variables

### Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)

## Next Steps

After successful deployment:

1. Test all admin panel features
2. Configure your first Yad2 API URL
3. Set up email notifications
4. Monitor tracker performance
5. Share admin access with team members (if needed)
