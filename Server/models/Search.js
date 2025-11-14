// models/Search.js
const mongoose = require("mongoose");

const SearchSchema = new mongoose.Schema({
  userId: String,
  term: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Search", SearchSchema);
