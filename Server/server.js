require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const MongoStore = require("connect-mongo");

const authRoutes = require("./routes/authRoutes");
const searchRoutes = require("./routes/searchRoutes");
const saveRoutes = require("./routes/saveRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// --- TRUST PROXY (important for Render HTTPS) ---
app.set("trust proxy", 1);

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- CORS setup ---
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// --- Sessions (store in MongoDB) ---
app.use(
  session({
    secret: process.env.SESSION_SECRET || "keyboardcat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "none", // required for cross-origin cookies
      secure: true, // must be true for HTTPS (Render)
    },
  })
);

// --- Passport ---
app.use(passport.initialize());
app.use(passport.session());

// --- Routes ---
app.use("/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/save-images", saveRoutes);

// --- Root route ---
app.get("/", (req, res) => res.send("Image App Server running on Render 🚀"));

// --- Connect MongoDB & Start Server ---
async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ DB connection error:", err);
    process.exit(1);
  }
}
start();
