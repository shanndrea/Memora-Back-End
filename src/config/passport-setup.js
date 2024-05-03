const passport = require('passport');
require('dotenv').config();
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/account'); // Impor model pengguna

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(id, done) {
    done(null, id);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/google/callback"
  },
  
  async function(accessToken, refreshToken, profile, cb) {
    try {
        // Cari pengguna dengan Google ID yang cocok dalam basis data
        let existingUser = await User.findOneAndUpdate(
            { googleId: profile.id }, // Kriteria pencarian
            { $setOnInsert: { // Data yang akan dimasukkan jika tidak ada entri yang cocok
                googleId: profile.id,
                username: profile.displayName,
                email: profile.emails[0].value
            }},
            { upsert: true, new: true } // Opsional: Buat entri baru jika tidak ditemukan
        );
        return cb(null, existingUser);
    } catch (error) {
        return cb(error);
    }
  }
));
