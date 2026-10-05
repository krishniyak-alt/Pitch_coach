export interface Slide {
  id: number;
  title: string;
  subtitle: string;
  allocatedTime: number; // in seconds
  actualTime: number; // in seconds
  summary: string;
  keyPoints: string[];
  visualTag: string;
}

export interface RehearsalAttempt {
  id: string;
  title: string;
  date: string;
  totalTime: number; // seconds
  targetTime: number; // seconds
  overallScore: number;
  rubric: {
    idea: number;
    techDepth: number;
    impact: number;
    presentation: number;
    demo: number;
  };
  fillerWords: { word: string; count: number }[];
  status: "Needs Polish" | "Solid Contender" | "Winning Caliber";
}

export const mockSlides: Slide[] = [
  {
    id: 1,
    title: "The Problem: Great Code, Zero Stage Presence",
    subtitle: "Why 73% of hackathon finalists lose on Sunday afternoon",
    allocatedTime: 45,
    actualTime: 42,
    summary: "High friction hook detailing technical founders struggling to pitch.",
    keyPoints: [
      "36 hours building vs 4 minutes pitching",
      "Overrunning time limit on early intro slides",
      "Judges lose focus before the actual live demo",
    ],
    visualTag: "Problem & Market Hook",
  },
  {
    id: 2,
    title: "Introducing PitchCoach: The AI Stage Master",
    subtitle: "Real-time speech telemetry + ruthless hackathon judges",
    allocatedTime: 40,
    actualTime: 48,
    summary: "Value proposition and immediate solution mechanics.",
    keyPoints: [
      "Multimodal slide parsing in 3 seconds",
      "Voice telemetry tracks 140 WPM optimal cadence",
      "Simulates real judge Q&A before you walk on stage",
    ],
    visualTag: "Product Core Solution",
  },
  {
    id: 3,
    title: "System Architecture: Low-Latency Inference",
    subtitle: "WebRTC Audio Pipeline + Multimodal LLM Reasoning",
    allocatedTime: 65,
    actualTime: 71,
    summary: "Deep technical breakdown satisfying technical judge scrutiny.",
    keyPoints: [
      "Sub-80ms client-side audio streaming via WebAudio API",
      "Local filler-word phoneme classifier running on WebAssembly",
      "Vector embeddings of 500+ winning demo day transcripts",
    ],
    visualTag: "Technical Depth & Engine",
  },
  {
    id: 4,
    title: "Market Traction & Real Hackathon Validation",
    subtitle: "Tested across 2,000+ teams at MIT, Stanford & ETHGlobal",
    allocatedTime: 40,
    actualTime: 38,
    summary: "Social proof, conversion metrics, and prize outcomes.",
    keyPoints: [
      "Teams practicing 3+ times have 4.2x higher win rate",
      "94% reduction in overtime gong interruptions",
      "Average score increases by +24 points",
    ],
    visualTag: "Traction & Data Proof",
  },
  {
    id: 5,
    title: "The Vision & Sunday Afternoon Ask",
    subtitle: "From hackathon project to pre-seed venture",
    allocatedTime: 30,
    actualTime: 29,
    summary: "Call to action and memorable final takeaway.",
    keyPoints: [
      "Open beta available today at pitchcoach.ai",
      "Launching team tier for university hack clubs",
      "Thank you judges — opening for Q&A",
    ],
    visualTag: "Call To Action & Finish",
  },
];

export const mockRubricScores = {
  overall: 92,
  previousOverall: 74,
  axes: [
    { key: "idea", label: "Innovation & Idea", score: 9.4, max: 10, target: 8.5 },
    { key: "techDepth", label: "Technical Depth", score: 9.2, max: 10, target: 9.0 },
    { key: "impact", label: "Real-World Impact", score: 8.8, max: 10, target: 8.0 },
    { key: "presentation", label: "Presentation & Pacing", score: 8.5, max: 10, target: 9.0 },
    { key: "demo", label: "Live Demo Execution", score: 9.6, max: 10, target: 8.5 },
  ],
  strengths: [
    "Compelling opening hook with relatable hackathon pain point",
    "Crystal clear explanation of WebAudio & WASM architecture on slide 3",
    "Crisp, confident live demo transition with no hesitation",
    "Maintained ideal 142 WPM speech rate through 85% of the pitch",
  ],
  improvements: [
    "Slight hesitation on Slide 2 transition caused a 6-second delay",
    "Said 'basically' 4 times while explaining the database pipeline",
    "Prepare a crisper 10-second answer regarding OpenAI feature parity",
  ],
};

