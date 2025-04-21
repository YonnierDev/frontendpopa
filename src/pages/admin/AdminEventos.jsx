import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const AdminEventos = () => {
  const [eventos, setEventos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    fecha: '',
    hora: '',
    precio: '',
    capacidad: '',
    lugar_id: ''
  });

  useEffect(() => {
    // Aquí cargaríamos los eventos desde el backend
    // fetchEventos();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí manejaríamos la creación/edición del evento
    setShowModal(false);
  };

  return (
    <div className="admin-eventos">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Eventos</h2>
        <Button variant="primary" onClick={() => {
          setSelectedEvento(null);
          setShowModal(true);
        }}>
          <FaPlus className="me-2" />
          Nuevo Evento
        </Button>
      </div>

      <Table responsive className="admin-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Precio</th>
            <th>Lugar</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {eventos.map((evento) => (
            <tr key={evento.id}>
              <td>{evento.nombre}</td>
              <td>{evento.fecha}</td>
              <td>{evento.hora}</td>
              <td>${evento.precio}</td>
              <td>{evento.lugar}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => {
                    setSelectedEvento(evento);
                    setFormData(evento);
                    setShowModal(true);
                  }}
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => {/* Manejar eliminación */}}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedEvento ? 'Editar Evento' : 'Nuevo Evento'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.descripcion}
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Hora</Form.Label>
              <Form.Control
                type="time"
                value={formData.hora}
                onChange={(e) => setFormData({...formData, hora: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                value={formData.precio}
                onChange={(e) => setFormData({...formData, precio: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Capacidad</Form.Label>
              <Form.Control
                type="number"
                value={formData.capacidad}
                onChange={(e) => setFormData({...formData, capacidad: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Lugar</Form.Label>
              <Form.Select
                value={formData.lugar_id}
                onChange={(e) => setFormData({...formData, lugar_id: e.target.value})}
                required
              >
                <option value="">Seleccionar lugar...</option>
                {/* Aquí mapearíamos los lugares */}
              </Form.Select>
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                {selectedEvento ? 'Guardar Cambios' : 'Crear Evento'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminEventos;
