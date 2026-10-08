import os
import re
import json
import logging
from typing import Dict, Any, List, Optional

logger = logging.getLogger(__name__)

# Fallback heuristic judge evaluation when Gemini API key is missing or network fails
def generate_heuristic_evaluation(
    deck_name: str,
    total_duration_sec: int,
    target_duration_sec: int,
    transcript: str,
    slide_data: List[Dict[str, Any]],
    qa_responses: List[Dict[str, Any]],
) -> Dict[str, Any]:
    # Calculate verbal cadence and filler words
    lower_t = transcript.lower()
    words = [w for w in re.findall(r"\b\w+\b", lower_t)]
    word_count = len(words)
    wpm = round((word_count / max(total_duration_sec, 1)) * 60) if total_duration_sec > 0 else 0

    filler_tokens = ["um", "uh", "like", "you know", "basically", "actually", "so"]
    filler_counts = []
    total_fillers = 0
    for tok in filler_tokens:
        count = len(re.findall(rf"\b{re.escape(tok)}\b", lower_t))
        if count > 0:
            filler_counts.append({"word": tok, "count": count})
            total_fillers += count

    # Duration Delta
    delta = total_duration_sec - target_duration_sec
    time_score = 9.0
    if abs(delta) > 40:
        time_score = 6.0
    elif abs(delta) > 20:
        time_score = 7.5

    # Slide pacing calculation
    slide_pacing = []
    total_slide_time = sum(s.get("actualTime", 0) for s in slide_data) or max(total_duration_sec, 1)
    for idx, s in enumerate(slide_data):
        act = s.get("actualTime", 0)
        alloc = s.get("allocatedTime", 30)
        share = round(act / total_slide_time, 2)
        alert = None
        if act > alloc * 1.5:
            alert = f"+{act - alloc}s over target"
        elif act < alloc * 0.4 and alloc > 15:
            alert = "rushed through"
        slide_pacing.append({
            "slide": f"Slide {idx + 1}: {s.get('title', 'Overview')}",
            "time": f"{act}s",
            "target": f"{alloc}s",
            "share": share,
            "alert": alert,
        })

    # Overall rubric calculation
    score_idea = min(9.4, 7.5 + (0.5 if "problem" in lower_t or "solution" in lower_t else 0.0))
    score_tech = min(9.5, 7.8 + (0.8 if "api" in lower_t or "architecture" in lower_t or "backend" in lower_t else 0.0))
    score_impact = min(9.2, 7.2 + (0.6 if "market" in lower_t or "users" in lower_t or "customer" in lower_t else 0.0))
    score_pres = max(5.0, min(9.5, time_score - (0.1 * total_fillers)))
    score_demo = 8.0

    overall_num = round((score_idea + score_tech + score_impact + score_pres + score_demo) / 5.0, 1)

    status = "Solid Contender"
    if overall_num >= 8.5:
        status = "Winning Caliber"
    elif overall_num < 6.8:
        status = "Needs Polish"

    margin_note = f"Pacing delta: {delta:+d}s vs target" if delta != 0 else "Sharp 3-minute pacing adherence"

    return {
        "overallScore": overall_num,
        "overallScoreFormatted": f"{overall_num} / 10",
        "status": status,
        "marginNote": margin_note,
        "marginTargetCategory": "Presentation" if abs(delta) > 20 else "Technical depth",
        "wpm": wpm or 132,
        "rubric": [
            {
                "category": "Idea",
                "weight": "20%",
                "criterion": "Clear problem hook within first 30s and compelling solution.",
                "comment": "Problem was stated; punchier quantifiable impact upfront will elevate founder authority.",
                "score": round(score_idea, 1),
            },
            {
                "category": "Technical depth",
                "weight": "20%",
                "criterion": "Real architecture, technical trade-offs, and non-trivial implementation.",
                "comment": "Good technical clarity. Deepen the explanation on latency and data moats.",
                "score": round(score_tech, 1),
            },
            {
                "category": "Impact",
                "weight": "20%",
                "criterion": "Real-world utility, user traction logic, and distribution.",
                "comment": "Address customer acquisition and defensibility against incumbents.",
                "score": round(score_impact, 1),
            },
            {
                "category": "Presentation",
                "weight": "20%",
                "criterion": "Pacing, slide clarity, cadence, and conciseness.",
                "comment": f"Pacing was {delta:+d}s relative to target limit. Speech rate averaged {wpm or 132} WPM.",
                "score": round(score_pres, 1),
            },
            {
                "category": "Demo",
                "weight": "20%",
                "criterion": "Product walk-through credibility and UI clarity.",
                "comment": "Flow was coherent. Spotlight the single most magical user moment earlier.",
                "score": round(score_demo, 1),
            },
        ],
        "slidePacing": slide_pacing,
        "fillerWords": filler_counts or [{"word": "um", "count": 2}],
        "strengths": [
            "Coherent narrative arc from slide 1 to conclusion",
            "Clear articulation of the primary pain point",
            "Strong team and prototype demonstration flow",
        ],
        "improvements": [
            "Quantify market sizing with realistic top-down & bottom-up data",
            "Anticipate judge defense on technical scalability bottlenecks",
            "Tighten transitions between problem and architecture slides",
        ],
        "judgeQuestions": [
            {
                "judge": "Marcus Vance (VC)",
                "question": "What stops Google or an open-source framework from cloning your core workflow next quarter?",
                "suggestedAnswer": "Our moat lies in domain-specific telemetry feedback loops and proprietary user workflow data.",
            },
            {
                "judge": "Dr. Elena Rostova (Principal Architect)",
                "question": "How do you handle database latency and connection pooling under bursty hackathon traffic?",
                "suggestedAnswer": "We decouple evaluation jobs into async workers with connection-pooled MySQL and cached intermediate states.",
            },
            {
                "judge": "Kai Takahashi (Product Lead)",
                "question": "Where do users experience the most cognitive friction in your first-time onboarding loop?",
                "suggestedAnswer": "Slide deck upload was optimized to zero-config instant parsing to minimize time-to-first-value.",
            },
        ],
        "aiProvider": "heuristic",
    }


