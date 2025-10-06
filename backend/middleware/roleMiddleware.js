// middleware/roleMiddleware.js
module.exports.requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Ensure user is authenticated (user injected from auth middleware)
      const user = req.user;

      if (!user) {
        return res.status(401).json({ message: "Unauthorized — user not found" });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          message: `Access denied — requires one of: ${allowedRoles.join(", ")}`
        });
      }

      next();
    } catch (err) {
      console.error("Role check error:", err);
      res.status(500).json({ message: "Server error during role validation" });
    }
  };
};

// Optional: specific admin-only check
module.exports.requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
};
