const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  let token;

  //   Ensure we support "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      //  Decode JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //  Fetch user (exclude password)
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      //Attach to request (so controllers can use req.user.role)
      req.user = user;

      next();
    } catch (error) {
      console.error("❌ protect middleware error:", error.message);
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};
