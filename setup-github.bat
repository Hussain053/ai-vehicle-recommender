@echo off
REM Quick GitHub Setup Script for Windows

echo.
echo ===========================================
echo   AI Vehicle Recommender - GitHub Setup
echo ===========================================
echo.

if not exist ".git" (
    echo 1. Initializing git repository...
    git init
    git add .
    git commit -m "Initial commit: AI Vehicle Recommender with secure API"
    git branch -M main
    echo    [OK] Git initialized
) else (
    echo [OK] Git repository already initialized
)

echo.
echo NEXT STEPS (complete manually):
echo.
echo [1] CREATE GitHub Repository
echo     Go to: https://github.com/new
echo     - Repository name: ai-vehicle-recommender
echo     - Make it PUBLIC
echo     - Click "Create repository"
echo.
echo [2] PUSH Code to GitHub
echo     git remote add origin https://github.com/YOUR_USERNAME/ai-vehicle-recommender.git
echo     git push -u origin main
echo.
echo [3] ENABLE GitHub Pages
echo     - Go to Settings ^> Pages
echo     - Source: Deploy from a branch
echo     - Branch: main / (root)
echo     - Wait 1-2 min for deployment
echo.
echo [4] DEPLOY Backend (Choose ONE):
echo.
echo     OPTION A - Vercel (Recommended)
echo     npm install -g vercel
echo     vercel --prod
echo     - Add GEMINI_API_KEY in Vercel Environment Variables
echo     - Copy deployment URL
echo.
echo     OPTION B - Railway
echo     - Sign up at railway.app
echo     - Connect your GitHub repo
echo     - Add Procfile and environment variables
echo.
echo [5] ADD GitHub Secrets
echo     - Settings ^> Secrets and variables ^> Actions
echo     - New secret: API_URL (paste your backend URL)
echo.
echo [6] UPDATE Frontend Configuration
echo     - GitHub Actions will auto-build on next push
echo.
echo ===========================================
echo   Your site will be live at:
echo   https://YOUR_USERNAME.github.io/ai-vehicle-recommender
echo ===========================================
echo.
echo Documentation:
echo   - DEPLOYMENT.md     ^(Complete deployment guide^)
echo   - SECURITY.md       ^(Security best practices^)
echo   - .github\GITHUB_SETUP.md  ^(GitHub details^)
echo.
pause
