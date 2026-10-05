"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/data/content";

export default function PageLoader() {
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Only show on fresh page load, can remember if visited within session
    const hasLoaded = sessionStorage.getItem("pitchcoach_intro_loaded");
    if (hasLoaded) {
      setLoading(false);
      return;
    }

    const duration = 1600; // 1.6s
    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * 100));

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setTimeout(() => {
          setLoading(false);
          sessionStorage.setItem("pitchcoach_intro_loaded", "true");
        }, 200);
      }
    };

    const animFrame = requestAnimationFrame(updateCounter);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{
            y: "-100%",
            transition: {
              duration: 0.85,
              ease: [0.76, 0, 0.24, 1], // cinematic curtain wipe
            },
          }}
          className="fixed inset-0 z-[99998] flex flex-col items-center justify-center bg-[#07070B] select-none pointer-events-auto"
        >
          {/* Subtle background glow */}
          <div className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-[#7C5CFF]/20 via-[#FF4D9D]/20 to-transparent blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-6">
            {/* Animated Logo Mark */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7C5CFF] via-[#FF4D9D] to-[#FFB547] p-[1.5px] shadow-[0_0_30px_rgba(124,92,255,0.5)]"
              >
                <div className="w-full h-full bg-[#0E0E16] rounded-2xl flex items-center justify-center">
                  <svg
                    className="w-7 h-7 text-[#F5F5FA]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <motion.path
                      d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.2, ease: "easeInOut" }}
                    />
                    <motion.path
                      d="M19 10v2a7 7 0 0 1-14 0v-2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.2, delay: 0.2, ease: "easeInOut" }}
                    />
                    <line x1="12" y1="19" x2="12" y2="22" />
                  </svg>
                </div>
              </motion.div>
            </div>

            {/* Brand title */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-center"
            >
              <h2 className="text-xl font-bold tracking-tight text-white font-heading">
                {siteConfig.name}
              </h2>
              <p className="text-xs text-[#9A9AB0] mt-1 font-mono-accent">
                INITIALIZING AI JUDGING ENGINE...
              </p>
            </motion.div>

            {/* Counter */}
            <div className="flex items-baseline gap-1 mt-4">
              <span className="text-4xl font-bold font-mono-accent text-white tracking-tighter">
                {count.toString().padStart(2, "0")}
              </span>
              <span className="text-sm font-mono-accent text-[#FF4D9D]">%</span>
            </div>

            {/* Loading progress bar */}
            <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden mt-2">
              <motion.div
                className="h-full bg-gradient-to-r from-[#7C5CFF] via-[#FF4D9D] to-[#FFB547]"
                style={{ width: `${count}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
