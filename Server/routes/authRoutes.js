// routes/authRoutes.js
const express = require("express");
const passport = require("passport");
const User = require("../models/User");

const router = express.Router();

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { email, password, username } = req.body;

    const newUser = new User({ email, username });
    await User.register(newUser, password);

    res.json({ message: "Signup successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: true }, (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    req.logIn(user, (err) => {
      if (err) return res.status(500).json({ error: "Login failed" });

      const safeUser = {
        _id: user._id,
        email: user.email,
        username: user.username,
        photo: user.photo,
      };

      res.json({ user: safeUser });
    });
  })(req, res, next);
});

// GOOGLE LOGIN
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// GOOGLE CALLBACK
router.get("/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.CLIENT_URL,
    session: true,
  }),
  (req, res) => {
    res.redirect(process.env.CLIENT_AFTER_LOGIN);
  }
);

// CURRENT USER
router.get("/current-user", (req, res) => {
  res.json({ user: req.user || null });
});

// LOGOUT
router.get("/logout", (req, res) => {
  req.logout(() => res.json({ message: "Logged out" }));
});

module.exports = router;
