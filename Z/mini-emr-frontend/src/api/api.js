import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

console.log("API Configuration:");
console.log("REACT_APP_API_URL:", process.env.REACT_APP_API_URL);
console.log("BASE_URL:", BASE_URL);

// Admin API instance
export const adminAPI = axios.create({
  baseURL: `${BASE_URL}/admin/`,
});

console.log("Admin API baseURL:", adminAPI.defaults.baseURL);

// Patient Portal API instance
export const patientAPI = axios.create({
  baseURL: `${BASE_URL}/`,
});

// Default export for backward compatibility
export default adminAPI;