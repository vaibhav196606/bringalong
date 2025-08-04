# 📋 Hostinger Deployment Checklist

## Before Upload ✅

- [x] Built production files (`npm run build`)
- [x] Created deployment package
- [x] Configured environment variables
- [x] Set up production server
- [x] Created documentation

## MongoDB Setup (Required) ⚡

- [ ] Created MongoDB Atlas account (free)
- [ ] Created database cluster
- [ ] Got connection string
- [ ] Updated MONGODB_URI in .env file
- [ ] Whitelisted IP addresses (0.0.0.0/0 for now)

## Hostinger Upload 📤

- [ ] Logged into Hostinger control panel
- [ ] Opened File Manager
- [ ] Navigated to public_html (or domain folder)
- [ ] Uploaded ALL files from deployment-package/
- [ ] Verified file structure is correct

## Environment Configuration 🔧

- [ ] Updated .env file with real values:
  - [ ] MONGODB_URI (your actual connection string)
  - [ ] JWT_SECRET (secure random string)
  - [ ] VITE_API_BASE_URL (https://yourdomain.com/api)
  - [ ] CORS_ORIGIN (https://yourdomain.com)

## Hostinger Node.js Setup 🚀

- [ ] Enabled Node.js in Hostinger panel
- [ ] Set Node.js version to 18+ or Latest LTS
- [ ] Set app root to public_html
- [ ] Set startup file to production-server.js
- [ ] Installed dependencies (`npm install`)
- [ ] Started the application

## Domain & SSL 🌐

- [ ] Domain points to Hostinger
- [ ] SSL certificate enabled (https://)
- [ ] DNS propagated (may take up to 24 hours)

## Testing 🧪

- [ ] Frontend loads: https://yourdomain.com
- [ ] API responds: https://yourdomain.com/api/health
- [ ] User registration works
- [ ] User login works
- [ ] Trip search works
- [ ] Currency conversion works

## Security 🔒

- [ ] Changed default JWT_SECRET
- [ ] Using HTTPS (SSL enabled)
- [ ] CORS restricted to your domain
- [ ] Strong database password
- [ ] MongoDB Atlas security configured

## Troubleshooting 🛠️

If something doesn't work:

1. **Check Hostinger error logs**
2. **Verify all files uploaded correctly**
3. **Check MongoDB connection**
4. **Verify environment variables**
5. **Test API endpoints individually**

## Support Resources 📚

- **Hostinger Knowledge Base**: https://support.hostinger.com
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **Deployment Guide**: Read COMPLETE-SETUP-GUIDE.md

---

## ⚡ Quick Start Commands

### MongoDB Atlas Setup:
1. Go to https://mongodb.com/atlas
2. Create free cluster
3. Get connection string
4. Update .env file

### Hostinger Upload:
1. File Manager → public_html
2. Upload all deployment-package files
3. Enable Node.js app
4. npm install
5. Start application

### Test:
- Visit https://yourdomain.com
- Check https://yourdomain.com/api/health

---

🎉 **You're ready to deploy!** Follow this checklist step by step.
