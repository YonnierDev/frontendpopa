import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import FormularioSolicitud from '../trabajo/FormularioSolicitud';

const Footer = () => {
  const [showModal, setShowModal] = useState(false);
  const auth = useSelector(state => state.auth);
  const isAuthenticated = auth?.isAuthenticated || false;

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <>
      <footer className="bg-dark text-white py-4 mt-5">
        <div className="container text-center">
          <p>&copy; 2025 Popayán Nocturna. Todos los derechos reservados.</p>
          <div className="d-flex flex-column align-items-center gap-3">
            <a href="/descargar-app" className="btn btn-outline-light">
              Descargar para móvil
            </a>
            {isAuthenticated && (
              <Button 
                variant="outline-light"
                onClick={handleShow}
              >
                Trabaja con nosotros
              </Button>
            )}
          </div>
        </div>
      </footer>

      <Modal show={showModal} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Trabaja con nosotros</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormularioSolicitud onClose={handleClose} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Footer;
