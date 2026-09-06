@echo off
title Building IEEE Inauguration Remote Standalone App
echo ========================================================
echo   Building IEEE Inauguration Remote Standalone Bundle
echo ========================================================
echo.

call npm run build:remote
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Web build failed.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [INFO] Syncing with Android Capacitor project...
call npx cap sync android

echo.
echo ========================================================
echo   Remote App Build Complete!
echo ========================================================
echo.
echo To generate the APK file:
echo   1. Open Android Studio with: npx cap open android
echo   2. Click: Build > Build Bundle(s) / APK(s) > Build APK(s)
echo   3. Your standalone APK will be ready in:
echo      android/app/build/outputs/apk/debug/app-debug.apk
echo.
pause
