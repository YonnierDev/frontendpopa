import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation, Routes, Route } from "react-router-dom";
import { FaUsers, FaCalendarAlt, FaMapMarkerAlt, FaUser, FaSignOutAlt } from "react-icons/fa";

import RolesListPage from "./roles/RolesListPage";
import UsuariosListPage from "./usuarios/UsuariosListPage";
import logo from "../../assets/logos.png";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./DashboardSuperadmin.css";

const DashboardSuperadmin = () => {
  const [correoAdmin, setCorreoAdmin] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCorreoAdmin(user?.correo || "Superadmin");
    } else {
      setCorreoAdmin("Superadmin");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <nav className="navbar-custom d-flex flex-column align-items-center p-3">
        <ul className="nav-links w-100">
          <li className="nav-section-title">Cuenta</li>
          <li className="nav-item">
            <Link
              to="perfil"
              className={`nav-link d-flex align-items-center gap-2 ${location.pathname === "/superadmin/perfil" ? "active" : ""}`}
            >
              <FaUser /> <span>Mi Cuenta</span>
            </Link>
          </li>

          <li className="nav-section-title">Gestión de Usuarios</li>
          <li className="nav-item">
            <Link
              to="/superadmin/usuarios"
              className={`nav-link d-flex align-items-center gap-2 ${location.pathname === "/superadmin/usuarios" ? "active" : ""}`}
            >
              <FaUsers /> <span>Usuarios</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/superadmin/roles"
              className={`nav-link d-flex align-items-center gap-2 ${location.pathname === "/superadmin/roles" ? "active" : ""}`}
            >
              <FaUsers /> <span>Roles</span>
            </Link>
          </li>

          <li className="nav-section-title">Sitios Turísticos</li>
          <li className="nav-item">
            <Link to="categorias" className={`nav-link d-flex align-items-center gap-2 ${location.pathname === "/superadmin/categorias" ? "active" : ""}`}>
              <FaCalendarAlt /> <span>Categorías</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="lugares" className={`nav-link d-flex align-items-center gap-2 ${location.pathname === "/superadmin/lugares" ? "active" : ""}`}>
              <FaMapMarkerAlt /> <span>Lugares</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="eventos" className={`nav-link d-flex align-items-center gap-2 ${location.pathname === "/superadmin/eventos" ? "active" : ""}`}>
              <FaMapMarkerAlt /> <span>Eventos</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="reservas" className={`nav-link d-flex align-items-center gap-2 ${location.pathname === "/superadmin/reservas" ? "active" : ""}`}>
              <FaMapMarkerAlt /> <span>Reservas</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="calificaciones" className={`nav-link d-flex align-items-center gap-2 ${location.pathname === "/superadmin/calificaciones" ? "active" : ""}`}>
              <FaCalendarAlt /> <span>Calificaciones</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="comentarios" className={`nav-link d-flex align-items-center gap-2 ${location.pathname === "/superadmin/comentarios" ? "active" : ""}`}>
              <FaMapMarkerAlt /> <span>Comentarios</span>
            </Link>
          </li>

          <li className="nav-item logout-btn mt-1">
            <button className="btn btn w-100 d-flex align-items-center gap-2" onClick={handleLogout}>
              <FaSignOutAlt /> <span>Cerrar Sesión</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Contenido principal */}
      <div className="flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <img src={logo} alt="Photobella Logo" className="logo-img" />
          <span className="admin-email">{correoAdmin}</span>
        </div>

        {/* Subrutas internas */}
        <Routes>
          <Route index element={
            <div className="bienvenida-message">
              <h2>Bienvenido Superadministrador</h2>
              <p>Desde aquí puedes gestionar los roles del sistema.</p>
            </div>
          } />
          <Route path="roles" element={<RolesListPage />} />
          <Route path="usuarios" element={<UsuariosListPage />} />
          {/* Aquí puedes seguir agregando subrutas como: 
              <Route path="usuarios" element={<UsuariosListPage />} /> */}
        </Routes>
      </div>
    </div>
  );
};

export default DashboardSuperadmin;
