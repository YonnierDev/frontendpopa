import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; 
import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserListPage from "./pages/UserListPage";
import Eventos from "./pages/admip/Eventos"; 
import Reservas from "./pages/admip/Reservas";
import Calificaciones from "./pages/admip/Calificaciones";
import Dashboard from "./pages/admip/Dashboard";
import Lugares from "./pages/admip/Lugares";  // Nueva ruta
import Comentarios from "./pages/admip/Comentarios";  // Nueva ruta
import Categorias from "./pages/admip/Categorias";  // Nueva ruta

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verifica si hay un token en localStorage
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Router>
      {/* Solo muestra Navbar si está autenticado y en las rutas especificadas */}
      {isAuthenticated && 
        ["/usuarios", "/eventos", "/reservas", "/calificaciones", "/dashboard", "/lugares", "/comentarios", "/categorias"]
        .includes(window.location.pathname) && <Navbar />
      }

      <div className="main-container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/lugares" element={<Lugares />} />
          <Route path="/comentarios" element={<Comentarios />} />
          <Route path="/usuarios" element={isAuthenticated ? <UserListPage /> : <Navigate to="/login" />} />
          <Route path="/eventos" element={isAuthenticated ? <Eventos /> : <Navigate to="/login" />} /> 
          <Route path="/reservas" element={isAuthenticated ? <Reservas /> : <Navigate to="/login" />} />
          <Route path="/calificaciones" element={isAuthenticated ? <Calificaciones /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/lugares" element={isAuthenticated ? <Lugares /> : <Navigate to="/login" />} />  {/* Nueva ruta */}
          <Route path="/comentarios" element={ <Comentarios /> } />  
          <Route path="/categorias" element={isAuthenticated ? <Categorias /> : <Navigate to="/login" />} />  {/* Nueva ruta */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
