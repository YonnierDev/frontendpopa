import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserListPage from "./pages/UserListPage";

import Categorias from './pages/propietario/Categorias';
import Lugares from './pages/propietario/Lugares';
import Comentarios from './pages/propietario/Comentarios';
import DashboardPropietario from './pages/propietario/DashboardPropietario';
import Calificaciones from './pages/propietario/Calificaciones';
import Eventos from './pages/propietario/Eventos';
import Reservas from './pages/propietario/Reservas';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Router>
      {isAuthenticated && window.location.pathname === "/usuarios" && <Navbar />}

      <div className="main-container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/usuarios" element={isAuthenticated ? <UserListPage /> : <Navigate to="/login" />} />

          {/* Rutas del propietario */}
          <Route path="/dashboard" element={<DashboardPropietario />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/lugares" element={<Lugares />} />
          <Route path="/comentarios" element={<Comentarios />} />
          <Route path="/calificaciones" element={<Calificaciones />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/reservas" element={<Reservas />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
