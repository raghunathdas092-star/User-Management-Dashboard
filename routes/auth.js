const express = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

const router = express.Router();


// Home Page
router.get("/", (req, res) => {
    res.redirect("/login");
});


// ==================== REGISTER ====================

router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", async (req, res) => {

    try {

        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.send("Email already registered");
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        res.redirect("/login");

    } catch (error) {

        console.log(error);
        res.send("Registration Error");

    }

});


// ==================== LOGIN ====================

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const user =
            await User.findOne({ email });

        if (!user) {
            return res.send("User Not Found");
        }

        const valid =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!valid) {
            return res.send("Wrong Password");
        }

        req.session.user = user;

        res.redirect("/dashboard");

    } catch (error) {

        console.log(error);
        res.send("Login Error");

    }

});


// ==================== DASHBOARD ====================

router.get("/dashboard", (req, res) => {

    if (!req.session.user) {
        return res.redirect("/login");
    }

    res.render("dashboard", {
        user: req.session.user
    });

});


// ==================== VIEW USERS ====================

router.get("/users", async (req, res) => {

    if (!req.session.user) {
        return res.redirect("/login");
    }

    try {

        const users =
            await User.find().sort({ createdAt: -1 });

        res.render("users", {
            users
        });

    } catch (error) {

        console.log(error);
        res.send("Unable to load users");

    }

});


// ==================== EDIT USER ====================

router.get("/edit-user/:id", async (req, res) => {

    if (!req.session.user) {
        return res.redirect("/login");
    }

    try {

        const user =
            await User.findById(req.params.id);

        res.render("edit-user", {
            user
        });

    } catch (error) {

        console.log(error);
        res.send("User not found");

    }

});


// ==================== UPDATE USER ====================

router.post("/edit-user/:id", async (req, res) => {

    if (!req.session.user) {
        return res.redirect("/login");
    }

    try {

        const { username, email } = req.body;

        await User.findByIdAndUpdate(
            req.params.id,
            {
                username,
                email
            }
        );

        res.redirect("/users");

    } catch (error) {

        console.log(error);
        res.send("Update Failed");

    }

});


// ==================== DELETE USER ====================

router.get("/delete-user/:id", async (req, res) => {

    if (!req.session.user) {
        return res.redirect("/login");
    }

    try {

        await User.findByIdAndDelete(
            req.params.id
        );

        res.redirect("/users");

    } catch (error) {

        console.log(error);
        res.send("Delete Failed");

    }

});


// ==================== LOGOUT ====================

router.get("/logout", (req, res) => {

    req.session.destroy(() => {

        res.redirect("/login");

    });

});


module.exports = router;