@echo off
echo ========================================================
echo   Deploying IEEE SREC Portal to GoDaddy via GitHub...
echo ========================================================
git add .
git commit -m "Auto-deploy update to GoDaddy"
git push origin main
echo ========================================================
echo   Push complete! GitHub Actions is now deploying live.
echo ========================================================
