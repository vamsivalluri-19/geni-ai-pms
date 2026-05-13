# Deployment Guide: Vercel (Frontend) & Render (Backend)

## Overview
- **Frontend**: Deployed on [Vercel](https://vercel.com)
- **Backend**: Deployed on [Render](https://render.com)
- **Database**: MongoDB Atlas (Cloud)

---

## BACKEND DEPLOYMENT (Render)

### Prerequisites
1. Create a MongoDB Atlas account and cluster
2. Create a Render account
3. Have your GitHub repository ready

### Step 1: Prepare Backend

1. Ensure `render.yaml` exists in backend root directory
2. Update `backend/.env.example` with all required variables
3. Commit changes to GitHub:
   ```bash
   git add .
   git commit -m "Add deployment configuration"
   git push origin main
   ```

### Step 2: Deploy to Render

1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the repository and branch (main)
5. **Configure:**
   - Name: `gen-ai-placement-backend`
   - Runtime: `Node`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Plan: Free or Paid (Free has limitations)

6. **Add Environment Variables** (click "Add from .env.example"):
   - `MONGO_URI`: Your MongoDB connection string
   - `MONGODB_URI`: Same as MONGO_URI (backup)
   - `JWT_SECRET`: Random secret string
   - `FRONTEND_URL`: Your Vercel frontend URL (e.g., https://your-app.vercel.app)
   - `GOOGLE_CLIENT_ID`: From Google Cloud Console
   - `GOOGLE_CLIENT_SECRET`: From Google Cloud Console
   - `GOOGLE_CALLBACK_URL`: `https://your-app.onrender.com/api/auth/google/callback`
   - `GEMINI_API_KEY`: From Google AI Studio
   - `EMAIL_USER`: Your email for notifications
   - `EMAIL_PASSWORD`: Gmail app password
   - `SMTP_HOST`: `smtp.gmail.com`
   - `SMTP_PORT`: `587`
   - `NODE_ENV`: `production`

7. Click "Create Web Service"
8. Wait for deployment to complete
9. Note the backend URL: `https://your-app.onrender.com`

### Step 3: Update Frontend with Backend URL

After backend deployment, update the backend URL in your frontend environment variables.

---

## FRONTEND DEPLOYMENT (Vercel)

### Prerequisites
1. Create a Vercel account
2. Have your GitHub repository ready
3. Know your backend Render URL

### Step 1: Prepare Frontend

1. Ensure `vercel.json` exists in frontend root
2. Update `frontend/.env.example`:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   VITE_BACKEND_URL=https://your-backend.onrender.com
   ```
3. Commit to GitHub

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. **Configure:**
   - Framework: `Vite`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. **Add Environment Variables:**
   - `VITE_API_URL`: `https://your-backend.onrender.com/api`
   - `VITE_BACKEND_URL`: `https://your-backend.onrender.com`

6. Click "Deploy"
7. Wait for deployment to complete
8. Your app is now live at: `https://your-domain.vercel.app`

---

## POST-DEPLOYMENT CHECKLIST

### Backend (Render)
- [ ] Test health endpoint: `https://your-app.onrender.com/api/health`
- [ ] Verify MongoDB connection in logs
- [ ] Check CORS is allowing frontend origin
- [ ] Test OAuth callback URL is correct
- [ ] Verify email notifications work
- [ ] Monitor error logs for issues

### Frontend (Vercel)
- [ ] Test API calls work correctly
- [ ] Verify authentication flow
- [ ] Check Socket.IO connection
- [ ] Test file uploads (if applicable)
- [ ] Verify all pages load correctly

### General
- [ ] Update Google OAuth redirect URIs
- [ ] Test login/logout flow
- [ ] Verify email notifications
- [ ] Test all major features
- [ ] Set up monitoring/alerts

---

## ENVIRONMENT VARIABLES REFERENCE

### Backend (.env)
```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your-secret-key
FRONTEND_URL=https://your-app.vercel.app
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_CALLBACK_URL=https://backend.onrender.com/api/auth/google/callback
GEMINI_API_KEY=xxx
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=app-password
NODE_ENV=production
```

### Frontend (.env)
```env
VITE_API_URL=https://backend.onrender.com/api
VITE_BACKEND_URL=https://backend.onrender.com
```

---

## TROUBLESHOOTING

### Backend Not Connecting to Database
- Verify MONGO_URI is correct
- Check MongoDB Atlas network access (allow all IPs for now)
- Ensure credentials are valid

### CORS Errors
- Add your Vercel URL to `FRONTEND_URL` environment variable
- Restart backend service after updating

### Frontend Can't Connect to Backend
- Verify `VITE_BACKEND_URL` is set correctly
- Check backend is running: `https://backend.onrender.com/api/health`
- Verify CORS configuration in backend

### OAuth Not Working
- Verify `GOOGLE_CALLBACK_URL` matches your backend URL
- Update Google Cloud Console with correct callback URL
- Ensure credentials are correct

### Email Not Sending
- Use Gmail app password (not regular password)
- Enable "Less secure app access" if needed
- Verify SMTP settings

---

## UPDATES & REDEPLOYMENT

### To Update Backend:
1. Make changes locally
2. Commit and push to GitHub
3. Render auto-deploys from main branch

### To Update Frontend:
1. Make changes locally
2. Update environment variables if needed
3. Commit and push to GitHub
4. Vercel auto-deploys from main branch

---

## MONITORING & LOGS

### Render Backend Logs:
- Dashboard → Services → Your Service → Logs

### Vercel Frontend Logs:
- Dashboard → Your Project → Deployments → View Logs

---

## USEFUL LINKS
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Google Cloud Console: https://console.cloud.google.com
