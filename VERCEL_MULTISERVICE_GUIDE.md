# Vercel Multi-Service Deployment Guide

## Overview
This guide covers deploying both frontend and backend on **Vercel** using the experimental multi-service feature.

> **Note:** Vercel's multi-service deployment is experimental. For production, consider deploying backend on **Render** and frontend on **Vercel** separately.

---

## Architecture

```
Vercel Project (geni-ai-pms)
├── Frontend Service (Vite)
│   └── Route: / (root)
│   └── URL: https://your-domain.vercel.app
│
└── Backend Service (Express)
    └── Route: /_/backend
    └── URL: https://your-domain.vercel.app/_/backend
```

---

## Setup Instructions

### Step 1: Root Level vercel.json

The root `vercel.json` must be configured for multi-service deployment:

```json
{
  "experimentalServices": {
    "frontend": {
      "routePrefix": "/",
      "framework": "vite",
      "rootDirectory": "frontend",
      "buildCommand": "npm run build",
      "outputDirectory": "dist"
    },
    "backend": {
      "routePrefix": "/_/backend",
      "entrypoint": "server.js",
      "rootDirectory": "backend"
    }
  }
}
```

### Step 2: Environment Variables Setup

#### Frontend Environment Variables

**For Vercel Multi-Service** (local testing):
```env
VITE_API_URL=/_/backend/api
VITE_BACKEND_URL=/_/backend
```

**For Local Development**:
```env
VITE_API_URL=http://localhost:5000/api
VITE_BACKEND_URL=http://localhost:5000
```

In Vercel Dashboard:
```
Environment: Production and Preview
VITE_API_URL = /_/backend/api
VITE_BACKEND_URL = /_/backend
```

#### Backend Environment Variables

In Vercel Dashboard, add:
```
MONGO_URI: [Your MongoDB connection]
JWT_SECRET: [Your secret]
GEMINI_API_KEY: [Your API key]
EMAIL_USER: [Your email]
EMAIL_PASSWORD: [Your app password]
NODE_ENV: production
```

### Step 3: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. **Configure:**
   - Framework: Monorepo with Services
   - Root Directory: `.` (root of monorepo)
   - Build & Output Settings: Will be auto-detected
5. **Add Environment Variables** (see Step 2)
6. Click "Deploy"

---

## File Structure

```
Gen-AI-Placement-Management-System/
├── vercel.json (ROOT - Multi-service config)
├── .vercelignore
├── frontend/
│   ├── vercel.json (Optional - frontend-specific config)
│   ├── .env.example
│   ├── .env.development
│   ├── .env.production
│   ├── .env.vercel
│   ├── vite.config.js
│   ├── package.json
│   └── src/
├── backend/
│   ├── render.yaml (Optional - for Render fallback)
│   ├── .env.example
│   ├── .env.production
│   ├── server.js
│   ├── package.json
│   └── routes/
└── ...
```

---

## Backend Configuration for Vercel

Your `backend/server.js` should work as-is. Vercel handles the `/_/backend` prefix routing automatically.

### Important Notes for Backend:

1. **CORS Configuration**: Update to allow Vercel domain:
```javascript
const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://localhost:5000',
  process.env.FRONTEND_URL,
  // Vercel will auto-allow same-domain requests
]);
```

2. **API Routes**: All routes remain unchanged:
   - Local: `http://localhost:5000/api/auth`
   - Vercel: `https://your-domain.vercel.app/_/backend/api/auth`

3. **Health Check**: 
   - Local: `http://localhost:5000/api/health`
   - Vercel: `https://your-domain.vercel.app/_/backend/api/health`

---

## Frontend Configuration for Vercel

Your `frontend/vite.config.js` is already configured for proxy:

```javascript
server: {
  proxy: {
    '/api': {
      target: process.env.VITE_BACKEND_URL || 'http://localhost:5000',
      changeOrigin: true,
    },
  },
}
```

### In Production (Vercel):
- Frontend calls: `/_/backend/api/...`
- Vercel routes to: Backend service

---

## Environment Variables Priority

### Development (Local)
```env
VITE_API_URL=http://localhost:5000/api
VITE_BACKEND_URL=http://localhost:5000
```

