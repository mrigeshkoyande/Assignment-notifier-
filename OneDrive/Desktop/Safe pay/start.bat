@echo off
title Safe-Pay AI Launcher
color 0B

echo.
echo  ==============================================
echo   SAFE-PAY AI  --  Multi-Agent Fraud Prevention
echo  ==============================================
echo.

:: Check for .env file
if not exist .env (
    echo  [!] .env file not found — copying from .env.example
    copy .env.example .env
    echo  [!] Please edit .env and add your GOOGLE_API_KEY
    echo.
)

:: Activate virtual environment if present
if exist .venv\Scripts\activate.bat (
    echo  [*] Activating Python virtual environment...
    call .venv\Scripts\activate.bat
) else (
    echo  [!] No .venv found — using system Python
)

:: Install Python deps
echo  [*] Checking Python dependencies...
pip install -r requirements.txt -q

:: Install frontend deps
if not exist frontend\node_modules (
    echo  [*] Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

echo.
echo  [*] Starting Safe-Pay AI Backend (FastAPI)...
start "Safe-Pay AI Backend" cmd /k "python -m uvicorn backend.main:app --reload --port 8000"

timeout /t 3 /nobreak > nul

echo  [*] Starting Safe-Pay AI Frontend (Vite)...
start "Safe-Pay AI Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 4 /nobreak > nul

echo.
echo  ============================================
echo   SAFE-PAY AI IS RUNNING!
echo  ============================================
echo.
echo   Backend API:    http://localhost:8000
echo   Frontend UI:    http://localhost:5173
echo   API Docs:       http://localhost:8000/docs
echo.
echo   Press any key to open the app in your browser...
pause > nul

start http://localhost:5173
