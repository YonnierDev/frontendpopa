import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const AdminCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });

  useEffect(() => {
    // Aquí cargaríamos las categorías desde el backend
    // fetchCategorias();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí manejaríamos la creación/edición de la categoría
    setShowModal(false);
  };

  return (
    <div className="admin-categorias">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Categorías</h2>
        <Button variant="primary" onClick={() => {
          setSelectedCategoria(null);
          setShowModal(true);
        }}>
          <FaPlus className="me-2" />
          Nueva Categoría
        </Button>
      </div>

      <Table responsive className="admin-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Lugares</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((categoria) => (
            <tr key={categoria.id}>
              <td>{categoria.nombre}</td>
              <td>{categoria.descripcion}</td>
              <td>{categoria.lugares_count}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => {
                    setSelectedCategoria(categoria);
                    setFormData(categoria);
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

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedCategoria ? 'Editar Categoría' : 'Nueva Categoría'}
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
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                {selectedCategoria ? 'Guardar Cambios' : 'Crear Categoría'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminCategorias;
