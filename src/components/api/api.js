import axios from 'axios';

// Configuración de la API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para manejar errores
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Si hay una respuesta del servidor
    if (error.response) {
      // Error 401 - No autorizado
      if (error.response.status === 401) {
        console.warn('Sesión expirada o no autorizada');
        // Limpiar datos de sesión
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        // Redirigir al login si no estamos ya en esa página
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      
      // Mostrar mensaje de error del servidor si existe
      const errorMessage = error.response.data?.message || error.response.data?.error || 'Error en la petición';
      error.message = errorMessage;
      
      console.error('Error de respuesta:', {
        status: error.response.status,
        message: errorMessage,
        url: error.config.url,
        method: error.config.method
      });
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      console.error('No se recibió respuesta del servidor:', error.request);
      error.message = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
    } else {
      // Algo sucedió en la configuración de la petición que generó un error
      console.error('Error en la configuración de la petición:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export { api };