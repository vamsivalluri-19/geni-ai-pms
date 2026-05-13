# Google OAuth Fix - Step by Step

## ❌ Current Problem

You're getting `"error": "invalid_client"` which means:
- The `GOOGLE_CLIENT_SECRET` in Vercel environment variables is either **missing, incorrect, or mismatched** with the `GOOGLE_CLIENT_ID`
- OR the redirect URI registered in Google Cloud doesn't match what backend is sending

---

## ✅ Solution - 4 Steps

### Step 1: Verify Google Cloud Console Setup

1. Go to: https://console.cloud.google.com
2. Select your project: **"Gen AI Placement"**
3. Left sidebar → **Credentials**
4. Find your OAuth 2.0 Client ID (should say "Web application")
5. Click on it to view details

**Check these values are correct:**
- ✅ Application type: **Web application**
- ✅ **Authorized JavaScript Origins:**
  - `https://geni-ai-pms.vercel.app`
  - `http://localhost:5173`
- ✅ **Authorized Redirect URIs:**
  - `https://geni-ai-pms.vercel.app/_/backend/api/auth/google/callback`
  - `http://localhost:5001/api/auth/google/callback`

**If any URLs are missing:**
1. Click "Edit"
2. Add the missing URIs
3. Click "Save"

---

### Step 2: Get Fresh Credentials

Since the client secret is invalid, regenerate it:

1. In the OAuth 2.0 Client ID details page, click **"Reset Secret"** (or delete and recreate)
2. You'll get a **new Client ID** and **new Client Secret**
3. **Copy both immediately and save them safely** (you won't see the secret again)

---

### Step 3: Set Environment Variables in Vercel

1. Go to: https://vercel.com
2. Open your project: **geni-ai-pms**
3. Click **Settings** (top menu)
4. Left sidebar → **Environment Variables**
5. **For each variable, select: ☑ Production  ☑ Preview**

**Add/Update these Google OAuth variables:**

| Variable | Value | Notes |
|----------|-------|-------|
| `GOOGLE_CLIENT_ID` | Your new Client ID from Google Cloud | Example: `123456789-abc123def456.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Your new Client Secret from Google Cloud | Example: `GOCSPX-abc123def456ghi789` |
| `GOOGLE_CALLBACK_URL` | `https://geni-ai-pms.vercel.app/_/backend/api/auth/google/callback` | Must match Google Console exactly |
| `GOOGLE_REDIRECT_URI` | `https://geni-ai-pms.vercel.app/_/backend/api/auth/google/callback` | Backup redirect URI |

**Step-by-step for each variable:**
1. Click "Add New"
2. Key: `GOOGLE_CLIENT_ID`
3. Value: Paste your Client ID
4. Select: ☑ Production  ☑ Preview
5. Click "Save"
6. Repeat for other variables

---

### Step 4: Redeploy

1. Go to **Deployments** tab in Vercel
2. Click the 3-dot menu on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to finish (2-3 min)

---

## 🧪 Test the Fix

1. Open your deployed app: https://geni-ai-pms.vercel.app
2. Click **"Login with Google"**
3. Select a Google account
4. Check if login succeeds

---

## 🔍 Troubleshooting

### Still getting "invalid_client"?

**Check 1: Client ID & Secret Mismatch**
- Go back to Google Cloud Console
- Delete the OAuth credential
- Create a NEW one
- Copy BOTH Client ID and Secret immediately
- Add BOTH to Vercel
- Redeploy

**Check 2: Redirect URI Mismatch**
- In Google Console, see exactly what redirect URIs are registered
- In [backend/routes/authOAuth.js](backend/routes/authOAuth.js), line ~258, it constructs the redirect URI as:
  ```
  `${backendBaseUrl}/api/auth/google/callback`
  ```
- Make sure this exact URL is in Google Console's "Authorized Redirect URIs"

**Check 3: Environment Variables Not Set**
- In Vercel Dashboard → Deployments
- Click your latest deployment
- Click "Inspect" 
- Check if all Google variables are showing (they might show as hidden for security)

### Redirect loop or "callback not working"?

This means authentication succeeded but redirect failed:
1. Check `FRONTEND_URL` is set correctly in Vercel
2. Make sure frontend is deployed to: https://geni-ai-pms.vercel.app
3. Frontend should show the success message after OAuth completes

---

## 📋 Verification Checklist

Before testing:
- [ ] Google Client ID pasted in Vercel (starts with numbers and ends with `.apps.googleusercontent.com`)
- [ ] Google Client Secret pasted in Vercel (starts with `GOCSPX-`)
- [ ] Redirect URL in Google Console contains: `/api/auth/google/callback`
- [ ] Redirect URL matches Vercel `GOOGLE_CALLBACK_URL` exactly
- [ ] All variables set to ☑ Production  ☑ Preview
- [ ] Vercel project redeployed after setting variables

---

## 🆘 Still Not Working?

Run these checks:

**1. Check backend logs:**
```bash
# In Vercel Deployments → select deployment → Logs
# Look for: "Google OAuth callback error"
```

**2. Check frontend logs (browser console):**
- Press F12 → Console tab
- Look for network errors in the fetch calls
- Check if the OAuth redirect is happening

**3. Verify local testing (if running locally):**
- Create `.env` file in backend folder with:
  ```
  GOOGLE_CLIENT_ID=your-client-id
  GOOGLE_CLIENT_SECRET=your-client-secret
  GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback
  ```
- Restart backend: `npm run dev`
- Test at http://localhost:5173
