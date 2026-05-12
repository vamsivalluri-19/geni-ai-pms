# Complete Step-by-Step Vercel Deployment Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Step 1: Prepare Your GitHub Repository](#step-1-prepare-your-github-repository)
3. [Step 2: Create Vercel Account](#step-2-create-vercel-account)
4. [Step 3: Set Up MongoDB Atlas](#step-3-set-up-mongodb-atlas)
5. [Step 4: Get API Keys](#step-4-get-api-keys)
6. [Step 5: Deploy on Vercel](#step-5-deploy-on-vercel)
7. [Step 6: Configure Environment Variables](#step-6-configure-environment-variables)
8. [Step 7: Test Your Deployment](#step-7-test-your-deployment)
9. [Step 8: Troubleshooting](#step-8-troubleshooting)

---

## Prerequisites

Before starting, ensure you have:
- ✅ GitHub account with repository pushed
- ✅ MongoDB Atlas account (or create one)
- ✅ Google Cloud Console account (for OAuth)
- ✅ Gmail account (for email notifications)
- ✅ Google Generative AI API key

---

## Step 1: Prepare Your GitHub Repository

### 1.1 Verify All Files Are Committed

```bash
cd c:\Projects\Gen-AI-Placement-Management-System

# Check git status
git status

# Should show: "nothing to commit, working tree clean"
```

**Expected Output:**
```
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

### 1.2 Verify Key Files Exist

Ensure these files are in your repository root:
- ✅ `vercel.json` - Multi-service configuration
- ✅ `.vercelignore` - Build optimization
- ✅ `frontend/` folder with Vite project
- ✅ `backend/` folder with Express server
- ✅ `frontend/package.json` with build script
- ✅ `backend/package.json` with start script

**Check these files:**
```bash
# Verify vercel.json exists
ls -la vercel.json

# Verify frontend exists
ls -la frontend/

# Verify backend exists
ls -la backend/
```

### 1.3 Recent Push to GitHub

```bash
# Check remote URL
git remote -v

# Should show: https://github.com/vamsivalluri-19/geni-ai-pms.git

# Verify latest commit is pushed
git log --oneline -5

# Should show your latest commits
```

---

## Step 2: Create Vercel Account

### 2.1 Go to Vercel Website

1. Open browser and go to: **https://vercel.com**
2. Click **"Sign Up"** button (top right)

### 2.2 Sign Up Options

**Choose one method:**

#### **Option A: Sign Up with GitHub** (Recommended)
1. Click **"Continue with GitHub"**
2. Click **"Authorize vercel"** (if prompted)
3. GitHub will redirect you to Vercel
4. Vercel auto-fills your account details

#### **Option B: Sign Up with Email**
1. Click **"Continue with Email"**
2. Enter your email address
3. Verify email (check inbox for verification link)
4. Click link to confirm

### 2.3 Complete Profile Setup

1. **Team Name**: Leave as default or create team name
2. **Import Project**: Skip for now (we'll do it in Step 5)
3. Click **"Continue"**

**You should now be on Vercel Dashboard** ✅

---

## Step 3: Set Up MongoDB Atlas

### 3.1 Create MongoDB Atlas Account

1. Open: **https://www.mongodb.com/cloud/atlas**
2. Click **"Try Free"** or **"Get Started Free"**
3. Choose sign-up method:
   - **Email/Password**, **Google**, or **GitHub**
4. Complete sign-up form

### 3.2 Create a Cluster

1. After sign-up, click **"Build a Database"**
2. Choose **"Shared"** (Free tier) or **"Dedicated"** (Paid)
3. **For free:** Select "Shared" → Click **"Create Cluster"**
4. Choose:
   - **Cloud Provider**: AWS
   - **Region**: Choose closest to users (e.g., us-east-1)
   - **Cluster Tier**: M0 (Free)
5. Click **"Create Cluster"**
6. **Wait 2-3 minutes** for cluster to be created

### 3.3 Set Up Database User

1. In left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Fill in:
   - **Username**: `placement_user` (any name)
   - **Password**: Generate secure password (click auto-generate)
   - **Copy the password somewhere safe** (you'll need it soon)
4. Click **"Add User"**

### 3.4 Configure Network Access

1. In left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
   - Adds IP range: `0.0.0.0/0`
   - ⚠️ *For production, restrict to specific IPs*
4. Click **"Confirm"**

### 3.5 Get Connection String

1. Go back to **"Database"** in left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. **Copy the connection string**
   - Looks like: `mongodb+srv://username:password@cluster.mongodb.net/mydb?retryWrites=true&w=majority`
5. **Replace placeholders:**
   - `<username>` → Your database username
   - `<password>` → Your database password
   - **Example:** `mongodb+srv://placement_user:abc123@cluster0.abc123.mongodb.net/placement_db?retryWrites=true&w=majority`

**Save this connection string for Step 6** ✅

---

## Step 4: Get API Keys

### 4.1 Google OAuth Credentials

#### 4.1a Go to Google Cloud Console

1. Open: **https://console.cloud.google.com**
2. Sign in with your Google account
3. Create new project:
   - Click **"Select a Project"** (top)
   - Click **"New Project"**
   - Enter project name: `Gen AI Placement`
   - Click **"Create"**

#### 4.1b Enable Google+ API

1. In search bar at top, search: **"Google+ API"**
2. Click **"Google+ API"** from results
3. Click **"Enable"** button

#### 4.1c Create OAuth 2.0 Credentials

1. In left sidebar, click **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth 2.0 Client IDs"**
3. If prompted, click **"Configure consent screen"** first:
   - Choose **"External"**
   - Click **"Create"**
   - Fill in required fields:
     - **App name**: Gen AI Placement System
     - **User support email**: Your email
     - **Developer contact**: Your email
   - Click **"Save and Continue"** through all steps
   - Skip optional scopes
   - Click **"Back to Dashboard"** when done

4. Now create credentials again:
   - Click **"Create Credentials"** → **"OAuth 2.0 Client IDs"**
   - **Application type**: Web application
   - **Name**: `Vercel Deployment`
   - **Authorized JavaScript origins**: 
     - Add: `https://geni-ai-pms.vercel.app`
     - Add: `http://localhost:5173` (local development)
   - **Authorized redirect URIs**:
     - Add: `https://geni-ai-pms.vercel.app/_/backend/api/oauth/google/callback`
     - Add: `http://localhost:5000/api/oauth/google/callback` (local)
   - Click **"Create"**

5. **Copy and save:**
   - **Client ID** (looks like: `xxx.apps.googleusercontent.com`)
   - **Client Secret** (looks like: `GOCSPX-xxx`)

**Save these for Step 6** ✅

### 4.2 Gemini API Key

1. Open: **https://ai.google.dev/tutorials/setup**
2. Click **"Get API Key"**
3. Sign in with Google if needed
4. Click **"Create API Key"**
5. **Copy the API key** (looks like: `AIzaSyD...`)

**Save this for Step 6** ✅

### 4.3 Gmail App Password

#### 4.3a Enable 2-Factor Authentication

1. Go to: **https://myaccount.google.com**
2. Left sidebar → **"Security"**
3. Scroll down → **"2-Step Verification"**
4. Click and follow setup

#### 4.3b Generate App Password

1. After 2FA is enabled, go to: **https://myaccount.google.com/apppasswords**
2. **Select app**: Mail
3. **Select device**: Windows PC (or your device)
4. Click **"Generate"**
5. **Copy the 16-character password** (looks like: `xxxx xxxx xxxx xxxx`)

**Save this for Step 6** ✅

---

## Step 5: Deploy on Vercel

### 5.1 Go to Vercel Dashboard

1. Open: **https://vercel.com/dashboard**
2. You should be logged in (if not, login)

### 5.2 Create New Project

1. Click **"Add New"** button (top)
2. Choose **"Project"**

### 5.3 Import GitHub Repository

1. Click **"Import a Git Repository"** or **"Import a GitHub Repository"**
2. If needed, authorize Vercel to access GitHub:
   - Click **"Connect with GitHub"**
   - Click **"Authorize vercel"**
3. Paste your repo URL:
   - `https://github.com/vamsivalluri-19/geni-ai-pms`
   - Or search and click to select
4. Click **"Import"**

### 5.4 Configure Project Settings

**You should see this screen:**

1. **Project Name**: `geni-ai-pms` (keep default or change)
2. **Framework Preset**: Should auto-detect or show **"Vite"**
3. **Root Directory**: Leave as `.` (root)
4. Click **"Continue"**

### 5.5 Environment Variables Screen

**On this screen, do NOT add variables yet**

You'll see the form asking for environment variables like:
- `VITE_API_URL`
- `VITE_BACKEND_URL`
- etc.

**Leave these blank for now** → Click **"Deploy"**

It will fail with error, but that's okay. We'll fix it in Step 6.

**Wait for deployment to complete** (about 2-3 minutes)

### 5.6 What to Expect

You might see errors like:
- "Cannot find module 'express'"
- "BUILD_FAILURE"

This is **normal** because we need to set environment variables.

---

## Step 6: Configure Environment Variables

### 6.1 Go to Project Settings

1. From deployment screen, click **"Settings"** (top navigation)
2. Left sidebar → **"Environment Variables"**

### 6.2 Add Frontend Environment Variables

**Add these variables:**

| Key | Value | Environment |
|-----|-------|-------------|
| `VITE_API_URL` | `/_/backend/api` | Production, Preview |
| `VITE_BACKEND_URL` | `/_/backend` | Production, Preview |
| `VITE_APP_NAME` | `Gen-AI Placement Management System` | Production, Preview |
| `VITE_VERSION` | `1.0.0` | Production, Preview |

**For each variable:**
1. Click **"Add New"**
2. Enter **Key** and **Value**
3. Select **Environment**: Production and Preview
4. Click **"Save"**

### 6.3 Add Backend Environment Variables

**Add these critical variables:**

#### Database Connection
```
Key: MONGO_URI
Value: [Your MongoDB connection string from Step 3.5]
Example: mongodb+srv://placement_user:abc123@cluster0.abc123.mongodb.net/placement_db?retryWrites=true&w=majority
```

#### JWT Secret
```
Key: JWT_SECRET
Value: [Generate random 32+ character string]
You can generate at: https://www.random.org/strings/
Example: aB3xY9kL2mN4qP6rS8tU0vW1xY2zA3bC4dE5fG6hI7jK8lM9nO0pQ1rS2tU3vW4xY5z
```

#### Google OAuth
```
Key: GOOGLE_CLIENT_ID
Value: [From Step 4.1c - Client ID]
Example: 123456789-abc123def456.apps.googleusercontent.com

Key: GOOGLE_CLIENT_SECRET
Value: [From Step 4.1c - Client Secret]
Example: GOCSPX-abc123def456ghi789

Key: GOOGLE_CALLBACK_URL
Value: https://geni-ai-pms.vercel.app/_/backend/api/oauth/google/callback
```

#### Gemini AI
```
Key: GEMINI_API_KEY
Value: [From Step 4.2]
Example: AIzaSyD_abc123def456ghi789jkl012MNO
```

#### Email Configuration
```
Key: EMAIL_USER
Value: [Your Gmail address]
Example: your-email@gmail.com

Key: EMAIL_PASSWORD
Value: [From Step 4.3b - Gmail App Password]
Example: abcd efgh ijkl mnop

Key: SMTP_HOST
Value: smtp.gmail.com

Key: SMTP_PORT
Value: 587
```

#### Other Settings
```
Key: NODE_ENV
Value: production

Key: FRONTEND_URL
Value: https://geni-ai-pms.vercel.app

Key: FRONTEND_URLS
Value: https://geni-ai-pms.vercel.app
```

### 6.4 Verify All Variables Added

After adding all variables, you should see approximately **15-17** environment variables in the list.

✅ **Check all variables are there**

---

## Step 7: Redeploy with Environment Variables

### 7.1 Go to Deployments

1. Top navigation → **"Deployments"**
2. Find the failed deployment (top of list)
3. Click the deployment

### 7.2 Redeploy

1. Click **"Redeploy"** button (top right)
2. Confirm by clicking **"Redeploy"** in popup

**Wait 3-5 minutes for deployment to complete**

### 7.3 Check Deployment Status

You should see:
- ✅ **Frontend build**: Success
- ✅ **Backend build**: Success
- ✅ **Status**: Ready

If you see errors:
- Check environment variables are all set
- See Step 8: Troubleshooting

### 7.4 Get Your Live URL

Once deployment succeeds:
- **Your app URL**: `https://geni-ai-pms.vercel.app`

---

## Step 8: Test Your Deployment

### 8.1 Test Frontend

1. Open: `https://geni-ai-pms.vercel.app`
2. Should see **Login page**
3. Check browser console (F12):
   - Should see **no red errors**
   - Network tab → should show API calls to `/_/backend`

### 8.2 Test Backend Health

1. Open: `https://geni-ai-pms.vercel.app/_/backend/api/health`
2. Should see:
```json
{
  "status": "Backend is running!",
  "ai_status": "Connected to Gemini"
}
```

### 8.3 Test API Connection

1. Open your app: `https://geni-ai-pms.vercel.app`
2. Open DevTools → **Network** tab (F12)
3. Try to signup/login
4. Check network requests:
   - Should see request to `/_/backend/api/auth/signup`
   - Status should be **200** (not 404 or 500)

### 8.4 Test Database Connection

1. Try **Sign Up** with test credentials:
   - Email: `test@example.com`
   - Password: `Test@123456`
2. Should successfully create account

If it fails:
- Check MongoDB connection string
- Verify network access in MongoDB Atlas

### 8.5 Test Email Notifications

1. After signing up, check your email
2. Should receive verification/notification email
3. If not received:
   - Check spam folder
   - Check Gmail app password is correct
   - See Step 8: Troubleshooting

### 8.6 Test Google OAuth

1. Click **"Sign in with Google"** button
2. Complete Google auth flow
3. Should redirect back to your app
4. Should be logged in

If it fails:
- Check Google callback URL in Step 4.1c
- Verify GOOGLE_CLIENT_ID is correct

---

## Step 9: Troubleshooting

### Issue: Deployment Fails - "Cannot find module"

**Cause:** Missing dependencies in `package.json`

**Solution:**
```bash
# Locally verify npm install works
cd backend
npm install

cd ../frontend
npm install

# Commit and push
git add package-lock.json
git commit -m "Update dependencies"
git push origin main

# Redeploy on Vercel
```

---

### Issue: Backend Returns 404 Errors

**Cause:** Route prefix not working or API routes not matching

**Solution:**
1. Check Vercel logs:
   - Deployments → Your deployment → Backend tab
   - Look for error messages
2. Verify route prefix: `/_/backend/api/auth` (not `/api/auth`)
3. Redeploy with correct environment variables

---

### Issue: Frontend Can't Connect to Backend

**Cause:** `VITE_BACKEND_URL` environment variable wrong

**Solution:**
1. Go to **Settings** → **Environment Variables**
2. Verify:
   - `VITE_API_URL` = `/_/backend/api`
   - `VITE_BACKEND_URL` = `/_/backend`
3. Redeploy

---

### Issue: Google OAuth Not Working

**Cause:** Callback URL mismatch

**Solution:**
1. Go to Google Cloud Console
2. **Credentials** → Click OAuth client ID
3. Verify **Authorized redirect URIs** includes:
   - `https://geni-ai-pms.vercel.app/_/backend/api/oauth/google/callback`
4. Save and update

---

### Issue: Email Not Sending

**Cause:** Gmail app password incorrect or 2FA not enabled

**Solution:**
1. Verify 2FA enabled: https://myaccount.google.com/security
2. Generate new app password: https://myaccount.google.com/apppasswords
3. Update `EMAIL_PASSWORD` in environment variables
4. Redeploy

---

### Issue: Database Connection Failed

**Cause:** MongoDB connection string wrong or network access not allowed

**Solution:**
1. In MongoDB Atlas:
   - **Database** → **Connect** → Copy connection string again
   - **Network Access** → Allow `0.0.0.0/0` (all IPs)
2. Update `MONGO_URI` in Vercel environment variables
3. Redeploy

---

### Issue: 502 Bad Gateway Error

**Cause:** Backend crashed or not responding

**Solution:**
1. Check Vercel logs for backend errors
2. Verify MongoDB is connected
3. Check all environment variables are set
4. Redeploy from Deployments page

---

### How to View Logs

1. Go to Vercel Dashboard
2. **Deployments** → Select your deployment
3. **Logs** tab shows build and runtime errors
4. **Frontend** tab: Frontend build logs
5. **Backend** tab: Backend build logs

---

## Step 10: Final Checks

### ✅ Pre-Production Checklist

- [ ] Frontend loads at `https://geni-ai-pms.vercel.app`
- [ ] Backend responds at `https://geni-ai-pms.vercel.app/_/backend/api/health`
- [ ] Sign up works
- [ ] Login works
- [ ] Google OAuth works
- [ ] Email notifications send
- [ ] No console errors
- [ ] Database operations work
- [ ] File uploads work (if applicable)
- [ ] All API endpoints accessible

### ✅ Share Your App

Your app is now **live and public**:
- **URL**: `https://geni-ai-pms.vercel.app`
- **Backend API**: `https://geni-ai-pms.vercel.app/_/backend`

Share this URL with users!

---

## Useful Commands

```bash
# View Vercel deployments
vercel deployments

# View logs
vercel logs

# Redeploy current branch
vercel --prod

# Check project status
vercel status
```

---

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://www.mongodb.com/docs/atlas
- **Google Cloud Docs**: https://cloud.google.com/docs
- **Project Guides**: See other DEPLOYMENT guides in repository

---

## Summary

You now have:
✅ Frontend deployed on Vercel (`https://geni-ai-pms.vercel.app`)
✅ Backend deployed on Vercel (`https://geni-ai-pms.vercel.app/_/backend`)
✅ Database on MongoDB Atlas
✅ Email notifications working
✅ Google OAuth configured
✅ AI (Gemini) integrated

**Your application is live and ready!** 🚀
