import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "violet" | "magenta" | "amber" | "green" | "glass";
  className?: string;
}

export default function Badge({
  children,
  variant = "glass",
  className = "",
  ...props
}: BadgeProps) {
  const variantStyles = {
    glass: "bg-white/[0.05] border-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.03)]",
    violet: "bg-[#7C5CFF]/15 border-[#7C5CFF]/35 text-[#C8B8FF] shadow-[0_0_15px_rgba(124,92,255,0.2)]",
    magenta: "bg-[#FF4D9D]/15 border-[#FF4D9D]/35 text-[#FFA6D2] shadow-[0_0_15px_rgba(255,77,157,0.2)]",
    amber: "bg-[#FFB547]/15 border-[#FFB547]/35 text-[#FFD899] shadow-[0_0_15px_rgba(255,181,71,0.2)]",
    green: "bg-[#3DDC97]/15 border-[#3DDC97]/35 text-[#7EF4C0] shadow-[0_0_15px_rgba(61,220,151,0.2)]",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider font-mono-accent border backdrop-blur-md",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
