// routes/searchRoutes.js
const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const Search = require("../models/Search");
const SavedImage = require("../models/SavedImage"); // optional usage
const router = express.Router();

const UNSPLASH_API = "https://api.unsplash.com/search/photos";
const UNSPLASH_KEY = process.env.UNSPLASH_KEY;

// helper to determine userId safely (prefer authenticated user)
function resolveUserId(reqBody, reqUser) {
  if (reqUser && reqUser._id) return reqUser._id;
  if (reqBody && reqBody.userId && mongoose.Types.ObjectId.isValid(reqBody.userId)) {
    return reqBody.userId;
  }
  return null;
}

// POST /api/search
// body: { term, userId (optional) }
// If authenticated, prefers req.user._id
router.post("/", async (req, res) => {
  try {
    const { term } = req.body;
    if (!term || term.trim().length === 0) {
      return res.status(400).json({ message: "term is required" });
    }
    const userId = resolveUserId(req.body, req.user);

    console.log(" Searching Unsplash for:", term);

    const unsplashRes = await axios.get(UNSPLASH_API, {
      params: { query: term, per_page: 30 },
      headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` }
    });

    const results = unsplashRes.data.results || [];

    // Save search record (userId optional)
    const savedSearch = new Search({ userId, term, timestamp: new Date() });
    await savedSearch.save();

    // return results wrapped
    res.json({ term, resultsCount: results.length, results });
  } catch (err) {
    console.error(" Error /api/search:", err.response?.data || err.message || err);
    res.status(500).json({ message: "Server error", error: err.message || err });
  }
});

// GET /api/search/popular  (alias: /api/search/top-searches)
// returns top 5 most frequent search terms across all users
router.get("/popular", async (req, res) => {
  try {
    // aggregate counts by term
    const agg = await Search.aggregate([
      { $group: { _id: "$term", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    // format
    const popular = agg.map(item => ({ term: item._id, count: item.count }));
    res.json(popular);
  } catch (err) {
    console.error("Error /api/search/popular:", err);
    res.status(500).json({ error: err.message || err });
  }
});

// alias route for assignment spec
router.get("/top-searches", async (req, res) => {
  try {
    const agg = await Search.aggregate([
      { $group: { _id: "$term", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    const top = agg.map(i => ({ term: i._id, count: i.count }));
    res.json(top);
  } catch (err) {
    console.error("Error /api/search/top-searches:", err);
    res.status(500).json({ error: err.message || err });
  }
});

// GET /api/search/history (optional) - returns current user's history
router.get("/history", async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    const h = await Search.find({ userId: req.user._id }).sort({ timestamp: -1 }).limit(100);
    res.json(h);
  } catch (err) {
    console.error("Error /api/search/history:", err);
    res.status(500).json({ error: err.message || err });
  }
});

module.exports = router;
