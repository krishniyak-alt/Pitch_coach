export interface RubricCategory {
  category: string;
  weight: string;
  criterion: string;
  comment: string;
  score: number; // out of 10
}

export interface JudgeQA {
  question: string;
  answer: string;
}

export const samplePitch = {
  name: "FloodPing",
  tagline: "SMS flood alerts for villages",
  deckFileName: "floodping-final-v3.pdf",
  slideCount: 6,
  timeLimit: "03:00",
  timeLimitSec: 180,
  runLabel: "Run 4 of 4",
  runShort: "RUN 4",
  recordedTime: "02:47",
  recordedTimeSec: 167,
  overallScore: "6.6 / 10",
  overallScoreNum: 6.6,
  marginNote: "slide 4: you lost me here",
  marginTargetCategory: "Presentation",

  // 03 / The Scoresheet table rows
  rubric: [
    {
      category: "Idea",
      weight: "20%",
      criterion: "Clear problem. You said who it helps in the first 20 seconds.",
      comment: "Clear problem. You said who it helps in the first 20 seconds.",
      score: 8,
    },
    {
      category: "Technical depth",
      weight: "20%",
      criterion: "Architecture, trade-offs, and why this stack.",
      comment: "You named the stack but not why SMS over an app.",
      score: 6,
    },
    {
      category: "Impact",
      weight: "20%",
      criterion: "Real-world reach and verifiable target audience.",
      comment: "Good reach numbers, but the source was not on the slide.",
      score: 7,
    },
    {
      category: "Presentation",
      weight: "20%",
      criterion: "Slide clarity, pacing, and visual signal.",
      comment: "Slide 4 had nine numbers. Judges stopped reading.",
      score: 5,
    },
    {
      category: "Demo",
      weight: "20%",
      criterion: "Working execution and contingency handling.",
      comment: "Live demo worked. The fallback screenshot saved you at 2:10.",
      score: 7,
    },
  ] as RubricCategory[],

  // 01 / The Run timeline milestones
  timeline: [
    {
      time: "00:00",
      label: "Upload",
      summary: "Drop in your deck. We extract the slide count, headline claims, and allocate a pacing target per slide.",
      detail: "floodping-final-v3.pdf, 6 slides",
    },
    {
      time: "00:30",
      label: "Pitch",
      summary: "Speak through your slides with a live stopwatch. Slide transitions are marked automatically.",
      detail: "Running clock with slide cadence markers",
    },
    {
      time: "03:00",
      label: "Time",
      summary: "The clock stops at 03:00. The microphone cuts, locking your delivery time.",
      detail: "02:47 recorded delivery (13s under limit)",
    },
    {
      time: "03:05",
      label: "Questions",
      summary: "A simulated judge grills you on your weak points with a strict 30-second countdown per answer.",
      detail: "3 targeted questions drawn from slide text",
    },
    {
      time: "05:00",
      label: "Scoresheet",
      summary: "A completed scoresheet prints with breakdown scores, slide pacing alerts, and margin notes.",
      detail: "6.6 / 10 overall composite report",
    },
  ],

  // 02 / The Judge questions & student responses
  judgeQuestions: {
    Friendly: [
      {
        question: "How does a village get set up with FloodPing?",
        answer:
          "The village chief registers a single phone number on our USSD menu, which takes under two minutes. From there, anyone on that local cell tower can opt in by replying YES.",
      },
      {
        question: "Where do the flood readings come from?",
        answer:
          "We pull water level feeds from open government hydrological stations and cross-reference with SMS reports from vetted local water watch volunteers.",
      },
      {
        question: "What would you build next?",
        answer:
          "We want to add solar-powered acoustic stream sensors so we don't depend entirely on manual gauge reports.",
      },
    ] as JudgeQA[],

    Fair: [
      {
        question: "Who pays for this after the hackathon ends?",
        answer:
          "The SMS egress costs about half a cent per message. In our model, regional disaster management agencies subsidize it as emergency broadcast infrastructure.",
      },
      {
        question: "Floods knock out the network first. What does the alert do then?",
        answer:
          "SMS queues on standard 2G carrier control channels even when data networks collapse, but I think if the tower physically loses power, we probably fail over to cached radio alerts.",
      },
      {
        question: "Why would a village trust an alert from an app it has never heard of?",
        answer:
          "The messages come from the local district disaster prefix that residents already recognize, not an unfamiliar shortcode.",
      },
    ] as JudgeQA[],

    Brutal: [
      {
        question: "Government flood alerts already exist. Why is this not a duplicate?",
        answer:
          "Government alerts broadcast via smartphone push notifications or TV banners. Our target villages have zero smartphones and frequent power outages. Nobody saw the 2024 warning until the bridge was under water.",
      },
      {
        question: "One false alarm and nobody opens your SMS again. What is your false alarm rate?",
        answer:
          "Right now we require two independent river sensors to hit threshold before dispatching a red alert, but to be honest our threshold tuning on flash floods is probably around ten percent false positives in early monsoon.",
      },
      {
        question: "You have two students and no sensors. Why should we believe this works?",
        answer:
          "We didn't manufacture sensors for this weekend. We built the real-time ingest pipeline hooked into the national river basin API, and we tested delivery latency to fifty SIM cards in four districts in under twelve seconds.",
      },
    ] as JudgeQA[],
  },

  // 04 / What You Get specs
  specRows: [
    {
      title: "Timing per slide",
      mono: "S4 52s / 30s share",
      description: "Every slide gets a share of your time limit. You see which ones ate the rest.",
    },
    {
      title: "Filler words",
      mono: "um x9  like x14  basically x6",
      description: "Counted from the transcript and listed by slide.",
    },
    {
      title: "Pace",
      mono: "162 wpm (target 130-160)",
      description: "Words per minute for the whole run and for each slide.",
    },
    {
      title: "Follow-up questions",
      mono: "3 questions, 30s each",
      description: "Built from your slides and from what you actually said.",
    },
    {
      title: "Run history",
      mono: "5.1 > 5.8 > 6.2 > 6.6",
      description: "Compare runs to see what your last change fixed.",
    },
  ],
} as const;
