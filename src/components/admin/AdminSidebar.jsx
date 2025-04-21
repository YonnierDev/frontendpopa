import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { 
  FaHome, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaTags, 
  FaUsers, 
  FaChartBar 
} from 'react-icons/fa';

const AdminSidebar = () => {
  const menuItems = [
    { path: '/admin', icon: <FaHome />, label: 'Dashboard' },
    { path: '/admin/lugares', icon: <FaMapMarkerAlt />, label: 'Lugares' },
    { path: '/admin/eventos', icon: <FaCalendarAlt />, label: 'Eventos' },
    { path: '/admin/categorias', icon: <FaTags />, label: 'Categorías' },
    { path: '/admin/usuarios', icon: <FaUsers />, label: 'Usuarios' },
    { path: '/admin/reportes', icon: <FaChartBar />, label: 'Reportes' }
  ];

  return (
    <Nav className="flex-column">
      {menuItems.map((item) => (
        <Nav.Item key={item.path}>
          <NavLink
            to={item.path}
            className={({ isActive }) => 
              `admin-nav-link d-flex align-items-center ${isActive ? 'active' : ''}`
            }
          >
            <span className="me-2">{item.icon}</span>
            {item.label}
          </NavLink>
        </Nav.Item>
      ))}
    </Nav>
  );
};

export default AdminSidebar;
