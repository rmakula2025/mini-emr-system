import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h2>Admin Dashboard</h2>
          <a href="/" className="btn btn-secondary">Patient Portal</a>
        </div>

        <div className="dashboard-grid">
          <div className="stat-card">
            <h3>MANAGE PATIENTS</h3>
            <p>
              <Link to="/admin/patients" style={{textDecoration: 'none', color: '#007bff'}}>
                View All Patients →
              </Link>
            </p>
          </div>

          <div className="stat-card" style={{borderLeftColor: '#28a745'}}>
            <h3>MANAGE MEDICATIONS</h3>
            <p>
              <Link to="/admin/medications" style={{textDecoration: 'none', color: '#007bff'}}>
                View All Medications →
              </Link>
            </p>
          </div>

          <div className="stat-card" style={{borderLeftColor: '#dc3545'}}>
            <h3>MANAGE APPOINTMENTS</h3>
            <p>
              <Link to="/admin/appointments" style={{textDecoration: 'none', color: '#007bff'}}>
                View All Appointments →
              </Link>
            </p>
          </div>
        </div>

        <div style={{marginTop: '30px'}}>
          <h3>Quick Actions</h3>
          <div className="nav-links">
            <Link to="/admin/patients">Patients</Link>
            <Link to="/admin/medications">Medications</Link>
            <Link to="/admin/appointments">Appointments</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
