# BringAlong Deployment Guide

## Overview
This guide covers deploying BringAlong to Vercel (frontend) and Railway (backend + MongoDB).

## Prerequisites
- GitHub account
- Vercel account (connected to GitHub)
- Railway account

## Deployment Steps

### 1. Prepare Environment Variables

#### Backend (.env for Railway)
```env
PORT=3001
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=production
FRONTEND_URL=https://your-vercel-app.vercel.app
```

#### Frontend (.env for Vercel)
```env
VITE_API_URL=https://your-railway-app.railway.app
```

### 2. Deploy Backend to Railway

1. Push code to GitHub repository
2. Go to Railway dashboard
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect the Dockerfile
6. Set environment variables in Railway dashboard:
   - `PORT`: 3001
   - `MONGODB_URI`: Your MongoDB connection string
   - `NODE_ENV`: production
   - `FRONTEND_URL`: (will update after frontend deployment)

### 3. Deploy Frontend to Vercel

1. Go to Vercel dashboard
2. Click "Import Project" → select your GitHub repository
3. Vercel will auto-detect it's a Vite React app
4. Set environment variables:
   - `VITE_API_URL`: Your Railway backend URL
5. Deploy

### 4. Update CORS Configuration

After both deployments:
1. Update Railway environment variable `FRONTEND_URL` with your Vercel URL
2. Railway will automatically redeploy

### 5. Database Setup Options

#### Option A: MongoDB Atlas (Recommended)
1. Create MongoDB Atlas account
2. Create cluster
3. Get connection string
4. Use as MONGODB_URI

#### Option B: Railway MongoDB
1. Add MongoDB service in Railway
2. Use provided connection string

## File Structure for Deployment

```
app/
├── vercel.json          # Vercel configuration
├── Dockerfile           # Railway container setup
├── server/
│   ├── package.json     # Backend dependencies
│   └── ...
├── src/                 # Frontend source
├── .env.production.template
└── DEPLOYMENT.md        # This guide
```

## Troubleshooting

### Common Issues
1. **CORS errors**: Ensure FRONTEND_URL is set correctly in Railway
2. **Database connection**: Check MONGODB_URI format
3. **Build failures**: Verify all dependencies in package.json files

### Environment Variables Checklist
- [ ] Railway: PORT, MONGODB_URI, NODE_ENV, FRONTEND_URL
- [ ] Vercel: VITE_API_URL
- [ ] Database connection string is valid
- [ ] CORS domains match deployed URLs

## Post-Deployment
1. Test all functionality
2. Monitor Railway logs for any errors
3. Set up domain (optional): BringAlong.net
4. Configure analytics and monitoring
