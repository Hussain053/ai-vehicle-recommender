# Deployment Guide

This guide covers deploying your AI Vehicle Recommender to GitHub with frontend and backend hosting.

## Architecture Overview

```
GitHub Repository
├── Frontend (React + Vite) → Hosted on GitHub Pages / Vercel
└── Backend (Express.js) → Hosted on Vercel / Railway / Render
```

---

## Option 1: GitHub Pages + Vercel (Recommended)

### Frontend: Deploy to GitHub Pages

1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/ai-vehicle-recommender.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to Settings → Pages
   - Select "Deploy from a branch"
   - Select `main` branch and `/root` directory
   - Wait for deployment (check Actions tab)

3. **Update Vite Config for Base Path**
   If hosting at `yourusername.github.io/ai-vehicle-recommender/`:
   
   ```typescript
   // vite.config.ts
   export default defineConfig({
     base: '/ai-vehicle-recommender/',
     // ... rest of config
   });
   ```
   
   For `yourusername.github.io`, set `base: '/'`

### Backend: Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy Backend**
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables on Vercel**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add: `GEMINI_API_KEY=your_key_here`
   - Redeploy after adding variables

4. **Update Frontend API URL**
   In `.env.local`:
   ```
   VITE_API_URL=https://your-vercel-project.vercel.app
   ```

---

## Option 2: GitHub Pages + Railway (Alternative)

### Backend: Deploy to Railway

1. **Sign up at railway.app** (free tier available)

2. **Create New Project** → Connect GitHub repo

3. **Add `Procfile` in root**:
   ```
   web: node server.js
   ```

4. **Set Environment Variables**
   - In Railway Dashboard: Variables
   - Add `GEMINI_API_KEY` and `PORT`

5. **Get Backend URL**
   - Copy the Railway domain assigned to your project

6. **Update Frontend**
   ```env
   VITE_API_URL=https://your-railway-app.up.railway.app
   ```

---

## Option 3: Full GitHub Pages + GitHub Actions (Free)

Use GitHub Actions to deploy frontend and serverless functions.

### Setup GitHub Actions Workflow

1. **Create `.github/workflows/deploy.yml`**:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build frontend
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.API_URL }}
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          cname: yourdomain.com # Optional: use custom domain
```

2. **Generate GitHub Token**
   - Settings → Developer settings → Personal access tokens → Generate new token
   - Scopes: `repo`, `workflow`
   - Copy token

3. **Add Secrets to Repository**
   - Go to Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Add:
     - `API_URL`: Backend API endpoint
     - `GEMINI_API_KEY`: (if backend also in GitHub Actions)

---

## Environment Variables Setup

### Frontend (Safe to Expose)
```
VITE_API_URL=https://api.yourdomain.com
```

### Backend (NEVER expose to client)
```
GEMINI_API_KEY=AIzaSy...
PORT=5000
NODE_ENV=production
```

---

## Custom Domain Setup

### Using GitHub Pages Custom Domain

1. **Update CNAME Record**
   - Go to your domain registrar
   - Add CNAME record: `yourdomain.com` → `yourusername.github.io`

2. **Configure in Repository**
   - Settings → Pages → Custom domain
   - Enter `yourdomain.com`
   - Check "Enforce HTTPS"

### Backend Custom Domain

1. **Register API subdomain**: `api.yourdomain.com`

2. **Point to your hosting** (Vercel, Railway, etc.):
   - If Vercel: Add CNAME in your domain registrar
   - Follow your hosting provider's instructions

3. **Update Frontend**
   ```env
   VITE_API_URL=https://api.yourdomain.com
   ```

---

## Production Checklist

- [ ] `.env.local` is in `.gitignore` ✓
- [ ] API key stored only on backend server
- [ ] Frontend has no hardcoded secrets
- [ ] HTTPS enabled on all domains
- [ ] CORS configured correctly on backend
- [ ] Environment variables set on hosting platform
- [ ] Rate limiting active
- [ ] Error messages don't expose sensitive info
- [ ] Backend `GEMINI_API_KEY` only in production env vars
- [ ] Custom domain configured (optional)

---

## Troubleshooting

### Frontend Shows CORS Error
- Verify `VITE_API_URL` points to correct backend
- Check backend CORS settings allow your frontend domain
- In `server.js`:
  ```javascript
  app.use(cors({
    origin: 'https://yourdomain.com',
    credentials: true
  }));
  ```

### API Key Not Working in Production
- Ensure `GEMINI_API_KEY` is set in production env vars
- Verify key has Generative AI API enabled
- Check API quota in Google Cloud Console

### GitHub Pages 404 Errors
- Verify `base` path in `vite.config.ts`
- Check build output in `dist/` folder
- Ensure `/dist` folder structure is correct

### Backend Not Responding
- Check backend deployment logs
- Verify environment variables are set
- Test backend directly with curl:
  ```bash
  curl https://your-api.com/api/recommendations -X POST
  ```

---

## Next Steps

1. Create GitHub repository
2. Choose hosting option (Vercel, Railway, etc.)
3. Configure environment variables
4. Deploy and test
5. Update frontend API URL

For support, see [SECURITY.md](SECURITY.md) for security best practices.
