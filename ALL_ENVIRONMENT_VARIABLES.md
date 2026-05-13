# All Environment Variables - Complete Reference

Complete guide to ALL environment variables needed for Vercel deployment, organized by service.

---

## 🎨 FRONTEND Environment Variables (4 total)

These variables go in **Vercel Dashboard → Settings → Environment Variables** with **Production & Preview** environments selected.

### Frontend Variables Table

| # | Variable | Value | Purpose | Example |
|---|----------|-------|---------|---------|
| 1 | `VITE_API_URL` | `/_/backend/api` | REST API base URL | Used in axios.create({baseURL: VITE_API_URL}) |
| 2 | `VITE_BACKEND_URL` | `/_/backend` | Backend service URL | Used for WebSocket, file uploads |
| 3 | `VITE_APP_NAME` | `Gen-AI Placement Management System` | App display name | Shown in headers, titles, footers |
| 4 | `VITE_VERSION` | `1.0.0` | App version number | Used in logging, error reporting |

### Where to Add Frontend Variables

```
Vercel Dashboard
  ↓
Your Project: geni-ai-pms
  ↓
Settings (top menu)
  ↓
Environment Variables (left sidebar)
  ↓
Click "Add New"
  ↓
Enter each variable with Production + Preview selected
```

### Frontend Variables Set Step-by-Step

**Variable 1:**
```
Key: VITE_API_URL
Value: /_/backend/api
Environment: ☑ Production  ☑ Preview  ☐ Development
Click "Save"
```

**Variable 2:**
```
Key: VITE_BACKEND_URL
Value: /_/backend
Environment: ☑ Production  ☑ Preview  ☐ Development
Click "Save"
```

**Variable 3:**
```
Key: VITE_APP_NAME
Value: Gen-AI Placement Management System
Environment: ☑ Production  ☑ Preview  ☐ Development
Click "Save"
```

**Variable 4:**
```
Key: VITE_VERSION
Value: 1.0.0
Environment: ☑ Production  ☑ Preview  ☐ Development
Click "Save"
```

---

## 🔧 BACKEND Environment Variables (13 total)

These variables also go in **Vercel Dashboard → Settings → Environment Variables** with **Production & Preview** environments selected.

### Backend Variables Organized by Category

#### 1. Database Connection (2 variables)

| Variable | Value | Required | Notes |
|----------|-------|----------|-------|
| `MONGO_URI` | MongoDB connection string | ✅ YES | Primary DB connection |
| `MONGODB_URI` | Same as MONGO_URI | ⚠️ BACKUP | Fallback connection string |

**Example Values:**
```
MONGO_URI=mongodb+srv://placement_user:MyPassword123@cluster0.abc123.mongodb.net/placement_db?retryWrites=true&w=majority
MONGODB_URI=mongodb+srv://placement_user:MyPassword123@cluster0.abc123.mongodb.net/placement_db?retryWrites=true&w=majority
```

**How to Get:**
1. Go to MongoDB Atlas
2. Cluster → Connect → Connection String
3. Copy and replace `<username>`, `<password>`, `myFirstDatabase`

#### 2. Security & Authentication (2 variables)

| Variable | Value | Required | Notes |
|----------|-------|----------|-------|
| `JWT_SECRET` | 32+ character random string | ✅ YES | Signs user tokens |
| `NODE_ENV` | `production` | ✅ YES | Sets Node environment |

**Example Values:**
```
JWT_SECRET=aB3xY9kL2mN4qP6rS8tU0vW1xY2zA3bC4dE5fG6hI7jK8lM9nO0pQ1rS2tU3vW4xY5z
NODE_ENV=production
```

**How to Generate JWT_SECRET:**
1. Go to: https://www.random.org/strings/
2. Settings: Length 32-64, Include symbols
3. Copy generated string

#### 3. Google OAuth (3 variables)

