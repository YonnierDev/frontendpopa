import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Row, Col, Card } from 'react-bootstrap';
import { 
  FaUsers, 
  FaKey, 
  FaLayerGroup, 
  FaCity, 
  FaCalendar, 
  FaCreditCard,
  FaChartLine,
  FaStar,
  FaSignOutAlt 
} from "react-icons/fa";

// Importar componentes
import RolesListPage from "../roles/RolesListPage";
import UsuariosListPage from "../usuarios/UsuariosListPage";
import CategoriasListPage from "../categorias/CategoriasListPage";
import LugaresListPage from "../lugares/LugarListPage";
import ReservaListPage from "../reservas/ReservaListPage";
import PerfilListPage from "../perfil/PerfilListPage";

const SuperAdminPanel = () => {
  const [stats, setStats] = useState({
    usuarios: 0,
    lugares: 0,
    eventos: 0,
    reservas: 0
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "/login";
  };

  const SuperAdminDashboard = () => (
    <div className="superadmin-container">
      <div className="superadmin-header">
        <h1 className="superadmin-title">Panel del Super Administrador</h1>
        <button onClick={handleLogout} className="superadmin-btn superadmin-btn-logout">
          <FaSignOutAlt /> Cerrar Sesión
        </button>
      </div>
      
      <Row className="superadmin-stats">
        <Col md={3}>
          <Card className="superadmin-card">
            <Card.Body>
              <div className="superadmin-card-content">
                <div>
                  <h6 className="superadmin-card-subtitle">Usuarios Totales</h6>
                  <h3 className="superadmin-card-value">{stats.usuarios}</h3>
                </div>
                <FaUsers className="superadmin-card-icon" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="superadmin-card">
            <Card.Body>
              <div className="superadmin-card-content">
                <div>
                  <h6 className="superadmin-card-subtitle">Lugares</h6>
                  <h3 className="superadmin-card-value">{stats.lugares}</h3>
                </div>
                <FaCity className="superadmin-card-icon" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="superadmin-card">
            <Card.Body>
              <div className="superadmin-card-content">
                <div>
                  <h6 className="superadmin-card-subtitle">Eventos</h6>
                  <h3 className="superadmin-card-value">{stats.eventos}</h3>
                </div>
                <FaCalendar className="superadmin-card-icon" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="superadmin-card">
            <Card.Body>
              <div className="superadmin-card-content">
                <div>
                  <h6 className="superadmin-card-subtitle">Reservas</h6>
                  <h3 className="superadmin-card-value">{stats.reservas}</h3>
                </div>
                <FaCreditCard className="superadmin-card-icon" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="superadmin-menu">
        <Col md={2}>
          <Link to="/superadmin/usuarios" className="superadmin-menu-item">
            <FaUsers /> Usuarios
          </Link>
        </Col>
        <Col md={2}>
          <Link to="/superadmin/roles" className="superadmin-menu-item">
            <FaKey /> Roles
          </Link>
        </Col>
        <Col md={2}>
          <Link to="/superadmin/categorias" className="superadmin-menu-item">
            <FaLayerGroup /> Categorías
          </Link>
        </Col>
        <Col md={2}>
          <Link to="/superadmin/lugares" className="superadmin-menu-item">
            <FaCity /> Lugares
          </Link>
        </Col>
        <Col md={2}>
          <Link to="/superadmin/reservas" className="superadmin-menu-item">
            <FaCreditCard /> Reservas
          </Link>
        </Col>
        <Col md={2}>
          <Link to="/superadmin/perfil" className="superadmin-menu-item">
            <FaStar /> Perfil
          </Link>
        </Col>
      </Row>
    </div>
  );

  return (
    <div className="superadmin-layout">
      <Routes>
        <Route path="/" element={<SuperAdminDashboard />} />
        <Route path="/usuarios" element={<UsuariosListPage />} />
        <Route path="/roles" element={<RolesListPage />} />
        <Route path="/categorias" element={<CategoriasListPage />} />
        <Route path="/lugares" element={<LugaresListPage />} />
        <Route path="/reservas" element={<ReservaListPage />} />
        <Route path="/perfil" element={<PerfilListPage />} />
      </Routes>
    </div>
  );
};

export default SuperAdminPanel;