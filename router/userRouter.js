const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController/userController");

// Redirect root to signin
router.get("/", userController.loadHome);

router.get("/home", userController.loadHome);

// About page
router.get("/about", async (req, res) => {
    try {
        let user = null;
        if (req.session.userId) {
            const User = require("../models/User");
            user = await User.findById(req.session.userId);
        }
        res.render("about", { 
            title: "About Us - Next Step",
            user: user
        });
    } catch (error) {
        console.error("About page error:", error);
        res.render("about", { 
            title: "About Us - Next Step",
            user: null
        });
    }
});

// Signin routes
router.get("/signin", userController.loadSignin);
router.post("/signin", userController.signin);

// Logout route
router.post("/logout", userController.logout);
router.get("/logout", userController.logout);

// Signup routes
router.get("/signup", userController.loadSignup);

router.post("/signup", userController.signup);

// Forgot password route
router.get("/forgotPassword", userController.loadForgotPassword);
router.post("/sendOtp", userController.sendOtp);

// OTP verification routes
router.get("/verifyOtp", userController.loadVerifyOtp);
router.post("/verifyOtp", userController.verifyOtp);
router.post("/resendOtp", userController.resendOtp);

// Reset Password route
router.get("/resetPassword", userController.loadResetPassword);
router.post("/resetPassword", userController.resetPassword);

// Addresses management routes (new addresses page)
router.get("/addresses", userController.loadAddresses);
router.post("/address/add", userController.addAddress);
router.post("/address/edit/:id", userController.editAddress);
router.post("/address/set-default/:id", userController.setDefaultAddress);
router.delete("/address/delete/:id", userController.deleteAddress);

// Profile routes
router.get("/profile", userController.loadProfile);
router.get("/profile/edit", userController.loadEditProfile);
router.post("/profile/edit", userController.editProfile);
router.post("/profile/change-password", userController.changePassword);

// Profile image upload
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/temp/' });
router.post("/profile/update-image", upload.single('profileImage'), userController.updateProfileImage);

// Deactivate account
router.post("/profile/deactivate", userController.deactivateAccount);

module.exports = router;
