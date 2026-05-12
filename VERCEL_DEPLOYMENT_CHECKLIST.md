# Vercel Deployment Quick Reference Checklist

## 📋 Before Deployment

### GitHub Repository
- [ ] All files committed to GitHub
- [ ] Latest changes pushed: `git push origin main`
- [ ] `vercel.json` exists in root
- [ ] `backend/package.json` has `"start": "node server.js"`
- [ ] `frontend/package.json` has `"build": "vite build"`

### API Keys & Credentials Gathered
- [ ] **MongoDB Connection String** saved
  - Format: `mongodb+srv://user:pass@cluster.mongodb.net/db`
- [ ] **Google OAuth Client ID** saved
- [ ] **Google OAuth Client Secret** saved
- [ ] **Gemini API Key** saved
- [ ] **Gmail App Password** saved (16 characters)

---

## 🔧 Setup: MongoDB Atlas

- [ ] MongoDB account created
- [ ] Cluster created (Free M0 tier)
- [ ] Database user created (username + password)
- [ ] Network access allowed (0.0.0.0/0 for development)
- [ ] Connection string copied with credentials

### MongoDB Connection String Template
```
mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/placement_db?retryWrites=true&w=majority
```

---

## 🔧 Setup: Google Cloud Console

- [ ] Project created in Google Cloud Console
- [ ] Google+ API enabled
- [ ] OAuth 2.0 credentials created
- [ ] Application name set: `Gen AI Placement System`
- [ ] Authorized JavaScript origins added:
  - [ ] `https://geni-ai-pms.vercel.app`
  - [ ] `http://localhost:5173`
- [ ] Authorized redirect URIs added:
  - [ ] `https://geni-ai-pms.vercel.app/_/backend/api/oauth/google/callback`
  - [ ] `http://localhost:5000/api/oauth/google/callback`
- [ ] Client ID copied
- [ ] Client Secret copied

---

## 🔧 Setup: Gmail App Password

- [ ] 2-Factor Authentication enabled on Google account
- [ ] App-specific password generated at: https://myaccount.google.com/apppasswords
- [ ] Password copied (16-character format: `xxxx xxxx xxxx xxxx`)

---

## 🔧 Setup: Google Generative AI

- [ ] Account created on: https://ai.google.dev
- [ ] API Key generated
- [ ] API Key copied

---

## ✅ Vercel Deployment Steps

### Step 1: Create Vercel Account
- [ ] Went to: https://vercel.com
- [ ] Signed up (recommended: with GitHub)
- [ ] Authorized Vercel to access GitHub

### Step 2: Import GitHub Repository
- [ ] Clicked "Add New" → "Project"
- [ ] Clicked "Import Git Repository"
- [ ] Pasted/selected: `https://github.com/vamsivalluri-19/geni-ai-pms`
- [ ] Clicked "Import"

### Step 3: Configure Project
- [ ] Project name: `geni-ai-pms`
- [ ] Root directory: `.` (root of monorepo)
- [ ] Clicked "Continue"

### Step 4: Initial Deployment (will fail - OK!)
- [ ] Clicked "Deploy" (without environment variables)
- [ ] Deployment failed (this is expected)

### Step 5: Add Environment Variables

#### Frontend Variables
- [ ] `VITE_API_URL` = `/_/backend/api`
- [ ] `VITE_BACKEND_URL` = `/_/backend`
- [ ] `VITE_APP_NAME` = `Gen-AI Placement Management System`
- [ ] `VITE_VERSION` = `1.0.0`

#### Backend: Database
- [ ] `MONGO_URI` = [Your MongoDB connection string]
- [ ] `MONGODB_URI` = [Same as MONGO_URI]

#### Backend: Security
- [ ] `JWT_SECRET` = [32+ character random string]
- [ ] `NODE_ENV` = `production`

#### Backend: Google OAuth
- [ ] `GOOGLE_CLIENT_ID` = [From Google Cloud Console]
- [ ] `GOOGLE_CLIENT_SECRET` = [From Google Cloud Console]
- [ ] `GOOGLE_CALLBACK_URL` = `https://geni-ai-pms.vercel.app/_/backend/api/oauth/google/callback`

#### Backend: Gemini AI
- [ ] `GEMINI_API_KEY` = [From Google Generative AI]

#### Backend: Email
- [ ] `EMAIL_USER` = [Your Gmail address]
- [ ] `EMAIL_PASSWORD` = [Gmail app password]
- [ ] `SMTP_HOST` = `smtp.gmail.com`
- [ ] `SMTP_PORT` = `587`

#### Backend: Frontend URLs
- [ ] `FRONTEND_URL` = `https://geni-ai-pms.vercel.app`
- [ ] `FRONTEND_URLS` = `https://geni-ai-pms.vercel.app`

