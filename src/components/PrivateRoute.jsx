import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ isAuthenticated, allowedRoles }) => {
  // Validamos si hay sesión activa y datos del usuario en localStorage
  const storedUser = localStorage.getItem("usuario");
  const token = localStorage.getItem("token");

  // Si no hay token, redirige al login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Si no hay usuario almacenado pero hay token, intenta cargar el perfil
  if (!storedUser) {
    // Aquí podrías hacer una llamada para cargar el perfil del usuario
    // Por ahora, redirigimos al login
    return <Navigate to="/login" />;
  }

  try {
    const usuario = JSON.parse(storedUser);
    const rolUsuario = usuario?.rol;

    // Si el rol no está permitido, muestra un mensaje de acceso denegado
    if (allowedRoles && !allowedRoles.includes(rolUsuario)) {
      console.warn(`Acceso denegado. Se requiere uno de estos roles: ${allowedRoles.join(', ')}`);
      return <div>No tienes permiso para acceder a esta página.</div>;
    }

    // Si todo está bien, renderiza el contenido
    return <Outlet />;
  } catch (error) {
    console.error("Error al procesar los datos del usuario:", error);
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;
