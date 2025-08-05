# MongoDB Atlas Setup for Local Testing

## Quick MongoDB Atlas Setup (Free Tier)

1. **Create MongoDB Atlas Account**
   - Go to: https://cloud.mongodb.com/
   - Sign up with your email or GitHub account

2. **Create a Free Cluster**
   - Choose "Build a Database" 
   - Select "M0 Sandbox" (FREE)
   - Choose a cloud provider and region (closest to you)
   - Cluster Name: `bringalong-cluster`
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `bringalong-user`
   - Auto-generate secure password (SAVE THIS!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Choose "Allow access from anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (Node.js driver)
   - It looks like: `mongodb+srv://bringalong-user:<password>@bringalong-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority`

6. **Update .env file**
   - Replace `<password>` in the connection string with your actual password
   - Update MONGODB_URI in your .env file

## Alternative: Use MongoDB Atlas Connection String Template

If you want to test quickly, you can use this template in your .env:

```
MONGODB_URI=mongodb+srv://bringalong-user:YOUR_PASSWORD_HERE@bringalong-cluster.xxxxx.mongodb.net/traveler-connect?retryWrites=true&w=majority
```

Replace:
- `YOUR_PASSWORD_HERE` with your database user password
- `xxxxx` with your actual cluster identifier
