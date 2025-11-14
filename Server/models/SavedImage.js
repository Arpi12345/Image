// models/SavedImage.js
const mongoose = require("mongoose");

const SavedImageSchema = new mongoose.Schema({
  userId: String,
  imageUrl: String,
  description: String,
  unsplashId: String,
  savedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SavedImage", SavedImageSchema);
