import React, { useState, useEffect } from 'react';
import '../../App.css';
import { FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLugares } from '../../store/lugares/lugaresSlice';
import { listarEventos } from '../../store/usuario/eventos/usuariosEventosSlice';
import { Button, Form, Card, ListGroup } from 'react-bootstrap';

const Buscador = ({ onBuscar, onResetFiltros }) => {
  const dispatch = useDispatch();

  // Obtener lugares y eventos del estado global
  const { lugares } = useSelector((state) => state.lugares);
  const { eventos } = useSelector((state) => state.usuariosEventos);

  const [filtros, setFiltros] = useState({
    lugar: '',
    evento: '',
    fecha_hora: '',
    capacidad: '',
    precio: '',
  });

  const [showLugares, setShowLugares] = useState(false);
  const [showEventos, setShowEventos] = useState(false);
  const [selectedLugar, setSelectedLugar] = useState(null);
  const [selectedEvento, setSelectedEvento] = useState(null);

  // Cargar lugares y eventos al montar el componente
  useEffect(() => {
    dispatch(fetchLugares());
    dispatch(listarEventos());
  }, [dispatch]);

  const handleLugarSelect = (lugar) => {
    setSelectedLugar(lugar);
    setFiltros(prev => ({ ...prev, lugar: lugar.id }));
    setShowLugares(false);
  };

  const handleEventoSelect = (evento) => {
    setSelectedEvento(evento);
    setFiltros(prev => ({ ...prev, evento: evento.id }));
    setShowEventos(false);
  };

  const handleBuscar = () => {
    onBuscar(filtros);
  };

  const handleResetFiltros = () => {
    // Resetear todos los estados locales
    setFiltros({
      lugar: '',
      evento: '',
      fecha_hora: '',
      capacidad: '',
      precio: ''
    });
    setSelectedLugar(null);
    setSelectedEvento(null);
    setShowLugares(false);
    setShowEventos(false);
    
    // Notificar al componente padre
    if (typeof onResetFiltros === 'function') {
      onResetFiltros();
    }
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <div className="row g-3 align-items-end">
          {/* Buscador de Lugares */}
          <div className="col">
            <Form.Group>
              <Form.Label>Lugar</Form.Label>
              <div className="position-relative">
                <Form.Control
                  type="text"
                  placeholder="Buscar lugar..."
                  value={selectedLugar ? selectedLugar.nombre : ''}
                  onClick={() => setShowLugares(!showLugares)}
                  readOnly
                />
                {showLugares && (
                  <ListGroup className="position-absolute w-100 mt-1 shadow-sm" style={{ zIndex: 1000 }}>
                    {lugares.map((lugar) => (
                      <ListGroup.Item 
                        key={lugar.id}
                        action
                        onClick={() => handleLugarSelect(lugar)}
                      >
                        {lugar.nombre}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </div>
            </Form.Group>
          </div>

          {/* Buscador de Eventos */}
          <div className="col">
            <Form.Group>
              <Form.Label>Evento</Form.Label>
              <div className="position-relative">
                <Form.Control
                  type="text"
                  placeholder="Buscar evento..."
                  value={selectedEvento ? selectedEvento.nombre : ''}
                  onClick={() => setShowEventos(!showEventos)}
                  readOnly
                />
                {showEventos && (
                  <ListGroup className="position-absolute w-100 mt-1 shadow-sm" style={{ zIndex: 1000 }}>
                    {eventos.map((evento) => (
                      <ListGroup.Item 
                        key={evento.id}
                        action
                        onClick={() => handleEventoSelect(evento)}
                      >
                        {evento.nombre}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </div>
            </Form.Group>
          </div>

          {/* Campo de Fecha y Hora */}
          <div className="col">
            <Form.Group>
              <Form.Label>Fecha y Hora</Form.Label>
              <Form.Control
                type="datetime-local"
                name="fecha_hora"
                value={filtros.fecha_hora}
                onChange={(e) => setFiltros(prev => ({ ...prev, fecha_hora: e.target.value }))}
              />
            </Form.Group>
          </div>

          {/* Campo de Capacidad */}
          <div className="col">
            <Form.Group>
              <Form.Label>Capacidad</Form.Label>
              <Form.Control
                type="number"
                name="capacidad"
                placeholder="¿Cuántas personas?"
                min="1"
                value={filtros.capacidad}
                onChange={(e) => setFiltros(prev => ({ ...prev, capacidad: e.target.value }))}
              />
            </Form.Group>
          </div>

          {/* Campo de Precio */}
          <div className="col">
            <Form.Group>
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                name="precio"
                placeholder="Precio máximo"
                min="0"
                value={filtros.precio}
                onChange={(e) => setFiltros(prev => ({ ...prev, precio: e.target.value }))}
              />
            </Form.Group>
          </div>

          <div className="col-auto">
            <div className="d-flex gap-2">
              <Button variant="primary" onClick={handleBuscar}>
                <FaSearch className="me-2" />
                Buscar
              </Button>
              <Button variant="outline-secondary" onClick={handleResetFiltros}>
                Limpiar
              </Button>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Buscador;