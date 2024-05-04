// adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

async function isAdmin(req, res, next) {
    try { 
        if (req.session.user && req.session.user.isAdmin) {
            return next();
        } else {
            return res.status(403).send("Access denied. Only admins can access this page.");
        }
    } catch (error) {
        console.error("Error checking admin status:", error);
        return res.status(500).send("An error occurred while checking admin status.");
    }
}

// Routes for Users
router.get('/', isAdmin, adminController.getUsersDashboard);
router.get('/edit/:id', adminController.getEditUserPage);
router.post('/edit/:id', adminController.editUser);
router.get('/add', adminController.getAddUserPage);
router.post('/add', adminController.addUser);
router.post('/delete/:id', adminController.deleteUser);
router.get('/search', adminController.searchUsers);

// Routes for Reviews
router.get('/review', adminController.getReviewDashboard);
router.get('/review/edit/:id', adminController.getEditReviewPage);
router.post('/review/edit/:id', adminController.editReview);
router.get('/review/add', adminController.getAddReviewPage);
router.post('/review/add', adminController.addReview);
router.post('/review/delete/:id', adminController.deleteReview);


module.exports = router;

