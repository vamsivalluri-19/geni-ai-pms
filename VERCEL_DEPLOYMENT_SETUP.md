# Vercel Deployment Setup Guide

## Project Details
- **GitHub Repo**: vamsivalluri-19/geni-ai-pms
- **Branch**: main
- **Framework**: Vite + React
- **Backend**: Render.com (https://geni-ai-pms.onrender.com)

## Step-by-Step Vercel Deployment

### 1. Create a New Project in Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New..." → "Project"**
3. Click **"Import Git Repository"**
4. Search for and select: **vamsivalluri-19/geni-ai-pms**
5. Click **"Import"**

### 2. Configure Project Settings

**Environment & Framework:**
- **Framework Preset**: Vite
- **Root Directory**: `frontend` ✓
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Add Environment Variables

In the Vercel dashboard, go to **Settings → Environment Variables** and add:

#### Production & Preview Environment Variables

| Key | Value | 
|-----|-------|
| `VITE_API_URL` | `https://geni-ai-pms.onrender.com/api` |
| `VITE_BACKEND_URL` | `https://geni-ai-pms.onrender.com` |

**Note**: These same variables should be set for both **Production** and **Preview** environments.

Optional variables (if needed):
| Key | Value |
|-----|-------|
| `VITE_CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Your Cloudinary preset |
| `VITE_GA_ID` | Your Google Analytics ID |

### 4. Deploy

1. Click **"Deploy"**
2. Wait for the deployment to complete
3. Your frontend will be live at: `https://your-project-name.vercel.app`

## Verification Checklist

✓ Environment variables are set correctly  
✓ Root directory is set to `frontend`  
✓ Build command is `npm run build`  
✓ Output directory is `dist`  
✓ GitHub repo is connected  
✓ Backend URL points to https://geni-ai-pms.onrender.com  

## Local Testing Before Deployment

```bash
# Test production build locally
cd frontend
npm run build
npm run preview
```

Visit `http://localhost:4173` to preview the production build.

## Important Notes

- ⚠️ **Backend Running**: Ensure your Render backend (https://geni-ai-pms.onrender.com) is running before accessing the deployed app
- 🔄 **Auto Deployments**: Any push to the `main` branch will trigger automatic deployments
- 🌐 **CORS**: Backend should accept requests from your Vercel domain
- 📝 **Environment Variables**: Always set them in Vercel dashboard, not in `.env` files

## Files Updated

- ✓ `frontend/.env.production` - Production environment variables
- ✓ `vercel.json` - Vercel configuration
- ✓ `frontend/package.json` - Build scripts (already configured)

## Troubleshooting

### "API calls failing" 
→ Check that `VITE_API_URL` and `VITE_BACKEND_URL` are set correctly in Vercel

### "Build fails"
→ Ensure `frontend` is set as the root directory in Vercel settings

### "Blank page or 404"
→ Check that `Output Directory` is set to `dist`

## Post-Deployment

1. Visit your deployed URL
2. Test login functionality
3. Verify API calls to backend
4. Check browser console for any errors
5. Monitor Vercel deployments for any build failures

---

**Deployment Status**: Ready to deploy to Vercel ✓
