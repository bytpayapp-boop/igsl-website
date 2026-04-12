# IGSL Backend API

Complete backend service for IGSL Local Government portal with authentication, user management, and certificate processing.

## Setup

### Prerequisites
- Node.js 22+ (required for Prisma)
- PostgreSQL database
- Yarn or npm

### Installation

1. Install dependencies:
```bash
yarn install
# or
npm install
```

2. Create `.env` file in the backend directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/igsl_db"
DIRECT_URL="postgresql://user:password@localhost:5432/igsl_db"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
```

3. Run Prisma migrations:
```bash
npx prisma migrate dev --name init
```

4. Generate Prisma client:
```bash
npx prisma generate
```

5. Access Prisma Studio (optional, for database management):
```bash
npx prisma studio
```

## AuthService API

Complete authentication service with registration, login, password management, and verification.

### Methods

#### 1. **Register User**
```javascript
const result = await AuthService.register({
  username: "john_doe",
  email: "john@example.com",
  password: "SecurePass123",
  phone: "+2348012345678",
  lgaId: "lga-uuid" // Optional, defaults to "default-lga"
})

// Response:
// {
//   success: true,
//   message: "Registration successful",
//   user: {
//     id: "user-uuid",
//     fullName: "john_doe",
//     email: "john@example.com",
//     phone: "+2348012345678",
//     userType: "CITIZEN",
//     createdAt: "2026-04-12T..."
//   }
// }
```

#### 2. **Login User**
```javascript
const result = await AuthService.login({
  username: "john@example.com", // Can be email, phone, or fullName
  password: "SecurePass123"
})

// Response:
// {
//   success: true,
//   message: "Login successful",
//   token: "eyJhbGciOiJIUzI1NiIs...",
//   user: {
//     id: "user-uuid",
//     fullName: "john_doe",
//     email: "john@example.com",
//     userType: "CITIZEN",
//     isEmailVerified: false,
//     lastLoginAt: "2026-04-12T..."
//   }
// }
```

#### 3. **Verify JWT Token**
```javascript
const result = AuthService.verifyToken(token)

// Response:
// {
//   valid: true,
//   decoded: {
//     userId: "user-uuid",
//     email: "john@example.com",
//     userType: "CITIZEN",
//     role: null,
//     iat: 1712929200,
//     exp: 1713534000
//   }
// }
```

#### 4. **Generate Password Reset Token**
```javascript
const result = await AuthService.generatePasswordResetToken("john@example.com")

// Response:
// {
//   success: true,
//   resetToken: "abc123def456...", // Send this via email to user
//   message: "Reset token generated"
// }
```

#### 5. **Reset Password**
```javascript
const result = await AuthService.resetPassword(
  "john@example.com",
  "abc123def456...", // From email
  "NewPassword123"
)

// Response:
// {
//   success: true,
//   message: "Password reset successful"
// }
```

#### 6. **Update Password**
```javascript
const result = await AuthService.updatePassword(
  "user-uuid",
  "OldPassword123",
  "NewPassword123"
)

// Response:
// {
//   success: true,
//   message: "Password updated successfully"
// }
```

#### 7. **Get User Profile**
```javascript
const result = await AuthService.getUserProfile("user-uuid")

// Response:
// {
//   success: true,
//   user: {
//     id: "user-uuid",
//     firstName: "John",
//     lastName: "Doe",
//     fullName: "john_doe",
//     email: "john@example.com",
//     phone: "+2348012345678",
//     gender: null,
//     dateOfBirth: null,
//     occupation: null,
//     userType: "CITIZEN",
//     isEmailVerified: false,
//     isPhoneVerified: false,
//     staffProfile: null,
//     addresses: [],
//     createdAt: "2026-04-12T..."
//   }
// }
```

#### 8. **Update User Profile**
```javascript
const result = await AuthService.updateUserProfile("user-uuid", {
  firstName: "Jonathan",
  lastName: "Doe",
  gender: "MALE",
  dateOfBirth: "1990-05-15",
  occupation: "Software Engineer",
  profilePhotoUrl: "https://example.com/photo.jpg"
})

