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

        res.render("user/profile", { 
            user, 
            title: "My Profile - Next Step" 
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
            title: "Edit Profile - Next Step" 
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
            return res.send("Passwords do not match");
        }

        const user = await User.findById(req.session.userId);
        const isMatch = await user.comparePassword(currentPassword);

        if (!isMatch) {
            return res.send("Current password is incorrect");
        }

        user.password = newPassword;
        await user.save();

        res.redirect("/profile");
    } catch (error) {
        console.error("Change password error:", error);
        res.send("Failed to change password");
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
            title: "My Addresses - Next Step" 
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
