from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PatientViewSet, MedicationViewSet, AppointmentViewSet, login

router = DefaultRouter()
router.register(r"patients", PatientViewSet, basename="patient")
router.register(r"medications", MedicationViewSet, basename="medication")
router.register(r"appointments", AppointmentViewSet, basename="appointment")

urlpatterns = [
    path("", include(router.urls)),
    path("login/", login, name="login"),  # 👈 added here
]
