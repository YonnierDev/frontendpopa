import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// Importa todos los componentes
import Calificaciones from "./Calificaciones";
import Eventos from "./Eventos";
import Reservas from "./Reservas";
import Categorias from "./Categorias";
import Usuarios from "./Usuarios";
import Lugares from "./Lugares";
import Comentarios from "./Comentarios";
import "../admip/styles/Dashboard.css";

const Dashboard = () => {
  const [mostrarSeccion, setMostrarSeccion] = useState("bienvenida");
  const navigate = useNavigate();

  useEffect(() => {
    setMostrarSeccion("bienvenida");
  }, []);

  const handleMostrarSeccion = (seccion) => {
    setMostrarSeccion(seccion);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate('/login');
  };

  return (
    <div>
      <div className="dashboard-container">
        {/* Barra Lateral */}
        <div className="sidebar">
          <button className="menu-btn" onClick={() => handleMostrarSeccion("categorias")}>Categorías</button>
          <button className="menu-btn" onClick={() => handleMostrarSeccion("usuarios")}>Usuarios</button>
          <button className="menu-btn" onClick={() => handleMostrarSeccion("lugares")}>Lugares</button>
          <button className="menu-btn" onClick={() => handleMostrarSeccion("comentarios")}>Comentarios</button>
          <button className="menu-btn" onClick={() => handleMostrarSeccion("eventos")}>Eventos</button>
          <button className="menu-btn" onClick={() => handleMostrarSeccion("reservas")}>Reservas</button>
          <button className="menu-btn" onClick={() => handleMostrarSeccion("calificaciones")}>Calificaciones</button>

          <div className="logout-container">
            <button className="logout-btn" onClick={handleLogout}>Cerrar Sesión</button>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="content">
          {mostrarSeccion === "bienvenida" && (
            <div className="welcome-section">
              <h2>Bienvenido Administrador</h2>
              <p>Utiliza el menú lateral para gestionar el sistema.</p>
            </div>
          )}
          {mostrarSeccion === "categorias" && <Categorias />}
          {mostrarSeccion === "usuarios" && <Usuarios />}
          {mostrarSeccion === "lugares" && <Lugares />}
          {mostrarSeccion === "comentarios" && <Comentarios />}
          {mostrarSeccion === "eventos" && <Eventos />}
          {mostrarSeccion === "reservas" && <Reservas />}
          {mostrarSeccion === "calificaciones" && <Calificaciones />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
