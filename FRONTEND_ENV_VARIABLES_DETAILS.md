# Vercel Frontend Environment Variables - Complete Details

## Overview

These are the **4 frontend environment variables** you need to set in Vercel for your Vite application to work with the backend deployed on the same Vercel project.

```
VITE_API_URL = /_/backend/api
VITE_BACKEND_URL = /_/backend
VITE_APP_NAME = Gen-AI Placement Management System
VITE_VERSION = 1.0.0
```

---

## 1️⃣ VITE_API_URL = `/_/backend/api`

### What is it?
The **base URL for all API calls** from your frontend to the backend.

### Where it's used
In `frontend/src/config/apiBase.js`:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL;
```

And in `frontend/src/services/api.js`:
```javascript
const api = axios.create({
  baseURL: API_BASE_URL,  // This uses VITE_API_URL
  headers: {
    "Content-Type": "application/json",
  },
});
```

### The Route Prefix: `/_/backend`
- `/_/backend` is the route prefix Vercel gives to your backend service
- `/api` is your actual API path
- Combined: `/_/backend/api`

### Examples of API Calls

**Local Development (localhost):**
```
VITE_API_URL = http://localhost:5000/api

Frontend calls:  /auth/login
Actual request:  http://localhost:5000/api/auth/login
```

**Vercel Multi-Service (Production):**
```
VITE_API_URL = /_/backend/api

Frontend calls:  /auth/login
Actual request:  https://geni-ai-pms.vercel.app/_/backend/api/auth/login
```

### How It Works

1. Frontend makes API call:
   ```javascript
   api.post('/auth/login', { email, password })
   ```

2. Axios prepends the `baseURL`:
   ```
   POST /_/backend/api/auth/login
   ```

3. Vercel routes to backend:
   ```
   https://geni-ai-pms.vercel.app/_/backend/api/auth/login
   ↓ (Vercel routing)
   Backend service receives: /api/auth/login
   ```

### Why Use Route Prefix?
- ✅ Backend and frontend on same domain (no CORS issues)
- ✅ Automatic CORS handling for same-domain requests
- ✅ Easier to manage (single deployment)
- ✅ Better performance (no cross-origin overhead)

### Value for Different Environments

| Environment | VITE_API_URL | Notes |
|-------------|--------------|-------|
| Local Dev | `http://localhost:5000/api` | Your local backend |
| Local Dev with Vercel | `/_/backend/api` | Simulating production |
| Production (Vercel) | `/_/backend/api` | Vercel multi-service |
| Production (Render) | `https://your-backend.onrender.com/api` | Separate backend |

---

## 2️⃣ VITE_BACKEND_URL = `/_/backend`

### What is it?
The **base URL of your backend** (without the `/api` path).

### Where it's used
Used for:
- **Socket.IO connections** (real-time features)
- **WebSocket connections**
- **File upload endpoints**
- **Direct backend service references**

### Difference from VITE_API_URL

```
VITE_BACKEND_URL  = /_/backend          (Backend service base)
VITE_API_URL      = /_/backend/api      (REST API endpoint)
```

### Examples of Usage

**Socket.IO Connection:**
```javascript
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  reconnection: true,
  reconnectionDelay: 1000,
});

// Connects to: /_/backend (which Vercel routes to backend service)
```

**File Upload:**
```javascript
const formData = new FormData();
formData.append('file', file);

fetch(`${import.meta.env.VITE_BACKEND_URL}/upload`, {
  method: 'POST',
  body: formData,
});

// Requests: /_/backend/upload
```

### Route Breakdown

**Complete Backend URL:**
```
https://geni-ai-pms.vercel.app/_/backend
           ↑                       ↑
      Your domain          Vercel route prefix
```

**Path structure:**
```
https://geni-ai-pms.vercel.app
├── /                          ← Frontend (Vite app)
└── /_/backend                 ← Backend (Express server)
    ├── /api                   ← REST API
    ├── /socket.io             ← WebSocket
    ├── /uploads               ← File uploads
    └── /health                ← Health check
```

### Value for Different Environments

| Environment | VITE_BACKEND_URL | Used for |
|-------------|------------------|----------|
| Local Dev | `http://localhost:5000` | Direct backend access |
| Vercel | `/_/backend` | Route prefix in multi-service |
| Render | `https://your-backend.onrender.com` | External backend URL |

---

## 3️⃣ VITE_APP_NAME = `Gen-AI Placement Management System`

