const User = require("../models/User");
const jwt = require("jsonwebtoken");

// 🔐 Utility: Generate JWT
const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

// ✅ REGISTER (Student)
exports.register = async (req, res) => {
  try {
    const { name, enrollment, department, program, batch, semester } = req.body;

    if (!name || !enrollment)
      return res
        .status(400)
        .json({ message: "Name and enrollment are required" });

    const exists = await User.findOne({ enrollment });
    if (exists)
      return res.status(400).json({ message: "Enrollment already registered" });

    const user = await User.create({
      name,
      enrollment,
      department,
      program,
      batch,
      semester,
      role: "student",
    });

    const token = generateToken(user);
    res.status(201).json({ token, user });
  } catch (err) {
    console.error("❌ Error in register:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ LOGIN (Student / Admin)
exports.login = async (req, res) => {
  try {
    const { name, enrollment } = req.body;

    const user = await User.findOne({ enrollment });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.name.toLowerCase() !== name.toLowerCase()) {
      return res.status(400).json({ message: "Invalid name" });
    }

    const token = generateToken(user);
    res.json({ token, user });
  } catch (err) {
    console.error("❌ Error in login:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ REGISTER ADMIN (Faculty only)
exports.registerAdmin = async (req, res) => {
  try {
    const { name, enrollment } = req.body;

    if (!name || !enrollment) {
      return res
        .status(400)
        .json({ message: "Name and enrollment are required" });
    }

    const exists = await User.findOne({ enrollment });
    if (exists)
      return res.status(400).json({ message: "Enrollment already registered" });

    const admin = await User.create({
      name,
      enrollment,
      role: "admin",
    });

    const token = generateToken(admin);
    res.status(201).json({ token, user: admin });
  } catch (err) {
    console.error("❌ Error in registerAdmin:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ CURRENT USER
exports.getMe = async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟡 GET ALL USERS (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Admins only." });
    }

    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ error: err.message });
  }
};

// 🟡 UPDATE USER (Self or Admin)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Only self or admin can update
    if (req.user._id.toString() !== id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Prevent role changes by non-admins
    if (updates.role && req.user.role !== "admin") {
      delete updates.role;
    }

    const user = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("❌ Error updating user:", err);
    res.status(500).json({ error: err.message });
  }
};

// 🟡 DELETE USER (Self or Admin)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Only self or admin can delete
    if (req.user._id.toString() !== id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting user:", err);
    res.status(500).json({ error: err.message });
  }
};