### Production (Vercel Multi-Service)
```env
VITE_API_URL=/_/backend/api
VITE_BACKEND_URL=/_/backend
```

### Set in Vercel Dashboard:
The environment variables in Vercel Dashboard override all local `.env` files during build.

---

## Testing Multi-Service Deployment

### Step 1: Local Testing
```bash
cd frontend
npm run build
npm run preview

# In another terminal
cd backend
npm start
```

Then test at `http://localhost:4173` (Vite preview)

### Step 2: On Vercel Deployment

1. Visit: `https://your-domain.vercel.app`
2. Open Browser DevTools → Network/Console
3. Verify API calls go to: `/_/backend/api/...`
4. Check for CORS errors
5. Test login/auth flow
6. Test file uploads

### Step 3: Health Checks

```bash
# Frontend
curl https://your-domain.vercel.app

# Backend Health
curl https://your-domain.vercel.app/_/backend/api/health
```

Expected response:
```json
{
  "status": "Backend is running!",
  "ai_status": "Connected to Gemini"
}
```

---

## Common Issues & Solutions

### Issue: "Cannot POST /_/backend/api/auth/login"

**Solution:**
- Verify backend environment variables are set in Vercel
- Check backend service built successfully
- Review Vercel logs for backend build errors

### Issue: CORS Error on Frontend

**Solution:**
- For same-domain requests (/_/backend), CORS should be automatic
- If still failing, add to backend CORS config:
```javascript
origin: (origin, callback) => {
  // Same domain always allowed
  if (!origin) return callback(null, true);
  // Vercel handles this automatically
  callback(null, true);
}
```

### Issue: API Returns 404

**Solution:**
- Verify all routes are accessible at `/_/backend/api/path`
- Check backend environment variables
- Verify database connection (check Vercel logs)

### Issue: Frontend Can't Connect to Backend

**Solution 1:** Check Network tab in DevTools
- Should see requests to `/_/backend/api/...`
- Not to external URLs

**Solution 2:** Verify environment variables in Vercel
- Dashboard → Project Settings → Environment Variables
- Confirm `VITE_API_URL=/_/backend/api`

**Solution 3:** Clear cache and rebuild
- Vercel Dashboard → Deployments → Redeploy

---

## Fallback Strategy

If Vercel multi-service deployment fails or reaches limitations:

### Option 1: Separate Deployments
- **Frontend**: Vercel (as currently configured)
- **Backend**: Render (use `backend/render.yaml`)

Update frontend env vars to use external backend:
```env
VITE_API_URL=https://your-backend.onrender.com/api
VITE_BACKEND_URL=https://your-backend.onrender.com
```

### Option 2: Monorepo with Single Service
Deploy entire project as single service with:
```bash
Build Command: npm install && npm run build:all
Start Command: npm start:prod
```

---

## Performance Considerations

### Multi-Service Advantages:
✅ Single domain (no CORS issues)
✅ Easier to manage
✅ Faster communication (same server)

### Multi-Service Limitations:
⚠️ Experimental feature
⚠️ Less CPU isolation between services
⚠️ Limited scaling options

### For Production:
Consider separate deployments on Vercel (frontend) + Render (backend) for:
- Better performance
- Independent scaling
- More reliable uptime

---

## Monitoring & Debugging

### Vercel Logs

**Frontend Build:**
```
Dashboard → Deployments → Click Deployment → Frontend
```

**Backend Build:**
```
Dashboard → Deployments → Click Deployment → Backend
```

### Useful Commands

```bash
# Check Vercel CLI status
vercel status

# View project details
vercel projects list

# Redeploy
vercel --prod

# View logs
vercel logs [project-name]
```

---

## Next Steps

1. ✅ Ensure `vercel.json` is in root directory
2. ✅ Set environment variables in Vercel Dashboard
3. ✅ Deploy from GitHub
4. ✅ Test API connectivity
5. ✅ Monitor logs for errors
6. ✅ Set up monitoring/alerts

---

## Useful Resources

- [Vercel Multi-Service Docs](https://vercel.com/docs/cli/projects)
- [Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Deployment Best Practices](https://vercel.com/docs/deployments)
- [Troubleshooting](https://vercel.com/docs/troubleshoot)
