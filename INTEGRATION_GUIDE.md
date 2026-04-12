# 🔗 Frontend-Backend Integration Guide

## How Axios Connects Frontend to Backend

### Environment Configuration

**Frontend** (`/frontend/.env.local`):
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

This URL is used in both forms:
```typescript
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'
```

### Register Form Integration

**Location**: `/frontend/components/forms/register-form.tsx`

**Axios Call** (Line 105):
```typescript
const response = await axios.post(`${BACKEND_URL}/api/auth/register`, {
  username: formData.username,
  email: formData.email,
  password: formData.password,
  phone: '',  // Backend requires phone field
})
```

**Endpoint on Backend**: `POST /api/auth/register`

**Data Flow**:
1. User fills register form
2. Form validates locally
3. Axios sends POST to `http://localhost:3001/api/auth/register`
4. Backend processes in `authService.registerUser()`
5. Response contains success message
6. Toast shows success, then redirects to login

**Response Structure**:
```json
{
  "message": "User registered successfully",
  "appId": "user-uuid-here"
}
```

### Login Form Integration

**Location**: `/frontend/components/forms/login-form.tsx`

**Axios Call** (Line 75):
```typescript
const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
  username: formData.username,
  password: formData.password,
})
```

**Endpoint on Backend**: `POST /api/auth/login`

**Data Flow**:
1. User enters username/email and password
2. Form validates locally
3. Axios sends POST to `http://localhost:3001/api/auth/login`
4. Backend finds user and verifies password
5. JWT token generated for 7 days
6. Response contains token and user data
7. Frontend stores both in localStorage
8. Redirects to dashboard

**Response Structure**:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-uuid",
    "username": "username",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "userType": "member",
    "emailVerified": false,
    "createdAt": "2024-04-12T10:30:00Z"
  }
}
```

### Error Handling

Both forms handle errors consistently:

```typescript
try {
  const response = await axios.post(`${BACKEND_URL}/api/auth/...`, {...})
  // Success handling
} catch (error: any) {
  const message = error.response?.data?.message || 'Operation failed'
  toast.error(message)
  console.error('Error:', error)
} finally {
  setIsLoading(false)
}
```

**Error Response Format**:
```json
{
  "error": "error_code",
  "message": "Human readable error message"
}
```

## Backend Endpoints Reference

### Register Endpoint
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "string (required)",
  "email": "string (required)",
  "password": "string (required)",
  "phone": "string (optional)"
}
```

**Success Response** (201):
```json
{
  "message": "User registered successfully",
  "appId": "uuid"
}
```

**Error Responses** (400, 409, 500):
```json
{
  "error": "VALIDATION_ERROR|DUPLICATE_USER|SERVER_ERROR",
  "message": "Detailed error message"
}
```

### Login Endpoint
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "string (email or username)",
  "password": "string"
}
```

**Success Response** (200):
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "username": "username",
    "email": "email@domain.com",
    "firstName": "First",
    "lastName": "Last",
    "userType": "member",
    "emailVerified": false,
    "createdAt": "2024-04-12T10:30:00Z"
  }
}
```

**Error Responses** (401, 404, 500):
```json
{
  "error": "INVALID_CREDENTIALS|USER_NOT_FOUND|SERVER_ERROR",
  "message": "Invalid username or password"
}
```

## How to Test the Integration

### Using Browser Console

```javascript
// Test if backend is reachable
fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'test', password: 'test' })
}).then(r => r.json()).then(console.log)

// Check stored token after login
console.log(localStorage.getItem('auth_token'))
console.log(localStorage.getItem('user'))
```

### Using curl

```bash
# Test Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "phone": "1234567890"
  }'

# Test Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

### Using Postman

1. Create new POST request
2. URL: `http://localhost:3001/api/auth/register`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "phone": "1234567890"
}
```
5. Click Send

## Debugging Common Issues

### CORS Error
```
Access to XMLHttpRequest at 'http://localhost:3001/api/auth/login' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution**:
- Verify backend has CORS enabled: Check `server.js` for `cors()` middleware
- Verify `NEXT_PUBLIC_BACKEND_URL` is set correctly
- Ensure backend is running on port 3001

### "Cannot POST /api/auth/login"
**Solution**:
- Check backend is running: `npm run dev` in `/backend`
- Verify Express routes are defined in `server.js`
- Check console output for any startup errors

### "Network Error"
**Solution**:
- Ensure both servers are running
- Check firewall isn't blocking localhost connections
- Try from curl: `curl http://localhost:3001`

### Token not storing in localStorage
**Solution**:
- Check browser DevTools → Application → Local Storage
- Verify login response includes `token` field
- Check for JavaScript errors in console

### Form submitting twice
**Solution**:
- Check `setIsLoading(false)` is in the `finally` block
- Verify button disabled state: `disabled={isLoading}`

## Security Considerations

### Frontend Side
- ✅ Passwords never logged to console
- ✅ Sensitive data only stored after successful auth
- ✅ HTTPS required in production (update to `https://` URL)
- ⚠️ localStorage can be accessed by XSS attacks (consider secure httpOnly cookies)

### Backend Side
- ✅ Password hashed with bcryptjs before saving
- ✅ JWT secret is 32+ characters (update in production)
- ✅ CORS restricts cross-origin requests
- ⚠️ Add rate limiting on auth endpoints
- ⚠️ Add HTTPS requirement in production

## Performance Tips

### Optimize Axios Requests
```typescript
// Create axios instance with defaults
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  timeout: 10000,
})

// Use it instead of full URL
const response = await api.post('/api/auth/login', {...})
```

### Add Request Interceptors
```typescript
api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### Add Response Interceptors
```typescript
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      localStorage.clear()
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)
```

## Next Steps with the Integration

1. **Test locally** - Start both servers and go through register/login flow
2. **Add authentication checks** - Create middleware for protected routes
3. **Store token properly** - Consider upgrading to httpOnly cookies
4. **Add logout** - Clear localStorage and redirect to login
5. **Refresh tokens** - Implement token refresh for longer sessions
6. **Error recovery** - Handle token expiration gracefully

## Files Involved in Integration

| File | Purpose | Axios Integration |
|------|---------|-------------------|
| `frontend/components/forms/register-form.tsx` | Register UI | `axios.post(/register)` |
| `frontend/components/forms/login-form.tsx` | Login UI | `axios.post(/login)` |
| `frontend/.env.local` | env config | Provides `NEXT_PUBLIC_BACKEND_URL` |
| `frontend/app/auth/register/page.tsx` | Register page | Imports RegisterForm |
| `frontend/app/auth/login/page.tsx` | Login page | Imports LoginForm |
| `backend/server.js` | Express server | Handles axios POST requests |
| `backend/services/authService.js` | Business logic | Processes register/login logic |
| `backend/.env` | env config | Database & JWT settings |

---

**Everything is wired up and ready to test!** Start both servers and navigate to the forms.
