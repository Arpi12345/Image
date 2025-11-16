import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.DEV
    ? "http://localhost:5000"
    : "https://image-finder-backend-lsf9.onrender.com",
  withCredentials: true,
});


export default api;
