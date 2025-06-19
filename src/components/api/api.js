import axios from "axios";

// Configuración de entorno
const isDevelopment = import.meta.env.DEV;
const baseURL = isDevelopment 
  ? '/api'  // Usa proxy en desarrollo
  : 'https://popnocturna.vercel.app/api';  // URL directa en producción

// Crear instancia de Axios
export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para añadir token a las peticiones
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Interceptor para manejar errores
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      const loginPath = isDevelopment 
        ? '/login' 
        : 'https://frontendpopa.vercel.app/login';
      window.location.href = loginPath;
    }
    return Promise.reject(error);
  }
);

// Debug
if (isDevelopment) {
  console.log('API Config - Entorno:', isDevelopment ? 'Desarrollo' : 'Producción');
  console.log('API Base URL:', baseURL);
}