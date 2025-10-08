import axios from "axios";

const getBackendURL = () => {
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    const frontendHost = window.location.hostname;
    if (frontendHost.includes('onrender.com')) {
      return 'https://mini-emr-backend.onrender.com';
    }
  }
  return process.env.REACT_APP_API_URL || "http://localhost:8000";
};

const BASE_URL = getBackendURL();

console.log("API Configuration:");
console.log("Current hostname:", window.location.hostname);
console.log("REACT_APP_API_URL:", process.env.REACT_APP_API_URL);
console.log("BASE_URL:", BASE_URL);

export const adminAPI = axios.create({
  baseURL: `${BASE_URL}/admin/`,
});

console.log("Admin API baseURL:", adminAPI.defaults.baseURL);

export const patientAPI = axios.create({
  baseURL: `${BASE_URL}/`,
});

export default adminAPI;
