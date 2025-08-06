# Email System Setup for Production (Railway + Vercel)

## 📧 Email Configuration Options

### Option 1: Gmail with App Password (Recommended for small scale)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Copy the 16-character password

3. **Railway Environment Variables**:
   ```
   EMAIL_USER=your-gmail-address@gmail.com
   EMAIL_PASSWORD=your-16-character-app-password
   EMAIL_FROM=BringAlong <your-gmail-address@gmail.com>
   ```

### Option 2: SendGrid (Recommended for production scale)

1. **Create SendGrid Account**: https://sendgrid.com/
2. **Get API Key**:
   - Create API key with Mail Send permissions
   - Copy the API key

3. **Install SendGrid** (alternative to Gmail):
   ```bash
   npm install @sendgrid/mail
   ```

4. **Railway Environment Variables**:
   ```
   SENDGRID_API_KEY=your-sendgrid-api-key
   EMAIL_FROM=noreply@yourdomain.com
   ```

## 🚀 Railway Deployment Setup

### Step 1: Environment Variables on Railway

Set these environment variables in your Railway project:

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Security
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters
NODE_ENV=production

# Frontend
FRONTEND_URL=https://your-app.vercel.app

# Email (Gmail option)
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=BringAlong <your-gmail@gmail.com>

# CORS
CORS_ORIGIN=https://your-app.vercel.app
```

### Step 2: Update CORS Configuration

Update your server to handle production CORS:

```javascript
// In server/index.js
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
```

### Step 3: Deploy to Railway

1. **Connect Repository**: Link your GitHub repo to Railway
2. **Set Environment Variables**: Add all variables from above
3. **Deploy**: Railway will auto-deploy from your main branch

## 🌐 Vercel Frontend Setup

### Step 1: Environment Variables on Vercel

Set this in your Vercel project settings:

```bash
VITE_API_BASE_URL=https://your-railway-app.railway.app/api
```

### Step 2: Update API Configuration

Make sure your frontend API configuration uses the environment variable:

```typescript
// In src/services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
```

## 🔐 Security Checklist

- [ ] Strong JWT secret (32+ characters)
- [ ] Environment variables set correctly
- [ ] CORS configured for your domain only
- [ ] Email credentials secured
- [ ] MongoDB connection string updated for production
- [ ] HTTPS enforced
- [ ] Rate limiting configured (recommended)

## 📝 Testing Email in Production

1. **Deploy both frontend and backend**
2. **Test forgot password flow**:
   - Go to your Vercel app login page
   - Click "Forgot password"
   - Enter email address
   - Check email inbox (including spam)
   - Click reset link
   - Set new password

## 🐛 Troubleshooting

### Email not sending:
- Check Railway logs for email errors
- Verify Gmail app password is correct
- Check if Gmail account has 2FA enabled
- Verify EMAIL_USER and EMAIL_PASSWORD in Railway

### CORS errors:
- Check CORS_ORIGIN matches your Vercel domain exactly
- Ensure FRONTEND_URL is set correctly
- Check browser network tab for exact error

### Reset links not working:
- Verify FRONTEND_URL points to your Vercel app
- Check token expiration (10 minutes)
- Ensure routes are configured correctly

## 📈 Production Monitoring

Monitor these metrics:
- Email delivery success rate
- Password reset completion rate
- Error logs in Railway
- CORS errors
- Failed authentication attempts

## 🔄 Backup Plan

If email fails:
- Check Railway logs
- Temporary: Use development mode to get reset URL from logs
- Long-term: Implement admin panel to manually reset passwords
