const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  phone_number: {
    type: String,
    required: true,
    unique: true,
  },
  date_of_birth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female"],
  },
  profile_picture: {
    type: String,
  },
  bio: {
    type: String,
  },
  interests: {
    type: [String],
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: false,
    },
    coordinates: {
      type: [Number],
      required: false,
    },
  },
  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["pending", "active"],
    default: "pending",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

userSchema.index({ location: "2dsphere" });

const User = mongoose.model("User", userSchema);
module.exports = User;
