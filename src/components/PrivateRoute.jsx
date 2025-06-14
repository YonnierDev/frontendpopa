import { Outlet } from "react-router-dom";

const PrivateRoute = () => {
  // Verificamos solo el token
  const token = localStorage.getItem("token");
  
  // Si no hay token, no renderizamos nada
  // La redirección se manejará en el componente de ruta
  if (!token) {
    return null;
  }

  // Si hay token, renderizamos el contenido
  return <Outlet />;
};

export default PrivateRoute;
