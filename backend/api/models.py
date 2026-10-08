import uuid
from django.db import models

class PitchSession(models.Model):
    STATUS_CHOICES = [
        ("Needs Polish", "Needs Polish"),
        ("Solid Contender", "Solid Contender"),
        ("Winning Caliber", "Winning Caliber"),
    ]

    session_id = models.CharField(
        max_length=64,
        unique=True,
        db_index=True,
        default=uuid.uuid4,
        help_text="Unique identifier for the pitch practice run"
    )
    deck_name = models.CharField(max_length=255, default="Untitled Pitch Deck")
    target_duration_sec = models.PositiveIntegerField(default=180)
    total_duration_sec = models.PositiveIntegerField(default=0)
    overall_score = models.FloatField(default=0.0)
    overall_score_formatted = models.CharField(max_length=32, default="0.0 / 10")
    status = models.CharField(max_length=64, choices=STATUS_CHOICES, default="Needs Polish")
    margin_note = models.CharField(max_length=255, blank=True, default="")
    margin_target_category = models.CharField(max_length=64, blank=True, default="Idea")
    transcript = models.TextField(blank=True, default="")
    wpm = models.PositiveIntegerField(default=0)
    ai_provider = models.CharField(max_length=32, default="gemini")

    # Structured Telemetry Stored as Native JSON in MySQL
    rubric_data = models.JSONField(
        default=list,
        blank=True,
        help_text="5-axis hackathon rubric scores and critiques"
    )
    slide_pacing_data = models.JSONField(
        default=list,
        blank=True,
        help_text="Per-slide duration, pacing share, and overtime alerts"
    )
    filler_words_data = models.JSONField(
        default=list,
        blank=True,
        help_text="Detected filler words count and timestamps"
    )
    strengths_data = models.JSONField(
        default=list,
        blank=True,
        help_text="Bullet points of key pitch strengths"
    )
    improvements_data = models.JSONField(
        default=list,
        blank=True,
        help_text="Actionable feedback for winning caliber"
    )
    judge_questions_data = models.JSONField(
        default=list,
        blank=True,
        help_text="Judge cross-examination questions and founder responses"
    )

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Pitch Rehearsal Session"
        verbose_name_plural = "Pitch Rehearsal Sessions"

    def __str__(self):
        return f"{self.deck_name} - {self.overall_score_formatted} ({self.created_at.strftime('%Y-%m-%d %H:%M')})"

    def to_evaluation_result(self) -> dict:
        """Serializes the pitch session into the format expected by the frontend."""
        return {
            "id": self.session_id,
            "deckName": self.deck_name,
            "date": self.created_at.strftime("%b %d, %Y %H:%M"),
            "totalDurationSec": self.total_duration_sec,
            "targetDurationSec": self.target_duration_sec,
            "overallScore": self.overall_score,
            "overallScoreFormatted": self.overall_score_formatted,
            "status": self.status,
            "marginNote": self.margin_note,
            "marginTargetCategory": self.margin_target_category,
            "rubric": self.rubric_data or [],
            "slidePacing": self.slide_pacing_data or [],
            "fillerWords": self.filler_words_data or [],
            "strengths": self.strengths_data or [],
            "improvements": self.improvements_data or [],
            "judgeQuestions": self.judge_questions_data or [],
            "transcript": self.transcript,
            "wpm": self.wpm,
            "aiProvider": self.ai_provider,
        }

    def to_dashboard_run(self, index: int = 1) -> dict:
        """Serializes into a row for the rehearsal history table in the dashboard."""
        mins = self.total_duration_sec // 60
        secs = self.total_duration_sec % 60
        t_mins = self.target_duration_sec // 60
        t_secs = self.target_duration_sec % 60
        return {
            "id": self.session_id,
            "run": f"Run #{index}",
            "deckName": self.deck_name,
            "date": self.created_at.strftime("%H:%M - %b %d"),
            "duration": f"{mins:02d}:{secs:02d}",
            "target": f"{t_mins:02d}:{t_secs:02d}",
            "score": self.overall_score_formatted,
            "note": self.margin_note or "Completed rehearsal round",
            "status": self.status,
            "rawScore": self.overall_score,
        }