export const mockFillerWords = [
  { word: "um", count: 4, timestamp: "01:14, 02:08, 03:22" },
  { word: "like", count: 6, timestamp: "00:45, 01:30, 02:15, 02:50" },
  { word: "basically", count: 4, timestamp: "01:52, 02:30, 03:05" },
  { word: "you know", count: 2, timestamp: "03:12, 03:40" },
];

export const mockJudgeQuestions = [
  {
    judge: "Marcus Vance (VC)",
    question: "What prevents OpenAI or Google from shipping this exact workflow as a default feature?",
    suggestedAnswer: "Point out your proprietary dataset of 5,000+ real hackathon rubric outcomes, your low-latency client WASM engine, and your integrations directly into hackathon submission platforms.",
  },
  {
    judge: "Dr. Elena Rostova (Principal Architect)",
    question: "How does your client-side audio analysis handle packet loss during a shaky university WiFi connection?",
    suggestedAnswer: "Explain the local WebAssembly buffer that continues scoring phonemes offline and synchronizes embeddings when the connection stabilizes.",
  },
  {
    judge: "Kai Takahashi (Product Lead)",
    question: "If the speaker starts choking or losing their train of thought, how does the interface gracefully guide them without causing more panic?",
    suggestedAnswer: "Describe the subtle visual grounding cues and one-sentence glanceable recovery anchors displayed on the teleprompter edge.",
  },
  {
    judge: "Devon Reed (The Skeptic)",
    question: "Did you actually train a custom model, or is this just an ungrounded prompt wrapper over GPT-4o?",
    suggestedAnswer: "Cite the fine-tuned rubric scoring weights, the custom phoneme acoustic classifier, and the live benchmark tests on GitHub.",
  },
];

export const mockDashboardAttempts: RehearsalAttempt[] = [
  {
    id: "run-05",
    title: "Final Sunday Polish (v5)",
    date: "Today at 02:15 PM",
    totalTime: 228,
    targetTime: 240,
    overallScore: 92,
    rubric: { idea: 9.4, techDepth: 9.2, impact: 8.8, presentation: 8.5, demo: 9.6 },
    fillerWords: [
      { word: "um", count: 2 },
      { word: "like", count: 3 },
    ],
    status: "Winning Caliber",
  },
  {
    id: "run-04",
    title: "Slide 3 Timing Tighten (v4)",
    date: "Today at 11:30 AM",
    totalTime: 246,
    targetTime: 240,
    overallScore: 86,
    rubric: { idea: 9.0, techDepth: 9.0, impact: 8.4, presentation: 8.1, demo: 8.5 },
    fillerWords: [
      { word: "um", count: 5 },
      { word: "basically", count: 4 },
    ],
    status: "Solid Contender",
  },
  {
    id: "run-03",
    title: "Adding Tech Architecture (v3)",
    date: "Yesterday at 09:40 PM",
    totalTime: 268,
    targetTime: 240,
    overallScore: 79,
    rubric: { idea: 8.8, techDepth: 8.5, impact: 7.8, presentation: 7.2, demo: 7.4 },
    fillerWords: [
      { word: "like", count: 8 },
      { word: "um", count: 7 },
    ],
    status: "Needs Polish",
  },
  {
    id: "run-02",
    title: "Rough Run with Demo (v2)",
    date: "Yesterday at 04:20 PM",
    totalTime: 295,
    targetTime: 240,
    overallScore: 72,
    rubric: { idea: 8.5, techDepth: 7.9, impact: 7.2, presentation: 6.5, demo: 6.0 },
    fillerWords: [
      { word: "like", count: 12 },
      { word: "basically", count: 6 },
    ],
    status: "Needs Polish",
  },
  {
    id: "run-01",
    title: "Initial Deck Draft (v1)",
    date: "Yesterday at 11:00 AM",
    totalTime: 320,
    targetTime: 240,
    overallScore: 64,
    rubric: { idea: 8.0, techDepth: 7.0, impact: 6.8, presentation: 5.5, demo: 4.8 },
    fillerWords: [
      { word: "um", count: 16 },
      { word: "you know", count: 8 },
    ],
    status: "Needs Polish",
  },
];
