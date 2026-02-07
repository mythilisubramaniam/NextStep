const userService = require("../services/userService");

exports.loadHome = (req, res) => {
    const data = userService.getHomeData();
    res.render("user/home", { data, title: "Home - Next Step" });
};

exports.loadSignup = (req, res) => {
    res.render("user/signup", { title: "Sign Up - Next Step" });
};

exports.loadSignin = (req, res) => {
    res.render("user/signin", { title: "Sign In - Next Step" });
};

exports.signin = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.send("All fields are required");
    }
    console.log("Signin Data:", req.body);
    res.send("Signin successful");
};

exports.signup = (req, res) => {
    const { firstName, lastName, email, phone, password } = req.body;
    console.log("Signup Data:", req.body);
    res.send("Signup successful");
};

exports.loadForgotPassword = (req, res) => {
    res.render("user/forgotPassword", { title: "Forgot Password" });
};

exports.loadResetPassword = (req, res) => {
    res.render("user/resetPassword", { title: "Reset Password" });
};

exports.loadVerification = (req, res) => {
    const data = userService.getVerificationData();
    res.render("user/verification", { data });
};

exports.loadAddress = (req, res) => {
    const user = userService.getUser();
    res.render("user/address", { user, title: "Address - Next Step" });
};

exports.addAddress = (req, res) => {
    console.log("Address Data:", req.body);
    res.send("Address added successfully");
};

