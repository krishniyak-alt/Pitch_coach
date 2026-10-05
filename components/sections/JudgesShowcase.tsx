"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { siteConfig } from "@/data/content";
import Badge from "@/components/ui/Badge";
import GlowCard from "@/components/ui/GlowCard";
import { Bot, MessageSquare, Flame, ShieldAlert, Sparkles, ChevronRight } from "lucide-react";

export default function JudgesShowcase() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  // Transform vertical scroll into horizontal translation for the card track
  // On desktop: translate from 0% to -55%
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-52%"]);

  return (
    <section
      id="judges"
      ref={targetRef}
      className="relative bg-[#07070B] min-h-[240vh] border-t border-white/[0.06]"
    >
      {/* Sticky Frame for Horizontal Movement */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden px-4 sm:px-6 md:px-12 py-8">
        {/* Background glow */}
        <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-[#FF4D9D]/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-6xl mx-auto w-full mb-8">
          <Badge variant="magenta" className="mb-3">
            <Bot className="w-3.5 h-3.5 text-[#FF4D9D]" />
            <span>AI Judge Personas</span>
          </Badge>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-heading">
                Meet your toughest rehearsal critics
              </h2>
              <p className="mt-2 text-sm sm:text-base text-[#9A9AB0] max-w-xl">
                Trained on real judging sessions. Switch personas to audit your business model, probe edge cases, or stress-test your architecture.
              </p>
            </div>
            <div className="text-xs font-mono-accent text-[#9A9AB0] flex items-center gap-1">
              <span>Scroll to view judges</span>
              <ChevronRight className="w-4 h-4 text-[#7C5CFF]" />
            </div>
          </div>
        </div>

        {/* Horizontal Scroll Track */}
        <div className="relative w-full max-w-7xl mx-auto overflow-visible">
          <motion.div
            style={{ x }}
            className="flex gap-6 sm:gap-8 pb-4 will-change-transform"
          >
            {siteConfig.judges.map((judge) => {
              const intensityColor =
                judge.intensityVal >= 90
                  ? "#FF5C6C"
                  : judge.intensityVal >= 75
                  ? "#FF4D9D"
                  : "#FFB547";

              return (
                <div
                  key={judge.id}
                  className="w-[310px] sm:w-[370px] lg:w-[410px] shrink-0"
                >
                  <GlowCard
                    className="h-full flex flex-col justify-between p-6 sm:p-7 border border-white/10 hover:border-white/20 transition-all bg-[#0E0E16]/90"
                    glowColor="rgba(255, 77, 157, 0.15)"
                  >
                    <div>
                      {/* Top Persona Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${judge.gradient} border border-white/20 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)]`}>
                            {judge.avatar}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white font-heading">
                              {judge.name}
                            </h3>
                            <div className="text-xs text-[#9A9AB0] font-mono-accent">
                              {judge.role}
                            </div>
                          </div>
                        </div>

                        <span
                          className="text-[10px] font-mono-accent uppercase tracking-wider px-2 py-0.5 rounded-full border"
                          style={{
                            color: intensityColor,
                            borderColor: `${intensityColor}40`,
                            backgroundColor: `${intensityColor}15`,
                          }}
                        >
                          {judge.intensity}
                        </span>
                      </div>

                      {/* Intensity Bar */}
                      <div className="mb-5">
                        <div className="flex justify-between text-[10px] font-mono-accent text-[#9A9AB0] mb-1">
                          <span>Judging Intensity:</span>
                          <span style={{ color: intensityColor }} className="font-bold">
                            {judge.intensityVal}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${judge.intensityVal}%`,
                              backgroundColor: intensityColor,
                            }}
                          />
                        </div>
                      </div>

                      {/* Focus Vector Tag */}
                      <div className="mb-4">
                        <span className="text-[10px] font-mono-accent uppercase tracking-wider text-[#9A9AB0] block mb-1">
                          Primary Scrutiny:
                        </span>
                        <div className="text-xs font-semibold text-white bg-white/5 p-2 rounded-xl border border-white/5">
                          {judge.focus}
                        </div>
                      </div>

                      {/* Sample Roast Question Bubble */}
                      <div className="p-4 rounded-2xl bg-[#151521] border border-white/10 relative">
                        <div className="flex items-center gap-1.5 text-[11px] font-mono-accent text-[#FF4D9D] mb-1.5 font-bold">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Typical Stage Question:</span>
                        </div>
                        <p className="text-xs text-[#F5F5FA] leading-relaxed italic">
                          {judge.sampleQuestion}
                        </p>
                      </div>
                    </div>

                    {/* Personality Note */}
                    <div className="mt-5 pt-3 border-t border-white/5 text-[11px] text-[#9A9AB0] leading-snug">
                      <span className="text-white font-semibold">Attitude: </span>
                      {judge.personality}
                    </div>
                  </GlowCard>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
