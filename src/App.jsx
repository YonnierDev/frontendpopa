import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/header/Header";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import PrivateRoute from "./routes/PrivateRoute";
import Login from "./pages/autenticacion/login/Login";
import Register from "./pages/autenticacion/registro/Register";
import { AlertContainer } from "./components/alert/AlertManager";
import RolesListPage from "./pages/superadmin/roles/RolesListPage";
import UsuariosListPage from "./pages/superadmin/usuarios/UsuariosListPage";
import CategoriasListPage from "./pages/superadmin/categorias/CategoriasListPage";
import LugaresListPage from "./pages/superadmin/lugares/LugarListPage";
import PerfilListPage from "./pages/superadmin/perfil/PerfilListPage";
import ReservaListPage from "./pages/superadmin/reservas/ReservaListPage";
import SuperAdminPanel from "./pages/superadmin/panel/SuperAdminPanel";
import RecuperarContrasena from "./pages/autenticacion/recuperarContraseña/RecuperarContrasena";
import EnviarCorreoRecuperacion from "./pages/autenticacion/recuperarContraseña/EnviarCorreoRecuperacion";
import Home from "./pages/home/Home";
import Navbar2 from './components/home/Navbar';
import Footer2 from './components/home/Footer';
import './App.css';

const AppContent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("token");
  });

  const [username, setUsername] = useState(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    return usuario?.nombre || "";
  });

  const location = useLocation();
  const hideHeaderFooter = ["/login", "/register"].includes(location.pathname);

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (token && usuario) {
      setIsAuthenticated(true);
      setUsername(usuario.nombre || "Usuario");
    } else {
      setIsAuthenticated(false);
      setUsername("");
    }
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <div className="container-fluid d-flex flex-column min-vh-100">
      {!hideHeaderFooter && (
        isAuthenticated
          ? <Header username={username} setIsAuthenticated={setIsAuthenticated} />
          : <Navbar2 />
      )}

      <div className="row flex-grow-1">
        {isAuthenticated && !hideHeaderFooter && (
          <div className="col-md-2">
            <Navbar setIsAuthenticated={setIsAuthenticated} />
          </div>
        )}

        <div className={`${isAuthenticated && !hideHeaderFooter ? "col-md-10" : "col-12"} p-4`}>
          <Routes>
            {/* Públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/recuperar-contrasena" element={<EnviarCorreoRecuperacion />} />
            <Route path="/recuperar-contrasena/:token" element={<RecuperarContrasena />} />

            {/* Rutas protegidas - SuperAdmin (rol 1) */}
            <Route
              element={
                <PrivateRoute
                  isAuthenticated={isAuthenticated}
                  allowedRoles={[1]}
                  redirectPath="/"
                />
              }
            >
              <Route path="/superadmin" element={<SuperAdminPanel />} />
              <Route path="/superadmin/usuarios" element={<UsuariosListPage />} />
              <Route path="/superadmin/roles" element={<RolesListPage />} />
              <Route path="/superadmin/categorias" element={<CategoriasListPage />} />
              <Route path="/superadmin/lugares" element={<LugaresListPage />} />
              <Route path="/superadmin/reservas" element={<ReservaListPage />} />
              <Route path="/superadmin/perfil" element={<PerfilListPage />} />
            </Route>

            {/* Rutas protegidas - Usuario (rol 8) */}
            <Route path="/panel-de-control" element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <SuperAdminPanel />
              </PrivateRoute>
            } />
            <Route path="/perfil" element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <PerfilListPage />
              </PrivateRoute>
            } />
            <Route path="/usuarios" element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <UsuariosListPage />
              </PrivateRoute>
            } />
            <Route path="/roles" element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <RolesListPage />
              </PrivateRoute>
            } />
            <Route path="/categorias" element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <CategoriasListPage />
              </PrivateRoute>
            } />
            <Route path="/lugares" element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <LugaresListPage />
              </PrivateRoute>
            } />
          </Routes>
        </div>
      </div>

      {!hideHeaderFooter && (isAuthenticated ? <Footer /> : <Footer2 />)}
      <AlertContainer />
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
