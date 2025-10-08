#!/usr/bin/env python3
"""
Seed the database with sample data from data.json
Run this script: python3 seed_data.py
"""

import os
import sys
import json
import django
from datetime import datetime

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mini_emr_backend.settings')
django.setup()

from emr.models import Patient, Medication, Appointment


def clear_database():
    """Clear existing data"""
    print("🗑️  Clearing existing data...")
    Appointment.objects.all().delete()
    Medication.objects.all().delete()
    Patient.objects.all().delete()
    print("✓ Database cleared\n")


def seed_data():
    """Seed the database with data from data.json"""
    print("📦 Loading data from data.json...")

    with open('data.json', 'r') as f:
        data = json.load(f)

    print(f"✓ Found {len(data['users'])} users to import\n")

    # Track created objects
    patients_created = 0
    appointments_created = 0
    medications_created = 0

    for user_data in data['users']:
        # Parse name into first and last
        name_parts = user_data['name'].split(' ', 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ''

        # Create patient
        print(f"👤 Creating patient: {user_data['name']}")
        patient = Patient(
            first_name=first_name,
            last_name=last_name,
            email=user_data['email'],
            password=user_data['password'],  # Note: In production, hash this!
            dob=None,
            phone=None,
            address=None
        )
        patient.save()
        patients_created += 1
        print(f"   ✓ Patient created: {patient.id}")

        # Create appointments for this patient
        for appt_data in user_data['appointments']:
            print(f"   📅 Creating appointment with {appt_data['provider']}")

            # Parse datetime string to datetime object
            appt_datetime = datetime.fromisoformat(appt_data['datetime'].replace('Z', '+00:00'))

            appointment = Appointment(
                patient=patient,
                provider_name=appt_data['provider'],
                appointment_date=appt_datetime,
                repeat_schedule=appt_data.get('repeat'),
                end_date=None
            )
            appointment.save()
            appointments_created += 1
            print(f"      ✓ Appointment created: {appointment.id}")

        # Create medications for this patient
        for med_data in user_data['prescriptions']:
            print(f"   💊 Creating medication: {med_data['medication']}")

            # Parse refill date
            refill_date = datetime.strptime(med_data['refill_on'], '%Y-%m-%d').date()

            medication = Medication(
                patient=patient,
                name=med_data['medication'],
                dosage=med_data['dosage'],
                quantity=med_data['quantity'],
                refill_date=refill_date,
                refill_schedule=med_data['refill_schedule']
            )
            medication.save()
            medications_created += 1
            print(f"      ✓ Medication created: {medication.id}")

        print()  # Empty line between users

    # Print summary
    print("=" * 50)
    print("✅ DATABASE SEEDING COMPLETE!")
    print("=" * 50)
    print(f"👥 Patients created:     {patients_created}")
    print(f"📅 Appointments created: {appointments_created}")
    print(f"💊 Medications created:  {medications_created}")
    print("=" * 50)
    print("\n🎉 You can now login with:")
    print("   Email: mark@some-email-provider.net")
    print("   Password: Password123!")
    print("   OR")
    print("   Email: lisa@some-email-provider.net")
    print("   Password: Password123!")
    print()


if __name__ == '__main__':
    print("\n" + "=" * 50)
    print("🌱 MINI EMR DATABASE SEEDER")
    print("=" * 50 + "\n")

    # Ask for confirmation
    response = input("⚠️  This will DELETE all existing data. Continue? (yes/no): ")

    if response.lower() in ['yes', 'y']:
        clear_database()
        seed_data()
    else:
        print("\n❌ Seeding cancelled.")
        sys.exit(0)
