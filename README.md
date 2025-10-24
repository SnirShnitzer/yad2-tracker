# Yad2 Tracker Project

A complete Yad2 rental listing monitoring system with both automated tracking and web-based administration.

## 🏗️ Project Structure

This repository contains two main components:

```
yad2-tracker/
├── tracker-service/          # Node.js/TypeScript tracker service
│   ├── src/                  # Tracker source code
│   ├── dist/                 # Compiled JavaScript
│   ├── package.json          # Tracker dependencies
│   ├── tsconfig.json         # TypeScript configuration
│   └── README.md             # Tracker documentation
├── admin-web/                # Next.js admin panel
│   ├── app/                  # Next.js App Router pages
│   ├── components/           # React components
│   ├── lib/                  # Database and auth utilities
│   ├── package.json          # Admin panel dependencies
│   └── README.md             # Admin panel documentation
├── .github/workflows/        # GitHub Actions for tracker
└── README.md                 # This file
```

## 🚀 Quick Start

### 1. Tracker Service (Automated Monitoring)

The tracker service runs automatically via GitHub Actions every hour, monitoring Yad2 listings and sending email notifications.

**Setup:**
```bash
cd tracker-service
npm install
# Configure .env file with your credentials
npm run dev
```

**Features:**
- Automated Yad2 API monitoring
- Email notifications for new listings
- Database storage with Supabase
- GitHub Actions scheduling

### 2. Admin Panel (Web Interface)

The admin panel provides a web interface for managing the tracker system.

**Setup:**
```bash
cd admin-web
npm install
# Configure .env.local file
npm run dev
```

**Features:**
- Dashboard with statistics
- URL management
- Ads history and search
- Settings and controls

## 📋 Components Overview

### 🔄 Tracker Service
- **Purpose**: Automated monitoring of Yad2 listings
- **Technology**: Node.js, TypeScript, PostgreSQL
- **Deployment**: GitHub Actions (free)
- **Schedule**: Runs every hour automatically

### 🌐 Admin Panel
- **Purpose**: Web interface for system management
- **Technology**: Next.js 14, React, Tailwind CSS
- **Deployment**: Vercel (free)
- **Access**: Web-based admin interface

## 🛠️ Development

### Tracker Service Development
```bash
cd tracker-service
npm run dev          # One-time run
npm run dev:schedule # Continuous monitoring
```

### Admin Panel Development
```bash
cd admin-web
npm run dev         # Start development server
```

## 🚀 Deployment

### Tracker Service
- **Automatic**: GitHub Actions runs every hour
- **Manual**: Trigger via GitHub Actions UI
- **Cost**: Free

### Admin Panel
- **Platform**: Vercel
- **Setup**: Connect GitHub repository
- **Cost**: Free (hobby plan)

## 📚 Documentation

- **Tracker Service**: See `tracker-service/README.md`
- **Admin Panel**: See `admin-web/README.md`
- **Database Setup**: See `tracker-service/DATABASE_SETUP.md`
- **Admin Deployment**: See `ADMIN_DEPLOYMENT.md`

## 🔧 Configuration

### Environment Variables

**Tracker Service** (`.env` in `tracker-service/`):
```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
DATABASE_URL=postgresql://...
SEND_EMAILS=true
```

**Admin Panel** (`.env.local` in `admin-web/`):
```env
DATABASE_URL=postgresql://...
ADMIN_PASSWORD=your-admin-password
```

## 🎯 Use Cases

1. **Real Estate Monitoring**: Track rental listings in specific areas
2. **Price Alerts**: Get notified of new listings matching criteria
3. **Market Analysis**: Historical data and statistics
4. **Automated Workflows**: Set-and-forget monitoring

## 💰 Cost

- **GitHub Actions**: Free (2,000 minutes/month)
- **Vercel**: Free (hobby plan)
- **Supabase**: Free (500MB database)
- **Total**: $0/month

## 🔒 Security

- Password-protected admin panel
- Environment variable secrets
- Database connection security
- HTTPS for all web interfaces

## 📞 Support

For issues or questions:
1. Check component-specific README files
2. Review deployment documentation
3. Check GitHub Actions logs
4. Verify environment variables

---

**Ready to get started?** Choose your component:
- [Tracker Service Setup](tracker-service/README.md)
- [Admin Panel Setup](admin-web/README.md)