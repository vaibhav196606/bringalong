#!/bin/bash

# BringAlong Deployment Setup Script

echo "🚀 BringAlong Deployment Setup"
echo "==============================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📝 Initializing Git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git repository exists"
fi

# Check for GitHub remote
if ! git remote get-url origin &> /dev/null; then
    echo "⚠️  No GitHub remote found"
    echo "📝 Please add your GitHub repository:"
    echo "   git remote add origin https://github.com/your-username/bringalong.git"
else
    echo "✅ GitHub remote configured"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install server dependencies
cd server
npm install
cd ..

echo "✅ Dependencies installed"

# Check environment files
if [ ! -f ".env" ]; then
    echo "⚠️  Creating .env file from template..."
    cp .env.production.template .env
    echo "📝 Please update .env with your values"
else
    echo "✅ .env file exists"
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Update .env file with your MongoDB connection string"
echo "2. Push code to GitHub: git add . && git commit -m 'Initial deployment setup' && git push"
echo "3. Deploy backend to Railway (see DEPLOYMENT.md)"
echo "4. Deploy frontend to Vercel (see DEPLOYMENT.md)"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
