# Mini EMR Frontend

A React-based Electronic Medical Records (EMR) system with separate patient and admin portals.

## Features

### Patient Portal
- **Login** - Secure patient authentication
- **Dashboard** - View upcoming appointments (7 days) and medications needing refills
- **Appointments** - View all appointments from the last 90 days
- **Medications** - View all current and past prescriptions

### Admin Portal
- **Patient Management** - Create, read, and update patient records
- **Medication Management** - Full CRUD operations for patient medications
- **Appointment Management** - Full CRUD operations for appointments

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Backend API running on `http://127.0.0.1:8000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Usage

### Patient Portal
1. Navigate to `http://localhost:3000`
2. Login with patient credentials (email & password)
3. Access dashboard, appointments, and medications

### Admin Portal
1. Navigate to `http://localhost:3000/admin`
2. Manage patients, medications, and appointments
3. Full CRUD operations available

## API Endpoints Used

### Patient Portal
- `POST /login/` - Patient authentication
- `GET /summary/{patient_id}/` - Dashboard data
- `GET /appointments/{patient_id}/` - Patient appointments
- `GET /medications/{patient_id}/` - Patient medications

### Admin Interface
- `/admin/patients/` - Patient management
- `/admin/medications/` - Medication management
- `/admin/appointments/` - Appointment management

## Tech Stack

- **React** 19.1.1
- **React Router** 6.30.1
- **Axios** 1.12.2
- **CSS3** - Custom styling

## Project Structure

```
src/
├── api/
│   └── api.js                 # API configuration
├── components/
│   ├── Admin/
│   │   ├── AdminDashboard.js
│   │   ├── PatientList.js
│   │   ├── MedicationList.js
│   │   └── AppointmentList.js
│   └── PatientPortal/
│       ├── Login.js
│       ├── Dashboard.js
│       ├── Appointments.js
│       └── Medications.js
├── App.js                     # Main routing
└── App.css                    # Global styles
```

## Available Scripts

- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Notes

- The backend is expected to run on port 8000
- No authentication required for admin portal (as per backend specs)
- Patient authentication uses email and password
