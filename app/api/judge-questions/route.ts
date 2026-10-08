import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { deckName = "Pitch Deck", slidesText = "", transcript = "" } = await req.json();

    const apiKey =
      req.headers.get("x-gemini-key") ||
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `
You are a panel of elite hackathon judges listening to a team pitch "${deckName}".
Here is what was in their presentation slides:
"""
${slidesText.substring(0, 2000)}
"""

Here is what the founder actually said in their speech:
"""
${transcript.substring(0, 2000)}
"""

Generate 3 ruthless, hyper-specific cross-examination questions that test the founder's conviction and architecture.
Return ONLY a valid JSON array matching this exact format:
[
  {
    "judge": "Marcus Vance (VC)",
    "question": "Question testing defensibility, unit economics, or distribution",
    "suggestedAnswer": "1-2 sentence crisp ideal rebuttal focusing on unfair advantage."
  },
  {
    "judge": "Dr. Elena Rostova (Principal Architect)",
    "question": "Question scrutinizing tech stack, latency, failure modes, or real depth",
    "suggestedAnswer": "1-2 sentence crisp ideal rebuttal focusing on architecture details."
  },
  {
    "judge": "Kai Takahashi (Product Lead)",
    "question": "Question challenging real user adoption, onboarding friction, or demo polish",
    "suggestedAnswer": "1-2 sentence crisp ideal rebuttal focusing on user experience."
  }
]
`;

        let response;
        try {
          response = await ai.models.generateContent({
            model: "models/gemini-flash-latest",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              temperature: 0.3,
            },
          });
        } catch (mErr) {
          response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              temperature: 0.3,
            },
          });
        }

        const raw = response.text || "[]";
        const clean = raw.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(clean);
        return NextResponse.json({ questions: parsed });
      } catch (err: any) {
        console.warn("Gemini judge questions error, using defaults:", err);
      }
    }

    // Default sharp questions tailored to general hackathon projects
    const defaultQuestions = [
      {
        judge: "Marcus Vance (VC)",
        question: `What prevents established market incumbents or AI foundation model providers from shipping this as an afternoon feature?`,
        suggestedAnswer: "Highlight your proprietary domain feedback loop, deep user workflow integration, and speed of specialized iteration.",
      },
      {
        judge: "Dr. Elena Rostova (Principal Architect)",
        question: `Walk me through your worst-case failure mode. If your external APIs or network fail during a critical workflow, how does your system recover?`,
        suggestedAnswer: "Detail your offline fallback mechanisms, local caching, and graceful state recovery guarantees.",
      },
      {
        judge: "Kai Takahashi (Product Lead)",
        question: `Where does a first-time user experience the highest friction in your prototype, and how will you eliminate that step?`,
        suggestedAnswer: "Explain the zero-configuration default pathway and automated onboarding assistance.",
      },
    ];

    return NextResponse.json({ questions: defaultQuestions });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to generate questions" }, { status: 500 });
  }
}
