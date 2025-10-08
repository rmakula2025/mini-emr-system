import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminAPI } from "../../api/api";

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    dob: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await adminAPI.get("patients/");
      setPatients(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching patients:", err);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedPatient) {
        await adminAPI.put(`patients/${selectedPatient.id}/`, formData);
      } else {
        await adminAPI.post("patients/", formData);
      }
      fetchPatients();
      closeModal();
    } catch (err) {
      alert("Error saving patient: " + (err.response?.data?.message || err.message));
    }
  };

  const openModal = (patient = null) => {
    if (patient) {
      setSelectedPatient(patient);
      setFormData({
        first_name: patient.first_name,
        last_name: patient.last_name,
        email: patient.email,
        password: "",
        dob: patient.dob,
        phone: patient.phone || "",
        address: patient.address || ""
      });
    } else {
      setSelectedPatient(null);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        dob: "",
        phone: "",
        address: ""
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPatient(null);
  };

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
          <h2>Patient Management</h2>
          <div>
            <button className="btn btn-success" onClick={() => openModal()}>
              Add New Patient
            </button>
            <Link to="/admin" className="btn btn-secondary">
              Back to Dashboard
            </Link>
          </div>
        </div>

        {patients.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Date of Birth</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.first_name} {patient.last_name}</td>
                  <td>{patient.email}</td>
                  <td>{patient.dob}</td>
                  <td>{patient.phone || "N/A"}</td>
                  <td>{patient.address || "N/A"}</td>
                  <td>
                    <button className="btn btn-primary" onClick={() => openModal(patient)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="alert alert-info">No patients found.</p>
        )}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedPatient ? "Edit Patient" : "Add New Patient"}</h3>
              <button className="close" onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>First Name *</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password {!selectedPatient && "*"}</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required={!selectedPatient}
                  placeholder={selectedPatient ? "Leave blank to keep current" : ""}
                />
              </div>
              <div className="form-group">
                <label>Date of Birth *</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              <div style={{display: 'flex', gap: '10px', justifyContent: 'flex-end'}}>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  {selectedPatient ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientList;
