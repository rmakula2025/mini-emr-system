from django.urls import path
from .views import login, summary, all_appointments, all_medications

urlpatterns = [
    path("login/", login, name="login"),
    path("summary/<str:patient_id>/", summary, name="summary"),
    path("appointments/<str:patient_id>/", all_appointments, name="appointments"),
    path("medications/<str:patient_id>/", all_medications, name="medications"),
]
