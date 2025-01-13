
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');

// User Schema Definition
const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('User', UserSchema);

// Passport Configuration
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.NODE_ENV === 'production' 
      ? 'https://mrrapo.onrender.com/auth/google/callback' 
      : 'http://localhost:8000/auth/google/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        return done(null, existingUser);
      }

      // Create new user if doesn't exist
      const newUser = await User.create({
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,
      });

      done(null, newUser);
    } catch (error) {
      console.error('Error in Google Strategy:', error);
      done(error, null);
    }
  }
));

// Session Serialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.error('Error during deserialization:', error);
    done(error, null);
  }
});

// Auth Routes
const router = express.Router();

// Initialize Google Auth
router.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

// Google Auth Callback
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('http://localhost:3000/profile');
  }
);

// Profile Route
router.get('/profile', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const user = req.user;
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    displayName: user.displayName,
    email: user.email,
    googleId: user.googleId,
  });
});

// Logout Route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.redirect('/');
    }
    res.redirect('/');
  });
});

module.exports = router;