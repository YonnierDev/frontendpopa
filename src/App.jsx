import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LugarListPage from "./pages/lugar/LugarListPage";
import ReservaListPage from "./pages/reserva/ReservaListPage";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verifica si hay un token en localStorage
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Router>
      {/* Solo muestra Navbar si está autenticado y en "/users" */}
      {isAuthenticated && window.location.pathname === "/lugares" && <Navbar />}

      <div className="main-container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/lugares" element={isAuthenticated ? <LugarListPage /> : <Navigate to="/login" />} />
          <Route path="/reservas" element={isAuthenticated ? <ReservaListPage /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;