| Variable | Value | Required | Notes |
|----------|-------|----------|-------|
| `GOOGLE_CLIENT_ID` | Your Google Client ID | ✅ YES | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Your Google Client Secret | ✅ YES | Keep this SECRET! |
| `GOOGLE_CALLBACK_URL` | `https://geni-ai-pms.vercel.app/_/backend/api/auth/google/callback` | ✅ YES | Must match Google OAuth settings |

**Example Values:**
```
GOOGLE_CLIENT_ID=123456789-abc123def456ghi789.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123def456ghi789jkl012
GOOGLE_CALLBACK_URL=https://geni-ai-pms.vercel.app/_/backend/api/auth/google/callback
```

**How to Get:**
1. Go to: https://console.cloud.google.com
2. Create project → Enable Google+ API
3. Credentials → OAuth 2.0 Client ID (Web Application)
4. Add authorized redirect URI: `https://geni-ai-pms.vercel.app/_/backend/api/auth/google/callback`
5. Copy Client ID and Client Secret

#### 4. AI / Gemini (1 variable)

| Variable | Value | Required | Notes |
|----------|-------|----------|-------|
| `GEMINI_API_KEY` | Your Gemini API Key | ✅ YES | From Google AI Studio |

**Example Value:**
```
GEMINI_API_KEY=AIzaSyD_abc123def456ghi789jkl012MNO
```

**How to Get:**
1. Go to: https://ai.google.dev/tutorials/setup
2. Click "Get API Key"
3. Click "Create API Key"
4. Copy the key

#### 5. Email Configuration (4 variables)

| Variable | Value | Required | Notes |
|----------|-------|----------|-------|
| `EMAIL_USER` | Your Gmail address | ✅ YES | Sender email for notifications |
| `EMAIL_PASSWORD` | Gmail app password | ✅ YES | NOT your regular Gmail password |
| `SMTP_HOST` | `smtp.gmail.com` | ✅ YES | Gmail SMTP server |
| `SMTP_PORT` | `587` | ✅ YES | Gmail SMTP port |

**Example Values:**
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

**How to Get:**
1. Enable 2-Factor Authentication: https://myaccount.google.com/security
2. Generate app password: https://myaccount.google.com/apppasswords
3. Select: Mail + Your Device
4. Copy the 16-character password (with spaces)

**Important:** Use the **16-character app password**, NOT your regular Gmail password!

#### 6. Frontend Integration (2 variables)

| Variable | Value | Required | Notes |
|----------|-------|----------|-------|
| `FRONTEND_URL` | `https://geni-ai-pms.vercel.app` | ✅ YES | For CORS whitelist |
| `FRONTEND_URLS` | `https://geni-ai-pms.vercel.app` | ⚠️ BACKUP | Comma-separated if multiple |

**Example Values:**
```
FRONTEND_URL=https://geni-ai-pms.vercel.app
FRONTEND_URLS=https://geni-ai-pms.vercel.app
```

---

## 📊 Complete Variables Reference Table

### All 17 Variables Summary

```
FRONTEND (4):
  1. VITE_API_URL
  2. VITE_BACKEND_URL
  3. VITE_APP_NAME
  4. VITE_VERSION

BACKEND (13):
  Database (2):
    5. MONGO_URI
    6. MONGODB_URI
  
  Security (2):
    7. JWT_SECRET
    8. NODE_ENV
  
  Google OAuth (3):
    9. GOOGLE_CLIENT_ID
   10. GOOGLE_CLIENT_SECRET
   11. GOOGLE_CALLBACK_URL
  
  Gemini AI (1):
   12. GEMINI_API_KEY
  
  Email (4):
   13. EMAIL_USER
   14. EMAIL_PASSWORD
   15. SMTP_HOST
   16. SMTP_PORT
  
  Frontend (2):
   17. FRONTEND_URL
   18. FRONTEND_URLS
```

---

## 🎯 Step-by-Step: Adding All Variables to Vercel

### Step 1: Go to Environment Variables

1. Open: https://vercel.com/dashboard
2. Click your project: `geni-ai-pms`
3. Top menu → **Settings**
4. Left sidebar → **Environment Variables**

