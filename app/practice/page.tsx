"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { mockSlides } from "@/data/mock";
import { siteConfig } from "@/data/content";
import { samplePitch } from "@/data/sample";
import { formatTime } from "@/lib/utils";
import { ParsedSlide, EvaluationResult, JudgeQuestionItem } from "@/lib/types";
import { parsePdfDeck } from "@/lib/pdf-parser";
import { SpeechTracker, calculateWpm, countFillerWords, FillerWordCount } from "@/lib/speech-tracker";
import { fetchJudgeQuestions, submitPitchEvaluation } from "@/lib/api-client";
import {
  Upload,
  ChevronLeft,
  ChevronRight,
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Key,
  CheckCircle,
  AlertCircle,
  FileText,
  Loader2,
  ArrowRight,
} from "lucide-react";

export default function PracticePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Settings / API Key
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);

  // Step 1: Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deckFileName, setDeckFileName] = useState<string>(samplePitch.name);
  const [slides, setSlides] = useState<ParsedSlide[]>(mockSlides as unknown as ParsedSlide[]);
  const [targetTimeLimit, setTargetTimeLimit] = useState<number>(180); // 3 minutes default

  // Step 2: Pitch Rehearsal state
  const [activeSlide, setActiveSlide] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [slideTimes, setSlideTimes] = useState<{ [slideIdx: number]: number }>({});
  const [transcript, setTranscript] = useState("");
  const [interimText, setInterimText] = useState("");
  const [audioLevel, setAudioLevel] = useState(0);
  const [fillerCounts, setFillerCounts] = useState<FillerWordCount[]>([]);
  const [currentWpm, setCurrentWpm] = useState(0);
  const [speechError, setSpeechError] = useState<string | null>(null);

  // Step 3: Judge Q&A state
  const [judgeQuestions, setJudgeQuestions] = useState<JudgeQuestionItem[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [isAnswering, setIsAnswering] = useState(false);
  const [answerTime, setAnswerTime] = useState(30);
  const [qaAnswers, setQaAnswers] = useState<{ [qIdx: number]: string }>({});
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Tracker references
  const speechTrackerRef = useRef<SpeechTracker | null>(null);
  const activeSlideRef = useRef(activeSlide);
  activeSlideRef.current = activeSlide;

  // Load API key from localStorage if saved
  useEffect(() => {
    try {
      const savedKey = localStorage.getItem("pitchcoach_gemini_key");
      if (savedKey) setGeminiApiKey(savedKey);
    } catch {}
  }, []);

  const handleSaveApiKey = (key: string) => {
    setGeminiApiKey(key);
    try {
      if (key) localStorage.setItem("pitchcoach_gemini_key", key);
      else localStorage.removeItem("pitchcoach_gemini_key");
    } catch {}
  };

  // Real PDF file upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        const { slides: parsedSlides } = await parsePdfDeck(file, targetTimeLimit);
        setSlides(parsedSlides);
        setDeckFileName(file.name.replace(/\.[^/.]+$/, ""));
        setActiveSlide(0);
        setCurrentStep(2);
      } else {
        // Fallback for non-PDF files
        setDeckFileName(file.name.replace(/\.[^/.]+$/, ""));
        setCurrentStep(2);
      }
    } catch (err: any) {
      console.error("Failed to parse PDF:", err);
      setUploadError("Could not render PDF slides directly. Proceeding with standard deck layout.");
      setDeckFileName(file.name.replace(/\.[^/.]+$/, ""));
      setCurrentStep(2);
    } finally {
      setIsUploading(false);
    }
  };

  const loadSampleDeck = () => {
    setSlides(mockSlides as unknown as ParsedSlide[]);
    setDeckFileName(samplePitch.name);
    setCurrentStep(2);
  };

  // Stopwatch & Per-slide timing tracker
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
        setSlideTimes((prev) => {
          const current = prev[activeSlideRef.current] || 0;
          return { ...prev, [activeSlideRef.current]: current + 1 };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  // Audio recording toggle (Web Speech API + Web Audio API)
  const toggleRecording = async () => {
    if (!isRecording) {
      setSpeechError(null);
      const tracker = new SpeechTracker();
      speechTrackerRef.current = tracker;

      tracker.onTranscriptChange = (full, interim) => {
        setTranscript(full);
        setInterimText(interim);
        setFillerCounts(countFillerWords(full));
      };

      tracker.onAudioLevelChange = (level) => {
        setAudioLevel(level);
      };

      tracker.onError = (err) => {
        setSpeechError(err);
      };

      const ok = await tracker.start();
      if (ok || tracker.isSupported()) {
        setIsRecording(true);
      } else {
        setIsRecording(true); // Still allow manual timing even if mic not supported
      }
    } else {
      if (speechTrackerRef.current) {
        const final = speechTrackerRef.current.stop();
        setTranscript(final);
        setInterimText("");
      }
      setIsRecording(false);
    }
  };

  // Real-time WPM calculation
  useEffect(() => {
    const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).length : 0;
    setCurrentWpm(calculateWpm(wordCount, elapsedSeconds));
  }, [transcript, elapsedSeconds]);

  // Transition to Step 3: Fetch dynamic judge questions
  const proceedToQuestions = async () => {
    if (isRecording && speechTrackerRef.current) {
      speechTrackerRef.current.stop();
      setIsRecording(false);
    }

    setIsGeneratingQuestions(true);
    setCurrentStep(3);

    try {
      const slidesTextSummary = slides.map((s) => `${s.title}: ${s.text}`).join("\n");
      const data = await fetchJudgeQuestions({
        deckName: deckFileName,
        slidesText: slidesTextSummary,
        transcript,
        apiKey: geminiApiKey || undefined,
      });

      if (data && data.questions && data.questions.length > 0) {
        setJudgeQuestions(data.questions);
      }
    } catch (err) {
      console.warn("Failed to fetch questions, using defaults:", err);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // Step 3: Answering countdown
  useEffect(() => {
    let aTimer: NodeJS.Timeout;
    if (isAnswering && answerTime > 0) {
      aTimer = setInterval(() => {
        setAnswerTime((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(aTimer);
  }, [isAnswering, answerTime]);

  const toggleAnswerRecording = async () => {
    if (!isAnswering) {
      setIsAnswering(true);
      // Start recording answer
      const tracker = new SpeechTracker();
      speechTrackerRef.current = tracker;
      tracker.onTranscriptChange = (full) => {
        setQaAnswers((prev) => ({
          ...prev,
          [currentQuestionIdx]: full,
        }));
      };
      await tracker.start();
    } else {
      setIsAnswering(false);
      if (speechTrackerRef.current) {
        speechTrackerRef.current.stop();
      }
    }
  };

  // Submit and evaluate with Gemini AI
  const generateEvaluation = async () => {
    setIsEvaluating(true);

    try {
      // Map slides with time spent
      const slideData = slides.map((s, idx) => ({
        pageNumber: idx + 1,
        title: s.title,
        text: s.text,
        allocatedTime: s.allocatedTime || Math.round(targetTimeLimit / slides.length),
        actualTime: slideTimes[idx] || 0,
      }));

      const qaResponses = judgeQuestions.map((q, idx) => ({
        question: q.question,
        judge: q.judge,
        userAnswer: qaAnswers[idx] || "",
      }));

      const result: EvaluationResult = await submitPitchEvaluation({
        deckName: deckFileName,
        totalDurationSec: elapsedSeconds > 0 ? elapsedSeconds : 167,
        targetDurationSec: targetTimeLimit,
        transcript,
        slideData,
        qaResponses,
        apiKey: geminiApiKey || undefined,
      });

      // Store latest result and update history
      localStorage.setItem("pitchcoach_latest_run", JSON.stringify(result));

      // Append to dashboard history
      try {
        const historyJson = localStorage.getItem("pitchcoach_run_history");
        const history = historyJson ? JSON.parse(historyJson) : [];
        history.unshift({
          run: `Run ${history.length + 1}`,
          date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          duration: formatTime(result.totalDurationSec),
          target: formatTime(result.targetDurationSec),
          score: result.overallScoreFormatted,
          note: result.marginNote,
          status: result.status,
        });
        localStorage.setItem("pitchcoach_run_history", JSON.stringify(history.slice(0, 10)));
      } catch {}

      router.push("/results");
    } catch (err: any) {
      console.error("Evaluation error:", err);
      alert("Evaluation failed. Navigating to scoresheet report with local telemetry.");
      router.push("/results");
    } finally {
      setIsEvaluating(false);
    }
  };

  const currentSlide = slides[activeSlide] || slides[0] || mockSlides[0];

  return (
    <div className="bg-paper text-ink min-h-screen pt-20 pb-16 px-5 sm:px-8">
      <div className="max-w-[1100px] mx-auto space-y-8">
        {/* Top Studio Header */}
        <header className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-rule">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-ink min-h-[44px] inline-flex items-center">
              {siteConfig.name} <span className="font-mono text-xs uppercase text-ink-3 ml-2">/ Studio</span>
            </Link>

            {/* Optional Gemini API key quick-toggle */}
            <button
              onClick={() => setShowKeyInput(!showKeyInput)}
              className="text-[11px] font-mono px-2 py-1 border border-rule hover:border-ink flex items-center gap-1.5"
              style={{ borderRadius: "2px" }}
              title="Configure Gemini API Key"
            >
              <Key className="w-3 h-3 text-signal" />
              <span>{geminiApiKey ? "Gemini Key Configured" : "Add Gemini Key"}</span>
            </button>
          </div>

          {/* Step indicator */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-mono uppercase tracking-wider text-ink-3">
            <span className={currentStep === 1 ? "text-ink font-bold border-b border-ink pb-0.5" : ""}>
              01 Upload Deck
            </span>
            <span>/</span>
            <span className={currentStep === 2 ? "text-ink font-bold border-b border-ink pb-0.5" : ""}>
              02 Pitch & Telemetry
            </span>
            <span>/</span>
            <span className={currentStep === 3 ? "text-ink font-bold border-b border-ink pb-0.5" : ""}>
              03 Judge Defense
            </span>
          </div>
        </header>

        {/* API Key Modal / Dropdown banner */}
        {showKeyInput && (
          <div className="p-4 border border-ink bg-paper-2 space-y-2 text-xs font-mono" style={{ borderRadius: "2px" }}>
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider text-ink">Google Gemini API Key</span>
              <button onClick={() => setShowKeyInput(false)} className="text-ink-3 hover:text-ink">
                ✕ Close
              </button>
            </div>
            <p className="text-ink-2 text-[11px]">
              Optional. If not set, you can provide `GEMINI_API_KEY` in `.env.local` or run with local heuristic telemetry.
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="AIzaSy..."
                value={geminiApiKey}
                onChange={(e) => handleSaveApiKey(e.target.value)}
                className="grow border border-rule bg-paper px-3 py-1.5 text-xs text-ink focus:border-ink focus:outline-none"
                style={{ borderRadius: "2px" }}
              />
              {geminiApiKey && (
                <button
                  onClick={() => handleSaveApiKey("")}
                  className="px-2 py-1 border border-rule hover:bg-paper text-[11px]"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 1: Upload */}
        {currentStep === 1 && (
          <div className="max-w-xl mx-auto py-10 space-y-6">
            <div className="text-left">
              <span className="text-xs font-mono uppercase tracking-widest text-ink-3 font-semibold block mb-2">
                STEP 01 / DECK INGESTION
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink mb-3">
                Upload your pitch deck
              </h1>
              <p className="text-ink-2 text-sm">
                Drop your PDF deck. Slides will be parsed for titles, architecture points, and target pacing.
              </p>
            </div>

            <label
              htmlFor="deck-upload-input"
              className="block border-2 border-dashed border-rule hover:border-ink bg-paper-2 p-8 sm:p-10 text-center cursor-pointer transition-colors space-y-3"
              style={{ borderRadius: "2px" }}
            >
              <input
                id="deck-upload-input"
                type="file"
                accept=".pdf"
                className="sr-only"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              {isUploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 text-signal animate-spin mx-auto" />
                  <div className="font-serif text-lg font-bold text-ink">
                    Extracting slides & rendering canvases...
                  </div>
                  <div className="font-mono text-xs text-ink-3">Parsing slide hierarchy</div>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-ink-3 mx-auto" />
                  <div className="font-serif text-lg font-bold text-ink">
                    Click to select or drop pitch PDF
                  </div>
                  <div className="font-mono text-xs text-ink-3">
                    PDF pitch deck (Canva, Google Slides, or Keynote export)
                  </div>
                </>
              )}
            </label>

            {uploadError && (
              <div className="p-3 bg-danger/10 border border-danger/30 text-danger text-xs font-mono">
                {uploadError}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <span className="text-xs font-mono text-ink-3">
                Don't have a deck ready?
              </span>
              <button
                onClick={loadSampleDeck}
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
            {/* Left Column: Slide preview (cols 1-8) */}
            <div className="lg:col-span-8 space-y-4">
              <div
                className="border border-rule bg-paper-2 p-5 sm:p-8 min-h-[380px] sm:aspect-[16/10] flex flex-col justify-between overflow-hidden"
                style={{ borderRadius: "2px" }}
              >
                <div className="flex items-center justify-between border-b border-rule pb-3 text-xs font-mono">
                  <span className="font-semibold text-ink uppercase tracking-wider truncate max-w-[200px]">
                    {deckFileName}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-ink-3">
                      SLIDE {activeSlide + 1} OF {slides.length}
                    </span>
                    <span className="font-bold text-ink">
                      Time on slide: {formatTime(slideTimes[activeSlide] || 0)}
                    </span>
                  </div>
                </div>

                {/* Real slide canvas preview or typography layout */}
                <div className="my-auto py-6">
                  {currentSlide.thumbnailUrl ? (
                    <div className="border border-rule bg-paper shadow-sm overflow-hidden flex items-center justify-center max-h-[340px]">
                      <img
                        src={currentSlide.thumbnailUrl}
                        alt={`Slide ${activeSlide + 1}`}
                        className="w-full h-auto object-contain max-h-[340px]"
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <span className="text-[11px] font-mono uppercase tracking-widest text-signal font-bold">
                        {currentSlide.visualTag || "Slide Focus"}
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink leading-tight">
                        {currentSlide.title}
                      </h2>
                      {currentSlide.subtitle && (
                        <p className="font-sans text-sm sm:text-base text-ink-2">
                          {currentSlide.subtitle}
                        </p>
                      )}

                      <div className="mt-4 space-y-2">
                        {currentSlide.keyPoints?.map((point, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-ink-2 font-mono">
                            <span className="text-ink font-bold">•</span>
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-rule pt-3 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveSlide((prev) => Math.max(0, prev - 1))}
                      disabled={activeSlide === 0}
                      aria-label="Previous slide"
                      className="min-h-[44px] min-w-[44px] px-2 py-1 border border-rule hover:bg-paper disabled:opacity-30 inline-flex items-center justify-center"
                      style={{ borderRadius: "2px" }}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveSlide((prev) => Math.min(slides.length - 1, prev + 1))}
                      disabled={activeSlide === slides.length - 1}
                      aria-label="Next slide"
                      className="min-h-[44px] min-w-[44px] px-2 py-1 border border-rule hover:bg-paper disabled:opacity-30 inline-flex items-center justify-center"
                      style={{ borderRadius: "2px" }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-ink-3">Switch slides while speaking to audit individual slide cadence</span>
                </div>
              </div>

              {/* Slide Timeline Markers */}
              <div className="border border-rule bg-paper p-4 space-y-2" style={{ borderRadius: "2px" }}>
                <div className="flex justify-between text-xs font-mono text-ink-3">
                  <span>Slide Timeline</span>
                  <span className="font-bold text-ink">Slide {activeSlide + 1} active ({slideTimes[activeSlide] || 0}s)</span>
                </div>
                <div className="relative h-6 w-full flex items-center">
                  <div className="h-[1px] w-full bg-rule absolute" />
                  <div className="w-full flex justify-between relative z-10">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveSlide(i)}
                        aria-label={`Jump to slide ${i + 1}`}
                        className="w-11 h-11 -my-2.5 flex items-center justify-center focus:outline-none"
                      >
                        <span
                          className={`w-3 h-3 border ${
                            activeSlide === i
                              ? "bg-signal border-ink"
                              : "bg-paper-2 border-rule hover:border-ink"
                          }`}
                          style={{ borderRadius: "2px" }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Streaming Speech Transcript Box */}
              <div className="border border-rule bg-paper p-4 space-y-2" style={{ borderRadius: "2px" }}>
                <div className="flex items-center justify-between text-xs font-mono text-ink-3">
                  <span className="uppercase font-semibold flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-signal" />
                    Live Speech Transcription
                  </span>
                  <span className={isRecording ? "text-danger font-bold animate-pulse" : ""}>
                    {isRecording ? "Transcribing Voice..." : "Microphone Idle"}
                  </span>
                </div>

                <div className="p-3 bg-paper-2 border border-rule min-h-[80px] max-h-[140px] overflow-y-auto text-xs font-mono text-ink leading-relaxed">
                  {transcript ? (
                    <>
                      <span>{transcript}</span>
                      {interimText && <span className="text-ink-3 italic">{interimText}</span>}
                    </>
                  ) : (
                    <span className="text-ink-3 italic">
                      Click "Start Recording" and speak your pitch. Your live words, cadence, and filler words will stream here.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Telemetry Controls (cols 9-12) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Big mono stopwatch & mic indicator */}
              <div className="border border-ink bg-paper p-6 space-y-4" style={{ borderRadius: "2px" }}>
                <div className="flex items-center justify-between text-xs font-mono text-ink-3 uppercase tracking-wider">
                  <span>STOPWATCH</span>
                  <span className="font-bold text-ink">LIMIT {formatTime(targetTimeLimit)}</span>
                </div>

                <div className="font-mono text-4xl sm:text-5xl font-bold tracking-tight text-ink tabular-numbers">
                  {formatTime(elapsedSeconds)}
                </div>

                {/* Audio visualizer bar */}
                {isRecording && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-ink-3">
                      <span>Mic Level</span>
                      <span>{audioLevel}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-paper-2 overflow-hidden border border-rule">
                      <div
                        className="h-full bg-signal transition-all duration-75"
                        style={{ width: `${Math.min(audioLevel * 1.5, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Record Button */}
                <button
                  onClick={toggleRecording}
                  className={`w-full py-4 text-sm font-mono uppercase tracking-wider font-bold transition-colors flex items-center justify-center gap-2 ${
                    isRecording
                      ? "bg-danger text-paper animate-pulse"
                      : "bg-signal text-on-signal hover:opacity-95"
                  }`}
                  style={{ borderRadius: "2px" }}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="w-4 h-4" />
                      <span>Stop Rehearsal</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      <span>Start Rehearsal</span>
                    </>
                  )}
                </button>

                {speechError && (
                  <div className="text-[11px] font-mono text-danger pt-2 border-t border-rule">
                    {speechError}
                  </div>
                )}
              </div>

              {/* Real-time Telemetry Stats */}
              <div className="border border-rule bg-paper p-5 space-y-3" style={{ borderRadius: "2px" }}>
                <span className="text-xs font-mono uppercase text-ink-3 font-semibold block">
                  LIVE TELEMETRY
                </span>

                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-rule text-xs font-mono">
                  <div>
                    <span className="text-ink-3 block text-[11px]">SPEAKING PACE</span>
                    <span className="text-lg font-bold text-ink">
                      {currentWpm > 0 ? `${currentWpm} WPM` : "--"}
                    </span>
                  </div>
                  <div>
                    <span className="text-ink-3 block text-[11px]">OPTIMAL RANGE</span>
                    <span className="text-sm font-semibold text-success">130-150 WPM</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-rule">
                  <span className="text-xs font-mono text-ink-3 block mb-1.5">
                    FILLER WORDS DETECTED:
                  </span>
                  {fillerCounts.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {fillerCounts.map((f) => (
                        <span
                          key={f.word}
                          className="bg-danger/10 text-danger border border-danger/30 text-[11px] font-mono px-2 py-0.5"
                          style={{ borderRadius: "2px" }}
                        >
                          "{f.word}": {f.count}x
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[11px] font-mono text-ink-3 italic">
                      Zero filler words detected so far
                    </span>
                  )}
                </div>
              </div>

              {/* Progress to Questions */}
              <div className="border border-rule bg-paper-2 p-5 space-y-3" style={{ borderRadius: "2px" }}>
                <div className="font-serif text-lg font-bold text-ink">
                  Finished your presentation?
                </div>
                <p className="text-xs text-ink-2 font-sans">
                  Proceed to ruthless cross-examination. Real judges expect crisp 30-second defenses.
                </p>
                <button
                  onClick={proceedToQuestions}
                  className="w-full btn-signal text-xs py-2.5 px-4 font-semibold justify-center"
                >
                  <span>Proceed to Judge Questions</span>
                  <span className="arrow-nudge text-xs">→</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Judge Q&A Defense */}
        {currentStep === 3 && (
          <div className="max-w-2xl mx-auto py-6 space-y-6">
            <div className="text-left">
              <span className="text-xs font-mono uppercase tracking-widest text-ink-3 font-semibold block mb-2">
                STEP 03 / CROSS-EXAMINATION DEFENSE
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink mb-2">
                Defend your architecture
              </h1>
              <p className="text-ink-2 text-sm">
                Answer strictly within 30 seconds. Real judges penalize evasive or rambling answers.
              </p>
            </div>

            {isGeneratingQuestions ? (
              <div className="border border-rule bg-paper p-8 text-center space-y-3" style={{ borderRadius: "2px" }}>
                <Loader2 className="w-8 h-8 text-signal animate-spin mx-auto" />
                <div className="font-serif text-xl font-bold text-ink">
                  Generating customized judge scrutiny...
                </div>
                <p className="text-xs font-mono text-ink-3">
                  Analyzing your spoken transcript and slides to target weak points
                </p>
              </div>
            ) : (
              <div className="border border-ink bg-paper p-6 sm:p-8 space-y-6" style={{ borderRadius: "2px" }}>
                <div className="flex items-center justify-between pb-3 border-b border-rule text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-signal font-bold uppercase tracking-wider">
                      QUESTION {currentQuestionIdx + 1} OF {Math.max(1, judgeQuestions.length)}
                    </span>
                    <span className="text-ink-3">
                      • {judgeQuestions[currentQuestionIdx]?.judge || "Judging Panel"}
                    </span>
                  </div>
                  <span className="font-mono text-sm font-bold text-danger tabular-numbers">
                    0:{String(answerTime).padStart(2, "0")} remaining
                  </span>
                </div>

                <div className="bg-paper-2 border border-rule p-4">
                  <p className="font-serif text-xl text-ink italic leading-snug">
                    “{judgeQuestions[currentQuestionIdx]?.question || "How does your architecture handle scale and defensibility?"}”
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-ink-3">
                    <span>Your Spoken Answer:</span>
                    <span className={isAnswering ? "text-danger font-bold animate-pulse" : ""}>
                      {isAnswering ? "Recording verbal defense..." : "Mic ready"}
                    </span>
                  </div>

                  {qaAnswers[currentQuestionIdx] && (
                    <div className="p-3 bg-paper-2 border border-rule text-xs font-mono text-ink">
                      "{qaAnswers[currentQuestionIdx]}"
                    </div>
                  )}

                  <button
                    onClick={toggleAnswerRecording}
                    className={`w-full min-h-[44px] py-3 text-xs font-mono uppercase tracking-wider font-bold transition-colors ${
                      isAnswering
                        ? "bg-danger text-paper"
                        : "border border-ink hover:bg-paper-2 text-ink"
                    }`}
                    style={{ borderRadius: "2px" }}
                  >
                    {isAnswering ? "Finish Answering" : "Start Speaking Answer"}
                  </button>
                </div>

                {/* Question switchers */}
                {judgeQuestions.length > 1 && (
                  <div className="flex items-center justify-between pt-3 border-t border-rule text-xs font-mono">
                    <button
                      onClick={() => {
                        setCurrentQuestionIdx((prev) => Math.max(0, prev - 1));
                        setAnswerTime(30);
                      }}
                      disabled={currentQuestionIdx === 0}
                      className="px-3 py-1.5 border border-rule hover:bg-paper-2 disabled:opacity-30"
                    >
                      ← Previous Question
                    </button>
                    <button
                      onClick={() => {
                        setCurrentQuestionIdx((prev) => Math.min(judgeQuestions.length - 1, prev + 1));
                        setAnswerTime(30);
                      }}
                      disabled={currentQuestionIdx === judgeQuestions.length - 1}
                      className="px-3 py-1.5 border border-rule hover:bg-paper-2 disabled:opacity-30"
                    >
                      Next Question →
                    </button>
                  </div>
                )}

                <div className="pt-4 border-t border-rule flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-xs font-mono text-ink-3">
                    Ready for the final panel verdict?
                  </span>
                  <button
                    onClick={generateEvaluation}
                    disabled={isEvaluating}
                    className="btn-signal text-sm py-2.5 px-4 font-semibold disabled:opacity-50"
                  >
                    {isEvaluating ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Evaluating with AI Panel...</span>
                      </span>
                    ) : (
                      <>
                        <span>Generate Official Scoresheet</span>
                        <span className="arrow-nudge text-xs">→</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
