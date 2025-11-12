"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Skeleton from "@mui/material/Skeleton";
import {
    MinimalCard,
    MinimalCardTitle,
    MinimalCardContent,
} from "@/components/ui/minimal-card";
import ShareButton from "@/components/ui/share-button";
import { Twitter, Instagram, Facebook, Youtube, Share2 } from "lucide-react";

const links = [
    {
      icon: Twitter,
      onClick: () =>
        window.open("https://x.com/AmityUniMumbai", "_blank"),
      label: "Twitter (X)",
    },
    {
      icon: Instagram,
      onClick: () =>
        window.open("https://www.instagram.com/amity.film/", "_blank"),
      label: "Instagram",
    },
    {
      icon: Facebook,
      onClick: () =>
        window.open("https://www.facebook.com/AmityUniversityMumbai/", "_blank"),
      label: "Facebook",
    },
    {
      icon: Youtube,
      onClick: () =>
        window.open("https://www.youtube.com/@AmityUniversityMumbai", "_blank"),
      label: "YouTube",
    },
  ];

export default function ExploreFilmClub() {
    const videos = [
        { src: "/vid1.mp4", title: "Behind The Lens" },
        { src: "/vid2.mp4", title: "Shortfilms" },
        { src: "/vid3.mp4", title: "Campus Events", rotate: true },
    ];

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section id="club" className="relative w-full py-24 px-6 md:px-12 lg:px-24 flex flex-col items-center justify-center text-center overflow-hidden">
            {/* Background gradient + blur */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08)_0%,rgba(0,0,0,0.9)_100%)] backdrop-blur-[3px]" />

            {/* Title */}
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="text-3xl md:text-5xl font-bold text-white mb-12 z-10"
            >
                Explore <span className="text-blue-400">Ami-Film Club</span>
            </motion.h2>

            {/* Cards Grid */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
                <AnimatePresence mode="wait">
                    {loading ? (
                        // ✅ Skeleton placeholders
                        videos.map((_, i) => (
                            <motion.div
                                key={`skeleton-${i}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <MinimalCard className="overflow-hidden rounded-[24px] bg-white/5 backdrop-blur-lg border border-white/10 shadow-lg p-4">
                                    <Skeleton
                                        variant="rectangular"
                                        animation="wave"
                                        width="100%"
                                        height={190}
                                        className="rounded-[16px]"
                                    />
                                    <div className="mt-4">
                                        <Skeleton
                                            variant="text"
                                            width="70%"
                                            height={20}
                                            className="bg-white/10"
                                        />
                                    </div>
                                </MinimalCard>
                            </motion.div>
                        ))
                    ) : (
                        // ✅ Real video cards
                        videos.map((video, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                                <MinimalCard className="group relative overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 rounded-[24px] shadow-2xl transition-all duration-500 hover:bg-white/20">
                                    <div className="relative mb-6 h-[190px] w-full rounded-[20px] overflow-hidden flex items-center justify-center">
                                        <motion.video
                                            src={video.src}
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                            className={`absolute inset-0 w-full h-full object-cover rounded-[20px] brightness-[0.85] group-hover:brightness-100 transition-all duration-700 ease-out ${video.rotate ? "rotate-[-90deg] scale-[1.35]" : ""
                                                }`}
                                        />
                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500 rounded-[20px]" />
                                    </div>

                                    <MinimalCardContent className="text-left">
                                        <MinimalCardTitle className="text-white text-lg font-semibold drop-shadow-md">
                                            {video.title}
                                        </MinimalCardTitle>
                                    </MinimalCardContent>
                                </MinimalCard>


                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
            <ShareButton className=" mt-15" links={links}>
                <Share2 className="size-4" />
                Connect
            </ShareButton>
        </section>
    );
}