### Step 2: Add Frontend Variables

Click "Add New" for each:

```
1. VITE_API_URL = /_/backend/api
   Environment: Production, Preview → Save

2. VITE_BACKEND_URL = /_/backend
   Environment: Production, Preview → Save

3. VITE_APP_NAME = Gen-AI Placement Management System
   Environment: Production, Preview → Save

4. VITE_VERSION = 1.0.0
   Environment: Production, Preview → Save
```

### Step 3: Add Backend Database Variables

```
5. MONGO_URI = mongodb+srv://placement_user:PASSWORD@cluster.mongodb.net/placement_db?retryWrites=true&w=majority
   Environment: Production, Preview → Save
   [Replace PASSWORD with your MongoDB password]

6. MONGODB_URI = [Same as MONGO_URI]
   Environment: Production, Preview → Save
```

### Step 4: Add Backend Security Variables

```
7. JWT_SECRET = [Your 32+ character random string]
   Environment: Production, Preview → Save

8. NODE_ENV = production
   Environment: Production, Preview → Save
```

### Step 5: Add Google OAuth Variables

```
9. GOOGLE_CLIENT_ID = [Your Client ID from Google Cloud]
   Environment: Production, Preview → Save

10. GOOGLE_CLIENT_SECRET = [Your Client Secret from Google Cloud]
    Environment: Production, Preview → Save
    ⚠️ SENSITIVE - Mark as Secret

11. GOOGLE_CALLBACK_URL = https://geni-ai-pms.vercel.app/_/backend/api/auth/google/callback
    Environment: Production, Preview → Save
```

### Step 6: Add Gemini AI Variable

```
12. GEMINI_API_KEY = [Your API key from Google AI Studio]
    Environment: Production, Preview → Save
    ⚠️ SENSITIVE - Mark as Secret
```

### Step 7: Add Email Variables

```
13. EMAIL_USER = [Your Gmail address]
    Environment: Production, Preview → Save

14. EMAIL_PASSWORD = [Your Gmail app password]
    Environment: Production, Preview → Save
    ⚠️ SENSITIVE - Mark as Secret

15. SMTP_HOST = smtp.gmail.com
    Environment: Production, Preview → Save

16. SMTP_PORT = 587
    Environment: Production, Preview → Save
```

### Step 8: Add Frontend Integration Variables

```
17. FRONTEND_URL = https://geni-ai-pms.vercel.app
    Environment: Production, Preview → Save

18. FRONTEND_URLS = https://geni-ai-pms.vercel.app
    Environment: Production, Preview → Save
```

### Step 9: Verify All Variables Added

You should see approximately **18 variables** in the list:
- 4 VITE_* (Frontend)
- 14 Backend variables

**Check that all are present!** ✅

---

## 🔐 Which Variables Are Sensitive?

Mark these as **SENSITIVE** in Vercel (they appear as dots):

- ✅ `JWT_SECRET` - Your secret key
- ✅ `GOOGLE_CLIENT_SECRET` - Google OAuth secret
- ✅ `GEMINI_API_KEY` - AI API key
- ✅ `EMAIL_PASSWORD` - Gmail app password
- ✅ `MONGO_URI` - Contains database password

Keeping sensitive variables private:
- Hides them in Vercel UI
- Prevents accidental screenshots
- Protects from exposure in logs
- Good security practice

---

## 📝 Local Development .env File

For local development, create `frontend/.env` and `backend/.env`:

### frontend/.env
```env
VITE_API_URL=http://localhost:5000/api
VITE_BACKEND_URL=http://localhost:5000
VITE_APP_NAME=Gen-AI Placement Management System (DEV)
VITE_VERSION=1.0.0-dev
```

### backend/.env
```env
MONGO_URI=mongodb+srv://placement_user:password@cluster0.xxx.mongodb.net/placement_db
MONGODB_URI=mongodb+srv://placement_user:password@cluster0.xxx.mongodb.net/placement_db
JWT_SECRET=your-dev-secret-key-minimum-32-chars
NODE_ENV=development
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
GEMINI_API_KEY=your-gemini-api-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
FRONTEND_URL=http://localhost:5173
FRONTEND_URLS=http://localhost:5173,http://localhost:3000
```

