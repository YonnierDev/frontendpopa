import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUsers, FaUser, FaLock, FaKey, FaLayerGroup, FaCity, FaCalendar, FaCreditCard, FaLaptopHouse, FaStar, FaComment, FaEnvelope } from "react-icons/fa";
import "./navbar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const Navbar = ({ setIsAuthenticated }) => {
  const location = useLocation();
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const rolId = usuario?.rolid;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setIsAuthenticated(false);
  };

  const getMenuItems = () => {
    switch (Number(rolId)) {
      case 1: // SuperAdmin
        return [
          { to: "/superadmin", text: "Panel de Control", icon: FaLaptopHouse },
          { to: "/superadmin/usuarios", text: "Usuarios", icon: FaUsers },
          { to: "/superadmin/roles", text: "Roles", icon: FaKey },
          { to: "/superadmin/categorias", text: "Categorías", icon: FaLayerGroup },
          { to: "/superadmin/lugares", text: "Lugares", icon: FaCity },
          { to: "/superadmin/reservas", text: "Reservas", icon: FaCreditCard },
          { to: "/superadmin/perfil", text: "Perfil", icon: FaUser }
        ];
      case 2: // Adminp
        return [
          { to: "/adminp", text: "Panel de Control", icon: FaLaptopHouse },
          { to: "/adminp/categorias", text: "Categorías", icon: FaLayerGroup },
          { to: "/adminp/lugares", text: "Lugares", icon: FaCity },
          { to: "/adminp/reservas", text: "Reservas", icon: FaCreditCard },
          { to: "/adminp/usuarios", text: "Usuarios", icon: FaUsers },
          { to: "/adminp/eventos", text: "Eventos", icon: FaCalendar },
          { to: "/adminp/calificaciones", text: "Calificaciones", icon: FaStar },
          { to: "/adminp/comentarios", text: "Comentarios", icon: FaComment },
          { to: "/adminp/solicitudes", text: "Solicitudes", icon: FaEnvelope }
        ];
      case 3: // Propietario
        return [
          { to: "/propietario", text: "Panel de Control", icon: FaLaptopHouse },
          { to: "/propietario/lugares", text: "Mis Lugares", icon: FaCity },
          { to: "/propietario/reservas", text: "Mis Reservas", icon: FaCreditCard },
          { to: "/propietario/perfil", text: "Mi Perfil", icon: FaUser }
        ];
      case 8: // Usuario normal
        return [
          { to: "/panel-de-control", text: "Panel de Control", icon: FaLaptopHouse },
          { to: "/mis-reservas", text: "Mis Reservas", icon: FaCreditCard },
          { to: "/mi-perfil", text: "Mi Perfil", icon: FaUser }
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <nav className="navbar-custom d-flex flex-column align-items-center p-3">
      <ul className="nav flex-column w-100">
        {menuItems.map((item) => (
          <li className="nav-item" key={item.to}>
            <Link
              to={item.to}
              className={`nav-link d-flex align-items-center gap-2 ${location.pathname === item.to ? "active" : ""}`}
            >
              <item.icon /> <span>{item.text}</span>
            </Link>
          </li>
        ))}
        <li className="nav-item mt-3">
          <Link to="/" className="nav-link text-danger d-flex align-items-center gap-2" onClick={handleLogout}>
            <FaLock /> <span>Cerrar Sesión</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
