import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

// Páginas públicas
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserListPage from "./pages/UserListPage"; // si aún la usas

// Admin
import DashboardAdmip from "./pages/admip/Dashboard";
import ComentariosAdmip from "./pages/admip/Comentarios";
import LugaresAdmip from "./pages/admip/Lugares";
import EventosAdmip from "./pages/admip/Eventos";
import ReservasAdmip from "./pages/admip/Reservas";
import CalificacionesAdmip from "./pages/admip/Calificaciones";
import CategoriasAdmip from "./pages/admip/Categorias";
import UsuariosAdmip from "./pages/admip/Usuarios";

// SuperAdmin
import DashboardSuperAdmin from "./pages/superadmin/DashboardSuperAdmin";

// Propietario
import DashboardProp from "./pages/propietario/DashboardPropietario";
import ComentariosProp from "./pages/propietario/Comentarios";
import LugaresProp from "./pages/propietario/Lugares";
import EventosProp from "./pages/propietario/Eventos";
import ReservasProp from "./pages/propietario/Reservas";
import CalificacionesProp from "./pages/propietario/Calificaciones";
import CategoriasProp from "./pages/propietario/Categorias";

import { AlertContainer } from "./components/alert/AlertManager";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rol, setRol] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsuario = localStorage.getItem("usuario");

    setIsAuthenticated(!!token);

    if (token && storedUsuario) {
      try {
        const usuario = JSON.parse(storedUsuario);
        setRol(usuario?.rol);
      } catch (err) {
        console.error("Error al parsear el usuario:", err);
        setRol(null);
      }
    } else {
      setRol(null);
    }
  }, []);

  return (
    <Router>
      {isAuthenticated && <Navbar rol={rol} />}
      <div className="main-container">
        <Routes>

          {/* Rutas públicas */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas protegidas - ADMIN (rol: 1) */}
          <Route element={<PrivateRoute isAuthenticated={isAuthenticated} allowedRoles={[1]} />}>
            <Route path="/admip/dashboard" element={<DashboardAdmip />} />
            <Route path="/admip/comentarios" element={<ComentariosAdmip />} />
            <Route path="/admip/lugares" element={<LugaresAdmip />} />
            <Route path="/admip/eventos" element={<EventosAdmip />} />
            <Route path="/admip/reservas" element={<ReservasAdmip />} />
            <Route path="/admip/calificaciones" element={<CalificacionesAdmip />} />
            <Route path="/admip/categorias" element={<CategoriasAdmip />} />
            <Route path="/admip/usuarios" element={<UsuariosAdmip />} />
          </Route>

          {/* Rutas protegidas - SUPERADMIN (rol: 1) */}
          <Route element={<PrivateRoute isAuthenticated={isAuthenticated} allowedRoles={[1]} />}>
            <Route path="/superadmin/dashboard" element={<DashboardSuperAdmin />} />
          </Route>

          {/* Rutas protegidas - PROPIETARIO (rol: 2) */}
          <Route element={<PrivateRoute isAuthenticated={isAuthenticated} allowedRoles={[2]} />}>
            <Route path="/propietario/dashboard" element={<DashboardProp />} />
            <Route path="/propietario/comentarios" element={<ComentariosProp />} />
            <Route path="/propietario/lugares" element={<LugaresProp />} />
            <Route path="/propietario/eventos" element={<EventosProp />} />
            <Route path="/propietario/reservas" element={<ReservasProp />} />
            <Route path="/propietario/calificaciones" element={<CalificacionesProp />} />
            <Route path="/propietario/categorias" element={<CategoriasProp />} />
          </Route>

          {/* Ruta para cualquier otro path no válido */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
      <AlertContainer />
    </Router>
  );
}

export default App;
