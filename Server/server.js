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

const app = express();
const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === "production";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* -----------------------------------------------------
   CORS – allow Localhost AND Render Frontend
----------------------------------------------------- */
const whitelist = [
  "http://localhost:5173",
  "https://image-n5rk.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow server-to-server calls
      if (whitelist.includes(origin) || origin.startsWith("https://image-n5rk.onrender.com")) {
        return callback(null, true);
      }
      return callback(new Error("CORS blocked: " + origin));
    },
    credentials: true,
  })
);

// Needed for secure cookies on Render
app.set("trust proxy", 1);

/* -----------------------------------------------------
   SESSION – local + Render compatible
----------------------------------------------------- */
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
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
    },
  })
);

/* -----------------------------------------------------
   PASSPORT – must be AFTER session
----------------------------------------------------- */
const configurePassport = require("./config/passport");
configurePassport();

app.use(passport.initialize());
app.use(passport.session());

/* -----------------------------------------------------
   ROUTES
----------------------------------------------------- */
app.use("/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/save-images", saveRoutes);

/* -----------------------------------------------------
   ROOT CHECK
----------------------------------------------------- */
app.get("/", (req, res) => res.send("Image App Server running"));

/* -----------------------------------------------------
   START SERVER
----------------------------------------------------- */
async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
    app.listen(PORT, () =>
      console.log(`Server listening on port ${PORT}`)
    );
  } catch (err) {
    console.error("DB connection error:", err);
    process.exit(1);
  }
}
start();