**Important:** Add `.env` to `.gitignore` so it's not committed!

```
# .gitignore
.env
.env.local
.env.*.local
```

---

## 🧪 Verifying Variables Are Set

### In Browser Console

```javascript
// Check frontend variables
console.log({
  api: import.meta.env.VITE_API_URL,
  backend: import.meta.env.VITE_BACKEND_URL,
  appName: import.meta.env.VITE_APP_NAME,
  version: import.meta.env.VITE_VERSION
});

// Output should be:
// {
//   api: "/_/backend/api",
//   backend: "/_/backend",
//   appName: "Gen-AI Placement Management System",
//   version: "1.0.0"
// }
```

### Check API Connection

```javascript
// Check if API can be reached
fetch('/_/backend/api/health')
  .then(r => r.json())
  .then(data => console.log('Backend connected:', data))
  .catch(e => console.error('Backend error:', e));

// Should output:
// Backend connected: {
//   status: "Backend is running!",
//   ai_status: "Connected to Gemini"
// }
```

---

## ✅ Pre-Deployment Checklist

Before deploying, verify:

### Frontend Variables
- [ ] `VITE_API_URL` = `/_/backend/api`
- [ ] `VITE_BACKEND_URL` = `/_/backend`
- [ ] `VITE_APP_NAME` = Your app name
- [ ] `VITE_VERSION` = Your version

### Backend Variables - Database
- [ ] `MONGO_URI` = Valid MongoDB connection
- [ ] `MONGODB_URI` = Same as MONGO_URI

### Backend Variables - Security
- [ ] `JWT_SECRET` = 32+ character random string
- [ ] `NODE_ENV` = `production`

### Backend Variables - Google
- [ ] `GOOGLE_CLIENT_ID` = Valid Client ID
- [ ] `GOOGLE_CLIENT_SECRET` = Valid Client Secret
- [ ] `GOOGLE_CALLBACK_URL` = Correct callback URL

### Backend Variables - Gemini
- [ ] `GEMINI_API_KEY` = Valid API key

### Backend Variables - Email
- [ ] `EMAIL_USER` = Your Gmail
- [ ] `EMAIL_PASSWORD` = Gmail app password (16 chars)
- [ ] `SMTP_HOST` = `smtp.gmail.com`
- [ ] `SMTP_PORT` = `587`

### Backend Variables - Frontend
- [ ] `FRONTEND_URL` = Your Vercel app URL
- [ ] `FRONTEND_URLS` = Your Vercel app URL

---

## 🚀 After Adding All Variables

1. Go to **Deployments**
2. Click the latest deployment
3. Click **Redeploy**
4. Wait 3-5 minutes
5. Verify success:
   - Frontend builds
   - Backend builds
   - Status: Ready

---

## 📱 Your Complete Deployment URLs

Once deployed, you have:

```
Frontend:        https://geni-ai-pms.vercel.app
Backend API:     https://geni-ai-pms.vercel.app/_/backend/api
Health Check:    https://geni-ai-pms.vercel.app/_/backend/api/health
Login Endpoint:  https://geni-ai-pms.vercel.app/_/backend/api/auth/login
```

---

## 🆘 Troubleshooting

### Problem: Variables not working
**Solution:** Redeploy after adding variables

### Problem: Wrong values
**Solution:** Edit variable in Vercel, it auto-redeploys

### Problem: Can't see sensitive variables
**Solution:** Click the variable to edit/view

### Problem: API calls fail
**Check:** Frontend variables are correct in browser console

---

## Summary

You now have a complete reference for:
✅ All 18 environment variables
✅ Where each one goes
✅ What each one does
✅ How to get each one
✅ How to set them in Vercel
✅ How to verify they're working

**Next Step:** Add all variables to Vercel and redeploy! 🚀
