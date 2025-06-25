import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

// Páginas públicas
import Login from "./pages/Login";
import Register from "./pages/Register";

// Super
import SuperAdminPanel from "./pages/SuperA/SuperAdminPanel";
import UsuariosSuper from "./pages/SuperA/UsuariosSuper";
import RolesSuper from "./pages/SuperA/RolesSuper";
import CategoriasSuper from "./pages/SuperA/CategoriasSuper";
import PendientesSuper from "./pages/SuperA/PendientesSuper";
import CalificacionesSuper from "./pages/SuperA/CalificacionesSuper";
import ComentariosSuper from "./pages/SuperA/ComentariosSuper";
import EventosSuper from "./pages/SuperA/EventosSuper";
import ReservasSuper from "./pages/SuperA/ReservasSuper";
import LugaresSuper from "./pages/SuperA/LugaresSuper";

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
import EventosProp from "./pages/propietario/Eventos";
import ReservasProp from "./pages/propietario/Reservas";
import CalificacionesProp from "./pages/propietario/Calificaciones";
import CategoriasProp from "./pages/propietario/Categorias";
import Perfil from "./pages/propietario/Perfil";
import Lugares from "./pages/propietario/Lugares";
import ReportCometPageSuper from "./pages/SuperA/ReportCometPageSuper";

// Mostrar u ocultar Navbar
const NavbarWrapper = ({ isAuthenticated, rol }) => {
  const location = useLocation();
  const publicPaths = ["/login", "/register"];
  if (publicPaths.includes(location.pathname)) return null;
  return isAuthenticated ? <Navbar rol={rol} /> : null;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rol, setRol] = useState(null);

  // Función para verificar la autenticación
  const verificarAutenticacion = () => {
    const token = localStorage.getItem("token");
    const storedUsuario = localStorage.getItem("usuario");
    
    if (token && storedUsuario) {
      try {
        const usuario = JSON.parse(storedUsuario);
        // Solo actualizar si los valores son diferentes
        setIsAuthenticated(prev => {
          if (prev !== true) return true;
          return prev;
        });
        setRol(prevRol => {
          if (prevRol !== usuario?.rol) return usuario?.rol;
          return prevRol;
        });
      } catch (err) {
        console.error("Error al parsear el usuario:", err);
        setIsAuthenticated(false);
        setRol(null);
      }
    } else {
      setIsAuthenticated(false);
      setRol(null);
    }
  };

  // Verificar autenticación al montar
  useEffect(() => {
    verificarAutenticacion();
    
    // Escuchar cambios en el localStorage
    const handleStorageChange = () => {
      verificarAutenticacion();
    };

    // Manejar evento de autenticación no autorizada
    const handleUnauthorized = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      setIsAuthenticated(false);
      setRol(null);
      
      // Guardar la ruta actual para redirigir después del login
      const currentPath = window.location.pathname;
      if (currentPath !== '/login') {
        localStorage.setItem('redirectAfterLogin', currentPath);
      }
      
      // Redirigir al login si no estamos ya ahí
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('unauthorized', handleUnauthorized);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('unauthorized', handleUnauthorized);
    };
  }, []);

  return (
    <Router>
      <NavbarWrapper isAuthenticated={isAuthenticated} rol={rol} />
      <div className="main-container">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setRol={setRol} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Rutas protegidas - SUPER (rol: 1) */}
          <Route element={<PrivateRoute isAuthenticated={isAuthenticated} allowedRoles={[1]} />}>
            <Route path="/superadmin/dashboard" element={<SuperAdminPanel />} />
            <Route path="/superadmin/usuarios" element={<UsuariosSuper />} />
            <Route path="/superadmin/roles" element={<RolesSuper />} />
            <Route path="/superadmin/categorias" element={<CategoriasSuper />} />
            <Route path="/superadmin/pendientes" element={<PendientesSuper />} />
            <Route path="/superadmin/calificaciones" element={<CalificacionesSuper />} />
            <Route path="/superadmin/comentarios" element={<ComentariosSuper />} />
            <Route path="/superadmin/eventos" element={<EventosSuper />} />
            <Route path="/superadmin/reservas" element={<ReservasSuper />} />
            <Route path="/superadmin/lugares" element={<LugaresSuper />} />
            <Route path="/superadmin/reportes" element={<ReportCometPageSuper/>} />
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
            <Route path="/propietario/comentarios/:id" element={<ComentariosProp />} />
            <Route path="/propietario/eventos" element={<EventosProp />} />
            <Route path="/propietario/reservas" element={<ReservasProp />} />
            <Route path="/propietario/calificaciones/:lugarid" element={<CalificacionesProp />} />
            <Route path="/propietario/categorias" element={<CategoriasProp />} />
            <Route path="/propietario/perfil" element={<Perfil />} />
            <Route path="/propietario/lugares" element={<Lugares />} />
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