import axios from "axios";

// Configuración de la URL base según el entorno
const baseURL = import.meta.env.VITE_API_URL || 'https://popnocturna.vercel.app/api';

// Configuración de Axios
export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000,
  // Eliminar headers automáticos que podrían causar problemas
  transformRequest: [(data, headers) => {
    delete headers.common['Cache-Control'];
    return data;
  }]
});

// Interceptor para ajustar todas las rutas automáticamente
api.interceptors.request.use(
  (config) => {
    // Si la ruta no empieza con /api/, agregarlo
    if (config.url && !config.url.startsWith('/api/')) {
      // Asegurarse de que no haya dobles slashes
      const url = config.url.startsWith('/') ? config.url : '/' + config.url;
      config.url = `/api${url}`;
    }
    return config;
  }
);

// Interceptor para añadir el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const isApiRoute = (url) => url?.startsWith('/api');

