@echo off
echo 🚀 Preparing Traveler Connect for Hostinger Deployment...

REM Create deployment directory
if not exist "deployment-package" mkdir deployment-package

REM Build the React app
echo 📦 Building React application...
call npm run build

REM Copy built files
echo 📋 Copying built files...
xcopy /E /I /Y dist\* deployment-package\

REM Copy server files
echo 🔧 Copying server files...
xcopy /E /I /Y server deployment-package\server\
copy production-server.js deployment-package\

REM Copy and rename configuration files
copy package-production.json deployment-package\package.json
copy .env.production deployment-package\.env

REM Create upload instructions
echo 📝 Creating upload instructions...
(
echo HOSTINGER UPLOAD INSTRUCTIONS
echo ============================
echo.
echo 1. Login to your Hostinger control panel
echo 2. Go to File Manager
echo 3. Navigate to public_html ^(or your domain folder^)
echo 4. Upload ALL files from this deployment-package folder
echo 5. In Hostinger terminal, run:
echo    - cd public_html
echo    - npm install
echo    - npm start
echo.
echo 6. Configure your domain to use Node.js
echo.
echo FILES TO UPLOAD:
echo - All files in this deployment-package folder
echo - Make sure .env file has your actual MongoDB connection string
echo - Update package.json if needed
echo.
echo Your app will be available at: https://yourdomain.com
echo API will be available at: https://yourdomain.com/api
) > deployment-package\UPLOAD-INSTRUCTIONS.txt

echo ✅ Deployment package ready!
echo 📁 Files are in: deployment-package\
echo 📖 Next steps: Read DEPLOYMENT.md and UPLOAD-INSTRUCTIONS.txt

echo 🎉 Ready for deployment to Hostinger!
pause
