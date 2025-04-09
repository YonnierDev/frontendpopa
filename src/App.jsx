import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserListPage from "./pages/UserListPage";

// Rutas admin
import DashboardAdmip from "./pages/admip/Dashboard";
import ComentariosAdmip from "./pages/admip/Comentarios";
import LugaresAdmip from "./pages/admip/Lugares";
import EventosAdmip from "./pages/admip/Eventos";
import ReservasAdmip from "./pages/admip/Reservas";
import CalificacionesAdmip from "./pages/admip/Calificaciones";
import CategoriasAdmip from "./pages/admip/Categorias";
import UsuariosAdmip from "./pages/admip/Usuarios";

// Rutas propietario
import DashboardProp from "./pages/propietario/Dashboard";
import ComentariosProp from "./pages/propietario/Comentarios";
import LugaresProp from "./pages/propietario/Lugares";
import EventosProp from "./pages/propietario/Eventos";
import ReservasProp from "./pages/propietario/Reservas";
import CalificacionesProp from "./pages/propietario/Calificaciones";
import CategoriasProp from "./pages/propietario/Categorias";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rol, setRol] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    let usuario = null;

    try {
      const storedUsuario = localStorage.getItem("usuario");
      if (storedUsuario && storedUsuario !== "undefined") {
        usuario = JSON.parse(storedUsuario);
        setRol(usuario?.rol);
      }
    } catch (err) {
      console.error("Error al parsear el usuario:", err);
    }

    setIsAuthenticated(!!token);
  }, [isAuthenticated]); // ← corregido: ahora depende de isAuthenticated

  return (
    <Router>
      {/* Navbar solo si está autenticado */}
      {isAuthenticated && <Navbar />}

      <div className="main-container">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas compartidas */}
          <Route path="/usuarios" element={isAuthenticated ? <UserListPage /> : <Navigate to="/login" />} />

          {/* Redirección automática de /dashboard según el rol */}
          <Route
            path="/dashboard"
            element={
              rol === 1 ? <Navigate to="/admip/dashboard" /> :
              rol === 2 ? <Navigate to="/propietario/dashboard" /> :
              <Navigate to="/login" />
            }
          />

          {/* Rutas admin */}
          {rol === 1 && (
            <>
              <Route path="/admip/dashboard" element={<DashboardAdmip />} />
              <Route path="/admip/comentarios" element={<ComentariosAdmip />} />
              <Route path="/admip/lugares" element={<LugaresAdmip />} />
              <Route path="/admip/eventos" element={<EventosAdmip />} />
              <Route path="/admip/reservas" element={<ReservasAdmip />} />
              <Route path="/admip/calificaciones" element={<CalificacionesAdmip />} />
              <Route path="/admip/categorias" element={<CategoriasAdmip />} />
              <Route path="/admip/usuarios" element={<UsuariosAdmip />} />
            </>
          )}

          {/* Rutas propietario */}
          {rol === 2 && (
            <>
              <Route path="/propietario/dashboard" element={<DashboardProp />} />
              <Route path="/propietario/comentarios" element={<ComentariosProp />} />
              <Route path="/propietario/lugares" element={<LugaresProp />} />
              <Route path="/propietario/eventos" element={<EventosProp />} />
              <Route path="/propietario/reservas" element={<ReservasProp />} />
              <Route path="/propietario/calificaciones" element={<CalificacionesProp />} />
              <Route path="/propietario/categorias" element={<CategoriasProp />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
