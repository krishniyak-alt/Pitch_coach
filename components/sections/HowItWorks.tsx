"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { siteConfig } from "@/data/content";
import Badge from "@/components/ui/Badge";
import Waveform from "@/components/ui/Waveform";
import ScoreRing from "@/components/ui/ScoreRing";
import { UploadCloud, Mic, MessageSquare, Award, CheckCircle, FileText, Sparkles, AlertCircle } from "lucide-react";

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // Map 0 -> 1 into 4 steps: 0, 1, 2, 3
      if (latest < 0.25) {
        setActiveStep(0);
      } else if (latest < 0.5) {
        setActiveStep(1);
      } else if (latest < 0.75) {
        setActiveStep(2);
      } else {
        setActiveStep(3);
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  const steps = siteConfig.howItWorks.steps;

  return (
    <section
      id="how-it-works"
      ref={containerRef}
      className="relative bg-[#07070B] min-h-[320vh] border-t border-white/[0.06]"
    >
      {/* Sticky viewport frame */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center px-4 sm:px-6 md:px-12 py-10 overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#7C5CFF]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-6xl mx-auto w-full">
          {/* Section Header */}
          <div className="mb-8 sm:mb-12">
            <Badge variant="violet" className="mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#7C5CFF]" />
              <span>{siteConfig.howItWorks.badge}</span>
            </Badge>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-heading">
              {siteConfig.howItWorks.title}
            </h2>
          </div>

          {/* Main Grid: Left Steps + Right Device Mockup */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Steps List (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-5 sm:gap-6 relative">
              {/* Vertical Progress Line */}
              <div className="absolute left-[19px] top-6 bottom-6 w-[2px] bg-white/10 hidden sm:block">
                <motion.div
                  className="w-full bg-gradient-to-b from-[#7C5CFF] via-[#FF4D9D] to-[#FFB547]"
                  style={{
                    height: `${((activeStep + 1) / steps.length) * 100}%`,
                    transition: "height 0.4s ease-out",
                  }}
                />
              </div>

              {steps.map((step, idx) => {
                const isActive = activeStep === idx;
                return (
                  <div
                    key={step.step}
                    onClick={() => setActiveStep(idx)}
                    className={`relative flex items-start gap-4 p-4 sm:p-5 rounded-2xl transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-[#151521]/90 border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
                        : "opacity-45 hover:opacity-75 bg-transparent border border-transparent"
                    }`}
                  >
                    {/* Step indicator node */}
                    <div
                      className={`relative z-10 w-10 h-10 rounded-xl flex items-center justify-center font-mono-accent font-bold text-xs shrink-0 transition-all ${
                        isActive
                          ? "bg-gradient-to-br from-[#7C5CFF] to-[#FF4D9D] text-white shadow-[0_0_15px_rgba(124,92,255,0.6)]"
                          : "bg-white/5 border border-white/10 text-[#9A9AB0]"
                      }`}
                    >
                      {step.step}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-bold text-white font-heading">
                          {step.title}
                        </h3>
                        {isActive && (
                          <span className="text-[10px] uppercase font-mono-accent bg-[#7C5CFF]/20 text-[#C8B8FF] px-2 py-0.5 rounded-full border border-[#7C5CFF]/30">
                            {step.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#9A9AB0] mt-1 line-clamp-2 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Device / Browser Mockup (7 cols) */}
            <div className="lg:col-span-7">
              <div className="relative rounded-3xl bg-[#0E0E16] border border-white/15 p-2 sm:p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden">
                {/* Browser top chrome */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 mb-3 bg-[#151521]/60 rounded-t-2xl">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5C6C]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FFB547]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#3DDC97]" />
                  </div>
                  <div className="text-[11px] font-mono-accent text-[#9A9AB0] bg-black/40 px-4 py-0.5 rounded-full border border-white/5">
                    pitchcoach.ai/studio/live-rehearsal
                  </div>
                  <div className="w-8" />
                </div>

                {/* Device Inner Content - Dynamic Crossfade based on activeStep */}
                <div className="relative h-[340px] sm:h-[400px] w-full bg-[#07070B] rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center p-6">
                  <AnimatePresence mode="wait">
                    {/* Step 1: Upload Your Deck */}
                    {activeStep === 0 && (
                      <motion.div
                        key="step-0"
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.04 }}
                        transition={{ duration: 0.45 }}
                        className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-[#7C5CFF]/40 rounded-2xl bg-[#0E0E16]/80 p-6 text-center"
                      >
                        <motion.div
                          animate={{ y: [0, -6, 0] }}
                          transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                          className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#7C5CFF]/30 to-[#FF4D9D]/30 border border-[#7C5CFF]/50 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(124,92,255,0.4)]"
                        >
                          <UploadCloud className="w-8 h-8 text-white" />
                        </motion.div>
                        <h4 className="text-lg font-bold text-white font-heading">
                          Drop Pitch Deck (PDF / PPTX)
                        </h4>
                        <p className="text-xs text-[#9A9AB0] mt-1 max-w-sm">
                          Multimodal AI automatically extracts slides, tags architecture diagrams, and computes time allocations.
                        </p>

                        <div className="mt-5 flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                          <FileText className="w-4 h-4 text-[#3DDC97]" />
                          <span className="text-xs font-mono-accent text-white">ethglobal_final_deck_v3.pdf</span>
                          <span className="text-[10px] text-[#3DDC97] bg-[#3DDC97]/20 px-2 py-0.5 rounded font-mono-accent">Parsed (5 slides)</span>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: Speak Your Pitch */}
                    {activeStep === 1 && (
                      <motion.div
                        key="step-1"
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.04 }}
                        transition={{ duration: 0.45 }}
                        className="w-full h-full flex flex-col justify-between p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5C6C] opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF5C6C]"></span>
                            </span>
                            <span className="text-xs font-mono-accent text-[#FF5C6C] uppercase font-bold tracking-wider">
                              Recording live audio
                            </span>
                          </div>
                          <span className="text-xl font-bold font-mono-accent text-white">01:42</span>
                        </div>

                        {/* Live waveform center */}
                        <div className="my-auto flex flex-col items-center">
                          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#7C5CFF] to-[#FF4D9D] p-[2px] shadow-[0_0_40px_rgba(255,77,157,0.5)] flex items-center justify-center mb-5">
                            <div className="w-full h-full bg-[#0E0E16] rounded-full flex items-center justify-center">
                              <Mic className="w-8 h-8 text-[#FF4D9D] animate-pulse" />
                            </div>
                          </div>
                          <Waveform isActive={true} barCount={32} height={60} className="w-full max-w-md" />
                          <div className="flex items-center gap-4 mt-3 text-xs font-mono-accent text-[#9A9AB0]">
                            <span>Pace: 142 WPM (Optimal)</span>
                            <span>•</span>
                            <span className="text-[#3DDC97]">Filler words: 0 flagged</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] font-mono-accent text-[#9A9AB0] bg-white/5 p-2 rounded-xl border border-white/5">
                          <span>Current: Slide 2 - Problem Definition</span>
                          <span className="text-[#3DDC97]">On Track (+4s bank)</span>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Face the Judge */}
                    {activeStep === 2 && (
                      <motion.div
                        key="step-2"
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.04 }}
                        transition={{ duration: 0.45 }}
                        className="w-full h-full flex flex-col justify-between p-4"
                      >
                        {/* Judge Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg">
                              ⚡
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white font-heading">
                                Dr. Elena Rostova
                              </div>
                              <div className="text-[10px] text-[#9A9AB0] font-mono-accent">
                                Principal Architect • Judging Intensity: Brutal
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono-accent bg-[#FF5C6C]/20 text-[#FF5C6C] px-2 py-0.5 rounded border border-[#FF5C6C]/30">
                            Live Interrogation
                          </span>
                        </div>

                        {/* Judge Chat Bubble */}
                        <div className="my-auto space-y-3">
                          <div className="bg-[#151521] border border-white/10 rounded-2xl p-4 shadow-lg">
                            <div className="flex items-center gap-2 mb-1.5">
                              <MessageSquare className="w-3.5 h-3.5 text-[#FF4D9D]" />
                              <span className="text-[11px] font-mono-accent text-[#FF4D9D] font-bold">
                                Judge Follow-Up Question:
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm text-white leading-relaxed italic">
                              “You claim sub-50ms latency with zero state drift across edge nodes. How does your reconciliation protocol handle partition splits during a DDOS surge?”
                            </p>
                          </div>

                          <div className="bg-white/5 border border-white/5 rounded-xl p-2.5 flex items-center justify-between text-xs text-[#9A9AB0]">
                            <span>💡 PitchCoach Tip: Cite your vector consensus benchmarks</span>
                            <span className="font-mono-accent text-white">Press Space to Speak</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2">
                          <button className="px-3 py-1.5 rounded-xl bg-white/10 text-xs font-medium text-white hover:bg-white/15 transition-colors">
                            Next Question →
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 4: Get Your Score */}
                    {activeStep === 3 && (
                      <motion.div
                        key="step-3"
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.04 }}
                        transition={{ duration: 0.45 }}
                        className="w-full h-full flex flex-col items-center justify-center p-4 text-center"
                      >
                        <ScoreRing score={92} size={150} strokeWidth={10} />

                        <div className="mt-3">
                          <div className="text-base font-bold text-white font-heading">
                            Winning Caliber Rehearsal
                          </div>
                          <div className="text-xs text-[#3DDC97] font-mono-accent mt-0.5">
                            Ranked Top 4% across 1,800+ simulated pitches
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 w-full mt-4 text-center">
                          <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                            <div className="text-[10px] text-[#9A9AB0] font-mono-accent">TECH DEPTH</div>
                            <div className="text-sm font-bold text-white font-mono-accent">9.4/10</div>
                          </div>
                          <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                            <div className="text-[10px] text-[#9A9AB0] font-mono-accent">TIMING ACCURACY</div>
                            <div className="text-sm font-bold text-[#3DDC97] font-mono-accent">98%</div>
                          </div>
                          <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                            <div className="text-[10px] text-[#9A9AB0] font-mono-accent">FILLER WORDS</div>
                            <div className="text-sm font-bold text-[#FFB547] font-mono-accent">2 found</div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
