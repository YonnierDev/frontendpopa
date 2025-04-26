import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import GuestModal from "./components/GuestModal";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer } from 'react-toastify';
// Páginas públicas
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/home/Home";
import LugarDetalleHome from "./pages/home/LugarDetalleHome";
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
// Categoría personalizada
import CategoriaContenido from "./pages/CategoriaContenido";

const NavbarWrapper = ({ isAuthenticated, rol }) => {
  const location = useLocation();
  const publicPaths = ["/login", "/register"];
  if (publicPaths.includes(location.pathname)) return null;
  return isAuthenticated ? <Navbar rol={rol} /> : null;
};

const AppRoutes = ({
  isAuthenticated,
  rol,
  guestModalOpen,
  setGuestModalOpen,
  userIsAuthenticated
}) => {
  const location = useLocation();

  // Solo en HOME: bloquea clicks si NO está autenticado (excepto login/register)
  useEffect(() => {
    // Si el usuario está autenticado, NO agregues ningún event listener ni muestres el modal
    if (userIsAuthenticated) {
      setGuestModalOpen(false);
      // Elimina cualquier listener residual
      document.body.onclick = null;
      document.body.onpointerdown = null;
      return;
    }
    if (location.pathname === '/') {
      const handleClick = (e) => {
        if (
          e.target.closest(".login-btn-navbar") ||
          e.target.closest("[href='/login']") ||
          e.target.closest("[href='/register']")
        ) return;
        if (document.querySelector('.guest-modal-content')?.contains(e.target)) return;
        setGuestModalOpen(true);
        e.stopPropagation();
        e.preventDefault();
      };
      document.body.addEventListener("click", handleClick, true);
      return () => document.body.removeEventListener("click", handleClick, true);
    }
  }, [userIsAuthenticated, location.pathname, setGuestModalOpen]);

  // Si el usuario está autenticado, fuerza el cierre del modal en cada render
  if (userIsAuthenticated && guestModalOpen) {
    setGuestModalOpen(false);
  }

  return (
    <>
      <GuestModal
        open={guestModalOpen && !userIsAuthenticated}
        onClose={() => setGuestModalOpen(false)}
        onLogin={() => {
          setGuestModalOpen(false);
          window.location.href = '/login';
        }}
      />
      <NavbarWrapper isAuthenticated={isAuthenticated} rol={rol} />
      <div className="main-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Página de inicio pública */}
          <Route path="/lugar/:id" element={<LugarDetalleHome />} />
          {/* Página de detalle de categoría personalizada */}
          <Route path="/categoria/:categoria" element={<CategoriaContenido />} />
          {/* Rutas protegidas - ADMIN (rol: 2) */}
          <Route element={<PrivateRoute isAuthenticated={isAuthenticated} allowedRoles={[2]} rol={rol} />}>
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
          <Route element={<PrivateRoute isAuthenticated={isAuthenticated} allowedRoles={[3]} rol={rol} />}>
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
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <ToastContainer />
    </>
  );
};

export default AppRoutes;
