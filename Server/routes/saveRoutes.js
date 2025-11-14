// Server/routes/saveRoutes.js
const express = require("express");
const SavedImage = require("../models/SavedImage"); // assume this model exists
const router = express.Router();

// require auth middleware (simple)
function ensureAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ message: "Unauthorized" });
}

// save image
router.post("/", ensureAuth, async (req, res) => {
  try {
    const { url, title } = req.body;
    const saved = await SavedImage.create({ userId: req.user._id, url, title });
    res.json({ saved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// list saved by user
router.get("/", ensureAuth, async (req, res) => {
  try {
    const list = await SavedImage.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ list });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
