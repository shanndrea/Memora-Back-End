
const User = require('../models/account'); 
const Review = require('../models/review');
const bcrypt = require("bcrypt");

exports.adminLogin = async (req, res) => {
    const { username, password } = req.body;
    const result = await authenticateAdmin(username, password);
    if (result.success) {
        // Mengatur sesi admin atau token jika diperlukan
        req.session.isAdmin = true; // Contoh set session
        res.redirect('/users');
    } else {
        res.render('adminLogin', { errorMessage: result.error });
    }
};

// Mengambil semua pengguna
exports.getUsersDashboard = async (req, res) => {
    try {
        const users = await User.find();
        res.render('adminUsers', { users });
    } catch (error) {
        console.error("Error retrieving users:", error);
        res.status(500).send("Failed to retrieve users.");
    }
};

// Menambahkan pengguna baru
exports.getAddUserPage = (req, res) => {
    res.render('adminAddUser');
};

exports.addUser = async (req, res) => {
    const { username, email, password, securityAnswer } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword, securityAnswer });
        await newUser.save();
        res.redirect('/admin');
    } catch (error) {
        console.error("Failed to add user:", error);
        res.status(500).send("Failed to add user.");
    }
};

// Mengedit pengguna
exports.getEditUserPage = async (req, res) => {
    try {
        console.log("Editing user with ID:", req.params.id);
        console.log("Data received:", req.body); // Tambahkan ini untuk mencetak nilai req.params.id
        const user = await User.findById(req.params.id);
        console.log("User Found:", user); // Tambahkan ini untuk mencetak hasil pencarian user
        if (!user) return res.status(404).send("User not found");
        res.render('adminEditUser', { user });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send('Failed to fetch user.');
    }
};


exports.editUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, password, securityAnswer } = req.body;
    try {
        const updatedData = {};
        if (username) updatedData.username = username;
        if (email) updatedData.email = email;
        if (password) updatedData.password = await bcrypt.hash(password, 10);
        if (securityAnswer) updatedData.securityAnswer = securityAnswer;

        await User.findByIdAndUpdate(id, updatedData, { new: true }); // Memperbarui pengguna
        res.redirect('/admin'); // Mengalihkan kembali ke dashboard admin setelah pembaruan
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send("Failed to update user.");
    }
};


// Menghapus pengguna
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect('/admin');
    } catch (error) {
        console.error("Failed to delete user:", error);
        res.status(500).send("Failed to delete user.");
    }
};

// review
exports.getReviewDashboard = async (req, res) => {
    try {
        const review = await Review.find();
        res.render('adminReview', { review });
    } catch (error) {
        console.error("Error retrieving Review:", error);
        res.status(500).send("Failed to retrieve Review.");
    }
};

// Menambahkan pengguna baru
exports.getAddReviewPage = (req, res) => {
    res.render('adminAddReview');
};

exports.addReview = async (req, res) => {
    const { name, email, subject, message } = req.body;
    try {
        const newReview = new Review({ name, email, subject, message });
        await newReview.save();
        res.redirect('/admin/review');
    } catch (error) {
        console.error("Failed to add review:", error);
        res.status(500).send("Failed to add review.");
    }
};

// Mengedit review
exports.getEditReviewPage = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).send("Review not found");
        res.render('adminEditReview', { review });
    } catch (error) {
        console.error("Error fetching Review:", error);
        res.status(500).send('Failed to fetch Review.');
    }
};

exports.editReview = async (req, res) => {
    const { name, email, subject, message } = req.body;
    try {
        const updatedData = { name, email, subject, message }; // Menyesuaikan dengan fields yang diupdate
        await Review.findByIdAndUpdate(req.params.id, updatedData);
        res.redirect('/admin/review');
    } catch (error) {
        console.error("Failed to update review:", error);
        res.status(500).send("Failed to update review.");
    }
};

// Menghapus pengguna
exports.deleteReview = async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.redirect('/admin/review');
    } catch (error) {
        console.error("Failed to delete Review:", error);
        res.status(500).send("Failed to delete review.");
    }
};

exports.searchUsers = async (req, res) => {
    const searchQuery = req.query.term || '';
    console.log("Search term received:", searchQuery); // Log untuk melihat term yang diterima
    const regex = new RegExp(searchQuery, 'i');
    try {
        const users = await User.find({ username: { $regex: regex } });
        console.log("Users found:", users); // Log untuk melihat user yang ditemukan
        res.json(users);
    } catch (error) {
        console.error("Search failed:", error);
        res.status(500).json({ message: "Search failed due to server error" });
    }
};









