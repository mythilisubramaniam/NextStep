const User = require("../models/User");
const bcrypt = require("bcrypt");

// Admin login
const adminLogin = async (email, password) => {
    try {
        const user = await User.findOne({ email: email.toLowerCase(), role: 'admin' });
        
        if (!user) {
            return { success: false, message: "Invalid credentials" };
        }

        if (user.isBlocked) {
            return { success: false, message: "Your account has been blocked" };
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return { success: false, message: "Invalid credentials" };
        }

        return { success: true, user };
    } catch (error) {
        console.error('Admin login error:', error);
        return { success: false, message: "Login failed" };
    }
};

// Get dashboard statistics
const getDashboardStats = async () => {
    try {
        const totalCustomers = await User.countDocuments({ role: 'user' });
        const activeCustomers = await User.countDocuments({ role: 'user', isBlocked: false });
        const blockedCustomers = await User.countDocuments({ role: 'user', isBlocked: true });
        const verifiedCustomers = await User.countDocuments({ role: 'user', isVerified: true });

        return {
            totalCustomers,
            activeCustomers,
            blockedCustomers,
            verifiedCustomers
        };
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        return {
            totalCustomers: 0,
            activeCustomers: 0,
            blockedCustomers: 0,
            verifiedCustomers: 0
        };
    }
};

// Get customers list
const getCustomersList = async () => {
    try {
        const customers = await User.find({ role: 'user' })
            .select('firstName lastName email phone isBlocked isVerified createdAt')
            .sort({ createdAt: -1 });
        return customers;
    } catch (error) {
        console.error('Get customers list error:', error);
        return [];
    }
};

// Get customers with filters
const getCustomersWithFilters = async (filters) => {
    try {
        const { page = 1, limit = 10, status = 'all', sort = 'dateDesc', search = '' } = filters;

        // Build filter
        let filter = { role: 'user' };
        
        if (status === 'active') {
            filter.isBlocked = false;
        } else if (status === 'blocked') {
            filter.isBlocked = true;
        }

        // Add search filter
        if (search) {
            filter.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        // Build sort
        let sortOption = {};
        switch (sort) {
            case 'nameAsc':
                sortOption = { firstName: 1 };
                break;
            case 'nameDesc':
                sortOption = { firstName: -1 };
                break;
            case 'dateAsc':
                sortOption = { createdAt: 1 };
                break;
            case 'dateDesc':
            default:
                sortOption = { createdAt: -1 };
        }

        // Get total count
        const totalResults = await User.countDocuments(filter);
        const totalPages = Math.ceil(totalResults / limit);

        // Get customers
        const customers = await User.find(filter)
            .select('firstName lastName email phone isBlocked isVerified createdAt')
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(limit);

        return {
            customers,
            currentPage: page,
            totalPages,
            totalResults,
            limit,
            currentStatus: status,
            currentSort: sort,
            currentSearch: search
        };
    } catch (error) {
        console.error('Get customers with filters error:', error);
        return {
            customers: [],
            currentPage: 1,
            totalPages: 0,
            totalResults: 0,
            limit: 10,
            currentStatus: 'all',
            currentSort: 'dateDesc',
            currentSearch: ''
        };
    }
};

// Toggle customer status
const toggleCustomerStatus = async (customerId) => {
    try {
        const user = await User.findById(customerId);
        
        if (!user) {
            return { success: false, message: "Customer not found" };
        }

        if (user.role === 'admin') {
            return { success: false, message: "Cannot block admin users" };
        }

        user.isBlocked = !user.isBlocked;
        await user.save();

        return {
            success: true,
            message: `Customer ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
            isBlocked: user.isBlocked
        };
    } catch (error) {
        console.error('Toggle customer status error:', error);
        return { success: false, message: "Failed to update customer status" };
    }
};

module.exports = {
    adminLogin,
    getDashboardStats,
    getCustomersList,
    getCustomersWithFilters,
    toggleCustomerStatus
};
