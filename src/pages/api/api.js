import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000", // Quitamos /api/ ya que tus rutas no lo incluyen
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir el token a todas las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
