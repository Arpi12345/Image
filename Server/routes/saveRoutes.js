// routes/saveRoutes.js
const express = require("express");
const SavedImage = require("../models/SavedImage");

const router = express.Router();

// Save images
router.post("/", async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Auth required" });
    const { imageUrl, description, unsplashId } = req.body;
    const saved = await SavedImage.create({
      userId: String(req.user._id),
      imageUrl,
      description,
      unsplashId,
    });
    res.json(saved);
  } catch (err) {
    console.error("Save image error:", err);
    res.status(500).json({ error: "Failed to save image" });
  }
});

// Get saved images for user
router.get("/:userId", async (req, res) => {
  try {
    if (!req.user || String(req.user._id) !== String(req.params.userId)) return res.status(401).json({ error: "Auth required" });
    const images = await SavedImage.find({ userId: String(req.params.userId) }).sort({ savedAt: -1 });
    res.json(images);
  } catch (err) {
    console.error("Get saved images error:", err);
    res.status(500).json({ error: "Failed to load saved images" });
  }
});

module.exports = router;
