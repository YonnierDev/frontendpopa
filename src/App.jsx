import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import "bootstrap/dist/css/bootstrap.min.css";
import { AlertContainer } from "./components/alert/AlertManager";

// Componentes de SuperAdmin
import RolesListPage from "./pages/superadmin/roles/RolesListPage";
import UsuariosListPage from "./pages/superadmin/usuarios/UsuariosListPage";
import CategoriasListPage from "./pages/superadmin/categorias/CategoriasListPage";
import LugaresListPage from "./pages/superadmin/lugares/LugarListPage";
import PerfilListPage from "./pages/superadmin/perfil/PerfilListPage";
import ReservaListPage from "./pages/superadmin/reservas/ReservaListPage";
import SuperAdminPanel from "./pages/superadmin/panel/SuperAdminPanel";
import "./pages/superadmin/styles/SuperAdmin.css";

// Componentes de Adminp
import AdminpDashboard from "./pages/admip/Dashboard";
import AdminpCategorias from "./pages/admip/Categorias";
import AdminpLugares from "./pages/admip/Lugares";
import AdminpReservas from "./pages/admip/Reservas";
import AdminpUsuarios from "./pages/admip/Usuarios";
import AdminpEventos from "./pages/admip/Eventos";
import AdminpCalificaciones from "./pages/admip/Calificaciones";
import AdminpComentarios from "./pages/admip/Comentarios";
import AdminpSolicitudes from "./pages/admip/Solicitudes";
import "./pages/admip/styles/Dashboard.css";

// Componentes de Propietario
import PropietarioDashboard from "./pages/propietario/DashboardPropietario";
import PropietarioLugares from "./pages/propietario/Lugares";
import PropietarioReservas from "./pages/propietario/Reservas";
import PropietarioEventos from "./pages/propietario/Eventos";
import PropietarioComentarios from "./pages/propietario/Comentarios";
import "./pages/propietario/DashboardPropietario.css";

// Componentes de autenticación y home
import Login from "./pages/autenticacion/login/Login";
import Register from "./pages/autenticacion/registro/Register";
import RecuperarContrasena from "./pages/autenticacion/recuperarContraseña/RecuperarContrasena";
import EnviarCorreoRecuperacion from "./pages/autenticacion/recuperarContraseña/EnviarCorreoRecuperacion";
import Home from "./pages/home/Home";
import Navbar2 from './components/home/Navbar';
import Footer2 from './components/home/Footer';
import './App.css';

const AppContent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("token");
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    return !!(token && usuario);
  });

  const location = useLocation();
  const hideHeaderFooter = ["/login", "/register", "/superadmin", "/adminp", "/propietario"].some(path => 
    location.pathname.startsWith(path)
  );

  return (
    <div className="container-fluid p-0">
      {!hideHeaderFooter && <Navbar2 />}

      <div className="row m-0">
        <div className="col-12 p-0">
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
              <Route path="/superadmin/*" element={<SuperAdminPanel />} />
            </Route>

            {/* Rutas protegidas - Adminp (rol 2) */}
            <Route
              element={
                <PrivateRoute
                  isAuthenticated={isAuthenticated}
                  allowedRoles={[2]}
                  redirectPath="/"
                />
              }
            >
              <Route path="/adminp/*" element={<AdminpDashboard />} />
            </Route>

            {/* Rutas protegidas - Propietario (rol 3) */}
            <Route
              element={
                <PrivateRoute
                  isAuthenticated={isAuthenticated}
                  allowedRoles={[3]}
                  redirectPath="/"
                />
              }
            >
              <Route path="/propietario/*" element={<PropietarioDashboard />} />
            </Route>
          </Routes>
        </div>
      </div>

      {!hideHeaderFooter && <Footer2 />}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AlertContainer />
      <AppContent />
    </Router>
  );
};

export default App;
