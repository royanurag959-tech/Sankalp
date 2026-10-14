@echo off
echo ========================================================
echo  SANKALP (संकल्प) - Nasha Mukt Bharat AI Companion
echo  Help Today, A Better Tomorrow
echo ========================================================
echo.
echo Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "Sankalp Backend" cmd /k "cd backend && python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"

echo Starting Vite React Frontend on http://127.0.0.1:5173 ...
start "Sankalp Frontend" cmd /k "cd frontend && npm.cmd run dev -- --host 127.0.0.1 --port 5173"

echo.
echo Application launched!
echo Open your browser at: http://127.0.0.1:5173
echo.
pause
