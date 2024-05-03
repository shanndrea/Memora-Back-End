const express = require('express');
const app = express();
const passport = require('passport');
require('./src/config/passport-setup');
const { connectDB } = require('./src/config/database');
const userRoutes = require('./src/routes/userRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const dotenv = require('dotenv');

const session = require('express-session');

app.use(session({ secret: 'anything', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


// Load environment variables from .env file
dotenv.config();

connectDB();

// Middleware

app.use(session({
    secret: 'YourSecretKey',
    resave: false,
    saveUninitialized: false,
}));
    
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.static("public"));

// Routes
app.use('/', userRoutes);
app.use('/admin', adminRoutes);

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on Port: http://localhost:${port}`);
});


