const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    full_name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female", "Other"],
      required: true,
    },
    date_of_birth: {
      type: Date,
      required: true,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    profilePictures: [
      {
        type: String,
      },
    ],
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
    },
    interests: [
      {
        type: String,
      },
    ],
    preferences: {
      gender: {
        type: [String],
        enum: ["Male", "Female", "Non-binary", "Other"],
      },
      ageRange: {
        min: {
          type: Number,
          default: 18,
        },
        max: {
          type: Number,
          default: 100,
        },
      },
      distance: {
        type: Number,
        default: 50, // in kilometers
      },
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    matches: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
