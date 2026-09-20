@echo off
title SkillSwap - Application Launcher
color 0B

echo =========================================================
echo               SKILLSWAP FULLSTACK LAUNCHER
echo =========================================================
echo.
echo [*] Database : MongoDB Atlas Cloud (mini_project)
echo [*] Backend  : Node.js / Express (http://localhost:5000)
echo [*] Frontend : Vite / React (http://localhost:5174)
echo.
echo [*] Note: Your database is cloud-hosted on MongoDB Atlas,
echo     so no local MongoDB service installation is needed.
echo =========================================================
echo.

:: 1. Launch Backend Server in a new window
echo [1/2] Starting Backend server (Port 5000)...
start "SkillSwap - Backend (Port 5000)" cmd /k "cd /d %~dp0backend && title SkillSwap - Backend && color 0A && echo =============================== && echo    SKILLSWAP BACKEND SERVER   && echo =============================== && npm run dev"

:: Wait 2 seconds for backend to initialize
timeout /t 2 /nobreak >nul

:: 2. Launch Frontend Server in a new window
echo [2/2] Starting Frontend Vite dev server (Port 5174)...
start "SkillSwap - Frontend (Port 5174)" cmd /k "cd /d %~dp0frontend && title SkillSwap - Frontend && color 09 && echo =============================== && echo    SKILLSWAP FRONTEND (VITE)  && echo =============================== && npm run dev"

:: Wait 3 seconds then open browser
timeout /t 3 /nobreak >nul
echo.
echo [*] Launching application in your default browser...
start http://localhost:5174

echo.
echo =========================================================
echo   All services launched successfully!
echo   Close individual terminal windows to stop a service.
echo =========================================================
echo.
pause
