const User = require("../model/authmodels.js");
const {
  generateVerificationCode,
  generateToken,
} = require("../authorization/auth.js");
const sendMail = require("../middleware/sendMail.js");

const registerUser = async (req, res) => {
  const {
    full_name,
    email,
    phone_number,
    date_of_birth,
    gender,
    bio,
    interests,
    location,
  } = req.body;

  const otp = generateVerificationCode();
  const otpExpires = new Date(Date.now() + 90 * 1000); // OTP expires in 90 seconds

  const user = new User({
    full_name,
    email,
    phone_number,
    date_of_birth,
    gender,
    bio,
    interests,
    location,
    otp,
    otpExpires,
  });

  try {
    await user.save();
    await sendMail(email, otp);
    const token = generateToken(user._id);
    res.status(201).json({
      message:
        "User registered successfully. Please check your email for the OTP.",
      token,
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "Internal server error. Please try again later." });
  }
};
const resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const otp = generateVerificationCode();
    const otpExpires = new Date(Date.now() + 90 * 1000); // OTP expires in 90 seconds

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await sendMail(email, otp);
    res.status(200).json({
      message: "OTP resent to your email. Please check your email for the OTP.",
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "Internal server error. Please try again later." });
  }
};
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    user.status = "active";
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "Internal server error. Please try again later." });
  }
};

const loginUser = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const token = generateToken(user._id);
    const otp = generateVerificationCode();
    const otpExpires = new Date(Date.now() + 90 * 1000); // OTP expires in 90 seconds

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await sendMail(email, otp);
    res.status(200).json({
      token,
      message: "OTP sent to your email. Please check your email for the OTP.",
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "Internal server error. Please try again later." });
  }
};

module.exports = { registerUser, verifyOtp, loginUser, resendOtp };
