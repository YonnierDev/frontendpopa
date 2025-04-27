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
}

export default App;
