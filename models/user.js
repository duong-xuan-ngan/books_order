const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  verified: Boolean,
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

const User = mongoose.model("User", userSchema); 

module.exports = User;
