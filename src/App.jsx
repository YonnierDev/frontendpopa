<<<<<<< HEAD
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
=======
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import AppRoutes from "./AppRoutes";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

// Páginas públicas
import Login from "./pages/Login";
import Register from "./pages/Register";

// Super Admin
import SuperAdminPanel from "./pages/SuperA/SuperAdminPanel";
import UsuariosSuper from "./pages/SuperA/UsuariosSuper";
import ComentariosSuper from "./pages/SuperA/ComentariosSuper";
import LugaresSuper from "./pages/SuperA/LugaresSuper";
import EventosSuper from "./pages/SuperA/EventosSuper";
import ReservasSuper from "./pages/SuperA/ReservasSuper";
import CalificacionesSuper from "./pages/SuperA/CalificacionesSuper";
import CategoriasSuper from "./pages/SuperA/CategoriasSuper";

// Admin
import DashboardAdmip from "./pages/admip/Dashboard";
import ComentariosAdmip from "./pages/admip/Comentarios";
import LugaresAdmip from "./pages/admip/Lugares";
import EventosAdmip from "./pages/admip/Eventos";
import ReservasAdmip from "./pages/admip/Reservas";
import CalificacionesAdmip from "./pages/admip/Calificaciones";
import CategoriasAdmip from "./pages/admip/Categorias";
import UsuariosAdmip from "./pages/admip/Usuarios";

// Propietario
import DashboardPropietario from "./pages/propietario/DashboardPropietario";
import LugarDetalle from "./pages/propietario/LugarDetalle";
import ComentariosProp from "./pages/propietario/Comentarios";
import LugaresProp from "./pages/propietario/Lugares";
import EventosProp from "./pages/propietario/Eventos";
import ReservasProp from "./pages/propietario/Reservas";
import CalificacionesProp from "./pages/propietario/Calificaciones";
import CategoriasProp from "./pages/propietario/Categorias";

// Mostrar u ocultar Navbar
const NavbarWrapper = ({ isAuthenticated, rol }) => {
  const location = useLocation();
  const publicPaths = ["/login", "/register"];
  if (publicPaths.includes(location.pathname)) return null;
  return isAuthenticated ? <Navbar rol={rol} /> : null;
};

// Función para obtener el estado inicial de autenticación
const getInitialAuth = () => {
  const token = localStorage.getItem("token");
  const usuario = localStorage.getItem("usuario");
  let rol = null;
  
  if (token && usuario) {
    try {
      const userObj = JSON.parse(usuario);
      rol = userObj?.rolid;
    } catch (error) {
      console.error("Error al parsear usuario:", error);
    }
  }

  return {
    isAuthenticated: Boolean(token && usuario),
    token,
    usuario,
    rol
  };
};

function App() {
  const initial = getInitialAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(initial.isAuthenticated);
  const [rol, setRol] = useState(initial.rol);
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [token, setToken] = useState(initial.token);
  const [usuario, setUsuario] = useState(initial.usuario);
  const userIsAuthenticated = Boolean(token && usuario);

  // Redirige si hay un redirect pendiente tras login
  useEffect(() => {
    const redirectTo = localStorage.getItem("redirectTo");
    if (redirectTo) {
      localStorage.removeItem("redirectTo");
      window.location.replace(redirectTo);
    }
  }, []);

  useEffect(() => {
    const syncAuth = () => {
      const t = localStorage.getItem("token");
      const u = localStorage.getItem("usuario");
      setToken(t);
      setUsuario(u);
      if (!t || !u) {
        setGuestModalOpen(false);
      }
      setIsAuthenticated(Boolean(t && u));
      if (t && u) {
        try {
          const userObj = JSON.parse(u);
          setRol(userObj?.rolid);
        } catch {
          setRol(null);
        }
      } else {
        setRol(null);
      }
    };
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);
>>>>>>> 4c6738033daad045332ce1cc617753bbd4797571

  useEffect(() => {
    setIsAuthenticated(Boolean(token && usuario));
    if (token && usuario) {
      try {
        const userObj = JSON.parse(usuario);
        setRol(userObj?.rolid);
      } catch {
        setRol(null);
      }
    } else {
      setRol(null);
      setGuestModalOpen(false);
    }
  }, [token, usuario]);

  return (
<<<<<<< HEAD
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
=======
    <Router>
      <NavbarWrapper isAuthenticated={isAuthenticated} rol={rol} />
      <div className="main-container">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setRol={setRol} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Rutas protegidas - SUPER ADMIN (rol: 1) */}
          <Route element={<PrivateRoute isAuthenticated={isAuthenticated} allowedRoles={[1]} />}>
            <Route path="/superadmin/dashboard" element={<SuperAdminPanel />} />
            <Route path="/superadmin/usuarios" element={<UsuariosSuper />} />
            <Route path="/superadmin/comentarios" element={<ComentariosSuper />} />
            <Route path="/superadmin/lugares" element={<LugaresSuper />} />
            <Route path="/superadmin/eventos" element={<EventosSuper />} />
            <Route path="/superadmin/reservas" element={<ReservasSuper />} />
            <Route path="/superadmin/calificaciones" element={<CalificacionesSuper />} />
            <Route path="/superadmin/categorias" element={<CategoriasSuper />} />
          </Route>

          {/* Rutas protegidas - ADMIN (rol: 2) */}
          <Route element={<PrivateRoute isAuthenticated={isAuthenticated} allowedRoles={[2]} />}>
            <Route path="/admip/dashboard" element={<DashboardAdmip />} />
            <Route path="/admip/comentarios" element={<ComentariosAdmip />} />
            <Route path="/admip/lugares" element={<LugaresAdmip />} />
            <Route path="/admip/eventos" element={<EventosAdmip />} />
            <Route path="/admip/reservas" element={<ReservasAdmip />} />
            <Route path="/admip/calificaciones" element={<CalificacionesAdmip />} />
            <Route path="/admip/categorias" element={<CategoriasAdmip />} />
            <Route path="/admip/usuarios" element={<UsuariosAdmip />} />
          </Route>

          {/* Rutas protegidas - PROPIETARIO (rol: 3) */}
          <Route element={<PrivateRoute isAuthenticated={isAuthenticated} allowedRoles={[3]} />}>
            <Route path="/propietario/dashboard" element={<DashboardPropietario />} />
            <Route path="/propietario/lugar/:id" element={<LugarDetalle />} />
            <Route path="/propietario/lugares" element={<LugaresProp />} />
            <Route path="/propietario/eventos" element={<EventosProp />} />
            <Route path="/propietario/reservas" element={<ReservasProp />} />
            <Route path="/propietario/comentarios" element={<ComentariosProp />} />
            <Route path="/propietario/calificaciones" element={<CalificacionesProp />} />
            <Route path="/propietario/categorias" element={<CategoriasProp />} />
          </Route>

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
      <ToastContainer />
>>>>>>> 4c6738033daad045332ce1cc617753bbd4797571
    </Router>
  );
}

export default App;
