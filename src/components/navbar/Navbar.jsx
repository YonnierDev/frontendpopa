import "./navbar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
<<<<<<< HEAD
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
=======
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUsers, FaCalendarAlt, FaMapMarkerAlt, FaUser, FaSignOutAlt } from "react-icons/fa";

const Navbar = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <nav className="navbar-custom d-flex flex-column align-items-center p-3">
      <ul className="nav-links w-100">
>>>>>>> ccc46c449c7b88d96706a7a04dd4d76f73543425
        {/* Cuenta */}
        <li className="nav-section-title">Cuenta</li>
        <li className="nav-item" title="Mi Cuenta">
          <Link to="/perfil" className={`nav-link d-flex align-items-center gap-2 ${location.pathname === "/perfil" ? "active" : ""}`}>
<<<<<<< HEAD
            <FaUser /> <span>Perfil</span>
          </Link>
        </li>
        <li className="nav-item" title="Cambio de Contraseña">
          <Link to="/cambiar-contraseña" className={`nav-link d-flex align-items-center gap-2 ${location.pathname === "/cambiar-contraseña" ? "active" : ""}`}>
            <FaLock /> <span>Cambiar contraseña</span>
=======
            <FaUser /> <span>Mi Cuenta</span>
>>>>>>> ccc46c449c7b88d96706a7a04dd4d76f73543425
          </Link>
        </li>

        {/* Gestión de Usuarios */}
        <li className="nav-section-title">Gestión de Usuarios</li>
        <li className="nav-item" title="Usuarios">
          <Link to="/usuarios" className={`nav-link d-flex align-items-center gap-2 ${location.pathname === "/usuarios" ? "active" : ""}`}>
            <FaUsers /> <span>Usuarios</span>
          </Link>
        </li>
<<<<<<< HEAD
        <li className="nav-item" title="Roles">
          <Link to="/roles" className={`nav-link d-flex align-items-center gap-2 ${location.pathname === "/roles" ? "active" : ""}`}>
            <FaKey /> <span>Roles</span>
=======

        {/* Gestión de Roles */}
        <li className="nav-item" title="Roles">
          <Link to="/roles" className={`nav-link d-flex align-items-center gap-2 ${location.pathname === "/roles" ? "active" : ""}`}>
            <FaUsers /> <span>Roles</span>
>>>>>>> ccc46c449c7b88d96706a7a04dd4d76f73543425
          </Link>
        </li>

        {/* Sitios Turísticos */}
        <li className="nav-section-title">Sitios Turísticos</li>
        <li className="nav-item" title="Categorias">
          <Link to="/categorias" className={`nav-link d-flex align-items-center gap-2 ${location.pathname === "/categorias" ? "active" : ""}`}>
<<<<<<< HEAD
            <FaLayerGroup /> <span>Categorías</span>
=======
            <FaCalendarAlt /> <span>Categorias</span>
>>>>>>> ccc46c449c7b88d96706a7a04dd4d76f73543425
          </Link>
        </li>
        <li className="nav-item" title="Lugares">
          <Link to="/lugares" className={`nav-link d-flex align-items-center gap-2 ${location.pathname === "/lugares" ? "active" : ""}`}>
<<<<<<< HEAD
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
=======
            <FaMapMarkerAlt /> <span>Lugares</span>
          </Link>
        </li>
        {/* <li className="nav-item" title="Eventos">
>>>>>>> ccc46c449c7b88d96706a7a04dd4d76f73543425
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
<<<<<<< HEAD
        </li>
        */}
=======
        </li> */}

        {/* Cerrar Sesión */}
        <li className="nav-item logout-btn mt-1" title="Cerrar Sesión">
          <button className="btn btn w-100 d-flex align-items-center gap-2" onClick={handleLogout}>
            <FaSignOutAlt /> <span>Cerrar Sesión</span>
          </button>
        </li>
>>>>>>> ccc46c449c7b88d96706a7a04dd4d76f73543425
      </ul>
    </nav>
  );
};

export default Navbar;
