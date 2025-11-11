// models/User.js
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String, unique: true, sparse: true },
  googleId: { type: String, index: true, sparse: true },
  photo: { type: String }
}, { timestamps: true });

// passport-local-mongoose will add: username (by default), hash, salt helpers
// but we want username to be full name; for login by email, we'll use email as usernameField below in authRoutes.
UserSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
  usernameUnique: false // we'll still enforce unique email by schema
});

module.exports = mongoose.model("User", UserSchema);
