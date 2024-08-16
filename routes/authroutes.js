const express = require("express");
const router = express.Router();
const {
  registerUser,
  verifyOtp,
  loginUser,
  resendOtp,
  getUserDetails,
  updateUserDetails,
  deleteUser,
  getUserLikes,
  likeUser,
  getUserMatches,
  filterAndGetUser,
  getAlluser,
} = require("../controller/authcontroller.js");

const upload = require("../middleware/fileUpload");
const { jsonAuthMiddleware } = require("../authorization/auth.js");

// Authentication Routes
router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginUser);
router.post("/resend-otp", resendOtp);
router.get("/users", jsonAuthMiddleware, getAlluser);

// User Management Routes
router.get("/singleuser", jsonAuthMiddleware, getUserDetails); // Route to get user details
router.put(
  "/user/:userId",
  jsonAuthMiddleware,
  upload.single("profile_picture"),
  updateUserDetails
); // Route to update user details
router.delete("/user/:userId", jsonAuthMiddleware, deleteUser); // Route to delete user
//Like Matches
router.post("/like/:likedUserId", jsonAuthMiddleware, likeUser);
router.get("/:userId/likes", jsonAuthMiddleware, getUserLikes);
router.get("/:userId/matches", jsonAuthMiddleware, getUserMatches);
router.post("/user/filter", jsonAuthMiddleware, filterAndGetUser);

module.exports = router;
