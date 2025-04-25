import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ isAuthenticated, allowedRoles, redirectPath = "/login" }) => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  // Cambiamos de rol a rolid para coincidir con la respuesta del API
  const userRole = usuario?.rolid;

  console.log('Usuario actual:', usuario);
  console.log('Rol del usuario:', userRole);
  console.log('Roles permitidos:', allowedRoles);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(Number(userRole))) {
    console.log('Acceso denegado. Redirigiendo a:', redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
