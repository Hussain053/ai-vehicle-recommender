# This file creates a GitHub repository structure guide

## GitHub Setup Steps

### 1. Initialize Git Repository (if not already done)
```bash
git init
git add .
git commit -m "Initial commit: AI Vehicle Recommender with secure API"
git branch -M main
```

### 2. Create Repository on GitHub

1. Go to https://github.com/new
2. Create repository: `ai-vehicle-recommender`
3. Choose: Public (for GitHub Pages)
4. Click "Create repository"

### 3. Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/ai-vehicle-recommender.git
git push -u origin main
```

### 4. Enable GitHub Pages
1. Go to Settings → Pages
2. Build and deployment
   - Source: Deploy from a branch
   - Branch: main / root
3. Wait for deployment (check Actions tab)
4. Site will be available at: https://YOUR_USERNAME.github.io/ai-vehicle-recommender

### 5. Add GitHub Secrets (for CI/CD)
1. Go to Settings → Secrets and variables → Actions
2. New repository secret: `API_URL`
3. Value: Your backend API endpoint (e.g., https://your-backend.vercel.app)

### 6. Configure Backend Hosting

Choose one:
- **Vercel** (Recommended): https://vercel.com or `vercel deploy`
- **Railway**: https://railway.app
- **Render**: https://render.com
- **Heroku**: https://heroku.com

After deploying backend:
1. Get backend URL
2. Update GitHub secret `API_URL`
3. Frontend will use it via GitHub Actions build

## Files in Repository

- `src/` - React components and logic
- `services/` - Backend API client
- `server.js` - Express backend
- `.github/workflows/deploy.yml` - CI/CD pipeline
- `SECURITY.md` - Security documentation
- `DEPLOYMENT.md` - Deployment guide
- `.env.example` - Environment variables template
- `.env.local` - Local secrets (in .gitignore)

## After Push to GitHub

✅ GitHub Actions will automatically:
1. Build the frontend
2. Run tests (if added)
3. Deploy to GitHub Pages
4. Make it available at your custom URL

## Quick Links

- **GitHub Pages Docs**: https://docs.github.com/en/pages
- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
