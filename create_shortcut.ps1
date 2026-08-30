$ws = New-Object -ComObject WScript.Shell
$shortcutPath = Join-Path (Get-Location) "Deploy-IEEE-SREC.lnk"
$batPath = Join-Path (Get-Location) "Deploy-IEEE-SREC.bat"
$iconPath = Join-Path (Get-Location) "public\favicon.ico"

$s = $ws.CreateShortcut($shortcutPath)
$s.TargetPath = $batPath
$s.WorkingDirectory = (Get-Location).Path
$s.IconLocation = "$iconPath,0"
$s.Description = "1-Click Deploy IEEE SREC Web Portal to GoDaddy"
$s.Save()

Write-Host "Created IEEE 1-Click Deployer shortcut with IEEE icon at: $shortcutPath" -ForegroundColor Green
