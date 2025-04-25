import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCalendar } from 'react-icons/fa';
import { api } from "../../components/api/api";
import { useNavigate } from 'react-router-dom';
import './Eventos.css';
import Sidebar from '../../components/Sidebar';

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lugares, setLugares] = useState([]);  // Estado para los lugares
  const [usuario, setUsuario] = useState('');
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

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await api.get("/eventos");
        console.log('Eventos cargados:', response.data);
        setEventos(response.data);
      } catch (error) {
        console.error("Error detallado:", error.response || error);
        setError('Error al cargar los eventos: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };

    const cargarLugares = async () => {
      try {
        const response = await api.get("/lugares");  // Asume que tienes esta API para obtener lugares
        setLugares(response.data);
      } catch (error) {
        console.error("Error al cargar los lugares:", error);
        setError('Error al cargar los lugares: ' + (error.response?.data?.message || error.message));
      }
    };

    const usuarioGuardado = JSON.parse(localStorage.getItem('usuario'));
    if (usuarioGuardado) {
      setUsuario(usuarioGuardado.nombre || usuarioGuardado.username || 'Usuario');
    }

    fetchEventos();
    cargarLugares();
  }, []);

  const handleCrearEvento = async () => {
    try {
      const lugarSeleccionado = lugares.find(lugar => lugar.nombre === nuevoEvento.lugar); // Buscar el lugar por nombre
      if (!lugarSeleccionado) {
        setError('El lugar seleccionado no es válido.');
        return;
      }
      const eventoData = {
        ...nuevoEvento,
        lugarid: lugarSeleccionado.id,  // Asignar el lugarid correspondiente
      };

      await api.post("/evento", eventoData);
      setMensaje('Evento creado exitosamente');
      setNuevoEvento({
        nombre: '',
        lugar: '',
        capacidad: '',
        precio: '',
        descripcion: '',
        fecha_hora: ''
      });
      setEventoEditar(null);
      const response = await api.get("/eventos");
      setEventos(response.data);
    } catch (error) {
      setError('Error al crear el evento');
      console.error("Error:", error);
    }
  };

  const handleEditarEvento = async (id) => {
    try {
      const evento = eventos.find(evento => evento.id === id);
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
    } catch (error) {
      setError('Error al editar el evento');
      console.error("Error:", error);
    }
  };

  const handleEliminarEvento = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este evento?')) return;

    try {
      await api.delete(`/evento/${id}`);
      setEventos(eventos.filter(evento => evento.id !== id));
    } catch (error) {
      setError('Error al eliminar el evento');
      console.error("Error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const lugarSeleccionado = lugares.find(lugar => lugar.nombre === nuevoEvento.lugar); // Buscar el lugar por nombre
      if (!lugarSeleccionado) {
        setError('El lugar seleccionado no es válido.');
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
      const response = await api.get("/eventos");
      setEventos(response.data);
    } catch (error) {
      setError('Error al procesar el evento');
      console.error("Error:", error);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <>
      <Sidebar />
      <div className="app-container">
        <div className="main-content">
          <h2>Eventos de {usuario}</h2>

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
              <div key={evento.id} className={`item-card ${!evento.estado ? 'inactivo' : ''}`}>
                <div className="item-header">
                  <strong>{evento.nombre}</strong>
                  <span className={`estado-badge ${evento.estado ? 'activo' : 'inactivo'}`}>
                    {evento.estado ? 'Activo' : 'Inactivo'}
                  </span>
                  <span>{new Date(evento.fecha_hora).toLocaleString()}</span>
                </div>
                <div className="item-content">
                  <p>{evento.descripcion}</p>
                  <div className="item-details">
                    <span>💰 Precio: ${evento.precio}</span>
                    <span>👥 Capacidad: {evento.capacidad}</span>
                    <span>📍 Lugar: {lugares.find(lugar => lugar.id === evento.lugarid)?.nombre}</span>
                  </div>
                </div>
                <div className="item-footer">
                  <div className="item-actions">
                    <button onClick={() => handleEditarEvento(evento.id)}>Editar</button>
                    <button 
                      onClick={() => handleEliminarEvento(evento.id)}
                      className="btn-eliminar"
                    >
                      Eliminar
                    </button>
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
