import axios from "axios";

// Try to get the backend URL from environment or use a fallback
const getBackendURL = () => {
  // Check if we're in production (deployed)
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    // In production, try to construct the backend URL
    const frontendHost = window.location.hostname;
    if (frontendHost.includes('onrender.com')) {
      // If frontend is on Render, assume backend is also on Render
      return 'https://mini-emr-backend.onrender.com';
    }
  }
  
  // Fallback to environment variable or localhost
  return process.env.REACT_APP_API_URL || "http://localhost:8000";
};

const BASE_URL = getBackendURL();

console.log("API Configuration:");
console.log("Current hostname:", window.location.hostname);
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