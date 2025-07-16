import axios from 'axios';

// Configuración de la API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json'
    // No establecemos Content-Type aquí para que Axios lo maneje automáticamente
  }
});

// Interceptor para modificar peticiones antes de enviarlas
api.interceptors.request.use(
  (config) => {
    // Solo establecer Content-Type si no es FormData
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    } else {
      // Eliminar Content-Type para que el navegador establezca el boundary automáticamente
      delete config.headers['Content-Type'];
    }
    
    // Agregar token de autenticación si existe
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

// Interceptor para manejar respuestas y errores
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
      const errorMessage = error.response.data?.message || 
                          error.response.data?.error || 
                          error.response.data?.mensaje || 
                          'Error en la petición';
      
      error.message = errorMessage;
      
      console.error('Error de respuesta:', {
        status: error.response.status,
        message: errorMessage,
        url: error.config.url,
        method: error.config.method,
        data: error.config.data,
        headers: error.config.headers
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