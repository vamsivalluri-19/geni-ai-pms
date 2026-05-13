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
  - [ ] `https://geni-ai-pms.vercel.app/_/backend/api/auth/google/callback`
  - [ ] `http://localhost:5000/api/auth/google/callback`
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

## ✅ Vercel Deployment Steps (Frontend Only)

### Step 1: Create Vercel Account
- [ ] Went to: https://vercel.com
- [ ] Signed up (recommended: with GitHub)
- [ ] Authorized Vercel to access GitHub

### Step 2: Import GitHub Repository
- [ ] Clicked "Add New" → "Project"
- [ ] Clicked "Import Git Repository"
- [ ] Pasted/selected: `https://github.com/vamsivalluri-19/geni-ai-pms`
- [ ] Clicked "Import"

### Step 3: Configure Project Settings
- [ ] **Project Name**: `placement-management-system`
- [ ] **Root Directory**: `frontend` ✓ (IMPORTANT!)
- [ ] **Framework**: Vite
- [ ] **Build Command**: `npm run build`
- [ ] **Output Directory**: `dist`
- [ ] **Install Command**: `npm install`

### Step 4: Add Environment Variables

#### Frontend Variables (Production & Preview)
- [ ] `VITE_API_URL` = `https://geni-ai-pms.onrender.com/api`
- [ ] `VITE_BACKEND_URL` = `https://geni-ai-pms.onrender.com`
- [ ] `VITE_APP_NAME` = `Gen-AI Placement Management System` (Optional)
- [ ] `VITE_VERSION` = `1.0.0` (Optional)

**For each variable:**
- [ ] Set Environment: **Production and Preview**
- [ ] Clicked "Save"

### Step 5: Deploy
- [ ] Clicked "Deploy"
- [ ] Waited 2-3 minutes for build to complete
- [ ] Status: ✅ Ready

### Step 6: Verify Deployment Success
- [ ] Frontend build: ✅ Success
- [ ] Status: ✅ Ready
- [ ] Live URL: `https://[your-project-name].vercel.app`

---

## 🧪 Post-Deployment Testing

### Frontend Testing
- [ ] App loads: `https://[your-project-name].vercel.app`
- [ ] Login page visible
- [ ] No errors in browser console (F12)
- [ ] API calls going to: `https://geni-ai-pms.onrender.com/api`

### Backend Connectivity
- [ ] Can login successfully
- [ ] Can fetch data from backend
- [ ] Email notifications working
- [ ] OAuth login working (if configured)

---

## 📊 Environment Variables Summary

**Frontend Variables (Set in Vercel):**

| Variable | Value | Environment |
|----------|-------|-------------|
| `VITE_API_URL` | `https://geni-ai-pms.onrender.com/api` | Production & Preview |
| `VITE_BACKEND_URL` | `https://geni-ai-pms.onrender.com` | Production & Preview |
| `VITE_APP_NAME` | `Gen-AI Placement System` | Production & Preview (Optional) |
| `VITE_VERSION` | `1.0.0` | Production & Preview (Optional) |

**Note:** Backend is running on Render.com separately - `https://geni-ai-pms.onrender.com`

---

## 🆘 Common Issues Quick Fixes

| Issue | Quick Fix |
|-------|-----------|
| Frontend can't connect to API | Verify `VITE_BACKEND_URL` = `https://geni-ai-pms.onrender.com` in Vercel |
| Google OAuth fails | Update OAuth redirect URI in Google Cloud Console to include Vercel domain |
| Email not sending | Ensure backend is running on Render and email service is configured |
| Login fails | Check that Render backend is accessible from Vercel frontend |
| Build fails | Ensure root directory is set to `frontend` (not root) |

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
- **Frontend**: `https://[your-project-name].vercel.app`
- **Backend API**: `https://geni-ai-pms.onrender.com/api`
- **Backend URL**: `https://geni-ai-pms.onrender.com`

### Sharing with Users
- Send frontend URL: `https://[your-project-name].vercel.app`
- Users can sign up and use the application
- Backend must remain running on Render for full functionality

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
