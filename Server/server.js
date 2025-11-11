// server.js
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

// initialize app
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS (allow your frontend origin; set CLIENT_URL in .env)
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

// session store in Mongo (persistent sessions)
app.use(session({
  secret: process.env.SESSION_SECRET || "keyboardcat",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: "sessions"
  }),
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
}));

// passport (will use authRoutes to configure strategies)
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);               // /auth/signup, /auth/login, /auth/google, /auth/current-user, /auth/logout
app.use("/api/search", searchRoutes);       // POST /api/search , GET /api/search/popular
app.use("/api/save-images", saveRoutes);    // POST /api/save-images, GET /api/save-images/:userId

// basic root
app.get("/", (req, res) => res.send("Image App Server running"));

// connect mongoose and start
async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  } catch (err) {
    console.error("DB connection error:", err);
    process.exit(1);
  }
}
start();
