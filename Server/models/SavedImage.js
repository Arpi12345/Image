// models/SavedImage.js
const mongoose = require("mongoose");

const SavedImageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  imageUrl: { type: String, required: true },
  description: { type: String },
  unsplashId: { type: String }, // optional unsplash id
  term: { type: String }, // search term that saved this image
  savedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SavedImage", SavedImageSchema);
