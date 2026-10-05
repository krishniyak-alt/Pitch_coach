"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Counter from "./Counter";
import { cn } from "@/lib/utils";

interface ScoreRingProps {
  score: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  className?: string;
  label?: string;
  sublabel?: string;
}

export default function ScoreRing({
  score,
  size = 180,
  strokeWidth = 12,
  className = "",
  label = "Overall Score",
  sublabel = "Top 5% Hackathon Ready",
}: ScoreRingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div
      ref={ref}
      className={cn("relative flex flex-col items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="rotate-[-90deg]">
        <defs>
          <linearGradient id="scoreRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C5CFF" />
            <stop offset="50%" stopColor="#FF4D9D" />
            <stop offset="100%" stopColor="#FFB547" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
        />

        {/* Animated fill circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="url(#scoreRingGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: isInView ? strokeDashoffset : circumference }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          filter="url(#glow)"
        />
      </svg>

      {/* Center text content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
        <div className="flex items-baseline gap-0.5">
          <Counter
            value={score}
            duration={2}
            className="text-4xl font-extrabold font-heading text-white tracking-tighter"
          />
          <span className="text-xs font-mono-accent text-[#9A9AB0]">/100</span>
        </div>
        {label && (
          <span className="text-[10px] uppercase font-mono-accent tracking-wider text-[#9A9AB0] mt-0.5">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
