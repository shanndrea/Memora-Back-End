// models/review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    subject: { 
        type: String 
    },
    message: { 
        type: String, 
        required: true 
    }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
