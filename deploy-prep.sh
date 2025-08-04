#!/bin/bash

echo "🚀 Preparing Traveler Connect for Hostinger Deployment..."

# Create deployment directory
mkdir -p deployment-package

# Build the React app
echo "📦 Building React application..."
npm run build

# Copy built files
echo "📋 Copying built files..."
cp -r dist/* deployment-package/

# Copy server files
echo "🔧 Copying server files..."
cp -r server deployment-package/
cp production-server.js deployment-package/

# Copy and rename configuration files
cp package-production.json deployment-package/package.json
cp .env.production deployment-package/.env

# Create upload instructions
echo "📝 Creating upload instructions..."
cat > deployment-package/UPLOAD-INSTRUCTIONS.txt << EOF
HOSTINGER UPLOAD INSTRUCTIONS
============================

1. Login to your Hostinger control panel
2. Go to File Manager
3. Navigate to public_html (or your domain folder)
4. Upload ALL files from this deployment-package folder
5. In Hostinger terminal, run:
   - cd public_html
   - npm install
   - npm start

6. Configure your domain to use Node.js

FILES TO UPLOAD:
- All files in this deployment-package folder
- Make sure .env file has your actual MongoDB connection string
- Update package.json if needed

Your app will be available at: https://yourdomain.com
API will be available at: https://yourdomain.com/api
EOF

echo "✅ Deployment package ready!"
echo "📁 Files are in: deployment-package/"
echo "📖 Next steps: Read DEPLOYMENT.md and UPLOAD-INSTRUCTIONS.txt"

# Create a zip file for easy upload
if command -v zip &> /dev/null; then
    echo "🗜️  Creating zip file for upload..."
    cd deployment-package
    zip -r ../traveler-connect-deployment.zip .
    cd ..
    echo "✅ Zip file created: traveler-connect-deployment.zip"
fi

echo "🎉 Ready for deployment to Hostinger!"
