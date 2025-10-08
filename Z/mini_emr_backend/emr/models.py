from mongoengine import Document, StringField, EmailField, DateField, DateTimeField, ReferenceField, IntField, CASCADE

class Patient(Document):
    first_name = StringField(required=True, max_length=100)
    last_name = StringField(required=True, max_length=100)
    email = EmailField(required=True, unique=True)
    password = StringField(required=True)  # store hashed in real apps
    dob = DateField()
    phone = StringField()
    address = StringField()

    meta = {"collection": "patients"}  # collection name in MongoDB


class Medication(Document):
    patient = ReferenceField(Patient, reverse_delete_rule=CASCADE)
    name = StringField(required=True, max_length=100)
    dosage = StringField(required=True, max_length=50)
    quantity = IntField(required=True)
    refill_date = DateField()
    refill_schedule = StringField()  # e.g., monthly

    meta = {"collection": "medications"}


class Appointment(Document):
    patient = ReferenceField(Patient, reverse_delete_rule=CASCADE)
    provider_name = StringField(required=True, max_length=100)
    appointment_date = DateTimeField(required=True)
    repeat_schedule = StringField(null=True)  # weekly, monthly
    end_date = DateField(null=True)

    meta = {"collection": "appointments"}
