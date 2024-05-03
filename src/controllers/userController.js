    const bcrypt = require("bcrypt");
    const passport = require('passport');
    const User = require("../models/account");
    const Review = require('../models/review');


    // Google authentication middleware
    const isLoggedIn = (req, res, next) => {
        if (req.user) {
            next();
        } else {
            res.sendStatus(401);
        }
    };

    // Google OAuth callback
    exports.googleCallback = (req, res, next) => {
        passport.authenticate('google', {
            failureRedirect: '/failed'
        }, (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.redirect('/failed');
            }
            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                }
                return res.redirect('/home');
            });
        })(req, res, next);
    };

    // Render signup page
    exports.getSignupPage = (req, res) => {
        res.render("signup");
    };

    // Handle user registration
    exports.signupUser = async (req, res) => {
        const { username, email, password, securityAnswer } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
            return res.render("signup", { errorMessage: "User already exists. Please choose a different username." });
        }

        try {
            if (req.user && req.user.googleId) {
                // Jika pengguna mendaftar melalui Google OAuth, tidak perlu memeriksa password
                const newUser = new User({
                    username: username,
                    email: email,
                    googleId: req.user.googleId, // Gunakan ID Google sebagai identifikasi unik pengguna
                });
                await newUser.save();
            } else {
                // Jika pengguna mendaftar dengan metode lain, seperti form biasa, memerlukan password
                if (!password) {
                    return res.render("signup", { errorMessage: "Password is required." });
                }
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(password, saltRounds);
    
                const newUser = new User({
                    username: username,
                    email: email,
                    password: hashedPassword,
                    securityAnswer: securityAnswer
                });
                await newUser.save();
            }
    
            console.log("User registered successfully:", { username, email });
            return res.render("signup", { successMessage: "Registration successful! You can now log in." });
        } catch (error) {
            console.error("Error registering user:", error);
            return res.status(500).send("An error occurred while registering user.");
        }
    };

    // Render login page
    exports.getLoginPage = (req, res) => {
        res.render("login");
    };

    // Handle user login
    exports.loginUser = async (req, res) => {
        const { username, password } = req.body;

        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPassword = process.env.ADMIN_PASSWORD;

        try {
            if (username === adminUsername && password === adminPassword) {
                req.session.user = { username: adminUsername, isAdmin: true };
                return res.redirect('/admin');
            }

            if (req.user && req.user.googleId) {
                return res.render("home");
            }

            const check = await User.findOne({username: req.body.username});
            if (!check) {
                return res.render("login", { errorMessage: "User not found." });
            }

            // compare hash password
            const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
            if (isPasswordMatch) {
                return res.render("home"); // Ensure use of return here
            } else {
                return res.render("login", { errorMessage: "Wrong password." });
            }            

            req.session.user = { id: user._id, username: user.username, isAdmin: user.isAdmin };
            res.redirect(user.isAdmin ? '/admin' : '/home');
        } catch {
            return res.render("login", { errorMessage: "Wrong details." });
        }
    };

    exports.getHomePage = (req, res) => {
        res.render("home"); 
    };

    // Handle user logout
    exports.logoutUser = (req, res) => {
        req.session = null;
        req.logout();
        res.redirect('/');
    };

    // Render forgot password page
    exports.getForgotPasswordPage = async (req, res) => {
        res.render("forgot", { email: "", securityQuestion: null, errorMessage: null });
    };

    // Handle forgot password request
    exports.forgotPassword = async (req, res) => {
        const { email, securityAnswer, newPassword } = req.body;
        try {
            const user = await User.findOne({ email: email });
            if (!user) {
                return res.render("forgot", { errorMessage: "User not found.", email });
            }
            if (user.securityAnswer !== securityAnswer) {
                return res.render("forgot", { errorMessage: "Security Answer is wrong.", email });
            }
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
            user.password = hashedPassword;
            await user.save();
            res.render("login", { successMessage: "Password updated. Please log in." });
        } catch (error) {
            console.error("Error processing request:", error);
            res.status(500).send("An error occurred.");
        }
    };

    // Handle reset password request
    exports.resetPassword = async (req, res) => {
        const { email, securityAnswer } = req.body;
        try {
            const user = await User.findOne({ email: email });
            if (!user) {
                return res.render("forgot", { errorMessage: "User not found." });
            }
            if (user.securityAnswer !== securityAnswer) {
                return res.render("forgot", { errorMessage: "Security Answer is wrong." });
            }
        } catch {
            console.error("Error searching for user:", error);
            res.status(500).send("An error occurred.");
        }
    };

    exports.getLandingPage = async (req, res) => {
        try {
            res.render('landing', { errorMessage: null, successMessage: null });
        } catch (error) {
            console.error("Error rendering landing page:", error);
            res.status(500).send("An error occurred while rendering the landing page.");
        }
    };
    
    exports.submitReview = async (req, res) => {
        console.log("Received review data:", req.body);
        try {
            const { name, email, subject, message } = req.body;
            const newReview = new Review({
                name,
                email,
                subject,
                message
            });
            await newReview.save();
            return res.redirect("/#review-section?successMessage=Review submitted successfully!");
        } catch (error) {
            console.error("Error saving review:", error);
            return res.redirect("/#review-section?errorMessage=An error occurred while submitting the review.");
        }
    };

    exports.getTermsPage = (req, res) => {
        res.render("terms"); 
    };

    exports.getPolicyPage = (req, res) => {
        res.render("policy"); 
    };

    exports.getToDoListPage = (req, res) => {
        res.render("toDoList"); 
    };
