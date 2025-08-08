import axios from "axios";

const PORT = import.meta.env.VITE_BACKEND_PORT || 8080;

export const api = axios.create({
  baseURL: `http://localhost:${PORT}`,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
