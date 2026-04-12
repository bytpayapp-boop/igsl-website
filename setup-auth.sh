#!/bin/bash

# IGSL Authentication Setup Script
# This script sets up the complete authentication system

set -e

echo "🚀 IGSL Authentication Setup"
echo "=============================="
echo ""

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 22 ]; then
  echo "❌ Node.js 22+ required. Current: $(node -v)"
  echo "   Run: nvm install 22 && nvm use 22"
  exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Setup Backend
echo "📦 Setting up Backend..."
cd backend

if [ ! -f ".env" ]; then
  echo "  Creating .env from .env.example..."
  cp .env.example .env
  echo "  ⚠️  Please update DATABASE_URL in backend/.env"
fi

echo "  Installing dependencies..."
yarn install --silent

echo "  Generating Prisma client..."
yarn generate --silent

echo "✅ Backend setup complete!"
echo ""

# Return to root
cd ..

# Setup Frontend
echo "📦 Setting up Frontend..."

if [ ! -f ".env.local" ]; then
  echo "  Creating .env.local..."
  cat > .env.local << 'EOF'
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=IGSL Portal
NEXT_PUBLIC_APP_DESCRIPTION=Iseyin Local Government Portal
EOF
  echo "  ✅ .env.local created"
else
  echo "  .env.local already exists"
fi

echo "  Installing frontend dependencies..."
yarn install --silent

echo "✅ Frontend setup complete!"
echo ""

# Print instructions
echo "=================================================="
echo "✅ Setup Complete!"
echo "=================================================="
echo ""
echo "📝 Next Steps:"
echo ""
echo "1️⃣  Update Backend Database"
echo "   - Edit: backend/.env"
echo "   - Set DATABASE_URL to your PostgreSQL connection"
echo "   - Then run: cd backend && yarn migrate"
echo ""
echo "2️⃣  Start Backend Server (in new terminal)"
echo "   - cd backend && yarn dev"
echo "   - Backend will run on http://localhost:3001"
echo ""
echo "3️⃣  Start Frontend (in new terminal)"
echo "   - yarn dev"
echo "   - Frontend will run on http://localhost:3000"
echo ""
echo "4️⃣  Test Authentication"
echo "   - Register: http://localhost:3000/auth/register"
echo "   - Login: http://localhost:3000/auth/login"
echo ""
echo "📚 Documentation:"
echo "   - Setup Guide: ./AUTHENTICATION_SETUP.md"
echo "   - Backend API: ./backend/README.md"
echo ""
echo "=================================================="
