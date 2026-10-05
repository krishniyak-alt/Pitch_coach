"use client";

import Link from "next/link";
import { mockDashboardAttempts } from "@/data/mock";
import { siteConfig } from "@/data/content";
import { formatTime } from "@/lib/utils";
import MagneticButton from "@/components/ui/MagneticButton";
import Badge from "@/components/ui/Badge";
import {
  TrendingUp,
  Clock,
  Award,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
} from "lucide-react";

export default function DashboardPage() {
  const attempts = mockDashboardAttempts;

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
              <span className="text-xs font-mono-accent text-[#3DDC97]">Team Rehearsal Progression</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-heading">
              Pitch Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-[#9A9AB0] mt-1 font-mono-accent">
              Tracking ETHGlobal Istanbul 2024 Finalist Preparation
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/practice">
              <MagneticButton variant="primary" size="md" className="text-xs font-bold">
                <span>Start New Rehearsal</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </MagneticButton>
            </Link>
          </div>
        </div>

        {/* 4 Stat Overview Bento Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-3xl bg-[#0E0E16] border border-white/10 shadow-lg">
            <div className="flex items-center justify-between text-xs font-mono-accent text-[#9A9AB0] mb-2">
              <span>CURRENT SCORE</span>
              <span className="text-[#3DDC97] bg-[#3DDC97]/15 px-2 py-0.5 rounded-full font-bold">+28 pts</span>
            </div>
            <div className="text-3xl font-extrabold font-mono-accent text-white">92 / 100</div>
            <p className="text-[11px] text-[#9A9AB0] mt-1">Winning Caliber (Top 3%)</p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0E0E16] border border-white/10 shadow-lg">
            <div className="flex items-center justify-between text-xs font-mono-accent text-[#9A9AB0] mb-2">
              <span>TOTAL REHEARSALS</span>
              <span className="text-white bg-white/10 px-2 py-0.5 rounded-full font-bold">5 Runs</span>
            </div>
            <div className="text-3xl font-extrabold font-mono-accent text-white">2.4 hrs</div>
            <p className="text-[11px] text-[#9A9AB0] mt-1">Across 3 team speakers</p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0E0E16] border border-white/10 shadow-lg">
            <div className="flex items-center justify-between text-xs font-mono-accent text-[#9A9AB0] mb-2">
              <span>TIMING VARIANCE</span>
              <span className="text-[#3DDC97] bg-[#3DDC97]/15 px-2 py-0.5 rounded-full font-bold">On Target</span>
            </div>
            <div className="text-3xl font-extrabold font-mono-accent text-[#3DDC97]">03:48</div>
            <p className="text-[11px] text-[#9A9AB0] mt-1">Target: 04:00 (12s buffer)</p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0E0E16] border border-white/10 shadow-lg">
            <div className="flex items-center justify-between text-xs font-mono-accent text-[#9A9AB0] mb-2">
              <span>HESITATIONS</span>
              <span className="text-[#3DDC97] bg-[#3DDC97]/15 px-2 py-0.5 rounded-full font-bold">-81%</span>
            </div>
            <div className="text-3xl font-extrabold font-mono-accent text-[#FFB547]">3 words</div>
            <p className="text-[11px] text-[#9A9AB0] mt-1">Down from 16 in run 01</p>
          </div>
        </div>

        {/* Improvement Line Chart Card */}
        <div className="p-8 rounded-3xl bg-[#0E0E16] border border-white/10 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-white font-heading">
                Rubric Score Trajectory
              </h2>
              <p className="text-xs text-[#9A9AB0] font-mono-accent">
                Improvement from initial rough draft (Run 01) to Sunday polish (Run 05)
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono-accent">
              <span className="flex items-center gap-1.5 text-[#3DDC97]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3DDC97]" /> Composite Score
              </span>
              <span className="flex items-center gap-1.5 text-[#7C5CFF]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7C5CFF]" /> Target Threshold (85)
              </span>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="relative h-48 w-full pt-4">
            <svg width="100%" height="100%" viewBox="0 0 600 150" preserveAspectRatio="none" className="overflow-visible">
              <defs>
                <linearGradient id="scoreAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3DDC97" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3DDC97" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Target 85 line */}
              <line x1="0" y1="50" x2="600" y2="50" stroke="rgba(124, 92, 255, 0.4)" strokeDasharray="4 4" strokeWidth="1.5" />

              {/* Area fill */}
              <path
                d="M 50,120 L 175,95 L 300,75 L 425,50 L 550,25 L 550,150 L 50,150 Z"
                fill="url(#scoreAreaGradient)"
              />

              {/* Score trajectory stroke */}
              <path
                d="M 50,120 L 175,95 L 300,75 L 425,50 L 550,25"
                fill="none"
                stroke="#3DDC97"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Nodes */}
              {[
                { x: 50, y: 120, label: "Run 1: 64" },
                { x: 175, y: 95, label: "Run 2: 72" },
                { x: 300, y: 75, label: "Run 3: 79" },
                { x: 425, y: 50, label: "Run 4: 86" },
                { x: 550, y: 25, label: "Run 5: 92" },
              ].map((pt, idx) => (
                <g key={idx}>
                  <circle cx={pt.x} cy={pt.y} r="5" fill="#0E0E16" stroke="#3DDC97" strokeWidth="3" />
                  <text
                    x={pt.x}
                    y={pt.y - 12}
                    textAnchor="middle"
                    className="fill-white text-[10px] font-mono-accent font-bold"
                  >
                    {pt.label.split(":")[1]}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Past Attempts Table */}
        <div className="p-8 rounded-3xl bg-[#0E0E16] border border-white/10 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white font-heading">
              Past Rehearsal Runs
            </h2>
            <span className="text-xs font-mono-accent text-[#9A9AB0]">5 recorded sessions</span>
          </div>

          <div className="divide-y divide-white/5">
            {attempts.map((attempt) => (
              <div
                key={attempt.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] px-2 rounded-2xl transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white text-base font-mono-accent">
                    {attempt.overallScore}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
                      <span>{attempt.title}</span>
                      <span
                        className={`text-[10px] font-mono-accent px-2 py-0.5 rounded-full border ${
                          attempt.status === "Winning Caliber"
                            ? "bg-[#3DDC97]/15 text-[#3DDC97] border-[#3DDC97]/30"
                            : attempt.status === "Solid Contender"
                            ? "bg-[#FFB547]/15 text-[#FFB547] border-[#FFB547]/30"
                            : "bg-[#FF5C6C]/15 text-[#FF5C6C] border-[#FF5C6C]/30"
                        }`}
                      >
                        {attempt.status}
                      </span>
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-[#9A9AB0] font-mono-accent mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {attempt.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {formatTime(attempt.totalTime)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-2 text-xs font-mono-accent text-[#9A9AB0]">
                    <span>Tech: {attempt.rubric.techDepth}</span>
                    <span>•</span>
                    <span>Demo: {attempt.rubric.demo}</span>
                  </div>

                  <Link href="/results">
                    <button className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono-accent text-white flex items-center gap-1 transition-colors">
                      <span>Full Rubric</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
