import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ isAuthenticated, allowedRoles, rol }) => {
  const storedUser = localStorage.getItem("usuario");
  const token = localStorage.getItem("token");

  let usuario;
  let rolUsuario;
  try {
    usuario = storedUser ? JSON.parse(storedUser) : null;
    rolUsuario = usuario?.rolid;
  } catch (e) {
    rolUsuario = undefined;
  }

  // LOGS DE DEPURACIÓN
  console.log("PrivateRoute - isAuthenticated:", isAuthenticated);
  console.log("PrivateRoute - allowedRoles:", allowedRoles);
  console.log("PrivateRoute - rol (prop):", rol);
  console.log("PrivateRoute - token:", token);
  console.log("PrivateRoute - usuario (raw):", storedUser);
  console.log("PrivateRoute - usuario (parseado):", usuario);
  console.log("PrivateRoute - rolUsuario (localStorage):", rolUsuario);

  // Si no hay sesión o usuario, redirige al login
  if (!isAuthenticated || !storedUser || !token) {
    console.warn("PrivateRoute: Falta sesión o usuario/token. Redirigiendo a login.");
    return <Navigate to="/login" replace />;
  }

  // CORRECCIÓN: Permite acceso si el rol ES IGUAL a alguno de allowedRoles, ya sea por prop o por usuario
  if (!allowedRoles.includes(Number(rolUsuario)) && !allowedRoles.includes(Number(rol))) {
    console.warn("PrivateRoute: Rol no permitido. Redirigiendo a login.");
    return <Navigate to="/login" replace />;
  }

  // Si todo va bien, renderiza la ruta protegida
  return <Outlet />;
};

export default PrivateRoute;
