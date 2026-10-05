"use client";

import React, { useRef, useState } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  enableTilt?: boolean;
}

export default function GlowCard({
  children,
  className,
  glowColor = "rgba(124, 92, 255, 0.15)",
  enableTilt = true,
  ...props
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });
  const [isHovered, setIsHovered] = useState(false);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y });

    if (enableTilt) {
      // 3D tilt: max 6 degrees
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      setRotate({ x: rotateX, y: rotateY });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
    setMousePos({ x: -200, y: -200 });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: rotate.x,
        rotateY: rotate.y,
        scale: isHovered ? 1.015 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 24,
        mass: 0.6,
      }}
      style={{
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "relative rounded-3xl bg-[#0E0E16]/80 backdrop-blur-xl border border-white/[0.08] p-6 overflow-hidden transition-shadow duration-300",
        isHovered ? "shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] border-white/[0.16]" : "",
        className
      )}
      {...props}
    >
      {/* Spotlight Radial Light */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}, transparent 80%)`,
        }}
      />

      {/* Subtle top reflection rim */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      {/* Card Content with 3D Depth */}
      <div className="relative z-20" style={{ transform: "translateZ(12px)" }}>
        {children}
      </div>
    </motion.div>
  );
}
