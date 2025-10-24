# 🚀 Deployment Guide

Deploy your Yad2 Tracker to run automatically every 15 minutes using free cloud platforms or GitHub Actions.

## 📋 Prerequisites

1. **GitHub Repository** - Your code must be in a GitHub repository
2. **Gmail App Password** - Set up Gmail App Password (see main README)
3. **GitHub Account** - For connecting to deployment platforms

---

## 🎯 Option 1: GitHub Actions (Recommended)

GitHub Actions is the easiest and most reliable option for scheduled tasks.

### Why GitHub Actions?
- ✅ **Completely FREE** for public repositories
- ✅ **2,000 minutes/month** for private repos
- ✅ **No server management** - GitHub handles everything
- ✅ **Easy setup** - Just add secrets and push code
- ✅ **Manual triggers** - Run on-demand for testing

### Quick Setup:
1. **Push code to GitHub** (already done)
2. **Go to repository Settings → Secrets and variables → Actions**
3. **Add secrets:**
   ```
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-app-password
   ```
4. **Go to Actions tab → Enable workflows**
5. **Done!** 🎉

### Detailed Setup:
See [GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md) for complete instructions.

---

## 🎯 Option 2: Railway

Railway offers excellent free tier with automatic deployments.

### Step 1: Connect to Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your `yad2-tracker` repository

### Step 2: Configure Environment Variables
In Railway dashboard:
1. Go to your project → Variables tab
2. Add these environment variables:
   ```
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-16-character-app-password
   NODE_ENV=production
   ```

### Step 3: Deploy
1. Railway will automatically detect the `railway.json` file
2. It will build using Docker and start the scheduled tracker
3. Your tracker will run every 15 minutes automatically!

### Railway Benefits:
- ✅ **Free tier**: 500 hours/month
- ✅ **Automatic deployments** from GitHub
- ✅ **Environment variables** management
- ✅ **Logs** and monitoring
- ✅ **No credit card required**

---

## 🎯 Option 2: Render

Render provides reliable hosting with good free tier.

### Step 1: Connect to Render
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repository

### Step 2: Configure Service
1. **Name**: `yad2-tracker`
2. **Environment**: `Node`
3. **Build Command**: `npm ci && npm run build`
4. **Start Command**: `npm run schedule`
5. **Plan**: Select "Free"

### Step 3: Set Environment Variables
In Render dashboard:
1. Go to Environment tab
2. Add these variables:
   ```
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-16-character-app-password
   NODE_ENV=production
   ```

### Step 4: Deploy
1. Click "Create Web Service"
2. Render will build and deploy automatically
3. Your tracker will run every 15 minutes!

### Render Benefits:
- ✅ **Free tier**: 750 hours/month
- ✅ **Automatic deployments** from GitHub
- ✅ **Custom domains** (free)
- ✅ **SSL certificates** (automatic)
- ✅ **Logs** and monitoring

---

## 🐳 Option 3: Docker Deployment

For advanced users who want to deploy anywhere.

### Local Docker Testing
```bash
# Build the Docker image
npm run docker:build

# Run with environment variables
npm run docker:run
```

### Docker Commands
```bash
# Build image
docker build -t yad2-tracker .

# Run with environment file
docker run --env-file .env yad2-tracker

# Run with inline environment variables
docker run -e GMAIL_USER=your-email@gmail.com -e GMAIL_APP_PASSWORD=your-password yad2-tracker
```

---

## 🔧 Configuration

### Environment Variables Required:
```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
NODE_ENV=production
```

### Optional Configuration:
```env
# Custom timezone (default: Asia/Jerusalem)
TZ=Asia/Jerusalem

# Custom cron schedule (default: every 15 minutes)
CRON_SCHEDULE=*/15 * * * *
```

---

## 📊 Monitoring

### GitHub Actions:
- Go to your repository → Actions tab
- Click on any workflow run to see logs
- Monitor success/failure rates
- View real-time execution logs

### Railway:
- Go to your project dashboard
- Click "Deployments" to see logs
- Monitor resource usage in "Metrics"

### Render:
- Go to your service dashboard
- Click "Logs" to see real-time output
- Monitor in "Metrics" tab

### Logs to Watch For:
```
🚀 Starting Yad2 Tracker in scheduled mode (every 15 minutes)
ℹ️  Fetching Yad2 data...
✅ Email sent
```

---

## 🛠️ Troubleshooting

### Common Issues:

1. **"Email configuration missing"**
   - Check environment variables are set correctly
   - Verify Gmail App Password is correct

2. **"No ads found"**
   - This is normal if no new listings match your criteria
   - Check the URLs manually in browser

3. **Deployment fails**
   - Check build logs for TypeScript errors
   - Ensure all dependencies are in package.json

4. **Service stops**
   - Check resource limits on free tier
   - Monitor logs for errors

### Debug Commands:
```bash
# Test locally
npm run dev:schedule

# Check environment variables
echo $GMAIL_USER
echo $GMAIL_APP_PASSWORD
```

---

## 💡 Tips

1. **Start with Railway** - Easiest setup and most reliable
2. **Monitor logs** - Check deployment logs regularly
3. **Test locally first** - Always test with `npm run dev:schedule`
4. **Backup your .env** - Keep environment variables secure
5. **Free tier limits** - Both platforms have usage limits, monitor usage

---

## 🎉 Success!

Once deployed, your Yad2 Tracker will:
- ✅ Run automatically every 15 minutes
- ✅ Send email notifications for new listings
- ✅ Track seen ads to avoid duplicates
- ✅ Filter out unwanted listings
- ✅ Run 24/7 in the cloud

Your apartment hunting is now automated! 🏠
