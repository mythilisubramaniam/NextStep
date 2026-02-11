# Testing Checklist

## Before Testing
- [ ] MongoDB is running
- [ ] Gmail App Password is configured in `.env`
- [ ] Server is running (`npm start`)

## User Authentication Tests

### 1. User Signup Flow
- [ ] Go to http://localhost:3000/signup
- [ ] Fill in all fields (firstName, lastName, email, phone, password)
- [ ] Submit form
- [ ] Check email for 6-digit OTP
- [ ] Enter OTP on verification page
- [ ] Should redirect to login page
- [ ] Login with new credentials

### 2. User Login Flow
- [ ] Go to http://localhost:3000/signin
- [ ] Enter email and password
- [ ] Should redirect to home page
- [ ] Check if session is created

### 3. Forgot Password Flow
- [ ] Go to http://localhost:3000/forgotPassword
- [ ] Enter registered email
- [ ] Check email for OTP
- [ ] Enter OTP on verification page
- [ ] Set new password
- [ ] Should redirect to login
- [ ] Login with new password

### 4. Unverified User Login
- [ ] Create account but don't verify OTP
- [ ] Try to login
- [ ] Should send new OTP
- [ ] Should redirect to OTP verification

## Admin Tests

### 1. Admin Login
- [ ] Go to http://localhost:3000/admin/login
- [ ] Login with:
  - Email: admin@nextstep.com
  - Password: Admin@123
- [ ] Should redirect to dashboard

### 2. Admin Dashboard
- [ ] Check customer count displays
- [ ] Check customer details table shows data

### 3. Customer Management
- [ ] Go to http://localhost:3000/admin/customers
- [ ] View all customers
- [ ] Test filters (All/Active/Blocked)
- [ ] Test sorting (A-Z, Z-A, Newest, Oldest)
- [ ] Test search by name/email
- [ ] Block a customer
- [ ] Unblock a customer
- [ ] Test pagination

### 4. Blocked User Login
- [ ] Block a user from admin panel
- [ ] Try to login as that user
- [ ] Should show "account suspended" message

## Profile Tests

### 1. View Profile
- [ ] Login as user
- [ ] Go to http://localhost:3000/profile
- [ ] Check if user details display correctly

### 2. Edit Profile
- [ ] Click "Edit Profile"
- [ ] Update name and phone
- [ ] Save changes
- [ ] Verify changes are saved

### 3. Change Password
- [ ] Go to profile page
- [ ] Enter current password
- [ ] Enter new password
- [ ] Confirm new password
- [ ] Save changes
- [ ] Logout and login with new password

## Address Management Tests

### 1. View Addresses
- [ ] Go to http://localhost:3000/addresses
- [ ] Page should load (empty initially)

### 2. Add Address
- [ ] Click "Add New Address"
- [ ] Fill in all fields
- [ ] Save address
- [ ] Should show success message

### 3. Edit Address
- [ ] Click edit on an address
- [ ] Modify fields
- [ ] Save changes
- [ ] Verify changes

### 4. Set Default Address
- [ ] Click "Set as Default" on an address
- [ ] Should mark as default
- [ ] Only one address should be default

### 5. Delete Address
- [ ] Click delete on an address
- [ ] Confirm deletion
- [ ] Address should be removed

## Session Tests

### 1. Session Persistence
- [ ] Login as user
- [ ] Close browser
- [ ] Reopen and visit site
- [ ] Should still be logged in (within 24 hours)

### 2. Logout
- [ ] Click logout
- [ ] Should redirect to login page
- [ ] Try accessing protected pages
- [ ] Should redirect to login

## Email Tests

### 1. OTP Email
- [ ] Trigger OTP send (signup/forgot password)
- [ ] Check email inbox
- [ ] Verify OTP format (6 digits)
- [ ] Check expiry message (10 minutes)

### 2. OTP Expiry
- [ ] Request OTP
- [ ] Wait 10+ minutes
- [ ] Try to verify expired OTP
- [ ] Should show "expired" error

### 3. Resend OTP
- [ ] On OTP page, click "Resend OTP"
- [ ] Should receive new OTP
- [ ] Old OTP should be invalid
- [ ] New OTP should work

## Error Handling Tests

### 1. Invalid Email
- [ ] Try signup with invalid email format
- [ ] Should show validation error

### 2. Weak Password
- [ ] Try signup with weak password
- [ ] Should show password requirements

### 3. Duplicate Email
- [ ] Try signup with existing email
- [ ] Should show "email already registered"

### 4. Wrong Password
- [ ] Try login with wrong password
- [ ] Should show "incorrect password"

### 5. Non-existent Email
- [ ] Try login with non-existent email
- [ ] Should show "account not found"

### 6. Wrong OTP
- [ ] Enter incorrect OTP
- [ ] Should show "incorrect code"
- [ ] Should allow retry

## Security Tests

### 1. Password Hashing
- [ ] Check database
- [ ] Passwords should be hashed (not plain text)

### 2. Session Security
- [ ] Check cookies
- [ ] Should have httpOnly flag
- [ ] Session ID should be random

### 3. Protected Routes
- [ ] Try accessing /profile without login
- [ ] Should redirect to login
- [ ] Try accessing /admin/dashboard without admin login
- [ ] Should redirect to admin login

## Performance Tests

### 1. Page Load Speed
- [ ] All pages load within 2 seconds
- [ ] No console errors

### 2. Database Queries
- [ ] Check MongoDB queries are optimized
- [ ] No N+1 query issues

## Browser Compatibility

### Test on Multiple Browsers
- [ ] Chrome
- [ ] Firefox
- [ ] Edge
- [ ] Safari (if available)

## Mobile Responsiveness

### Test on Mobile Devices
- [ ] Signup page responsive
- [ ] Login page responsive
- [ ] OTP page responsive
- [ ] Profile page responsive
- [ ] Admin pages responsive

## Console Checks

### No Errors
- [ ] No JavaScript errors in browser console
- [ ] No server errors in terminal
- [ ] No MongoDB connection errors

## Known Issues to Fix

- [ ] Add rate limiting for OTP requests
- [ ] Add CAPTCHA for signup/login
- [ ] Add email verification link (alternative to OTP)
- [ ] Add "Remember Me" functionality
- [ ] Add 2FA option
- [ ] Add password strength meter
- [ ] Add profile picture upload
- [ ] Add email change verification

## Production Readiness

- [ ] Change SESSION_SECRET to strong random string
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
- [ ] Add error tracking (Sentry)
- [ ] Add analytics

---

**Testing Status**: Ready for Testing
**Last Updated**: February 11, 2026
