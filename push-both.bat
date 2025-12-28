@echo off
echo ========================================
echo Pushing to Both GitHub Repositories
echo ========================================
echo.

echo [1/2] Pushing to DigitallyNext/RealtyCanvas...
git push origin main
if %errorlevel% neq 0 (
    echo ❌ Failed to push to DigitallyNext/RealtyCanvas
    pause
    exit /b %errorlevel%
)
echo ✅ Successfully pushed to DigitallyNext/RealtyCanvas
echo.

echo [2/2] Pushing to realtycanvas/RealtyCanvas...
git push new-repo main
if %errorlevel% neq 0 (
    echo ❌ Failed to push to realtycanvas/RealtyCanvas
    pause
    exit /b %errorlevel%
)
echo ✅ Successfully pushed to realtycanvas/RealtyCanvas
echo.

echo ========================================
echo ✅ All Done! Both repositories updated.
echo ========================================
pause
