@echo off
title IEEE SREC - 1-Click Auto Deploy
color 0b
echo ======================================================================
echo           IEEE STUDENT BRANCH SREC - 1-CLICK DEPLOYER
echo ======================================================================
echo.
echo [1/3] Staging all project changes...
git add .
echo [2/3] Creating commit...
git commit -m "Auto-deploy update to GoDaddy via 1-Click Deployer"
echo [3/3] Pushing to GitHub (origin/main)...
git push origin main
echo.
echo ======================================================================
echo   SUCCESS: Changes pushed! GitHub Actions is now deploying live.
echo ======================================================================
echo.
pause
