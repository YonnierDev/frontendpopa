import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card } from 'react-bootstrap';
import { 
  FaUsers, 
  FaKey, 
  FaLayerGroup, 
  FaCity, 
  FaCalendar, 
  FaCreditCard,
  FaChartLine,
  FaStar 
} from "react-icons/fa";

const SuperAdminPanel = () => {
  const [stats, setStats] = useState({
    usuarios: 0,
    lugares: 0,
    eventos: 0,
    reservas: 0
  });

  useEffect(() => {
    // Aquí cargaríamos las estadísticas desde el backend
    // fetchStats();
  }, []);

  const cards = [
    { title: "Usuarios", icon: <FaUsers />, route: "/superadmin/usuarios" },
    { title: "Roles", icon: <FaKey />, route: "/superadmin/roles" },
    { title: "Categorías", icon: <FaLayerGroup />, route: "/superadmin/categorias" },
    { title: "Lugares", icon: <FaCity />, route: "/superadmin/lugares" },
    { title: "Eventos", icon: <FaCalendar />, route: "/superadmin/eventos" },
    { title: "Reservas", icon: <FaCreditCard />, route: "/superadmin/reservas" },
  ];

  return (
    <div className="superadmin-panel">
      <h1 className="panel-title mb-4">Panel del Super Administrador</h1>
      
      <Row className="mb-4">
        <Col md={3}>
          <Card className="stats-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Usuarios Totales</h6>
                  <h3 className="mb-0">{stats.usuarios}</h3>
                </div>
                <FaUsers size={24} className="stats-icon text-primary" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stats-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Lugares</h6>
                  <h3 className="mb-0">{stats.lugares}</h3>
                </div>
                <FaCity size={24} className="stats-icon text-success" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stats-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Eventos</h6>
                  <h3 className="mb-0">{stats.eventos}</h3>
                </div>
                <FaCalendar size={24} className="stats-icon text-warning" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stats-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Reservas</h6>
                  <h3 className="mb-0">{stats.reservas}</h3>
                </div>
                <FaCreditCard size={24} className="stats-icon text-danger" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="card-container">
        {cards.map((card, index) => (
          <Link to={card.route} key={index} className="card-link">
            <Card className="menu-card">
              <Card.Body>
                <div className="text-center">
                  <div className="menu-card-icon">{card.icon}</div>
                  <div className="menu-card-title">{card.title}</div>
                </div>
              </Card.Body>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SuperAdminPanel;