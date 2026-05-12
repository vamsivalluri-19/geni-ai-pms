# Pre-Deployment Checklist

## Backend (Render) - Pre-Deployment Checklist

### Code Preparation
- [ ] All dependencies listed in `backend/package.json`
- [ ] `render.yaml` file exists with correct configuration
- [ ] `.env.example` has all required variables documented
- [ ] MongoDB connection string format verified
- [ ] JWT secret generated and documented
- [ ] Error handling in place for missing env variables
- [ ] Health check endpoint `/api/health` working

### Environment Variables
- [ ] `MONGO_URI` - MongoDB Atlas connection string
- [ ] `JWT_SECRET` - Strong secret key generated
- [ ] `FRONTEND_URL` - Vercel frontend URL (to be updated after deployment)
- [ ] `GOOGLE_CLIENT_ID` - From Google Cloud Console
- [ ] `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- [ ] `GOOGLE_CALLBACK_URL` - Will update to `https://[your-render-url]/api/oauth/google/callback`
- [ ] `GEMINI_API_KEY` - From Google AI Studio
- [ ] `EMAIL_USER` - Email for sending notifications
- [ ] `EMAIL_PASSWORD` - Gmail app password (NOT regular password)
- [ ] `SMTP_HOST` - Email provider SMTP host
- [ ] `SMTP_PORT` - Email provider SMTP port
- [ ] `NODE_ENV` - Set to `production`
- [ ] `PORT` - Leave empty or set to 10000 (Render manages this)

### Database Setup
- [ ] MongoDB Atlas account created
- [ ] Cluster created
- [ ] Database user created
- [ ] Network access configured (allow all for dev: 0.0.0.0/0)
- [ ] Connection string copied
- [ ] Test connection locally with MongoDB Compass
- [ ] Collections indexed properly for performance

### Security
- [ ] `.env` file in `.gitignore`
- [ ] No sensitive data in code
- [ ] CORS properly configured
- [ ] JWT secret is strong (minimum 32 characters)
- [ ] Email password is app-specific (not account password)
- [ ] Database credentials rotated before deployment

### Testing
- [ ] `npm install` runs without errors
- [ ] `node server.js` starts successfully
- [ ] Health check endpoint responds: `GET /api/health`
- [ ] Database connects successfully
- [ ] All routes are accessible
- [ ] CORS allows Vercel origin
- [ ] Error handling works
- [ ] Logging is functional

---

## Frontend (Vercel) - Pre-Deployment Checklist

### Code Preparation
- [ ] `vercel.json` file exists with correct configuration
- [ ] `.env.example` has backend URL documented
- [ ] Build command `npm run build` works locally
- [ ] Output directory is `dist`
- [ ] `vite.config.js` properly configured
- [ ] No console errors or warnings
- [ ] All pages route correctly
- [ ] Static assets load correctly

### Environment Variables
- [ ] `VITE_API_URL` - Backend API endpoint (e.g., `https://backend.onrender.com/api`)
- [ ] `VITE_BACKEND_URL` - Backend base URL (e.g., `https://backend.onrender.com`)
- [ ] Both variables use HTTPS for production

### Assets & Configuration
- [ ] All images optimized
- [ ] Unused dependencies removed
- [ ] Build size reasonable
- [ ] Source maps configured for debugging
- [ ] Favicon set up
- [ ] Meta tags configured

### Authentication
- [ ] Login page works
- [ ] Google OAuth configured
- [ ] Token storage working
- [ ] Logout clears tokens
- [ ] Protected routes redirect to login
- [ ] Session persistence working

### API Integration
- [ ] API calls use correct base URL from config
- [ ] Error handling for failed requests
- [ ] Loading states implemented
- [ ] Timeout handling
- [ ] Network error recovery

### Performance
- [ ] Lazy loading implemented
- [ ] Code splitting working
- [ ] Bundle size optimized
- [ ] Images optimized/lazy loaded
- [ ] CSS minified
- [ ] JavaScript minified

### Testing
- [ ] `npm install` runs without errors
- [ ] `npm run build` completes successfully
- [ ] Build output in `dist` folder
- [ ] `npm run preview` works locally
- [ ] All pages load in preview mode
- [ ] API calls work in preview
- [ ] No mixed content warnings (all HTTPS)

---

## Deployment Process Checklist

### Create Backend on Render
- [ ] Create Render account
- [ ] Create new Web Service
- [ ] Connect GitHub repository
- [ ] Select backend folder
- [ ] Set build command: `npm install`
- [ ] Set start command: `node server.js`
- [ ] Add all environment variables
- [ ] Deploy
- [ ] Copy backend URL (e.g., `https://your-app.onrender.com`)
- [ ] Test health endpoint
- [ ] Verify in logs - no errors

### Create Frontend on Vercel
- [ ] Create Vercel account
- [ ] Import GitHub repository
- [ ] Select frontend folder
- [ ] Set build command: `npm run build`
- [ ] Set output directory: `dist`
- [ ] Add environment variables:
  - `VITE_API_URL=https://your-backend.onrender.com/api`
  - `VITE_BACKEND_URL=https://your-backend.onrender.com`
- [ ] Deploy
- [ ] Copy frontend URL (e.g., `https://your-app.vercel.app`)
- [ ] Test application loads
- [ ] Verify in logs - no errors

### Post-Deployment
- [ ] Update Google OAuth callback URL to Render backend
- [ ] Update `FRONTEND_URL` in backend to Vercel frontend
- [ ] Restart backend service
- [ ] Test full login flow
- [ ] Test email notifications
- [ ] Test file uploads (if applicable)
- [ ] Test Socket.IO connections (if applicable)
- [ ] Monitor logs for errors

---

## Common Issues & Fixes

### Backend Won't Start
- Check `render.yaml` syntax
- Verify environment variables are set
- Check MongoDB connection string
- Review server logs in Render dashboard

### Frontend Can't Connect to Backend
- Verify `VITE_BACKEND_URL` is correct
- Check backend is running (`/api/health`)
- Verify CORS is allowing frontend origin
- Check browser console for specific errors

### Build Fails on Vercel
- Check `npm run build` works locally
- Verify all dependencies in `package.json`
- Check for missing environment variables
- Review Vercel build logs for errors

### Database Connection Fails
- Verify MongoDB Atlas connection string
- Check network access in MongoDB Atlas
- Confirm username/password are correct
- Try connecting with MongoDB Compass

### Email Not Sending
- Verify email provider settings
- Use Gmail app password (not regular password)
- Check SMTP host and port
- Verify EMAIL_USER environment variable

---

## Monitoring After Deployment

### Backend Monitoring
- [ ] Set up error logging
- [ ] Monitor CPU usage
- [ ] Monitor memory usage
- [ ] Check database connection pool
- [ ] Review API response times

### Frontend Monitoring
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Monitor performance metrics
- [ ] Check Core Web Vitals
- [ ] Review user error reports

---

## Rollback Plan

### If Backend Fails
1. Check Render logs for errors
2. Verify environment variables
3. Rollback to previous deployment (Render history)
4. Check GitHub for committed changes

### If Frontend Fails
1. Check Vercel logs for errors
2. Rebuild with debug mode
3. Rollback to previous deployment (Vercel history)
4. Check GitHub for committed changes

---

## Success Criteria

- [ ] Backend responds to health check
- [ ] Frontend loads without errors
- [ ] Login/logout flow works
- [ ] API calls succeed
- [ ] Database operations work
- [ ] Email notifications send
- [ ] No CORS errors
- [ ] No console errors
- [ ] Performance is acceptable
- [ ] All features functional
