"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/data/content";
import GlowCard from "@/components/ui/GlowCard";
import Badge from "@/components/ui/Badge";
import {
  Clock,
  Sparkles,
  Bot,
  Radar,
  AlertCircle,
  Gauge,
  Layers,
  TrendingUp,
  CheckCircle2,
  Check,
} from "lucide-react";

export default function FeaturesBento() {
  // Live typing effect state for Card 2 (AI Judge)
  const [typedText, setTypedText] = useState("");
  const fullText = "“How do you handle vector collision under multi-tenant write load?”";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, index));
      index++;
      if (index > fullText.length + 15) {
        index = 0;
      }
    }, 70);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="features" className="relative py-28 sm:py-36 px-4 sm:px-6 md:px-8 bg-[#07070B] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-[#7C5CFF]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#FF4D9D]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <Badge variant="violet" className="mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#7C5CFF]" />
            <span>{siteConfig.features.badge}</span>
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-heading">
            {siteConfig.features.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#9A9AB0] max-w-xl mx-auto">
            {siteConfig.features.description}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {/* Card 1: Smart Timing (col-span-4) */}
          <GlowCard className="lg:col-span-4 flex flex-col justify-between" glowColor="rgba(61, 220, 151, 0.2)">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#3DDC97]/15 border border-[#3DDC97]/30 flex items-center justify-center text-[#3DDC97]">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono-accent bg-[#3DDC97]/20 text-[#3DDC97] px-2 py-0.5 rounded-full">
                  Zero Overtime
                </span>
              </div>
              <h3 className="text-xl font-bold text-white font-heading">Smart Slide Timing</h3>
              <p className="text-xs text-[#9A9AB0] mt-1.5 leading-relaxed">
                Dynamic per-slide budget allocation. Live alerts keep you from stalling on your intro hook.
              </p>
            </div>

            {/* Micro Animation: Animated Stopwatch with Per-Slide Bars */}
            <div className="mt-6 p-3.5 rounded-2xl bg-[#151521]/70 border border-white/10">
              <div className="flex items-center justify-between text-xs font-mono-accent mb-2">
                <span className="text-[#3DDC97] font-bold">● 03:42 / 04:00</span>
                <span className="text-[#9A9AB0]">Slide 4 of 5</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[10px] font-mono-accent text-[#9A9AB0]">
                  <span className="w-10">Slide 1</span>
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-[85%] h-full bg-[#3DDC97] rounded-full" />
                  </div>
                  <span>42s</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono-accent text-[#9A9AB0]">
                  <span className="w-10">Slide 2</span>
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-[95%] h-full bg-[#3DDC97] rounded-full" />
                  </div>
                  <span>48s</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono-accent text-[#9A9AB0]">
                  <span className="w-10">Slide 3</span>
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-[70%] h-full bg-[#FFB547] rounded-full" />
                  </div>
                  <span>71s</span>
                </div>
              </div>
            </div>
          </GlowCard>

          {/* Card 2: AI Judge Mode (col-span-4) */}
          <GlowCard className="lg:col-span-4 flex flex-col justify-between" glowColor="rgba(255, 77, 157, 0.2)">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#FF4D9D]/15 border border-[#FF4D9D]/30 flex items-center justify-center text-[#FF4D9D]">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono-accent bg-[#FF4D9D]/20 text-[#FFA6D2] px-2 py-0.5 rounded-full">
                  Live Interrogation
                </span>
              </div>
              <h3 className="text-xl font-bold text-white font-heading">Ruthless AI Judge</h3>
              <p className="text-xs text-[#9A9AB0] mt-1.5 leading-relaxed">
                Anticipate the most brutal follow-ups. Select from Top VC, Principal Architect, or Skeptic personas.
              </p>
            </div>

            {/* Micro Animation: Live Typing Chat Bubble */}
            <div className="mt-6 p-4 rounded-2xl bg-[#151521]/70 border border-white/10 min-h-[115px] flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs">⚡</span>
                <span className="text-[11px] font-bold text-white font-heading">Dr. Elena Rostova</span>
                <span className="text-[9px] font-mono-accent text-[#FF4D9D]">Architect</span>
              </div>
              <p className="text-xs text-[#F5F5FA] font-mono-accent leading-relaxed italic min-h-[38px]">
                {typedText}
                <span className="inline-block w-1.5 h-3 bg-[#FF4D9D] ml-0.5 animate-pulse" />
              </p>
            </div>
          </GlowCard>

          {/* Card 3: Rubric Scoring (col-span-4) */}
          <GlowCard className="lg:col-span-4 flex flex-col justify-between" glowColor="rgba(124, 92, 255, 0.2)">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#7C5CFF]/15 border border-[#7C5CFF]/30 flex items-center justify-center text-[#7C5CFF]">
                  <Radar className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono-accent bg-[#7C5CFF]/20 text-[#C8B8FF] px-2 py-0.5 rounded-full">
                  5-Axis Rubric
                </span>
              </div>
              <h3 className="text-xl font-bold text-white font-heading">Rubric Radar</h3>
              <p className="text-xs text-[#9A9AB0] mt-1.5 leading-relaxed">
                Benchmarked directly against standard major hackathon criteria used by top judges.
              </p>
            </div>

            {/* Micro Animation: Mini SVG Radar Chart */}
            <div className="mt-6 p-3 rounded-2xl bg-[#151521]/70 border border-white/10 flex items-center justify-center">
              <svg width="150" height="90" viewBox="0 0 150 90" className="overflow-visible">
                <polygon
                  points="75,10 130,35 110,80 40,80 20,35"
                  fill="none"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="1"
                />
                <motion.polygon
                  points="75,20 120,40 105,75 45,75 30,42"
                  fill="rgba(124, 92, 255, 0.35)"
                  stroke="#7C5CFF"
                  strokeWidth="2"
                  animate={{
                    points: [
                      "75,20 120,40 105,75 45,75 30,42",
                      "75,15 125,38 108,78 42,76 25,38",
                      "75,20 120,40 105,75 45,75 30,42",
                    ],
                  }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                />
              </svg>
              <div className="ml-3 text-[11px] font-mono-accent space-y-0.5 text-[#9A9AB0]">
                <div>Tech: <span className="text-white font-bold">9.4</span></div>
                <div>Idea: <span className="text-white font-bold">9.2</span></div>
                <div>Demo: <span className="text-[#3DDC97] font-bold">9.6</span></div>
              </div>
            </div>
          </GlowCard>

          {/* Card 4: Filler Word Detector (col-span-6) */}
          <GlowCard className="lg:col-span-6 flex flex-col justify-between" glowColor="rgba(255, 92, 108, 0.2)">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#FF5C6C]/15 border border-[#FF5C6C]/30 flex items-center justify-center text-[#FF5C6C]">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono-accent bg-[#FF5C6C]/20 text-[#FF5C6C] px-2 py-0.5 rounded-full">
                  Speech Telemetry
                </span>
              </div>
              <h3 className="text-xl font-bold text-white font-heading">Filler Word Annihilator</h3>
              <p className="text-xs text-[#9A9AB0] mt-1.5 leading-relaxed">
                Highlights subconscious hesitations in real time so you project total conviction on stage.
              </p>
            </div>

            {/* Micro Animation: Transcript with Highlighted Hesitation Tags */}
            <div className="mt-6 p-4 rounded-2xl bg-[#151521]/70 border border-white/10 text-xs text-[#9A9AB0] leading-relaxed">
              <span>“So </span>
              <span className="bg-[#FF5C6C]/30 text-[#FF5C6C] px-1.5 py-0.5 rounded font-bold border border-[#FF5C6C]/40">
                basically
              </span>
              <span> our architecture is, </span>
              <span className="bg-[#FFB547]/30 text-[#FFB547] px-1.5 py-0.5 rounded font-bold border border-[#FFB547]/40">
                um
              </span>
              <span> connected via WebSockets, and </span>
              <span className="bg-[#FF5C6C]/30 text-[#FF5C6C] px-1.5 py-0.5 rounded font-bold border border-[#FF5C6C]/40">
                like
              </span>
              <span> it reconciles state in 40 milliseconds.”</span>

              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono-accent">
                <span className="text-[#FF5C6C] font-semibold">3 filler words detected</span>
                <span className="text-[#3DDC97]">Goal: 0 in final run</span>
              </div>
            </div>
          </GlowCard>

          {/* Card 5: Pace and Clarity (col-span-6) */}
          <GlowCard className="lg:col-span-6 flex flex-col justify-between" glowColor="rgba(255, 181, 71, 0.2)">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#FFB547]/15 border border-[#FFB547]/30 flex items-center justify-center text-[#FFB547]">
                  <Gauge className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono-accent bg-[#FFB547]/20 text-[#FFB547] px-2 py-0.5 rounded-full">
                  142 WPM Optimal
                </span>
              </div>
              <h3 className="text-xl font-bold text-white font-heading">Pace & Clarity Gauge</h3>
              <p className="text-xs text-[#9A9AB0] mt-1.5 leading-relaxed">
                Prevents rushed breathless delivery when adrenaline spikes. Guides you into the golden zone.
              </p>
            </div>

            {/* Micro Animation: Speed Gauge Meter */}
            <div className="mt-6 p-4 rounded-2xl bg-[#151521]/70 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#9A9AB0] font-mono-accent">Live Speech Velocity</span>
                <span className="text-sm font-bold font-mono-accent text-white">142 WPM</span>
              </div>
              {/* Gauge Bar */}
              <div className="relative h-3 w-full bg-white/10 rounded-full overflow-hidden flex">
                <div className="w-1/4 h-full bg-[#FF5C6C]/50" title="Too slow" />
                <div className="w-1/2 h-full bg-[#3DDC97]" title="Optimal hackathon cadence" />
                <div className="w-1/4 h-full bg-[#FF4D9D]/50" title="Too fast" />
              </div>
              <div className="flex justify-between text-[9px] font-mono-accent text-[#9A9AB0] mt-1.5">
                <span>100 Slow</span>
                <span className="text-[#3DDC97] font-bold">130-155 WPM Sweet Spot</span>
                <span>190 Rushed</span>
              </div>
            </div>
          </GlowCard>

          {/* Card 6: Slide-Aware Contextual Feedback (col-span-7) */}
          <GlowCard className="lg:col-span-7 flex flex-col justify-between" glowColor="rgba(124, 92, 255, 0.2)">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#7C5CFF]/15 border border-[#7C5CFF]/30 flex items-center justify-center text-[#7C5CFF]">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono-accent bg-[#7C5CFF]/20 text-[#C8B8FF] px-2 py-0.5 rounded-full">
                  Multimodal Sync
                </span>
              </div>
              <h3 className="text-xl font-bold text-white font-heading">Slide-Aware Contextual Feedback</h3>
              <p className="text-xs text-[#9A9AB0] mt-1.5 leading-relaxed">
                PitchCoach matches your audio stream against slide graphics to flag contradictions or missing claims.
              </p>
            </div>

            {/* Micro Animation: Slide Thumbnail Strip */}
            <div className="mt-6 grid grid-cols-4 gap-2.5">
              {[
                { title: "Hook", status: "passed", time: "42s" },
                { title: "Solution", status: "passed", time: "48s" },
                { title: "Arch", status: "active", time: "71s" },
                { title: "Demo", status: "ready", time: "60s" },
              ].map((s, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border flex flex-col justify-between h-20 transition-all ${
                    s.status === "active"
                      ? "bg-[#7C5CFF]/20 border-[#7C5CFF]/60 shadow-[0_0_15px_rgba(124,92,255,0.4)]"
                      : "bg-white/5 border-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono-accent text-white font-bold">0{idx + 1}</span>
                    {s.status === "passed" && <Check className="w-3 h-3 text-[#3DDC97]" />}
                    {s.status === "active" && <span className="w-2 h-2 rounded-full bg-[#7C5CFF] animate-pulse" />}
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-white">{s.title}</div>
                    <div className="text-[9px] text-[#9A9AB0] font-mono-accent">{s.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </GlowCard>

          {/* Card 7: Progress Tracking (col-span-5) */}
          <GlowCard className="lg:col-span-5 flex flex-col justify-between" glowColor="rgba(61, 220, 151, 0.2)">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#3DDC97]/15 border border-[#3DDC97]/30 flex items-center justify-center text-[#3DDC97]">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono-accent bg-[#3DDC97]/20 text-[#3DDC97] px-2 py-0.5 rounded-full">
                  +28 pts average
                </span>
              </div>
              <h3 className="text-xl font-bold text-white font-heading">Score Progression</h3>
              <p className="text-xs text-[#9A9AB0] mt-1.5 leading-relaxed">
                Watch your score compound over 5 iterations before taking the main stage.
              </p>
            </div>

            {/* Micro Animation: Sparkline Graph */}
            <div className="mt-6 p-4 rounded-2xl bg-[#151521]/70 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono-accent text-[#9A9AB0]">Run 1 → Run 5</span>
                <span className="text-sm font-bold font-mono-accent text-[#3DDC97]">64 → 92</span>
              </div>
              <svg width="100%" height="45" viewBox="0 0 200 45" className="overflow-visible">
                <path
                  d="M0,40 L45,35 L90,26 L140,16 L200,4"
                  fill="none"
                  stroke="#3DDC97"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="0" cy="40" r="3" fill="#3DDC97" />
                <circle cx="45" cy="35" r="3" fill="#3DDC97" />
                <circle cx="90" cy="26" r="3" fill="#3DDC97" />
                <circle cx="140" cy="16" r="3" fill="#3DDC97" />
                <circle cx="200" cy="4" r="5" fill="#FFFFFF" stroke="#3DDC97" strokeWidth="2" />
              </svg>
            </div>
          </GlowCard>
        </div>
      </div>
    </section>
  );
}
