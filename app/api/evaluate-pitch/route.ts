import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { EvaluationResult, PitchRubricItem, SlideCadenceItem } from "@/lib/types";

export const maxDuration = 60; // Allow sufficient time for AI generation

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      deckName = "Untitled Pitch",
      totalDurationSec = 180,
      targetDurationSec = 180,
      transcript = "",
      slideData = [],
      qaResponses = [],
    } = body;

    const apiKey =
      req.headers.get("x-gemini-key") ||
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    // If Gemini API Key is available, use Google GenAI
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });

        const prompt = `
You are an elite, ruthlessly honest Hackathon Judging Panel at a tier-1 event (like MIT HackMIT, ETHGlobal, or Y Combinator Hackathon).
You consist of 3 judges:
1. Marcus Vance (Tier-1 VC Partner - focuses on market hook, pain point, and moats)
2. Dr. Elena Rostova (Principal Infrastructure Architect - focuses on technical depth, architecture, and realistic trade-offs)
3. Kai Takahashi (Principal Product Designer - focuses on user flow, demo execution, and storytelling)

Here is the founder's pitch data:
- Deck Name: "${deckName}"
- Target Presentation Limit: ${targetDurationSec} seconds (${Math.round(targetDurationSec / 60)} minutes)
- Actual Recorded Presentation Time: ${totalDurationSec} seconds
- Verbal Transcript of what they said:
"""
${transcript || "[Founder spoke with minimal recorded verbal transcript or rehearsed with slides only.]"}
"""

- Slide Breakdown and Time Spent:
${slideData
  .map(
    (s: any, idx: number) =>
      `Slide ${idx + 1}: "${s.title || "Untitled"}" | Allocated: ${s.allocatedTime || 30}s | Actual time spent: ${s.actualTime || 0}s\nSlide Text: ${s.text ? s.text.substring(0, 300) : "No text"}`
  )
  .join("\n\n")}

${
  qaResponses && qaResponses.length > 0
    ? `- Cross-Examination Q&A during Judge Defense:
${qaResponses
  .map(
    (qa: any, idx: number) =>
      `Q${idx + 1} (${qa.judge || "Judge"}): "${qa.question}"\nFounder Answer: "${qa.userAnswer || "[No answer given]"}"`
  )
  .join("\n")}`
    : ""
}

TASK:
Provide an official, realistic, calibrated Hackathon Rubric Evaluation.
Return ONLY a valid JSON object matching the following structure with no markdown code fences:
{
  "overallScore": number (0.0 to 10.0, e.g. 7.4),
  "status": "Needs Polish" | "Solid Contender" | "Winning Caliber",
  "marginNote": string (short 5-8 word ruthless judge whisper, e.g. "slide 3: lost us in the weeds"),
  "marginTargetCategory": "Idea" | "Technical depth" | "Impact" | "Presentation" | "Demo",
  "rubric": [
    {
      "category": "Idea",
      "weight": "20%",
      "criterion": "Clear problem hook within first 30s and compelling solution.",
      "comment": "Specific constructive judge critique based on what they said.",
      "score": number (0 to 10)
    },
    {
      "category": "Technical depth",
      "weight": "20%",
      "criterion": "Real architecture, technical trade-offs, and non-trivial implementation.",
      "comment": "Specific critique of their technical explanation.",
      "score": number (0 to 10)
    },
    {
      "category": "Impact",
      "weight": "20%",
      "criterion": "Real-world utility, user traction logic, and distribution.",
      "comment": "Specific critique of the viability.",
      "score": number (0 to 10)
    },
    {
      "category": "Presentation",
      "weight": "20%",
      "criterion": "Pacing, slide clarity, cadence, and conciseness.",
      "comment": "Specific critique of their pacing and overtime/undertime balance.",
      "score": number (0 to 10)
    },
    {
      "category": "Demo",
      "weight": "20%",
      "criterion": "Product walk-through credibility and UI clarity.",
      "comment": "Critique of how well the demo was presented.",
      "score": number (0 to 10)
    }
  ],
  "slidePacing": [
    {
      "slide": "Slide 1: Title",
      "time": "XXs",
      "target": "XXs",
      "share": number (fraction of total time, e.g. 0.2),
      "alert": "string if severely over or under target, else null"
    }
  ],
  "fillerWords": [
    { "word": "um", "count": number }
  ],
  "strengths": [
    "Specific highlight 1",
    "Specific highlight 2",
    "Specific highlight 3"
  ],
  "improvements": [
    "Actionable critique 1",
    "Actionable critique 2",
    "Actionable critique 3"
  ],
  "judgeQuestions": [
    {
      "judge": "Marcus Vance (VC)",
      "question": "Sharp question about defensibility or unit economics",
      "suggestedAnswer": "Crisp 1-2 sentence ideal rebuttal"
    },
    {
      "judge": "Dr. Elena Rostova (Principal Architect)",
      "question": "Deep architectural or failure mode question",
      "suggestedAnswer": "Crisp 1-2 sentence ideal rebuttal"
    },
    {
      "judge": "Kai Takahashi (Product Lead)",
      "question": "UX friction or user onboarding question",
      "suggestedAnswer": "Crisp 1-2 sentence ideal rebuttal"
    }
  ]
}
`;

        let response;
        try {
          response = await ai.models.generateContent({
            model: "models/gemini-flash-latest",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              temperature: 0.2,
            },
          });
        } catch (mErr) {
          response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              temperature: 0.2,
            },
          });
        }

        const rawText = response.text || "";
        const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanJson);

        const result: EvaluationResult = {
          id: `run-${Date.now()}`,
          deckName,
          date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          totalDurationSec,
          targetDurationSec,
          overallScore: parsed.overallScore || 7.0,
          overallScoreFormatted: `${(parsed.overallScore || 7.0).toFixed(1)} / 10`,
          status: parsed.status || (parsed.overallScore >= 8.5 ? "Winning Caliber" : parsed.overallScore >= 7.0 ? "Solid Contender" : "Needs Polish"),
          marginNote: parsed.marginNote || "Good effort, tighten pacing",
          marginTargetCategory: parsed.marginTargetCategory || "Presentation",
          rubric: parsed.rubric || [],
          slidePacing: parsed.slidePacing && parsed.slidePacing.length > 0 ? parsed.slidePacing : generateSlidePacing(slideData, totalDurationSec, targetDurationSec),
          fillerWords: parsed.fillerWords || extractLocalFillerWords(transcript),
          strengths: parsed.strengths || ["Crisp concept introduction"],
          improvements: parsed.improvements || ["Tighten technical explanations"],
          judgeQuestions: parsed.judgeQuestions || [],
          transcript,
          wpm: calculateWpm(transcript, totalDurationSec),
          aiProvider: "gemini",
        };

        return NextResponse.json(result);
      } catch (geminiError: any) {
        console.error("Gemini evaluation error, falling back to heuristic:", geminiError);
        // Fall back to heuristic below if Gemini fails
      }
    }

    // Heuristic / Local Telemetry Evaluation (when no Gemini API key is configured or on network issue)
    const heuristicResult = buildHeuristicEvaluation({
      deckName,
      totalDurationSec,
      targetDurationSec,
      transcript,
      slideData,
      qaResponses,
    });

    return NextResponse.json(heuristicResult);
  } catch (err: any) {
    console.error("API Error in evaluate-pitch:", err);
    return NextResponse.json(
      { error: err.message || "Failed to evaluate pitch" },
      { status: 500 }
    );
  }
}

