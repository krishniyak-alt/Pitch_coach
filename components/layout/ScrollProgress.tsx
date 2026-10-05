"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 40,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2.5px] origin-left z-[1000] bg-gradient-to-r from-[#7C5CFF] via-[#FF4D9D] to-[#FFB547] shadow-[0_0_12px_rgba(255,77,157,0.7)]"
      style={{ scaleX }}
    />
  );
}
