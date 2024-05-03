const mongoose = require('mongoose');

// Create a schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    securityAnswer: {
        type: String,
        required: true
    },
    googleId: String,
    
    isAdmin: {
        type: Boolean,
        default: false // Set default value to false
    }
});

// Create a model from the schema
const User = mongoose.model("User", userSchema);

// Export the User model
module.exports = User;
