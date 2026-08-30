Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Deploying IEEE SREC Portal to GoDaddy via GitHub...  " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

git add .
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
git commit -m "Auto-deploy update to GoDaddy ($timestamp)"
git push origin main

Write-Host "========================================================" -ForegroundColor Green
Write-Host "  Push complete! GitHub Actions is now deploying live.  " -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
