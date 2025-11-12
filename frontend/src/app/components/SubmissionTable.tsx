"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  FilePlus2,
  Trash2,
  Edit3,
  LogIn,
  FileWarning,
  FileText,
  AlertTriangle,
  UploadCloud,
} from "lucide-react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Skeleton from "@mui/material/Skeleton";

interface Submission {
  _id: string;
  studentId: string;
  name: string;
  enrollment: string;
  department: string;
  program: string;
  pdfUrl: string;
  remark?: string;
}

export default function SubmissionTable() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState<string>("");

  const [authWarning, setAuthWarning] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmEdit, setConfirmEdit] = useState(false);
  const [deleteId, setDeleteId] = useState<string>("");

  // NEW: submission modal + drag/drop state
  const [submissionModal, setSubmissionModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL;
  console.log("🔍 API URL:", API);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  console.log("🔍 Stored token:", token);

  const loggedInUserId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  console.log("🔍 Logged-in userId:", loggedInUserId);

  useEffect(() => {
    const fetchSubmissions = async () => {
      console.log("📡 Fetching submissions from:", `${API}/api/submissions`);

      try {
        const res = await fetch(`${API}/api/submissions`);
        console.log("✅ Raw response:", res);

        const data = await res.json();
        console.log("✅ Parsed JSON:", data);
        console.log("✅ Type of response:", typeof data);
        console.log("✅ Is Array?", Array.isArray(data));

        if (!Array.isArray(data)) {
          console.warn("⚠️ Backend returned NON-ARRAY. Setting empty list.");
          setSubmissions([]);
        } else {
          setSubmissions(data);
        }
      } catch (err) {
        console.log("❌ Error fetching submissions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [API]);

  const openPDF = async (submissionId: string) => {
    console.log("📡 Fetching signed URL for submission:", submissionId);

    if (!token) {
      console.log("❌ No token → showing login warning modal.");
      setAuthWarning(true);
      return;
    }

    try {
      const res = await fetch(`${API}/api/submissions/${submissionId}/url`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ Raw signed URL response:", res);

      const data = await res.json();
      console.log("✅ Signed URL JSON:", data);

      if (!data.url) {
        console.warn("⚠️ No URL returned from backend.");
        return;
      }

      setSelectedPdf(data.url);
      setOpenModal(true);
    } catch (err) {
      console.log("❌ Error fetching signed URL:", err);
    }
  };

  const confirmEditAction = (id: string) => {
    console.log("✏️ Confirm edit clicked for submission ID:", id);

    if (!token) {
      console.log("❌ No token → login modal.");
      setAuthWarning(true);
      return;
    }
    setConfirmEdit(true);
  };

  const confirmDeleteAction = (id: string) => {
    console.log("🗑 Confirm delete clicked for submission ID:", id);

    if (!token) {
      console.log("❌ No token → login modal.");
      setAuthWarning(true);
      return;
    }
    setDeleteId(id);
    setConfirmDelete(true);
  };

  const deleteSubmission = async () => {
    console.log("🗑 Executing delete request for ID:", deleteId);

    try {
      const res = await fetch(`${API}/api/submissions/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ Raw delete response:", res);

      setSubmissions((prev) => prev.filter((s) => s._id !== deleteId));
    } catch (err) {
      console.log("❌ Error deleting submission:", err);
    } finally {
      setConfirmDelete(false);
    }
  };

  // ====== NEW: Add Submission modal handlers (drag & drop + upload) ======

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    console.log("📥 Dropped file:", file);

    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      return;
    }
    setSelectedFile(file);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("📄 Selected via picker:", file);

    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      return;
    }
    setSelectedFile(file);
  };

  const uploadSubmission = async () => {
    console.log("📡 Uploading submission…");
    if (!token) {
      console.log("❌ No token → showing login warning modal.");
      setAuthWarning(true);
      return;
    }
    if (!selectedFile) {
      alert("Please select a PDF first.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", selectedFile);

    try {
      setUploading(true);
      const res = await fetch(`${API}/api/submissions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log("✅ Raw upload response:", res);
      const data = await res.json();
      console.log("✅ Upload parsed JSON:", data);

      if (!res.ok) {
        alert(data?.message || "Upload failed");
        return;
      }

      // Prepend new submission
      setSubmissions((prev) => [data, ...prev]);
      // reset and close
      setSelectedFile(null);
      setSubmissionModal(false);
    } catch (err) {
      console.log("❌ Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const [submissionStep, setSubmissionStep] = useState(1);

  const [formName, setFormName] = useState("");
  const [formEnrollment, setFormEnrollment] = useState("");
  const [formDepartment, setFormDepartment] = useState("");
  const [formProgram, setFormProgram] = useState("");

  useEffect(() => {
    setFormName(localStorage.getItem("userName") || "");
    setFormEnrollment(localStorage.getItem("userEnrollment") || "");
    setFormDepartment(localStorage.getItem("userDepartment") || "");
    setFormProgram(localStorage.getItem("userProgram") || "");
  }, []);

  return (
    <motion.div
      id="submission"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-50 mt-50 py-20 px-4 md:px-45"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-5 md:p-6 border-2 border-gray-50 bg-gradient-to-b from-white/10 to-black/10 rounded-3xl shadow-xl"
      >
        {!loading && submissions.length === 0 ? (
          <div className="text-center py-16 md:py-20 flex flex-col items-center gap-8">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              <FileWarning size={100} className="text-white/80 md:size-[120px]" />
            </motion.div>

            <p className="text-xl md:text-2xl font-semibold text-white/90">
              Be the first one to submit!
            </p>

            <Button
              variant="contained"
              startIcon={<FilePlus2 />}
              size="large"
              onClick={() =>
                !token ? setAuthWarning(true) : setSubmissionModal(true)
              }
            >
              Add Submission
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-4">
              <Button
                variant="contained"
                startIcon={<FilePlus2 />}
                onClick={() =>
                  !token ? setAuthWarning(true) : setSubmissionModal(true)
                }
              >
                Add Submission
              </Button>
            </div>

            {/* Responsive wrapper for small screens */}
            <div className="overflow-x-auto rounded-xl">
              <TableContainer component={Paper} className="backdrop-blur-md rounded-xl min-w-[700px] md:min-w-0">
                <Table sx={{ minWidth: 700 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Enrollment</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Program</TableCell>
                      <TableCell>Submission</TableCell>
                      <TableCell>Remark</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>


                  <TableBody>
                    {loading ? (
                      <>
                        {[1, 2, 3].map((row) => (
                          <TableRow key={row}>
                            <TableCell><Skeleton width={150} /></TableCell>
                            <TableCell><Skeleton width={120} /></TableCell>
                            <TableCell><Skeleton width={100} /></TableCell>
                            <TableCell><Skeleton width={100} /></TableCell>
                            <TableCell><Skeleton width={80} /></TableCell>
                            <TableCell><Skeleton width={80} /></TableCell>
                            <TableCell align="right"><Skeleton width={120} /></TableCell>
                          </TableRow>
                        ))}
                      </>
                    ) : (
                      <AnimatePresence>
                        {submissions.map((row) => (
                          <motion.tr
                            key={row._id}
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.25 }}
                          >
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.enrollment}</TableCell>
                            <TableCell>{row.department}</TableCell>
                            <TableCell>{row.program}</TableCell>

                            <TableCell>
                              <Button
                                variant="outlined"
                                startIcon={<Eye size={18} />}
                                onClick={() => openPDF(row._id)}
                              >
                                View
                              </Button>
                            </TableCell>

                            <TableCell>
                              {row.remark ? (
                                <span className="text-green-400 font-medium">{row.remark}</span>
                              ) : (
                                <span className="text-gray-400 italic">No remark</span>
                              )}
                            </TableCell>

                            <TableCell align="right">
                              {localStorage.getItem("userRole") === "admin" ? (
                                // ✅ ADMIN ACTIONS
                                <div className="flex gap-3 justify-end">
                                  <Button
                                    variant="contained"
                                    color="warning"
                                    startIcon={<Edit3 />}
                                    onClick={() => {
                                      setDeleteId(row._id); // reuse deleteId for remark updates
                                      setConfirmEdit(true); // open remark modal
                                    }}
                                  >
                                    Remark
                                  </Button>

                                  <Button
                                    variant="contained"
                                    color="error"
                                    startIcon={<Trash2 />}
                                    onClick={() => confirmDeleteAction(row._id)}
                                  >
                                    {/* Delete */}
                                  </Button>
                                </div>
                              ) : loggedInUserId === row.studentId ? (
                                // ✅ STUDENT ACTIONS
                                <div className="flex gap-3 justify-end">
                                  <Button
                                    variant="contained"
                                    color="error"
                                    startIcon={<Trash2 />}
                                    onClick={() => confirmDeleteAction(row._id)}
                                  >
                                    {/* Delete */}
                                  </Button>
                                </div>
                              ) : (
                                // ✅ VIEWER ACTION (for others)
                                <Button
                                  variant="contained"
                                  onClick={() => openPDF(row._id)} // fixed: open correct PDF
                                >
                                  Download
                                </Button>
                              )}

                            </TableCell>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </>
        )}

        {/* PDF MODAL */}
        <Dialog
          open={openModal}
          onClose={() => setOpenModal(false)}
          fullScreen
          PaperProps={{
            sx: {
              background: "rgba(10, 10, 10, 0.9)",
              backdropFilter: "blur(10px)",
              color: "white",
            },
          }}
        >
          <DialogTitle
            className="flex items-center justify-between gap-2 text-white px-6 py-4 border-b border-white/10"
          >
            <div className="flex items-center gap-2">
              <FileText size={22} /> Submission PDF
            </div>
            <Button
              onClick={() => setOpenModal(false)}
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-md"
            >
              ✕ Close
            </Button>
          </DialogTitle>

          <DialogContent
            sx={{
              height: "calc(100vh - 100px)",
              overflow: "hidden",
              padding: 0,
            }}
          >
            <iframe
              src={selectedPdf}
              width="100%"
              height="100%"
              className="rounded-none"
              style={{
                border: "none",
                display: "block",
              }}
            />
          </DialogContent>

          <div className="absolute bottom-5 right-6">
            <Button
              variant="contained"
              onClick={() => window.open(selectedPdf, "_blank")}
              className="bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              Download PDF
            </Button>
          </div>
        </Dialog>

        {/* AUTH WARNING */}
        <Dialog className="rounded-4xl" open={authWarning} onClose={() => setAuthWarning(false)} fullWidth>
          <DialogContent className="text-center ">
            <LogIn size={40} className="mx-auto mb-4 text-blue-600" />
            <p className="text-lg mb-4">You need to login first</p>
            <Button
              variant="contained"
              size="large"
              startIcon={<LogIn />}
              onClick={() => (window.location.href = "/login")}
            >
              Go to Login
            </Button>
          </DialogContent>
        </Dialog>

        {/* CONFIRM DELETE */}
        <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)} fullWidth>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle /> Confirm Delete
          </DialogTitle>
          <DialogContent className="text-center py-6">
            <p className="text-lg mb-6">Are you sure?</p>
            <div className="flex gap-4 justify-center">
              <Button variant="outlined" onClick={() => setConfirmDelete(false)}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<Trash2 />}
                onClick={deleteSubmission}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* CONFIRM EDIT */}
        <Dialog open={confirmEdit} onClose={() => setConfirmEdit(false)} fullWidth>
          <DialogTitle className="flex items-center gap-2 text-yellow-600">
            <Edit3 /> Confirm Edit
          </DialogTitle>
          <DialogContent className="text-center py-6">
            <p className="text-lg mb-6">Do you want to update?</p>
            <div className="flex gap-4 justify-center">
              <Button variant="outlined" onClick={() => setConfirmEdit(false)}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="warning"
                startIcon={<Edit3 />}
                onClick={() => {
                  setConfirmEdit(false);
                  window.location.href = "/submit";
                }}
              >
                Proceed
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* ✅ ADMIN REMARK EDITOR */}
        <Dialog
          open={confirmEdit}
          onClose={() => setConfirmEdit(false)}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              borderRadius: "16px",
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "white",
            },
          }}
        >
          <DialogTitle className="flex items-center gap-2 text-yellow-500">
            <Edit3 /> Add or Update Remark
          </DialogTitle>

          <DialogContent>
            <textarea
              id="remark"
              placeholder="Enter feedback or remark..."
              className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
              rows={3}
            />
            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="outlined"
                onClick={() => setConfirmEdit(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="warning"
                startIcon={<Edit3 />}
                onClick={async () => {
                  const remarkText = (
                    document.getElementById("remark") as HTMLTextAreaElement
                  ).value.trim();

                  if (!remarkText) return alert("Please enter a remark.");

                  try {
                    const res = await fetch(`${API}/api/submissions/remark/${deleteId}`, {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({ remark: remarkText }),
                    });

                    const updated = await res.json();
                    if (!res.ok) throw new Error(updated.message);

                    setSubmissions((prev) =>
                      prev.map((s) => (s._id === deleteId ? updated : s))
                    );
                    setConfirmEdit(false);
                  } catch (err) {
                    console.error("❌ Failed to update remark:", err);
                    alert("Failed to update remark.");
                  }
                }}
                className="rounded-xl"
              >
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>


        {/* NEW: ADD SUBMISSION MODAL */}
        {/* ✅ TWO-PHASE SUBMISSION MODAL */}
        <Dialog
          open={submissionModal}
          onClose={() => setSubmissionModal(false)}
          fullWidth
          maxWidth="md"
          PaperProps={{
            sx: {
              borderRadius: "20px",
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(18px)",
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow: "0 8px 35px rgba(0,0,0,0.4)",
              overflow: "hidden",
            }
          }}
        >
          {/* Animated title */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DialogTitle className="flex items-center gap-2 text-white/90 text-lg font-semibold">
              <UploadCloud size={26} /> Submit Assignment
            </DialogTitle>
          </motion.div>

          <DialogContent>
            {/* ✅ Step indicator */}
            <div className="flex justify-between mb-6">
              <div className={`flex-1 h-[4px] rounded-full ${submissionStep === 1 ? "bg-blue-500" : "bg-white/20"}`}></div>
              <div className={`flex-1 h-[4px] rounded-full ml-3 ${submissionStep === 2 ? "bg-blue-500" : "bg-white/20"}`}></div>
            </div>

            {/* ✅ Step 1: User details form */}
            {submissionStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                {/* Name */}
                <div>
                  <label className="text-white/80 text-sm">Name</label>
                  <input
                    type="text"
                    value={formName}
                    readOnly
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white/70 focus:outline-none mt-1 cursor-not-allowed"
                  />
                </div>

                {/* Enrollment */}
                <div>
                  <label className="text-white/80 text-sm">Enrollment</label>
                  <input
                    type="text"
                    value={formEnrollment}
                    readOnly
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white/70 focus:outline-none mt-1 cursor-not-allowed"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="text-white/80 text-sm">Department</label>
                  <input
                    type="text"
                    value={formDepartment}
                    readOnly
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white/70 focus:outline-none mt-1 cursor-not-allowed"
                  />
                </div>

                {/* Program */}
                <div>
                  <label className="text-white/80 text-sm">Program</label>
                  <input
                    type="text"
                    value={formProgram}
                    readOnly
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white/70 focus:outline-none mt-1 cursor-not-allowed"
                  />
                </div>

                {/* ✅ Step button */}
                <div className="flex justify-end mt-6">
                  <Button
                    variant="contained"
                    className="bg-blue-600 hover:bg-blue-700 rounded-xl"
                    onClick={() => {
                      if (!formName || !formEnrollment || !formDepartment || !formProgram) {
                        alert("User data missing. Please re-login.");
                        return;
                      }
                      setSubmissionStep(2);
                    }}
                  >
                    Next →
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ✅ Step 2: PDF Upload UI */}
            {submissionStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-10 md:p-14 text-center transition-all ${dragActive ? "border-blue-500 bg-blue-500/10" : "border-white/20 bg-white/5"
                    }`}
                >
                  <UploadCloud size={64} className="mx-auto text-white/70" />
                  <p className="text-white mt-4 text-sm md:text-base">
                    Drag & drop your PDF here
                  </p>
                  <p className="text-gray-400 text-xs md:text-sm">or</p>

                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    id="filePicker"
                    onChange={handleFileSelect}
                  />
                  <label
                    htmlFor="filePicker"
                    className="cursor-pointer text-blue-400 underline mt-1"
                  >
                    Browse Files
                  </label>

                  {selectedFile && (
                    <p className="text-green-400 mt-4 text-xs md:text-sm animate-fadeIn">
                      ✅ Selected: {selectedFile.name}
                    </p>
                  )}
                </div>

                <div className="flex justify-between mt-6">
                  <Button
                    variant="outlined"
                    className="rounded-xl"
                    onClick={() => setSubmissionStep(1)}
                  >
                    ← Back
                  </Button>

                  <Button
                    variant="contained"
                    className="bg-green-600 hover:bg-green-700 rounded-xl"
                    disabled={!selectedFile || uploading}
                    onClick={uploadSubmission}
                  >
                    {uploading ? "Uploading…" : "Submit"}
                  </Button>
                </div>
              </motion.div>
            )}
          </DialogContent>
        </Dialog>

      </motion.div>
    </motion.div>
  );
}
