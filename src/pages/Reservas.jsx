import React, { useState, useEffect } from 'react';
import { api } from "./api/api";
import { useNavigate } from 'react-router-dom';
import './Reservas.css';
import Sidebar from '../components/Sidebar';

const Reservas = () => {
  const [reservas, setReservas] = useState([]);
  const [nuevaReserva, setNuevaReserva] = useState({
    usuarioid: '',
    eventoid: '',
    fecha_hora: new Date().toISOString(),
    estado: true,
    cantidad_personas: ''
  });
  const [reservaEditar, setReservaEditar] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    cargarReservas();
  }, []);

  const cargarReservas = async () => {
    try {
      const response = await api.get("/reservas");
      console.log('Reservas cargadas:', response.data);
      setReservas(response.data);
    } catch (error) {
      console.error("Error detallado:", error.response || error);
      setMensaje('Error al cargar las reservas: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (reservaEditar) {
        await api.put(`/reserva/${reservaEditar.id}`, nuevaReserva);
        setMensaje('Reserva actualizada exitosamente');
      } else {
        await api.post("/reserva", nuevaReserva);
        setMensaje('Reserva creada exitosamente');
      }
      setNuevaReserva({
        usuarioid: '',
        eventoid: '',
        fecha_hora: new Date().toISOString(),
        estado: true,
        cantidad_personas: ''
      });
      setReservaEditar(null);
      cargarReservas();
    } catch (error) {
      setMensaje('Error al procesar la reserva');
      console.error("Error:", error);
    }
  };

  const handleEditar = (reserva) => {
    setReservaEditar(reserva);
    setNuevaReserva({
      usuarioid: reserva.usuarioid,
      eventoid: reserva.eventoid,
      fecha_hora: reserva.fecha_hora,
      estado: reserva.estado,
      cantidad_personas: reserva.cantidad_personas
    });
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta reserva?')) {
      try {
        await api.delete(`/reserva/${id}`);
        setMensaje('Reserva eliminada exitosamente');
        cargarReservas();
      } catch (error) {
        setMensaje('Error al eliminar la reserva');
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
          <h2>Reservas de Popayán Nocturna</h2>
          
          {mensaje && <div className="mensaje">{mensaje}</div>}

          <form onSubmit={handleSubmit} className="form-container">
            <div className="form-group">
              <input
                type="number"
                value={nuevaReserva.usuarioid}
                onChange={(e) => setNuevaReserva({...nuevaReserva, usuarioid: e.target.value})}
                placeholder="ID Usuario"
                required
              />
              <input
                type="number"
                value={nuevaReserva.eventoid}
                onChange={(e) => setNuevaReserva({...nuevaReserva, eventoid: e.target.value})}
                placeholder="ID Evento"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="datetime-local"
                value={nuevaReserva.fecha_hora}
                onChange={(e) => setNuevaReserva({...nuevaReserva, fecha_hora: e.target.value})}
                required
              />
              <input
                type="number"
                value={nuevaReserva.cantidad_personas}
                onChange={(e) => setNuevaReserva({...nuevaReserva, cantidad_personas: e.target.value})}
                placeholder="Cantidad de personas"
                required
              />
            </div>
            <button type="submit" className="btn-crear">
              {reservaEditar ? 'Actualizar' : 'Crear'} Reserva
            </button>
          </form>

          <div className="items-list">
            {reservas.map((reserva) => (
              <div key={reserva.id} className="item-card">
                <div className="item-header">
                  <span>Usuario #{reserva.usuarioid}</span>
                  <span>Evento #{reserva.eventoid}</span>
                </div>
                <div className="item-content">
                  <div className="item-details">
                    <span>👥 Personas: {reserva.cantidad_personas}</span>
                    <span>📅 {new Date(reserva.fecha_hora).toLocaleString()}</span>
                    <span>Estado: {reserva.estado ? '✅ Activa' : '❌ Cancelada'}</span>
                  </div>
                </div>
                <div className="item-footer">
                  <div className="item-actions">
                    <button onClick={() => handleEditar(reserva)}>Editar</button>
                    <button onClick={() => handleEliminar(reserva.id)}>Eliminar</button>
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

export default Reservas;
