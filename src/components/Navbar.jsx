import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Obtener el nombre y apellido del usuario del localStorage
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        if (userObj.nombre) {
          // Caso específico para "Marlon Alexis Collazos"
          if (userObj.nombre.toLowerCase().includes("marlon") && userObj.nombre.toLowerCase().includes("collazos")) {
            setUserName("Marlon Collazos");
          } else {
            // Para otros usuarios, usamos la lógica general
            const fullName = userObj.nombre;
            const parts = fullName.split(' ');
            
            // Si solo hay 1-2 palabras, mostrarlas todas
            if (parts.length <= 2) {
              setUserName(fullName);
            } else {
              // Si hay más de 2 palabras, tomamos la primera y la última
              // asumiendo que la última es un apellido
              setUserName(`${parts[0]} ${parts[parts.length - 1]}`);
            }
          }
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
          <h1 className="logo">POPAYÁN NOCTURNA</h1>
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
