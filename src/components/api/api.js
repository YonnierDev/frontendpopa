import axios from "axios";

export const api = axios.create({
  baseURL: "https://popnocturna.vercel.app/api",
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

// Interceptor para manejar respuestas con errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Manejar errores específicos de autenticación
      if (error.response.status === 401 || error.response.status === 403) {
        // No redirigir automáticamente, solo rechazar la promesa
        console.error('Error de autenticación:', error.response.data);
        return Promise.reject(new Error('Error de autenticación'));
      }
    }
    // Para otros errores, simplemente rechazar la promesa
    return Promise.reject(error);
  }
);