function extractLocalFillerWords(transcript: string) {
  const fillers = ["um", "uh", "like", "basically", "you know", "actually"];
  const lower = ` ${transcript.toLowerCase().replace(/[^a-z0-9 ]/g, " ")} `;
  return fillers
    .map((word) => {
      const match = lower.match(new RegExp(`\\b${word}\\b`, "g"));
      return { word, count: match ? match.length : 0 };
    })
    .filter((f) => f.count > 0);
}

function calculateWpm(transcript: string, totalSec: number): number {
  if (totalSec < 5 || !transcript.trim()) return 0;
  const words = transcript.trim().split(/\s+/).length;
  return Math.round(words / (totalSec / 60));
}

function generateSlidePacing(slideData: any[], totalSec: number, targetSec: number): SlideCadenceItem[] {
  if (!slideData || slideData.length === 0) {
    return [
      { slide: "Slide 1: Intro", time: `${totalSec}s`, target: `${targetSec}s`, share: 1 },
    ];
  }

  const effectiveTotal = Math.max(totalSec, 1);
  return slideData.map((s, idx) => {
    const actual = s.actualTime || Math.round(totalSec / slideData.length);
    const target = s.allocatedTime || Math.round(targetSec / slideData.length);
    const share = Number((actual / effectiveTotal).toFixed(2));
    const isOver = actual > target + 15;
    const isUnder = actual < target - 15;

    return {
      slide: `Slide ${idx + 1}: ${s.title || `Section ${idx + 1}`}`,
      time: `${actual}s`,
      target: `${target}s`,
      share,
      alert: isOver
        ? `Ate ${actual}s (+${actual - target}s over)`
        : isUnder
        ? `Rushed: only ${actual}s (-${target - actual}s)`
        : undefined,
    };
  });
}

