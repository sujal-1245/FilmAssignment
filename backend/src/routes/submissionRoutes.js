const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "tmp/" });

const requireAuth = require("../middleware/auth");
const requireAdmin = require("../middleware/admin");
const requireOwnerOrAdmin = require("../middleware/owner");

const {
  uploadSubmission,
  deleteSubmission,
  getAllSubmissions,
  addRemark,
  getSignedPdfUrl
} = require("../controllers/submissionController");

const router = express.Router();

// Get all submissions
router.get("/", getAllSubmissions);

// Upload submission
router.post("/", requireAuth, upload.single("pdf"), uploadSubmission);

// Get signed URL for secure PDF view
router.get("/:id/url", getSignedPdfUrl);

// Delete submission
router.delete("/:id", requireAuth, requireOwnerOrAdmin, deleteSubmission);

// Add remark (admin only)
router.put("/remark/:id", requireAuth, requireAdmin, addRemark);

module.exports = router;
