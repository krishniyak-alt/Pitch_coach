"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { mockSlides, mockJudgeQuestions, mockFillerWords } from "@/data/mock";
import { siteConfig } from "@/data/content";
import { formatTime } from "@/lib/utils";
import Waveform from "@/components/ui/Waveform";
import MagneticButton from "@/components/ui/MagneticButton";
import Badge from "@/components/ui/Badge";
import {
  UploadCloud,
  FileText,
  Mic,
  MicOff,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Bot,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Clock,
  AlertTriangle,
  Play,
  Volume2,
} from "lucide-react";

export default function PracticePage() {
  const router = useRouter();

  // Workflow step: 1 (Upload), 2 (Pitch Rehearsal), 3 (Judge Q&A)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  // Step 2: Pitch Rehearsal state
  const [activeSlide, setActiveSlide] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [fillerCount, setFillerCount] = useState(2);

  // Step 3: Judge Q&A state
  const [judgeIndex, setJudgeIndex] = useState(1); // Dr. Elena Rostova
  const [isAnswering, setIsAnswering] = useState(false);
  const [answerTime, setAnswerTime] = useState(0);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);

  // Simulate file upload
  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadedFile("ETHGlobal_Istanbul_GrandPrize_Deck.pdf");
          setTimeout(() => setCurrentStep(2), 600);
          return 100;
        }
        return prev + 15;
      });
    }, 120);
  };

  // Rehearsal timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  // Answer timer
  useEffect(() => {
    let aTimer: NodeJS.Timeout;
    if (isAnswering) {
      aTimer = setInterval(() => {
        setAnswerTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(aTimer);
  }, [isAnswering]);

  const slide = mockSlides[activeSlide];
  const maxLimit = 240; // 4 minutes
  const timerColor =
    elapsedSeconds < 180
      ? "#3DDC97"
      : elapsedSeconds <= maxLimit
      ? "#FFB547"
      : "#FF5C6C";

  return (
    <div className="min-h-screen bg-[#07070B] text-[#F5F5FA] flex flex-col justify-between py-6 px-4 sm:px-8">
      {/* Top Studio Header */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between pb-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7C5CFF] to-[#FF4D9D] p-[1.5px]">
            <div className="w-full h-full bg-[#0E0E16] rounded-xl flex items-center justify-center font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#7C5CFF] to-[#FF4D9D]">
              P
            </div>
          </div>
          <span className="font-bold text-white font-heading text-lg">
            {siteConfig.name} <span className="text-[#FF4D9D]">Studio</span>
          </span>
        </Link>

        {/* Step Progression Pills */}
        <div className="hidden sm:flex items-center gap-3 bg-[#151521] px-4 py-1.5 rounded-full border border-white/10 text-xs font-mono-accent">
          <span className={currentStep === 1 ? "text-white font-bold" : "text-[#9A9AB0]"}>
            1. Upload Deck
          </span>
          <span className="text-white/20">→</span>
          <span className={currentStep === 2 ? "text-white font-bold" : "text-[#9A9AB0]"}>
            2. Rehearse Pitch
          </span>
          <span className="text-white/20">→</span>
          <span className={currentStep === 3 ? "text-white font-bold" : "text-[#9A9AB0]"}>
            3. Judge Q&A
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="text-xs text-[#9A9AB0] hover:text-white px-3 py-1.5 transition-colors font-mono-accent"
          >
            Dashboard
          </Link>
          <Link
            href="/"
            className="text-xs text-[#9A9AB0] hover:text-white px-3 py-1.5 transition-colors font-mono-accent"
          >
            Exit Studio
          </Link>
        </div>
      </header>

      {/* Main Studio Workspace */}
      <main className="max-w-6xl mx-auto w-full my-auto py-8">
        <AnimatePresence mode="wait">
          {/* STEP 1: Upload Slide Deck */}
          {currentStep === 1 && (
            <motion.div
              key="step-upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto text-center"
            >
              <Badge variant="violet" className="mb-4">
                <Sparkles className="w-3.5 h-3.5 text-[#7C5CFF]" />
                <span>Step 1: Ingest Pitch Deck</span>
              </Badge>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
                Upload your slides to begin
              </h1>
              <p className="text-xs sm:text-sm text-[#9A9AB0] mt-2 mb-8">
                We parse your visual layout, count slide complexity, and calculate optimal time allocations per section.
              </p>

              {/* Upload Drop Zone */}
              <div
                onClick={simulateUpload}
                className="relative rounded-3xl border-2 border-dashed border-[#7C5CFF]/50 bg-[#0E0E16]/80 backdrop-blur-xl p-10 sm:p-14 hover:border-[#FF4D9D] hover:bg-[#0E0E16] transition-all cursor-pointer group shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
              >
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#7C5CFF]/20 to-[#FF4D9D]/20 border border-white/10 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-10 h-10 text-white group-hover:text-[#FF4D9D] transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-white font-heading">
                  Drag & drop your presentation
                </h3>
                <p className="text-xs text-[#9A9AB0] mt-1.5">
                  PDF, PPTX, or Google Slides export (up to 50MB)
                </p>

                {/* Simulated File upload progress */}
                {isUploading && (
                  <div className="mt-6 w-full max-w-xs mx-auto">
                    <div className="flex items-center justify-between text-xs font-mono-accent text-[#9A9AB0] mb-1.5">
                      <span>Analyzing slide structure...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#7C5CFF] to-[#FF4D9D] transition-all duration-150"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {uploadedFile && (
                  <div className="mt-6 inline-flex items-center gap-2 bg-[#3DDC97]/20 border border-[#3DDC97]/40 px-4 py-2 rounded-2xl text-xs font-mono-accent text-[#3DDC97]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{uploadedFile} (Parsed 5 slides)</span>
                  </div>
                )}
              </div>

              {/* Sample Quick Load Button */}
              <div className="mt-8 flex items-center justify-center gap-4">
                <span className="text-xs text-[#9A9AB0] font-mono-accent">
                  Or test with sample deck:
                </span>
                <button
                  onClick={simulateUpload}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono-accent text-white transition-colors"
                >
                  Load ETHGlobal Finalist Deck →
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Rehearse Pitch */}
          {currentStep === 2 && (
            <motion.div
              key="step-pitch"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Left Column: Slide Deck View (8 cols) */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                {/* Slide Screen Frame */}
                <div className="relative rounded-3xl bg-[#0E0E16] border border-white/15 p-6 sm:p-10 aspect-[16/10] flex flex-col justify-between overflow-hidden shadow-2xl">
                  {/* Grid overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

                  {/* Top Bar */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-xs font-mono-accent uppercase tracking-wider text-[#7C5CFF] font-semibold bg-[#7C5CFF]/15 px-3 py-1 rounded-full border border-[#7C5CFF]/30">
                      {slide.visualTag}
                    </span>
                    <span className="text-xs font-mono-accent text-[#9A9AB0]">
                      Slide {activeSlide + 1} of {mockSlides.length}
                    </span>
                  </div>

                  {/* Center Content */}
                  <div className="relative z-10 my-auto">
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading leading-tight">
                      {slide.title}
                    </h2>
                    <p className="text-sm text-[#9A9AB0] mt-3">
                      {slide.subtitle}
                    </p>

                    <div className="mt-6 space-y-2.5">
                      {slide.keyPoints.map((point, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 text-sm text-[#F5F5FA] font-mono-accent"
                        >
                          <span className="w-2 h-2 rounded-full bg-[#FF4D9D]" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Slide Bottom Bar */}
                  <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/10 text-xs font-mono-accent text-[#9A9AB0]">
                    <span>Allocated Budget: {slide.allocatedTime}s</span>
                    <span className="text-[#3DDC97]">Vision Model Synced</span>
                  </div>
                </div>

                {/* Slide Switchers Bar */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#0E0E16] border border-white/10">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setActiveSlide((prev) => Math.max(0, prev - 1))}
                      disabled={activeSlide === 0}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-mono-accent text-white">
                      Slide {activeSlide + 1} / {mockSlides.length}
                    </span>
                    <button
                      onClick={() =>
                        setActiveSlide((prev) => Math.min(mockSlides.length - 1, prev + 1))
                      }
                      disabled={activeSlide === mockSlides.length - 1}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setElapsedSeconds(0)}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#9A9AB0] hover:text-white border border-white/10 transition-colors"
                      title="Reset timer"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setCurrentStep(3)}
                      className="px-5 py-2.5 rounded-xl bg-[#151521] hover:bg-[#1a1a28] border border-white/15 text-xs font-medium text-white transition-colors flex items-center gap-1.5"
                    >
                      <span>Proceed to Judge Q&A</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Audio & Speech Telemetry (4 cols) */}
              <div className="lg:col-span-4 flex flex-col gap-5">
                {/* Timer & Pace Panel */}
                <div className="p-6 rounded-3xl bg-[#0E0E16] border border-white/15 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono-accent text-[#9A9AB0] uppercase">
                      Total Pitch Clock
                    </span>
                    <span
                      className="text-xs font-mono-accent px-2.5 py-0.5 rounded-full border"
                      style={{
                        color: timerColor,
                        borderColor: `${timerColor}40`,
                        backgroundColor: `${timerColor}15`,
                      }}
                    >
                      {elapsedSeconds < 180
                        ? "Pace: Optimal"
                        : elapsedSeconds <= maxLimit
                        ? "1 Min Warning"
                        : "OVERTIME"}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between py-2">
                    <span
                      className="text-5xl font-extrabold font-mono-accent tracking-tighter"
                      style={{ color: timerColor }}
                    >
                      {formatTime(elapsedSeconds)}
                    </span>
                    <span className="text-xs font-mono-accent text-[#9A9AB0]">
                      Limit: 04:00
                    </span>
                  </div>

                  {/* Record Toggle */}
                  <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`mt-4 w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm transition-all shadow-lg ${
                      isRecording
                        ? "bg-[#FF5C6C] text-white shadow-[0_0_30px_rgba(255,92,108,0.5)]"
                        : "bg-gradient-to-r from-[#7C5CFF] via-[#FF4D9D] to-[#FFB547] text-white shadow-[0_0_30px_rgba(124,92,255,0.4)]"
                    }`}
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="w-5 h-5 animate-pulse" />
                        <span>Stop Recording</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5" />
                        <span>Start Pitch Rehearsal</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Real-time Waveform Display */}
                <div className="p-6 rounded-3xl bg-[#0E0E16] border border-white/15">
                  <div className="flex items-center justify-between mb-3 text-xs font-mono-accent">
                    <span className="text-white font-bold flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4 text-[#7C5CFF]" /> Acoustic Telemetry
                    </span>
                    <span className="text-[#3DDC97]">144 WPM</span>
                  </div>

                  <Waveform
                    isActive={isRecording}
                    barCount={26}
                    height={55}
                    colorPreset={elapsedSeconds > maxLimit ? "danger" : "gradient"}
                  />

                  <div className="mt-4 pt-3 border-t border-white/5 space-y-2 text-xs font-mono-accent">
                    <div className="flex justify-between text-[#9A9AB0]">
                      <span>Hesitations detected:</span>
                      <span className="text-[#FFB547] font-bold">{fillerCount} ('um', 'like')</span>
                    </div>
                    <div className="flex justify-between text-[#9A9AB0]">
                      <span>Volume dynamics:</span>
                      <span className="text-[#3DDC97] font-bold">Clear & Confident</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Judge Q&A */}
          {currentStep === 3 && (
            <motion.div
              key="step-judge"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="max-w-3xl mx-auto"
            >
              <div className="text-center mb-8">
                <Badge variant="magenta" className="mb-3">
                  <Bot className="w-3.5 h-3.5 text-[#FF4D9D]" />
                  <span>Step 3: Defend Your Hack</span>
                </Badge>
                <h2 className="text-3xl font-extrabold text-white font-heading">
                  AI Judge Q&A Round
                </h2>
                <p className="text-xs text-[#9A9AB0] mt-1.5">
                  Listen to the judge's inquiry, then speak or type your defense before the session is graded.
                </p>
              </div>

              {/* Judge Interrogation Card */}
              <div className="rounded-3xl bg-[#0E0E16] border border-white/15 p-6 sm:p-8 shadow-2xl space-y-6">
                {/* Judge Profile */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-xl shadow">
                      ⚡
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white font-heading">
                        Dr. Elena Rostova
                      </h3>
                      <p className="text-xs text-[#9A9AB0] font-mono-accent">
                        Principal Architect • Intensity: Brutal (10/10)
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono-accent bg-[#FF5C6C]/20 text-[#FF5C6C] px-3 py-1 rounded-full border border-[#FF5C6C]/30 font-bold">
                    Follow-up Question
                  </span>
                </div>

                {/* Judge Question Speech Bubble */}
                <div className="p-5 rounded-2xl bg-[#151521] border border-purple-500/30">
                  <p className="text-sm sm:text-base text-white leading-relaxed font-mono-accent italic">
                    “You claim sub-50ms latency with zero state drift across edge nodes. How does your reconciliation protocol handle partition splits during a sudden DDOS surge?”
                  </p>
                </div>

                {/* User Answer Action Area */}
                <div className="p-5 rounded-2xl bg-[#07070B] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono-accent text-[#9A9AB0]">
                      Your Answer Telemetry:
                    </span>
                    {isAnswering && (
                      <span className="text-xs font-mono-accent text-[#3DDC97]">
                        Recording ({formatTime(answerTime)})
                      </span>
                    )}
                  </div>

                  <Waveform isActive={isAnswering} barCount={30} height={40} />

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      onClick={() => setIsAnswering(!isAnswering)}
                      className={`px-5 py-2.5 rounded-xl font-medium text-xs flex items-center gap-2 transition-all ${
                        isAnswering
                          ? "bg-[#FF5C6C] text-white"
                          : "bg-white/10 hover:bg-white/15 text-white"
                      }`}
                    >
                      {isAnswering ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      <span>{isAnswering ? "Finish Voice Answer" : "Speak Answer into Mic"}</span>
                    </button>

                    <Link href="/results">
                      <MagneticButton variant="primary" size="md" className="px-6 py-2.5 text-xs font-bold">
                        <span>Generate Hackathon Rubric Results</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </MagneticButton>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Info */}
      <footer className="max-w-6xl mx-auto w-full pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#9A9AB0] font-mono-accent">
        <span>Session ID: pc-run-ethglobal-final</span>
        <span>Acoustic Processing: In-Memory Client Only</span>
      </footer>
    </div>
  );
}
