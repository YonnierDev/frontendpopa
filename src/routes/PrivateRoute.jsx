<<<<<<< HEAD
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to="/login" />;
=======
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ isAuthenticated, allowedRoles }) => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const rolUsuario = usuario?.rol;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(rolUsuario)) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
>>>>>>> ccc46c449c7b88d96706a7a04dd4d76f73543425
};

export default PrivateRoute;
