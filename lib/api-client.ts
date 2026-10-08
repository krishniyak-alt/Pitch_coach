/**
 * PitchCoach Unified API Client
 * Seamlessly interfaces with the Django Function-Based Views backend (MySQL / Render)
 * with automatic fallback to local route handlers when running in standalone mode.
 */

const DJANGO_API_BASE =
  process.env.NEXT_PUBLIC_DJANGO_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://127.0.0.1:8000/api"
    : "/api");

export async function fetchJudgeQuestions(params: {
  deckName: string;
  slidesText: string;
  transcript: string;
  apiKey?: string;
}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (params.apiKey) {
    headers["x-gemini-key"] = params.apiKey;
  }

  // Attempt Django backend first
  try {
    const res = await fetch(`${DJANGO_API_BASE}/judge-questions/`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        deckName: params.deckName,
        slidesText: params.slidesText,
        transcript: params.transcript,
      }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (djangoErr) {
    console.info("Django backend not reachable, falling back to Next.js route handler:", djangoErr);
  }

  // Fallback to Next.js internal API
  const res = await fetch("/api/judge-questions", {
    method: "POST",
    headers,
    body: JSON.stringify({
      deckName: params.deckName,
      slidesText: params.slidesText,
      transcript: params.transcript,
    }),
  });
  return await res.json();
}

export async function submitPitchEvaluation(params: {
  deckName: string;
  totalDurationSec: number;
  targetDurationSec: number;
  transcript: string;
  slideData: any[];
  qaResponses: any[];
  apiKey?: string;
}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (params.apiKey) {
    headers["x-gemini-key"] = params.apiKey;
  }

  const payload = {
    deckName: params.deckName,
    totalDurationSec: params.totalDurationSec,
    targetDurationSec: params.targetDurationSec,
    transcript: params.transcript,
    slideData: params.slideData,
    qaResponses: params.qaResponses,
  };

  // Attempt Django backend first (which persists to MySQL)
  try {
    const res = await fetch(`${DJANGO_API_BASE}/evaluate-pitch/`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (djangoErr) {
    console.info("Django backend not reachable, falling back to Next.js route handler:", djangoErr);
  }

  // Fallback to Next.js internal API
  const res = await fetch("/api/evaluate-pitch", {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Evaluation request failed");
  return await res.json();
}

export async function fetchRehearsalHistory() {
  try {
    const res = await fetch(`${DJANGO_API_BASE}/history/`);
    if (res.ok) {
      const data = await res.json();
      return data.runs || [];
    }
  } catch (err) {
    console.info("Django history fetch fallback to localStorage:", err);
  }
  return null;
}
