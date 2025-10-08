from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Patient, Medication, Appointment
from .serializers import PatientSerializer, MedicationSerializer, AppointmentSerializer


# Patients (CRU)
class PatientViewSet(viewsets.ViewSet):
    """ViewSet for Patient CRUD (no delete)"""

    def list(self, request):
        patients = Patient.objects.all()
        serializer = PatientSerializer(patients, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = PatientSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        try:
            patient = Patient.objects.get(id=pk)
            serializer = PatientSerializer(patient)
            return Response(serializer.data)
        except Patient.DoesNotExist:
            return Response({"error": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)

    def update(self, request, pk=None):
        try:
            patient = Patient.objects.get(id=pk)
            serializer = PatientSerializer(patient, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Patient.DoesNotExist:
            return Response({"error": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)


# Medications (CRUD)
class MedicationViewSet(viewsets.ViewSet):
    """ViewSet for Medication CRUD"""

    def list(self, request):
        medications = Medication.objects.all()
        # Filter out medications with invalid patient references
        valid_medications = []
        for med in medications:
            try:
                # Try to access the patient to see if reference is valid
                _ = med.patient
                valid_medications.append(med)
            except Exception:
                # Skip medications with broken patient references
                continue
        serializer = MedicationSerializer(valid_medications, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = MedicationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        try:
            medication = Medication.objects.get(id=pk)
            serializer = MedicationSerializer(medication)
            return Response(serializer.data)
        except Medication.DoesNotExist:
            return Response({"error": "Medication not found"}, status=status.HTTP_404_NOT_FOUND)

    def update(self, request, pk=None):
        try:
            medication = Medication.objects.get(id=pk)
            serializer = MedicationSerializer(medication, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Medication.DoesNotExist:
            return Response({"error": "Medication not found"}, status=status.HTTP_404_NOT_FOUND)

    def destroy(self, request, pk=None):
        try:
            medication = Medication.objects.get(id=pk)
            medication.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Medication.DoesNotExist:
            return Response({"error": "Medication not found"}, status=status.HTTP_404_NOT_FOUND)


# Appointments (CRUD)
class AppointmentViewSet(viewsets.ViewSet):
    """ViewSet for Appointment CRUD"""

    def list(self, request):
        appointments = Appointment.objects.all()
        # Filter out appointments with invalid patient references
        valid_appointments = []
        for appt in appointments:
            try:
                # Try to access the patient to see if reference is valid
                _ = appt.patient
                valid_appointments.append(appt)
            except Exception:
                # Skip appointments with broken patient references
                continue
        serializer = AppointmentSerializer(valid_appointments, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = AppointmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        try:
            appointment = Appointment.objects.get(id=pk)
            serializer = AppointmentSerializer(appointment)
            return Response(serializer.data)
        except Appointment.DoesNotExist:
            return Response({"error": "Appointment not found"}, status=status.HTTP_404_NOT_FOUND)

    def update(self, request, pk=None):
        try:
            appointment = Appointment.objects.get(id=pk)
            serializer = AppointmentSerializer(appointment, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Appointment.DoesNotExist:
            return Response({"error": "Appointment not found"}, status=status.HTTP_404_NOT_FOUND)

    def destroy(self, request, pk=None):
        try:
            appointment = Appointment.objects.get(id=pk)
            appointment.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Appointment.DoesNotExist:
            return Response({"error": "Appointment not found"}, status=status.HTTP_404_NOT_FOUND)


# 🔑 Login endpoint
@api_view(["POST"])
def login(request):
    email = request.data.get("email")
    password = request.data.get("password")

    try:
        patient = Patient.objects.get(email=email, password=password)
        return Response(
            {
                "id": str(patient.id),
                "first_name": patient.first_name,
                "last_name": patient.last_name,
                "email": patient.email,
            },
            status=status.HTTP_200_OK,
        )
    except Patient.DoesNotExist:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
