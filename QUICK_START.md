# 🚀 IGSL Authentication System - Quick Start Guide

Complete setup for full-stack authentication with Express backend and Next.js frontend.

## ✅ What's Already Done

- ✅ **Frontend**: Register and Login forms integrated with axios
- ✅ **Backend**: Express server with complete auth routes
- ✅ **Database**: Prisma schema defined with 20+ models
- ✅ **Security**: bcryptjs password hashing, JWT tokens, OTP system
- ✅ **UI**: Professional gradient design with form validation
- ✅ **Environment**: Configuration files created for both frontend and backend

## 📋 Prerequisites

- **Node.js 22+** (required for Prisma streams)
- **PostgreSQL 12+** (database server)
- **npm/yarn** (package managers)

## 🚀 Installation & Setup

### Step 1: Database Setup

**Option A: Using PostgreSQL locally**
```bash
# Install PostgreSQL (macOS with Homebrew)
brew install postgresql
brew services start postgresql

# Create a new database
createdb igsl_db

# Create database user
psql postgres
# In psql:
CREATE USER igsluser WITH PASSWORD 'your_password_here';
ALTER ROLE igsluser WITH CREATEDB;
ALTER ROLE igsluser SUPERUSER;
\q
```

**Option B: Using PostgreSQL Docker** (recommended for testing)
```bash
docker run --name igsl-postgres \
  -e POSTGRES_USER=igsluser \
  -e POSTGRES_PASSWORD=your_password_here \
  -e POSTGRES_DB=igsl_db \
  -p 5432:5432 \
  -d postgres:15
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd /home/ezehmark/igsl-website/backend

# Update .env with your PostgreSQL credentials
# Edit .env file and set: DATABASE_URL and DIRECT_URL
# Example:
# DATABASE_URL="postgresql://igsluser:your_password_here@localhost:5432/igsl_db"
# DIRECT_URL="postgresql://igsluser:your_password_here@localhost:5432/igsl_db"

# Install dependencies
npm install
# or
yarn install

# Run Prisma migrations to create tables
npm run migrate
# or
yarn migrate

# Verify the database schema
npm run studio  # Opens Prisma Studio in browser
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory
cd /home/ezehmark/igsl-website/frontend

# Install dependencies (axios should already be there)
npm install
# or
yarn install

# The .env.local file is already configured:
# NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

## 🏃 Running the Application

### Terminal 1 - Start Backend Server

```bash
cd /home/ezehmark/igsl-website/backend

# Using npm
npm run dev

# or using yarn
yarn dev

# Server runs on http://localhost:3001
# Look for: "Server running on port 3001"
```

### Terminal 2 - Start Frontend Server

```bash
cd /home/ezehmark/igsl-website/frontend

# Using npm
npm run dev

# or using yarn
yarn dev

# Frontend runs on http://localhost:3000
# Look for: "ready - started server on 0.0.0.0:3000"
```

## 🧪 Testing the Authentication Flow

### 1. Register a New Account

1. Open browser: `http://localhost:3000/auth/register`
2. Fill in the form:
   - **Username**: Any username (3-20 characters)
   - **Email**: Valid email address
   - **Password**: At least 8 characters
   - **Confirm Password**: Must match password
   - **Terms**: Check the box
3. Click "Create Account"
4. ✅ Should see "Registration successful" toast and redirect to login

### 2. Login

1. Go to: `http://localhost:3000/auth/login`
2. Enter:
   - **Username/Email**: The username or email from registration
   - **Password**: The password you set
3. Click "Sign In"
4. ✅ Should see "Login successful" toast and redirect to dashboard
5. ✅ Auth token stored in localStorage

### 3. Verify Authentication

Open browser DevTools (F12):
```javascript
// In Console, check stored auth data:
localStorage.getItem('auth_token')  // Should show JWT token
localStorage.getItem('user')         // Should show user object
```

## 📁 Project Structure

```
/home/ezehmark/igsl-website/
├── frontend/                          # Next.js app
│   ├── app/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── page.tsx          # Login page
│   │   │   ├── register/
│   │   │   │   └── page.tsx          # Register page
│   │   │   └── layout.tsx            # Auth layout
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── forms/
│   │   │   ├── register-form.tsx    # Register form with axios
│   │   │   └── login-form.tsx       # Login form with axios
│   │   └── ui/                       # shadcn components
│   ├── .env.local                    # Frontend env (already created)
│   └── package.json
│
├── backend/                           # Express server
│   ├── services/
│   │   └── authService.js           # Auth business logic
│   ├── prisma/
│   │   └── schema.prisma            # Database schema
│   ├── server.js                    # Express server setup
│   ├── .env                         # Backend env (already created)
│   └── package.json
```

