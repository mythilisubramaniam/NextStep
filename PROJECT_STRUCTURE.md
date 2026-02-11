# Next Step E-Commerce Project Structure

## ✅ Verified and Cleaned Project Structure

```
NextStep/
├── backend/
│   └── config/
│       ├── db.js                    # MongoDB connection
│       ├── cloudinary.js            # Cloudinary configuration
│       └── initAdmin.js             # Admin initialization script
│
├── controllers/
│   ├── adminController/
│   │   └── adminController.js       # Admin business logic
│   └── userController/
│       └── userController.js        # User business logic
│
├── middlewares/
│   └── auth.js                      # Authentication middleware
│
├── models/
│   ├── Address.js                   # Address schema
│   ├── OtpVerification.js           # OTP verification schema
│   └── User.js                      # User schema with roles
│
├── public/
│   └── css/                         # Static CSS files
│
├── router/
│   ├── adminRouter.js               # Admin routes
│   └── userRouter.js                # User routes
│
├── services/
│   ├── adminService.js              # Admin service layer
│   └── userService.js               # User service layer
│
├── utils/
│   └── emailService.js              # Email sending utilities
│
├── views/
│   ├── admin/
│   │   ├── dashboard.ejs            # Admin dashboard
│   │   ├── signin.ejs               # Admin login page
│   │   └── users.ejs                # Customer management
│   ├── partials/
│   │   ├── adminNavbar.ejs          # Admin navigation bar
│   │   ├── adminSidebar.ejs         # Admin sidebar
│   │   ├── footer.ejs               # Footer component
│   │   ├── header.ejs               # Header component
│   │   ├── navbar.ejs               # User navigation bar
│   │   └── sidebar.ejs              # User sidebar
│   └── user/
│       ├── addresses.ejs            # Address management
│       ├── editProfile.ejs          # Edit profile page
│       ├── forgotPassword.ejs       # Forgot password page
│       ├── home.ejs                 # Home page
│       ├── profile.ejs              # User profile page
│       ├── resetPassword.ejs        # Reset password page
│       ├── signin.ejs               # User login page
│       ├── signup.ejs               # User registration page
│       └── verifyOtp.ejs            # OTP verification page
│
├── .env                             # Environment variables
├── .gitignore                       # Git ignore file
├── package.json                     # Dependencies
├── server.js                        # Main server file
│
└── Documentation/
    ├── AUTHENTICATION_SETUP.md      # Auth setup guide
    ├── EMAIL_SETUP_GUIDE.md         # Email configuration
    ├── PROJECT_STRUCTURE.md         # This file
    ├── SETUP_COMPLETE.md            # Setup summary
    └── TESTING_CHECKLIST.md         # Testing guide
```

## File Purposes

### Backend Configuration
- **db.js**: MongoDB connection with error handling
- **cloudinary.js**: Cloudinary setup for image uploads
- **initAdmin.js**: Creates default admin account on startup

### Controllers
- **adminController.js**: Handles admin dashboard, customer management
- **userController.js**: Handles user authentication, profile, addresses

### Middlewares
- **auth.js**: 
  - `isUserAuthenticated`: Protects user routes
  - `isAdminAuthenticated`: Protects admin routes
  - `isUserLoggedIn`: Redirects if already logged in
  - `isAdminLoggedIn`: Redirects admin if already logged in

### Models
- **User.js**: User schema with:
  - Authentication fields (email, password, role)
  - Profile fields (firstName, lastName, phone)
  - Status fields (isVerified, isBlocked, isActive)
  - Referral system (referralCode, referredBy, wallet)
  - Google OAuth support (googleId, signupMethod)
  
- **OtpVerification.js**: Temporary OTP storage
  - email, otp, expiry
  - Auto-deletes after verification

- **Address.js**: User address storage
  - User reference, address details
  - Default address management

### Routes

#### User Routes (`/`)
- Authentication: `/signup`, `/signin`, `/logout`
- Password: `/forgotPassword`, `/resetPassword`
- OTP: `/verifyOtp`, `/resendOtp`
- Profile: `/profile`, `/profile/edit`
- Addresses: `/addresses`, `/address/*`

#### Admin Routes (`/admin`)
- Authentication: `/admin/login`
- Dashboard: `/admin/dashboard`
- Customers: `/admin/customers`, `/admin/customers/:id/block-unblock`

### Services
- **userService.js**: Business logic for:
  - User signup with validation
  - Login with verification check
  - OTP generation and verification
  - Password reset flow
  
- **adminService.js**: Business logic for:
  - Admin authentication
  - Customer management
  - Statistics

### Views