function buildHeuristicEvaluation(data: {
  deckName: string;
  totalDurationSec: number;
  targetDurationSec: number;
  transcript: string;
  slideData: any[];
  qaResponses: any[];
}): EvaluationResult {
  const { deckName, totalDurationSec, targetDurationSec, transcript, slideData } = data;
  const wordCount = transcript ? transcript.trim().split(/\s+/).length : 0;
  const wpm = calculateWpm(transcript, totalDurationSec);
  const overtimeSec = totalDurationSec - targetDurationSec;

  // Calculate scores
  let presentationScore = 8.0;
  if (overtimeSec > 30) presentationScore -= 2.5;
  else if (overtimeSec > 10) presentationScore -= 1.0;
  else if (overtimeSec < -40) presentationScore -= 1.5;

  if (wpm > 175) presentationScore -= 1.0;
  else if (wpm < 100 && wpm > 0) presentationScore -= 1.0;

  const fillers = extractLocalFillerWords(transcript);
  const totalFillers = fillers.reduce((sum, f) => sum + f.count, 0);
  if (totalFillers > 10) presentationScore -= 1.0;

  const ideaScore = wordCount > 80 ? 8.5 : 7.0;
  const techScore = transcript.toLowerCase().includes("api") ||
    transcript.toLowerCase().includes("architecture") ||
    transcript.toLowerCase().includes("database") ||
    transcript.toLowerCase().includes("model")
      ? 8.0
      : 6.5;
  const impactScore = 7.5;
  const demoScore = wordCount > 120 ? 8.2 : 6.8;

  const rubric: PitchRubricItem[] = [
    {
      category: "Idea",
      weight: "20%",
      criterion: "Clear problem framing and value proposition.",
      comment: wordCount > 80
        ? "Good clarity on the target user and problem statement."
        : "Hook needs sharper contrast between current status quo and your innovation.",
      score: Number(ideaScore.toFixed(1)),
    },
    {
      category: "Technical depth",
      weight: "20%",
      criterion: "Architecture, trade-offs, and implementation complexity.",
      comment: techScore >= 8.0
        ? "Named core architectural components and pipelines well."
        : "Explain technical trade-offs more explicitly (why your stack vs off-the-shelf wrappers).",
      score: Number(techScore.toFixed(1)),
    },
    {
      category: "Impact",
      weight: "20%",
      criterion: "Real-world utility and target audience scale.",
      comment: "Solid market hypothesis; add concrete customer validation or pilot metrics.",
      score: Number(impactScore.toFixed(1)),
    },
    {
      category: "Presentation",
      weight: "20%",
      criterion: "Delivery cadence, pacing balance, and time limit adherence.",
      comment: overtimeSec > 15
        ? `Ran ${overtimeSec}s overtime. Judges will cut off your live demo before you finish.`
        : "Pacing was well contained within the allotted competition clock.",
      score: Number(Math.max(4, presentationScore).toFixed(1)),
    },
    {
      category: "Demo",
      weight: "20%",
      criterion: "Demo clarity, UX walkthrough, and working software proof.",
      comment: demoScore >= 8.0
        ? "Walkthrough was coherent and focused on the core user journey."
        : "Make sure you allocate at least 45 seconds strictly to showing working software.",
      score: Number(demoScore.toFixed(1)),
    },
  ];

  const overall = Number(
    (rubric.reduce((sum, r) => sum + r.score, 0) / rubric.length).toFixed(1)
  );

  const status =
    overall >= 8.5 ? "Winning Caliber" : overall >= 7.0 ? "Solid Contender" : "Needs Polish";

  return {
    id: `run-${Date.now()}`,
    deckName,
    date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    totalDurationSec,
    targetDurationSec,
    overallScore: overall,
    overallScoreFormatted: `${overall} / 10`,
    status,
    marginNote: overtimeSec > 15 ? `Ran +${overtimeSec}s overtime` : "Tighten technical justification",
    marginTargetCategory: overtimeSec > 15 ? "Presentation" : "Technical depth",
    rubric,
    slidePacing: generateSlidePacing(slideData, totalDurationSec, targetDurationSec),
    fillerWords: fillers.length > 0 ? fillers : [{ word: "like", count: 2 }, { word: "um", count: 1 }],
    strengths: [
      `Delivered ${wordCount} words across ${slideData.length || 1} slides`,
      `Average speaking pace of ${wpm > 0 ? `${wpm} WPM` : "controlled pace"}`,
      "Coherent logical flow from problem statement to call to action",
    ],
    improvements: [
      overtimeSec > 0
        ? `Reduce presentation duration by ${overtimeSec}s to avoid judge gongs`
        : "Rehearse live transitions to reduce hesitation pauses",
      "Sharpen answer to 'What prevents incumbent giants from replicating this in 2 weeks?'",
      "Connect slide metrics to the exact problem outlined in your opening hook",
    ],
    judgeQuestions: [
      {
        judge: "Marcus Vance (VC)",
        question: "What is your unfair advantage or proprietary moat if a well-funded competitor enters?",
        suggestedAnswer: "Emphasize fine-tuned domain models, proprietary data pipelines, and workflow distribution lock-in.",
      },
      {
        judge: "Dr. Elena Rostova (Principal Architect)",
        question: "How does your architecture handle edge failure or high latency during live inference?",
        suggestedAnswer: "Walk through fallback caches, client-side resilience, and degraded-mode guarantees.",
      },
      {
        judge: "Kai Takahashi (Product Lead)",
        question: "What is the single biggest point of friction in your user onboarding flow today?",
        suggestedAnswer: "Describe the simplified zero-config initial experience and automatic defaults.",
      },
    ],
    transcript,
    wpm,
    aiProvider: "heuristic",
  };
}
