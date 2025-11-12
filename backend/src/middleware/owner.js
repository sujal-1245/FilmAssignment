const Submission = require("../models/Submission");

/**
 * Middleware to allow access if the authenticated user
 * owns the submission (studentId) or has an admin role.
 */
const requireOwnerOrAdmin = async (req, res, next) => {
  try {
    // Validate route param
    const submissionId = req.params.id;
    if (!submissionId) {
      return res.status(400).json({ message: "Missing submission ID" });
    }

    // Fetch the submission
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Check ownership
    const isOwner =
      submission.studentId?.toString() === req.user._id?.toString();
    const isAdmin = req.user.role === "admin";

    if (isOwner || isAdmin) {
      return next();
    }

    // Deny access
    return res.status(403).json({ message: "Access forbidden" });
  } catch (err) {
    console.error("❌ requireOwnerOrAdmin error:", err.message);
    return res
      .status(500)
      .json({ message: "Server error in owner/admin middleware" });
  }
};

module.exports = requireOwnerOrAdmin;
