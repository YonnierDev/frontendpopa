import axios from "axios";

export const api = axios.create({
  baseURL: "https://popnocturna.vercel.app/api", // Asegúrate de que el backend usa HTTPS
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

