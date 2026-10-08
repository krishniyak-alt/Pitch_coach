from django.urls import path
from .views import (
    health_check,
    evaluate_pitch,
    judge_questions,
    history_list,
    history_detail,
    history_clear,
)

urlpatterns = [
    path("health/", health_check, name="api-health"),
    path("evaluate-pitch/", evaluate_pitch, name="api-evaluate-pitch"),
    path("judge-questions/", judge_questions, name="api-judge-questions"),
    path("history/", history_list, name="api-history-list"),
    path("history/clear/", history_clear, name="api-history-clear"),
    path("history/<str:session_id>/", history_detail, name="api-history-detail"),
]
