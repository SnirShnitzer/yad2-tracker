# Admin Panel Setup Guide

## 🚀 Quick Start

### 1. Environment Variables
Create `admin-web/.env.local` with:

```bash
# Database connection (same as tracker-service)
DATABASE_URL=postgresql://username:password@host:port/database

# Admin panel password
ADMIN_PASSWORD=your_secure_password
```

### 2. Install Dependencies
```bash
cd admin-web
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Access Admin Panel
- **URL**: `http://localhost:3000`
- **Login**: Use the password from `ADMIN_PASSWORD`

## 🔐 Authentication Flow

### Root URL (`/`)
- **Not authenticated**: Redirects to `/login`
- **Authenticated**: Redirects to `/dashboard`

### Login Page (`/login`)
- Enter admin password
- Creates session cookie
- Redirects to dashboard on success

### Dashboard Pages (`/dashboard/*`)
- Protected by middleware
- Requires valid session cookie
- Redirects to login if not authenticated

## 🛡️ Security Features

- **Session-based authentication**
- **Automatic session expiration** (7 days)
- **Server-side session verification**
- **Protected routes** with middleware
- **Client-side authentication checks**

## 📱 Available Pages

- **Dashboard**: Overview and controls
- **URLs**: Manage Yad2 URLs
- **Ads**: View tracked ads history
- **Statistics**: Analytics and charts
- **Settings**: Configuration options

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Environment Variables for Production
Set the same environment variables in your deployment platform:
- `DATABASE_URL`
- `ADMIN_PASSWORD`
