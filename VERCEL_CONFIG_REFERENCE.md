# Vercel Dashboard - Configuration Reference

## 🎯 Exact Values to Enter

Copy these exact values into Vercel Dashboard to avoid mistakes.

---

## 📍 Step 1: Import Repository

```
GitHub Repository URL:
https://github.com/vamsivalluri-19/geni-ai-pms

Select Branch: main
```

---

## 🏗️ Step 2: Build Settings

**Framework Preset:**
```
Vite
```

**Root Directory:**
```
frontend
```
⚠️ **CRITICAL**: Must be `frontend`, NOT `.` or `/`

**Build Command:**
```
npm run build
```

**Output Directory:**
```
dist
```

**Install Command:**
```
npm install
```

---

## 🔐 Step 3: Environment Variables

### Variable 1
```
Key:   VITE_API_URL
Value: https://geni-ai-pms.onrender.com/api

Environment: Production
Environment: Preview
```

### Variable 2
```
Key:   VITE_BACKEND_URL
Value: https://geni-ai-pms.onrender.com

Environment: Production
Environment: Preview
```

---

## 📊 Configuration Summary

| Field | Value |
|-------|-------|
| **GitHub Repo** | vamsivalluri-19/geni-ai-pms |
| **Branch** | main |
| **Project Name** | placement-management-system |
| **Framework** | Vite |
| **Root Directory** | frontend |
| **Build Command** | npm run build |
| **Output Directory** | dist |
| **Install Command** | npm install |
| **VITE_API_URL** | https://geni-ai-pms.onrender.com/api |
| **VITE_BACKEND_URL** | https://geni-ai-pms.onrender.com |

---

## ✅ Before Clicking "Deploy"

- [ ] All values match above table
- [ ] Root directory is `frontend`
- [ ] Both environment variables set for Production AND Preview
- [ ] Backend URL points to: https://geni-ai-pms.onrender.com
- [ ] Render backend is currently running

---

## 🚀 After Clicking "Deploy"

1. **Waiting**: Build will take 2-3 minutes
2. **Status**: Watch for ✅ "Ready" status
3. **Success**: Visit your live URL (provided by Vercel)
4. **Test**: Verify app loads and can connect to backend

---

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **Build Issues**: Check Vercel deployment logs
- **API Issues**: Verify backend at https://geni-ai-pms.onrender.com is running

---

**All configurations are ready. You can now deploy!**
