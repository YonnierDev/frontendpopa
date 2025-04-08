import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; 
import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserListPage from "./pages/UserListPage";
import Categorias from './pages/Categorias';
import Lugares from './pages/Lugares';
import Comentarios from './pages/Comentarios';
import Dashboard from './pages/Dashboard';
import Calificaciones from './pages/Calificaciones';
import Eventos from './pages/Eventos';
import Reservas from './pages/Reservas';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Router>
      {/* Solo muestra Navbar si está autenticado y en "/users" */}
      {isAuthenticated && window.location.pathname === "/usuarios" && <Navbar />}

      <div className="main-container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/usuarios" element={isAuthenticated ? <UserListPage /> : <Navigate to="/login" />} />

          {/* Rutas del propietario */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/lugares" element={<Lugares />} />
          <Route path="/comentarios" element={<Comentarios />} />
          <Route path="/usuarios" element={isAuthenticated ? <UserListPage /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calificaciones" element={<Calificaciones />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/reservas" element={<Reservas />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
