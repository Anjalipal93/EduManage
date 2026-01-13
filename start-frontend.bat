@echo off
echo ====================================
echo   EduManage - Starting Frontend
echo ====================================
echo.

cd frontend

echo Checking if node_modules exists...
if not exist "node_modules\" (
    echo Installing dependencies...
    echo This may take a few minutes...
    call npm install
    echo.
)

echo Starting frontend development server...
echo Frontend will open at http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

call npm start

