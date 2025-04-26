import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

// Páginas públicas
import Login from "./pages/Login";
import Register from "./pages/Register";

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
import Perfil from "./pages/propietario/Perfil";

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsuario = localStorage.getItem("usuario");

    if (token && storedUsuario) {
      setIsAuthenticated(true);
      try {
        const usuario = JSON.parse(storedUsuario);
        setRol(usuario?.rol);
      } catch (err) {
        console.error("Error al parsear el usuario:", err);
        setRol(null);
      }
    } else {
      setIsAuthenticated(false);
      setRol(null);
    }
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
            <Route path="/propietario/perfil" element={<Perfil />} />
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