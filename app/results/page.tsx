"use client";

import Link from "next/link";
import { mockRubricScores, mockSlides, mockFillerWords } from "@/data/mock";
import { siteConfig } from "@/data/content";
import ScoreRing from "@/components/ui/ScoreRing";
import RadarChart from "@/components/ui/RadarChart";
import Counter from "@/components/ui/Counter";
import Badge from "@/components/ui/Badge";
import MagneticButton from "@/components/ui/MagneticButton";
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Download,
  Share2,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowRight,
  Flame,
} from "lucide-react";

export default function ResultsPage() {
  const axes = mockRubricScores.axes;

  return (
    <div className="min-h-screen bg-[#07070B] text-[#F5F5FA] py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Link href="/" className="text-xs font-mono-accent text-[#9A9AB0] hover:text-white">
                {siteConfig.name}
              </Link>
              <span className="text-xs text-[#9A9AB0]">/</span>
              <span className="text-xs font-mono-accent text-[#7C5CFF]">Rehearsal Evaluation</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-heading">
              Pitch Performance Breakdown
            </h1>
            <p className="text-xs sm:text-sm text-[#9A9AB0] mt-1 font-mono-accent">
              Session: ETHGlobal Istanbul Rehearsal Run 05 • Recorded Today
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/practice">
              <MagneticButton variant="primary" size="md" className="text-xs font-bold">
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                <span>Practice Again</span>
              </MagneticButton>
            </Link>

            <Link href="/dashboard">
              <button className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono-accent text-white transition-colors">
                View Progression →
              </button>
            </Link>
          </div>
        </div>

        {/* Overall Score Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 rounded-3xl bg-[#0E0E16]/90 border border-white/15 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[400px] h-[300px] bg-gradient-to-r from-[#7C5CFF]/20 via-[#FF4D9D]/20 to-transparent blur-3xl pointer-events-none" />

          {/* Left Score Ring (4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center text-center">
            <ScoreRing score={mockRubricScores.overall} size={170} strokeWidth={12} />
            <div className="mt-3">
              <span className="text-xs font-mono-accent text-[#3DDC97] bg-[#3DDC97]/15 px-3 py-1 rounded-full border border-[#3DDC97]/30">
                Top 4% Winning Caliber
              </span>
            </div>
          </div>

          {/* Center Summary (8 cols) */}
          <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono-accent text-[#7C5CFF] uppercase font-bold tracking-wider mb-2">
                <Flame className="w-4 h-4 text-[#FF4D9D]" />
                <span>Sunday Stage Readiness Verified</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-heading">
                Outstanding technical clarity with tight time discipline.
              </h2>
              <p className="text-xs sm:text-sm text-[#9A9AB0] mt-2 leading-relaxed">
                You stayed under the 4-minute ceiling (03:48 total), answered the Principal Architect's edge-case interrogation without stumbling, and articulated the WebAudio architecture crisply.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 text-xs font-mono-accent">
              <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                <span className="text-[#9A9AB0] text-[10px] block">TOTAL DURATION</span>
                <span className="text-base font-bold text-white">03:48</span>
              </div>
              <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                <span className="text-[#9A9AB0] text-[10px] block">SPEECH CADENCE</span>
                <span className="text-base font-bold text-[#3DDC97]">142 WPM</span>
              </div>
              <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                <span className="text-[#9A9AB0] text-[10px] block">HESITATIONS</span>
                <span className="text-base font-bold text-[#FFB547]">3 flagged</span>
              </div>
              <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                <span className="text-[#9A9AB0] text-[10px] block">JUDGE RATING</span>
                <span className="text-base font-bold text-[#7C5CFF]">9.2 / 10</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Rubric Radar + Per-Slide Timing Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Radar Chart (6 cols) */}
          <div className="lg:col-span-6 p-7 rounded-3xl bg-[#0E0E16] border border-white/10 flex flex-col items-center justify-between shadow-xl">
            <div className="w-full flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white font-heading">
                5-Axis Hackathon Rubric
              </h3>
              <span className="text-xs font-mono-accent text-[#9A9AB0]">Standard MLH Radar</span>
            </div>

            <RadarChart axes={axes} size={320} showLabels={true} />

            <div className="w-full mt-6 grid grid-cols-5 gap-1.5 text-center text-[10px] font-mono-accent">
              {axes.map((a) => (
                <div key={a.key} className="bg-white/5 p-2 rounded-xl">
                  <div className="text-[#9A9AB0] truncate">{a.label.split(" ")[0]}</div>
                  <div className="text-white font-bold mt-0.5">{a.score}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Per-Slide Timing Bar Chart (6 cols) */}
          <div className="lg:col-span-6 p-7 rounded-3xl bg-[#0E0E16] border border-white/10 flex flex-col justify-between shadow-xl">
            <div className="w-full flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#7C5CFF]" />
                <span>Per-Slide Timing Allocation</span>
              </h3>
              <span className="text-xs font-mono-accent text-[#3DDC97]">Target vs Actual</span>
            </div>

            <div className="space-y-4 my-auto">
              {mockSlides.map((s, i) => {
                const isOver = s.actualTime > s.allocatedTime;
                return (
                  <div key={s.id} className="text-xs font-mono-accent">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[#F5F5FA] font-medium">
                        Slide {i + 1}: {s.title.split(":")[0]}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[#9A9AB0]">Target: {s.allocatedTime}s</span>
                        <span className={`font-bold ${isOver ? "text-[#FFB547]" : "text-[#3DDC97]"}`}>
                          {s.actualTime}s
                        </span>
                      </div>
                    </div>
                    {/* Visual Comparison Bar */}
                    <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-gradient-to-r from-[#7C5CFF] to-[#3DDC97] rounded-full"
                        style={{ width: `${Math.min(100, (s.actualTime / 80) * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-between text-xs font-mono-accent text-[#9A9AB0]">
              <span>Optimal Timing Variance: ±4%</span>
              <span className="text-[#3DDC97]">Zero Critical Drift</span>
            </div>
          </div>
        </div>

        {/* Section 3: Filler Words + Strengths / Improvements */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Filler Word List (5 cols) */}
          <div className="lg:col-span-5 p-7 rounded-3xl bg-[#0E0E16] border border-white/10 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white font-heading">
                  Filler Word Telemetry
                </h3>
                <span className="text-xs font-mono-accent text-[#FF5C6C]">3 Occurrences</span>
              </div>
              <p className="text-xs text-[#9A9AB0] mb-5">
                Timestamped occurrences caught during speech recognition:
              </p>

              <div className="space-y-3">
                {mockFillerWords.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 text-xs font-mono-accent"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[#FF5C6C] font-bold">"{item.word}"</span>
                      <span className="text-[#9A9AB0]">({item.count}x)</span>
                    </div>
                    <span className="text-[11px] text-[#9A9AB0] bg-white/5 px-2 py-0.5 rounded">
                      {item.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 text-xs text-[#3DDC97] font-mono-accent">
              💡 Tip: Pause for 1 second instead of saying "basically".
            </div>
          </div>

          {/* Strengths & Actionable Improvements (7 cols) */}
          <div className="lg:col-span-7 p-7 rounded-3xl bg-[#0E0E16] border border-white/10 shadow-xl space-y-6">
            <h3 className="text-base font-bold text-white font-heading">
              Executive Judge Assessment
            </h3>

            {/* Strengths */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono-accent text-[#3DDC97] font-bold uppercase mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirmed Strengths</span>
              </div>
              <ul className="space-y-2 text-xs text-[#F5F5FA]">
                {mockRubricScores.strengths.map((s, idx) => (
                  <li key={idx} className="p-3 rounded-xl bg-[#3DDC97]/10 border border-[#3DDC97]/20 flex items-start gap-2.5">
                    <span className="text-[#3DDC97] font-bold">✓</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono-accent text-[#FFB547] font-bold uppercase mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Sunday Polish Checklist</span>
              </div>
              <ul className="space-y-2 text-xs text-[#F5F5FA]">
                {mockRubricScores.improvements.map((imp, idx) => (
                  <li key={idx} className="p-3 rounded-xl bg-[#FFB547]/10 border border-[#FFB547]/20 flex items-start gap-2.5">
                    <span className="text-[#FFB547] font-bold">!</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
