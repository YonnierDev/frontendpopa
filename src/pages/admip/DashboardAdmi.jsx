import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// Importa todos los componentes
import Calificaciones from "./Calificaciones";
import Eventos from "./Eventos";
import Reservas from "./Reservas";
import Categorias from "./Categorias";
import Usuarios from "./Usuarios";
import Lugares from "./Lugares";
import Comentarios from "./Comentarios";
import logo from "../../assets/logos.png";
import "../admip/styles/Dashboard.css";

const Dashboard = () => {
  const [mostrarSeccion, setMostrarSeccion] = useState("bienvenida");
  const [correoAdmin, setCorreoAdmin] = useState("");

  useEffect(() => {
    setMostrarSeccion("bienvenida");

    const fetchCategoria = async () => {
      try {
        const response = await axios.get("https://backend-1ky982i25-yonnierdevs-projects.vercel.app/api/categorias");
        setCorreoAdmin(response.data.correo || "Admin no encontrado");
      } catch (error) {
        console.error("Error al obtener el administrador:", error);
        setCorreoAdmin("Admin no encontrado");
      }
    };

    fetchCategoria();
  }, []);

  const handleMostrarSeccion = (seccion) => {
    setMostrarSeccion(seccion);
  };

  return (
    <div>
      {/* Barra de Navegación Superior */}
      <nav className="navbar">
        <img src={logo} alt="Photobella Logo" className="logo-img" />
        <span className="admin-email">{correoAdmin}</span>
      </nav>

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
            <Link to="/logout" className="logout-btn">Cerrar Sesión</Link>
          </div>
        </div>

        {/* Contenido Dinámico */}
        <div className="content">
          {mostrarSeccion === "bienvenida" && (
            <div className="bienvenida-message">
              <h2>Bienvenido Administrador</h2>
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
