# 🚀 GitHub Actions Setup Guide

Deploy your Yad2 Tracker using GitHub Actions for completely free automated scheduling!

## 🎯 Why GitHub Actions?

- ✅ **Completely FREE** for public repositories
- ✅ **2,000 minutes/month** for private repos (more than enough)
- ✅ **Runs every 15 minutes** automatically
- ✅ **No server management** - GitHub handles everything
- ✅ **Easy setup** - Just add secrets and push code
- ✅ **Manual triggers** - Run on-demand for testing

---

## 📋 Prerequisites

1. **GitHub Repository** - Your code must be in a GitHub repo
2. **Gmail App Password** - Set up Gmail App Password (see main README)
3. **GitHub Account** - For accessing Actions

---

## 🔧 Step-by-Step Setup

### Step 1: Push Your Code to GitHub

```bash
# Add all files to git
git add .

# Commit the changes
git commit -m "Add GitHub Actions workflow"

# Push to GitHub
git push origin master
```

### Step 2: Set Up GitHub Secrets

1. **Go to your GitHub repository**
2. **Click "Settings" tab**
3. **Click "Secrets and variables" → "Actions"**
4. **Click "New repository secret"**

Add these two secrets:

#### Secret 1: GMAIL_USER
- **Name**: `GMAIL_USER`
- **Value**: `your-email@gmail.com`

#### Secret 2: GMAIL_APP_PASSWORD
- **Name**: `GMAIL_APP_PASSWORD`
- **Value**: `your-16-character-app-password`

### Step 3: Enable GitHub Actions

1. **Go to "Actions" tab** in your repository
2. **You should see "Yad2 Tracker" workflow**
3. **Click "Enable workflows"** if prompted

### Step 4: Test the Workflow

1. **Go to "Actions" tab**
2. **Click on "Yad2 Tracker" workflow**
3. **Click "Run workflow"** button
4. **Select "Run workflow"** to test

---

## ⏰ How It Works

### Automatic Scheduling:
- **Runs every 15 minutes** (24/7)
- **Checks Yad2 listings** automatically
- **Sends email notifications** when new ads found
- **Tracks seen ads** to avoid duplicates

### Manual Triggers:
- **Push to main branch** - Runs automatically
- **Manual workflow dispatch** - Run on-demand
- **Pull requests** - Runs tests only

---

## 🧪 Testing Your Setup

### Test 1: Manual Run
1. Go to **Actions** → **Yad2 Tracker**
2. Click **"Run workflow"**
3. Click **"Run workflow"** button
4. Watch the logs in real-time

### Test 2: Check Logs
1. Click on any workflow run
2. Click on **"track-listings"** job
3. Expand **"Run Yad2 Tracker"** step
4. Look for these success messages:
   ```
   🚀 Running Yad2 Tracker with email notifications
   ℹ️  Fetching Yad2 data...
   ✅ Email sent
   ```

### Test 3: Test Mode (No Emails)
1. Go to **Actions** → **Yad2 Tracker**
2. Click **"Run workflow"**
3. Check **"Run in test mode"** checkbox
4. Click **"Run workflow"**

---

## 📊 Monitoring Your Tracker

### GitHub Actions Dashboard:
1. **Go to "Actions" tab**
2. **See all workflow runs** with status
3. **Click any run** to see detailed logs
4. **Monitor success/failure rates**

### What to Look For:
- ✅ **Green checkmark** = Success
- ❌ **Red X** = Failed (check logs)
- 🟡 **Yellow circle** = Running

### Success Logs Look Like:
```
🚀 Running Yad2 Tracker with email notifications
ℹ️  Loaded 0 previously seen ads
ℹ️  Fetching Yad2 data...
ℹ️  Parsed 0 ads from HTML
ℹ️  Total unique ads found: 0
ℹ️  No new ads found
✅ Tracking completed!
```

---

## 🔧 Configuration Options

### Custom Schedule:
Edit `.github/workflows/yad2-tracker.yml`:

```yaml
schedule:
  - cron: '*/15 * * * *'  # Every 15 minutes
  - cron: '0 */2 * * *'   # Every 2 hours
  - cron: '0 9 * * *'     # Daily at 9 AM
```

### Timezone:
The workflow runs in UTC. To change timezone, add to the workflow:

```yaml
- name: Set timezone
  run: |
    sudo timedatectl set-timezone Asia/Jerusalem
```

---

## 🛠️ Troubleshooting

### Common Issues:

1. **"Secrets not found"**
   - Check secrets are set correctly in repository settings
   - Ensure secret names match exactly: `GMAIL_USER`, `GMAIL_APP_PASSWORD`

2. **"Email configuration missing"**
   - Verify Gmail App Password is correct
   - Check secret values don't have extra spaces

3. **"Workflow not running"**
   - Check if Actions are enabled for the repository
   - Verify the workflow file is in `.github/workflows/`

4. **"Build failed"**
   - Check TypeScript compilation errors
   - Ensure all dependencies are in `package.json`

### Debug Steps:
1. **Check Actions tab** - See if workflows are running
2. **Check Secrets** - Verify they're set correctly
3. **Check Logs** - Look for error messages
4. **Test locally** - Run `npm run dev:schedule` first

---

## 💡 Pro Tips

1. **Start with test mode** - Use manual trigger with test mode first
2. **Monitor logs** - Check the first few runs for any issues
3. **Keep secrets secure** - Never commit `.env` files
4. **Use public repo** - Completely free with no limits
5. **Check email settings** - Ensure Gmail App Password works

---

## 🎉 Success!

Once set up, your Yad2 Tracker will:
- ✅ **Run every 15 minutes** automatically
- ✅ **Send email notifications** for new listings
- ✅ **Track seen ads** to avoid duplicates
- ✅ **Run 24/7** without any server management
- ✅ **Cost nothing** (completely free!)

Your apartment hunting is now fully automated! 🏠✨

---

## 📈 Usage Limits

### Public Repositories:
- ✅ **Unlimited minutes** - Completely free
- ✅ **Unlimited runs** - No restrictions

### Private Repositories:
- ✅ **2,000 minutes/month** - More than enough for 15-min intervals
- ✅ **Unlimited public repos** - Always free

### Cost Calculation:
- **15-minute intervals** = 96 runs/day = ~2,880 runs/month
- **Each run** = ~1-2 minutes
- **Total usage** = ~3,000 minutes/month
- **Private repo limit** = 2,000 minutes (might need to reduce frequency)
- **Public repo** = Unlimited! 🎉
