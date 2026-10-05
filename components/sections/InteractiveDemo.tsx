"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { mockSlides, mockJudgeQuestions } from "@/data/mock";
import { formatTime } from "@/lib/utils";
import Waveform from "@/components/ui/Waveform";
import MagneticButton from "@/components/ui/MagneticButton";
import Badge from "@/components/ui/Badge";
import {
  Mic,
  MicOff,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Bot,
  Play,
  RotateCcw,
  MessageSquare,
  AlertTriangle,
  Flame,
  Volume2,
} from "lucide-react";

export default function InteractiveDemo() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(132); // starts at 2:12
  const [activeJudgeIndex, setActiveJudgeIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(
    mockJudgeQuestions[0].question
  );
  const [isTypingQuestion, setIsTypingQuestion] = useState(false);
  const [displayedQuestionText, setDisplayedQuestionText] = useState(
    mockJudgeQuestions[0].question
  );

  // Timer run loop when recording
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  // Typing animation for judge questions
  const askNewQuestion = () => {
    const nextIdx = (activeJudgeIndex + 1) % mockJudgeQuestions.length;
    setActiveJudgeIndex(nextIdx);
    const newQ = mockJudgeQuestions[nextIdx].question;
    setCurrentQuestion(newQ);
    setIsTypingQuestion(true);
    setDisplayedQuestionText("");

    let charIdx = 0;
    const interval = setInterval(() => {
      setDisplayedQuestionText(newQ.slice(0, charIdx));
      charIdx++;
      if (charIdx > newQ.length) {
        clearInterval(interval);
        setIsTypingQuestion(false);
      }
    }, 28);
  };

  const currentSlide = mockSlides[currentSlideIndex];
  const maxLimit = 240; // 4 minutes

  // Timer ring color based on elapsed time:
  // green (< 180s), amber (180 - 240s), red (> 240s)
  const timerColor =
    seconds < 180
      ? "#3DDC97"
      : seconds <= maxLimit
      ? "#FFB547"
      : "#FF5C6C";

  return (
    <section id="demo" className="relative py-28 sm:py-36 px-4 sm:px-6 md:px-8 bg-[#07070B] overflow-hidden">
      {/* Background radial spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-gradient-to-tr from-[#7C5CFF]/15 via-[#FF4D9D]/10 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <Badge variant="magenta" className="mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#FF4D9D]" />
            <span>Interactive Demo</span>
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-heading">
            Experience PitchCoach live right here
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#9A9AB0] max-w-xl mx-auto">
            Test the slide viewer, toggle live microphone speech telemetry, and challenge the AI Judge to roast your claims.
          </p>
        </div>

        {/* Realistic Interactive Browser Frame */}
        <div className="rounded-3xl bg-[#0E0E16]/95 border border-white/15 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.9)] overflow-hidden">
          {/* Top Browser Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-[#151521] border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF5C6C]" />
              <span className="w-3 h-3 rounded-full bg-[#FFB547]" />
              <span className="w-3 h-3 rounded-full bg-[#3DDC97]" />
            </div>

            <div className="flex items-center gap-2 text-xs font-mono-accent text-[#9A9AB0] bg-[#07070B] px-5 py-1 rounded-full border border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3DDC97]" />
              pitchcoach.ai/rehearsal-studio/ethglobal-istanbul
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono-accent text-[#9A9AB0] hidden sm:inline">
                Live Session
              </span>
            </div>
          </div>

          {/* Studio Body: Split Left (Slide Viewer & Controls) + Right (Judge Panel & Telemetry) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 sm:p-7">
            {/* Left Column: Slide Deck Interactive Viewer (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              {/* Slide Screen Canvas */}
              <div className="relative rounded-2xl bg-[#07070B] border border-white/10 p-6 sm:p-8 aspect-[16/10] flex flex-col justify-between overflow-hidden shadow-inner">
                {/* Background grid accent */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                {/* Slide Header */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[11px] font-mono-accent uppercase tracking-widest text-[#7C5CFF] font-semibold bg-[#7C5CFF]/15 px-3 py-1 rounded-full border border-[#7C5CFF]/30">
                    {currentSlide.visualTag}
                  </span>
                  <span className="text-xs font-mono-accent text-[#9A9AB0]">
                    Slide {currentSlideIndex + 1} of {mockSlides.length}
                  </span>
                </div>

                {/* Slide Main Content */}
                <div className="relative z-10 my-auto py-2">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white font-heading leading-tight">
                        {currentSlide.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#9A9AB0] mt-2">
                        {currentSlide.subtitle}
                      </p>

                      <div className="mt-4 space-y-2">
                        {currentSlide.keyPoints.map((point, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-xs text-[#F5F5FA] font-mono-accent"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D9D]" />
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Slide Bottom Bar */}
                <div className="relative z-10 flex items-center justify-between pt-3 border-t border-white/10 text-[11px] font-mono-accent text-[#9A9AB0]">
                  <span>Pacing Target: {currentSlide.allocatedTime}s</span>
                  <span className="text-[#3DDC97]">AI Speech Grounded</span>
                </div>
              </div>

              {/* Slide Navigation + Recording Control Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#151521] border border-white/10">
                {/* Slide Switchers */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentSlideIndex((prev) => Math.max(0, prev - 1))
                    }
                    disabled={currentSlideIndex === 0}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono-accent text-white px-2">
                    {currentSlideIndex + 1} / {mockSlides.length}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentSlideIndex((prev) =>
                        Math.min(mockSlides.length - 1, prev + 1)
                      )
                    }
                    disabled={currentSlideIndex === mockSlides.length - 1}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Record Toggle Button */}
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                    isRecording
                      ? "bg-[#FF5C6C] text-white shadow-[0_0_25px_rgba(255,92,108,0.5)]"
                      : "bg-gradient-to-r from-[#7C5CFF] to-[#FF4D9D] text-white shadow-[0_0_20px_rgba(124,92,255,0.4)]"
                  }`}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="w-4 h-4 animate-pulse" />
                      <span>Pause Speech</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      <span>Simulate Speaking</span>
                    </>
                  )}
                </button>

                {/* Reset Timer */}
                <button
                  onClick={() => setSeconds(0)}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#9A9AB0] hover:text-white border border-white/10 transition-colors"
                  title="Reset clock"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Column: Timer Ring, Waveform & Judge Q&A (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              {/* Telemetry Card */}
              <div className="p-5 rounded-2xl bg-[#151521] border border-white/10 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: timerColor }}
                    />
                    <span className="text-xs font-mono-accent text-white font-bold">
                      {isRecording ? "LIVE CADENCE STREAM" : "TELEMETRY STANDBY"}
                    </span>
                  </div>
                  <span
                    className="text-xs font-mono-accent px-2 py-0.5 rounded-full border"
                    style={{
                      color: timerColor,
                      borderColor: `${timerColor}40`,
                      backgroundColor: `${timerColor}15`,
                    }}
                  >
                    {seconds < 180
                      ? "Optimal Pace"
                      : seconds <= 240
                      ? "Caution (Last Min)"
                      : "OVERTIME GONG"}
                  </span>
                </div>

                {/* Timer Clock + Audio Waveform */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex flex-col">
                    <span
                      className="text-3xl font-extrabold font-mono-accent tracking-tighter"
                      style={{ color: timerColor }}
                    >
                      {formatTime(seconds)}
                    </span>
                    <span className="text-[10px] font-mono-accent text-[#9A9AB0]">
                      Limit: 04:00 min
                    </span>
                  </div>

                  <div className="flex-1 max-w-[190px] ml-4">
                    <Waveform
                      isActive={isRecording}
                      barCount={20}
                      height={40}
                      colorPreset={seconds > 240 ? "danger" : "gradient"}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/5 text-[11px] font-mono-accent text-[#9A9AB0]">
                  <div>Words/Min: <span className="text-white font-bold">{isRecording ? "144 WPM" : "0 WPM"}</span></div>
                  <div>Hesitations: <span className="text-[#3DDC97] font-bold">1 found</span></div>
                </div>
              </div>

              {/* Tough Judge Q&A Panel */}
              <div className="p-5 rounded-2xl bg-[#151521] border border-purple-500/25 flex flex-col justify-between flex-1 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm shadow">
                        💼
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white font-heading">
                          {mockJudgeQuestions[activeJudgeIndex].judge}
                        </div>
                        <div className="text-[9px] text-[#9A9AB0] font-mono-accent">
                          Hackathon Grand Jury
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono-accent bg-[#FF4D9D]/20 text-[#FF4D9D] px-2 py-0.5 rounded-full border border-[#FF4D9D]/30">
                      Tough Q&A
                    </span>
                  </div>

                  {/* Question Bubble */}
                  <div className="bg-[#07070B] rounded-xl p-4 border border-white/10 min-h-[95px] flex flex-col justify-center">
                    <p className="text-xs sm:text-sm text-white leading-relaxed font-mono-accent italic">
                      “{displayedQuestionText}”
                      {isTypingQuestion && (
                        <span className="inline-block w-1.5 h-3 bg-[#FF4D9D] ml-1 animate-pulse" />
                      )}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-[#9A9AB0] font-mono-accent">
                    Click to simulate follow-up:
                  </span>
                  <button
                    onClick={askNewQuestion}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#7C5CFF]/30 to-[#FF4D9D]/30 hover:from-[#7C5CFF]/50 hover:to-[#FF4D9D]/50 text-white text-xs font-medium border border-purple-500/40 transition-all flex items-center gap-1.5"
                  >
                    <Bot className="w-3.5 h-3.5 text-[#FF4D9D]" />
                    <span>Ask me a question</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
