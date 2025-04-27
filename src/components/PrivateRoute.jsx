import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ isAuthenticated, allowedRoles }) => {
  // Validamos si hay sesión activa y datos del usuario en localStorage
  const storedUser = localStorage.getItem("usuario");

  // Si no hay sesión o usuario, redirige al login
  if (!isAuthenticated || !storedUser) {
    return <Navigate to="/login" />;
  }

  // Obtenemos el rol del usuario desde el localStorage
  const usuario = JSON.parse(storedUser);
  const rolUsuario = usuario?.rol;

  // Si el rol no está permitido, redirige al login
  if (!allowedRoles.includes(rolUsuario)) {
    return <Navigate to="/login" />;
  }

  // Si todo va bien, renderiza la ruta protegida
  return <Outlet />;
};

export default PrivateRoute;