### What is it?
A **display name** for your application used in the UI.

### Where it's used
In `frontend/src/components/` and throughout the UI:
```javascript
import { VITE_APP_NAME } from '../config/constants';

// Display in header
<h1>{import.meta.env.VITE_APP_NAME}</h1>

// Display in page title
document.title = import.meta.env.VITE_APP_NAME;

// Display in footer
<footer>{import.meta.env.VITE_APP_NAME} © 2024</footer>
```

### Examples

**In Page Title:**
```html
<title>Gen-AI Placement Management System</title>
```

**In Header:**
```
┌─────────────────────────────────────────────┐
│ Gen-AI Placement Management System    [Menu]│
├─────────────────────────────────────────────┤
│ Welcome to the Placement System              │
└─────────────────────────────────────────────┘
```

**In Emails/Notifications:**
```
Subject: Your Gen-AI Placement Management System Account
```

### Customization

You can change this to:
- `Placement Portal`
- `Campus Recruitment System`
- `Job Placement Hub`
- Any name you prefer

### Build-time Substitution

Vite replaces all occurrences of `import.meta.env.VITE_APP_NAME` during the build:

```javascript
// Before build (in source code)
<h1>{import.meta.env.VITE_APP_NAME}</h1>

// After build (in dist/index.html)
<h1>Gen-AI Placement Management System</h1>
```

---

## 4️⃣ VITE_VERSION = `1.0.0`

### What is it?
The **application version** number for tracking releases and debugging.

### Where it's used
In:
- **Error reporting** - Which version had the bug?
- **Logging** - What version generated this log?
- **UI footer** - Display version to users
- **API calls** - Send version to backend for analytics

### Examples

**Display in Footer:**
```
┌─────────────────────────────────────────┐
│ Gen-AI Placement Management System v1.0.0
│ © 2024 - All Rights Reserved             │
└─────────────────────────────────────────┘
```

**In Browser Console:**
```javascript
console.log(`App Version: ${import.meta.env.VITE_VERSION}`);
// Output: App Version: 1.0.0
```

**In Error Reporting:**
```javascript
Sentry.captureException(error, {
  tags: {
    version: import.meta.env.VITE_VERSION,
    environment: 'production'
  }
});

// Sentry now knows: "This error occurred in v1.0.0"
```

**Send to Backend:**
```javascript
api.post('/analytics', {
  version: import.meta.env.VITE_VERSION,
  action: 'page_view',
  page: 'dashboard'
});
```

### Version Format: Semantic Versioning

```
VITE_VERSION = X.Y.Z

X = Major version (breaking changes)
Y = Minor version (new features, backwards compatible)
Z = Patch version (bug fixes)

Examples:
1.0.0 = First release
1.1.0 = Added new features
1.1.1 = Bug fix
2.0.0 = Major breaking changes
```

### When to Update Version

- **v1.0.0** → First production release
- **v1.1.0** → Add new features (signup improvements)
- **v1.1.1** → Fix a bug (login not working)
- **v1.2.0** → Add dashboard improvements
- **v2.0.0** → Major redesign or breaking changes

---

## Complete Environment Variables Configuration

### In Vercel Dashboard

1. Go to: **Project Settings** → **Environment Variables**

2. Add 4 variables with these exact values:

```
┌─────────────────────────────────────────────────────────────┐
│ Key: VITE_API_URL                                           │
│ Value: /_/backend/api                                       │
│ Environments: Production, Preview                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Key: VITE_BACKEND_URL                                       │
│ Value: /_/backend                                           │
│ Environments: Production, Preview                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Key: VITE_APP_NAME                                          │
│ Value: Gen-AI Placement Management System                   │
│ Environments: Production, Preview                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Key: VITE_VERSION                                           │
│ Value: 1.0.0                                                │
│ Environments: Production, Preview                           │
└─────────────────────────────────────────────────────────────┘
```

3. For each, select: **Production and Preview**
4. Click **Save**

---

## How They Work Together

### Request Flow Example

```
User visits: https://geni-ai-pms.vercel.app
       ↓
Vite loads environment variables:
  VITE_API_URL = /_/backend/api
  VITE_BACKEND_URL = /_/backend
  VITE_APP_NAME = Gen-AI Placement Management System
  VITE_VERSION = 1.0.0
       ↓
Frontend displays:
  Page title: "Gen-AI Placement Management System"
  Header: "Gen-AI Placement Management System"
  Console: "App Version: 1.0.0"
       ↓
User clicks "Login"
       ↓
Frontend makes API call:
  POST /_/backend/api/auth/login
  (using VITE_API_URL)
       ↓
Vercel routes to backend service:
  Backend receives: POST /api/auth/login
       ↓
Backend processes and responds ✅
```

