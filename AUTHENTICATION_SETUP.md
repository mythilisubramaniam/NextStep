# Authentication Setup Guide

## Overview
This application uses a complete email verification-based authentication system with session management.

## Features
- ✅ Email verification with OTP (6-digit code)
- ✅ Session-based authentication
- ✅ Password reset flow
- ✅ User and Admin role management
- ✅ Account blocking/unblocking
- ✅ Referral system with wallet
- ✅ Cloudinary integration for image uploads

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Update the `.env` file with your credentials:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/nextstep

# Server
PORT=3000
SESSION_SECRET=your-secret-key-here

# Email (Gmail)
EMAIL_USER=mythimythi60@gmail.com
EMAIL_PASS=your-gmail-app-password

# Cloudinary (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Admin Account
ADMIN_EMAIL=admin@nextstep.com
ADMIN_PASSWORD=Admin@123
```

### 3. Gmail App Password Setup
1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Go to Security → App Passwords
4. Generate a new app password for "Mail"
5. Copy the 16-character password to `EMAIL_PASS` in `.env`

### 4. Start the Server
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

### 5. Default Admin Account
On first startup, a default admin account is created:
- **Email**: admin@nextstep.com (or from .env)
- **Password**: Admin@123 (or from .env)
- **Access**: http://localhost:3000/admin/login

⚠️ **Important**: Change the admin password after first login!

## Authentication Flow

### User Registration
1. User fills signup form with email, password, phone, name
2. Optional: Enter referral code (gets ₹50 bonus)
3. System sends 6-digit OTP to email (expires in 10 minutes)
4. User verifies OTP
5. Account is activated
6. If referred, referrer gets ₹100 bonus

### User Login
1. User enters email and password
2. System checks if account is verified
3. If not verified, sends OTP for verification
4. If verified, creates session and redirects to home

### Password Reset
1. User clicks "Forgot Password"
2. Enters email address
3. Receives OTP via email
4. Verifies OTP
5. Sets new password
6. Redirects to login

### Admin Login
1. Admin enters credentials at `/admin/login`
2. System verifies admin role
3. Creates session and redirects to dashboard

## Session Management

Sessions are stored in MongoDB using `connect-mongo`:
- **Duration**: 24 hours
- **Storage**: MongoDB collection `sessions`
- **Cookie**: `connect.sid` (HTTP-only)

## Security Features

1. **Password Hashing**: bcrypt with 10 salt rounds
2. **OTP Expiry**: 10 minutes
3. **Session Expiry**: 24 hours
4. **Account Blocking**: Admins can block users
5. **Email Verification**: Required before login
6. **CSRF Protection**: Session-based (no tokens needed)

## API Endpoints

### User Routes
- `GET /user/signup` - Signup page
- `POST /user/signup` - Create account
- `GET /user/login` - Login page
- `POST /user/login` - Authenticate user
- `GET /user/verifyOtp` - OTP verification page
- `POST /user/verifyOtp` - Verify OTP
- `POST /user/resendOtp` - Resend OTP
- `GET /user/forgotPassword` - Forgot password page
- `POST /user/sendOtp` - Send reset OTP
- `GET /user/resetPassword` - Reset password page
- `POST /user/resetPassword` - Update password
- `POST /user/logout` - Destroy session

### Admin Routes
- `GET /admin/login` - Admin login page
- `POST /admin/login` - Authenticate admin
- `GET /admin/dashboard` - Admin dashboard
- `GET /admin/customers` - Customer management
- `PATCH /admin/customers/:id/block-unblock` - Toggle user status

## Middleware

### Authentication Middleware (`middlewares/auth.js`)

```javascript
// Protect user routes
router.get('/profile', isUserAuthenticated, controller.loadProfile);

// Protect admin routes
router.get('/dashboard', isAdminAuthenticated, controller.loadDashboard);

// Redirect if already logged in
router.get('/login', isUserLoggedIn, controller.loadLogin);
```

## Database Models

### User Model
- firstName, lastName, email, phone, password
- role (user/admin)
- isVerified, isBlocked, isActive
- wallet, referralCode, referredBy
- signupMethod (email/google)
- timestamps (createdAt, updatedAt)

### OTP Verification Model
- email, otp, expiry
- Auto-deletes after verification

### Address Model
- user, name, phone, pincode, city, state
- houseNumber, locality, landmark
- isDefault

## Troubleshooting

### OTP Not Received
1. Check Gmail App Password is correct
2. Check spam/junk folder
3. Verify EMAIL_USER and EMAIL_PASS in .env
4. Check console logs for OTP (development only)

### Session Issues
1. Clear browser cookies
2. Restart server
3. Check MongoDB connection
4. Verify SESSION_SECRET is set

### Admin Can't Login
1. Check if admin account was created (check console on startup)
2. Verify credentials match .env file
3. Try resetting admin password in database

## Development Tips

1. **View OTP in Console**: During development, OTPs are logged to console
2. **Test Email**: Use a real email address you can access
3. **Session Debugging**: Check `sessions` collection in MongoDB
4. **Auto-restart**: Use `npm run dev` for automatic server restart

## Production Checklist

- [ ] Change SESSION_SECRET to a strong random string
- [ ] Change default admin password
- [ ] Set up proper email service (not Gmail)
- [ ] Enable HTTPS
- [ ] Set secure cookie flags
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable MongoDB authentication
- [ ] Set up backup strategy
- [ ] Configure logging service
- [ ] Set up monitoring

## Support

For issues or questions, check:
1. Console logs for errors
2. MongoDB connection status
3. Email service configuration
4. Session storage in database
