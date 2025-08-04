# BringAlong Deployment Setup Script (PowerShell)

Write-Host "🚀 BringAlong Deployment Setup" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "📝 Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git initialized" -ForegroundColor Green
} else {
    Write-Host "✅ Git repository exists" -ForegroundColor Green
}

# Check for GitHub remote
try {
    git remote get-url origin | Out-Null
    Write-Host "✅ GitHub remote configured" -ForegroundColor Green
} catch {
    Write-Host "⚠️  No GitHub remote found" -ForegroundColor Yellow
    Write-Host "📝 Please add your GitHub repository:" -ForegroundColor Cyan
    Write-Host "   git remote add origin https://github.com/your-username/bringalong.git" -ForegroundColor White
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Install server dependencies
Set-Location server
npm install
Set-Location ..

Write-Host "✅ Dependencies installed" -ForegroundColor Green

# Check environment files
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item .env.production.template .env
    Write-Host "📝 Please update .env with your values" -ForegroundColor Cyan
} else {
    Write-Host "✅ .env file exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Update .env file with your MongoDB connection string" -ForegroundColor White
Write-Host "2. Push code to GitHub: git add . && git commit -m 'Initial deployment setup' && git push" -ForegroundColor White
Write-Host "3. Deploy backend to Railway (see DEPLOYMENT.md)" -ForegroundColor White
Write-Host "4. Deploy frontend to Vercel (see DEPLOYMENT.md)" -ForegroundColor White
Write-Host ""
Write-Host "📖 See DEPLOYMENT.md for detailed instructions" -ForegroundColor Cyan