## 🔐 API Endpoints

All endpoints are on `http://localhost:3001/api/auth/`

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/register` | `{username, email, password, phone}` | `{message, appId}` |
| POST | `/login` | `{username, password}` | `{token, user}` |
| POST | `/verify-email` | `{otp}` | `{message}` |
| POST | `/forgot-password` | `{email}` | `{message}` |
| POST | `/reset-password` | `{resetToken, newPassword}` | `{message}` |
| POST | `/verify-token` | `{token}` | `{valid, user}` |
| GET | `/logout` | - | `{message}` |

## 🛠️ Environment Variables Explained

### Frontend (.env.local)
```
NEXT_PUBLIC_BACKEND_URL    # Backend server URL (must start with NEXT_PUBLIC_ to be accessible)
NEXT_PUBLIC_APP_NAME       # Application name
NEXT_PUBLIC_APP_DESCRIPTION # App description
```

### Backend (.env)
```
DATABASE_URL               # PostgreSQL connection string
DIRECT_URL                 # Direct connection string (for migrations)
JWT_SECRET                 # Secret key for token signing (min 32 chars for production)
JWT_EXPIRE                 # Token expiration time (e.g., "7d")
NODE_ENV                   # Environment type (development/production)
```

## 🐛 Troubleshooting

### Issue: "Cannot connect to database"
- **Solution**: Check PostgreSQL is running: `psql postgres -c "SELECT 1"`
- Update DATABASE_URL in `.env` with correct credentials

### Issue: "Port 3001 already in use"
```bash
# Kill the process using port 3001
lsof -ti :3001 | xargs kill -9

# Or use a different port in server.js
```

### Issue: "Module not found: 'axios'"
```bash
# Reinstall dependencies in frontend
cd frontend
npm install axios
# or
yarn add axios
```

### Issue: "CORS error" when calling backend
- Check `NEXT_PUBLIC_BACKEND_URL` in frontend/.env.local
- Verify backend CORS is enabled in server.js
- Make sure backend is running on port 3001

### Issue: Auth token not working
1. Check JWT_SECRET in backend/.env (should be 32+ characters)
2. Clear localStorage and try logging in again:
   ```javascript
   localStorage.clear()
   ```
3. Check browser console for error messages

## 📊 Database Schema Overview

Key tables in PostgreSQL:
- **User**: User accounts with encryption
- **OtpCode**: Email verification OTPs
- **StaffProfile**: Staff user extensions
- **Application**: Service applications
- **Certificate**: Generated certificates
- **Payment**: Payment records
- **AuditLog**: Action logging

See `/backend/prisma/schema.prisma` for full schema.

## 🚀 Next Steps

After successful authentication testing:

1. **Email Integration**: Configure email service in `.env` for forgot password emails
2. **Payment Setup**: Integrate Paystack/Flutterwave for payment processing
3. **Dashboard**: Create protected routes that check for valid JWT token
4. **Profile Management**: Implement user profile update endpoints
5. **Admin Panel**: Build admin interface in `/frontend/app/admin`

## 📚 Additional Resources

- **Express Docs**: https://expressjs.com/
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs/
- **PostgreSQL Docs**: https://www.postgresql.org/docs/

## 💡 Security Best Practices

- ✅ Passwords hashed with bcryptjs (10 salt rounds)
- ✅ JWTs signed with secret key (7-day expiration)
- ✅ CORS enabled only for frontend origin
- ✅ OTP codes expire after 10 minutes
- ✅ Password reset tokens expire after 1 hour
- ⚠️ TODO: Add rate limiting for auth endpoints
- ⚠️ TODO: Add HTTPS in production
- ⚠️ TODO: Implement refresh token rotation

## 📝 Notes

- Forms automatically redirect on success after 1.5 seconds
- Error messages appear as toast notifications
- All passwords are validated client and server-side
- User data stored in localStorage after login (can be enhanced with secure cookies)

---

**All files are prepared and ready to run!** Just ensure PostgreSQL is set up, then follow the installation steps above.
