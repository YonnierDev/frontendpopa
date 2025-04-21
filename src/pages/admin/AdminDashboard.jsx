import React, { useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTags,
  FaUsers
} from 'react-icons/fa';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const stats = useSelector(state => state.admin.stats);

  useEffect(() => {
    // Aquí cargaríamos las estadísticas desde el backend
    // dispatch(fetchAdminStats());
  }, [dispatch]);

  const statCards = [
    {
      title: 'Lugares',
      value: stats?.lugares || 0,
      icon: <FaMapMarkerAlt />,
      color: '#007bff'
    },
    {
      title: 'Eventos',
      value: stats?.eventos || 0,
      icon: <FaCalendarAlt />,
      color: '#28a745'
    },
    {
      title: 'Categorías',
      value: stats?.categorias || 0,
      icon: <FaTags />,
      color: '#ffc107'
    },
    {
      title: 'Usuarios',
      value: stats?.usuarios || 0,
      icon: <FaUsers />,
      color: '#dc3545'
    }
  ];

  return (
    <div className="admin-dashboard">
      <h2 className="mb-4">Dashboard</h2>
      
      <Row>
        {statCards.map((stat, index) => (
          <Col md={3} key={index}>
            <Card className="admin-card">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-2">{stat.title}</h6>
                    <h3 className="mb-0">{stat.value}</h3>
                  </div>
                  <div
                    style={{
                      backgroundColor: stat.color,
                      padding: '1rem',
                      borderRadius: '50%',
                      color: 'white'
                    }}
                  >
                    {stat.icon}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Aquí irían más secciones como gráficos, tablas de actividad reciente, etc. */}
    </div>
  );
};

export default AdminDashboard;
