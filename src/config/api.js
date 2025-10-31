// API configuration
const getApiBaseUrl = () => {
  // In Replit, Vite proxy handles forwarding /api calls to backend on port 3000
  // Use relative URL so Vite proxy can handle it properly
  return '/api';
};

const API_BASE_URL = import.meta.env.VITE_API_URL || getApiBaseUrl();

export { API_BASE_URL };