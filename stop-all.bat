@echo off
title SkillSwap - Stopper
color 0C

echo =========================================================
echo              STOPPING SKILLSWAP SERVICES
echo =========================================================
echo.

echo [*] Terminating Node.js backend and frontend processes...
taskkill /F /IM node.exe >nul 2>&1

echo [*] SkillSwap services have been stopped.
echo.
pause
