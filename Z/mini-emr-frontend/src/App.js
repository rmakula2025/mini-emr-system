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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