// Response:
// {
//   success: true,
//   message: "Profile updated successfully",
//   user: {
//     id: "user-uuid",
//     firstName: "Jonathan",
//     lastName: "Doe",
//     updatedAt: "2026-04-12T..."
//   }
// }
```

#### 9. **Send Email Verification OTP**
```javascript
const result = await AuthService.sendEmailVerificationOtp("user-uuid")

// Response:
// {
//   success: true,
//   message: "OTP sent to email",
//   otp: "123456" // Only in development, remove in production
// }
```

#### 10. **Verify Email OTP**
```javascript
const result = await AuthService.verifyEmailOtp("user-uuid", "123456")

// Response:
// {
//   success: true,
//   message: "Email verified successfully"
// }
```

#### 11. **Logout**
```javascript
const result = await AuthService.logout("user-uuid")

// Response:
// {
//   success: true,
//   message: "Logged out successfully"
// }
```

## Password Requirements

- **Minimum length**: 8 characters
- **Allowed characters**: Any character (letters, numbers, symbols)
- **No complexity requirements** for simplicity

## Username Requirements

- **Length**: 3-20 characters
- **Allowed characters**: Any character

## Error Handling

All service methods return a consistent response format:

```javascript
// Success
{
  success: true,
  message: "...",
  [data]: ...
}

// Error
{
  success: false,
  message: "Error description"
}
```

## Database Models

### User Model
Core user record with identity and account information.

**Key Fields:**
- `id`: UUID primary key
- `email`: Unique email address
- `phone`: Unique phone number
- `passwordHash`: Bcrypted password hash
- `fullName`: User's full name
- `userType`: CITIZEN or STAFF
- `isEmailVerified`: Email verification status
- `isPhoneVerified`: Phone verification status
- `resetTokenHash`: Hashed password reset token
- `resetTokenExpiry`: Reset token expiration

### OtpCode Model
Temporary OTP records for verification.

**Key Fields:**
- `id`: UUID primary key
- `userId`: Associated user
- `code`: 6-digit OTP code
- `type`: EMAIL_VERIFICATION, PHONE_VERIFICATION, or PASSWORD_RESET
- `expiresAt`: Expiration timestamp (10 minutes)
- `isUsed`: Boolean flag for used codes
- `attempts`: Failed verification attempts

## Security Features

✅ **Password Hashing**: Bcryptjs with 10 salt rounds  
✅ **JWT Tokens**: 7-day expiration  
✅ **OTP Verification**: 10-minute validity  
✅ **Password Reset Tokens**: 1-hour validity, single-use  
✅ **Rate Limiting**: (To be implemented)  
✅ **Input Validation**: Email, phone, password validation  

## Environment Variables

```env
DATABASE_URL              # PostgreSQL connection string
DIRECT_URL                # Direct database URL (no connection pooling)
JWT_SECRET                # Secret key for JWT signing (min 32 chars in production)
JWT_EXPIRE                # Token expiration time (default: "7d")
```

## Best Practices

1. **Always use HTTPS** in production
2. **Change JWT_SECRET** in production
3. **Use environment variables** for sensitive data
4. **Implement rate limiting** on auth endpoints
5. **Log security events** for audit trails
6. **Validate input** on frontend and backend
7. **Use password managers** for strong passwords

## Running Migrations

Create a new migration:
```bash
npx prisma migrate dev --name migration_name
```

Apply migrations:
```bash
npx prisma migrate deploy
```

Reset database (development only):
```bash
npx prisma migrate reset
```

## Connecting from Frontend

Use the API endpoints in your Next.js app:

```javascript
// Register
fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: "john_doe",
    email: "john@example.com",
    password: "SecurePass123",
    phone: "+2348012345678"
  })
})

// Login
fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: "john@example.com",
    password: "SecurePass123"
  })
})
```

## Troubleshooting

### "JWT_SECRET is missing"
Add `JWT_SECRET` to `.env` file

### "Cannot find module '@prisma/client'"
Run: `npx prisma generate`

### "relation "User" does not exist"
Run migrations: `npx prisma migrate dev`

### "Engine "node" is incompatible"
Upgrade Node.js to v22+: `nvm install 22 && nvm use 22`

## License

ISC
