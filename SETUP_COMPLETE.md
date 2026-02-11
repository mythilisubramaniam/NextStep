# ✅ Authentication System Setup Complete

## What's Been Configured

### 1. Email Verification System
- ✅ OTP-based email verification (6-digit code)
- ✅ OTP expires in 10 minutes
- ✅ Nodemailer configured with Gmail
- ✅ Email: mythimythi60@gmail.com

### 2. User Authentication
- ✅ Session-based authentication (24-hour sessions)
- ✅ Password hashing with bcrypt
- ✅ User signup with email verification
- ✅ User login with verification check
- ✅ Forgot password flow with OTP
- ✅ Password reset functionality

### 3. Admin System
- ✅ Admin role management
- ✅ Default admin account auto-creation
- ✅ Admin dashboard
- ✅ Customer management (view, block/unblock)
- ✅ Admin authentication middleware

### 4. Database Models
- ✅ User model (with roles, wallet, referral system)
- ✅ OTP Verification model
- ✅ Address model

### 5. Middleware
- ✅ User authentication middleware
- ✅ Admin authentication middleware
- ✅ Already logged in checks

### 6. Additional Features
- ✅ Referral system (wallet integration ready)
- ✅ Cloudinary configuration (for image uploads)
- ✅ Profile management
- ✅ Address management

## How to Start

### 1. Configure Email
Update `.env` file with your Gmail App Password:
```env
EMAIL_USER=mythimythi60@gmail.com
EMAIL_PASS=your-16-character-app-password
```

### 2. Start Server
```bash
npm start
```

### 3. Access Points

**User Routes:**
- Home: http://localhost:3000/
- Signup: http://localhost:3000/signup
- Login: http://localhost:3000/signin
- Forgot Password: http://localhost:3000/forgotPassword

**Admin Routes:**
- Admin Login: http://localhost:3000/admin/login
- Admin Dashboard: http://localhost:3000/admin/dashboard
- Customer Management: http://localhost:3000/admin/customers

**Default Admin Credentials:**
- Email: admin@nextstep.com
- Password: Admin@123

## Authentication Flow

### User Signup
1. User fills signup form
2. System sends 6-digit OTP to email
3. User verifies OTP
4. Account activated
5. Redirect to login

### User Login
1. User enters email/password
2. System checks if verified
3. If not verified, sends OTP
4. If verified, creates session
5. Redirect to home

### Password Reset
1. User enters email
2. System sends OTP
3. User verifies OTP
4. User sets new password
5. Redirect to login

## Files Created/Updated

### Configuration
- `backend/config/cloudinary.js` - Cloudinary setup
- `backend/config/initAdmin.js` - Admin initialization
- `backend/config/db.js` - MongoDB connection

### Models
- `models/User.js` - User schema with roles
- `models/OtpVerification.js` - OTP storage
- `models/Address.js` - User addresses
- `models/WalletTransaction.js` - Wallet transactions (optional)

### Middleware
- `middlewares/auth.js` - Authentication middleware

### Services
- `services/userService.js` - User business logic
- `services/adminService.js` - Admin business logic

### Controllers
- `controllers/userController/userController.js` - User routes
- `controllers/adminController/adminController.js` - Admin routes

### Routes
- `router/userRouter.js` - User endpoints
- `router/adminRouter.js` - Admin endpoints

### Views
- `views/user/signup.ejs` - Signup page
- `views/user/signin.ejs` - Login page
- `views/user/verifyOtp.ejs` - OTP verification
- `views/user/forgotPassword.ejs` - Forgot password
- `views/user/resetPassword.ejs` - Reset password
- `views/user/profile.ejs` - User profile
- `views/user/editProfile.ejs` - Edit profile
- `views/user/addresses.ejs` - Address management
- `views/admin/dashboard.ejs` - Admin dashboard
- `views/admin/users.ejs` - Customer management

## Environment Variables

```env
# Database
MONGODB_URI=mongodb://localhost:27017/nextstep

# Server
PORT=3000
SESSION_SECRET=your-secret-key-here

# Email (Gmail)
EMAIL_USER=mythimythi60@gmail.com
EMAIL_PASS=your-gmail-app-password

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Admin Account
ADMIN_EMAIL=admin@nextstep.com
ADMIN_PASSWORD=Admin@123
```

## Next Steps

1. ✅ Set up Gmail App Password
2. ✅ Start the server
3. ✅ Test user signup flow
4. ✅ Test admin login
5. ⏳ Add product management
6. ⏳ Add order management
7. ⏳ Add payment integration
8. ⏳ Add cart functionality

## Security Notes

- Passwords are hashed with bcrypt (10 rounds)
- Sessions stored in MongoDB
- OTP expires in 10 minutes
- Email verification required before login
- Admin role protected routes
- User blocking functionality

## Troubleshooting

### OTP Not Received
1. Check Gmail App Password in .env
2. Check spam folder
3. View OTP in console logs (development)

### Can't Login
1. Verify email first (check for OTP)
2. Check if account is blocked
3. Clear browser cookies

### Admin Can't Access
1. Check if admin was created (console on startup)
2. Use correct credentials from .env
3. Access /admin/login (not /user/login)

## Support

For detailed setup instructions, see:
- `AUTHENTICATION_SETUP.md` - Complete authentication guide
- `EMAIL_SETUP_GUIDE.md` - Gmail configuration

---

**Status**: ✅ Ready for Development
**Last Updated**: February 11, 2026
