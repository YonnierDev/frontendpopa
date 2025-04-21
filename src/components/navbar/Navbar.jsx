import "./navbar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { Link, useLocation } from "react-router-dom";
import { FaUsers, FaUser, FaLock, FaKey, FaLayerGroup, FaCity, FaCalendar, FaCreditCard, FaLaptopHouse } from "react-icons/fa";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar-custom d-flex flex-column align-items-center p-3">
      <ul className="nav-links w-100">
      <li className="nav-item" title="panel">
          <Link to="/panel-de-control" className={`nav-link d-flex align-items-center gap-2 ${location.pathname === "/panel-de-control" ? "active" : ""}`}>
            <FaLaptopHouse /> <span>Panel de Control</span>
          </Link>
        </li>  
        {/* Cuenta */}
        <li className="nav-section-title">Cuenta</li>
        <li className="nav-item" title="Mi Cuenta">
          <Link to="/perfil" className={`nav-link d-flex align-items-center gap-2 ${location.pathname === "/perfil" ? "active" : ""}`}>
            <FaUser /> <span>Perfil</span>
          </Link>
        </li>
        <li className="nav-item" title="Cambio de Contraseña">
          <Link to="/cambiar-contraseña" className={`nav-link d-flex align-items-center gap-2 ${location.pathname === "/cambiar-contraseña" ? "active" : ""}`}>
            <FaLock /> <span>Cambiar contraseña</span>
          </Link>
        </li>

        {/* Gestión de Usuarios */}
        <li className="nav-section-title">Gestión de Usuarios</li>
        <li className="nav-item" title="Usuarios">
          <Link to="/usuarios" className={`nav-link d-flex align-items-center gap-2 ${location.pathname === "/usuarios" ? "active" : ""}`}>
            <FaUsers /> <span>Usuarios</span>
          </Link>
        </li>
        <li className="nav-item" title="Roles">
          <Link to="/roles" className={`nav-link d-flex align-items-center gap-2 ${location.pathname === "/roles" ? "active" : ""}`}>
            <FaKey /> <span>Roles</span>
          </Link>
        </li>

        {/* Sitios Turísticos */}
        <li className="nav-section-title">Sitios Turísticos</li>
        <li className="nav-item" title="Categorias">
          <Link to="/categorias" className={`nav-link d-flex align-items-center gap-2 ${location.pathname === "/categorias" ? "active" : ""}`}>
            <FaLayerGroup /> <span>Categorías</span>
          </Link>
        </li>
        <li className="nav-item" title="Lugares">
          <Link to="/lugares" className={`nav-link d-flex align-items-center gap-2 ${location.pathname === "/lugares" ? "active" : ""}`}>
            <FaCity /> <span>Lugares</span>
          </Link>
        </li>
        <li className="nav-item" title="Eventos">
          <Link to="/eventos" className={`nav-link d-flex align-items-center gap-2 ${location.pathname === "/eventos" ? "active" : ""}`}>
            <FaCalendar /> <span>Eventos</span>
          </Link>
        </li>
        <li className="nav-item" title="Reservas">
          <Link to="/reservas" className={`nav-link d-flex align-items-center gap-2 ${location.pathname === "/reservas" ? "active" : ""}`}>
            <FaCreditCard /> <span>Reservas</span>
          </Link>
        </li>

        {/* Sitios Turísticos
        <li className="nav-section-title">Solicitudes</li>
        <li className="nav-item" title="Lugares">
          <Link to="/solicitud-de-lugares" className={`nav-link d-flex align-items-center gap-2 ${location.pathname === "/categorias" ? "active" : ""}`}>
            <FaLayerGroup /> <span>Solicitudes de lugares</span>
          </Link>
        </li>
        <li className="nav-item" title="Lugares">
          <Link to="/soliciut-de-comentarios" className={`nav-link d-flex align-items-center gap-2 ${location.pathname === "/lugares" ? "active" : ""}`}>
            <FaCity /> <span>Solicitudes de comentarios</span>
          </Link>
        </li> */}

        {/* Si querés activar lo demás más adelante, descomentá: */}
        {/*
        <li className="nav-item" title="Eventos">
          <Link to="/eventos" className={`nav-link d-flex align-items-center gap-2 ${location.pathname === "/eventos" ? "active" : ""}`}>
            <FaMapMarkerAlt /> <span>Eventos</span>
          </Link>
        </li>
        <li className="nav-item" title="Reservas">
          <Link to="/reservas" className={`nav-link d-flex align-items-center gap-2 ${location.pathname === "/reservas" ? "active" : ""}`}>
            <FaMapMarkerAlt /> <span>Reservas</span>
          </Link>
        </li>
        <li className="nav-item" title="Calificaciones">
          <Link to="/calificaciones" className={`nav-link d-flex align-items-center gap-2 ${location.pathname === "/calificaciones" ? "active" : ""}`}>
            <FaCalendarAlt /> <span>Calificaciones</span>
          </Link>
        </li>
        <li className="nav-item" title="Comentarios">
          <Link to="/comentarios" className={`nav-link d-flex align-items-center gap-2 ${location.pathname === "/comentarios" ? "active" : ""}`}>
            <FaMapMarkerAlt /> <span>Comentarios</span>
          </Link>
        </li>
        */}
      </ul>
    </nav>
  );
};

export default Navbar;
