# Complete Registration & Login Backend Setup

This guide walks you through setting up the complete authentication system for IGSL Portal.

## 📋 Architecture Overview

```
Frontend (Next.js)
    ↓
API Routes (/app/api/auth/)
    ↓
Backend Server (Express.js)
    ↓
AuthService (Business Logic)
    ↓
Database (PostgreSQL + Prisma)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 22+
- PostgreSQL 12+
- Yarn or npm

### Step 1: Setup Backend

```bash
cd backend

# Install dependencies
yarn install

# Create .env file
cp .env.example .env

# Update DATABASE_URL in .env
# Example: DATABASE_URL="postgresql://username:password@localhost:5432/igsl_db"

# Run migrations
yarn migrate

# Start backend server
yarn dev
```

Backend will run on `http://localhost:3001`

### Step 2: Setup Frontend

```bash
# From project root
cd .. # if in backend folder

# Install dependencies (if not already done)
yarn install

# Create/verify .env.local exists with:
# NEXT_PUBLIC_BACKEND_URL=http://localhost:3001

# Start frontend development
yarn dev
```

Frontend will run on `http://localhost:3000`

### Step 3: Test Authentication

Visit:
- **Register**: `http://localhost:3000/auth/register`
- **Login**: `http://localhost:3000/auth/login`

## 📡 API Endpoints

All endpoints are available at `http://localhost:3001/api/auth/`

### Authentication Routes

#### 1. Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "phone": "+2348012345678"
}

Response:
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": "uuid",
    "fullName": "john_doe",
    "email": "john@example.com",
    "phone": "+2348012345678",
    "userType": "CITIZEN",
    "createdAt": "2026-04-12T..."
  }
}
```

#### 2. Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",  // Can be email, phone, or fullName
  "password": "SecurePass123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "fullName": "john_doe",
    "email": "john@example.com",
    "userType": "CITIZEN",
    "isEmailVerified": false,
    "isPhoneVerified": false,
    "lastLoginAt": "2026-04-12T..."
  }
}
```

#### 3. Verify Email OTP
```
POST /api/auth/verify-email-otp
Content-Type: application/json

{
  "userId": "user-uuid",
  "otp": "123456"
}

Response:
{
  "success": true,
  "message": "Email verified successfully"
}
```

#### 4. Forgot Password
```
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}

Response:
{
  "success": true,
  "message": "Password reset email sent"
}
```

#### 5. Reset Password
```
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "john@example.com",
  "resetToken": "token-from-email",
  "newPassword": "NewPassword123"
}

Response:
{
  "success": true,
  "message": "Password reset successful"
}
```

#### 6. Verify Token
```
POST /api/auth/verify-token
Content-Type: application/json

{
  "token": "jwt-token"
}

Response:
{
  "valid": true,
  "decoded": {
    "userId": "uuid",
    "email": "john@example.com",
    "userType": "CITIZEN",
    "role": null,
    "iat": 1712929200,
    "exp": 1713534000
  }
}
```

## 🗄️ Database Setup

### Create PostgreSQL Database

```sql
-- As PostgreSQL admin user
CREATE DATABASE igsl_db WITH ENCODING 'UTF8';
CREATE USER igsl_user WITH PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE igsl_db TO igsl_user;
```

### Prisma Setup

```bash
cd backend

# Run initial migration
npx prisma migrate dev --name init

# Seed database (optional)
npx prisma db seed

# View database in Prisma Studio
npx prisma studio
```

## 🔐 Security Checklist

- [ ] Change `JWT_SECRET` in `.env` (min 32 characters in production)
- [ ] Use HTTPS in production
- [ ] Enable CORS for your domain only
- [ ] Use environment variables for sensitive data
- [ ] Implement rate limiting on auth endpoints
- [ ] Add email verification requirement
- [ ] Implement password reset email verification
- [ ] Use secure cookies (HttpOnly, Secure, SameSite)
- [ ] Enable CSRF protection
- [ ] Log all authentication events

## 📁 Project Structure

```
igsl-website/
├── app/
│   ├── api/auth/
│   │   ├── register/route.ts      # Registration API
│   │   ├── login/route.ts         # Login API
│   │   ├── verify-email/route.ts  # Email verification
│   │   ├── forgot-password/route.ts
│   │   ├── reset-password/route.ts
│   │   └── verify-token/route.ts
│   ├── auth/
│   │   ├── register/page.tsx      # Register page
│   │   ├── login/page.tsx         # Login page
│   │   └── layout.tsx
│   └── ...
├── components/
│   └── forms/
│       ├── register-form.tsx
│       └── login-form.tsx
├── .env.local                      # Frontend env
└── middleware.ts                   # Auth middleware
│
backend/
├── services/
│   └── authService.js              # Auth business logic
├── prisma/
│   ├── schema.prisma               # Database schema
│   └── migrations/
├── server.js                        # Express server
├── package.json
└── .env                             # Backend env (local)
```

## 🛠️ Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=IGSL Portal
```

### Backend (.env)
```env
DATABASE_URL=postgresql://igsl_user:password@localhost:5432/igsl_db
DIRECT_URL=postgresql://igsl_user:password@localhost:5432/igsl_db
JWT_SECRET=your-super-secret-key-min-32-chars-in-production
JWT_EXPIRE=7d
PORT=3001
NODE_ENV=development
```

## 🧪 Testing

### Test Registration
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username":"testuser",
    "email":"test@example.com",
    "password":"TestPass123",
    "phone":"+2348012345678"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username":"testuser",
    "password":"TestPass123"
  }'
```

## 🐛 Troubleshooting

### Backend won't start
- Check if port 3001 is already in use
- Verify DATABASE_URL is correct
- Run `npm install` in backend folder
- Check for errors: `node backend/server.js`

### Database connection fails
- Verify PostgreSQL is running
- Check DATABASE_URL format
- Ensure database and user exist
- Run `yarn migrate` to create tables

### Registration/Login returns 503
- Backend server is not running
- Check `NEXT_PUBLIC_BACKEND_URL` in frontend
- Check backend logs for errors

### Passwords not matching
- Ensure bcryptjs is installed: `npm install bcryptjs`
- Check PASSWORD hash rounds (default: 10)

### JWT token invalid
- Change JWT_SECRET and retokenize
- Check token expiration
- Verify token hasn't been tampered with

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Official](https://www.postgresql.org/docs/)

## 🚢 Deployment

### Backend Deployment (Heroku/Railway/Render)

```bash
# 1. Create .env for production
# 2. Push to Git
# 3. Connect to deployment platform
# 4. Set environment variables
# 5. Run migrations: yarn migrate:deploy
# 6. Deploy
```

### Frontend Deployment (Vercel)

```bash
# 1. Connect GitHub repo to Vercel
# 2. Set NEXT_PUBLIC_BACKEND_URL environment variable
# 3. Deploy automatically or manually
```

## 📞 Support

For issues or questions, refer to:
- Backend README: `/backend/README.md`
- AuthService Documentation: `/backend/services/authService.js`
