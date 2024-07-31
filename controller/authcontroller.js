const User = require("../model/authmodels.js");
const {
  generateVerificationCode,
  generateToken,
} = require("../authorization/auth.js");
const sendMail = require("../middleware/sendMail.js");

// Register User
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

// Resend OTP
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

// Verify OTP
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

// Login User
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

// Get User Details
const getUserDetails = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select("-otp -otpExpires"); // Exclude sensitive fields

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "Internal server error. Please try again later." });
  }
};

// Update User Details
const updateUserDetails = async (req, res) => {
  const { userId } = req.params;
  const updates = req.body;

  // Check if a profile picture is uploaded
  if (req.file) {
    updates.profile_picture = req.file.filename; // Save the file path in the database
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user details
    Object.assign(user, updates);
    await user.save();

    res.status(200).json({ message: "User details updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "Internal server error. Please try again later." });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "Internal server error. Please try again later." });
  }
};
const likeUser = async (req, res) => {
  const { userId, likedUserId } = req.params;

  try {
    const user = await User.findById(userId);
    const likedUser = await User.findById(likedUserId);

    if (!user || !likedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.likes.includes(likedUserId)) {
      user.likes.push(likedUserId);
      await user.save();
    }

    // Check if the liked user also liked the current user
    if (likedUser.likes.includes(userId)) {
      user.matches.push(likedUserId);
      likedUser.matches.push(userId);
      await user.save();
      await likedUser.save();
    }

    res.status(200).json({ message: "User liked successfully" });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "Internal server error. Please try again later." });
  }
};

// Get likes of a user
const getUserLikes = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate(
      "likes",
      "full_name email"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user.likes);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "Internal server error. Please try again later." });
  }
};

// Get matches of a user
const getUserMatches = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate(
      "matches",
      "full_name email"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user.matches);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "Internal server error. Please try again later." });
  }
};
module.exports = {
  registerUser,
  verifyOtp,
  loginUser,
  resendOtp,
  getUserDetails,
  updateUserDetails,
  deleteUser,
  getUserMatches,
  getUserLikes,
  likeUser,
};
