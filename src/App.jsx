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
    </Router>
  );
}

export default App;
