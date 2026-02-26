# Quick Deploy to Vercel - Step by Step

## 1. Setup MongoDB Atlas (5 minutes)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up/Login
3. Create FREE cluster (M0)
4. Create database user:
   - Username: `admin`
   - Password: (generate and save)
5. Network Access: Allow 0.0.0.0/0
6. Get connection string:
   ```
   mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/composite-dashboard?retryWrites=true&w=majority
   ```

## 2. Seed Database (2 minutes)

```bash
cd composite-dashboard/backend

# Update .env with your MongoDB Atlas connection string
# MONGODB_URI=mongodb+srv://...

npm install
npm run seed-experimental
```

## 3. Push to GitHub (3 minutes)

```bash
cd composite-dashboard

# Initialize git
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/composite-dashboard.git
git push -u origin main
```

## 4. Deploy Backend to Vercel (5 minutes)

1. Go to https://vercel.com
2. Sign up/Login with GitHub
3. Click "Add New" → "Project"
4. Import your repository
5. Configure:
   - Root Directory: `backend`
   - Framework: Other
   - Build Command: (leave empty)
   - Install Command: `npm install`
6. Environment Variables:
   - `MONGODB_URI`: (your MongoDB Atlas connection string)
   - `NODE_ENV`: `production`
7. Click "Deploy"
8. Copy your backend URL: `https://your-backend.vercel.app`

## 5. Deploy Frontend to Vercel (5 minutes)

1. In Vercel, click "Add New" → "Project"
2. Import same repository
3. Configure:
   - Root Directory: `frontend`
   - Framework: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`
4. Environment Variables:
   - `REACT_APP_API_URL`: `https://your-backend.vercel.app/api`
5. Click "Deploy"
6. Your app is live! 🎉

## 6. Update CORS (2 minutes)

Update `backend/server.js`:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-frontend.vercel.app'  // Add your frontend URL
  ]
}));
```

Commit and push:
```bash
git add .
git commit -m "Update CORS"
git push
```

Vercel auto-redeploys!

## Done! ✅

Your app is now live at: `https://your-frontend.vercel.app`

## Test It

1. Visit your frontend URL
2. Select materials (Glass + Epoxy + 0)
3. See data load
4. Adjust load-deflection slider
5. View charts and tables

## Troubleshooting

**No data showing?**
- Check MongoDB Atlas connection
- Verify database was seeded
- Check Vercel function logs

**CORS error?**
- Update CORS in backend/server.js
- Add your frontend URL
- Redeploy

**API not working?**
- Test: `https://your-backend.vercel.app/api/health`
- Should return: `{"status":"OK"}`
- Check environment variables in Vercel

## Free Tier Limits

- Vercel: 100 GB bandwidth/month
- MongoDB Atlas: 512 MB storage
- Both are FREE! 🎉

## Need Help?

Check the full DEPLOYMENT_GUIDE.md for detailed instructions.
