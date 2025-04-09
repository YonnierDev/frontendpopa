import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ isAuthenticated, allowedRoles }) => {
  const storedUser = localStorage.getItem("usuario");

  if (!isAuthenticated || !storedUser) {
    return <Navigate to="/login" />;
  }

  const usuario = JSON.parse(storedUser);
  const userRol = usuario?.rol;

  if (!allowedRoles.includes(userRol)) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
