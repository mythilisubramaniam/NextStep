const adminService = require("../../services/adminService");

// Load login page
exports.loadLogin = (req, res) => {
    res.render("admin/signin", { 
        title: "Admin Login - Next Step",
        error: null 
    });
};

// Admin login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await adminService.adminLogin(email, password);

        if (!result.success) {
            return res.render("admin/signin", {
                title: "Admin Login - Next Step",
                error: result.message
            });
        }

        // Set session
        req.session.user = true;
        req.session.role = result.user.role;
        req.session.userId = result.user._id;

        res.redirect("/admin/dashboard");
    } catch (error) {
        console.error("Admin login error:", error);
        res.render("admin/signin", {
            title: "Admin Login - Next Step",
            error: "Login failed. Please try again."
        });
    }
};

// Load dashboard
exports.loadDashboard = async (req, res) => {
    try {
        const stats = await adminService.getDashboardStats();
        const recentCustomers = await adminService.getCustomersList();

        res.render("admin/dashboard", {
            name: "Admin User",
            stats,
            customers: recentCustomers.slice(0, 10) // Show only 10 recent
        });
    } catch (error) {
        console.error("Load dashboard error:", error);
        res.render("admin/dashboard", {
            name: "Admin User",
            stats: {
                totalCustomers: 0,
                activeCustomers: 0,
                blockedCustomers: 0,
                verifiedCustomers: 0
            },
            customers: []
        });
    }
};

// Get customers list (API)
exports.getCustomers = async (req, res) => {
    try {
        const customers = await adminService.getCustomersList();
        res.json({ success: true, customers });
    } catch (error) {
        console.error("Get customers error:", error);
        res.json({ success: false, customers: [] });
    }
};

// Load customers page with filters
exports.loadCustomers = async (req, res) => {
    try {
        const filters = {
            page: parseInt(req.query.page) || 1,
            limit: 10,
            status: req.query.status || 'all',
            sort: req.query.sort || 'dateDesc',
            search: req.query.search || ''
        };

        const result = await adminService.getCustomersWithFilters(filters);

        res.render("admin/users", {
            ...result,
            name: "Admin User"
        });
    } catch (error) {
        console.error("Load customers error:", error);
        res.render("admin/users", {
            customers: [],
            currentPage: 1,
            totalPages: 0,
            totalResults: 0,
            limit: 10,
            currentStatus: 'all',
            currentSort: 'dateDesc',
            currentSearch: '',
            name: "Admin User"
        });
    }
};

// Toggle customer status
exports.toggleCustomerStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await adminService.toggleCustomerStatus(id);
        res.json(result);
    } catch (error) {
        console.error("Toggle customer status error:", error);
        res.json({ success: false, message: "Failed to update customer status" });
    }
};

// Admin logout
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Admin logout error:', err);
        }
        res.clearCookie('connect.sid');
        return res.redirect("/admin/signin");
    });
};