#### Admin Views
- **dashboard.ejs**: Shows customer statistics
- **signin.ejs**: Admin login form
- **users.ejs**: Customer list with filters, search, pagination

#### User Views
- **home.ejs**: Landing page with categories and products
- **signup.ejs**: Registration form with validation
- **signin.ejs**: Login form
- **verifyOtp.ejs**: OTP verification with timer
- **forgotPassword.ejs**: Email input for password reset
- **resetPassword.ejs**: New password form
- **profile.ejs**: View user profile
- **editProfile.ejs**: Edit profile form
- **addresses.ejs**: Address CRUD operations

#### Partials
- **header.ejs**: HTML head with Bootstrap, icons
- **navbar.ejs**: User navigation with login/logout
- **sidebar.ejs**: User sidebar menu
- **footer.ejs**: Footer with links
- **adminNavbar.ejs**: Admin top navigation
- **adminSidebar.ejs**: Admin side menu

## Data Flow

### User Signup Flow
```
User → signup.ejs → POST /signup → userController.signup → userService.signup
  → Validate input → Check duplicates → Hash password → Save user
  → Send OTP email → Redirect to verifyOtp.ejs
  → POST /verifyOtp → Verify OTP → Mark as verified → Redirect to signin
```

### User Login Flow
```
User → signin.ejs → POST /signin → userController.signin → userService.login
  → Find user → Check password → Check if verified
  → If not verified: Send OTP → verifyOtp.ejs
  → If verified: Create session → Redirect to home
```

### Password Reset Flow
```
User → forgotPassword.ejs → POST /sendOtp → Check user exists
  → Send OTP → verifyOtp.ejs → Verify OTP
  → resetPassword.ejs → POST /resetPassword → Update password
  → Redirect to signin
```

### Admin Customer Management
```
Admin → /admin/customers → Load customers with filters
  → Click block/unblock → PATCH /admin/customers/:id/block-unblock
  → Update user.isBlocked → Return success → Reload page
```

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

## Dependencies

### Core
- **express**: Web framework
- **ejs**: Template engine
- **mongoose**: MongoDB ODM
- **express-session**: Session management

### Authentication
- **bcrypt**: Password hashing
- **bcryptjs**: Password hashing (alternative)

### Email
- **nodemailer**: Email sending

### File Upload
- **multer**: File upload handling
- **cloudinary**: Image hosting

### Utilities
- **dotenv**: Environment variables
- **cors**: CORS handling

### Development
- **nodemon**: Auto-restart server

## Security Features

1. **Password Security**
   - Bcrypt hashing with 10 salt rounds
   - Password strength validation
   - No plain text storage

2. **Session Security**
   - HTTP-only cookies
   - 24-hour expiry
   - Secure session storage in MongoDB

3. **Email Verification**
   - 6-digit OTP
   - 10-minute expiry
   - One-time use

4. **Access Control**
   - Role-based authentication (user/admin)
   - Protected routes with middleware
   - Account blocking capability

5. **Input Validation**
   - Server-side validation
   - Client-side validation
   - XSS prevention

## Code Organization Principles

1. **MVC Pattern**
   - Models: Data schemas
   - Views: EJS templates
   - Controllers: Request handlers

2. **Service Layer**
   - Business logic separated from controllers
   - Reusable functions
   - Easy to test

3. **Middleware**
   - Authentication checks
   - Request validation
   - Error handling

4. **Modular Structure**
   - Separate files for each concern
   - Clear folder organization
   - Easy to navigate

## Naming Conventions

- **Files**: camelCase (userController.js)
- **Folders**: camelCase (userController/)
- **Routes**: kebab-case (/forgot-password)
- **Variables**: camelCase (firstName)
- **Constants**: UPPER_SNAKE_CASE (SESSION_SECRET)
- **Classes**: PascalCase (User, Address)

## Best Practices Implemented

1. ✅ Environment variables for sensitive data
2. ✅ Password hashing before storage
3. ✅ Session-based authentication
4. ✅ Email verification required
5. ✅ Input validation on client and server
6. ✅ Error handling with try-catch
7. ✅ Modular code structure
8. ✅ Consistent naming conventions
9. ✅ Comments for complex logic
10. ✅ Separation of concerns

## Next Development Steps

1. Add product management (CRUD)
2. Implement shopping cart
3. Add order management
4. Integrate payment gateway
5. Add product reviews
6. Implement wishlist
7. Add order tracking
8. Create invoice generation
9. Add analytics dashboard
10. Implement email notifications

---

**Status**: ✅ Structure Verified and Cleaned
**Last Updated**: February 11, 2026
