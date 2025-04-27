import { useState, useEffect } from "react";
<<<<<<< HEAD
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUsers, FaLayerGroup, FaCity, FaCalendar, FaStar, FaComments, FaClipboardList, FaSignOutAlt } from 'react-icons/fa';
=======
import { Link } from "react-router-dom";
import axios from "axios";
>>>>>>> 4c6738033daad045332ce1cc617753bbd4797571

// Importa todos los componentes
import Calificaciones from "./Calificaciones";
import Eventos from "./Eventos";
import Reservas from "./Reservas";
import Categorias from "./Categorias";
import Usuarios from "./Usuarios";
import Lugares from "./Lugares";
import Comentarios from "./Comentarios";
import Solicitudes from "./Solicitudes";
import "../admip/styles/Dashboard.css";

const Dashboard = () => {
<<<<<<< HEAD
  const navigate = useNavigate();
=======
>>>>>>> 4c6738033daad045332ce1cc617753bbd4797571
  const [mostrarSeccion, setMostrarSeccion] = useState("bienvenida");
  const [nombreAdmin, setNombreAdmin] = useState("");
  const [cantidadSolicitudes, setCantidadSolicitudes] = useState(0);

  useEffect(() => {
    setMostrarSeccion("bienvenida");

    const fetchAdminNombre = async () => {
      try {
        const response = await axios.get("https://popnocturna.vercel.app/api/usuario/2");
        setNombreAdmin(response.data.nombre || "Administrador");
      } catch (error) {
        console.error("Error al obtener el administrador:", error);
        setNombreAdmin("Administrador");
      }
    };

    const fetchCantidadSolicitudes = async () => {
      try {
        const res = await axios.get("https://popnocturna.vercel.app/api/propietario/aprobar");
        const pendientes = res.data.filter(s => s.estado === "pendiente").length;
        setCantidadSolicitudes(pendientes);
      } catch (err) {
        console.error("Error al contar solicitudes:", err);
        setCantidadSolicitudes(0);
      }
    };

    fetchAdminNombre();
    fetchCantidadSolicitudes();
  }, []);

  const handleMostrarSeccion = (seccion) => {
    setMostrarSeccion(seccion);
  };

<<<<<<< HEAD
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  return (
    <div className="adminp-root">
      <div className="adminp-container">
        <nav className="adminp-navbar">
          <div className="adminp-brand">Panel de Administración</div>
          <button onClick={handleLogout} className="adminp-btn adminp-btn-logout">
            <FaSignOutAlt /> Cerrar Sesión
          </button>
        </nav>

        <div className="adminp-layout">
          <aside className="adminp-sidebar">
            <button
              className={`adminp-menu-item ${mostrarSeccion === "categorias" ? "activo" : ""}`}
              onClick={() => handleMostrarSeccion("categorias")}
            >
              <FaLayerGroup /> Categorías
            </button>
            <button
              className={`adminp-menu-item ${mostrarSeccion === "usuarios" ? "activo" : ""}`}
              onClick={() => handleMostrarSeccion("usuarios")}
            >
              <FaUsers /> Usuarios
            </button>
            <button
              className={`adminp-menu-item ${mostrarSeccion === "lugares" ? "activo" : ""}`}
              onClick={() => handleMostrarSeccion("lugares")}
            >
              <FaCity /> Lugares
            </button>
            <button
              className={`adminp-menu-item ${mostrarSeccion === "comentarios" ? "activo" : ""}`}
              onClick={() => handleMostrarSeccion("comentarios")}
            >
              <FaComments /> Comentarios
            </button>
            <button
              className={`adminp-menu-item ${mostrarSeccion === "eventos" ? "activo" : ""}`}
              onClick={() => handleMostrarSeccion("eventos")}
            >
              <FaCalendar /> Eventos
            </button>
            <button
              className={`adminp-menu-item ${mostrarSeccion === "reservas" ? "activo" : ""}`}
              onClick={() => handleMostrarSeccion("reservas")}
            >
              <FaCalendar /> Reservas
            </button>
            <button
              className={`adminp-menu-item ${mostrarSeccion === "calificaciones" ? "activo" : ""}`}
              onClick={() => handleMostrarSeccion("calificaciones")}
            >
              <FaStar /> Calificaciones
            </button>
            <button
              className={`adminp-menu-item ${mostrarSeccion === "solicitudes" ? "activo" : ""}`}
              onClick={() => handleMostrarSeccion("solicitudes")}
            >
              <FaClipboardList /> Solicitudes ({cantidadSolicitudes})
            </button>
          </aside>

          <main className="adminp-main">
            {mostrarSeccion === "bienvenida" && (
              <div className="adminp-welcome">
                <h1>Bienvenido {nombreAdmin}</h1>
              </div>
            )}
            {mostrarSeccion === "categorias" && <Categorias />}
            {mostrarSeccion === "usuarios" && <Usuarios />}
            {mostrarSeccion === "lugares" && <Lugares />}
            {mostrarSeccion === "comentarios" && <Comentarios />}
            {mostrarSeccion === "eventos" && <Eventos />}
            {mostrarSeccion === "reservas" && <Reservas />}
            {mostrarSeccion === "calificaciones" && <Calificaciones />}
            {mostrarSeccion === "solicitudes" && <Solicitudes />}
          </main>
=======
  return (
    <div>
      <div className="dashboard-container">
        <div className="sidebar">
          <button
            className={`menu-btn ${mostrarSeccion === "categorias" ? "activo" : ""}`}
            onClick={() => handleMostrarSeccion("categorias")}
          >
            Categorías
          </button>
          <button
            className={`menu-btn ${mostrarSeccion === "usuarios" ? "activo" : ""}`}
            onClick={() => handleMostrarSeccion("usuarios")}
          >
            Usuarios
          </button>
          <button
            className={`menu-btn ${mostrarSeccion === "lugares" ? "activo" : ""}`}
            onClick={() => handleMostrarSeccion("lugares")}
          >
            Lugares
          </button>
          <button
            className={`menu-btn ${mostrarSeccion === "comentarios" ? "activo" : ""}`}
            onClick={() => handleMostrarSeccion("comentarios")}
          >
            Comentarios
          </button>
          <button
            className={`menu-btn ${mostrarSeccion === "eventos" ? "activo" : ""}`}
            onClick={() => handleMostrarSeccion("eventos")}
          >
            Eventos
          </button>
          <button
            className={`menu-btn ${mostrarSeccion === "reservas" ? "activo" : ""}`}
            onClick={() => handleMostrarSeccion("reservas")}
          >
            Reservas
          </button>
          <button
            className={`menu-btn ${mostrarSeccion === "calificaciones" ? "activo" : ""}`}
            onClick={() => handleMostrarSeccion("calificaciones")}
          >
            Calificaciones
          </button>
          <button
            className={`menu-btn ${mostrarSeccion === "solicitudes" ? "activo" : ""}`}
            onClick={() => handleMostrarSeccion("solicitudes")}
          >
            Solicitudes ({cantidadSolicitudes})
          </button>

          <div className="logout-container">
            <Link to="/logout" className="logout-btn">Cerrar Sesión</Link>
          </div>
        </div>

        <div className="content">
          {mostrarSeccion === "bienvenida" && (
            <div className="bienvenida-message">
              <h2>Bienvenido {nombreAdmin}</h2>
            </div>
          )}
          {mostrarSeccion === "categorias" && <Categorias />}
          {mostrarSeccion === "usuarios" && <Usuarios />}
          {mostrarSeccion === "lugares" && <Lugares />}
          {mostrarSeccion === "comentarios" && <Comentarios />}
          {mostrarSeccion === "eventos" && <Eventos />}
          {mostrarSeccion === "reservas" && <Reservas />}
          {mostrarSeccion === "calificaciones" && <Calificaciones />}
          {mostrarSeccion === "solicitudes" && <Solicitudes />}
>>>>>>> 4c6738033daad045332ce1cc617753bbd4797571
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
