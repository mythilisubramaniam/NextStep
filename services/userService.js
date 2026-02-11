const User = require("../models/User");
const OtpVerification = require("../models/OtpVerification");
require('dotenv').config();
const bcrypt = require("bcrypt");
const saltround = 10;
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Generate 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP email
async function sendOtpEmail(email, otp) {
    try {
        await transporter.sendMail({
            from: `"Next Step" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your OTP to verify your account',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Email Verification</h2>
                    <p>Your OTP code is:</p>
                    <h1 style="color: #007bff; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
                    <p>This code will expire in 10 minutes.</p>
                    <p>If you didn't request this code, please ignore this email.</p>
                </div>
            `
        });
        return true;
    } catch (error) {
        console.error('Email send error:', error);
        return false;
    }
}

// Save OTP to database
async function saveOTP(email, otp) {
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    let otpVerification = await OtpVerification.findOne({ email });
    if (otpVerification) {
        otpVerification.otp = otp;
        otpVerification.expiry = expiry;
        await otpVerification.save();
    } else {
        otpVerification = new OtpVerification({
            email,
            otp,
            expiry
        });
        await otpVerification.save();
    }
}

// Signup
const signup = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password, confirmPassword, referralCode } = req.body;

        // Validation
        const errors = [];

        if (!firstName || firstName.trim().length < 2) {
            errors.push('First name must be at least 2 characters');
        }
        if (!lastName || lastName.trim().length < 2) {
            errors.push('Last name must be at least 2 characters');
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.push('Please enter a valid email address');
        }
        if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
            errors.push('Please enter a valid 10-digit mobile number');
        }
        if (!password || password.length < 8) {
            errors.push('Password must be at least 8 characters');
        }
        if (password !== confirmPassword) {
            errors.push('Passwords do not match');
        }

        if (errors.length > 0) {
            return res.render("user/signup", {
                title: "Sign Up - Next Step",
                error: errors.join('. '),
                oldInput: req.body
            });
        }

        // Check if user exists
        let user = await User.findOne({ email: email.toLowerCase() });
        if (user && user.isVerified) {
            return res.render("user/signup", {
                title: "Sign Up - Next Step",
                error: "This email is already registered. Please sign in.",
                oldInput: req.body
            });
        }

        // Check phone
        const existingPhone = await User.findOne({ phone });
        if (existingPhone && existingPhone.isVerified) {
            return res.render("user/signup", {
                title: "Sign Up - Next Step",
                error: "This phone number is already registered.",
                oldInput: req.body
            });
        }

        const hashedPassword = await bcrypt.hash(password, saltround);

        if (user) {
            // Update existing unverified user
            user.firstName = firstName.trim();
            user.lastName = lastName.trim();
            user.phone = phone.trim();
            user.password = hashedPassword;
            if (!user.referralCode) {
                user.referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();
            }
            if (referralCode && referralCode.trim()) {
                const referrer = await User.findOne({ referralCode: referralCode.trim().toUpperCase() });
                if (referrer) {
                    user.referredBy = referrer._id;
                    user.wallet += 50;
                }
            }
            await user.save();
        } else {
            // Create new user
            user = new User({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.toLowerCase(),
                phone: phone.trim(),
                password: hashedPassword,
                isVerified: false,
                signupMethod: "email",
                referralCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
                wallet: 0
            });

            if (referralCode && referralCode.trim()) {
                const referrer = await User.findOne({ referralCode: referralCode.trim().toUpperCase() });
                if (referrer) {
                    user.referredBy = referrer._id;
                    user.wallet = 50;
                }
            }
            await user.save();
        }

        // Generate and send OTP
        const otp = generateOTP();
        await saveOTP(email.toLowerCase(), otp);
        await sendOtpEmail(email.toLowerCase(), otp);

        console.log(`OTP for ${email}: ${otp}`); // For development

        // Get OTP expiry
        const otpVerification = await OtpVerification.findOne({ email: email.toLowerCase() });
        const otpExpiry = otpVerification ? otpVerification.expiry.getTime() : null;

        return res.render("user/verifyOtp", {
            title: "Verify OTP - Next Step",
            error: null,
            email: email.toLowerCase(),
            flow: "signup",
            otpExpiry: otpExpiry
        });
    } catch (error) {
        console.error('Signup error:', error);
        return res.render("user/signup", {
            title: "Sign Up - Next Step",
            error: "An error occurred. Please try again.",
            oldInput: req.body
        });
    }
};

