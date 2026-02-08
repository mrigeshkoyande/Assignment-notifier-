@echo off
echo Starting Assignment Notifier App...

REM Start Python Backend
start "Python Backend" cmd /k "cd python-backend && py -3.11 server.py"

REM Start React Frontend
echo Starting React Frontend...
cd test-vite-app
start "React Frontend" cmd /k "npm run dev"

echo App started!
pause
