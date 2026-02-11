const User = require("../models/User");

// User authentication middleware
const isUserAuthenticated = async (req, res, next) => {
    try {
        if (!req.session.user || !req.session.userId) {
            return res.redirect('/user/login?redirect=' + req.originalUrl);
        }

        // Verify user exists and is not blocked
        const user = await User.findById(req.session.userId);
        if (!user) {
            req.session.destroy();
            return res.redirect('/user/login');
        }

        if (user.isBlocked) {
            req.session.destroy();
            return res.redirect('/user/login?error=blocked');
        }

        if (!user.isVerified) {
            return res.redirect('/user/verifyOtp?email=' + user.email + '&flow=login');
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.redirect('/user/login');
    }
};

// Admin authentication middleware
const isAdminAuthenticated = async (req, res, next) => {
    try {
        if (!req.session.user || !req.session.userId) {
            return res.redirect('/admin/login');
        }

        const user = await User.findById(req.session.userId);
        if (!user) {
            req.session.destroy();
            return res.redirect('/admin/login');
        }

        if (user.role !== 'admin') {
            return res.status(403).send('Access denied. Admin privileges required.');
        }

        if (user.isBlocked) {
            req.session.destroy();
            return res.redirect('/admin/login?error=blocked');
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Admin auth middleware error:', error);
        res.redirect('/admin/login');
    }
};

// Check if user is already logged in (for login/signup pages)
const isUserLoggedIn = (req, res, next) => {
    if (req.session.user && req.session.userId) {
        return res.redirect('/');
    }
    next();
};

// Check if admin is already logged in
const isAdminLoggedIn = (req, res, next) => {
    if (req.session.user && req.session.userId && req.session.role === 'admin') {
        return res.redirect('/admin/dashboard');
    }
    next();
};

module.exports = {
    isUserAuthenticated,
    isAdminAuthenticated,
    isUserLoggedIn,
    isAdminLoggedIn
};
