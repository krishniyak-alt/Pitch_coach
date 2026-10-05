"use client";

import React, { useRef, useState } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

export default function MagneticButton({
  children,
  className,
  strength = 0.35,
  variant = "primary",
  size = "md",
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * strength, y: middleY * strength });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const variantStyles = {
    primary:
      "relative bg-gradient-to-r from-[#7C5CFF] via-[#FF4D9D] to-[#FFB547] text-white font-semibold shadow-[0_0_25px_rgba(124,92,255,0.45)] hover:shadow-[0_0_35px_rgba(255,77,157,0.65)] hover:brightness-110 border border-white/20",
    secondary:
      "bg-white/[0.06] hover:bg-white/[0.12] text-[#F5F5FA] border border-white/10 hover:border-white/25 backdrop-blur-md",
    ghost:
      "bg-transparent hover:bg-white/[0.06] text-[#9A9AB0] hover:text-white border border-transparent",
    danger:
      "bg-[#FF5C6C]/20 hover:bg-[#FF5C6C]/30 text-[#FF5C6C] border border-[#FF5C6C]/30 hover:border-[#FF5C6C]/60",
  };

  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs rounded-xl",
    md: "px-5 py-2.5 text-sm rounded-2xl",
    lg: "px-7 py-3.5 text-base rounded-2xl font-medium",
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 350, damping: 20, mass: 0.5 }}
      whileTap={{ scale: 0.96 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 transition-colors cursor-pointer select-none group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5CFF]",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
