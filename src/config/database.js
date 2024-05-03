const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Connection error:', error);
    }
};

// Connection event handling
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));


const User = require('../models/account');
const Review = require('../models/review');

// Export the database connection
module.exports = { connectDB, db };

