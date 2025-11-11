// routes/authRoutes.js
const express = require("express");
const passport = require("passport");
const axios = require("axios");
const User = require("../models/User");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const router = express.Router();

// Configure passport local strategy using passport-local-mongoose helpers
passport.use(new LocalStrategy({ usernameField: "email" }, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      // create user
      user = await User.create({
        googleId: profile.id,
        username: profile.displayName || profile.emails?.[0]?.value,
        email: profile.emails?.[0]?.value,
        photo: profile.photos?.[0]?.value
      });
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

// SIGNUP (manual)
router.post("/signup", async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    // register via passport-local-mongoose
    const newUser = new User({ email, username });
    await User.register(newUser, password);
    res.json({ message: "Signup successful. Please login." });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: err.message || "Signup failed" });
  }
});

// LOGIN (manual)
router.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: true }, (err, user, info) => {
    if (err) {
      console.error("Login error:", err);
      return res.status(500).json({ error: err.message || "Login failed" });
    }
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    req.logIn(user, (err) => {
      if (err) return res.status(500).json({ error: "Login failed" });
      // send sanitized user
      const safeUser = { _id: user._id, email: user.email, username: user.username, photo: user.photo };
      return res.json({ user: safeUser });
    });
  })(req, res, next);
});

// Google OAuth endpoints (frontend should redirect to /auth/google)
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: process.env.CLIENT_URL || "/" }),
  (req, res) => {
    // Redirect to client after login
    res.redirect(process.env.CLIENT_AFTER_LOGIN || "/");
  }
);

// Current logged-in user
router.get("/current-user", (req, res) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ user: null });
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.json({ message: "Logged out" });
  });
});

module.exports = router;
