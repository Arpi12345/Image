// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const MongoStore = require("connect-mongo");

const configurePassport = require("./config/passport");

const authRoutes = require("./routes/authRoutes");
const searchRoutes = require("./routes/searchRoutes");
const saveRoutes = require("./routes/saveRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// TRUST PROXY (Render / any proxy) — required for secure cookies
app.set("trust proxy", 1);

// Load passport strategies
configurePassport();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL, // e.g. https://image-n5rk.onrender.com
].filter(Boolean);

// CORS (dynamic but strict)
app.use(
  cors({
    origin: function (origin, callback) {
      // allow non-browser requests (curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS not allowed for origin: " + origin), false);
    },
    credentials: true,
  })
);

// Environment detection
const isProduction = process.env.NODE_ENV === "production";

// Sessions (store in MongoDB)
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
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: isProduction, // true on Render (HTTPS)
      sameSite: isProduction ? "none" : "lax",
    },
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Debug logging (helpful)
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.path} sessionID=${req.sessionID} user=${req.user ? req.user.email || req.user.username : 'null'}`);
  next();
});

// Routes
app.use("/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/save-images", saveRoutes);

// Root
app.get("/", (req, res) => res.send("Image App Server running 🚀"));

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("DB connection error:", err);
    process.exit(1);
  }
}
start();
