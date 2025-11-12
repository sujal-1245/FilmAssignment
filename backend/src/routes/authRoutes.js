const express = require("express");
const {
  register,
  login,
  registerAdmin,
  getMe,
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../controllers/authController");
const requireAuth = require("../middleware/auth");
const requireAdmin = require("../middleware/admin");

const router = express.Router();

// Public
router.post("/register", register);
router.post("/login", login);

// Protected
router.get("/me", requireAuth, getMe);

// Admin-only
router.post("/register-admin", requireAuth, requireAdmin, registerAdmin);
router.get("/users", requireAuth, requireAdmin, getAllUsers);

// Self or Admin
router.put("/users/:id", requireAuth, updateUser);
router.delete("/users/:id", requireAuth, deleteUser);

module.exports = router;