**For each variable:**
- [ ] Set Environment: **Production and Preview**
- [ ] Clicked "Save"

### Step 6: Redeploy
- [ ] Went to "Deployments"
- [ ] Found failed deployment
- [ ] Clicked "Redeploy"
- [ ] Confirmed "Redeploy"
- [ ] Waited 3-5 minutes for new deployment

### Step 7: Verify Deployment Success
- [ ] Frontend build: ✅ Success
- [ ] Backend build: ✅ Success
- [ ] Status: ✅ Ready
- [ ] Live URL: `https://geni-ai-pms.vercel.app`

---

## 🧪 Post-Deployment Testing

### Frontend Testing
- [ ] App loads: `https://geni-ai-pms.vercel.app`
- [ ] Login page visible
- [ ] No red errors in console (F12)
- [ ] Network tab shows `/_/backend` requests

### Backend Testing
- [ ] Health check works: `https://geni-ai-pms.vercel.app/_/backend/api/health`
- [ ] Response: `{"status":"Backend is running!","ai_status":"Connected to Gemini"}`

### Feature Testing
- [ ] Sign up with email works
- [ ] Login works
- [ ] Verification email received
- [ ] Google OAuth sign in works
- [ ] Dashboard loads after login
- [ ] Database operations work
- [ ] No API errors

---

## 📊 Environment Variables Summary

| Variable | Value | Type |
|----------|-------|------|
| `VITE_API_URL` | `/_/backend/api` | Frontend |
| `VITE_BACKEND_URL` | `/_/backend` | Frontend |
| `VITE_APP_NAME` | `Gen-AI Placement System` | Frontend |
| `VITE_VERSION` | `1.0.0` | Frontend |
| `MONGO_URI` | MongoDB connection string | Backend |
| `JWT_SECRET` | 32+ char random string | Backend |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | Backend |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | Backend |
| `GOOGLE_CALLBACK_URL` | `https://geni-ai-pms.vercel.app/...` | Backend |
| `GEMINI_API_KEY` | Google Generative AI key | Backend |
| `EMAIL_USER` | Gmail address | Backend |
| `EMAIL_PASSWORD` | Gmail app password | Backend |
| `NODE_ENV` | `production` | Backend |
| `FRONTEND_URL` | `https://geni-ai-pms.vercel.app` | Backend |

---

## 🆘 Common Issues Quick Fixes

| Issue | Quick Fix |
|-------|-----------|
| Backend build fails | Check all environment variables are set |
| Frontend can't call API | Verify `VITE_BACKEND_URL` = `/_/backend` |
| Google OAuth fails | Update redirect URI in Google Cloud Console |
| Email not sending | Generate new Gmail app password |
| Database connection fails | Test MongoDB connection string with Compass |
| 502 Bad Gateway | Check backend logs, verify MongoDB connected |

---

## 🔄 After Deployment

### Auto-Deployment Setup
```bash
git add .
git commit -m "Your changes"
git push origin main
# Vercel automatically deploys! ✨
```

### Monitor Deployments
1. Go to: https://vercel.com/dashboard
2. Click your project: `geni-ai-pms`
3. **Deployments** tab shows all deploys
4. Click each to see logs

### Update Environment Variables
1. Project Settings → Environment Variables
2. Click variable to edit
3. Change value
4. Click "Save"
5. Redeploy from Deployments page

---

## 📱 Share Your App

### Live URLs
- **Frontend**: `https://geni-ai-pms.vercel.app`
- **Backend**: `https://geni-ai-pms.vercel.app/_/backend`
- **API Docs**: `https://geni-ai-pms.vercel.app/_/backend/api/health`

### Sharing with Users
- Send frontend URL: `https://geni-ai-pms.vercel.app`
- Users can sign up and use the application

---

## 📚 Helpful Resources

- **Full Step-by-Step Guide**: See `VERCEL_DEPLOYMENT_STEP_BY_STEP.md`
- **Vercel Documentation**: https://vercel.com/docs
- **MongoDB Documentation**: https://www.mongodb.com/docs/atlas
- **Google OAuth Setup**: https://cloud.google.com/docs/authentication/oauth2
- **Project Guides**: Check other markdown files in repository

---

## ✨ Success Indicators

Your deployment is successful when:
✅ Frontend loads without errors
✅ Backend responds to health check
✅ API calls work (check Network tab)
✅ Sign up/Login works
✅ Email notifications send
✅ Google OAuth works
✅ All features functional
✅ No console errors

---

**🎉 Deployment Complete!**

Your Gen-AI Placement Management System is now live on Vercel!
