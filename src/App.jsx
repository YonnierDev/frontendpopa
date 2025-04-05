import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/navbar/Navbar";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserListPage from "./pages/UserListPage";
import LugarListPage from "./pages/lugar/LugarListPage";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { AlertContainer } from "./components/AlertManager"; 
import ValidarCorreo from "./pages/ValidarCorreo";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    if (token) {
      const storedUser = localStorage.getItem("username") || "Usuario";
      setUsername(storedUser);
    }
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

          <div className={`col ${isAuthenticated ? "col-md-19" : "col-12"} p-4`}>
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/registrar" element={<Register />} />
              <Route path="/validar/correo" element={<ValidarCorreo />} />
              <Route path="/usuarios" element={isAuthenticated ? <UserListPage /> : <Navigate to="/login" />} />
			        <Route path="/lugares" element={isAuthenticated ? <LugarListPage /> : <Navigate to="/login" />} />
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
