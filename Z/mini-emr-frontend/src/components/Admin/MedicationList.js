import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminAPI } from "../../api/api";

function MedicationList() {
  const [medications, setMedications] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [formData, setFormData] = useState({
    patient: "",
    name: "",
    dosage: "",
    quantity: 0,
    refill_date: "",
    refill_schedule: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [medsRes, patientsRes] = await Promise.all([
        adminAPI.get("medications/"),
        adminAPI.get("patients/")
      ]);
      setMedications(medsRes.data);
      setPatients(patientsRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedMedication) {
        await adminAPI.put(`medications/${selectedMedication.id}/`, formData);
      } else {
        await adminAPI.post("medications/", formData);
      }
      fetchData();
      closeModal();
    } catch (err) {
      alert("Error saving medication: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this medication?")) {
      try {
        await adminAPI.delete(`medications/${id}/`);
        fetchData();
      } catch (err) {
        alert("Error deleting medication: " + (err.response?.data?.message || err.message));
      }
    }
  };

  const openModal = (medication = null) => {
    if (medication) {
      setSelectedMedication(medication);
      setFormData({
        patient: medication.patient,
        name: medication.name,
        dosage: medication.dosage,
        quantity: medication.quantity,
        refill_date: medication.refill_date,
        refill_schedule: medication.refill_schedule
      });
    } else {
      setSelectedMedication(null);
      setFormData({
        patient: "",
        name: "",
        dosage: "",
        quantity: 0,
        refill_date: "",
        refill_schedule: ""
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMedication(null);
  };

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.first_name} ${patient.last_name}` : "Unknown";
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
          <h2>Medication Management</h2>
          <div>
            <button className="btn btn-success" onClick={() => openModal()}>
              Add New Medication
            </button>
            <Link to="/admin" className="btn btn-secondary">
              Back to Dashboard
            </Link>
          </div>
        </div>

        {medications.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Medication</th>
                <th>Dosage</th>
                <th>Quantity</th>
                <th>Refill Date</th>
                <th>Refill Schedule</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {medications.map((med) => (
                <tr key={med.id}>
                  <td>{getPatientName(med.patient)}</td>
                  <td><strong>{med.name}</strong></td>
                  <td>{med.dosage}</td>
                  <td>{med.quantity}</td>
                  <td>{new Date(med.refill_date).toLocaleDateString()}</td>
                  <td>{med.refill_schedule}</td>
                  <td>
                    <button className="btn btn-primary" onClick={() => openModal(med)}>
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(med.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="alert alert-info">No medications found.</p>
        )}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedMedication ? "Edit Medication" : "Add New Medication"}</h3>
              <button className="close" onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Patient *</label>
                <select
                  name="patient"
                  value={formData.patient}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Patient</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.first_name} {p.last_name} ({p.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Medication Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Lisinopril"
                  required
                />
              </div>
              <div className="form-group">
                <label>Dosage *</label>
                <input
                  type="text"
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleInputChange}
                  placeholder="e.g., 10mg"
                  required
                />
              </div>
              <div className="form-group">
                <label>Quantity *</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="e.g., 30"
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label>Refill Date *</label>
                <input
                  type="date"
                  name="refill_date"
                  value={formData.refill_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Refill Schedule *</label>
                <input
                  type="text"
                  name="refill_schedule"
                  value={formData.refill_schedule}
                  onChange={handleInputChange}
                  placeholder="e.g., monthly, weekly"
                  required
                />
              </div>
              <div style={{display: 'flex', gap: '10px', justifyContent: 'flex-end'}}>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  {selectedMedication ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MedicationList;
