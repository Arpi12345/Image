// mini-project-react/src/api/index.js
import axios from "axios";

// use VITE_API_URL (set on Render / .env). Fallback to localhost for local dev
const BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BASE,
  withCredentials: true, // important for cookies / sessions
});

export default api;
