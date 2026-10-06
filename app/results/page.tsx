"use client";

import Link from "next/link";
import { siteConfig } from "@/data/content";
import { samplePitch } from "@/data/sample";
import Scoresheet from "@/components/ui/Scoresheet";

export default function ResultsPage() {
  const slidePacing = [
    { slide: "Slide 1: Title & Hook", time: "18s", target: "20s", share: 18 / 60 },
    { slide: "Slide 2: Problem in Villages", time: "28s", target: "30s", share: 28 / 60 },
    { slide: "Slide 3: USSD & SMS Gateway", time: "34s", target: "30s", share: 34 / 60 },
    { slide: "Slide 4: Technical Architecture", time: "52s", target: "30s", share: 52 / 60, alert: "Ate 52s (+22s over)" },
    { slide: "Slide 5: Live Demonstration", time: "22s", target: "40s", share: 22 / 60 },
    { slide: "Slide 6: Team & Open Source", time: "13s", target: "30s", share: 13 / 60 },
  ];

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
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink">
              {samplePitch.name} • {samplePitch.runLabel}
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
              Recorded at {samplePitch.recordedTime} / Limit {samplePitch.timeLimit}
            </span>
          </div>

          <Scoresheet variant="full" />
        </div>

        {/* Section 2: Per-slide time as horizontal bars on hairline tracks */}
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
              Total: {samplePitch.recordedTime}
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
                      style={{ width: `${Math.min(row.share * 100, 100)}%` }}
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
      </div>
    </div>
  );
}
