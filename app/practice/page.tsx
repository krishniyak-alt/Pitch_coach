"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { mockSlides } from "@/data/mock";
import { siteConfig } from "@/data/content";
import { samplePitch } from "@/data/sample";
import { formatTime } from "@/lib/utils";
import { Upload, ChevronLeft, ChevronRight, RotateCcw, CheckSquare, ArrowRight } from "lucide-react";

export default function PracticePage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  // Step 2: Pitch Rehearsal state
  const [activeSlide, setActiveSlide] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Step 3: Judge Q&A state
  const [isAnswering, setIsAnswering] = useState(false);
  const [answerTime, setAnswerTime] = useState(30);

  const simulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploadedFile(samplePitch.deckFileName);
      setCurrentStep(2);
    }, 600);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  useEffect(() => {
    let aTimer: NodeJS.Timeout;
    if (isAnswering && answerTime > 0) {
      aTimer = setInterval(() => {
        setAnswerTime((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(aTimer);
  }, [isAnswering, answerTime]);

  const slide = mockSlides[activeSlide] || mockSlides[0];
  const maxLimit = samplePitch.timeLimitSec; // 180 seconds

  return (
    <div className="bg-paper text-ink min-h-screen pt-20 pb-16 px-5 sm:px-8">
      <div className="max-w-[1100px] mx-auto space-y-8">
        {/* Top Studio Header */}
        <header className="w-full flex items-center justify-between pb-4 border-b border-rule">
          <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-ink">
            {siteConfig.name} <span className="font-mono text-xs uppercase text-ink-3">/ Rehearsal</span>
          </Link>

          {/* Step indicator */}
          <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-wider text-ink-3">
            <span className={currentStep === 1 ? "text-ink font-bold border-b border-ink pb-0.5" : ""}>
              01 Upload
            </span>
            <span>/</span>
            <span className={currentStep === 2 ? "text-ink font-bold border-b border-ink pb-0.5" : ""}>
              02 Pitch
            </span>
            <span>/</span>
            <span className={currentStep === 3 ? "text-ink font-bold border-b border-ink pb-0.5" : ""}>
              03 Questions
            </span>
          </div>
        </header>

        {/* STEP 1: Upload */}
        {currentStep === 1 && (
          <div className="max-w-xl mx-auto py-10 space-y-6">
            <div className="text-left">
              <span className="text-xs font-mono uppercase tracking-widest text-ink-3 font-semibold block mb-2">
                STEP 01
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink mb-3">
                Upload your pitch deck
              </h1>
              <p className="text-ink-2 text-sm">
                Accepts PDF or PPTX files. Pacing allocations will be generated based on slide volume.
              </p>
            </div>

            <div
              onClick={simulateUpload}
              className="border-2 border-dashed border-rule hover:border-ink bg-paper-2 p-10 text-center cursor-pointer transition-colors space-y-3"
              style={{ borderRadius: "2px" }}
            >
              <Upload className="w-8 h-8 text-ink-3 mx-auto" />
              <div className="font-serif text-lg font-bold text-ink">
                {isUploading ? "Parsing deck..." : "Click to select or drop pitch deck"}
              </div>
              <div className="font-mono text-xs text-ink-3">
                PDF or PPTX under 50MB
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-mono text-ink-3">
                Or test with sample data:
              </span>
              <button
                onClick={simulateUpload}
                className="btn-signal text-xs py-2 px-3 font-semibold"
              >
                <span>Load {samplePitch.name} Sample Deck</span>
                <span className="arrow-nudge text-xs">→</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Rehearse Pitch */}
        {currentStep === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Slide preview in a hairline frame (cols 1-8) */}
            <div className="lg:col-span-8 space-y-4">
              <div
                className="border border-rule bg-paper-2 p-6 sm:p-8 aspect-[16/10] flex flex-col justify-between"
                style={{ borderRadius: "2px" }}
              >
                <div className="flex items-center justify-between border-b border-rule pb-3 text-xs font-mono">
                  <span className="font-semibold text-ink uppercase tracking-wider">
                    {samplePitch.name}
                  </span>
                  <span className="text-ink-3">
                    SLIDE {activeSlide + 1} OF {mockSlides.length}
                  </span>
                </div>

                <div className="my-auto py-6">
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink leading-tight">
                    {slide.title}
                  </h2>
                  <p className="font-sans text-sm sm:text-base text-ink-2 mt-2">
                    {slide.subtitle}
                  </p>

                  <div className="mt-6 space-y-2">
                    {slide.keyPoints.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-ink-2 font-mono">
                        <span className="text-ink font-bold">•</span>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-rule pt-3 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveSlide((prev) => Math.max(0, prev - 1))}
                      disabled={activeSlide === 0}
                      className="px-2 py-1 border border-rule hover:bg-paper disabled:opacity-30"
                      style={{ borderRadius: "2px" }}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveSlide((prev) => Math.min(mockSlides.length - 1, prev + 1))}
                      disabled={activeSlide === mockSlides.length - 1}
                      className="px-2 py-1 border border-rule hover:bg-paper disabled:opacity-30"
                      style={{ borderRadius: "2px" }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-ink-3">Use arrows to switch slides while speaking</span>
                </div>
              </div>

              {/* Slide markers as ticks along a rule */}
              <div className="border border-rule bg-paper p-4 space-y-2" style={{ borderRadius: "2px" }}>
                <div className="flex justify-between text-xs font-mono text-ink-3">
                  <span>Slide Timeline</span>
                  <span className="font-bold text-ink">Slide {activeSlide + 1} active</span>
                </div>
                <div className="relative h-4 w-full flex items-center">
                  <div className="h-[1px] w-full bg-rule absolute" />
                  <div className="w-full flex justify-between relative z-10">
                    {mockSlides.map((_, i) => (
                      <div
                        key={i}
                        onClick={() => setActiveSlide(i)}
                        className={`w-3 h-3 cursor-pointer border ${
                          activeSlide === i
                            ? "bg-signal border-ink"
                            : "bg-paper-2 border-rule hover:border-ink"
                        }`}
                        style={{ borderRadius: "2px" }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Controls in right column (cols 9-12) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Big mono timer */}
              <div className="border border-ink bg-paper p-6 space-y-4" style={{ borderRadius: "2px" }}>
                <div className="flex items-center justify-between text-xs font-mono text-ink-3 uppercase tracking-wider">
                  <span>STOPWATCH</span>
                  <span className="font-bold text-ink">LIMIT 03:00</span>
                </div>

                <div className="font-mono text-4xl sm:text-5xl font-bold tracking-tight text-ink tabular-numbers">
                  {formatTime(elapsedSeconds)}
                </div>

                {/* Record button: 2px-radius square that turns --danger while recording */}
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`w-full py-4 text-sm font-mono uppercase tracking-wider font-bold transition-colors ${
                    isRecording
                      ? "bg-danger text-paper"
                      : "bg-signal text-on-signal hover:opacity-95"
                  }`}
                  style={{ borderRadius: "2px" }}
                >
                  {isRecording ? "Stop Recording" : "Start Recording"}
                </button>

                <div className="text-[11px] font-mono text-ink-3 pt-2 border-t border-rule">
                  Status: {isRecording ? "Transcribing speech..." : "Microphone standing by"}
                </div>
              </div>

              {/* Progress to Questions */}
              <div className="border border-rule bg-paper-2 p-5 space-y-3" style={{ borderRadius: "2px" }}>
                <div className="font-serif text-lg font-bold text-ink">
                  Finished your presentation?
                </div>
                <p className="text-xs text-ink-2 font-sans">
                  Proceed to the 3-question judge cross-examination round.
                </p>
                <button
                  onClick={() => {
                    setIsRecording(false);
                    setCurrentStep(3);
                  }}
                  className="w-full btn-signal text-xs py-2.5 px-4 font-semibold justify-center"
                >
                  <span>Proceed to Judge Questions</span>
                  <span className="arrow-nudge text-xs">→</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Judge Q&A */}
        {currentStep === 3 && (
          <div className="max-w-2xl mx-auto py-6 space-y-6">
            <div className="text-left">
              <span className="text-xs font-mono uppercase tracking-widest text-ink-3 font-semibold block mb-2">
                STEP 03 / CROSS-EXAMINATION
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink mb-2">
                Defend your architecture
              </h1>
              <p className="text-ink-2 text-sm">
                Answer strictly within 30 seconds. Real judges expect concise, direct rationale.
              </p>
            </div>

            <div className="border border-ink bg-paper p-6 sm:p-8 space-y-6" style={{ borderRadius: "2px" }}>
              <div className="flex items-center justify-between pb-3 border-b border-rule text-xs font-mono">
                <span className="text-signal font-bold uppercase tracking-wider">
                  QUESTION 01 OF 03
                </span>
                <span className="font-mono text-sm font-bold text-danger tabular-numbers">
                  0:{String(answerTime).padStart(2, "0")} remaining
                </span>
              </div>

              <div className="bg-paper-2 border border-rule p-4">
                <p className="font-serif text-xl text-ink italic leading-snug">
                  “{samplePitch.judgeQuestions.Fair[0].question}”
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-ink-3">
                  <span>Your Verbal Answer:</span>
                  <span className={isAnswering ? "text-danger font-bold" : ""}>
                    {isAnswering ? "Recording..." : "Mic ready"}
                  </span>
                </div>

                <button
                  onClick={() => setIsAnswering(!isAnswering)}
                  className={`w-full py-3 text-xs font-mono uppercase tracking-wider font-bold ${
                    isAnswering
                      ? "bg-danger text-paper"
                      : "border border-ink hover:bg-paper-2 text-ink"
                  }`}
                  style={{ borderRadius: "2px" }}
                >
                  {isAnswering ? "Finish Answer" : "Start Speaking Answer"}
                </button>
              </div>

              <div className="pt-4 border-t border-rule flex justify-end">
                <Link
                  href="/results"
                  className="btn-signal text-sm py-2.5 px-4 font-semibold"
                >
                  <span>Generate Final Scoresheet</span>
                  <span className="arrow-nudge text-xs">→</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
