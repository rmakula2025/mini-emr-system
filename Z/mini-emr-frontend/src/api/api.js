import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

// Admin API instance
export const adminAPI = axios.create({
  baseURL: `${BASE_URL}/admin/`,
});

// Patient Portal API instance
export const patientAPI = axios.create({
  baseURL: `${BASE_URL}/`,
});

// Default export for backward compatibility
export default adminAPI;