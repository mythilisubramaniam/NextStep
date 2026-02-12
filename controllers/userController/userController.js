const userService = require("../../services/userService");
const User = require("../../models/User");
const Address = require("../../models/Address");

// Home page
exports.loadHome = async (req, res) => {
    try {
        // Get user if logged in
        let user = null;
        if (req.session.userId) {
            user = await User.findById(req.session.userId);
        }

        // Home page data (later this will come from database)
        const homeData = {
            bannerImage: '/images/hero-shoe.png',
            categories: [
                { _id: 'MEN', name: 'Men', categoryImage: '/images/men-category.jpg' },
                { _id: 'WOMEN', name: 'Women', categoryImage: '/images/women-category.jpg' },
                { _id: 'KIDS', name: 'Kids', categoryImage: '/images/kids-category.jpg' }
            ],
            featuredProducts: [
                { _id: 1, name: 'Running Shoes', price: 2999, product_category: 'Sports', image: '/images/product1.jpg' },
                { _id: 2, name: 'Casual Sneakers', price: 1999, product_category: 'Casual', image: '/images/product2.jpg' },
                { _id: 3, name: 'Formal Shoes', price: 3499, product_category: 'Formal', image: '/images/product3.jpg' }
            ]
        };
        
        res.render("user/home", { 
            ...homeData,
            title: "Home - Next Step",
            user: user
        });
    } catch (error) {
        console.error('Load home error:', error);
        res.render("user/home", { 
            bannerImage: '/images/hero-shoe.png',
            categories: [],
            featuredProducts: [],
            title: "Home - Next Step",
            user: null
        });
    }
};

// Authentication routes - delegate to service
exports.loadSignup = userService.viewSignup;
exports.signup = userService.signup;
exports.loadSignin = userService.viewLogin;
exports.signin = userService.login;
exports.logout = userService.logout;

// Password reset routes - delegate to service
exports.loadForgotPassword = userService.forgotPassword;
exports.sendOtp = userService.sendOtp;
exports.loadVerifyOtp = userService.viewVerifyOtp;
exports.verifyOtp = userService.verifyOtp;
exports.resendOtp = userService.resendOtp;
exports.loadResetPassword = userService.viewResetPassword;
exports.resetPassword = userService.resetPassword;

// Profile management
exports.loadProfile = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.redirect("/signin");
        }

        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.redirect("/signin");
        }

        // Get default address
        const defaultAddress = await Address.findOne({ 
            user: req.session.userId, 
            isDefault: true 
        });

        res.render("user/profile", { 
            user, 
            defaultAddress,
            title: "My Profile - Next Step",
            activePage: "profile"
        });
    } catch (error) {
        console.error("Profile error:", error);
        res.redirect("/");
    }
};

exports.loadEditProfile = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.redirect("/signin");
        }

        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.redirect("/signin");
        }

        res.render("user/editProfile", { 
            user, 
            title: "Edit Profile - Next Step",
            activePage: "profile"
        });
    } catch (error) {
        console.error("Edit profile error:", error);
        res.redirect("/profile");
    }
};

exports.editProfile = async (req, res) => {
    try {
        const { firstName, lastName, phone } = req.body;

        await User.findByIdAndUpdate(req.session.userId, {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phone: phone.trim()
        });

        res.redirect("/profile");
    } catch (error) {
        console.error("Edit profile error:", error);
        res.redirect("/profile/edit");
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            return res.json({ success: false, message: "Passwords do not match" });
        }

        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const bcrypt = require("bcrypt");
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Current password is incorrect" });
        }

        // Check if new password is same as current
        const isSame = await bcrypt.compare(newPassword, user.password);
        if (isSame) {
            return res.json({ success: false, message: "New password must be different from current password" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        console.error("Change password error:", error);
        res.json({ success: false, message: "Failed to change password" });
    }
};

// Address management
exports.loadAddresses = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.redirect("/signin");
        }

        const user = await User.findById(req.session.userId);
        const addresses = await Address.find({ user: req.session.userId }).sort({ isDefault: -1, createdAt: -1 });

        res.render("user/addresses", { 
            addresses,
            user,
            title: "My Addresses - Next Step",
            activePage: "addresses"
        });
    } catch (error) {
        console.error("Load addresses error:", error);
        res.redirect("/profile");
    }
};

