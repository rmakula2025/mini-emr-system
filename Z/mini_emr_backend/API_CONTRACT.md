# Mini EMR Backend - API Contract

Base URL: `http://localhost:8000`

---

## 🏥 ADMIN INTERFACE APIs (`/admin/`)

All admin endpoints are **unauthenticated** (no authentication required).

### **Patients (CRU - No Delete)**

#### List All Patients
```
GET /admin/patients/
```
**Response:** `200 OK`
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "dob": "1990-01-15",
    "phone": "555-0100",
    "address": "123 Main St",
    "medications": [...],
    "appointments": [...]
  }
]
```

#### Get Single Patient
```
GET /admin/patients/{id}/
```
**Response:** `200 OK` (same structure as above)

#### Create Patient
```
POST /admin/patients/
Content-Type: application/json
```
**Request Body:**
```json
{
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "jane@example.com",
  "password": "password123",
  "dob": "1985-03-20",
  "phone": "555-0200",
  "address": "456 Elm St"
}
```
**Response:** `201 Created` (returns created patient object)

**Note:** `dob`, `phone`, and `address` are optional.

#### Update Patient
```
PUT /admin/patients/{id}/
Content-Type: application/json
```
**Request Body:**
```json
{
  "first_name": "Jane",
  "last_name": "Smith-Updated",
  "email": "jane@example.com",
  "password": "",
  "dob": "1985-03-20",
  "phone": "555-0201",
  "address": "789 Oak Ave"
}
```
**Response:** `200 OK` (returns updated patient object)

**Note:**
- Do NOT include `medications` or `appointments` fields in the update request (they are read-only)
- `password` is optional - send empty string `""` or omit to keep current password
- `dob`, `phone`, and `address` can be `null` or omitted

---

### **Medications (CRUD)**

#### List All Medications
```
GET /admin/medications/
```
**Response:** `200 OK`
```json
[
  {
    "id": "507f1f77bcf86cd799439012",
    "patient": "507f1f77bcf86cd799439011",
    "name": "Lisinopril",
    "dosage": "10mg",
    "quantity": 30,
    "refill_date": "2025-10-15",
    "refill_schedule": "monthly"
  }
]
```

#### Get Single Medication
```
GET /admin/medications/{id}/
```
**Response:** `200 OK` (same structure as above)

#### Create Medication
```
POST /admin/medications/
Content-Type: application/json
```
**Request Body:**
```json
{
  "patient": "507f1f77bcf86cd799439011",
  "name": "Metformin",
  "dosage": "500mg",
  "quantity": 60,
  "refill_date": "2025-11-01",
  "refill_schedule": "monthly"
}
```
**Response:** `201 Created`

**Note:** `patient` must be a valid patient ID (MongoDB ObjectId as string).

#### Update Medication
```
PUT /admin/medications/{id}/
Content-Type: application/json
```
**Request Body:** (all fields required, same as create)
**Response:** `200 OK`

#### Delete Medication
```
DELETE /admin/medications/{id}/
```
**Response:** `204 No Content`

---

### **Appointments (CRUD)**

#### List All Appointments
```
GET /admin/appointments/
```
**Response:** `200 OK`
```json
[
  {
    "id": "507f1f77bcf86cd799439013",
    "patient": "507f1f77bcf86cd799439011",
    "provider_name": "Dr. Sarah Johnson",
    "appointment_date": "2025-10-05T14:30:00Z",
    "repeat_schedule": null,
    "end_date": null
  }
]
```

#### Get Single Appointment
```
GET /admin/appointments/{id}/
```
**Response:** `200 OK` (same structure as above)

#### Create Appointment
```
POST /admin/appointments/
Content-Type: application/json
```
**Request Body:**
```json
{
  "patient": "507f1f77bcf86cd799439011",
  "provider_name": "Dr. Michael Chen",
  "appointment_date": "2025-10-12T09:00:00Z",
  "repeat_schedule": null,
  "end_date": null
}
```
**Response:** `201 Created`

**Notes:**
- `patient` must be a valid patient ID (MongoDB ObjectId as string)
- `appointment_date` must be ISO 8601 datetime format
- `repeat_schedule` and `end_date` are optional (nullable)

#### Update Appointment
```
PUT /admin/appointments/{id}/
Content-Type: application/json
```
**Request Body:** (all fields required, same as create)
```json
{
  "patient": "507f1f77bcf86cd799439011",
  "provider_name": "Dr. Michael Chen",
  "appointment_date": "2025-10-12T10:00:00Z",
  "repeat_schedule": "weekly",
  "end_date": "2025-12-31"
}
```
**Response:** `200 OK`

**Important:** When updating, you must send the complete object with all fields.

#### Delete Appointment
```
DELETE /admin/appointments/{id}/
```
**Response:** `204 No Content`

---

## 👤 PATIENT PORTAL APIs (`/`)

All portal endpoints are **unauthenticated** except they require a valid `patient_id`.

### **Authentication**

#### Login
```
POST /login/
Content-Type: application/json
```
**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Response:** `200 OK`
```json
{
  "id": "507f1f77bcf86cd799439011",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com"
}
```

**Error Response:** `400 Bad Request`
```json
{
  "error": "Invalid credentials"
}
```

---

### **Dashboard & Patient Data**

#### Get Patient Summary (7-day view)
```
GET /summary/{patient_id}/
```
**Response:** `200 OK`
```json
{
  "patient": {
    "id": "507f1f77bcf86cd799439011",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "dob": "1990-01-15",
    "phone": "555-0100",
    "address": "123 Main St"
  },
  "appointments": [
    {
      "id": "507f1f77bcf86cd799439013",
      "patient": "507f1f77bcf86cd799439011",
      "provider_name": "Dr. Sarah Johnson",
      "appointment_date": "2025-10-05T14:30:00Z",
      "repeat_schedule": null,
      "end_date": null
    }
  ],
  "medications": [
    {
      "id": "507f1f77bcf86cd799439012",
      "patient": "507f1f77bcf86cd799439011",
      "name": "Lisinopril",
      "dosage": "10mg",
      "quantity": 30,
      "refill_date": "2025-10-03",
      "refill_schedule": "monthly"
    }
  ]
}
```

**Note:** Returns appointments and medication refills due within the **next 7 days** from today.

#### Get All Appointments
```
GET /appointments/{patient_id}/
```
**Response:** `200 OK`
```json
[
  {
    "id": "507f1f77bcf86cd799439013",
    "patient": "507f1f77bcf86cd799439011",
    "provider_name": "Dr. Sarah Johnson",
    "appointment_date": "2025-10-05T14:30:00Z",
    "repeat_schedule": null,
    "end_date": null
  }
]
```

**Note:** Returns **all appointments** for the patient (both past and future), sorted by appointment date.

#### Get All Medications
```
GET /medications/{patient_id}/
```
**Response:** `200 OK`
```json
[
  {
    "id": "507f1f77bcf86cd799439012",
    "patient": "507f1f77bcf86cd799439011",
    "name": "Lisinopril",
    "dosage": "10mg",
    "quantity": 30,
    "refill_date": "2025-10-15",
    "refill_schedule": "monthly"
  }
]
```

**Note:** Returns **all** medications for the patient (no date filtering).

---

## 📝 Data Types & Formats

### Field Types
- **id**: MongoDB ObjectId as string (e.g., `"507f1f77bcf86cd799439011"`)
- **email**: Valid email address
- **date**: ISO 8601 date format `YYYY-MM-DD`
- **datetime**: ISO 8601 datetime format `YYYY-MM-DDTHH:MM:SSZ`
- **patient**: Patient ID reference (MongoDB ObjectId as string)

### Required vs Optional Fields

**Patient:**
- Required: `first_name`, `last_name`, `email`, `password`
- Optional: `dob`, `phone`, `address`

**Medication:**
- All fields required: `patient`, `name`, `dosage`, `quantity`, `refill_date`, `refill_schedule`

**Appointment:**
- Required: `patient`, `provider_name`, `appointment_date`
- Optional: `repeat_schedule`, `end_date`

---

## ❌ Error Responses

### 400 Bad Request
Invalid data or validation errors.
```json
{
  "field_name": ["Error message"]
}
```

### 404 Not Found
Resource not found.
```json
{
  "error": "Resource not found"
}
```

### 204 No Content
Successful DELETE operation (no response body).

---

## 🔧 Frontend Integration Notes

1. **Patient IDs**: All IDs are MongoDB ObjectId strings (24 hex characters). Store the patient ID after login.

2. **Date/Time Handling**:
   - Dates: Use `YYYY-MM-DD` format
   - DateTimes: Use ISO 8601 format with timezone (`2025-10-05T14:30:00Z`)

3. **Creating Appointments/Medications**: Always send the `patient` ID as a string.

4. **Updating Resources**:
   - Send the complete object with all required fields (not partial updates)
   - **IMPORTANT for Patients**: Do NOT include `medications` or `appointments` in PUT requests (they're read-only)
   - **IMPORTANT for Appointments/Medications**: When updating, you can send the object as-is from GET response

5. **No Authentication**: This is intentional for the mini-EMR. In production, you would add JWT/session tokens.

6. **CORS**: Configured for `http://localhost:3000` (see settings.py line 140-142).

---

## 🚀 Quick Start Example

```javascript
// Login
const loginResponse = await fetch('http://localhost:8000/login/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
});
const patient = await loginResponse.json();
const patientId = patient.id;

// Get dashboard summary
const summary = await fetch(`http://localhost:8000/summary/${patientId}/`);
const data = await summary.json();

// Create appointment (admin)
await fetch('http://localhost:8000/admin/appointments/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    patient: patientId,
    provider_name: 'Dr. Smith',
    appointment_date: '2025-10-15T14:00:00Z',
    repeat_schedule: null,
    end_date: null
  })
});
```