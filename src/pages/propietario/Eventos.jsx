import React, { useState, useEffect } from 'react';
import { api } from "../../components/api/api";
import { useNavigate } from 'react-router-dom';
import './Eventos.css';
import Sidebar from '../../components/Sidebar';

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [lugares, setLugares] = useState([]);  // Estado para los lugares
  const [nuevoEvento, setNuevoEvento] = useState({
    nombre: '',
    lugar: '',  // Ahora almacenamos el nombre del lugar en lugar de lugarid
    capacidad: '',
    precio: '',
    descripcion: '',
    fecha_hora: ''
  });
  const [eventoEditar, setEventoEditar] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  // Cargar eventos y lugares al montar el componente
  useEffect(() => {
    cargarEventos();
    cargarLugares();
  }, []);

  // Función para cargar los eventos
  const cargarEventos = async () => {
    try {
      const response = await api.get("/eventos");
      console.log('Eventos cargados:', response.data);
      setEventos(response.data);
    } catch (error) {
      console.error("Error detallado:", error.response || error);
      setMensaje('Error al cargar los eventos: ' + (error.response?.data?.message || error.message));
    }
  };

  // Función para cargar los lugares
  const cargarLugares = async () => {
    try {
      const response = await api.get("/lugares");  // Asume que tienes esta API para obtener lugares
      setLugares(response.data);
    } catch (error) {
      console.error("Error al cargar los lugares:", error);
      setMensaje('Error al cargar los lugares: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const lugarSeleccionado = lugares.find(lugar => lugar.nombre === nuevoEvento.lugar); // Buscar el lugar por nombre
      if (!lugarSeleccionado) {
        setMensaje('El lugar seleccionado no es válido.');
        return;
      }
      const eventoData = {
        ...nuevoEvento,
        lugarid: lugarSeleccionado.id,  // Asignar el lugarid correspondiente
      };

      if (eventoEditar) {
        await api.put(`/evento/${eventoEditar.id}`, eventoData);
        setMensaje('Evento actualizado exitosamente');
      } else {
        await api.post("/evento", eventoData);
        setMensaje('Evento creado exitosamente');
      }
      setNuevoEvento({
        nombre: '',
        lugar: '',
        capacidad: '',
        precio: '',
        descripcion: '',
        fecha_hora: ''
      });
      setEventoEditar(null);
      cargarEventos();
    } catch (error) {
      setMensaje('Error al procesar el evento');
      console.error("Error:", error);
    }
  };

  const handleEditar = (evento) => {
    const lugar = lugares.find(lugar => lugar.id === evento.lugarid)?.nombre || ''; // Obtener el nombre del lugar
    setEventoEditar(evento);
    setNuevoEvento({
      nombre: evento.nombre,
      lugar: lugar,
      capacidad: evento.capacidad,
      precio: evento.precio,
      descripcion: evento.descripcion,
      fecha_hora: evento.fecha_hora
    });
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este evento?')) {
      try {
        await api.delete(`/evento/${id}`);
        setMensaje('Evento eliminado exitosamente');
        cargarEventos();
      } catch (error) {
        setMensaje('Error al eliminar el evento');
        console.error("Error:", error);
      }
    }
  };

  return (
    <>
      <Sidebar />
      <div className="app-container">
        <div className="main-content">
          <h2>Eventos de Popayán Nocturna</h2>

          {mensaje && <div className="mensaje">{mensaje}</div>}

          <form onSubmit={handleSubmit} className="form-container">
            <div className="form-group">
              <input
                type="text"
                value={nuevoEvento.nombre}
                onChange={(e) => setNuevoEvento({ ...nuevoEvento, nombre: e.target.value })}
                placeholder="Nombre del evento"
                required
              />
              <select
                value={nuevoEvento.lugar}
                onChange={(e) => setNuevoEvento({ ...nuevoEvento, lugar: e.target.value })}
                required
              >
                <option value="">Selecciona un lugar</option>
                {lugares.map((lugar) => (
                  <option key={lugar.id} value={lugar.nombre}>{lugar.nombre}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <input
                type="number"
                value={nuevoEvento.capacidad}
                onChange={(e) => setNuevoEvento({ ...nuevoEvento, capacidad: e.target.value })}
                placeholder="Capacidad"
                required
              />
              <input
                type="number"
                value={nuevoEvento.precio}
                onChange={(e) => setNuevoEvento({ ...nuevoEvento, precio: e.target.value })}
                placeholder="Precio"
                required
              />
            </div>
            <textarea
              value={nuevoEvento.descripcion}
              onChange={(e) => setNuevoEvento({ ...nuevoEvento, descripcion: e.target.value })}
              placeholder="Descripción del evento"
              required
            />
            <input
              type="datetime-local"
              value={nuevoEvento.fecha_hora}
              onChange={(e) => setNuevoEvento({ ...nuevoEvento, fecha_hora: e.target.value })}
              required
            />
            <button type="submit" className="btn-crear">
              {eventoEditar ? 'Actualizar' : 'Crear'} Evento
            </button>
          </form>

          <div className="items-list">
            {eventos.map((evento) => (
              <div key={evento.id} className="item-card">
                <div className="item-header">
                  <strong>{evento.nombre}</strong>
                  <span>{new Date(evento.fecha_hora).toLocaleString()}</span>
                </div>
                <div className="item-content">
                  <p>{evento.descripcion}</p>
                  <div className="item-details">
                    <span>💰 Precio: ${evento.precio}</span>
                    <span>👥 Capacidad: {evento.capacidad}</span>
                    <span>📍 Lugar: {lugares.find(lugar => lugar.id === evento.lugarid)?.nombre}</span> {/* Mostrar el nombre del lugar */}
                  </div>
                </div>
                <div className="item-footer">
                  <div className="item-actions">
                    <button onClick={() => handleEditar(evento)}>Editar</button>
                    <button onClick={() => handleEliminar(evento.id)}>Eliminar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Eventos;
