import React, { useState } from 'react';
import { Card, Row, Col, Badge, Button, Modal, Form, Tab, Tabs, ListGroup } from 'react-bootstrap';
import { FaMapMarkerAlt, FaClock, FaStar, FaUsers, FaDollarSign } from 'react-icons/fa';
import defaultImage from '../../assets/logos.png';
import './DetallesModal.css';
import './Detalles.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const DetallesEvento = ({ evento, onClose, onReservar, onComentar, onCalificar }) => {
  const auth = useSelector(state => state.auth);
  const isAuthenticated = auth?.isAuthenticated || false;
  const userRole = auth?.user?.role || null;
  const navigate = useNavigate();

  const checkUserPermission = (action) => {
    if (!isAuthenticated) {
      navigate('/login');
      return false;
    }
    if (userRole !== 8) {
      alert('Solo los usuarios registrados pueden ' + action);
      return false;
    }
    return true;
  };

  const [activeTab, setActiveTab] = useState('info');
  const [showReservaModal, setShowReservaModal] = useState(false);
  const [comentario, setComentario] = useState('');
  const [calificacion, setCalificacion] = useState(5);
  const [cantidadPersonas, setCantidadPersonas] = useState(1);

  const handleReservaSubmit = (e) => {
    e.preventDefault();
    onReservar({
      eventoid: evento.id,
      cantidad_personas: cantidadPersonas
    });
    setShowReservaModal(false);
  };

  const handleComentarioSubmit = (e) => {
    e.preventDefault();
    if (checkUserPermission('comentar')) {
      onComentar({
        eventoid: evento.id,
        comentario: comentario,
        calificacion: calificacion
      });
    }
  };

  const calcularDisponibilidad = () => {
    if (!evento.capacidad || !evento.reservas) return evento.capacidad || 0;
    const reservadas = evento.reservas.reduce((total, reserva) => total + reserva.cantidad_personas, 0);
    return evento.capacidad - reservadas;
  };

  return (
    <div className="detalles-container">
      <Card className="detalles-card">
        <Card.Header className="bg-transparent border-0">
          <Row className="align-items-center">
            <Col>
              <h3 className="mb-0">{evento.nombre}</h3>
              <Badge bg={evento.estado ? "success" : "danger"} className="me-2">
                {evento.estado ? "Activo" : "Inactivo"}
              </Badge>
            </Col>
            <Col xs="auto">
              <Button variant="outline-secondary" size="sm" onClick={onClose}>
                Cerrar
              </Button>
            </Col>
          </Row>
        </Card.Header>

        <Card.Body className="p-0">
          <div className="imagen-container">
            <img
              src={evento.lugar?.imagen || defaultImage}
              alt={evento.nombre}
              className="w-100 detalles-imagen"
            />
          </div>

          <div className="p-4">
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="mb-4"
            >
              <Tab eventKey="info" title="Información">
                <Row className="mb-4">
                  <Col>
                    <h5>Descripción</h5>
                    <p>{evento.descripcion}</p>
                    
                    <div className="d-flex flex-wrap gap-3 mb-4">
                      <div className="d-flex align-items-center">
                        <FaMapMarkerAlt className="text-primary me-2" />
                        <span>{evento.lugar?.nombre}</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <FaClock className="text-primary me-2" />
                        <span>{new Date(evento.fecha_hora).toLocaleString()}</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <FaUsers className="text-primary me-2" />
                        <span>Disponibles: {calcularDisponibilidad()}</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <FaDollarSign className="text-primary me-2" />
                        <span className="fw-bold">${evento.precio}</span>
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      className="w-100 mb-3"
                      onClick={() => {
                        if (!isAuthenticated) {
                          navigate('/login');
                        } else if (userRole === 8) {
                          setShowReservaModal(true);
                        } else {
                          alert('Solo los usuarios registrados pueden reservar');
                        }
                      }}
                      disabled={calcularDisponibilidad() <= 0}
                    >
                      {calcularDisponibilidad() <= 0 ? 'Agotado' : 
                       !isAuthenticated ? 'Inicia sesión para reservar' : 
                       userRole !== 8 ? 'Solo usuarios registrados' : 
                       'Reservar Ahora'}
                    </Button>
                  </Col>
                </Row>
              </Tab>

              <Tab eventKey="comentarios" title="Comentarios">
                {isAuthenticated && userRole === 8 ? (
                  <Form onSubmit={handleComentarioSubmit} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Calificación</Form.Label>
                      <div className="star-rating mb-2">
                        {[...Array(5)].map((_, index) => (
                          <FaStar
                            key={index}
                            className={index < calificacion ? 'star active' : 'star'}
                            onClick={() => setCalificacion(index + 1)}
                          />
                        ))}
                      </div>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Escribe tu comentario..."
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                      />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                      Enviar comentario
                    </Button>
                  </Form>
                ) : (
                  <div className="alert alert-info">
                    {!isAuthenticated ? (
                      <p>
                        <a href="/login" className="alert-link">Inicia sesión</a> para dejar un comentario
                      </p>
                    ) : (
                      <p>Solo los usuarios registrados pueden comentar</p>
                    )}
                  </div>
                )}

                <div className="comentarios-list">
                  {evento.comentarios && evento.comentarios.map((comentario) => (
                    <Card key={comentario.id} className="mb-3">
                      <Card.Body>
                        <div className="d-flex justify-content-between">
                          <h6 className="mb-2">{comentario.usuario?.nombre}</h6>
                          <div className="text-warning">
                            {[...Array(comentario.calificacion)].map((_, i) => (
                              <FaStar key={i} className="star-small" />
                            ))}
                          </div>
                        </div>
                        <p className="mb-0">{comentario.contenido}</p>
                        <small className="text-muted">
                          {new Date(comentario.createdAt).toLocaleDateString()}
                        </small>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              </Tab>
            </Tabs>
          </div>
        </Card.Body>
      </Card>

      {/* Modal de Reserva */}
      <Modal show={true} onHide={onClose} size="xl" centered dialogClassName="modal-90w">
        <Modal.Header closeButton>
          <Modal.Title>Reservar Evento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleReservaSubmit}>
            <div className="mb-4">
              <h6>Detalles del Evento</h6>
              <p className="mb-1">
                <strong>Fecha y Hora:</strong>{' '}
                {new Date(evento.fecha_hora).toLocaleString()}
              </p>
              <p className="mb-1">
                <strong>Precio:</strong> ${evento.precio}
              </p>
              <p className="mb-1">
                <strong>Disponibilidad:</strong> {calcularDisponibilidad()} lugares
              </p>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Número de personas</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max={calcularDisponibilidad()}
                value={cantidadPersonas}
                onChange={(e) => setCantidadPersonas(Number(e.target.value))}
                required
              />
            </Form.Group>

            <div className="mb-3">
              <h6>Total a pagar</h6>
              <p className="h4 text-primary">
                ${(evento.precio * cantidadPersonas).toFixed(2)}
              </p>
            </div>

            <div className="d-grid">
              <Button 
                variant="primary" 
                type="submit" 
                disabled={!isAuthenticated || userRole !== 8}
              >
                Confirmar Reserva
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DetallesEvento;
