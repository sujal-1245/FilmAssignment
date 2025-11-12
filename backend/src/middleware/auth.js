const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Middleware to verify JWT token and attach the user to req.user
 */
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Ensure Bearer token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // Find user by decoded ID
    const user = await User.findById(decoded.id).select("-__v");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    console.error("❌ requireAuth error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = requireAuth;
