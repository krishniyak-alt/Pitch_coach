from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def root_status_view(request):
    return JsonResponse({
        "service": "PitchCoach Backend API",
        "status": "healthy",
        "version": "1.0.0",
        "framework": "Django 5.1 (Function-Based Views)",
        "endpoints": {
            "health": "/api/health/",
            "evaluate_pitch": "/api/evaluate-pitch/",
            "judge_questions": "/api/judge-questions/",
            "history": "/api/history/",
            "admin": "/admin/"
        }
    })

urlpatterns = [
    path("", root_status_view, name="root-status"),
    path("admin/", admin.site.urls),
    path("api/", include("api.urls")),
]
