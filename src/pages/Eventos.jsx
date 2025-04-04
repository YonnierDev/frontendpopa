import React, { useState, useEffect } from 'react';
import { api } from "./api/api";
import { useNavigate } from 'react-router-dom';
import './Eventos.css';
import Sidebar from '../components/Sidebar';

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [nuevoEvento, setNuevoEvento] = useState({
    lugarid: '',
    comentarioid: '',
    capacidad: '',
    precio: '',
    descripcion: '',
    fecha_hora: ''
  });
  const [eventoEditar, setEventoEditar] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    cargarEventos();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (eventoEditar) {
        await api.put(`/evento/${eventoEditar.id}`, nuevoEvento);
        setMensaje('Evento actualizado exitosamente');
      } else {
        await api.post("/evento", nuevoEvento);
        setMensaje('Evento creado exitosamente');
      }
      setNuevoEvento({
        lugarid: '',
        comentarioid: '',
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
    setEventoEditar(evento);
    setNuevoEvento({
      lugarid: evento.lugarid,
      comentarioid: evento.comentarioid,
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
        <div className="header">
          <button className="cerrar-sesion" onClick={() => navigate('/login')}>
            Cerrar sesión
          </button>
        </div>

        <div className="main-content">
          <h2>Eventos de Popayán Nocturna</h2>
          
          {mensaje && <div className="mensaje">{mensaje}</div>}

          <form onSubmit={handleSubmit} className="form-container">
            <div className="form-group">
              <input
                type="number"
                value={nuevoEvento.lugarid}
                onChange={(e) => setNuevoEvento({...nuevoEvento, lugarid: e.target.value})}
                placeholder="ID Lugar"
                required
              />
              <input
                type="number"
                value={nuevoEvento.comentarioid}
                onChange={(e) => setNuevoEvento({...nuevoEvento, comentarioid: e.target.value})}
                placeholder="ID Comentario"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                value={nuevoEvento.capacidad}
                onChange={(e) => setNuevoEvento({...nuevoEvento, capacidad: e.target.value})}
                placeholder="Capacidad"
                required
              />
              <input
                type="number"
                value={nuevoEvento.precio}
                onChange={(e) => setNuevoEvento({...nuevoEvento, precio: e.target.value})}
                placeholder="Precio"
                required
              />
            </div>
            <textarea
              value={nuevoEvento.descripcion}
              onChange={(e) => setNuevoEvento({...nuevoEvento, descripcion: e.target.value})}
              placeholder="Descripción del evento"
              required
            />
            <input
              type="datetime-local"
              value={nuevoEvento.fecha_hora}
              onChange={(e) => setNuevoEvento({...nuevoEvento, fecha_hora: e.target.value})}
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
                  <span>Lugar #{evento.lugarid}</span>
                  <span>{new Date(evento.fecha_hora).toLocaleString()}</span>
                </div>
                <div className="item-content">
                  <p>{evento.descripcion}</p>
                  <div className="item-details">
                    <span>💰 Precio: ${evento.precio}</span>
                    <span>👥 Capacidad: {evento.capacidad}</span>
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
