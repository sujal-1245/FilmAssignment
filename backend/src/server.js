require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const submissionRoutes = require("./routes/submissionRoutes");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// Basic root route — optional but useful
app.get("/", (req, res) => {
  res.send("✅ Backend is running. Use /api/auth or /api/submissions");
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/submissions", submissionRoutes);

module.exports = app;

// Start server
app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running at port ${process.env.PORT}`)
);
