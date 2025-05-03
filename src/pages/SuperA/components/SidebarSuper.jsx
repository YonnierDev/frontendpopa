import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUsers, FaCalendarAlt, FaMapMarkerAlt, FaComment, FaStar, FaClipboardList, 
         FaBell, FaBars, FaSignOutAlt, FaHome, FaTags, FaUserShield, FaUser, FaChevronDown } from 'react-icons/fa';
import axios from 'axios';
import '../styles/SuperAdminLayout.css';

// Importa todos los componentes
import CalificacionesSuper from '../CalificacionesSuper';
import EventosSuper from '../EventosSuper';
import ReservasSuper from '../ReservasSuper';
import CategoriasSuper from '../CategoriasSuper';
import UsuariosSuper from '../UsuariosSuper';
import LugaresSuper from '../LugaresSuper';
import ComentariosSuper from '../ComentariosSuper';
import PendientesSuper from '../PendientesSuper';
import RolesSuper from '../RolesSuper';
import SuperAdminStats from './SuperAdminStats';

const SidebarSuper = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [mostrarSeccion, setMostrarSeccion] = useState("bienvenida");
  const [nombreAdmin, setNombreAdmin] = useState("");
  const [apellidoAdmin, setApellidoAdmin] = useState("");
  const [rolAdmin, setRolAdmin] = useState("");
  const [cantidadSolicitudes, setCantidadSolicitudes] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Obtener el nombre del SuperAdministrador
    const fetchAdminInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('https://popnocturna.vercel.app/api/usuario/1', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setNombreAdmin(response.data.nombre || "");
        setApellidoAdmin(response.data.apellido || "");
        
      } catch (error) {
        console.error("Error al obtener información del SuperAdministrador:", error);
        setNombreAdmin("");
        setApellidoAdmin("");
        
      }
    };

    fetchAdminInfo();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  const menuItems = [
    { icon: <FaHome />, label: 'Dashboard', seccion: 'bienvenida', className: 'dashboard-btn' },
    { icon: <FaUsers />, label: 'Usuarios', seccion: 'usuarios' },
    { icon: <FaUserShield />, label: 'Roles', seccion: 'roles' },
    { icon: <FaCalendarAlt />, label: 'Eventos', seccion: 'eventos' },
    { icon: <FaMapMarkerAlt />, label: 'Lugares', seccion: 'lugares' },
    { icon: <FaComment />, label: 'Comentarios', seccion: 'comentarios' },
    { icon: <FaStar />, label: 'Calificaciones', seccion: 'calificaciones' },
    { icon: <FaClipboardList />, label: 'Reservas', seccion: 'reservas' },
    { icon: <FaTags />, label: 'Categorías', seccion: 'categorias' },
    { icon: <FaBell />, label: `Solicitudes (${cantidadSolicitudes})`, seccion: 'solicitudes' }
  ];

  return (
    <div className="superadmin-layout">
      <div className={`superadmin-header ${isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
        <div className="superadmin-header-left">
          <button 
            className="superadmin-collapse-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <FaBars />
          </button>
          <div className="superadmin-header-title">Panel de Administración</div>
        </div>
        <div className="superadmin-user-menu">
          <button 
            className="superadmin-user-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <FaUser />
          </button>
          {showUserMenu && (
            <div className="superadmin-user-dropdown">
              <div className="superadmin-user-info">
                <div className="superadmin-user-name">{`${nombreAdmin} ${apellidoAdmin}`}</div>
                <div className="superadmin-user-role">{rolAdmin}</div>
              </div>
              <button className="superadmin-logout-btn" onClick={handleLogout}>
                <FaSignOutAlt />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="superadmin-dashboard">
        <div className="superadmin-dashboard-container">
          <div className={`superadmin-dashboard-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            {menuItems.map((item, index) => (
              <button
                key={index}
                className={`superadmin-menu-btn ${mostrarSeccion === item.seccion ? 'activo' : ''} ${item.className || ''}`}
                onClick={() => setMostrarSeccion(item.seccion)}
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {item.icon}
                {!isCollapsed && <span>{item.label}</span>}
                {isCollapsed && hoveredItem === index && (
                  <div className="tooltip">{item.label}</div>
                )}
              </button>
            ))}
          </div>

          <div className="superadmin-dashboard-content">
            <div className="superadmin-main-wrapper">
              {mostrarSeccion === "bienvenida" && (
                <div className="superadmin-bienvenida-message">
                  <h2>Panel de Control</h2>
                  <p>Bienvenido, {`${nombreAdmin} ${apellidoAdmin}`}</p>
                  <p className="superadmin-bienvenida-subtitle">{rolAdmin}</p>
                  <SuperAdminStats />
                </div>
              )}
              {mostrarSeccion === "categorias" && <CategoriasSuper />}
              {mostrarSeccion === "usuarios" && <UsuariosSuper />}
              {mostrarSeccion === "roles" && <RolesSuper />}
              {mostrarSeccion === "lugares" && <LugaresSuper />}
              {mostrarSeccion === "comentarios" && <ComentariosSuper />}
              {mostrarSeccion === "eventos" && <EventosSuper />}
              {mostrarSeccion === "reservas" && <ReservasSuper />}
              {mostrarSeccion === "calificaciones" && <CalificacionesSuper />}
              {mostrarSeccion === "solicitudes" && <PendientesSuper />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarSuper; 