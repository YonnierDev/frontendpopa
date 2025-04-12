import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Roles from "./roles/RolesListPage";
import Usuarios from "./usuarios/UsuariosListPage";
import Categorias from "./categorias/CategoriasListPage";
import Lugares from "./lugares/LugarListPage";
import Eventos from "./eventos/EventosListPage";
import Reservas from "./reservas/ReservasListPage";
// import Calificaciones from "./calificaciones/";
// import Comentarios from "./comentarios/";

import logo from "../../assets/logos.png";
import "./DashboardSuperAdmin.css";

const DashboardSuperAdmin = () => {
  const [mostrarSeccion, setMostrarSeccion] = useState("bienvenida");
  const [correoAdmin, setCorreoAdmin] = useState("SuperAdmin");//Esto hay que cambiarlo
  const navigate = useNavigate();

  const handleMostrarSeccion = (seccion) => {
    setMostrarSeccion(seccion);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  return (
    <div>
      {/* Barra Superior */}
      <nav className="superadmin-navbar">
        <img src={logo} alt="Photobella Logo" className="superadmin-logo" />
        <span className="superadmin-email">{correoAdmin}</span>
      </nav>

      <div className="superadmin-dashboard">
        {/* Sidebar */}
        <aside className="superadmin-sidebar">
          <button onClick={() => handleMostrarSeccion("roles")} className="superadmin-menu-btn">Roles</button>
          <button onClick={() => handleMostrarSeccion("usuarios")} className="superadmin-menu-btn">Usuarios</button>
          <button onClick={() => handleMostrarSeccion("categorias")} className="superadmin-menu-btn">Categorías</button>
          <button onClick={() => handleMostrarSeccion("lugares")} className="superadmin-menu-btn">Lugares</button>
          <button onClick={() => handleMostrarSeccion("reservas")} className="superadmin-menu-btn">Reservas</button>
          <button onClick={() => handleMostrarSeccion("eventos")} className="superadmin-menu-btn">Eventos</button>
          {/* <button onClick={() => handleMostrarSeccion("eventos")} className="superadmin-menu-btn">Eventos</button>
          // // <button onClick={() => handleMostrarSeccion("reservas")} className="superadmin-menu-btn">Reservas</button>
          <button onClick={() => handleMostrarSeccion("calificaciones")} className="superadmin-menu-btn">Calificaciones</button>
          <button onClick={() => handleMostrarSeccion("comentarios")} className="superadmin-menu-btn">Comentarios</button> */}

          <div className="superadmin-logout">
            <button className="superadmin-logout-btn" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        </aside>

        {/* Contenido Dinámico */}
        <main className="superadmin-content">
          {mostrarSeccion === "bienvenida" && (
            <div className="superadmin-welcome-box">
              <h2>Bienvenido SuperAdministrador</h2>
              <p>Utiliza el menú lateral para gestionar el sistema.</p>
            </div>
          )}
          {mostrarSeccion === "roles" && <Roles />}
          {mostrarSeccion === "usuarios" && <Usuarios />}
          {mostrarSeccion === "categorias" && <Categorias />}
          {mostrarSeccion === "lugares" && <Lugares />}
          {mostrarSeccion === "reservas" && <Reservas />}
          {mostrarSeccion === "eventos" && <Eventos />}

        </main>
      </div>
    </div>
  );
};

export default DashboardSuperAdmin;
