#!/bin/bash
# Quick GitHub Setup Script for AI Vehicle Recommender

echo "🚀 Setting up GitHub repository for AI Vehicle Recommender"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📝 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit: AI Vehicle Recommender with secure API"
    git branch -M main
    echo "✅ Git initialized"
else
    echo "✅ Git repository already initialized"
fi

echo ""
echo "📋 Next steps to complete manually:"
echo ""
echo "1️⃣  CREATE GitHub Repository:"
echo "   → Go to https://github.com/new"
echo "   → Repository name: ai-vehicle-recommender"
echo "   → Make it Public (for GitHub Pages)"
echo "   → Click 'Create repository'"
echo ""
echo "2️⃣  PUSH Code to GitHub:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/ai-vehicle-recommender.git"
echo "   git push -u origin main"
echo ""
echo "3️⃣  ENABLE GitHub Pages:"
echo "   → Go to Settings → Pages"
echo "   → Source: Deploy from a branch"
echo "   → Branch: main / root"
echo "   → Save (deployment may take 1-2 minutes)"
echo ""
echo "4️⃣  DEPLOY Backend (choose one):"
echo "   "
echo "   Option A - Vercel (Recommended):"
echo "   npm install -g vercel"
echo "   vercel --prod"
echo "   → Set env var: GEMINI_API_KEY"
echo "   → Copy deployment URL"
echo "   "
echo "   Option B - Railway:"
echo "   → Sign up at railway.app"
echo "   → Connect GitHub repo"
echo "   → Add Procfile and env vars"
echo "   "
echo "5️⃣  ADD GitHub Secrets:"
echo "   → Settings → Secrets and variables → Actions"
echo "   → New secret: API_URL (your backend URL)"
echo ""
echo "6️⃣  UPDATE Frontend:"
echo "   → GitHub Actions will automatically build on next push"
echo ""
echo "🎉 Your app will be live at:"
echo "   https://YOUR_USERNAME.github.io/ai-vehicle-recommender"
echo ""
echo "📚 For detailed info, see:"
echo "   → DEPLOYMENT.md - Complete deployment guide"
echo "   → SECURITY.md - Security best practices"
echo "   → .github/GITHUB_SETUP.md - GitHub setup details"
