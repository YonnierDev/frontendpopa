import axios from "axios";

export const api = axios.create({
<<<<<<< HEAD
 baseURL: "https://popnocturna.vercel.app/api",
 // baseURL: "http://localhost:7000/api",
=======
  baseURL: "https://popnocturna.vercel.app/api",
>>>>>>> ccc46c449c7b88d96706a7a04dd4d76f73543425
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

