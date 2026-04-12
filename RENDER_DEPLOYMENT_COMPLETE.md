# Render Deployment Configuration - Complete

## Task: Hardcode Backend URL to https://igsl-website.onrender.com

### Status: ✅ COMPLETE

## Changes Made

### 1. Frontend Forms - Hardcoded Backend URL
- **File**: `/frontend/components/forms/register-form.tsx`
  - Changed: `const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'`
  - To: `const BACKEND_URL = 'https://igsl-website.onrender.com'`

- **File**: `/frontend/components/forms/login-form.tsx`
  - Changed: `const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'`
  - To: `const BACKEND_URL = 'https://igsl-website.onrender.com'`

### 2. Frontend Environment Configuration
- **File**: `/frontend/.env.local`
  - Changed: `NEXT_PUBLIC_BACKEND_URL=http://localhost:3001`
  - To: `NEXT_PUBLIC_BACKEND_URL=https://igsl-website.onrender.com`

### 3. Backend CORS Configuration
- **File**: `/backend/server.js`
  - Updated CORS middleware to explicitly allow Render frontend domain
  - Configuration now includes both production and development origins:
    - `https://igsl-website.onrender.com` (production)
    - `http://localhost:3000` (development)

### 4. Backend Environment Configuration
- **File**: `/backend/.env`
  - Changed: `FRONTEND_URL="http://localhost:3000"` → `FRONTEND_URL="https://igsl-website.onrender.com"`
  - Changed: `BACKEND_URL="http://localhost:3001"` → `BACKEND_URL="https://igsl-website.onrender.com"`

## Verification

All axios API calls in the frontend now use the hardcoded Render URL:
- Register form: `axios.post('https://igsl-website.onrender.com/api/auth/register', ...)`
- Login form: `axios.post('https://igsl-website.onrender.com/api/auth/login', ...)`

Backend is configured to accept requests from the Render frontend domain via CORS.

## Result

Frontend and backend are now fully configured for production deployment on Render.

---
Completed: April 12, 2026
