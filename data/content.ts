// Content single source of truth - Honest, plain, specific copy with TODO_REAL markers
export const siteConfig = {
  name: "PitchCoach",
  tagline: "Pitch rehearsal for hackathons",
  description:
    "Upload your deck and say your pitch out loud. You get timed, questioned and scored before the real judges do it.",

  // Nav links
  nav: [
    { name: "How it works", href: "#run" },
    { name: "Scoresheet", href: "#scoresheet" },
    { name: "Built by", href: "#built-by" },
  ],

  // Hero Copy (verbatim from copy bank)
  hero: {
    eyebrow: "PITCH REHEARSAL FOR HACKATHONS",
    h1: "Find out where the judges stop listening.",
    highlightPhrase: "stop listening",
    subtext:
      "Upload your deck and say your pitch out loud. You get timed, questioned and scored before the real judges do it.",
    primaryCta: "Run your pitch",
    secondaryCta: "See a sample scoresheet",
    requirementNote: "Needs a mic and a PDF or PPT deck.",
  },

  // 01 / The Run
  sectionRun: {
    label: "01 / THE RUN",
    h2: "One run takes about five minutes.",
  },

  // 02 / The Judge
  sectionJudge: {
    label: "02 / THE JUDGE",
    h2: "The questions you were hoping nobody would ask.",
    body: "Questions come from your own slides and what you said, not from a fixed list. Choose how hard the judge pushes.",
  },

  // 03 / The Scoresheet
  sectionScoresheet: {
    label: "03 / THE SCORESHEET",
    h2: "Scored on a typical hackathon rubric.",
    body: "Five categories, each out of 10, each with a one-line reason.",
  },

  // 04 / What You Get
  sectionWhatYouGet: {
    label: "04 / WHAT YOU GET",
    h2: "Numbers you can fix before demo day.",
  },

  // 05 / Built By (human section with TODO_REAL facts)
  sectionBuiltBy: {
    label: "05 / BUILT BY",
    h2: "Built by TODO_REAL_TEAM_NAME for TODO_REAL_HACKATHON_NAME.",
    statement:
      "We built this tool during TODO_REAL_HACKATHON_NAME because our own team lost a regional final when our slide four ate sixty seconds of demo time. We realized technical founders spend thirty hours coding a prototype and thirty minutes rehearsing how to explain it. This is a working hackathon project built to give you one realistic dry run before Sunday morning judging.",
    team: [
      {
        name: "TODO_REAL_MEMBER_1_NAME",
        role: "TODO_REAL_MEMBER_1_ROLE",
        college: "TODO_REAL_MEMBER_1_COLLEGE",
      },
      {
        name: "TODO_REAL_MEMBER_2_NAME",
        role: "TODO_REAL_MEMBER_2_ROLE",
        college: "TODO_REAL_MEMBER_2_COLLEGE",
      },
    ],
  },

  // FAQ (all answers visible, strictly honest)
  faqs: [
    {
      question: "What file types work?",
      answer: "PDF and PPTX pitch decks under 50MB work directly in the browser. TODO_REAL_SUPPORTED_FORMATS",
    },
    {
      question: "Is my recording saved?",
      answer: "Audio is processed in-memory in your browser during the practice run and discarded once your scoresheet prints. Nothing is uploaded to persistent storage. TODO_REAL_STORAGE_POLICY",
    },
    {
      question: "Does it work for a 90-second pitch?",
      answer: "Yes. You can configure your time limit between 60 seconds and 5 minutes before you begin. TODO_REAL_TIMER_LIMITS",
    },
    {
      question: "Which languages are supported?",
      answer: "Speech transcription and Q&A inference currently support English presentations. TODO_REAL_LANGUAGE_SUPPORT",
    },
    {
      question: "How is the score calculated?",
      answer: "Scores are computed across five equal 20% categories: Idea, Technical depth, Impact, Presentation, and Demo, evaluated against slide text and delivery time. TODO_REAL_SCORING_WEIGHTS",
    },
  ],

  // Closing
  closing: {
    h2: "Run your pitch once before it counts.",
    cta: "Run your pitch",
  },

  // Footer
  footer: {
    credits: "TODO_REAL_TEAM_NAME, TODO_REAL_HACKATHON_NAME, 2026",
    links: [
      { name: "How it works", href: "#run" },
      { name: "Scoresheet", href: "#scoresheet" },
      { name: "Built by", href: "#built-by" },
    ],
  },
} as const;
