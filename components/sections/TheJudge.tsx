"use client";

import { useState } from "react";
import { siteConfig } from "@/data/content";
import { samplePitch, JudgeQA } from "@/data/sample";
import { motion, AnimatePresence } from "framer-motion";

type Difficulty = "Friendly" | "Fair" | "Brutal";

export default function TheJudge() {
  const [difficulty, setDifficulty] = useState<Difficulty>("Fair");

  const currentQA: JudgeQA[] = samplePitch.judgeQuestions[difficulty];

  return (
    // Section 5.4: The ONE inverted section (ink background, paper text, full-bleed)
    <section
      id="judge"
      className="relative section-rhythm px-5 sm:px-8 lg:px-12 bg-ink text-paper border-b border-rule-strong"
    >
      <div className="max-w-[1200px] mx-auto pb-16 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Columns 1-5 */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <span className="text-xs uppercase font-mono tracking-[0.08em] text-on-ink-muted mb-3 font-semibold block">
              {siteConfig.sectionJudge.label}
            </span>
            <h2 className="font-serif text-[clamp(2rem,3.8vw,3.25rem)] font-bold text-paper leading-[1.05] mb-5">
              {siteConfig.sectionJudge.h2}
            </h2>
            <p className="text-on-ink-muted text-base leading-relaxed mb-8 max-w-md">
              {siteConfig.sectionJudge.body}
            </p>

            {/* Segmented control: Friendly / Fair / Brutal (rounded-full allowed only here) */}
            <div className="flex items-center p-1 bg-paper/10 border border-paper/20 rounded-full select-none">
              {(["Friendly", "Fair", "Brutal"] as Difficulty[]).map((level) => {
                const isActive = difficulty === level;
                return (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`min-h-[44px] inline-flex items-center justify-center px-3.5 sm:px-4 py-2 text-xs font-mono uppercase tracking-wider font-semibold rounded-full transition-all duration-200 ${
                      isActive
                        ? "bg-signal text-on-signal font-bold shadow-sm"
                        : "text-on-ink-muted hover:text-paper"
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 text-[11px] font-mono text-on-ink-muted">
              Mode: <span className="text-paper font-semibold">{difficulty}</span> • Real-time follow-ups
            </div>
          </div>

          {/* Right Columns 7-12: The Transcript */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="border border-paper/15 p-6 sm:p-8 bg-paper/[0.03]" style={{ borderRadius: "2px" }}>
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-paper/15 mb-6 text-xs font-mono">
                <span className="text-on-ink-muted uppercase tracking-wider">
                  SAMPLE Q&A TRANSCRIPT
                </span>
                <span className="text-signal font-bold tabular-numbers">
                  LIMIT: 0:30 PER ANSWER
                </span>
              </div>

              {/* Crossfade QA items */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={difficulty}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {currentQA.map((qa, index) => (
                    <div
                      key={qa.question}
                      className="border-b border-paper/10 pb-6 last:border-b-0 last:pb-0 space-y-3"
                    >
                      {/* Judge Question */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-signal font-semibold">
                            Judge Question 0{index + 1}
                          </span>
                          <p className="font-serif text-lg sm:text-xl font-medium text-paper leading-snug">
                            “{qa.question}”
                          </p>
                        </div>
                        {index === 0 && (
                          <span className="font-mono text-xs font-bold text-danger bg-danger/10 border border-danger/30 px-2 py-0.5 shrink-0 tabular-numbers" style={{ borderRadius: "2px" }}>
                            0:24
                          </span>
                        )}
                      </div>

                      {/* Team Sample Answer */}
                      <div className="pl-4 border-l border-paper/20">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-on-ink-muted block mb-1">
                          Team Response (Transcribed)
                        </span>
                        <p className="text-sm sm:text-[15px] text-on-ink-muted leading-relaxed font-sans">
                          {qa.answer}
                        </p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
