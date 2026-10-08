"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/data/content";
import { samplePitch } from "@/data/sample";
import { EvaluationResult } from "@/lib/types";
import Scoresheet from "@/components/ui/Scoresheet";
import { Sparkles, ArrowRight, CheckCircle2, AlertTriangle, MessageSquareQuote } from "lucide-react";

export default function ResultsPage() {
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("pitchcoach_latest_run");
      if (stored) {
        const parsed = JSON.parse(stored);
        setEvaluation(parsed);
      }
    } catch (e) {
      console.warn("Could not load stored pitch run:", e);
    }
  }, []);

  const slidePacing = evaluation?.slidePacing || [
    { slide: "Slide 1: Title & Hook", time: "18s", target: "20s", share: 18 / 60 },
    { slide: "Slide 2: Problem in Villages", time: "28s", target: "30s", share: 28 / 60 },
    { slide: "Slide 3: USSD & SMS Gateway", time: "34s", target: "30s", share: 34 / 60 },
    { slide: "Slide 4: Technical Architecture", time: "52s", target: "30s", share: 52 / 60, alert: "Ate 52s (+22s over)" },
    { slide: "Slide 5: Live Demonstration", time: "22s", target: "40s", share: 22 / 60 },
    { slide: "Slide 6: Team & Open Source", time: "13s", target: "30s", share: 13 / 60 },
  ];

  const deckTitle = evaluation ? evaluation.deckName : samplePitch.name;
  const recordedDuration = evaluation
    ? `${Math.floor(evaluation.totalDurationSec / 60)
        .toString()
        .padStart(2, "0")}:${(evaluation.totalDurationSec % 60)
        .toString()
        .padStart(2, "0")}`
    : samplePitch.recordedTime;
  const targetDuration = evaluation
    ? `${Math.floor(evaluation.targetDurationSec / 60)
        .toString()
        .padStart(2, "0")}:${(evaluation.targetDurationSec % 60)
        .toString()
        .padStart(2, "0")}`
    : samplePitch.timeLimit;

  return (
    <div className="bg-paper text-ink min-h-screen pt-20 pb-16 px-5 sm:px-8">
      <div className="max-w-[1100px] mx-auto space-y-10">
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-4 border-b border-rule">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-ink-3 mb-1">
              <Link href="/" className="hover:text-ink">
                {siteConfig.name}
              </Link>
              <span>/</span>
              <span className="text-ink font-semibold">Scoresheet Report</span>
              {evaluation?.aiProvider === "gemini" && (
                <span className="ml-2 inline-flex items-center gap-1 bg-signal/10 border border-signal/30 text-signal font-mono text-[10px] px-2 py-0.5 rounded-xs uppercase">
                  <Sparkles className="w-3 h-3" />
                  Gemini AI Audited
                </span>
              )}
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink">
              {deckTitle} • {evaluation ? evaluation.status : samplePitch.runLabel}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link href="/practice" className="btn-signal text-xs py-2 px-3.5 font-semibold min-h-[44px]">
              <span>Run Next Practice Round</span>
              <span className="arrow-nudge text-xs">→</span>
            </Link>

            <Link href="/dashboard" className="link-underline text-xs font-mono uppercase tracking-wider text-ink min-h-[44px] inline-flex items-center">
              View Run History
            </Link>
          </div>
        </header>

        {/* Section 1: Full Scoresheet Table */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <span className="text-xs uppercase font-mono tracking-widest text-ink-3 font-semibold">
              OFFICIAL RUBRIC EVALUATION
            </span>
            <span className="font-mono text-xs text-ink-3">
              Recorded at {recordedDuration} / Limit {targetDuration}
            </span>
          </div>

          <Scoresheet variant="full" evaluation={evaluation} />
        </div>

        {/* Section 2: Pacing & Slide Cadence Audit */}
        <div className="space-y-6 pt-4 border-t border-rule">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-ink-3 font-semibold block mb-1">
                SLIDE CADENCE AUDIT
              </span>
              <h2 className="font-serif text-2xl font-bold text-ink">
                Per-slide delivery time vs. target share
              </h2>
            </div>
            <span className="font-mono text-xs text-ink-3 hidden sm:inline">
              Total: {recordedDuration}
            </span>
          </div>

          <div className="border border-rule bg-paper divide-y divide-rule" style={{ borderRadius: "2px" }}>
            {slidePacing.map((row) => (
              <div key={row.slide} className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-5 font-serif text-base font-medium text-ink">
                  {row.slide}
                </div>

                <div className="md:col-span-4 space-y-1">
                  <div className="h-2 w-full bg-paper-2 border border-rule relative overflow-hidden" style={{ borderRadius: "2px" }}>
                    <div
                      className={`h-full ${row.alert ? "bg-danger" : "bg-signal"}`}
                      style={{ width: `${Math.min((row.share || 0.1) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between font-mono text-[11px] text-ink-3">
                    <span>Target: {row.target}</span>
                    <span className="font-bold text-ink tabular-numbers">{row.time}</span>
                  </div>
                </div>

                <div className="md:col-span-3 text-right">
                  {row.alert ? (
                    <span className="font-mono text-xs text-danger font-semibold bg-danger/10 border border-danger/30 px-2 py-0.5" style={{ borderRadius: "2px" }}>
                      {row.alert}
                    </span>
                  ) : (
                    <span className="font-mono text-xs text-success font-semibold">
                      Balanced pacing
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Speech Telemetry & Filler Words */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-rule">
          {/* Vocal Pace & Filler Words */}
          <div className="border border-rule bg-paper p-5 sm:p-6 space-y-4" style={{ borderRadius: "2px" }}>
            <span className="text-xs uppercase font-mono tracking-widest text-ink-3 font-semibold block">
              SPEECH TELEMETRY & CADENCE
            </span>
            <div className="flex items-center justify-between pb-3 border-b border-rule">
              <div>
                <div className="font-mono text-3xl font-bold text-ink">
                  {evaluation?.wpm ? `${evaluation.wpm} WPM` : "142 WPM"}
                </div>
                <div className="text-xs font-mono text-ink-3">
                  Speaking Velocity (Optimal: 130–150 WPM)
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-mono uppercase font-semibold ${
                (evaluation?.wpm || 142) >= 120 && (evaluation?.wpm || 142) <= 160
                  ? "bg-success/10 text-success border border-success/30"
                  : "bg-danger/10 text-danger border border-danger/30"
              }`} style={{ borderRadius: "2px" }}>
                {(evaluation?.wpm || 142) >= 120 && (evaluation?.wpm || 142) <= 160 ? "Optimal Pace" : "Pacing Warning"}
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-ink-3 block">Detected Filler Words</span>
              <div className="flex flex-wrap gap-2">
                {(evaluation?.fillerWords && evaluation.fillerWords.length > 0
                  ? evaluation.fillerWords
                  : [
                      { word: "um", count: 2 },
                      { word: "like", count: 3 },
                      { word: "basically", count: 1 },
                    ]
                ).map((fw) => (
                  <div
                    key={fw.word}
                    className="flex items-center gap-2 px-3 py-1.5 border border-rule bg-paper-2 font-mono text-xs"
                    style={{ borderRadius: "2px" }}
                  >
                    <span className="text-ink font-semibold">"{fw.word}"</span>
                    <span className="bg-danger/10 text-danger font-bold px-1.5 py-0.5">
                      {fw.count}x
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Judges Key Critique */}
          <div className="border border-rule bg-paper p-5 sm:p-6 space-y-4" style={{ borderRadius: "2px" }}>
            <span className="text-xs uppercase font-mono tracking-widest text-ink-3 font-semibold block">
              JUDGING PANEL HIGHLIGHTS & CRITIQUE
            </span>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <span className="text-xs font-mono uppercase text-success font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> What impressed the judges:
                </span>
                <ul className="space-y-1 text-xs text-ink-2 font-mono pl-4 list-disc">
                  {(evaluation?.strengths || [
                    "Direct problem framing in the opening 20 seconds",
                    "Strong architectural clarity on data flow",
                    "Crisp live demo transition with clear user outcome",
                  ]).map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-rule space-y-1.5">
                <span className="text-xs font-mono uppercase text-danger font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> What needs immediate work:
                </span>
                <ul className="space-y-1 text-xs text-ink-2 font-mono pl-4 list-disc">
                  {(evaluation?.improvements || [
                    "Tighten Slide 4 technical details to avoid 20s overtime",
                    "Prepare a 15-second answer on moat vs foundation models",
                    "Ground your metric claims with a verifiable source",
                  ]).map((imp, idx) => (
                    <li key={idx}>{imp}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Cross-Examination Judge Q&A */}
        {evaluation?.judgeQuestions && evaluation.judgeQuestions.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-rule">
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-ink-3 font-semibold block mb-1">
                DEFENSE SIMULATION
              </span>
              <h2 className="font-serif text-2xl font-bold text-ink">
                Ruthless cross-examination questions to rehearse
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {evaluation.judgeQuestions.map((qa, idx) => (
                <div
                  key={idx}
                  className="border border-rule bg-paper p-5 space-y-3 flex flex-col justify-between"
                  style={{ borderRadius: "2px" }}
                >
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono text-signal uppercase font-bold tracking-wider">
                      {qa.judge}
                    </span>
                    <p className="font-serif text-sm font-semibold text-ink leading-snug">
                      "{qa.question}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-rule bg-paper-2 -mx-5 -mb-5 p-4 text-xs font-mono text-ink-2">
                    <span className="font-bold text-ink block mb-1">Recommended Rebuttal:</span>
                    {qa.suggestedAnswer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
