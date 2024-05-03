const { authenticateAdmin } = require('../utils/auth');
const User = require('../models/account'); 
const Review = require('../models/review');
const bcrypt = require("bcrypt");

exports.adminLogin = async (req, res) => {
    const { username, password } = req.body;
    const result = await authenticateAdmin(username, password);
    if (result.success) {
        // Mengatur sesi admin atau token jika diperlukan
        req.session.isAdmin = true; // Contoh set session
        res.redirect('/admin');
    } else {
        res.render('adminLogin', { errorMessage: result.error });
    }
};

exports.getAdminDashboard = async (req, res) => {
    const page = req.query.page || 'users';
    try {
        if (page === 'users') {
            const users = await User.find().exec();
            res.render('admin', { page: 'users', users: users });
        } else if (page === 'review') {
            const reviews = await Review.find().exec(); // Tidak perlu populate karena tidak menggunakan user_id
            res.render('admin', { page: 'review', reviews: reviews });
        }
    } catch (error) {
        console.error("Error retrieving data:", error);
        res.status(500).send("Failed to retrieve data.");
    }
};




exports.getEditPage = async (req, res) => {
    const user = await User.findById(req.params.id);
    res.render('adminEdit', { user });  // Pastikan Anda memiliki view ini
};

exports.getAddPage = async (req, res) => {
    const user = await User.findById(req.params.id);
    res.render('adminAdd', { user });  // Pastikan Anda memiliki view ini
};

const getModel = (type) => {
    switch(type) {
        case 'user':
            return User;
        case 'review':
            return Review;
        default:
            throw new Error("Invalid type provided");
    }
};

exports.addData = async (req, res) => {
    const { type, username, email, password, securityAnswer } = req.body;
    try {
        const Model = getModel(type); // Dapatkan model yang sesuai
        const hashedPassword = await bcrypt.hash(password, 10);
        const newData = new Model({
            username,
            email,
            password: hashedPassword,
            securityAnswer
        });
        await newData.save();
        res.redirect('/admin');
    } catch (error) {
        console.error(`Failed to add new ${type}:`, error);
        res.status(500).send(`Failed to add new ${type}.`);
    }
};

exports.editData = async (req, res) => {
    const { type, id, username, email, password, securityAnswer } = req.body;
    try {
        const Model = getModel(type);
        const updatedData = {};
        if (username) updatedData.username = username;
        if (email) updatedData.email = email;
        if (password) updatedData.password = await bcrypt.hash(password, 10);
        if (securityAnswer) updatedData.securityAnswer = securityAnswer;

        await Model.findByIdAndUpdate(id, updatedData, { new: true });
        res.redirect('/admin');
    } catch (error) {
        console.error(`Error updating ${type}:`, error);
        res.status(500).send(`Failed to update ${type}.`);
    }
};

exports.deleteData = async (req, res) => {
    const { type, id } = req.body;
    try {
        const Model = getModel(type);
        await Model.findByIdAndDelete(id);
        res.redirect('/admin');
    } catch (error) {
        console.error(`Error deleting ${type}:`, error);
        res.status(500).send(`Failed to delete ${type}.`);
    }
};


exports.searchUsers = async (req, res) => {
    const searchQuery = req.query.term || '';
    const regex = new RegExp(searchQuery, 'i');
    try {
        const users = await User.find({ username: { $regex: regex } });
        res.json(users); // Mengirim balik data sebagai JSON
    } catch (error) {
        console.error("Search failed:", error);
        res.status(500).json({ message: "Search failed due to server error" });
    }
};







