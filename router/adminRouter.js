const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Admin dashboard
router.get("/dashboard", adminController.loadDashboard);

module.exports = router;
