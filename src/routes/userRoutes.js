const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const passport = require('passport');

router.get("/signup", userController.getSignupPage);
router.post("/signup", userController.signupUser);
router.get("/", userController.getLandingPage);
router.get("/home", userController.getHomePage);
router.post("/submit-review", userController.submitReview);
router.get("/terms", userController.getTermsPage);
router.get("/policy", userController.getPolicyPage);
router.get("/login", userController.getLoginPage);
router.post("/login", userController.loginUser);
router.get("/toDoList", userController.getToDoListPage);
router.post("/logout", userController.logoutUser);
router.get("/forgot", userController.getForgotPasswordPage);
router.post("/forgot", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/home');
  }
);


module.exports = router;
