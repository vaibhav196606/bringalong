# 🚀 Production Deployment Checklist

## Pre-Deployment Setup

### 1. Gmail Setup for Email Service
- [ ] Enable 2-Factor Authentication on Gmail account
- [ ] Generate Gmail App Password:
  - Go to Google Account → Security → 2-Step Verification → App passwords
  - Select "Mail" and generate password
  - Copy the 16-character password (remove spaces)

### 2. Railway Backend Deployment

#### Environment Variables to Set:
```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters
FRONTEND_URL=https://your-app.vercel.app
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=BringAlong <your-gmail@gmail.com>
CORS_ORIGIN=https://your-app.vercel.app
PORT=5000
```

#### Steps:
- [ ] Connect GitHub repository to Railway
- [ ] Set all environment variables above
- [ ] Deploy and get Railway URL (e.g., `https://your-app.railway.app`)

### 3. Vercel Frontend Deployment

#### Environment Variables to Set:
```bash
VITE_API_BASE_URL=https://your-railway-app.railway.app/api
```

#### Steps:
- [ ] Connect GitHub repository to Vercel
- [ ] Set environment variable above
- [ ] Deploy and get Vercel URL (e.g., `https://your-app.vercel.app`)

### 4. Update Railway with Vercel URL
- [ ] Update `FRONTEND_URL` in Railway with your actual Vercel URL
- [ ] Update `CORS_ORIGIN` in Railway with your actual Vercel URL
- [ ] Redeploy Railway service

## Testing Checklist

### 1. Basic Functionality
- [ ] Frontend loads without errors
- [ ] Backend API endpoints responding
- [ ] User registration works
- [ ] User login works
- [ ] CORS is configured correctly (no CORS errors in browser)

### 2. Email Functionality
- [ ] Navigate to forgot password page
- [ ] Enter valid email address
- [ ] Check email delivery (including spam folder)
- [ ] Email contains correct reset link
- [ ] Reset link redirects to correct domain
- [ ] Password reset completes successfully
- [ ] Can login with new password

### 3. Error Handling
- [ ] Invalid email shows appropriate message
- [ ] Expired token shows error message
- [ ] Invalid token shows error message
- [ ] Network errors handled gracefully

## Post-Deployment Monitoring

### Railway Logs to Monitor:
- [ ] Email service initialization success
- [ ] Password reset email sending success/failure
- [ ] CORS errors
- [ ] Database connection errors
- [ ] Authentication errors

### Vercel Logs to Monitor:
- [ ] Build success
- [ ] API connection errors
- [ ] Frontend routing errors

## Security Verification

- [ ] JWT secret is strong (32+ characters)
- [ ] Database credentials are secure
- [ ] Email credentials are secure
- [ ] CORS is restricted to your domain only
- [ ] No sensitive data in logs
- [ ] HTTPS enforced on both domains

## Backup & Recovery

- [ ] Document all environment variables
- [ ] Test password reset for admin accounts
- [ ] Verify database backups
- [ ] Document rollback procedures

## Domain Configuration (Optional)

If using custom domain:
- [ ] Configure custom domain in Vercel
- [ ] Update FRONTEND_URL and CORS_ORIGIN
- [ ] Update email templates with custom domain
- [ ] SSL certificate active

## Performance Optimization

- [ ] Enable caching where appropriate
- [ ] Monitor email delivery times
- [ ] Monitor API response times
- [ ] Set up error tracking (e.g., Sentry)

## Troubleshooting Guide

### Email not sending:
1. Check Railway logs for email errors
2. Verify Gmail app password
3. Test email service separately
4. Check spam folder

### CORS errors:
1. Verify FRONTEND_URL matches Vercel domain exactly
2. Check CORS_ORIGIN includes https://
3. Clear browser cache
4. Check browser developer tools

### Reset links not working:
1. Verify FRONTEND_URL in Railway
2. Check token expiration (10 minutes)
3. Verify frontend routes configured
4. Test with fresh token

## Success Criteria

✅ **Deployment is successful when:**
- [ ] Users can register and login
- [ ] Forgot password sends emails successfully
- [ ] Reset links work correctly
- [ ] All functions work on production domains
- [ ] No CORS or authentication errors
- [ ] Email delivery is reliable
