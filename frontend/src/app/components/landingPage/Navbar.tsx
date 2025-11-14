"use client";

import { Button } from "@/components/ui/button";
import { ExpandedTabs } from "@/components/ui/expanded-tabs";
import {
  Bell,
  Clapperboard,
  Home,
  LogIn,
  LogOut,
  User,
  Film,
  FileText,
  Menu,
  X,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Dialog from "@mui/material/Dialog";
import Link from "next/link";

const Navbar = () => {
  const router = useRouter();

  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Tabs (nav items)
  const tabs = [
    { title: "Home", icon: Home, id: "hero" },
    { title: "Submissions", icon: FileText, id: "submission" },
    { title: "Film Club", icon: Film, id: "club" },
    { type: "separator" as const },
    { title: "Notifications", icon: Bell, id: "notifications" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("userName");

    if (token) {
      setLoggedIn(true);
      setUserName(storedName || "User");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    setLoggedIn(false);
    setMenuOpen(false);
    setMobileMenuOpen(false);
    router.push("/");
  };

  const handleScroll = (id: string) => {
    if (id === "notifications") {
      setNotificationOpen(true);
      return;
    }
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-md border-b border-white/10"
    >
      <div className="flex justify-between items-center py-4 px-5 md:px-10">
        {/* Logo */}
        <Link href="/" className="inline-block">
  <motion.div
    className="flex gap-2 items-center cursor-pointer"
    initial={{ opacity: 0, x: -30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
  >
    <motion.div
      className="bg-white rounded-full p-1"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
    >
      <Clapperboard size={24} color="black" />
    </motion.div>

    <motion.h1
      className="text-white font-bold tracking-wide text-lg"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.35 }}
    >
      FILMWALA
    </motion.h1>
  </motion.div>
</Link>
        {/* Desktop Tabs */}
        <div className="hidden md:block">
          <ExpandedTabs
            tabs={tabs}
            className="bg-black/20 text-white/70"
            onTabClick={(tab) => handleScroll(tab.id)}
          />
        </div>

        {/* Right Auth Section */}
        <div className="flex items-center gap-3">
          {/* Mobile menu icon */}
          <motion.div
            className="md:hidden text-white cursor-pointer"
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </motion.div>

          {/* Desktop login / profile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
            className="hidden md:block relative"
          >
            {!loggedIn ? (
              <Button
                className="bg-white cursor-pointer rounded-full text-black font-semibold px-5 py-4 shadow-md hover:scale-105 transition-transform flex items-center gap-2"
                onClick={() => router.push("/login")}
              >
                <LogIn className="mt-1" size={18} />
                Login
              </Button>
            ) : (
              <motion.div
                className="flex items-center gap-3 cursor-pointer bg-white/20 text-white rounded-full px-4 py-2 hover:bg-white/30 transition"
                onClick={() => setMenuOpen((prev) => !prev)}
                whileTap={{ scale: 0.95 }}
              >
                <div className="bg-white/30 backdrop-blur-sm w-9 h-9 rounded-full flex items-center justify-center">
                  <User size={20} color="white" />
                </div>
                <span className="font-medium">{userName}</span>
              </motion.div>
            )}

            {/* Dropdown Menu */}
            <AnimatePresence>
              {menuOpen && loggedIn && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 bg-black/80 backdrop-blur-lg border border-white/20 shadow-xl rounded-md w-40 p-2 z-50"
                >
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2 text-red-500 hover:bg-red-600/20 rounded-md transition"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-black/60 backdrop-blur-lg border-t border-white/10 px-5 py-4 space-y-4"
          >
            {tabs.map(
              (tab, idx) =>
                tab.title && (
                  <button
                    key={idx}
                    onClick={() => handleScroll(tab.id)}
                    className="flex items-center gap-3 text-white/80 hover:text-white transition w-full text-left"
                  >
                    <tab.icon size={20} />
                    {tab.title}
                  </button>
                )
            )}

            <div className="border-t border-white/10 pt-3">
              {!loggedIn ? (
                <Button
                  className="w-full bg-white text-black font-semibold rounded-full py-3"
                  onClick={() => router.push("/login")}
                >
                  <LogIn size={18} className="mr-2" /> Login
                </Button>
              ) : (
                <Button
                  className="w-full bg-red-500 hover:bg-red-600 text-white rounded-full py-3"
                  onClick={handleLogout}
                >
                  <LogOut size={18} className="mr-2" /> Logout
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Modal */}
      <Dialog
        open={notificationOpen}
        onClose={() => setNotificationOpen(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: "20px",
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.15)",
            boxShadow: "0 8px 35px rgba(0,0,0,0.5)",
            overflow: "hidden",
          },
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex flex-col items-center justify-center text-center py-8 px-6"
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="bg-blue-500/20 p-4 rounded-full border border-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          >
            <Bell size={40} className="text-blue-400" />
          </motion.div>

          <h3 className="text-white text-xl font-semibold mt-5 mb-2">
            No New Notifications
          </h3>
          <p className="text-white/70 text-sm max-w-xs">
            You’re all caught up! Check back later for new updates or
            announcements.
          </p>

          <Button
            onClick={() => setNotificationOpen(false)}
            className="mt-6 px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md transition-all"
          >
            Got it
          </Button>
        </motion.div>
      </Dialog>
    </motion.div>
  );
};

export default Navbar;
