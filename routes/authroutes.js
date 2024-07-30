const express = require("express");
const router = express.Router();
const {
  registerUser,
  verifyOtp,
  loginUser,
  resendOtp,
} = require("../controller/authcontroller.js");

router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginUser);
router.post("/resend-otp", resendOtp);

module.exports = router;
