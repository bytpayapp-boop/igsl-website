@echo off
REM IGSL Authentication Setup Script (Windows)
REM This script sets up the complete authentication system

echo.
echo 🚀 IGSL Authentication Setup
echo ==============================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if errorlevel 1 (
    echo ❌ Node.js is not installed
    echo   Download from: https://nodejs.org/
    exit /b 1
)

for /f "tokens=1" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node version: %NODE_VERSION%
echo.

REM Setup Backend
echo 📦 Setting up Backend...
cd backend

if not exist ".env" (
    echo   Creating .env from .env.example...
    copy .env.example .env
    echo   ⚠️  Please update DATABASE_URL in backend\.env
) else (
    echo   .env already exists
)

echo   Installing dependencies...
call yarn install --silent

echo   Generating Prisma client...
call yarn generate --silent

echo ✅ Backend setup complete!
echo.

REM Return to root
cd ..

REM Setup Frontend
echo 📦 Setting up Frontend...

if not exist ".env.local" (
    echo   Creating .env.local...
    (
        echo NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
        echo NEXT_PUBLIC_APP_NAME=IGSL Portal
        echo NEXT_PUBLIC_APP_DESCRIPTION=Iseyin Local Government Portal
    ) > .env.local
    echo   ✅ .env.local created
) else (
    echo   .env.local already exists
)

echo   Installing frontend dependencies...
call yarn install --silent

echo ✅ Frontend setup complete!
echo.

REM Print instructions
echo ==================================================
echo ✅ Setup Complete!
echo ==================================================
echo.
echo 📝 Next Steps:
echo.
echo 1️⃣  Update Backend Database
echo    - Edit: backend\.env
echo    - Set DATABASE_URL to your PostgreSQL connection
echo    - Then run: cd backend ^&^& yarn migrate
echo.
echo 2️⃣  Start Backend Server (in new terminal)
echo    - cd backend ^&^& yarn dev
echo    - Backend will run on http://localhost:3001
echo.
echo 3️⃣  Start Frontend (in new terminal)
echo    - yarn dev
echo    - Frontend will run on http://localhost:3000
echo.
echo 4️⃣  Test Authentication
echo    - Register: http://localhost:3000/auth/register
echo    - Login: http://localhost:3000/auth/login
echo.
echo 📚 Documentation:
echo    - Setup Guide: .\AUTHENTICATION_SETUP.md
echo    - Backend API: .\backend\README.md
echo.
echo ==================================================
echo.
