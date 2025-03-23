@echo off
echo QEasy Demo Launcher
echo ===================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo Node.js is not installed or not in your PATH.
  echo Please install Node.js from https://nodejs.org/
  echo.
  echo As an alternative, we'll open the static demo HTML file.
  echo.
  timeout /t 3
  start static-demo.html
  echo Static demo opened. Note that this only shows the landing page.
  echo For the full application with QR scanning and ordering, Node.js is required.
  goto end
)

REM If Node.js is installed, try to run the application
echo Node.js detected! Attempting to start the QEasy application...
echo.

REM Check if dependencies are installed
if not exist node_modules (
  echo Installing dependencies...
  npm install
)

REM Start the application
echo Starting QEasy application...
npm start

:end
echo.
echo Thanks for using QEasy! 