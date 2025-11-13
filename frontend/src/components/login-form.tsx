"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const [name, setName] = useState("");
  const [enrollment, setEnrollment] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    console.log("📡 [LOGIN] Starting login request...");
    console.log("📨 [LOGIN] Sending payload:", { name, enrollment });

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, enrollment }),
      });

      console.log("✅ [LOGIN] Raw response object:", res);
      const data = await res.json();
      console.log("✅ [LOGIN] Parsed JSON response:", data);

      console.log("🔍 [CHECK] Response OK?", res.ok);

      if (!res.ok) {
        console.log("❌ [LOGIN] Server rejected request:", data);
        setErrorMsg(data.message || "Login failed");
        return;
      }

      console.log("✅ [LOGIN] Server approved request!");
      console.log("📦 [LOGIN] Received full user data:", data.user);

      // Store everything backend sent
      console.log("💾 [LOCALSTORAGE] Saving all user data...");

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user._id);
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("userEnrollment", data.user.enrollment);
      localStorage.setItem("userDepartment", data.user.department || "");
      localStorage.setItem("userProgram", data.user.program || "");
      localStorage.setItem("userRole", data.user.role || "student");
      localStorage.setItem("userCreatedAt", data.user.createdAt || "");
      localStorage.setItem("userUpdatedAt", data.user.updatedAt || "");

      console.log("✅ [LOCALSTORAGE] All fields stored successfully!");

      router.push("/");

    } catch (err) {
      console.log("❌ [LOGIN ERROR] Something went wrong:", err);
      setErrorMsg("Something went wrong");
    } finally {
      console.log("🔄 [LOGIN] Ending login process...");
      setLoading(false);
    }
  };

  return (
    <motion.div
  initial={{ opacity: 0, y: 25 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: "easeOut" }}
  className={cn("flex flex-col gap-6", className)}
>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.35 }}
      >
        <Card className="border-white/20 bg-white/5 backdrop-blur-xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-white text-xl">
              Login to your account
            </CardTitle>
            <CardDescription className="text-gray-300">
              Enter your correct details to continue
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin}>
              <FieldGroup>
                <Field>
                  <FieldLabel className="text-gray-200" htmlFor="name">
                    Name
                  </FieldLabel>
                  <Input
                    className="text-gray-300"
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Field>

                <Field>
                  <FieldLabel className="text-gray-200" htmlFor="enrollment">
                    Enrollment Number
                  </FieldLabel>
                  <Input
                    className="text-gray-300"
                    id="enrollment"
                    type="text"
                    placeholder="e.g. A70405222xyz"
                    required
                    value={enrollment}
                    onChange={(e) => setEnrollment(e.target.value)}
                  />
                </Field>

                {errorMsg && (
                  <motion.div
                    key={errorMsg}
                    initial={{ x: 0 }}
                    animate={{
                      x: [-10, 10, -10, 10, -5, 5, 0],
                    }}
                    transition={{ duration: 0.4 }}
                    className="text-red-500 text-sm font-medium"
                  >
                    {errorMsg}
                  </motion.div>
                )}

                <Field className="mt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="text-white bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </Field>

                <FieldDescription className="text-center text-gray-300 mt-2">
                  Don't have an account?{" "}
                  <a href="/register" className="underline hover:text-white">
                    Register
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
