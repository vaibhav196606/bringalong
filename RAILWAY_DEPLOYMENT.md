# 🚂 Railway Backend Deployment Guide

## Step 1: Sign Up and Connect GitHub

1. Go to **Railway**: https://railway.app/
2. Click **"Login"** and sign up with your **GitHub account**
3. Authorize Railway to access your repositories

## Step 2: Deploy Your Backend

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose **`vaibhav196606/bringalong`**
4. Railway will automatically detect your Dockerfile and start deployment

## Step 3: Configure Environment Variables

In Railway dashboard, go to your project and add these variables:

```
MONGODB_URI=mongodb+srv://bringalong-cluster:Hukam%401005@cluster0.ijrikm4.mongodb.net/traveler-connect?retryWrites=true&w=majority

JWT_SECRET=bringalong-production-super-secret-jwt-key-2025-change-this-to-something-random

PORT=3001

NODE_ENV=production

FRONTEND_URL=https://bringalong.vercel.app

UPLOAD_DIR=uploads
```

## Step 4: Get Your Railway URL

After deployment completes, Railway will give you a URL like:
`https://your-app-name.railway.app`

**Copy this URL - you'll need it for the frontend deployment!**

## Railway Deployment Tips:
- ✅ Railway automatically detects Node.js projects
- ✅ Your Dockerfile is already configured
- ✅ Environment variables are secure
- ✅ Automatic deployments on git push
