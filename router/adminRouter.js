const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController/adminController");

// Admin signin
router.get("/signin", adminController.loadLogin);
router.get("/login", adminController.loadLogin);
router.post("/login", adminController.login);

// Admin logout
router.post("/logout", adminController.logout);
router.get("/logout", adminController.logout);

// Admin dashboard
router.get("/dashboard", adminController.loadDashboard);

// Admin customers
router.get("/customers/list", adminController.getCustomers);
router.get("/customers", adminController.loadCustomers);
router.patch("/customers/:id/block-unblock", adminController.toggleCustomerStatus);

module.exports = router;
