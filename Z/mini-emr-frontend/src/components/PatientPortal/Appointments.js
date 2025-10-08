import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { patientAPI } from "../../api/api";

function Appointments({ user, setUser }) {
  const [appointments, setAppointments] = useState([]);
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

    const fetchAppointments = async () => {
      try {
        const res = await patientAPI.get(`appointments/${user.id}/`);
        setAppointments(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setLoading(false);
      }
    };

    fetchAppointments();
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

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h2>My Appointments (90 Days)</h2>
          <div>
            <button className="btn btn-secondary" onClick={() => navigate("/portal/dashboard")}>
              Back to Dashboard
            </button>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {appointments.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Provider</th>
                <th>Repeat Schedule</th>
                <th>End Date</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => (
                <tr key={apt.id}>
                  <td>{new Date(apt.appointment_date).toLocaleString()}</td>
                  <td>{apt.provider_name}</td>
                  <td>{apt.repeat_schedule || "One-time"}</td>
                  <td>{apt.end_date ? new Date(apt.end_date).toLocaleDateString() : "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="alert alert-info">No appointments found in the last 90 days.</p>
        )}
      </div>
    </div>
  );
}

export default Appointments;
