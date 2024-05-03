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

// Route to render the admin dashboard
router.get('/', isAdmin, adminController.getAdminDashboard); 
router.post('/add/:type', adminController.addData);
router.post('/edit/:type/:id', adminController.editData);
router.post('/delete/:type/:id', adminController.deleteData);
router.get('/edit/:id/:type', adminController.getEditPage);
router.get('/add', adminController.getAddPage);
router.get('/search', adminController.searchUsers);


module.exports = router;

