const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    _id: String,
    username: String,
    password: String,
    first_name: String,
    last_name: String,
    email: String,
    profile_picture_url: String,
    deleted_at: String,
    password_chances: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
