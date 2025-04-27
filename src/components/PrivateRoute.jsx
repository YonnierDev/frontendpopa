import { Navigate, Outlet } from "react-router-dom";

<<<<<<< HEAD
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
=======
const PrivateRoute = ({ allowedRoles, rol }) => {
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
  console.log("PrivateRoute - allowedRoles:", allowedRoles);
  console.log("PrivateRoute - rol (prop):", rol);
  console.log("PrivateRoute - token:", token);
  console.log("PrivateRoute - usuario (raw):", storedUser);
  console.log("PrivateRoute - usuario (parseado):", usuario);
  console.log("PrivateRoute - rolUsuario (localStorage):", rolUsuario);

  // Si no hay sesión o usuario, redirige al login
  if (!storedUser || !token) {
    console.warn("PrivateRoute: Falta sesión o usuario/token. Redirigiendo a login.");
    return <Navigate to="/login" replace />;
  }

  // Verifica si el rol del usuario está permitido
  const isRoleAllowed = allowedRoles.includes(Number(rolUsuario)) || allowedRoles.includes(Number(rol));
  
  if (!isRoleAllowed) {
    console.warn("PrivateRoute: Rol no permitido. Redirigiendo a login.");
>>>>>>> 4c6738033daad045332ce1cc617753bbd4797571
    return <Navigate to="/login" replace />;
  }

  // Si todo va bien, renderiza la ruta protegida
<<<<<<< HEAD
  console.log('Acceso permitido a la ruta protegida');
=======
>>>>>>> 4c6738033daad045332ce1cc617753bbd4797571
  return <Outlet />;
};

export default PrivateRoute;
