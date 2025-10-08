import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/PatientPortal/Login";
import Dashboard from "./components/PatientPortal/Dashboard";
import Appointments from "./components/PatientPortal/Appointments";
import Medications from "./components/PatientPortal/Medications";
import AdminDashboard from "./components/Admin/AdminDashboard";
import PatientList from "./components/Admin/PatientList";
import MedicationList from "./components/Admin/MedicationList";
import AppointmentList from "./components/Admin/AppointmentList";
import "./App.css";

function App() {
  const [user, setUser] = useState(() => {
    // Load user from localStorage on initial load
    const savedUser = localStorage.getItem('patient_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('patient_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('patient_user');
    }
  }, [user]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Patient Portal */}
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/portal/dashboard" element={<Dashboard user={user} setUser={setUser} />} />
        <Route path="/portal/appointments" element={<Appointments user={user} setUser={setUser} />} />
        <Route path="/portal/medications" element={<Medications user={user} setUser={setUser} />} />

        {/* Admin Portal */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/patients" element={<PatientList />} />
        <Route path="/admin/medications" element={<MedicationList />} />
        <Route path="/admin/appointments" element={<AppointmentList />} />
        
        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<div style={{padding: '20px', textAlign: 'center'}}>
          <h2>Page Not Found</h2>
          <p>The page you're looking for doesn't exist.</p>
          <a href="/" style={{color: '#007bff'}}>Go to Home</a>
        </div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
