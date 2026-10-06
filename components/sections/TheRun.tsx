"use client";

import { useState, useEffect, useRef } from "react";
import { siteConfig } from "@/data/content";
import { samplePitch } from "@/data/sample";
import { motion, useScroll } from "framer-motion";
import { Upload, Mic, Clock, HelpCircle, CheckSquare } from "lucide-react";

export default function TheRun() {
  const containerRef = useRef<HTMLElement>(null);
  const [activeStop, setActiveStop] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const frames = samplePitch.timeline;

  useEffect(() => {
    const handleScroll = () => {
      const items = document.querySelectorAll("[data-run-frame]");
      const triggerY = window.innerHeight * 0.45;

      items.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        if (rect.top <= triggerY && rect.bottom >= triggerY) {
          setActiveStop(index);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="run"
      ref={containerRef}
      className="relative section-rhythm px-5 sm:px-8 lg:px-12 bg-paper border-b border-rule"
    >
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Columns 1-4: Sticky on desktop (top: 96px) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 flex flex-col items-start pb-8">
          <span className="text-xs uppercase font-mono tracking-[0.08em] text-ink-3 mb-3 font-semibold block">
            {siteConfig.sectionRun.label}
          </span>
          <h2 className="font-serif text-[clamp(2rem,3.8vw,3.25rem)] font-bold text-ink leading-[1.05] mb-6">
            {siteConfig.sectionRun.h2}
          </h2>

          {/* Vertical Timeline with 5 mono stops (hidden on small screens, integrated per frame) */}
          <div className="hidden lg:flex flex-col relative pl-6 mt-4">
            {/* Background hairline line */}
            <div className="absolute left-[5px] top-2 bottom-2 w-[1px] bg-rule" />

            {/* Filled line based on scroll */}
            <motion.div
              style={{ scaleY: scrollYProgress, transformOrigin: "top" }}
              className="absolute left-[5px] top-2 bottom-2 w-[1px] bg-ink"
            />

            {frames.map((frame, idx) => {
              const isActive = activeStop === idx;
              return (
                <div key={frame.time} className="flex items-center gap-3.5 py-4 first:pt-0 last:pb-0">
                  {/* Stop marker: small signal square when active, ink dot otherwise */}
                  <div
                    className={`relative z-10 w-2.5 h-2.5 shrink-0 transition-colors duration-200 ${
                      isActive ? "bg-signal ring-2 ring-signal/30" : "bg-ink-3"
                    }`}
                    style={{ borderRadius: "2px" }}
                  />
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span
                      className={`font-bold tabular-numbers ${
                        isActive ? "text-ink" : "text-ink-3"
                      }`}
                    >
                      {frame.time}
                    </span>
                    <span className={`uppercase tracking-wider ${isActive ? "text-ink font-semibold" : "text-ink-3"}`}>
                      {frame.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Columns 6-12: 5 Stacked Frames separated by hairline rules */}
        <div className="lg:col-span-7 lg:col-start-6 flex flex-col divide-y divide-rule border-t lg:border-t-0 border-rule">
          {/* Frame 1: 00:00 Upload */}
          <div data-run-frame="0" className="py-10 first:pt-0 last:pb-12">
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-sm font-bold text-ink bg-paper-2 px-2 py-0.5 border border-rule" style={{ borderRadius: "2px" }}>
                00:00
              </span>
              <span className="font-serif text-2xl font-bold text-ink">Upload</span>
            </div>
            <p className="text-ink-2 text-base leading-relaxed mb-5 max-w-xl">
              {frames[0].summary}
            </p>
            {/* Real UI Fragment 1: Deck drop zone with real FloodPing file */}
            <div className="border border-rule bg-paper-2 p-5 flex items-center justify-between" style={{ borderRadius: "2px" }}>
              <div className="flex items-center gap-3.5">
                <Upload className="w-5 h-5 text-ink-3 shrink-0" />
                <div>
                  <div className="font-mono text-sm font-bold text-ink">
                    {samplePitch.deckFileName}
                  </div>
                  <div className="font-mono text-xs text-ink-3">
                    {samplePitch.slideCount} slides parsed • PDF presentation deck
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-mono text-success uppercase tracking-wider font-semibold border border-success/30 px-2 py-0.5 bg-paper">
                Ready
              </span>
            </div>
          </div>

          {/* Frame 2: 00:30 Pitch */}
          <div data-run-frame="1" className="py-10">
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-sm font-bold text-ink bg-paper-2 px-2 py-0.5 border border-rule" style={{ borderRadius: "2px" }}>
                00:30
              </span>
              <span className="font-serif text-2xl font-bold text-ink">Pitch</span>
            </div>
            <p className="text-ink-2 text-base leading-relaxed mb-5 max-w-xl">
              {frames[1].summary}
            </p>
            {/* Real UI Fragment 2: Running stopwatch with slide cadence markers */}
            <div className="border border-ink bg-paper p-5 space-y-4" style={{ borderRadius: "2px" }}>
              <div className="flex items-center justify-between pb-3 border-b border-rule">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-danger animate-none" style={{ borderRadius: "2px" }} />
                  <span className="font-mono text-xs uppercase tracking-wider font-semibold text-ink">
                    Recording Live
                  </span>
                </div>
                <span className="font-mono text-xl font-bold text-ink tabular-numbers">
                  00:32 / 03:00
                </span>
              </div>
              {/* Slide markers along a rule */}
              <div className="space-y-1.5">
                <div className="overflow-x-auto no-scrollbar -mx-1 px-1">
                  <div className="flex justify-between gap-2 min-w-[340px] sm:min-w-0 text-[11px] font-mono text-ink-3">
                    <span>Slide 1 (Title)</span>
                    <span>Slide 2 (Problem)</span>
                    <span className="text-ink font-bold">Slide 3 (SMS Gateway)</span>
                    <span>Slide 4</span>
                    <span>Slide 5</span>
                    <span>Slide 6</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-paper-2 border border-rule relative overflow-hidden" style={{ borderRadius: "2px" }}>
                  <div className="h-full bg-signal w-[38%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Frame 3: 03:00 Time */}
          <div data-run-frame="2" className="py-10">
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-sm font-bold text-ink bg-paper-2 px-2 py-0.5 border border-rule" style={{ borderRadius: "2px" }}>
                03:00
              </span>
              <span className="font-serif text-2xl font-bold text-ink">Time</span>
            </div>
            <p className="text-ink-2 text-base leading-relaxed mb-5 max-w-xl">
              {frames[2].summary}
            </p>
            {/* Real UI Fragment 3: Stopwatch stops, recording ends */}
            <div className="border border-rule bg-paper-2 p-5 flex items-center justify-between" style={{ borderRadius: "2px" }}>
              <div className="flex items-center gap-3.5">
                <Clock className="w-5 h-5 text-ink-3 shrink-0" />
                <div>
                  <div className="font-mono text-sm font-bold text-ink">
                    Mic Locked at 02:47
                  </div>
                  <div className="font-mono text-xs text-ink-3">
                    13 seconds remaining before hard cutoff
                  </div>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-success border border-success/30 px-2 py-1 bg-paper">
                UNDER LIMIT
              </span>
            </div>
          </div>

          {/* Frame 4: 03:05 Questions */}
          <div data-run-frame="3" className="py-10">
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-sm font-bold text-ink bg-paper-2 px-2 py-0.5 border border-rule" style={{ borderRadius: "2px" }}>
                03:05
              </span>
              <span className="font-serif text-2xl font-bold text-ink">Questions</span>
            </div>
            <p className="text-ink-2 text-base leading-relaxed mb-5 max-w-xl">
              {frames[3].summary}
            </p>
            {/* Real UI Fragment 4: Judge follow-up question with 30s countdown */}
            <div className="border border-ink bg-paper p-5 space-y-3" style={{ borderRadius: "2px" }}>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-ink-3 uppercase tracking-wider font-semibold">
                  JUDGE QUESTION 1 OF 3
                </span>
                <span className="font-mono text-sm font-bold text-danger tabular-numbers">
                  0:24 remaining
                </span>
              </div>
              <div className="p-3 bg-paper-2 border border-rule font-serif text-base text-ink italic leading-snug">
                “Who pays for this after the hackathon ends?”
              </div>
            </div>
          </div>

          {/* Frame 5: 05:00 Scoresheet */}
          <div data-run-frame="4" className="py-10 last:pb-0">
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-sm font-bold text-ink bg-paper-2 px-2 py-0.5 border border-rule" style={{ borderRadius: "2px" }}>
                05:00
              </span>
              <span className="font-serif text-2xl font-bold text-ink">Scoresheet</span>
            </div>
            <p className="text-ink-2 text-base leading-relaxed mb-5 max-w-xl">
              {frames[4].summary}
            </p>
            {/* Real UI Fragment 5: Mini scoresheet summary */}
            <div className="border border-rule bg-paper-2 p-5 flex items-center justify-between" style={{ borderRadius: "2px" }}>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-ink-3 block">
                  Run 4 Composite
                </span>
                <span className="font-serif text-2xl font-bold text-ink">
                  {samplePitch.overallScore}
                </span>
              </div>
              <a
                href="#scoresheet"
                className="btn-signal text-xs py-2 px-3.5 font-semibold"
              >
                <span>Inspect Breakdown</span>
                <span className="arrow-nudge text-xs">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
