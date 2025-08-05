# 🔺 Vercel Frontend Deployment Guide

## Step 1: Sign Up and Import Project

1. Go to **Vercel**: https://vercel.com/
2. Click **"Sign Up"** and use your **GitHub account**
3. Click **"Import Project"**
4. Select **"Import Git Repository"**
5. Choose **`vaibhav196606/bringalong`**

## Step 2: Configure Project Settings

Vercel will auto-detect your Vite project:

- **Framework Preset**: Vite (auto-detected)
- **Root Directory**: `.` (default)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `dist` (auto-detected)

## Step 3: Add Environment Variables

In Vercel dashboard, add this environment variable:

```
VITE_API_BASE_URL=https://your-railway-app-url.railway.app/api
```

**Important**: Replace `your-railway-app-url` with the actual Railway URL from Step 2!

## Step 4: Deploy

1. Click **"Deploy"**
2. Vercel will build and deploy your app
3. You'll get a URL like: `https://bringalong.vercel.app`

## Step 5: Update Railway Backend

Go back to Railway and update the `FRONTEND_URL` environment variable:

```
FRONTEND_URL=https://your-vercel-url.vercel.app
```

## Vercel Deployment Features:
- ✅ Automatic builds from GitHub
- ✅ Global CDN for fast loading
- ✅ Automatic HTTPS
- ✅ Preview deployments for branches
