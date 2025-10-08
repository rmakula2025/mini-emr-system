import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminAPI } from "../../api/api";

function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formData, setFormData] = useState({
    patient: "",
    provider_name: "",
    appointment_date: "",
    repeat_schedule: null,
    end_date: null
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [aptsRes, patientsRes] = await Promise.all([
        adminAPI.get("appointments/"),
        adminAPI.get("patients/")
      ]);
      console.log("Fetched appointments:", aptsRes.data);
      if (aptsRes.data.length > 0) {
        console.log("First appointment object:", aptsRes.data[0]);
        console.log("ID field:", aptsRes.data[0].id);
      }
      setAppointments(aptsRes.data);
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
      // Prepare data for submission
      const submitData = {
        patient: formData.patient,
        provider_name: formData.provider_name,
        appointment_date: formData.appointment_date,
        repeat_schedule: formData.repeat_schedule || null,
        end_date: formData.end_date || null
      };

      if (selectedAppointment) {
        const appointmentId = selectedAppointment.id;
        console.log("Updating appointment with ID:", appointmentId);
        console.log("Form data:", submitData);

        if (!appointmentId) {
          alert("Error: Appointment ID is missing");
          return;
        }

        await adminAPI.put(`appointments/${appointmentId}/`, submitData);
      } else {
        await adminAPI.post("appointments/", submitData);
      }
      fetchData();
      closeModal();
    } catch (err) {
      alert("Error saving appointment: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        await adminAPI.delete(`appointments/${id}/`);
        fetchData();
      } catch (err) {
        alert("Error deleting appointment: " + (err.response?.data?.message || err.message));
      }
    }
  };

  const openModal = (appointment = null) => {
    if (appointment) {
      console.log("Opening modal with appointment:", appointment);
      setSelectedAppointment(appointment);

      // Convert datetime to datetime-local format
      const datetime = new Date(appointment.appointment_date);
      const localDatetime = new Date(datetime.getTime() - datetime.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);

      setFormData({
        patient: appointment.patient,
        provider_name: appointment.provider_name,
        appointment_date: localDatetime,
        repeat_schedule: appointment.repeat_schedule || "",
        end_date: appointment.end_date || ""
      });
    } else {
      setSelectedAppointment(null);
      setFormData({
        patient: "",
        provider_name: "",
        appointment_date: "",
        repeat_schedule: null,
        end_date: null
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
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
          <h2>Appointment Management</h2>
          <div>
            <button className="btn btn-success" onClick={() => openModal()}>
              Add New Appointment
            </button>
            <Link to="/admin" className="btn btn-secondary">
              Back to Dashboard
            </Link>
          </div>
        </div>

        {appointments.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Provider</th>
                <th>Date & Time</th>
                <th>Repeat Schedule</th>
                <th>End Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => (
                <tr key={apt.id}>
                  <td>{getPatientName(apt.patient)}</td>
                  <td>{apt.provider_name}</td>
                  <td>{new Date(apt.appointment_date).toLocaleString()}</td>
                  <td>{apt.repeat_schedule || "One-time"}</td>
                  <td>{apt.end_date ? new Date(apt.end_date).toLocaleDateString() : "N/A"}</td>
                  <td>
                    <button className="btn btn-primary" onClick={() => openModal(apt)}>
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(apt.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="alert alert-info">No appointments found.</p>
        )}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedAppointment ? "Edit Appointment" : "Add New Appointment"}</h3>
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
                <label>Provider Name *</label>
                <input
                  type="text"
                  name="provider_name"
                  value={formData.provider_name}
                  onChange={handleInputChange}
                  placeholder="Dr. Smith"
                  required
                />
              </div>
              <div className="form-group">
                <label>Appointment Date & Time *</label>
                <input
                  type="datetime-local"
                  name="appointment_date"
                  value={formData.appointment_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Repeat Schedule</label>
                <input
                  type="text"
                  name="repeat_schedule"
                  value={formData.repeat_schedule}
                  onChange={handleInputChange}
                  placeholder="e.g., weekly, monthly (optional)"
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                />
              </div>
              <div style={{display: 'flex', gap: '10px', justifyContent: 'flex-end'}}>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  {selectedAppointment ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppointmentList;
