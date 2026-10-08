from django.contrib import admin
from .models import PitchSession

@admin.register(PitchSession)
class PitchSessionAdmin(admin.ModelAdmin):
    list_display = (
        "deck_name",
        "overall_score_formatted",
        "status",
        "total_duration_sec",
        "ai_provider",
        "created_at",
    )
    list_filter = ("status", "ai_provider", "created_at")
    search_fields = ("deck_name", "transcript", "margin_note")
    readonly_fields = ("session_id", "created_at", "updated_at")
