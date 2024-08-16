const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  full_name: { type: String, required: true },
  email: { type: String, required: true },
  gender: { type: String, required: true },
  date_of_birth: { type: Date, required: true },
  phone_number: { type: String, required: true },
  profile_picture: { type: String },
  bio: {
    type: String,
  },
  interests: [
    {
      type: String,
    },
  ],
  location: [
    {
      latitude: {
        type: String,
      },
      longitude: {
        type: String,
      },
    },
  ],
  otp: { type: String }, // Add this field for OTP
  otpExpires: { type: Date }, // Add this field for OTP expiration time
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  matches: [{ type: Schema.Types.ObjectId, ref: "User" }],
  isActive: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