exports.addAddress = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.json({ success: false, message: "Please login first" });
        }

        const { name, phone, pincode, city, state, houseNumber, locality, landmark } = req.body;

        // Check if this is the first address
        const addressCount = await Address.countDocuments({ user: req.session.userId });
        const isDefault = addressCount === 0;

        const address = new Address({
            user: req.session.userId,
            name: name.trim(),
            phone: phone.trim(),
            pincode: pincode.trim(),
            city: city.trim(),
            state: state.trim(),
            houseNumber: houseNumber.trim(),
            locality: locality.trim(),
            landmark: landmark ? landmark.trim() : '',
            isDefault
        });

        await address.save();
        res.json({ success: true, message: "Address added successfully" });
    } catch (error) {
        console.error("Add address error:", error);
        res.json({ success: false, message: "Failed to add address" });
    }
};

exports.editAddress = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.json({ success: false, message: "Please login first" });
        }

        const { id } = req.params;
        const { name, phone, pincode, city, state, houseNumber, locality, landmark } = req.body;

        await Address.findOneAndUpdate(
            { _id: id, user: req.session.userId },
            {
                name: name.trim(),
                phone: phone.trim(),
                pincode: pincode.trim(),
                city: city.trim(),
                state: state.trim(),
                houseNumber: houseNumber.trim(),
                locality: locality.trim(),
                landmark: landmark ? landmark.trim() : ''
            }
        );

        res.json({ success: true, message: "Address updated successfully" });
    } catch (error) {
        console.error("Edit address error:", error);
        res.json({ success: false, message: "Failed to update address" });
    }
};

exports.setDefaultAddress = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.json({ success: false, message: "Please login first" });
        }

        const { id } = req.params;

        // Remove default from all addresses
        await Address.updateMany(
            { user: req.session.userId },
            { isDefault: false }
        );

        // Set new default
        await Address.findOneAndUpdate(
            { _id: id, user: req.session.userId },
            { isDefault: true }
        );

        res.json({ success: true, message: "Default address updated" });
    } catch (error) {
        console.error("Set default address error:", error);
        res.json({ success: false, message: "Failed to update default address" });
    }
};

exports.deleteAddress = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.json({ success: false, message: "Please login first" });
        }

        const { id } = req.params;

        const address = await Address.findOne({ _id: id, user: req.session.userId });
        if (!address) {
            return res.json({ success: false, message: "Address not found" });
        }

        const wasDefault = address.isDefault;
        await address.deleteOne();

        // If deleted address was default, set another as default
        if (wasDefault) {
            const firstAddress = await Address.findOne({ user: req.session.userId });
            if (firstAddress) {
                firstAddress.isDefault = true;
                await firstAddress.save();
            }
        }

        res.json({ success: true, message: "Address deleted successfully" });
    } catch (error) {
        console.error("Delete address error:", error);
        res.json({ success: false, message: "Failed to delete address" });
    }
};

// Update profile image
exports.updateProfileImage = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.json({ success: false, message: "Please login first" });
        }

        if (!req.file) {
            return res.json({ success: false, message: "No image file provided" });
        }

        // Generate unique filename
        const filename = `profile-${req.session.userId}-${Date.now()}.jpg`;
        const imagePath = `/uploads/profiles/${filename}`;
        const fs = require('fs');
        const path = require('path');

        // Ensure upload directory exists
        const uploadDir = path.join(__dirname, '../../public/uploads/profiles');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Move file to permanent location
        const tempPath = req.file.path;
        const targetPath = path.join(uploadDir, filename);
        fs.renameSync(tempPath, targetPath);

        // Update user profile image
        const user = await User.findById(req.session.userId);
        
        // Delete old profile image if exists and not default
        if (user.profileImage && user.profileImage !== '/images/default-profile.png') {
            const oldImagePath = path.join(__dirname, '../../public', user.profileImage);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        user.profileImage = imagePath;
        await user.save();

        res.json({ success: true, message: "Profile picture updated successfully", imageUrl: imagePath });
    } catch (error) {
        console.error("Update profile image error:", error);
        res.json({ success: false, message: "Failed to update profile picture" });
    }
};

// Deactivate account
exports.deactivateAccount = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.json({ success: false, message: "Please login first" });
        }

        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        user.isActive = false;
        await user.save();

        // Destroy session
        req.session.destroy((err) => {
            if (err) {
                console.error("Session destroy error:", err);
            }
        });

        res.json({ success: true, message: "Account deactivated successfully" });
    } catch (error) {
        console.error("Deactivate account error:", error);
        res.json({ success: false, message: "Failed to deactivate account" });
    }
};
