import React from 'react';
import { Modal, Row, Col, Badge } from 'react-bootstrap';
import { FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
import defaultImage from '../../assets/logos.png';
import Card from '../home/Card';
import './DetallesModal.css';

const DetallesLugar = ({ lugar, onClose }) => {
  return (
    <Modal show={true} onHide={onClose} size="xl" centered dialogClassName="modal-90w">
      <Modal.Header closeButton>
        <Modal.Title>{lugar.nombre}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="text-center mb-4">
          <img
            src={lugar.imagen || defaultImage}
            alt={lugar.nombre}
            className="img-fluid rounded"
            style={{ maxHeight: '400px', objectFit: 'cover', width: '100%' }}
          />
        </div>
        
        <div className="row">
          <div className="col-md-6">
            <h4>Descripción</h4>
            <p>{lugar.descripcion}</p>

            <h4>Ubicación</h4>
            <p>
              <FaMapMarkerAlt className="me-2" />
              {lugar.ubicacion}
            </p>

            <h4>Capacidad</h4>
            <p>
              <FaUsers className="me-2" />
              {lugar.capacidad} personas
            </p>
          </div>

          <div className="col-md-6">
            <h4>Categoría</h4>
            {lugar.categoria && (
              <div className="mb-4">
                <Badge bg="info" className="mb-2">{lugar.categoria.tipo}</Badge>
                <p>{lugar.categoria.descripcion}</p>
              </div>
            )}

            <h4>Eventos Relacionados</h4>
            {lugar.eventos && lugar.eventos.length > 0 ? (
              <Row xs={1} className="g-4">
                {lugar.eventos.map((evento) => (
                  <Col key={evento.id}>
                    <Card item={evento} tipo="evento" />
                  </Col>
                ))}
              </Row>
            ) : (
              <p>No hay eventos programados</p>
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DetallesLugar;
