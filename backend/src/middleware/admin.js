/**
 * Middleware to restrict route access to admins only
 */
const requireAdmin = (req, res, next) => {
  try {
    // Ensure user is attached and has admin role
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin allowed" });
    }

    next();
  } catch (err) {
    console.error("❌ requireAdmin error:", err.message);
    return res.status(500).json({ message: "Server error in admin middleware" });
  }
};

module.exports = requireAdmin;
