@echo off
echo ====================================================
echo Starting Personal Finance Tracker (Unified Port Mode)
echo ====================================================

:: Step 1: Check and build frontend
echo [1/2] Building frontend...
cd frontend
if not exist node_modules (
    echo node_modules not found. Installing frontend dependencies...
    call npm install
)
call npm run build
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Frontend build failed!
    pause
    exit /b %ERRORLEVEL%
)
cd ..

:: Step 2: Run backend
echo [2/2] Starting backend on http://localhost:8081...
cd backend
call mvn spring-boot:run
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Backend failed to start!
    pause
    exit /b %ERRORLEVEL%
)
cd ..
