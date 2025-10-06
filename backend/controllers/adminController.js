const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Server error fetching users" });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ["viewer", "user", "admin"];

    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Prevent self-demotion (optional safeguard)
    if (user._id.toString() === req.user._id.toString() && role !== "admin") {
      return res
        .status(403)
        .json({ message: "You cannot change your own admin role." });
    }

    user.role = role;
    user.pendingAdminRequest = false;

    await user.save();

    res.status(200).json({
      message: `User role updated to ${role}`,
      user,
    });
  } catch (error) {
    console.error("Role update error:", error);
    res.status(500).json({ message: "Error updating user role", error: error.message });
  }
};

exports.requestAdminAccess = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "admin") return res.status(400).json({ message: "Already an admin" });
    if (user.pendingAdminRequest) return res.status(400).json({ message: "Request already pending" });

    user.pendingAdminRequest = true;
    await user.save();
    res.status(200).json({ message: "Admin access request sent" });
  } catch (error) {
    console.error("Request admin error:", error);
    res.status(500).json({ message: "Server error requesting admin access" });
  }
};