def call_gemini_pitch_evaluation(
    api_key: str,
    deck_name: str,
    total_duration_sec: int,
    target_duration_sec: int,
    transcript: str,
    slide_data: List[Dict[str, Any]],
    qa_responses: List[Dict[str, Any]],
) -> Dict[str, Any]:
    from google import genai
    from google.genai import types

    client = genai.Client(api_key=api_key)

    slides_summary = "\n\n".join([
        f"Slide {idx + 1}: '{s.get('title', 'Untitled')}' | Allocated: {s.get('allocatedTime', 30)}s | Actual spent: {s.get('actualTime', 0)}s\nText: {s.get('text', '')[:300]}"
        for idx, s in enumerate(slide_data)
    ])

    qa_summary = "\n".join([
        f"Judge {qa.get('judge', 'Judge')}: '{qa.get('question', '')}'\nFounder Answer: '{qa.get('userAnswer', '[No answer]')}'"
        for qa in qa_responses
    ]) if qa_responses else "No live defense Q&A conducted."

    prompt = f"""
You are an elite, ruthlessly honest Hackathon Judging Panel at a tier-1 event (like MIT HackMIT, ETHGlobal, or Y Combinator Hackathon).
You consist of 3 judges:
1. Marcus Vance (VC Partner - focuses on market hook, pain point, and defensibility)
2. Dr. Elena Rostova (Principal Infrastructure Architect - focuses on technical depth and architecture)
3. Kai Takahashi (Principal Product Designer - focuses on user flow, demo execution, and storytelling)

PITCH RUN METRICS:
- Deck Name: "{deck_name}"
- Target Presentation Limit: {target_duration_sec} seconds
- Actual Recorded Presentation Time: {total_duration_sec} seconds
- Verbal Transcript of what the founder said:
\"\"\"
{transcript or "[Founder rehearsed with visual slides and minimal spoken words]"}
\"\"\"

- Slide Breakdown and Time Spent:
{slides_summary}

- Cross-Examination Q&A during Judge Defense:
{qa_summary}

TASK:
Provide an official, realistic, calibrated Hackathon Rubric Evaluation.
Return ONLY a valid JSON object matching the following structure with no markdown backticks:
{{
  "overallScore": 7.8,
  "status": "Solid Contender",
  "marginNote": "slide 3: lost us in the weeds",
  "marginTargetCategory": "Technical depth",
  "rubric": [
    {{
      "category": "Idea",
      "weight": "20%",
      "criterion": "Clear problem hook within first 30s and compelling solution.",
      "comment": "Specific constructive judge critique based on what they said.",
      "score": 8.0
    }},
    {{
      "category": "Technical depth",
      "weight": "20%",
      "criterion": "Real architecture, technical trade-offs, and non-trivial implementation.",
      "comment": "Specific critique of their technical explanation.",
      "score": 8.0
    }},
    {{
      "category": "Impact",
      "weight": "20%",
      "criterion": "Real-world utility, user traction logic, and distribution.",
      "comment": "Specific critique of the viability.",
      "score": 7.5
    }},
    {{
      "category": "Presentation",
      "weight": "20%",
      "criterion": "Pacing, slide clarity, cadence, and conciseness.",
      "comment": "Specific critique of pacing and overtime/undertime balance.",
      "score": 7.0
    }},
    {{
      "category": "Demo",
      "weight": "20%",
      "criterion": "Product walk-through credibility and UI clarity.",
      "comment": "Critique of how well the demo was presented.",
      "score": 8.5
    }}
  ],
  "slidePacing": [
    {{
      "slide": "Slide 1: Problem",
      "time": "40s",
      "target": "30s",
      "share": 0.25,
      "alert": "+10s over target"
    }}
  ],
  "fillerWords": [
    {{ "word": "um", "count": 3 }}
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
    {{
      "judge": "Marcus Vance (VC)",
      "question": "Sharp question about defensibility or unit economics",
      "suggestedAnswer": "Crisp 1-2 sentence ideal rebuttal"
    }},
    {{
      "judge": "Dr. Elena Rostova (Principal Architect)",
      "question": "Deep architectural or failure mode question",
      "suggestedAnswer": "Crisp 1-2 sentence ideal rebuttal"
    }},
    {{
      "judge": "Kai Takahashi (Product Lead)",
      "question": "UX friction or user onboarding question",
      "suggestedAnswer": "Crisp 1-2 sentence ideal rebuttal"
    }}
  ]
}}
"""

    models_to_try = ["gemini-3.8-flash"]
    response_text = None
    for model_name in models_to_try:
        try:
            resp = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.2,
                ),
            )
            response_text = resp.text
            if response_text:
                break
        except Exception as e:
            logger.warning("Gemini model %s call error: %s", model_name, e)
            break

    if not response_text:
        raise ValueError("Empty response from Gemini models")

    clean_json = response_text.replace("```json", "").replace("```", "").strip()
    data = json.loads(clean_json)
    data["aiProvider"] = "gemini"
    data["overallScoreFormatted"] = f"{data.get('overallScore', 7.5)} / 10"

    # Compute WPM
    words = re.findall(r"\b\w+\b", transcript)
    data["wpm"] = round((len(words) / max(total_duration_sec, 1)) * 60) if total_duration_sec > 0 else 135

    return data


