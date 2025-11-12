"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

// Remove all drag-related props so Framer Motion doesn't conflict with HTML drag types
type SafeDivProps = Omit<
  React.ComponentProps<"div">,
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onDragEnter"
  | "onDragLeave"
  | "onDragOver"
  | "draggable"
>;

export default function RegisterForm({
  className,
  ...props
}: SafeDivProps) {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form fields
  const [name, setName] = useState("");
  const [enrollment, setEnrollment] = useState("");
  const [department, setDepartment] = useState("");
  const [program, setProgram] = useState("");
  const [batch, setBatch] = useState("");
  const [semester, setSemester] = useState("");

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    console.log("📡 [REGISTER] Starting registration...");
    console.log("📨 [REGISTER] Payload:", {
      name,
      enrollment,
      department,
      program,
      batch,
      semester,
    });

    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          enrollment,
          department,
          program,
          batch,
          semester,
        }),
      });

      const data = await res.json();
      console.log("✅ [REGISTER] Parsed response:", data);

      if (!res.ok) {
        console.log("❌ [REGISTER] Server error:", data);
        setErrorMsg(data.message || "Registration failed");
        return;
      }

      console.log("✅ [REGISTER SUCCESS] User created:", data);

      // Store user data locally
      localStorage.setItem("userId", data._id);
      localStorage.setItem("userName", data.name);
      localStorage.setItem("userEnrollment", data.enrollment);
      localStorage.setItem("userDepartment", data.department || "");
      localStorage.setItem("userProgram", data.program || "");
      localStorage.setItem("userBatch", data.batch || "");
      localStorage.setItem("userSemester", data.semester || "");
      localStorage.setItem("userRole", data.role || "student");
      localStorage.setItem("userCreatedAt", data.createdAt || "");
      localStorage.setItem("userUpdatedAt", data.updatedAt || "");
      console.log("✅ [LOCALSTORAGE] Registration data saved!");

      router.push("/login");
    } catch (err) {
      console.log("❌ [REGISTER ERROR]", err);
      setErrorMsg("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Slide-fade animation for step transitions
  const stepVariants = {
    hidden: { opacity: 0, x: 40, scale: 0.98 },
    visible: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -40, scale: 0.98 },
  };

  // Validation logic for Next button
  const isStepValid =
    (step === 1 && name.trim() && enrollment.trim()) ||
    (step === 2 && department.trim() && program.trim()) ||
    (step === 3 && batch.trim() && semester.trim());

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.35 }}
      >
        <Card className="border-white/20 bg-white/5 backdrop-blur-xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-white text-lg font-semibold flex justify-between items-center">
              Create a new account
              <span className="text-sm text-gray-400">
                Step {step} of 3
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleRegister}>
              <FieldGroup>
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      variants={stepVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.45, ease: "easeInOut" }}
                    >
                      <Field>
                        <FieldLabel className="text-gray-200">Name</FieldLabel>
                        <Input
                          className="text-gray-300"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          placeholder="Enter your name"
                        />
                      </Field>

                      <Field>
                        <FieldLabel className="text-gray-200 mt-10">
                          Enrollment Number
                        </FieldLabel>
                        <Input
                          className="text-gray-300"
                          value={enrollment}
                          onChange={(e) => setEnrollment(e.target.value)}
                          required
                          placeholder="e.g. A7040XYZ"
                        />
                      </Field>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      variants={stepVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.45, ease: "easeInOut" }}
                    >
                      <Field>
                        <FieldLabel className="text-gray-200">
                          Department
                        </FieldLabel>
                        <Input
                          className="text-gray-300"
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          required
                          placeholder="e.g. ASET, AIT, AIBAS"
                        />
                      </Field>

                      <Field>
                        <FieldLabel className="text-gray-200 mt-10">
                          Program
                        </FieldLabel>
                        <Input
                          className="text-gray-300"
                          value={program}
                          onChange={(e) => setProgram(e.target.value)}
                          required
                          placeholder="e.g. BCA, BTech"
                        />
                      </Field>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      variants={stepVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.45, ease: "easeInOut" }}
                    >
                      <Field>
                        <FieldLabel className="text-gray-200">Batch</FieldLabel>
                        <Input
                          className="text-gray-300"
                          value={batch}
                          onChange={(e) => setBatch(e.target.value)}
                          required
                          placeholder="e.g. 2022–2025"
                        />
                      </Field>

                      <Field>
                        <FieldLabel className="text-gray-200 mt-10">Semester</FieldLabel>
                        <Input
                          type="number"
                          min={1}
                          max={10}
                          step={1}
                          className="text-gray-300"
                          value={semester}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "" || (Number(value) >= 1 && Number(value) <= 10)) {
                              setSemester(value);
                            }
                          }}
                          required
                          placeholder="Enter semester (1–10)"
                        />
                      </Field>
                    </motion.div>
                  )}
                </AnimatePresence>

                {errorMsg && (
                  <motion.div
                    key={errorMsg}
                    animate={{ x: [-10, 10, -10, 10, 0] }}
                    className="text-red-500 font-medium text-sm mt-2"
                  >
                    {errorMsg}
                  </motion.div>
                )}

                {/* Button group */}
                <div className="flex justify-between mt-6">
                  {step > 1 && (
                    <Button
                      type="button"
                      onClick={handleBack}
                      className="bg-gray-600 hover:bg-gray-700 text-white"
                    >
                      Back
                    </Button>
                  )}

                  {step < 3 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={!isStepValid}
                      className={cn(
                        "ml-auto text-white transition-all",
                        isStepValid
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-blue-900 opacity-50 cursor-not-allowed"
                      )}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={loading || !isStepValid}
                      className={cn(
                        "ml-auto text-white",
                        loading
                          ? "bg-green-800 cursor-wait"
                          : "bg-green-600 hover:bg-green-700"
                      )}
                    >
                      {loading ? "Registering..." : "Register"}
                    </Button>
                  )}
                </div>

                <FieldDescription className="text-center text-gray-300 mt-4">
                  Already have an account?{" "}
                  <a href="/login" className="underline hover:text-white">
                    Login
                  </a>
                </FieldDescription>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