// View Signup
const viewSignup = (req, res) => {
    res.render("user/signup", {
        title: "Sign Up - Next Step",
        error: null,
        oldInput: {}
    });
};

// Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.render("user/signin", {
                title: "Sign In - Next Step",
                error: "Invalid email or password"
            });
        }

        if (user.isBlocked) {
            return res.render("user/signin", {
                title: "Sign In - Next Step",
                error: "Your account has been blocked. Contact support."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render("user/signin", {
                title: "Sign In - Next Step",
                error: "Invalid email or password"
            });
        }

        if (!user.isVerified) {
            // Send OTP for verification
            const otp = generateOTP();
            await saveOTP(email.toLowerCase(), otp);
            await sendOtpEmail(email.toLowerCase(), otp);

            console.log(`OTP for ${email}: ${otp}`); // For development

            const otpVerification = await OtpVerification.findOne({ email: email.toLowerCase() });
            const otpExpiry = otpVerification ? otpVerification.expiry.getTime() : null;

            return res.render('user/verifyOtp', {
                title: "Verify OTP - Next Step",
                error: "Please verify your account first.",
                email: email.toLowerCase(),
                flow: 'login',
                otpExpiry: otpExpiry
            });
        }

        // Set session
        req.session.user = true;
        req.session.role = user.role;
        req.session.userId = user._id;

        // Redirect based on role
        if (user.role === 'admin') {
            return res.redirect('/admin/dashboard');
        }
        return res.redirect('/');
    } catch (error) {
        console.error('Login error:', error);
        return res.render("user/signin", {
            title: "Sign In - Next Step",
            error: "Login failed. Please try again."
        });
    }
};

// View Login
const viewLogin = (req, res) => {
    const message = req.query.message || null;
    res.render("user/signin", {
        title: "Sign In - Next Step",
        error: null,
        message: message
    });
};

// Verify OTP
const verifyOtp = async (req, res) => {
    try {
        const { email, otp, flow } = req.body;

        const otpVerification = await OtpVerification.findOne({ email });

        if (!otpVerification) {
            return res.render('user/verifyOtp', {
                title: "Verify OTP - Next Step",
                error: "Invalid OTP. Please try again.",
                email,
                flow,
                otpExpiry: null
            });
        }

        // Check expiry
        if (otpVerification.expiry < new Date()) {
            await otpVerification.deleteOne();
            return res.render('user/verifyOtp', {
                title: "Verify OTP - Next Step",
                error: "OTP has expired. Please request a new one.",
                email,
                flow,
                otpExpiry: null
            });
        }

        // Check OTP
        if (otpVerification.otp !== otp) {
            return res.render('user/verifyOtp', {
                title: "Verify OTP - Next Step",
                error: "Invalid OTP. Please try again.",
                email,
                flow,
                otpExpiry: otpVerification.expiry.getTime()
            });
        }

        // OTP is valid
        await otpVerification.deleteOne();

        const user = await User.findOne({ email });
        if (!user) {
            return res.redirect('/user/signup');
        }

        if (flow === 'signup') {
            user.isVerified = true;
            await user.save();

            // Reward referrer if applicable
            if (user.referredBy && !user.isReferralRewarded) {
                const referrer = await User.findById(user.referredBy);
                if (referrer) {
                    referrer.wallet += 100;
                    await referrer.save();
                    user.isReferralRewarded = true;
                    await user.save();
                }
            }

            return res.redirect('/user/login?message=Account verified! Please login.');
        } else if (flow === 'login') {
            user.isVerified = true;
            await user.save();

            req.session.user = true;
            req.session.role = user.role;
            req.session.userId = user._id;

            return res.redirect('/');
        } else if (flow === 'forgot-password') {
            return res.render('user/resetPassword', {
                title: "Reset Password - Next Step",
                email,
                error: null
            });
        }

        return res.redirect('/');
    } catch (error) {
        console.error('Verify OTP error:', error);
        return res.render('user/verifyOtp', {
            title: "Verify OTP - Next Step",
            error: "Verification failed. Please try again.",
            email: req.body.email,
            flow: req.body.flow,
            otpExpiry: null
        });
    }
};

