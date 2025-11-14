// routes/searchRoutes.js
const express = require("express");
const axios = require("axios");
const Search = require("../models/Search");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Auth required" });
    const { term } = req.body;
    if (!term) return res.status(400).json({ error: "Search term required" });

    // log search
    await Search.create({ userId: String(req.user._id), term });

    // call Unsplash (server-side)
    const response = await axios.get("https://api.unsplash.com/search/photos", {
      params: { query: term, per_page: 30 },
      headers: { Authorization: `Client-ID ${process.env.UNSPLASH_KEY}` },
    });

    return res.json({ results: response.data.results, total: response.data.total });
  } catch (err) {
    console.error("Search error:", err.message || err);
    return res.status(500).json({ error: "Search failed" });
  }
});

// top 5 terms
router.get("/top-searches", async (req, res) => {
  try {
    const top = await Search.aggregate([
      { $group: { _id: "$term", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { term: "$_id", count: 1, _id: 0 } },
    ]);
    res.json(top);
  } catch (err) {
    console.error("Top searches error:", err);
    res.status(500).json({ error: "Failed to get top searches" });
  }
});

// user's history
router.get("/history", async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Auth required" });
    const history = await Search.find({ userId: String(req.user._id) }).sort({ timestamp: -1 }).limit(50);
    res.json(history);
  } catch (err) {
    console.error("History error:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

module.exports = router;
