const express = require("express");
const passport = require("passport");
const User = require("../models/User");

const router = express.Router();

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

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: process.env.CLIENT_URL || "http://localhost:5173/login" }),
  (req, res) => {
    req.logIn(req.user, (err) => {
      if (err) {
        console.error("Google login session error:", err);
        return res.redirect(process.env.CLIENT_URL || "http://localhost:5173/login");
      }
      req.session.save(() => {
        return res.redirect(process.env.CLIENT_AFTER_LOGIN || "http://localhost:5173/");
      });
    });
  }
);

router.get("/current-user", (req, res) => {
  if (req.user) return res.json({ user: req.user });
  return res.status(401).json({ user: null });
});

router.get("/logout", (req, res) => {
  req.logout(() => {
    res.json({ message: "Logged out" });
  });
});

module.exports = router;
