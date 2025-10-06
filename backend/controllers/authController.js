const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "12h" });
};

// ==================== REGISTER USER ====================
exports.registerUser = async (req, res) => {
  const { fullName, email, password, profileImageUrl } = req.body || {};

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "Please provide all required fields." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // 👇 new users start as viewer
    const user = await User.create({
      fullName,
      email,
      password,
      profileImageUrl,
      role: "viewer",
      pendingAdminRequest: false,
    });

    // 👇 sanitize response
    res.status(201).json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        role: user.role,
        pendingAdminRequest: user.pendingAdminRequest,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
};

// ==================== LOGIN USER ====================
exports.loginUser = async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide all required fields." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(404).json({ message: "Invalid Credentials" });
    }

    // 👇 sanitize response
    res.status(200).json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        role: user.role,
        pendingAdminRequest: user.pendingAdminRequest,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in user", error: error.message });
  }
};

// ==================== GET USER INFO ====================
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      role: user.role,
      pendingAdminRequest: user.pendingAdminRequest,
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Error fetching user info" });
  }
};
