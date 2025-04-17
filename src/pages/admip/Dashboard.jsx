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
import "../admip/styles/Dashboard.css";

const Dashboard = () => {
  const [mostrarSeccion, setMostrarSeccion] = useState("bienvenida");
  const [nombreAdmin, setNombreAdmin] = useState("");  // Estado para almacenar el nombre del administrador

  useEffect(() => {
    setMostrarSeccion("bienvenida");

    const fetchAdminNombre = async () => {
      try {
        // Aquí puedes poner el endpoint correcto que te devuelva el nombre del usuario logueado
        const response = await axios.get("https://popnocturna.vercel.app/api/usuario/me"); 
        setNombreAdmin(response.data.nombre || "Administrador no encontrado");  // Asumiendo que la respuesta tiene un campo 'nombre'
      } catch (error) {
        console.error("Error al obtener el administrador:", error);
        setNombreAdmin("Administrador no encontrado");
      }
    };

    fetchAdminNombre();
  }, []);

  const handleMostrarSeccion = (seccion) => {
    setMostrarSeccion(seccion);
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
            <Link to="/logout" className="logout-btn">Cerrar Sesión</Link>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="content">
          {mostrarSeccion === "bienvenida" && (
            <div className="bienvenida-message">
              <h2>Bienvenido {nombreAdmin}</h2>  {/* Mostrar nombre aquí también */}
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
