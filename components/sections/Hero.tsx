"use client";

import { useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteConfig } from "@/data/content";
import MagneticButton from "@/components/ui/MagneticButton";
import Badge from "@/components/ui/Badge";
import { ArrowRight, Play, Sparkles, CheckCircle2, ChevronDown, Clock, ShieldAlert } from "lucide-react";

// Lazy load 3D Canvas
const Hero3DOrb = dynamic(() => import("@/components/hero/Hero3DOrb"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
      <div className="w-[380px] h-[380px] rounded-full bg-gradient-to-tr from-[#7C5CFF] via-[#FF4D9D] to-[#FFB547] opacity-35 blur-[90px] animate-pulse-ring" />
    </div>
  ),
});

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineWords = siteConfig.hero.headlineStart.split(" ");
  const gradientWords = siteConfig.hero.headlineGradient.split(" ");

  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 800], [0, 140]);
  const yCards = useTransform(scrollY, [0, 800], [0, -100]);
  const opacityHero = useTransform(scrollY, [0, 500], [1, 0.4]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100vh] flex flex-col justify-between pt-32 sm:pt-36 md:pt-44 pb-16 px-4 sm:px-6 md:px-8 overflow-hidden"
    >
      {/* 3D WebGL Orb Background */}
      <Hero3DOrb />

      {/* Atmospheric Background Blobs */}
      <motion.div
        style={{ y: yBg }}
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-[#7C5CFF]/20 via-[#FF4D9D]/15 to-transparent blur-[120px] pointer-events-none rounded-full"
      />
      <div className="absolute top-1/3 -left-36 w-80 h-80 bg-[#7C5CFF]/15 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 -right-36 w-80 h-80 bg-[#FFB547]/15 blur-[100px] pointer-events-none rounded-full" />

      {/* Hero Content Container */}
      <motion.div
        style={{ opacity: opacityHero }}
        className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center my-auto"
      >
        {/* Animated Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-6 inline-flex"
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-[0_0_20px_rgba(124,92,255,0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4D9D] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF4D9D]"></span>
            </span>
            <span className="text-xs font-semibold tracking-wide text-white uppercase font-mono-accent">
              {siteConfig.badge}
            </span>
            <div className="h-3 w-[1px] bg-white/20" />
            <span className="text-xs text-[#9A9AB0] flex items-center gap-1 hover:text-white transition-colors cursor-pointer">
              Explore Demo <ArrowRight className="w-3 h-3 text-[#FFB547]" />
            </span>
          </div>
        </motion.div>

        {/* Giant Headline with Word-by-Word Reveal */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.2rem] font-extrabold text-[#F5F5FA] tracking-tight leading-[1.08] max-w-4xl font-heading">
          {headlineWords.map((word, i) => (
            <motion.span
              key={`hw-${i}`}
              initial={{ opacity: 0, y: 35, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.8,
                delay: 0.1 + i * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-block mr-2 sm:mr-3"
            >
              {word}
            </motion.span>
          ))}
          <span className="text-gradient">
            {gradientWords.map((word, i) => (
              <motion.span
                key={`gw-${i}`}
                initial={{ opacity: 0, y: 35, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.8,
                  delay: 0.35 + i * 0.07,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="inline-block mr-2 sm:mr-3"
              >
                {word}
              </motion.span>
            ))}
          </span>
        </h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-base sm:text-lg md:text-xl text-[#9A9AB0] max-w-2xl leading-relaxed"
        >
          {siteConfig.hero.subheadline}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Link href="/practice" className="w-full sm:w-auto">
            <MagneticButton
              variant="primary"
              size="lg"
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold shadow-[0_0_35px_rgba(124,92,255,0.5)]"
            >
              <span>{siteConfig.hero.ctaPrimary}</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </MagneticButton>
          </Link>

          <a href="#demo" className="w-full sm:w-auto" data-cursor="Play">
            <MagneticButton
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto px-7 py-4 text-base"
            >
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center mr-1">
                <Play className="w-3 h-3 text-[#FF4D9D] fill-[#FF4D9D]" />
              </div>
              <span>{siteConfig.hero.ctaSecondary}</span>
            </MagneticButton>
          </a>
        </motion.div>

        {/* Social Proof Line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.85 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3 text-xs text-[#9A9AB0]"
        >
          <div className="flex -space-x-2 overflow-hidden">
            {["👨‍💻", "👩‍💻", "⚡", "🚀", "🏆"].map((emoji, i) => (
              <div
                key={i}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#151521] border border-white/20 text-xs shadow"
              >
                {emoji}
              </div>
            ))}
          </div>
          <span>{siteConfig.socialProof}</span>
          <span className="hidden sm:inline text-white/30">•</span>
          <span className="flex items-center gap-1 text-[#3DDC97] font-mono-accent">
            <CheckCircle2 className="w-3.5 h-3.5" /> 4.9/5 Rating
          </span>
        </motion.div>
      </motion.div>

      {/* Floating Glass UI Cards (Parallax Mid-Layer) */}
      <motion.div
        style={{ y: yCards }}
        className="hidden md:block pointer-events-none absolute inset-0 z-20 overflow-visible max-w-7xl mx-auto"
      >
        {/* Card 1: Top Left Mini Timer */}
        <motion.div
          initial={{ opacity: 0, x: -40, y: -20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-36 left-4 lg:left-8 w-60 rounded-2xl bg-[#0E0E16]/85 backdrop-blur-xl border border-white/10 p-3.5 shadow-[0_15px_35px_rgba(0,0,0,0.6)] animate-subtle-float"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#3DDC97] animate-pulse" />
              <span className="text-[11px] font-mono-accent text-[#9A9AB0]">Slide 2 / 5</span>
            </div>
            <span className="text-[10px] font-mono-accent bg-[#3DDC97]/20 text-[#3DDC97] px-2 py-0.5 rounded-full">
              Pacing: Optimal
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono-accent text-white">02:18</span>
            <span className="text-xs text-[#9A9AB0] font-mono-accent">Target: 02:30</span>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="w-3/5 h-full bg-gradient-to-r from-[#7C5CFF] to-[#3DDC97]" />
          </div>
        </motion.div>

        {/* Card 2: Top Right Score Ring Card */}
        <motion.div
          initial={{ opacity: 0, x: 40, y: -20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-44 right-4 lg:right-8 w-56 rounded-2xl bg-[#0E0E16]/85 backdrop-blur-xl border border-white/10 p-3.5 shadow-[0_15px_35px_rgba(0,0,0,0.6)] animate-subtle-float [animation-delay:1.5s]"
        >
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 flex items-center justify-center rounded-full bg-gradient-to-tr from-[#7C5CFF] to-[#FF4D9D] p-[1.5px] shrink-0">
              <div className="w-full h-full bg-[#0E0E16] rounded-full flex items-center justify-center">
                <span className="text-xs font-bold font-mono-accent text-white">94</span>
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-white font-heading">Winning Caliber</div>
              <div className="text-[11px] text-[#3DDC97] font-mono-accent mt-0.5">Top 3% Finalist</div>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-white/5 flex justify-between text-[10px] text-[#9A9AB0] font-mono-accent">
            <span>Tech: 9.6/10</span>
            <span>Demo: 9.4/10</span>
          </div>
        </motion.div>

        {/* Card 3: Bottom Right Judge Question Bubble */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-20 right-10 lg:right-20 w-72 rounded-2xl bg-[#151521]/90 backdrop-blur-xl border border-purple-500/20 p-3.5 shadow-[0_20px_40px_rgba(0,0,0,0.8)] animate-subtle-float [animation-delay:3s]"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-sm">💼</span>
            <span className="text-xs font-bold text-white font-heading">Marcus Vance (VC)</span>
            <span className="text-[9px] uppercase font-mono-accent bg-[#FF4D9D]/20 text-[#FF4D9D] px-1.5 py-0.5 rounded">
              Harsh
            </span>
          </div>
          <p className="text-xs text-[#F5F5FA] leading-relaxed italic">
            “What prevents OpenAI from shipping your core feature as an API endpoint next month?”
          </p>
        </motion.div>
      </motion.div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="relative z-10 flex flex-col items-center justify-center mt-12 cursor-pointer group"
      >
        <a href="#marquee" className="flex flex-col items-center gap-1.5 text-xs text-[#9A9AB0] group-hover:text-white transition-colors">
          <span className="font-mono-accent text-[11px] tracking-wider uppercase">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          >
            <ChevronDown className="w-4 h-4 text-[#7C5CFF]" />
          </motion.div>
        </a>
      </motion.div>
    </section>
  );
}
