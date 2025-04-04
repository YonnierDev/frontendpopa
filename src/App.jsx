import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserListPage from "./pages/UserListPage";
import Eventos from "./pages/Eventos"; 
import Reservas from "./pages/Reservas";
import Calificaciones from "./pages/Calificaciones";
import Dashboard from "./pages/Dashboard";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verifica si hay un token en localStorage
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Router>
      {/* Solo muestra Navbar si está autenticado y en "/usuarios" o "/eventos" */}
      {isAuthenticated && ["/usuarios", "/eventos"].includes(window.location.pathname) && <Navbar />}

      <div className="main-container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/usuarios" element={isAuthenticated ? <UserListPage /> : <Navigate to="/login" />} />
          <Route path="/eventos" element={isAuthenticated ? <Eventos /> : <Navigate to="/login" />} /> 
          <Route path="/reservas" element={isAuthenticated ? <Reservas /> : <Navigate to="/login" />} />
          <Route path="/calificaciones" element={isAuthenticated ? <Calificaciones /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
