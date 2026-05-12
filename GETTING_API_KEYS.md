# Getting API Keys - Detailed Instructions

Complete guide to obtain all required API keys for Vercel deployment.

## 1️⃣ MongoDB Connection String

### Step 1: Create MongoDB Atlas Account
1. Go to: https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Choose sign-up method (Email/Google/GitHub)
4. Complete registration

### Step 2: Create Cluster
1. Click "Build a Database"
2. Choose "Shared" (Free tier)
3. Select:
   - Cloud Provider: **AWS**
   - Region: **us-east-1** (or nearest to you)
   - Cluster Tier: **M0 (Free)**
4. Click "Create Cluster"
5. Wait 2-3 minutes

### Step 3: Create Database User
1. Left sidebar → "Database Access"
2. Click "Add New Database User"
3. Username: `placement_user`
4. Click "Auto-generate password"
5. **Copy and save the password** (you won't see it again)
6. Click "Add User"

### Step 4: Allow Network Access
1. Left sidebar → "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (adds 0.0.0.0/0)
4. Click "Confirm"

### Step 5: Get Connection String
1. Go back to "Database"
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. **Replace in the string:**
   - `<username>` → `placement_user`
   - `<password>` → Your copied password
   - `myFirstDatabase` → `placement_db`

**Example Result:**
```
mongodb+srv://placement_user:MyPassword123@cluster0.abc123.mongodb.net/placement_db?retryWrites=true&w=majority
```

✅ **Save this connection string for Vercel**

---

## 2️⃣ Google OAuth Credentials

### Step 1: Go to Google Cloud Console
1. Open: https://console.cloud.google.com
2. Sign in with your Google account

### Step 2: Create New Project
1. At top, click "Select a Project"
2. Click "New Project"
3. Project name: `Gen AI Placement`
4. Click "Create"
5. Wait for project to load

### Step 3: Enable Google+ API
1. At top, search for "Google+ API"
2. Click "Google+ API" in results
3. Click "Enable" button
4. Wait for enabling to complete

### Step 4: Create OAuth Consent Screen
1. Left sidebar → "Credentials"
2. At top, click "Create Credentials" → "OAuth 2.0 Client ID"
3. If asked to configure consent screen:
   - Choose "External"
   - Click "Create"
   - Fill in:
     - App name: `Gen AI Placement System`
     - User support email: Your email
     - Developer contact: Your email
   - Click "Save and Continue"
   - For scopes, click "Save and Continue" (skip optional scopes)
   - Click "Back to Dashboard"

### Step 5: Create OAuth Client ID
1. Click "Create Credentials" → "OAuth 2.0 Client ID"
2. Application type: **Web application**
3. Name: `Vercel Deployment`
4. **Authorized JavaScript Origins:**
   - Click "Add URI"
   - Enter: `https://geni-ai-pms.vercel.app`
   - Click "Add URI"
   - Enter: `http://localhost:5173`
5. **Authorized Redirect URIs:**
   - Click "Add URI"
   - Enter: `https://geni-ai-pms.vercel.app/_/backend/api/oauth/google/callback`
   - Click "Add URI"
   - Enter: `http://localhost:5000/api/oauth/google/callback`
6. Click "Create"

### Step 6: Copy Credentials
You'll see a popup with:
- **Client ID** (looks like: `123456789-abc123def456.apps.googleusercontent.com`)
- **Client Secret** (looks like: `GOCSPX-abc123def456ghi789`)

✅ **Copy and save both for Vercel**

---

## 3️⃣ Gemini API Key

### Step 1: Go to Google AI Studio
1. Open: https://ai.google.dev/tutorials/setup
2. Sign in with your Google account (same account as Google Cloud)

### Step 2: Get API Key
1. Click "Get API Key"
2. Click "Create API Key"
3. Your key is displayed (looks like: `AIzaSyD_abc123def456ghi789jkl012MNO`)

### Step 3: Copy API Key
- Click the copy button or select the full key
- Paste somewhere safe

✅ **Save this for Vercel**

---

## 4️⃣ Gmail App Password

### Step 1: Enable 2-Factor Authentication
1. Go to: https://myaccount.google.com
2. Left sidebar → "Security"
3. Scroll down to "2-Step Verification"
4. Click and follow the setup process
5. Verify your phone number
6. Verify with authenticator app or SMS

### Step 2: Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
2. **Select app:** Mail
3. **Select device:** Windows PC (or your device)
4. Click "Generate"
5. You'll see: **16-character password** (like: `xxxx xxxx xxxx xxxx`)

### Step 3: Copy App Password
- This password appears only once
- **Copy immediately and paste into Vercel**
- Format: `abcd efgh ijkl mnop` (with spaces)

✅ **Save this for Vercel**

---

## 5️⃣ JWT Secret

### Generate JWT Secret
You need a random 32+ character string.

**Option 1: Use Online Generator**
1. Open: https://www.random.org/strings/
2. Settings:
   - Num strings: 1
   - Length: 32-64 characters
   - Characters to use: Letters, Digits, Symbols
3. Click "Get Strings"
4. Copy the generated string

**Option 2: Generate Locally**
```bash
# On Windows PowerShell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((1..32 | ForEach-Object {[char](Get-Random -Minimum 33 -Maximum 126)}))) 

# Or just use any random string like:
aB3xY9kL2mN4qP6rS8tU0vW1xY2zA3bC4dE5fG6hI7jK8lM9nO0pQ1rS2tU3vW4xY5z
```

✅ **Save this for Vercel**

---

## Summary: API Keys Checklist

After completing all steps, you should have:

- [ ] **MongoDB Connection String**
  - Format: `mongodb+srv://user:password@cluster.xxx.mongodb.net/db`
  - Contains your username and password

- [ ] **Google OAuth Client ID**
  - Format: `xxx.apps.googleusercontent.com`
  - From Google Cloud Console

- [ ] **Google OAuth Client Secret**
  - Format: `GOCSPX-xxx`
  - From Google Cloud Console
  - Keep this secret! Never share!

- [ ] **Gemini API Key**
  - Format: `AIzaSy...`
  - From Google AI Studio

- [ ] **Gmail App Password**
  - Format: `xxxx xxxx xxxx xxxx` (16 chars with spaces)
  - From Gmail settings
  - Not your regular Gmail password

- [ ] **JWT Secret**
  - 32+ characters random string
  - Generated from random.org or local command

---

## ⚠️ Security Notes

**NEVER:**
- Share your API keys on GitHub
- Post keys in public forums
- Commit .env files with real keys
- Share screenshots with keys visible

**DO:**
- Keep keys in .env.local (not committed)
- Store in Vercel environment variables
- Regenerate if accidentally exposed
- Use different keys for dev vs production

---

## Testing API Keys

### Test MongoDB Connection
1. Download MongoDB Compass: https://www.mongodb.com/products/compass
2. Paste connection string into Compass
3. Should connect successfully

### Test Google OAuth
1. Visit Google Cloud Console
2. Verify redirect URIs are correct
3. Test OAuth flow in your app

### Test Gmail Settings
1. Try sending test email from your app
2. Should arrive in inbox
3. Check spam folder if not found

### Test Gemini API
1. Use curl to test:
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Hello!"}]}]}'
```

---

## Next Steps

1. ✅ Gather all API keys (this page)
2. ✅ Follow [VERCEL_DEPLOYMENT_STEP_BY_STEP.md](VERCEL_DEPLOYMENT_STEP_BY_STEP.md)
3. ✅ Add environment variables in Vercel
4. ✅ Deploy your application

---

**All set! You now have all the API keys needed for deployment.** 🎉
