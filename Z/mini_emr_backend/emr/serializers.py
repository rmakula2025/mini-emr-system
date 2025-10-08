from rest_framework import serializers
from .models import Patient, Medication, Appointment


class MedicationSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    patient = serializers.CharField()  # keep as string in input/output
    name = serializers.CharField()
    dosage = serializers.CharField()
    quantity = serializers.IntegerField()
    refill_date = serializers.DateField()
    refill_schedule = serializers.CharField()

    def to_representation(self, instance):
        data = super().to_representation(instance)
        try:
            data['patient'] = str(instance.patient.id) if instance.patient else None
        except Exception:
            data['patient'] = None
        return data

    def create(self, validated_data):
        patient_id = validated_data.pop("patient")
        try:
            patient = Patient.objects.get(id=patient_id)
        except Patient.DoesNotExist:
            raise serializers.ValidationError({"patient": "Patient not found"})
        med = Medication(patient=patient, **validated_data)
        med.save()
        return med

    def update(self, instance, validated_data):
        patient_id = validated_data.pop("patient", None)
        if patient_id:
            try:
                instance.patient = Patient.objects.get(id=patient_id)
            except Patient.DoesNotExist:
                raise serializers.ValidationError({"patient": "Patient not found"})
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class AppointmentSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    patient = serializers.CharField()
    provider_name = serializers.CharField()
    appointment_date = serializers.DateTimeField()
    repeat_schedule = serializers.CharField(allow_null=True, required=False)
    end_date = serializers.DateField(allow_null=True, required=False)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        try:
            data['patient'] = str(instance.patient.id) if instance.patient else None
        except Exception:
            data['patient'] = None
        return data

    def create(self, validated_data):
        patient_id = validated_data.pop("patient")
        try:
            patient = Patient.objects.get(id=patient_id)
        except Patient.DoesNotExist:
            raise serializers.ValidationError({"patient": "Patient not found"})
        appt = Appointment(patient=patient, **validated_data)
        appt.save()
        return appt

    def update(self, instance, validated_data):
        patient_id = validated_data.pop("patient", None)
        if patient_id:
            try:
                instance.patient = Patient.objects.get(id=patient_id)
            except Patient.DoesNotExist:
                raise serializers.ValidationError({"patient": "Patient not found"})
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class PatientSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    dob = serializers.DateField(required=False, allow_null=True)
    phone = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    address = serializers.CharField(required=False, allow_null=True, allow_blank=True)

    medications = serializers.SerializerMethodField(read_only=True)
    appointments = serializers.SerializerMethodField(read_only=True)

    def get_medications(self, obj):
        meds = Medication.objects.filter(patient=obj)
        return MedicationSerializer(meds, many=True).data

    def get_appointments(self, obj):
        appts = Appointment.objects.filter(patient=obj)
        return AppointmentSerializer(appts, many=True).data

    def create(self, validated_data):
        # Password is required for creation
        if not validated_data.get('password'):
            raise serializers.ValidationError({"password": "Password is required when creating a patient"})

        patient = Patient(**validated_data)
        patient.save()
        return patient

    def update(self, instance, validated_data):
        # Remove read-only fields if present
        validated_data.pop('medications', None)
        validated_data.pop('appointments', None)

        # Only update password if a new one is provided
        password = validated_data.pop('password', None)
        if password and password.strip():  # Only update if not empty
            instance.password = password

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
