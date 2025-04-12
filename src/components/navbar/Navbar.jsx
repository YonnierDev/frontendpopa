import "./navbar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
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
        {/* Cuenta */}
        <li className="nav-section-title">Cuenta</li>
        <li className="nav-item" title="Mi Cuenta">
          <Link to="/perfil" className={`nav-link d-flex align-items-center gap-2 ${location.pathname === "/perfil" ? "active" : ""}`}>
            <FaUser /> <span>Mi Cuenta</span>
          </Link>
        </li>

        {/* Gestión de Usuarios */}
        <li className="nav-section-title">Gestión de Usuarios</li>
        <li className="nav-item" title="Usuarios">
          <Link to="/usuarios" className={`nav-link d-flex align-items-center gap-2 ${location.pathname === "/usuarios" ? "active" : ""}`}>
            <FaUsers /> <span>Usuarios</span>
          </Link>
        </li>

        {/* Gestión de Roles */}
        <li className="nav-item" title="Roles">
          <Link to="/roles" className={`nav-link d-flex align-items-center gap-2 ${location.pathname === "/roles" ? "active" : ""}`}>
            <FaUsers /> <span>Roles</span>
          </Link>
        </li>

        {/* Sitios Turísticos */}
        <li className="nav-section-title">Sitios Turísticos</li>
        <li className="nav-item" title="Categorias">
          <Link to="/categorias" className={`nav-link d-flex align-items-center gap-2 ${location.pathname === "/categorias" ? "active" : ""}`}>
            <FaCalendarAlt /> <span>Categorias</span>
          </Link>
        </li>
        <li className="nav-item" title="Lugares">
          <Link to="/lugares" className={`nav-link d-flex align-items-center gap-2 ${location.pathname === "/lugares" ? "active" : ""}`}>
            <FaMapMarkerAlt /> <span>Lugares</span>
          </Link>
        </li>
        {/* <li className="nav-item" title="Eventos">
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
        </li> */}

        {/* Cerrar Sesión */}
        <li className="nav-item logout-btn mt-1" title="Cerrar Sesión">
          <button className="btn btn w-100 d-flex align-items-center gap-2" onClick={handleLogout}>
            <FaSignOutAlt /> <span>Cerrar Sesión</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
