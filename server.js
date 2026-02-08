const express = require("express");
const path = require("path");
require('dotenv').config();
const connectDB = require('./backend/config/db');

const app = express();

// Connect to MongoDB
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const userRouter = require("./router/userRouter");
const adminRouter = require("./router/adminRouter");

app.use("/", userRouter);
app.use("/admin", adminRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
