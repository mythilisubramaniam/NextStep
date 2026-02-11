const express = require("express");
const path = require("path");
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
require('dotenv').config();
const connectDB = require('./backend/config/db');
const initializeAdmin = require('./backend/config/initAdmin');

const app = express();

// Connect to MongoDB and initialize admin
connectDB().then(() => {
    initializeAdmin();
}).catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Session configuration with MongoDB store
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/nextstep',
        touchAfter: 24 * 3600 // Lazy session update
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' // HTTPS only in production
    }
}));

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
const userRouter = require("./router/userRouter");
const adminRouter = require("./router/adminRouter");

app.use("/", userRouter);
app.use("/admin", adminRouter);

// 404 handler
app.use((req, res) => {
    res.status(404).send('Page not found');
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).send('Something went wrong!');
});

// Start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});
