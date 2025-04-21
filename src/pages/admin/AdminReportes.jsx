import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import { 
  FaUsers, 
  FaCalendarCheck, 
  FaStar, 
  FaChartLine,
  FaFileDownload
} from 'react-icons/fa';

const AdminReportes = () => {
  const [reportType, setReportType] = useState('usuarios');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const handleGenerateReport = () => {
    // Aquí manejaríamos la generación del reporte
  };

  return (
    <div className="admin-reportes">
      <h2 className="mb-4">Reportes y Estadísticas</h2>

      <Row className="mb-4">
        <Col md={3}>
          <Card className="admin-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Usuarios Totales</h6>
                  <h3 className="mb-0">1,234</h3>
                </div>
                <FaUsers size={24} color="#007bff" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="admin-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Reservas</h6>
                  <h3 className="mb-0">567</h3>
                </div>
                <FaCalendarCheck size={24} color="#28a745" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="admin-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Calificación Promedio</h6>
                  <h3 className="mb-0">4.5</h3>
                </div>
                <FaStar size={24} color="#ffc107" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="admin-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Crecimiento Mensual</h6>
                  <h3 className="mb-0">+12%</h3>
                </div>
                <FaChartLine size={24} color="#dc3545" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="admin-card">
        <Card.Body>
          <h5 className="mb-4">Generar Reporte</h5>
          <Form>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo de Reporte</Form.Label>
                  <Form.Select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    <option value="usuarios">Usuarios</option>
                    <option value="reservas">Reservas</option>
                    <option value="eventos">Eventos</option>
                    <option value="lugares">Lugares</option>
                    <option value="calificaciones">Calificaciones</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha Inicio</Form.Label>
                  <Form.Control
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha Fin</Form.Label>
                  <Form.Control
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={2} className="d-flex align-items-end">
                <Button 
                  variant="primary" 
                  className="w-100"
                  onClick={handleGenerateReport}
                >
                  <FaFileDownload className="me-2" />
                  Generar
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Aquí irían gráficos y estadísticas detalladas */}
    </div>
  );
};

export default AdminReportes;
