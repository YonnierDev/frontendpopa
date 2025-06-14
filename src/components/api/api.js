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

// Función para verificar si la ruta actual es una ruta de la API
const isApiRoute = (url) => {
  return url && (url.startsWith('https://popnocturna.vercel.app/api') || url.startsWith('/api'));
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

