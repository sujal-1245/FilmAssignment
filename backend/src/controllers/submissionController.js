const fs = require("fs");
const supabase = require("../config/supabase");
const Submission = require("../models/Submission");
const generateSignedUrl = require("../utils/generateSignedUrl");

// UPLOAD SUBMISSION
exports.uploadSubmission = async (req, res) => {
  try {
    const file = req.file;
    const student = req.user;

    if (!file) return res.status(400).json({ message: "No PDF uploaded" });

    const pdfKey = `submissions/${student._id}/${Date.now()}-${file.originalname}`;

    const upload = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .upload(pdfKey, fs.readFileSync(file.path), {
        contentType: "application/pdf"
      });

    if (upload.error) {
      console.log(upload.error);
      return res.status(500).json(upload.error);
    }

    // Get public URL or signed URL
    const { data: urlData } = supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .getPublicUrl(pdfKey);

    const doc = await Submission.create({
      studentId: student._id,
      name: student.name,
      enrollment: student.enrollment,
      department: student.department,
      program: student.program,
      pdfKey,
      pdfUrl: urlData.publicUrl
    });

    // Remove temp file
    fs.unlinkSync(file.path);

    res.json(doc);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// GET ALL SUBMISSIONS
exports.getAllSubmissions = async (req, res) => {
  try {
    const subs = await Submission.find().sort({ createdAt: -1 });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET SIGNED URL FOR VIEWING (secure)
exports.getSignedPdfUrl = async (req, res) => {
  try {
    const sub = await Submission.findById(req.params.id);
    if (!sub) return res.status(404).json({ message: "Submission not found" });

    const signed = await generateSignedUrl(sub.pdfKey, 120); // 2 minutes

    res.json({ url: signed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE SUBMISSION
exports.deleteSubmission = async (req, res) => {
  try {
    const sub = await Submission.findById(req.params.id);
    if (!sub) return res.status(404).json({ message: "Not found" });

    await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .remove([sub.pdfKey]);

    await sub.deleteOne();

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADD REMARK (Admin only)
exports.addRemark = async (req, res) => {
  try {
    const sub = await Submission.findById(req.params.id);
    if (!sub) return res.status(404).json({ message: "Not found" });

    sub.remark = req.body.remark || "";
    await sub.save();

    res.json(sub);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
