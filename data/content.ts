export const siteConfig = {
  name: "PitchCoach",
  shortName: "PitchCoach",
  tagline: "The AI Hackathon Pitch Coach",
  description:
    "Upload your deck, speak your pitch, and face tough AI judges. Real-time pacing, brutal Q&A, and official hackathon rubric scoring.",
  badge: "New: AI Judge Mode 2.0",
  socialProof: "Used by 2,000+ hackathon teams at MIT, Stanford & ETHGlobal",
  hero: {
    headlineStart: "Rehearse like the ",
    headlineGradient: "judges are already watching.",
    subheadline:
      "Upload your slides, pitch into your mic, and face ruthless AI judges who grill your architecture, track your per-slide timing, and grade you on the official hackathon rubric.",
    ctaPrimary: "Upload your deck",
    ctaSecondary: "Watch interactive demo",
    statBadge: "Top 1% Pitch Score",
  },
  marqueeLogos: [
    { name: "ETHGlobal", category: "Global Web3 Hackathons" },
    { name: "HackMIT", category: "MIT flagship hackathon" },
    { name: "PennApps", category: "Original college hackathon" },
    { name: "CalHacks", category: "UC Berkeley world's largest" },
    { name: "TreeHacks", category: "Stanford hackathon" },
    { name: "LA Hacks", category: "UCLA innovation challenge" },
    { name: "YC Hacks", category: "Y Combinator community" },
    { name: "HackPrinceton", category: "Princeton University" },
    { name: "MHacks", category: "University of Michigan" },
  ],
  problem: {
    badge: "The Brutal Truth",
    statement:
      "You spent 36 sleepless hours architecting world-changing code. Then you step on stage for 4 minutes—and run out of time on slide 3. Great hacks die from bad pitches.",
    stats: [
      {
        value: 73,
        suffix: "%",
        label: "Of teams run over time",
        detail: "Cut off mid-demo by the strict timer gong",
      },
      {
        value: 4,
        suffix: " min",
        label: "Average pitch window",
        detail: "To explain months of technical complexity",
      },
      {
        value: 1,
        suffix: " shot",
        label: "To impress the judges",
        detail: "Zero do-overs when the demo fails on stage",
      },
    ],
  },
  howItWorks: {
    badge: "The Rehearsal Loop",
    title: "From shaky run-through to winning keynote",
    description: "Four orchestrated steps to sharpen your delivery, lock down your timing, and anticipate the most savage questions before stage lights turn on.",
    steps: [
      {
        step: "01",
        title: "Upload your deck",
        subtitle: "Instant slide parsing & pacing baseline",
        description:
          "Drop your PDF or PPT slides. Our vision model parses your flow, calculates optimal time allocations per slide, and identifies risky technical claims.",
        tag: "Auto Slide Parsing",
      },
      {
        step: "02",
        title: "Speak your pitch",
        subtitle: "Real-time acoustic & cadence telemetry",
        description:
          "Talk into your microphone naturally. PitchCoach maps your words-per-minute, flags filler words in red, and rings silent warnings if you linger too long on slide 2.",
        tag: "Audio Waveform & Pace",
      },
      {
        step: "03",
        title: "Face the judge",
        subtitle: "Dynamic Q&A tailored to your specific hack",
        description:
          "The AI assumes top hackathon judge personas—from skeptical VCs to ruthless senior architects—and fires probing follow-up questions right at your blind spots.",
        tag: "Adaptive Follow-ups",
      },
      {
        step: "04",
        title: "Get your score",
        subtitle: "Full rubric radar & actionable improvements",
        description:
          "Receive a granular breakdown across Idea, Technical Depth, Impact, Presentation, and Live Demo, with timestamped audio tips on how to win.",
        tag: "5-Axis Hackathon Rubric",
      },
    ],
  },
  features: {
    badge: "Engineered for Winners",
    title: "Everything you need to clinch 1st place",
    description: "Deep speech intelligence and real hackathon judging rubrics packed into one responsive studio.",
    items: [
      {
        id: "smart-timing",
        title: "Smart Slide Timing",
        description:
          "Automatic per-slide budget allocation. Visual pace alerts keep you from stalling on architecture diagrams.",
        badge: "Zero overtime",
        colSpan: "lg:col-span-4",
      },
      {
        id: "ai-judge-mode",
        title: "Ruthless AI Judges",
        description:
          "Select your judge's persona: The VC interrogating your TAM, or the Tech Lead auditing your database concurrency.",
        badge: "Live Q&A",
        colSpan: "lg:col-span-4",
      },
      {
        id: "rubric-scoring",
        title: "Official Rubric Radar",
        description:
          "Calibrated against standard major hackathon criteria: Idea, Tech Depth, Impact, Presentation, and Working Demo.",
        badge: "5-Axis Evaluation",
        colSpan: "lg:col-span-4",
      },
      {
        id: "filler-detector",
        title: "Filler Word Annihilator",
        description:
          "Instant detection of 'like', 'um', 'basically', and 'you know' with real-time acoustic feedback.",
        badge: "Clean delivery",
        colSpan: "lg:col-span-6",
      },
      {
        id: "pace-clarity",
        title: "Pace & Clarity Gauge",
        description:
          "Tracks words per minute in real time. Guides you into the golden 130-155 WPM hackathon sweet spot.",
        badge: "Cadence telemetry",
        colSpan: "lg:col-span-6",
      },
      {
        id: "slide-aware",
        title: "Slide-Aware Contextual Insight",
        description:
          "The AI visually inspects your slides as you speak, verifying that your audio matches what's on the screen.",
        badge: "Multimodal AI",
        colSpan: "lg:col-span-7",
      },
      {
        id: "progress-tracking",
        title: "Progress Over Attempts",
        description:
          "Watch your composite score climb from 68 to 94 across 5 practice rounds before Sunday morning judging.",
        badge: "+26 pts average",
        colSpan: "lg:col-span-5",
      },
    ],
  },
  judges: [
    {
      id: "investor",
      name: "Marcus Vance",
      role: "The Tier-1 VC Partner",
      avatar: "💼",
      gradient: "from-purple-500/20 via-pink-500/20 to-purple-600/30",
      intensity: "High (8/10)",
      intensityVal: 80,
      focus: "Market Size, Moat & Monetization",
      sampleQuestion:
        "“Your demo looks sleek, but what prevents OpenAI or Anthropic from shipping this as an API toggle next Tuesday?”",
      personality: "Pragmatic, impatient, obsessed with unit economics and defensibility.",
    },
    {
      id: "tech-lead",
      name: "Dr. Elena Rostova",
      role: "The Principal Architect",
      avatar: "⚡",
      gradient: "from-cyan-500/20 via-blue-500/20 to-indigo-600/30",
      intensity: "Brutal (10/10)",
      intensityVal: 100,
      focus: "Concurrency, Fault Tolerance & Latency",
      sampleQuestion:
        "“You claim sub-50ms inference at the edge. How are you handling vector indexing conflicts under high write workloads?”",
      personality: "Zero tolerance for buzzwords. Will ask to see your raw repo commit history.",
    },
    {
      id: "product-designer",
      name: "Kai Takahashi",
      role: "The Staff Product Lead",
      avatar: "✨",
      gradient: "from-emerald-500/20 via-teal-500/20 to-cyan-600/30",
      intensity: "Balanced (6/10)",
      intensityVal: 60,
      focus: "Ergonomics, Onboarding & User Retention",
      sampleQuestion:
        "“In your first 30 seconds of onboarding, where is the friction drop-off, and why would a non-technical user trust this?”",
      personality: "Deep empathy, evaluates clarity of messaging and product delight.",
    },
    {
      id: "skeptic",
      name: "Devon Reed",
      role: "The Seasoned Hacker / Angel",
      avatar: "🎯",
      gradient: "from-rose-500/20 via-orange-500/20 to-amber-600/30",
      intensity: "Maximum (9/10)",
      intensityVal: 90,
      focus: "Smoke & Mirrors Detection",
      sampleQuestion:
        "“Did you hardcode that API response for this presentation, or can I paste my own custom payload into your deployed endpoint right now?”",
      personality: "Has judged 40+ hackathons. Smells simulated demos from a mile away.",
    },
  ],
  testimonials: [
    {
      name: "Siddharth Nair",
      role: "Grand Prize Winner",
      event: "ETHGlobal Istanbul",
      quote:
        "PitchCoach's 'Principal Architect' judge asked us the EXACT concurrency question that Vitalik asked us 2 hours later. We had our answer locked down and won 1st place.",
      score: "96 / 100",
      avatar: "SN",
    },
    {
      name: "Chloe Chen",
      role: "Best AI Application",
      event: "HackMIT 2024",
      quote:
        "We always ran out of time on our live demo slide. PitchCoach gave us a visual pacing bar that forced us to cut 45 seconds of fluff. Pitch went off without a hitch.",
      score: "94 / 100",
      avatar: "CC",
    },
    {
      name: "Alexandre Moreau",
      role: "1st Place Overall",
      event: "CalHacks 11.0",
      quote:
        "The filler word detector is humiliating at first, but after 3 runs our speech was razor-sharp. Judges complimented our poise on stage.",
      score: "98 / 100",
      avatar: "AM",
    },
    {
      name: "Priya Patel",
      role: "Founder & YC W25",
      event: "TreeHacks Winner",
      quote:
        "PitchCoach is the secret weapon for any hackathon team that wants to transition into raising a real pre-seed round right from demo day.",
      score: "95 / 100",
      avatar: "PP",
    },
    {
      name: "Liam O'Connor",
      role: "Best Hardware & IoT Hack",
      event: "PennApps XXIV",
      quote:
        "The radar chart showed our presentation was lagging behind our tech depth. We revised our hook and ended up taking the hardware grand prize.",
      score: "93 / 100",
      avatar: "LO",
    },
    {
      name: "Maya Lin",
      role: "Top 3 Finalist",
      event: "HackTheNorth",
      quote:
        "Rehearsing against Devon Reed the skeptic judge gave our team goosebumps. We walked onto the stage completely fearless.",
      score: "97 / 100",
      avatar: "ML",
    },
  ],
  pricing: {
    badge: "Simple Pricing",
    title: "Invest in victory before demo Sunday",
    description: "Every tier includes slide parsing, audio rehearsal, and instant rubric scoring.",
    tiers: [
      {
        name: "Hacker Free",
        priceMonthly: 0,
        priceYearly: 0,
        description: "Perfect for a single weekend hackathon run-through.",
        badge: "Free Forever",
        features: [
          "3 full deck rehearsals per month",
          "Up to 5 minutes pitch limit",
          "Standard AI Judge persona",
          "Basic time-per-slide breakdown",
          "Filler word count summary",
          "Community Discord support",
        ],
        cta: "Start Free",
        popular: false,
      },
      {
        name: "Builder Pro",
        priceMonthly: 19,
        priceYearly: 15,
        description: "For serial hackers and founders preparing for high-stakes stages.",
        badge: "Most Popular",
        features: [
          "Unlimited pitch rehearsals",
          "All 4 brutal AI Judge personas",
          "Live audio waveform & speech pace gauge",
          "5-axis hackathon radar score & exportable PDF",
          "Deep slide-aware visual context check",
          "Custom judge intensity slider (1-10)",
          "Audio playback with timestamped tips",
        ],
        cta: "Get Builder Pro",
        popular: true,
      },
      {
        name: "Hackathon Squad",
        priceMonthly: 49,
        priceYearly: 39,
        description: "For 4-person teams collaborating on joint pitch delivery.",
        badge: "Team Pass",
        features: [
          "Everything in Builder Pro for up to 5 members",
          "Multi-speaker speaker transition cues",
          "Shared team rehearsal dashboard",
          "Private custom judge persona creation",
          "Exportable investor one-pager deck report",
          "Priority GPU inference queuing",
        ],
        cta: "Upgrade Team",
        popular: false,
      },
    ],
  },
  faq: [
    {
      question: "How does PitchCoach know the official hackathon criteria?",
      answer:
        "We calibrated our scoring engine on historical judging rubrics from major hackathons including Major League Hacking (MLH), ETHGlobal, HackMIT, and Stanford TreeHacks. It evaluates across five explicit vectors: Innovation & Originality, Technical Depth & Execution, Potential Real-world Impact, Presentation Clarity, and Live Functional Demo.",
    },
    {
      question: "Does PitchCoach listen to me in real time as I speak?",
      answer:
        "Yes! Using low-latency speech recognition and acoustic analysis, PitchCoach processes your audio stream in browser memory to compute cadence (words per minute), pause distribution, and filler-word spikes in real time.",
    },
    {
      question: "Can I upload PowerPoint, PDF, or Figma exports?",
      answer:
        "We support PDF, PPTX, Google Slides (via export or share link), and PNG/JPEG slide exports. Our multimodal vision system parses text, diagrams, and architecture charts directly from the slides.",
    },
    {
      question: "What makes the AI Judge questions different from normal ChatGPT?",
      answer:
        "Our AI judges are conditioned on real winning and losing hackathon Q&A logs. Rather than polite generic compliments, they actively look for gaps: unmentioned competitor moats, unproven backend claims, hand-waved data pipelines, and missing business models.",
    },
    {
      question: "What if I get stage fright or freeze during rehearsal?",
      answer:
        "PitchCoach has a 'Gentle Mode' that pauses the timer, offers breathing cues, and gives you a one-sentence hook prompt to get back on track without losing composure.",
    },
    {
      question: "Can we use PitchCoach for YC or investor pitch practice too?",
      answer:
        "Absolutely. While built around hackathons, selecting 'Marcus Vance (The Tier-1 VC)' switches the rubric to focus on market size, team velocity, retention metrics, and competitive moat.",
    },
    {
      question: "Is my deck and audio kept private?",
      answer:
        "Yes. Your slide uploads, microphone audio, and transcripts are strictly private to your session. We do not use user rehearsal sessions to train public foundation models.",
    },
  ],
  navLinks: [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Live Demo", href: "#demo" },
    { name: "Scoring Rubric", href: "#scoring" },
    { name: "Judges", href: "#judges" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
  ],
};
