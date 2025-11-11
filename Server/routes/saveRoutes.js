// routes/saveRoutes.js
const express = require("express");
const SavedImage = require("../models/SavedImage");
const router = express.Router();

// POST /api/save-images
router.post("/", async (req, res) => {
  try {
    const { imageUrl, description, userId } = req.body;

    if (!userId) {
      console.error("❌ Missing userId");
      return res.status(401).json({ message: "Please login first" });
    }

    if (!imageUrl) {
      return res.status(400).json({ message: "imageUrl is required" });
    }

    const savedImage = new SavedImage({
      imageUrl,
      description: description || "",
      userId,
    });

    await savedImage.save();
    console.log("✅ Image saved for user:", userId);

    res.status(201).json({ message: "Image saved successfully", savedImage });
  } catch (err) {
    console.error("Error saving image:", err);
    res.status(500).json({ message: "Error saving image", error: err.message });
  }
});

// GET /api/save-images/:userId — get all saved images
router.get("/:userId", async (req, res) => {
  try {
    const images = await SavedImage.find({ userId: req.params.userId }).sort({ _id: -1 });
    res.json(images);
  } catch (err) {
    console.error("Error fetching saved images:", err);
    res.status(500).json({ message: "Error fetching images" });
  }
});

module.exports = router;
