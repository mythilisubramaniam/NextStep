# Profile Features Implementation TODO

## Features to Add from ToughToes Design

### 1. Profile Image Upload with Cropping
**Files Needed:**
- Add Cropper.js library to profile.ejs
- Create `/profile/update-image` route (POST)
- Add multer middleware for file uploads
- Add image processing logic

**Implementation:**
```javascript
// In userRouter.js
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/profiles/' });
router.post('/profile/update-image', upload.single('profileImage'), userController.updateProfileImage);

// In userController.js
exports.updateProfileImage = async (req, res) => {
    // Handle image upload
    // Save to user.profileImage
    // Return JSON with imageUrl
};
```

### 2. Change Password Modal (Already Added)
✅ Modal HTML added
✅ Validation JavaScript added
✅ Controller function updated
- Just needs testing

### 3. Default Shipping Address Display (Already Added)
✅ Fetches default address
✅ Displays in card
✅ Links to addresses page

### 4. Danger Zone - Deactivate Account
**Files Needed:**
- Add `/profile/deactivate` route (POST)
- Add controller function
- Add User model field: `isActive`

**Implementation:**
```javascript
// In userRouter.js
router.post('/profile/deactivate', userController.deactivateAccount);

// In userController.js
exports.deactivateAccount = async (req, res) => {
    const user = await User.findById(req.session.userId);
    user.isActive = false;
    await user.save();
    req.session.destroy();
    res.json({ success: true });
};
```

### 5. Edit Profile Page Enhancements
**Features to Add:**
- Email change with OTP verification
- Real-time validation (already has)
- AJAX form submission (already has)

**Implementation:**
```javascript
// In userRouter.js
router.post('/profile/request-email-otp', userController.requestEmailOtp);
router.patch('/profile/edit', userController.editProfile);

// Update editProfile to use PATCH and return JSON
```

### 6. Member Since Date Display
✅ Already added to profile page

## Current Status

### ✅ Completed Features:
1. Basic profile display with user info
2. Edit profile button linking to edit page
3. Default address display
4. Change password modal with validation
5. Sidebar navigation with active states
6. Member since date

### ⏳ Pending Features:
1. Profile image upload with cropping (requires multer setup)
2. Deactivate account functionality
3. Email change with OTP
4. Profile image storage and serving

## Dependencies Needed

```json
{
  "multer": "^1.4.5-lts.1",
  "sharp": "^0.32.0"  // For image processing
}
```

## Installation Steps

1. Install dependencies:
```bash
npm install multer sharp
```

2. Create uploads directory:
```bash
mkdir -p public/uploads/profiles
```

3. Add routes and controllers as specified above

4. Update User model to include:
```javascript
profileImage: { type: String, default: '/images/default-profile.png' },
isActive: { type: Boolean, default: true }
```

## Notes

The current implementation has the UI and frontend JavaScript ready. What's missing is:
- Backend routes for image upload
- File upload middleware configuration
- Image processing logic
- Deactivate account backend logic

These require additional setup and dependencies that go beyond simple file updates.
