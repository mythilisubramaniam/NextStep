exports.loadDashboard = (req, res) => {
    res.render("admin/dashboard", { name: "Admin User" });
};
