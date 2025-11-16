// models/Search.js
const mongoose = require("mongoose");

const SearchSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  term: { type: String, required: true, index: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Search", SearchSchema);
