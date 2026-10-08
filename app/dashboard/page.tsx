"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/data/content";
import { samplePitch } from "@/data/sample";
import { fetchRehearsalHistory } from "@/lib/api-client";

interface DashboardRun {
  run: string;
  date: string;
  duration: string;
  target: string;
  score: string;
  note: string;
  status: string;
}

export default function DashboardPage() {
  const defaultRuns: DashboardRun[] = [
    {
      run: "Run 4",
      date: "Today, 14:20",
      duration: "02:47",
      target: "03:00",
      score: "6.6 / 10",
      note: "Slide 4 had nine numbers; lost judge engagement. Demo worked.",
      status: "Under limit",
    },
    {
      run: "Run 3",
      date: "Today, 11:45",
      duration: "02:58",
      target: "03:00",
      score: "6.2 / 10",
      note: "Good pacing; hesitated on monetization follow-up.",
      status: "Under limit",
    },
    {
      run: "Run 2",
      date: "Yesterday, 22:10",
      duration: "03:15",
      target: "03:00",
      score: "5.8 / 10",
      note: "15s overtime. Cut technical architecture fluff.",
      status: "Overtime (+15s)",
    },
    {
      run: "Run 1",
      date: "Yesterday, 19:30",
      duration: "03:42",
      target: "03:00",
      score: "5.1 / 10",
      note: "42s overtime. Slide 4 ate 75s alone.",
      status: "Overtime (+42s)",
    },
  ];

  const [pastRuns, setPastRuns] = useState<DashboardRun[]>(defaultRuns);

  useEffect(() => {
    async function loadHistory() {
      // 1. Try loading from Django backend (MySQL)
      const backendRuns = await fetchRehearsalHistory();
      if (backendRuns && Array.isArray(backendRuns) && backendRuns.length > 0) {
        setPastRuns(backendRuns);
        return;
      }

      // 2. Fallback to localStorage
      try {
        const stored = localStorage.getItem("pitchcoach_run_history");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPastRuns([...parsed, ...defaultRuns]);
          }
        }
      } catch {}
    }
    loadHistory();
  }, []);

  return (
    <div className="bg-paper text-ink min-h-screen pt-20 pb-16 px-5 sm:px-8">
      <div className="max-w-[1100px] mx-auto space-y-8">
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-4 border-b border-rule">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-ink-3 mb-1">
              <Link href="/" className="hover:text-ink">
                {siteConfig.name}
              </Link>
              <span>/</span>
              <span className="text-ink font-semibold">Run History</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink">
              Pitch Rehearsal History
            </h1>
          </div>

          <Link href="/practice" className="btn-signal text-xs py-2 px-3.5 font-semibold min-h-[44px]">
            <span>Run New Practice Round</span>
            <span className="arrow-nudge text-xs">→</span>
          </Link>
        </header>

        {/* Progression Summary */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 py-2 border-b border-rule font-mono text-xs text-ink-3">
          <span>PROGRESSION AUDIT</span>
          <span className="text-ink font-bold">{pastRuns.length} recorded practice runs</span>
        </div>

        {/* Mobile scroll hint */}
        <div className="md:hidden text-xs font-mono text-ink-3 pb-1 flex items-center justify-end gap-1 select-none">
          <span>Swipe horizontally to view run history</span>
          <span className="text-signal">→</span>
        </div>

        {/* Plain Table of Past Runs */}
        <div className="border border-rule bg-paper overflow-x-auto overscroll-x-contain" style={{ borderRadius: "2px" }}>
          <table className="w-full min-w-[640px] text-left border-collapse">
            <thead>
              <tr className="border-b border-rule bg-paper-2 text-[12px] font-mono uppercase tracking-widest text-ink-3">
                <th className="py-3 px-4 font-semibold">Run</th>
                <th className="py-3 px-4 font-semibold">Recorded</th>
                <th className="py-3 px-4 font-semibold">Timing</th>
                <th className="py-3 px-4 font-semibold">Score</th>
                <th className="py-3 px-4 font-semibold">Notes & Fixes</th>
                <th className="py-3 px-4 font-semibold text-right">Scoresheet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule font-sans">
              {pastRuns.map((r, i) => (
                <tr key={`${r.run}-${i}`} className="hover:bg-paper-2 transition-colors">
                  <td className="py-4 px-4 font-serif font-bold text-lg text-ink">
                    {r.run}
                    {i === 0 && (
                      <span className="ml-2 font-mono text-[10px] text-signal font-bold uppercase">
                        (Latest)
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 font-mono text-xs text-ink-3">
                    {r.date}
                  </td>
                  <td className="py-4 px-4 font-mono text-sm text-ink tabular-numbers">
                    <div>{r.duration} / {r.target}</div>
                    <div className={`text-xs ${r.status?.startsWith("Overtime") ? "text-danger" : "text-success"}`}>
                      {r.status}
                    </div>
                  </td>
                  <td className="py-4 px-4 font-serif font-bold text-xl text-ink tabular-numbers">
                    {r.score}
                  </td>
                  <td className="py-4 px-4 text-sm text-ink-2 max-w-xs">
                    {r.note}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Link
                      href="/results"
                      className="link-underline text-xs font-mono uppercase tracking-wider text-ink font-semibold min-h-[44px] inline-flex items-center"
                    >
                      View Report →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
