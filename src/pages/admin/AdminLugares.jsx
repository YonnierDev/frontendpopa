import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const AdminLugares = () => {
  const [lugares, setLugares] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedLugar, setSelectedLugar] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    direccion: '',
    capacidad: '',
    categoria_id: ''
  });

  useEffect(() => {
    // Aquí cargaríamos los lugares desde el backend
    // fetchLugares();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí manejaríamos la creación/edición del lugar
    setShowModal(false);
  };

  return (
    <div className="admin-lugares">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Lugares</h2>
        <Button variant="primary" onClick={() => {
          setSelectedLugar(null);
          setShowModal(true);
        }}>
          <FaPlus className="me-2" />
          Nuevo Lugar
        </Button>
      </div>

      <Table responsive className="admin-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Capacidad</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {lugares.map((lugar) => (
            <tr key={lugar.id}>
              <td>{lugar.nombre}</td>
              <td>{lugar.direccion}</td>
              <td>{lugar.capacidad}</td>
              <td>{lugar.categoria}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => {
                    setSelectedLugar(lugar);
                    setFormData(lugar);
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
            {selectedLugar ? 'Editar Lugar' : 'Nuevo Lugar'}
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
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                value={formData.direccion}
                onChange={(e) => setFormData({...formData, direccion: e.target.value})}
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
              <Form.Label>Categoría</Form.Label>
              <Form.Select
                value={formData.categoria_id}
                onChange={(e) => setFormData({...formData, categoria_id: e.target.value})}
                required
              >
                <option value="">Seleccionar categoría...</option>
                {/* Aquí mapearíamos las categorías */}
              </Form.Select>
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                {selectedLugar ? 'Guardar Cambios' : 'Crear Lugar'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminLugares;
