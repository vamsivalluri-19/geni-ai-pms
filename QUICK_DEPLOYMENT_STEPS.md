# Quick Deployment Steps: Vercel & Render

## 🚀 5-Minute Deployment Setup

### Step 1: Prepare Your GitHub Repository (2 min)

```bash
# Navigate to project root
cd Gen-AI-Placement-Management-System

# Stage all changes
git add .

# Commit with deployment updates
git commit -m "Add Vercel and Render deployment configuration"

# Push to GitHub
git push origin main
```

---

### Step 2: Deploy Backend to Render (2-3 min)

#### 2a: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up / Sign in
3. Connect your GitHub account

#### 2b: Create Backend Service
1. Click "New +" → "Web Service"
2. Select your GitHub repository
3. **Settings:**
   - Name: `gen-ai-placement-backend`
   - Environment: `Node`
   - Region: Choose closest to your users
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Plan: Free (or Paid for better performance)

#### 2c: Add Environment Variables
Click "Add from .env.example" and fill in:

```
MONGO_URI: [Your MongoDB connection string]
MONGODB_URI: [Same as MONGO_URI]
JWT_SECRET: [Generate random 32+ char string]
FRONTEND_URL: [Leave blank for now, update later]
GOOGLE_CLIENT_ID: [From Google Cloud]
GOOGLE_CLIENT_SECRET: [From Google Cloud]
GOOGLE_CALLBACK_URL: [Will update after deployment]
GEMINI_API_KEY: [From Google AI Studio]
EMAIL_USER: [Your Gmail]
EMAIL_PASSWORD: [Gmail App Password]
SMTP_HOST: smtp.gmail.com
SMTP_PORT: 587
NODE_ENV: production
```

#### 2d: Deploy
1. Click "Create Web Service"
2. Wait for deployment (2-3 minutes)
3. **Copy the URL** when done (e.g., `https://gen-ai-placement-backend.onrender.com`)

#### 2e: Verify Backend
- Go to `https://your-backend-url.onrender.com/api/health`
- Should see: `{"status":"Backend is running!","ai_status":"Connected to Gemini"}`

---

### Step 3: Deploy Frontend to Vercel (2-3 min)

#### 3a: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up / Sign in with GitHub

#### 3b: Import Project
1. Click "Add New" → "Project"
2. Select your GitHub repository
3. **Settings:**
   - Framework Preset: `Vite`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

#### 3c: Environment Variables
Add these variables:
```
VITE_API_URL: https://your-backend-url.onrender.com/api
VITE_BACKEND_URL: https://your-backend-url.onrender.com
```

#### 3d: Deploy
1. Click "Deploy"
2. Wait for deployment (2-3 minutes)
3. **Copy the URL** when done (e.g., `https://your-app.vercel.app`)

---

### Step 4: Final Configuration (1 min)

#### 4a: Update Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Find your OAuth 2.0 credentials
3. Update Authorized redirect URIs:
   - Add: `https://your-backend-url.onrender.com/api/auth/google/callback`

#### 4b: Update Backend CORS
1. Go to Render dashboard
2. Find your backend service
3. Edit Environment Variables
4. Update `FRONTEND_URL`: `https://your-app.vercel.app`
5. Click "Save"
6. Service will auto-restart

---

### Step 5: Test Your Deployment (1 min)

1. Open your frontend: `https://your-app.vercel.app`
2. Test these features:
   - [ ] Page loads without errors
   - [ ] Can see login page
   - [ ] Sign up / Login works
   - [ ] Can access dashboard
   - [ ] API calls work (check browser Network tab)
   - [ ] No CORS errors in console

---

## ✅ Done! Your App is Live

Your application is now deployed:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend-url.onrender.com`
- **Database**: MongoDB Atlas (Cloud)

---

## 📱 Accessing Your App

1. **Users:** Share `https://your-app.vercel.app`
2. **Admins:** Access admin panel at `/admin`
3. **Monitor Backend:** `https://your-backend-url.onrender.com/api/health`

---

## 🔄 Auto-Deployment on Updates

Both Vercel and Render automatically redeploy when you push to GitHub:

```bash
# Make changes locally
git add .
git commit -m "Update feature XYZ"
git push origin main

# Both platforms auto-deploy! ✨
```

---

## 🆘 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| **Backend won't start** | Check env vars in Render, check logs |
| **Frontend won't build** | Run `npm run build` locally to test |
| **Can't connect to API** | Verify backend URL in Vercel env vars |
| **Login not working** | Check Google OAuth redirect URL |
| **CORS errors** | Update `FRONTEND_URL` in Render backend |

---

## 📚 Need Help?

- Full Guide: See `DEPLOYMENT_GUIDE.md`
- Checklist: See `PRE_DEPLOYMENT_CHECKLIST.md`
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
