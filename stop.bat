@echo off
echo ========================================
echo Stopping TriLink Application
echo ========================================
echo.

echo Stopping Backend (dotnet)...
taskkill /FI "WindowTitle eq TriLink Backend*" /T /F 2>nul
if %errorlevel% equ 0 (
    echo Backend stopped successfully
) else (
    echo Backend was not running
)

echo.
echo Stopping Frontend (node/vite)...
taskkill /FI "WindowTitle eq TriLink Frontend*" /T /F 2>nul
if %errorlevel% equ 0 (
    echo Frontend stopped successfully
) else (
    echo Frontend was not running
)

echo.
echo ========================================
echo All services stopped
echo ========================================
pause
