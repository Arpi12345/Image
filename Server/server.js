// Server/server.js
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

// initialize passport strategies
configurePassport();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allowed origins - local dev and your deployed frontend
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
  process.env.CLIENT_AFTER_LOGIN ? new URL(process.env.CLIENT_AFTER_LOGIN).origin : "https://image-n5rk.onrender.com"
];

// CORS - dynamic origin check
app.use(
  cors({
    origin: function (origin, callback) {
      // allow refreshes/requests from non-browser tools (no origin)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS not allowed for origin: " + origin), false);
    },
    credentials: true,
  })
);

// set trust proxy if running on https hosting (Render)
const isProduction = process.env.NODE_ENV === "production";
if (isProduction) app.set("trust proxy", 1);

// session configuration
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
      secure: isProduction, // true on HTTPS (Render), false on localhost
      sameSite: isProduction ? "none" : "lax", // none for cross-site cookies in prod
    },
  })
);

// initialize passport after session
app.use(passport.initialize());
app.use(passport.session());

// helpful debug logging
app.use((req, res, next) => {
  console.log(
    `[REQ] ${req.method} ${req.path} sessionID=${req.sessionID} user=${req.user ? (req.user.email || req.user.username) : "null"} origin=${req.headers.origin || "N/A"}`
  );
  next();
});

// API routes
app.use("/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/save-images", saveRoutes);

// root
app.get("/", (req, res) => res.send("Image App Server running"));

// start
async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("DB connection error:", err);
    process.exit(1);
  }
}
start();
