import { Outlet, Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ isAuthenticated, allowedRoles = [] }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const storedUsuario = localStorage.getItem("usuario");
  
  // Si no hay token o usuario, redirigir al login
  if (!token || !storedUsuario) {
    // Guardar la ruta actual para redirigir después del login
    localStorage.setItem('redirectAfterLogin', location.pathname);
    return <Navigate to="/login" replace />;
  }

  try {
    const usuario = JSON.parse(storedUsuario);
    
    // Verificar si el usuario tiene un rol permitido
    const tieneRolPermitido = allowedRoles.length === 0 || 
      (usuario?.rol && allowedRoles.includes(usuario.rol));
    
    if (!tieneRolPermitido) {
      // Si el usuario no tiene un rol permitido, redirigir al dashboard según su rol
      let redirectPath = '/login';
      switch(usuario?.rol) {
        case 1: // Super Admin
          redirectPath = '/superadmin/dashboard';
          break;
        case 2: // Admin
          redirectPath = '/admip/dashboard';
          break;
        case 3: // Propietario
          redirectPath = '/propietario/dashboard';
          break;
        default:
          break;
      }
      return <Navigate to={redirectPath} replace />;
    }

    // Si está autenticado y tiene un rol permitido, renderizar el contenido
    return <Outlet />;
  } catch (error) {
    console.error('Error al verificar autenticación:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    return <Navigate to="/login" replace />;
  }
};

export default PrivateRoute;
