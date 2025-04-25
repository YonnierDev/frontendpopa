import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ isAuthenticated, allowedRoles }) => {
  // Validamos si hay sesión activa y datos del usuario en localStorage
  const storedUser = localStorage.getItem("usuario");
  const token = localStorage.getItem("token");

  console.log('Estado de autenticación:', isAuthenticated);
  console.log('Token:', token ? 'Existe' : 'No existe');
  console.log('Usuario almacenado:', storedUser ? 'Existe' : 'No existe');

  // Si no hay sesión o usuario, redirige al login
  if (!isAuthenticated || !storedUser || !token) {
    console.log('Redirigiendo a login por falta de autenticación');
    return <Navigate to="/login" replace />;
  }

  // Obtenemos el rol del usuario desde el localStorage
  const usuario = JSON.parse(storedUser);
  const rolUsuario = parseInt(usuario?.rolid);

  console.log('Rol del usuario:', rolUsuario);
  console.log('Roles permitidos:', allowedRoles);

  // Si el rol no está permitido, redirige al login
  if (!allowedRoles.includes(rolUsuario)) {
    console.log('Redirigiendo a login por rol no permitido');
    return <Navigate to="/login" replace />;
  }

  // Si todo va bien, renderiza la ruta protegida
  console.log('Acceso permitido a la ruta protegida');
  return <Outlet />;
};

export default PrivateRoute;
