import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { patientAPI } from "../../api/api";

function Medications({ user, setUser }) {
  const [medications, setMedications] = useState([]);
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

    const fetchMedications = async () => {
      try {
        const res = await patientAPI.get(`medications/${user.id}/`);
        setMedications(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching medications:", err);
        setLoading(false);
      }
    };

    fetchMedications();
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
          <h2>My Medications</h2>
          <div>
            <button className="btn btn-secondary" onClick={() => navigate("/portal/dashboard")}>
              Back to Dashboard
            </button>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {medications.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Medication</th>
                <th>Dosage</th>
                <th>Quantity</th>
                <th>Refill Date</th>
                <th>Refill Schedule</th>
              </tr>
            </thead>
            <tbody>
              {medications.map((med) => (
                <tr key={med.id}>
                  <td><strong>{med.name}</strong></td>
                  <td>{med.dosage}</td>
                  <td>{med.quantity}</td>
                  <td>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: new Date(med.refill_date) < new Date() ? '#f8d7da' : '#d4edda',
                      color: new Date(med.refill_date) < new Date() ? '#721c24' : '#155724'
                    }}>
                      {new Date(med.refill_date).toLocaleDateString()}
                    </span>
                  </td>
                  <td>{med.refill_schedule}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="alert alert-info">No medications found.</p>
        )}
      </div>
    </div>
  );
}

export default Medications;
