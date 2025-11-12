"use client";

import { motion } from "framer-motion";
import { LoginForm } from "@/components/login-form";
import Navbar from "../components/landingPage/Navbar";

export default function Page() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* ✅ Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://c4.wallpaperflare.com/wallpaper/862/449/162/jack-reacher-star-wars-interstellar-movie-john-wick-wallpaper-preview.jpg')",
        }}
      />

      {/* ✅ Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />

      {/* ✅ Navbar */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/40 border-b border-white/10"
      >
        <Navbar />
      </motion.div>

      {/* ✅ Login section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex min-h-screen items-center justify-center p-6 md:p-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="w-full max-w-sm my-10 bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 p-6 md:p-8"
        >
          <LoginForm />
        </motion.div>
      </motion.div>
    </div>
  );
}
