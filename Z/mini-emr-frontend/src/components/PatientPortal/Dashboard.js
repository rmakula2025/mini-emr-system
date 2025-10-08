import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { patientAPI } from "../../api/api";

function Dashboard({ user, setUser }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const fetchSummary = async () => {
      try {
        const patientId = user.id;
        console.log("Fetching summary for patient ID:", patientId);
        const res = await patientAPI.get(`summary/${patientId}/`);
        console.log("Summary response:", res.data);
        setSummary(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching summary:", err);
        setLoading(false);
      }
    };

    fetchSummary();
  }, [user, navigate]);

  if (!user) return null;

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Get patient data from summary if available, otherwise use user
  const patientData = summary?.patient || user;

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h2>Welcome, {patientData.first_name} {patientData.last_name}</h2>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div style={{marginTop: '20px', padding: '15px', backgroundColor: '#e7f1ff', borderRadius: '8px'}}>
          <p style={{fontSize: '16px', margin: 0}}>
            Welcome to your patient portal. View your appointments and medications using the links below.
          </p>
        </div>

        <div className="nav-links">
          <Link to="/portal/appointments">All Appointments</Link>
          <Link to="/portal/medications">All Medications</Link>
        </div>

        <div style={{marginTop: '20px'}}>
          <h3>Patient Information</h3>
          <p><strong>Email:</strong> {patientData.email}</p>
          <p><strong>Date of Birth:</strong> {patientData.dob || "N/A"}</p>
          <p><strong>Phone:</strong> {patientData.phone || "N/A"}</p>
          {patientData.address && <p><strong>Address:</strong> {patientData.address}</p>}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
