const express = require("express");
const path = require("path");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


const userRouter = require("./router/userRouter");
const adminRouter = require("./router/adminRouter");

app.use("/", userRouter);
app.use("/admin", adminRouter);

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
