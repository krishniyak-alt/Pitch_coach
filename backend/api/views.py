import os
import uuid
import logging
from django.db import connection
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import PitchSession
from .ai_service import (
    call_gemini_pitch_evaluation,
    call_gemini_judge_questions,
    generate_heuristic_evaluation,
)

logger = logging.getLogger(__name__)


# --------------------------------------------------------------------------
# Function-Based View: Health Check (Crucial for Render Deployment)
# --------------------------------------------------------------------------
@api_view(["GET"])
def health_check(request):
    """
    Health check endpoint for Render monitoring and database connection testing.
    Verifies that Django and MySQL are active and responding.
    """
    db_status = "ok"
    db_engine = connection.settings_dict.get("ENGINE", "unknown")
    try:
        connection.ensure_connection()
        total_sessions = PitchSession.objects.count()
    except Exception as e:
        db_status = f"error: {str(e)}"
        total_sessions = 0

    return Response({
        "status": "healthy" if "error" not in db_status else "degraded",
        "service": "PitchCoach Backend API",
        "database": {
            "status": db_status,
            "engine": db_engine,
            "records_count": total_sessions,
        },
        "deploy_target": "Render",
        "views_type": "Function-Based Views (FBV)",
    }, status=status.HTTP_200_OK if "error" not in db_status else status.HTTP_503_SERVICE_UNAVAILABLE)


# --------------------------------------------------------------------------
# Function-Based View: Evaluate Pitch
# --------------------------------------------------------------------------
@api_view(["POST"])
def evaluate_pitch(request):
    """
    Evaluates a pitch recording, generates rubric scores and telemetry,
    and persists the session into the MySQL database.
    """
    data = request.data or {}
    deck_name = data.get("deckName", "Untitled Pitch Deck")
    total_duration_sec = int(data.get("totalDurationSec", 180))
    target_duration_sec = int(data.get("targetDurationSec", 180))
    transcript = data.get("transcript", "")
    slide_data = data.get("slideData", [])
    qa_responses = data.get("qaResponses", [])

    # Extract Gemini API Key from custom header or environment
    api_key = (
        request.headers.get("x-gemini-key")
        or request.headers.get("X-Gemini-Key")
        or os.getenv("GEMINI_API_KEY")
    )

    evaluation = None

    # Try Gemini evaluation if API key is provided
    if api_key:
        try:
            evaluation = call_gemini_pitch_evaluation(
                api_key=api_key,
                deck_name=deck_name,
                total_duration_sec=total_duration_sec,
                target_duration_sec=target_duration_sec,
                transcript=transcript,
                slide_data=slide_data,
                qa_responses=qa_responses,
            )
        except Exception as e:
            logger.warning("Gemini evaluation error, using heuristic fallback: %s", e)

    # Fallback to local calibrated heuristic evaluation if no key or API failed
    if not evaluation:
        evaluation = generate_heuristic_evaluation(
            deck_name=deck_name,
            total_duration_sec=total_duration_sec,
            target_duration_sec=target_duration_sec,
            transcript=transcript,
            slide_data=slide_data,
            qa_responses=qa_responses,
        )

    # Generate a unique session ID
    session_id = f"pitch_{uuid.uuid4().hex[:12]}"

    # Save to MySQL database
    try:
        session = PitchSession.objects.create(
            session_id=session_id,
            deck_name=deck_name,
            target_duration_sec=target_duration_sec,
            total_duration_sec=total_duration_sec,
            overall_score=float(evaluation.get("overallScore", 7.0)),
            overall_score_formatted=evaluation.get("overallScoreFormatted", "7.0 / 10"),
            status=evaluation.get("status", "Solid Contender"),
            margin_note=evaluation.get("marginNote", ""),
            margin_target_category=evaluation.get("marginTargetCategory", "Idea"),
            transcript=transcript,
            wpm=int(evaluation.get("wpm", 130)),
            ai_provider=evaluation.get("aiProvider", "heuristic"),
            rubric_data=evaluation.get("rubric", []),
            slide_pacing_data=evaluation.get("slidePacing", []),
            filler_words_data=evaluation.get("fillerWords", []),
            strengths_data=evaluation.get("strengths", []),
            improvements_data=evaluation.get("improvements", []),
            judge_questions_data=evaluation.get("judgeQuestions", []),
        )
        # Format response with database session ID and timestamp
        result = session.to_evaluation_result()
    except Exception as db_err:
        logger.error("Failed to persist pitch session to MySQL: %s", db_err)
        # If DB fails, still return complete evaluation with ephemeral ID
        evaluation["id"] = session_id
        evaluation["deckName"] = deck_name
        evaluation["totalDurationSec"] = total_duration_sec
        evaluation["targetDurationSec"] = target_duration_sec
        result = evaluation

    return Response(result, status=status.HTTP_200_OK)