// View Verify OTP
const viewVerifyOtp = async (req, res) => {
    const { email, flow } = req.query;
    if (!email || !flow) {
        return res.redirect('/user/signup');
    }

    let otpExpiry = null;
    try {
        const otpVerification = await OtpVerification.findOne({ email });
        otpExpiry = otpVerification ? otpVerification.expiry.getTime() : null;
    } catch (error) {
        console.error('Error getting OTP expiry:', error);
    }

    res.render("user/verifyOtp", {
        title: "Verify OTP - Next Step",
        error: null,
        email,
        flow,
        otpExpiry
    });
};

// Resend OTP
const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.json({
                success: false,
                message: 'Email is required'
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: 'User not found'
            });
        }

        const otp = generateOTP();
        await saveOTP(email, otp);
        await sendOtpEmail(email, otp);

        console.log(`New OTP for ${email}: ${otp}`); // For development

        return res.json({
            success: true,
            message: 'OTP sent successfully'
        });
    } catch (error) {
        console.error('Resend OTP error:', error);
        return res.json({
            success: false,
            message: 'Failed to send OTP'
        });
    }
};

// Forgot Password
const forgotPassword = (req, res) => {
    res.render("user/forgotPassword", {
        title: "Forgot Password - Next Step",
        error: null
    });
};

// Send OTP for password reset
const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.render('user/forgotPassword', {
                title: "Forgot Password - Next Step",
                error: "No account found with this email."
            });
        }

        if (user.isBlocked) {
            return res.render('user/forgotPassword', {
                title: "Forgot Password - Next Step",
                error: "Your account has been blocked."
            });
        }

        const otp = generateOTP();
        await saveOTP(email, otp);
        await sendOtpEmail(email, otp);

        console.log(`Password reset OTP for ${email}: ${otp}`); // For development

        const otpVerification = await OtpVerification.findOne({ email });
        const otpExpiry = otpVerification ? otpVerification.expiry.getTime() : null;

        return res.render('user/verifyOtp', {
            title: "Verify OTP - Next Step",
            error: null,
            email,
            flow: 'forgot-password',
            otpExpiry
        });
    } catch (error) {
        console.error('Send OTP error:', error);
        return res.render('user/forgotPassword', {
            title: "Forgot Password - Next Step",
            error: "Failed to send OTP. Please try again."
        });
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.render('user/resetPassword', {
                title: "Reset Password - Next Step",
                email,
                error: "Passwords do not match"
            });
        }

        if (password.length < 8) {
            return res.render('user/resetPassword', {
                title: "Reset Password - Next Step",
                email,
                error: "Password must be at least 8 characters"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.render("user/resetPassword", {
                title: "Reset Password - Next Step",
                error: "User not found",
                email
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            return res.render('user/resetPassword', {
                title: "Reset Password - Next Step",
                email,
                error: "New password must be different from current password"
            });
        }

        const hashedPassword = await bcrypt.hash(password, saltround);
        user.password = hashedPassword;
        await user.save();

        return res.redirect('/user/login?message=Password reset successful! Please login.');
    } catch (error) {
        console.error('Reset password error:', error);
        return res.render('user/resetPassword', {
            title: "Reset Password - Next Step",
            email: req.body.email,
            error: "Failed to reset password"
        });
    }
};

// View Reset Password
const viewResetPassword = (req, res) => {
    const { email } = req.query;
    if (!email) {
        return res.redirect('/user/forgotPassword');
    }
    res.render('user/resetPassword', {
        title: "Reset Password - Next Step",
        email,
        error: null
    });
};

// Logout
const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
        }
        res.clearCookie('connect.sid');
        return res.redirect("/user/login");
    });
};

module.exports = {
    signup,
    viewSignup,
    login,
    viewLogin,
    verifyOtp,
    viewVerifyOtp,
    resendOtp,
    forgotPassword,
    sendOtp,
    resetPassword,
    viewResetPassword,
    logout
};
