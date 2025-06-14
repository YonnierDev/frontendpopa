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

    // Si es un error de autenticación y no es una solicitud de reintento
    if (error.response.status === 401 || error.response.status === 403) {
      // Verificar si ya estamos en la página de login para evitar bucles
      if (window.location.pathname === '/login') {
        return Promise.reject(error);
      }

      // Limpiar datos de sesión inválidos
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      
      // Guardar la ruta actual para redirigir después del login
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      
      // Redirigir al login
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

