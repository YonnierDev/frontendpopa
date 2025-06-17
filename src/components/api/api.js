import axios from "axios";

// Configuración de la URL base según el entorno
const isDevelopment = import.meta.env.DEV;
const baseURL = isDevelopment 
  ? '/api'  // Usar el proxy en desarrollo
  : (import.meta.env.VITE_API_URL || 'https://popnocturna.vercel.app') + '/api';  // Usar la URL completa en producción

console.log('API Base URL:', baseURL);

// Configuración de Axios
export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Access-Control-Allow-Origin': isDevelopment ? 'http://localhost:3000' : undefined,
    'Access-Control-Allow-Credentials': 'true'
  },
  timeout: 10000 // 10 segundos de timeout
});

// Interceptor para añadir el token a las peticiones
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

// Interceptor para manejar respuestas de error
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 y no es una solicitud de login
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Limpiar credenciales inválidas
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      
      // Redirigir al login si no estamos ya en esa página
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Función para verificar si la ruta actual es una ruta de la API
export const isApiRoute = (url) => {
  if (!url) return false;
  return url.startsWith('/api') || 
         (import.meta.env.VITE_API_URL && url.includes(import.meta.env.VITE_API_URL));
};

// Interceptor para manejar respuestas con errores
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Si el error no tiene respuesta o no es un error de autenticación, rechazar directamente
    if (!error.response || (error.response.status !== 401 && error.response.status !== 403)) {
      if (error.request) {
        console.error('Error de red:', error.request);
      } else {
        console.error('Error:', error.message);
      }
      return Promise.reject(error);
    }

    // Solo manejar errores de rutas de la API
    if (isApiRoute(error.config?.url)) {
      // Si es un error de autenticación
      if (error.response.status === 401 || error.response.status === 403) {
        // Verificar si ya estamos en la página de login para evitar bucles
        if (window.location.pathname === '/login') {
          return Promise.reject(error);
        }

        // Verificar si ya se está manejando la redirección
        if (originalRequest._retry) {
          return Promise.reject(error);
        }

        // Marcar la solicitud como ya manejada
        originalRequest._retry = true;
        
        // Limpiar datos de sesión inválidos
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        
        // Guardar la ruta actual para redirigir después del login
        localStorage.setItem('redirectAfterLogin', window.location.pathname);
        
        // Usar el router para navegar en lugar de window.location
        if (window.location.pathname !== '/login') {
          window.dispatchEvent(new Event('unauthorized'));
        }
        
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

