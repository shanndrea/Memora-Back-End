const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const passport = require('passport');

async function isLogin(req, res, next) {
  try { 
      if (req.session.user) {
          return next();
      } else {
          return res.status(403).send("Access denied. Only user login can access this page.");
      }
  } catch (error) {
      console.error("Error checking login status:", error);
      return res.status(500).send("An error occurred while checking admin status.");
  }
}

router.get("/signup", userController.getSignupPage);
router.post("/signup", userController.signupUser);
router.get("/", userController.getLandingPage);
router.get("/home", isLogin, userController.getHomePage);
router.post("/submit-review", userController.submitReview);
router.get("/terms", userController.getTermsPage);
router.get("/policy", userController.getPolicyPage);
router.get("/login", userController.getLoginPage);
router.post("/login", userController.loginUser);
router.get("/toDoList", isLogin,userController.getToDoListPage);
router.post("/toDoList/add", isLogin, userController.addToDoList);
router.delete("/toDoList/delete/:id", isLogin, userController.deleteToDoList);
router.put("/toDoList/update/:id", isLogin, userController.updateToDoList);
router.get("/calendar", isLogin, userController.getCalendarPage);
router.post("/events", isLogin, userController.addEvent);
router.get("/events", isLogin, userController.getEvent);
router.delete("/event/delete/:id", isLogin, userController.deleteEvent);
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