# --------------------------------------------------------------------------
# Function-Based View: Generate Judge Questions
# --------------------------------------------------------------------------
@api_view(["POST"])
def judge_questions(request):
    """
    Generates 3 customized judge cross-examination questions
    tailored to the pitch deck content and spoken transcript.
    """
    data = request.data or {}
    deck_name = data.get("deckName", "Pitch Deck")
    slides_text = data.get("slidesText", "")
    transcript = data.get("transcript", "")

    api_key = (
        request.headers.get("x-gemini-key")
        or request.headers.get("X-Gemini-Key")
        or os.getenv("GEMINI_API_KEY")
    )

    questions = None
    if api_key:
        try:
            questions = call_gemini_judge_questions(
                api_key=api_key,
                deck_name=deck_name,
                slides_text=slides_text,
                transcript=transcript,
            )
        except Exception as e:
            logger.warning("Judge questions API error, using curated defaults: %s", e)

    if not questions:
        # Default tier-1 calibrated hackathon questions
        questions = [
            {
                "judge": "Marcus Vance (VC)",
                "question": "What stops an incumbent from cloning your feature set within 60 days of launch?",
                "suggestedAnswer": "Our moat is the proprietary real-time telemetry data loop and vertical workflow integration.",
            },
            {
                "judge": "Dr. Elena Rostova (Principal Architect)",
                "question": "What is your single point of failure under heavy concurrent traffic during demo day?",
                "suggestedAnswer": "We decouple client inference from our stateful MySQL layer and utilize worker queues with retry policies.",
            },
            {
                "judge": "Kai Takahashi (Product Lead)",
                "question": "How do you ensure a first-time user grasps your value proposition within the first 10 seconds?",
                "suggestedAnswer": "We eliminated setup friction with automatic drag-and-drop slide parsing and instant simulation.",
            },
        ]

    return Response({"questions": questions}, status=status.HTTP_200_OK)


# --------------------------------------------------------------------------
# Function-Based View: Rehearsal History List
# --------------------------------------------------------------------------
@api_view(["GET"])
def history_list(request):
    """
    Retrieves the list of recorded pitch rehearsal sessions from MySQL
    formatted for the Dashboard progression audit.
    """
    sessions = PitchSession.objects.all()[:30]
    total_count = PitchSession.objects.count()

    runs = [
        session.to_dashboard_run(index=total_count - idx)
        for idx, session in enumerate(sessions)
    ]

    return Response({
        "totalRuns": total_count,
        "runs": runs,
    }, status=status.HTTP_200_OK)


# --------------------------------------------------------------------------
# Function-Based View: Session Detail & Deletion
# --------------------------------------------------------------------------
@api_view(["GET", "DELETE"])
def history_detail(request, session_id):
    """
    Retrieves detailed rubric report or deletes a specific session by ID.
    """
    try:
        session = PitchSession.objects.get(session_id=session_id)
    except PitchSession.DoesNotExist:
        return Response({"error": "Session not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "DELETE":
        session.delete()
        return Response({"message": f"Session {session_id} deleted successfully"}, status=status.HTTP_200_OK)

    return Response(session.to_evaluation_result(), status=status.HTTP_200_OK)


# --------------------------------------------------------------------------
# Function-Based View: Clear All Rehearsal History
# --------------------------------------------------------------------------
@api_view(["POST", "DELETE"])
def history_clear(request):
    """
    Clears all saved rehearsal sessions from the MySQL database.
    """
    count, _ = PitchSession.objects.all().delete()
    return Response({
        "message": f"Successfully cleared {count} sessions from database.",
        "clearedCount": count,
    }, status=status.HTTP_200_OK)
