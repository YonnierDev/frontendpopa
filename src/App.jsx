import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

// Páginas públicas
import Login from "./pages/Login";
import Register from "./pages/Register";

// Admin
import DashboardAdmin from "./pages/admip/Dashboard";

// Propietario
import DashboardPropietario from "./pages/propietario/DashboardPropietario";
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
  {isAuthenticated && <Navbar rol={rol} />}
  <div className="main-container">
    <Routes>

      {/* Rutas públicas */}
      <Route
        path="/login"
        element={
          <Login
            setIsAuthenticated={setIsAuthenticated}
            setRol={setRol}
          />
        }
      />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Ruta protegida solo para el dashboard del admin */}
      <Route
        element={<PrivateRoute isAuthenticated={isAuthenticated} allowedRoles={[1]} />}
      >
        <Route path="/admin/dashboard" element={<DashboardAdmin />} />
      </Route>

      {/* Ruta protegida solo para el dashboard del propietario */}
      <Route
        element={<PrivateRoute isAuthenticated={isAuthenticated} allowedRoles={[2]} />}
      >
        <Route path="/propietario/dashboard" element={<DashboardPropietario />} />
      </Route>

      {/* Otras rutas del propietario SIN protección, ya estás logueado */}
      <Route path="/propietario/comentarios" element={<ComentariosProp />} />
      <Route path="/propietario/lugares" element={<LugaresProp />} />
      <Route path="/propietario/eventos" element={<EventosProp />} />
      <Route path="/propietario/reservas" element={<ReservasProp />} />
      <Route path="/propietario/calificaciones" element={<CalificacionesProp />} />
      <Route path="/propietario/categorias" element={<CategoriasProp />} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  </div>
</Router>

  );
}

export default App;
