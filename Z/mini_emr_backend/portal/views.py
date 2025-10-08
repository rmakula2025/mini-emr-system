from datetime import datetime, timedelta
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from emr.models import Patient, Appointment, Medication
from emr.serializers import AppointmentSerializer, MedicationSerializer, PatientSerializer

# Login
@api_view(["POST"])
def login(request):
    email = request.data.get("email")
    password = request.data.get("password")

    patient = Patient.objects.filter(email=email, password=password).first()

    if patient:
        return Response(
            {
                "id": str(patient.id),
                "first_name": patient.first_name,
                "last_name": patient.last_name,
                "email": patient.email,
            },
            status=status.HTTP_200_OK,
        )
    else:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)


# Summary (appointments & meds in 7 days)
@api_view(["GET"])
def summary(request, patient_id):
    today = datetime.now()
    next_week = today + timedelta(days=7)

    try:
        patient = Patient.objects.get(id=patient_id)
    except Patient.DoesNotExist:
        return Response({"error": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)

    appointments = Appointment.objects.filter(
        patient=patient, appointment_date__gte=today, appointment_date__lte=next_week
    )
    medications = Medication.objects.filter(
        patient=patient, refill_date__gte=today.date(), refill_date__lte=next_week.date()
    )

    patient_data = PatientSerializer(patient).data

    return Response({
        "patient": patient_data,
        "appointments": AppointmentSerializer(appointments, many=True).data,
        "medications": MedicationSerializer(medications, many=True).data
    })

# Full Appointments (all appointments)
@api_view(["GET"])
def all_appointments(request, patient_id):
    try:
        patient = Patient.objects.get(id=patient_id)
    except Patient.DoesNotExist:
        return Response({"error": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)

    # Get all appointments for the patient (past and future)
    appts = Appointment.objects.filter(patient=patient).order_by('appointment_date')
    return Response(AppointmentSerializer(appts, many=True).data)

# Full Medications
@api_view(["GET"])
def all_medications(request, patient_id):
    try:
        patient = Patient.objects.get(id=patient_id)
    except Patient.DoesNotExist:
        return Response({"error": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)

    meds = Medication.objects.filter(patient=patient)
    return Response(MedicationSerializer(meds, many=True).data)
