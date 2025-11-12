const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    enrollment: { type: String, required: true, unique: true },
    department: { type: String },
    program: { type: String },
    batch: { type: String },
    semester: { type: String },
    role: { type: String, enum: ["student", "admin"], default: "student" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
