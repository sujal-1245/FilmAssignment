const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  name: { type: String, required: true },
  enrollment: { type: String, required: true },
  department: { type: String },
  program: { type: String },

  pdfKey: { type: String, required: true },
  pdfUrl: { type: String, required: true },

  remark: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Submission", submissionSchema);
