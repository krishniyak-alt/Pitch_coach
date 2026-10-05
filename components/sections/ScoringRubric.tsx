"use client";

import { motion } from "framer-motion";
import { mockRubricScores } from "@/data/mock";
import RadarChart from "@/components/ui/RadarChart";
import ScoreRing from "@/components/ui/ScoreRing";
import Counter from "@/components/ui/Counter";
import Badge from "@/components/ui/Badge";
import { Award, CheckCircle2, AlertCircle, Sparkles, TrendingUp } from "lucide-react";

export default function ScoringRubric() {
  const axes = mockRubricScores.axes;

  return (
    <section id="scoring" className="relative py-28 sm:py-36 px-4 sm:px-6 md:px-8 bg-[#07070B] overflow-hidden border-t border-white/[0.06]">
      {/* Background stage light blobs */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[600px] bg-[#7C5CFF]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF4D9D]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <Badge variant="violet" className="mb-4">
            <Award className="w-3.5 h-3.5 text-[#7C5CFF]" />
            <span>Official Rubric Scoring</span>
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-heading">
            Scored like Sunday afternoon grand judging
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#9A9AB0] max-w-xl mx-auto">
            No subjective hand-waving. Five explicit evaluation vectors, calibrated against winning criteria from premier global hackathons.
          </p>
        </div>

        {/* Main Grid: Left Radar Chart & Center Score Ring + Right Horizontal Bars & Feedback */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Radar Chart + Center Score Ring (6 cols) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl bg-[#0E0E16]/80 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.7)] relative overflow-hidden">
            {/* Top score header badge */}
            <div className="w-full flex items-center justify-between mb-4">
              <span className="text-xs font-mono-accent text-[#9A9AB0] uppercase tracking-wider">
                Multi-Axis Evaluation
              </span>
              <span className="text-xs font-mono-accent text-[#3DDC97] bg-[#3DDC97]/15 px-2.5 py-0.5 rounded-full border border-[#3DDC97]/30 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +18 vs Run 1
              </span>
            </div>

            {/* Radar Chart Display */}
            <div className="py-4">
              <RadarChart axes={axes} size={340} showLabels={true} />
            </div>

            {/* Overall Score Radial Ring Badge Overlay */}
            <div className="mt-6 pt-6 border-t border-white/10 w-full flex items-center justify-around">
              <ScoreRing score={mockRubricScores.overall} size={110} strokeWidth={8} label="Total Score" />
              <div className="space-y-1">
                <div className="text-sm font-bold text-white font-heading">
                  92nd Percentile Caliber
                </div>
                <div className="text-xs text-[#9A9AB0] font-mono-accent">
                  Projected Placement: <span className="text-[#3DDC97] font-bold">1st / 2nd Place</span>
                </div>
                <div className="text-[11px] text-[#9A9AB0] font-mono-accent">
                  Confidence Interval: 94.2%
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 5 Score Progress Bars + Judge Strengths & Improvements (6 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            {/* 5 Horizontal Score Bars Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#0E0E16]/80 backdrop-blur-xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
              <h3 className="text-base font-bold text-white font-heading mb-4 flex items-center justify-between">
                <span>Vector Breakdown</span>
                <span className="text-xs font-mono-accent text-[#9A9AB0]">Standard MLH Weights</span>
              </h3>

              <div className="space-y-4">
                {axes.map((axis, i) => (
                  <div key={axis.key}>
                    <div className="flex items-center justify-between text-xs font-mono-accent mb-1.5">
                      <span className="text-[#F5F5FA] font-medium">{axis.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[#9A9AB0]">Target: {axis.target}</span>
                        <span className="text-white font-bold">
                          <Counter value={axis.score} decimals={1} duration={1.8} /> / 10
                        </span>
                      </div>
                    </div>
                    {/* Animated Progress Bar */}
                    <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden p-0.5">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-[#7C5CFF] via-[#FF4D9D] to-[#FFB547]"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(axis.score / 10) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths & Improvements Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#151521]/80 backdrop-blur-xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Strengths */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-mono-accent text-[#3DDC97] uppercase font-bold tracking-wider mb-2.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Key Strengths</span>
                  </div>
                  <ul className="space-y-2 text-xs text-[#F5F5FA]">
                    {mockRubricScores.strengths.slice(0, 2).map((s, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-[#3DDC97]/10 p-2.5 rounded-xl border border-[#3DDC97]/20">
                        <span className="text-[#3DDC97] font-bold">✓</span>
                        <span className="leading-snug">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-mono-accent text-[#FFB547] uppercase font-bold tracking-wider mb-2.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Sunday Polish Areas</span>
                  </div>
                  <ul className="space-y-2 text-xs text-[#F5F5FA]">
                    {mockRubricScores.improvements.slice(0, 2).map((imp, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-[#FFB547]/10 p-2.5 rounded-xl border border-[#FFB547]/20">
                        <span className="text-[#FFB547] font-bold">!</span>
                        <span className="leading-snug">{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
