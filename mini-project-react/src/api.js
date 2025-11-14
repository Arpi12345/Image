// mini-project-react/src/api.js
import axios from "axios";

const base = import.meta.env.VITE_API_URL || "http://localhost:5000";

const instance = axios.create({
  baseURL: base,
  withCredentials: true,
});

export default instance;
