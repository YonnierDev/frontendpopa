import React from 'react'
import { Modal, Button } from 'react-bootstrap'

const LugarModal = ({ show, onHide, lugar }) => {
  if (!lugar) return null

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{lugar.nombre}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <img src={lugar.imagen} alt={lugar.nombre} className="img-fluid mb-3" />
        <p>{lugar.descripcion}</p>
        <p><strong>Tipo:</strong> {lugar.tipo}</p>
        <p><strong>Ubicación:</strong> Centro Histórico, Popayán</p>
        <p><strong>Servicios:</strong> Música en vivo, cocteles, ambiente cultural, zona WiFi, atención personalizada</p>
        <p><strong>Horario:</strong> 6:00 PM - 2:00 AM</p>
        <p><strong>Eventos especiales:</strong> Noches temáticas, DJ invitados, cocina típica</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default LugarModal