---

## Local Development vs Production

### Local Development (.env file)

```env
VITE_API_URL=http://localhost:5000/api
VITE_BACKEND_URL=http://localhost:5000
VITE_APP_NAME=Gen-AI Placement Management System (DEV)
VITE_VERSION=1.0.0-dev
```

### Production (Vercel Environment Variables)

```env
VITE_API_URL=/_/backend/api
VITE_BACKEND_URL=/_/backend
VITE_APP_NAME=Gen-AI Placement Management System
VITE_VERSION=1.0.0
```

### Running Local Preview (simulating Vercel)

```bash
# Build with production variables
npm run build

# Preview with production variables
npm run preview

# Frontend will be at: http://localhost:4173
# API calls go to: /_/backend/api (won't work locally without backend running at root)
```

---

## Accessing Variables in Your Code

### In React Components

```javascript
// Method 1: Direct access
const apiUrl = import.meta.env.VITE_API_URL;

// Method 2: With fallback
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Method 3: In config file
// frontend/src/config/apiBase.js
export const API_BASE_URL = import.meta.env.VITE_API_URL;
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const APP_NAME = import.meta.env.VITE_APP_NAME;
export const APP_VERSION = import.meta.env.VITE_VERSION;

// Then import in components
import { API_BASE_URL } from '../config/apiBase';
```

### In HTML

```html
<!DOCTYPE html>
<html>
  <head>
    <title>%VITE_APP_NAME% v%VITE_VERSION%</title>
  </head>
</html>
```

### In Build Output

Vite replaces these at build time, so the final `dist/index.html` contains the actual values:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Gen-AI Placement Management System v1.0.0</title>
  </head>
</html>
```

---

## Best Practices

### ✅ DO

- ✅ Use Vercel environment variables for production
- ✅ Use `.env.local` for local development (git ignored)
- ✅ Use `.env.production` for fallback production values
- ✅ Keep version updated with releases
- ✅ Use semantic versioning (MAJOR.MINOR.PATCH)
- ✅ Use environment variables in config files, not scattered in code

### ❌ DON'T

- ❌ Hardcode URLs in components
- ❌ Commit `.env` files with real values to GitHub
- ❌ Use different values for same variable
- ❌ Forget to update version when deploying

---

## Common Issues & Solutions

### Issue: API calls return 404

**Problem:** `VITE_API_URL` is wrong

**Check:**
```javascript
// In browser console
console.log(import.meta.env.VITE_API_URL);
// Should output: /_/backend/api
```

**Solution:**
1. Go to Vercel → Environment Variables
2. Verify: `VITE_API_URL = /_/backend/api`
3. Redeploy

---

### Issue: WebSocket connection fails

**Problem:** `VITE_BACKEND_URL` is wrong

**Check:**
```javascript
// In browser console
console.log(import.meta.env.VITE_BACKEND_URL);
// Should output: /_/backend
```

**Solution:**
1. Go to Vercel → Environment Variables
2. Verify: `VITE_BACKEND_URL = /_/backend`
3. Redeploy

---

### Issue: Wrong app name displays

**Problem:** `VITE_APP_NAME` is outdated

**Solution:**
1. Update `VITE_APP_NAME` in Vercel
2. Redeploy

---

### Issue: Version not updating in UI

**Problem:** Browser cached old version

**Solution:**
1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Or manually update `VITE_VERSION` and redeploy

---

## Summary Table

| Variable | Value | Purpose | Used For |
|----------|-------|---------|----------|
| **VITE_API_URL** | `/_/backend/api` | API endpoint | REST API calls |
| **VITE_BACKEND_URL** | `/_/backend` | Backend service | WebSocket, file uploads |
| **VITE_APP_NAME** | `Gen-AI Placement...` | Display name | UI, titles, headers |
| **VITE_VERSION** | `1.0.0` | Release version | Logging, error tracking |

---

## Next Steps

1. ✅ Understand each variable (you are here)
2. ✅ Add them to Vercel: Settings → Environment Variables
3. ✅ Redeploy your application
4. ✅ Verify they're working in browser console
5. ✅ Test API calls and features

---

**These 4 environment variables are essential for your Vercel multi-service deployment!** 🚀
