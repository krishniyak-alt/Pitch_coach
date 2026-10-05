"use client";

import { useRef } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import MagneticButton from "@/components/ui/MagneticButton";
import Badge from "@/components/ui/Badge";
import { Sparkles, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export default function FinalCTA() {
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.8 },
        colors: ["#7C5CFF", "#FF4D9D", "#FFB547", "#3DDC97"],
      });
    } catch {
      // Fallback
    }
  };

  return (
    <section className="relative py-32 sm:py-40 px-4 sm:px-6 md:px-8 bg-[#07070B] overflow-hidden border-t border-white/[0.06]">
      {/* Huge Gradient Mesh Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] sm:w-[1100px] h-[600px] bg-gradient-to-r from-[#7C5CFF]/25 via-[#FF4D9D]/20 to-[#FFB547]/20 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        <Badge variant="magenta" className="mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#FF4D9D]" />
          <span>Stage Ready in 15 Minutes</span>
        </Badge>

        <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white font-heading leading-[1.1]">
          Your next pitch <span className="text-gradient">starts here.</span>
        </h2>

        <p className="mt-6 text-base sm:text-lg md:text-xl text-[#9A9AB0] max-w-xl mx-auto leading-relaxed">
          Don't let 36 hours of engineering die on an overtime gong. Join 2,000+ hackers rehearsing with ruthless AI judges today.
        </p>

        {/* Magnetic CTA with Confetti Burst */}
        <div
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
          onMouseEnter={triggerConfetti}
        >
          <Link href="/practice">
            <MagneticButton
              variant="primary"
              size="lg"
              onClick={triggerConfetti}
              className="px-10 py-5 text-base sm:text-lg font-bold shadow-[0_0_40px_rgba(124,92,255,0.6)]"
            >
              <span>Start Free Rehearsal Now</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </MagneticButton>
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[#9A9AB0] font-mono-accent">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#3DDC97]" /> Private & Encrypted
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-[#FFB547]" /> Instant WebRTC Audio
          </span>
          <span>•</span>
          <span>No credit card required</span>
        </div>
      </div>
    </section>
  );
}
