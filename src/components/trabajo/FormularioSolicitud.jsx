import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Alert } from 'react-bootstrap';
import { crearSolicitud } from '../../features/trabajoSolicitudes/trabajoSolicitudesSlice';

const FormularioSolicitud = ({ onClose }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.trabajoSolicitudes);
  
  const [formData, setFormData] = useState({
    mensaje: '',
    experiencia: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await dispatch(crearSolicitud(formData)).unwrap();
      onClose();
    } catch (err) {
      console.error('Error al enviar solicitud:', err);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form.Group className="mb-3">
        <Form.Label>Mensaje de Solicitud</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="mensaje"
          value={formData.mensaje}
          onChange={handleChange}
          placeholder="¿Por qué te gustaría trabajar con nosotros?"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Experiencia</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="experiencia"
          value={formData.experiencia}
          onChange={handleChange}
          placeholder="Cuéntanos sobre tu experiencia relevante"
          required
        />
      </Form.Group>

      <div className="d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar Solicitud'}
        </Button>
      </div>
    </Form>
  );
};

export default FormularioSolicitud;
