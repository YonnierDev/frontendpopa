import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Obtener el nombre del usuario del localStorage
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        if (userObj.nombre) {
          // Obtener solo el primer nombre
          const firstName = userObj.nombre.split(" ")[0];
          setUserName(firstName);
        }
      } catch (error) {
        console.error("Error al parsear el usuario:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-left">
          <h1 className="logo">Panel de Control - Popayán Nocturna</h1>
        </div>
        <div className="nav-right">
          <div className="user-info">
            <span className="user-icon">👤</span>
            <span className="user-name">{userName}</span>
          </div>
        </div>
      </div>      
    </nav>
  );
};

export default Navbar;
