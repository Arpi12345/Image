// Server/routes/authRoutes.js
const express = require("express");
const passport = require("passport");
const User = require("../models/User");

const router = express.Router();

// signup
router.post("/signup", async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });
    const newUser = new User({ email, username });
    await User.register(newUser, password);
    res.json({ message: "Signup successful. Please login." });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: err.message || "Signup failed" });
  }
});

// login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    req.logIn(user, (err) => {
      if (err) return res.status(500).json({ error: "Login failed" });
      const safeUser = { _id: user._id, email: user.email, username: user.username, photo: user.photo };
      return res.json({ user: safeUser });
    });
  })(req, res, next);
});

// Google OAuth start
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: process.env.CLIENT_URL || "http://localhost:5173/login" }),
  (req, res) => {
    // ensure session saved then redirect to client
    req.session.save(() => {
      res.redirect(process.env.CLIENT_AFTER_LOGIN || (process.env.CLIENT_URL || "http://localhost:5173") );
    });
  }
);

// get current user
router.get("/current-user", (req, res) => {
  if (req.user) return res.json({ user: req.user });
  return res.status(401).json({ user: null });
});

// logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.json({ message: "Logged out" });
    });
  });
});

module.exports = router;
