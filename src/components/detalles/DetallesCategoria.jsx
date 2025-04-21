import React from 'react';
import { Modal, Badge } from 'react-bootstrap';
import defaultLogo from '../../assets/logos.png';
import Card from '../home/Card';
import './DetallesModal.css';

const DetallesCategoria = ({ categoria, lugares = [], onClose }) => {
  return (
    <Modal show={true} onHide={onClose} size="xl" centered dialogClassName="modal-90w">
      <Modal.Header closeButton>
        <Modal.Title>{categoria.tipo}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center mb-4">
          <img
            src={categoria.imagen || defaultLogo}
            alt={categoria.tipo}
            className="img-fluid rounded"
            style={{ maxHeight: '200px', objectFit: 'cover' }}
          />
        </div>
        
        <h4>Descripción</h4>
        <p className="mb-4">{categoria.descripcion}</p>

        <h4 className="mb-3">Lugares en esta categoría</h4>
        {lugares.length > 0 ? (
          <div className="row row-cols-1 row-cols-md-2 g-4">
            {lugares.map((lugar) => (
              <div key={lugar.id} className="col">
                <Card item={lugar} tipo="lugar" />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">No hay lugares disponibles en esta categoría</p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default DetallesCategoria;
