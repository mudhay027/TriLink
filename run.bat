@echo off
echo ========================================
echo Starting TriLink Application
echo ========================================
echo.

REM Check if .env file exists in backend
if not exist "backend\.env" (
    echo WARNING: backend\.env file not found!
    echo Please copy backend\.env.example to backend\.env and add your API keys
    echo.
    pause
    exit /b 1
)

echo [1/2] Starting Backend (.NET API)...
start "TriLink Backend" cmd /k "cd backend && dotnet run"

echo.
echo [2/2] Starting Frontend (React + Vite)...
start "TriLink Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo Both services are starting...
echo ========================================
echo.
echo Backend: https://localhost:7033
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window (services will continue running)
pause