def call_gemini_judge_questions(
    api_key: str,
    deck_name: str,
    slides_text: str,
    transcript: str,
) -> List[Dict[str, str]]:
    from google import genai
    from google.genai import types

    client = genai.Client(api_key=api_key)

    prompt = f"""
You are a panel of elite hackathon judges listening to a team pitch "{deck_name}".
Here is what was in their presentation slides:
\"\"\"
{slides_text[:2000]}
\"\"\"

Here is what the founder actually said in their speech:
\"\"\"
{transcript[:2000]}
\"\"\"

Generate 3 ruthless, hyper-specific cross-examination questions testing defensibility, architecture, and user adoption.
Return ONLY a valid JSON array matching this exact format:
[
  {{
    "judge": "Marcus Vance (VC)",
    "question": "Question testing defensibility, unit economics, or distribution",
    "suggestedAnswer": "1-2 sentence crisp ideal rebuttal focusing on unfair advantage."
  }},
  {{
    "judge": "Dr. Elena Rostova (Principal Architect)",
    "question": "Question scrutinizing tech stack, latency, failure modes, or real depth",
    "suggestedAnswer": "1-2 sentence crisp ideal rebuttal focusing on architecture details."
  }},
  {{
    "judge": "Kai Takahashi (Product Lead)",
    "question": "Question challenging real user adoption, onboarding friction, or demo polish",
    "suggestedAnswer": "1-2 sentence crisp ideal rebuttal."
  }}
]
"""

    for model_name in ["gemini-3.8-flash"]:
        try:
            resp = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.3,
                ),
            )
            clean = resp.text.replace("```json", "").replace("```", "").strip()
            questions = json.loads(clean)
            if isinstance(questions, list) and len(questions) > 0:
                return questions
        except Exception as e:
            logger.warning("Judge questions with %s error: %s", model_name, e)
            break

    raise ValueError("Failed to generate judge questions via Gemini")
