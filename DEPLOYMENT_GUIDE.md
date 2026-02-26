# Deployment Guide - Vercel

This guide will help you deploy the AI Integrated Composite Material Characterization System to Vercel.

## Architecture Overview

- **Frontend**: React app → Deploy to Vercel
- **Backend**: Node.js/Express API → Deploy to Vercel (Serverless Functions)
- **Database**: MongoDB Atlas (Cloud Database)

## Prerequisites

1. GitHub account
2. Vercel account (sign up at https://vercel.com)
3. MongoDB Atlas account (sign up at https://www.mongodb.com/cloud/atlas)

---

## Part 1: Setup MongoDB Atlas (Cloud Database)

### Step 1: Create MongoDB Atlas Cluster

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up or log in
3. Click "Build a Database"
4. Choose "FREE" tier (M0 Sandbox)
5. Select a cloud provider and region (choose closest to you)
6. Click "Create Cluster"

### Step 2: Configure Database Access

1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `admin` (or your choice)
5. Password: Generate a secure password (SAVE THIS!)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### Step 3: Configure Network Access

1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### Step 4: Get Connection String

1. Go to "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string (looks like):
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add database name: `mongodb+srv://admin:yourpassword@cluster0.xxxxx.mongodb.net/composite-dashboard?retryWrites=true&w=majority`

---

## Part 2: Prepare Your Code for Deployment

### Step 1: Update Backend for Vercel Serverless

Create `composite-dashboard/backend/vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

### Step 2: Update Backend Package.json

Ensure your `backend/package.json` has:

```json
{
  "engines": {
    "node": "18.x"
  }
}
```

### Step 3: Create Environment Variables File

Create `composite-dashboard/backend/.env.production`:

```
MONGODB_URI=your_mongodb_atlas_connection_string_here
PORT=5000
NODE_ENV=production
```

### Step 4: Update Frontend API URL

Create `composite-dashboard/frontend/.env.production`:

```
REACT_APP_API_URL=https://your-backend-url.vercel.app/api
```

(You'll update this after deploying the backend)

---

## Part 3: Push Code to GitHub

### Step 1: Initialize Git Repository

```bash
cd composite-dashboard
git init
```

### Step 2: Create .gitignore

Create `composite-dashboard/.gitignore`:

```
# Dependencies
node_modules/
backend/node_modules/
frontend/node_modules/

# Environment variables
.env
.env.local
.env.production
backend/.env
frontend/.env

# Build outputs
frontend/build/
dist/

# Logs
*.log
npm-debug.log*

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
```

### Step 3: Commit and Push

```bash
git add .
git commit -m "Initial commit - AI Integrated Composite Material Characterization System"

# Create repository on GitHub, then:
git remote add origin https://github.com/yourusername/composite-dashboard.git
git branch -M main
git push -u origin main
```

---

## Part 4: Deploy Backend to Vercel

### Step 1: Import Backend Project

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Vercel will detect it's a monorepo

### Step 2: Configure Backend Deployment

1. **Root Directory**: Set to `backend`
2. **Framework Preset**: Other
3. **Build Command**: Leave empty
4. **Output Directory**: Leave empty
5. **Install Command**: `npm install`

### Step 3: Add Environment Variables

1. Go to "Environment Variables" section
2. Add:
   - Key: `MONGODB_URI`
   - Value: Your MongoDB Atlas connection string
   - Environment: Production, Preview, Development
3. Add:
   - Key: `NODE_ENV`
   - Value: `production`

### Step 4: Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Copy your backend URL (e.g., `https://composite-backend.vercel.app`)

### Step 5: Test Backend

Visit: `https://your-backend-url.vercel.app/api/health`

Should return: `{"status":"OK","message":"Server is running"}`

---

## Part 5: Seed Database from Local Machine

Since Vercel serverless functions have limitations, seed from your local machine:

```bash
cd composite-dashboard/backend

# Update .env with MongoDB Atlas connection string
# MONGODB_URI=mongodb+srv://admin:password@cluster0.xxxxx.mongodb.net/composite-dashboard

npm run seed-experimental
```

You should see: "Successfully seeded 150 experimental data points"

---

## Part 6: Deploy Frontend to Vercel

### Step 1: Update Frontend Environment

Update `composite-dashboard/frontend/.env.production`:

```
REACT_APP_API_URL=https://your-backend-url.vercel.app/api
```

Commit and push:

```bash
git add .
git commit -m "Update API URL for production"
git push
```

### Step 2: Import Frontend Project

1. Go to Vercel Dashboard
2. Click "Add New" → "Project"
3. Import the same GitHub repository again

### Step 3: Configure Frontend Deployment

1. **Root Directory**: Set to `frontend`
2. **Framework Preset**: Create React App
3. **Build Command**: `npm run build`
4. **Output Directory**: `build`
5. **Install Command**: `npm install`

### Step 4: Add Environment Variables

1. Go to "Environment Variables"
2. Add:
   - Key: `REACT_APP_API_URL`
   - Value: `https://your-backend-url.vercel.app/api`
   - Environment: Production, Preview, Development

### Step 5: Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Your app will be live at: `https://your-app-name.vercel.app`

---

## Part 7: Configure CORS (Important!)

Update `composite-dashboard/backend/server.js`:

```javascript
const cors = require('cors');

// Update CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-frontend-url.vercel.app'
  ],
  credentials: true
}));
```

Commit and push:

```bash
git add .
git commit -m "Update CORS for production"
git push
```

Vercel will automatically redeploy.

---

## Part 8: Custom Domain (Optional)

### Add Custom Domain to Frontend

1. Go to your frontend project in Vercel
2. Click "Settings" → "Domains"
3. Add your domain (e.g., `composites.yourdomain.com`)
4. Follow DNS configuration instructions

### Add Custom Domain to Backend

1. Go to your backend project in Vercel
2. Click "Settings" → "Domains"
3. Add subdomain (e.g., `api.composites.yourdomain.com`)
4. Update frontend `.env.production` with new API URL

---

## Troubleshooting

### Issue: "Cannot connect to database"

**Solution**: 
- Check MongoDB Atlas connection string
- Ensure IP whitelist includes 0.0.0.0/0
- Verify username and password are correct

### Issue: "CORS error"

**Solution**:
- Add frontend URL to CORS whitelist in backend
- Redeploy backend after updating

### Issue: "API returns 404"

**Solution**:
- Check `vercel.json` routes configuration
- Ensure all API routes start with `/api`
- Check Vercel function logs

### Issue: "Build fails"

**Solution**:
- Check Node.js version compatibility
- Ensure all dependencies are in `package.json`
- Check build logs in Vercel dashboard

---

## Monitoring and Maintenance

### View Logs

1. Go to Vercel Dashboard
2. Select your project
3. Click "Deployments"
4. Click on a deployment
5. View "Functions" tab for backend logs

### Update Application

```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push

# Vercel automatically redeploys
```

### Rollback Deployment

1. Go to Vercel Dashboard
2. Click "Deployments"
3. Find previous working deployment
4. Click "..." → "Promote to Production"

---

## Cost Estimate

- **Vercel Free Tier**: 
  - 100 GB bandwidth/month
  - 100 GB-hours serverless function execution
  - Unlimited projects
  - **Cost: FREE**

- **MongoDB Atlas Free Tier (M0)**:
  - 512 MB storage
  - Shared RAM
  - **Cost: FREE**

**Total Monthly Cost: $0** (within free tier limits)

---

## Production Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password
- [ ] Network access configured (0.0.0.0/0)
- [ ] Database seeded with experimental data
- [ ] Backend deployed to Vercel
- [ ] Backend environment variables set
- [ ] Backend API tested (`/api/health`)
- [ ] Frontend environment variables updated
- [ ] Frontend deployed to Vercel
- [ ] CORS configured correctly
- [ ] Application tested end-to-end
- [ ] Custom domain configured (optional)

---

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Check MongoDB Atlas metrics
3. Test API endpoints individually
4. Verify environment variables
5. Check browser console for errors

## Next Steps

After deployment:
1. Test all features thoroughly
2. Monitor performance in Vercel dashboard
3. Set up custom domain (optional)
4. Configure analytics (optional)
5. Set up monitoring/alerts (optional)
