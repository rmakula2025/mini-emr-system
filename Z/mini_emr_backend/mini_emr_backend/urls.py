from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", include("emr.urls")),     # Mini-EMR APIs
    path("", include("portal.urls")),        # Patient Portal APIs
]