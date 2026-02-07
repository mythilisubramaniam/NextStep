const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Redirect root to signin
router.get("/home", userController.loadHome);

// Signin routes
router.get("/signin", userController.loadSignin);

router.post("/signin", userController.signin);

// Signup routes
router.get("/signup", userController.loadSignup);

router.post("/signup", userController.signup);

// Forgot password route
router.get("/forgotPassword", userController.loadForgotPassword);

// Reset Password route
router.get("/resetPassword", userController.loadResetPassword);

// Verification route
router.get("/verification", userController.loadVerification);


module.exports = router;
