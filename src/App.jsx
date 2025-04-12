import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/header/Header";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import PrivateRoute from "./routes/PrivateRoute";
import Login from "./pages/autenticacion/login/Login";
import Register from "./pages/autenticacion/registro/Register";
import { AlertContainer } from "./components/alert/AlertManager";
import RolesListPage from "./pages/superadmin/roles/RolesListPage";
import UsuariosListPage from "./pages/superadmin/usuarios/UsuariosListPage";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CategoriasListPage from "./pages/superadmin/categorias/CategoriasListPage";
import LugaresListPage from "./pages/superadmin/lugares/LugarListPage";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (token && usuario) {
      setIsAuthenticated(true);
      setUsername(usuario.nombre || "Usuario");
    } else {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <Router>
      <div className="container-fluid d-flex flex-column min-vh-100">
        {isAuthenticated && <Header username={username} />}

        <div className="row flex-grow-1">
          {isAuthenticated && (
            <div className="col-md-2">
              <Navbar setIsAuthenticated={setIsAuthenticated} />
            </div>
          )}

          <div className={`col ${isAuthenticated ? "col-md-10" : "col-12"} p-4`}>
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/register" element={<Register />} />

              
             
                <Route path="usuarios" element={<UsuariosListPage />} />
                <Route path="roles" element={<RolesListPage />} />
                <Route path="categorias" element={<CategoriasListPage />} />
                <Route path="lugares" element={<LugaresListPage />} />
                {/* Podés ir agregando más páginas acá (lugares, eventos, etc.) */}
             
            </Routes>
          </div>
        </div>

        {isAuthenticated && <Footer />}
      </div>
      <AlertContainer />
    </Router>
  );
};

export default App;
