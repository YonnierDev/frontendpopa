import React, { useState, useEffect } from 'react';
import { api } from "../../components/api/api"; 
import { useNavigate } from 'react-router-dom';
import './Reservas.css';
import Sidebar from '../../components/Sidebar';

const Reservas = () => {
  const [reservas, setReservas] = useState([]);
  const [nuevaReserva, setNuevaReserva] = useState({
    usuarioid: '',
    eventoid: '',
    fecha_hora: new Date().toISOString().slice(0, 16),
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
      const response = await api.get("/reservas"); // Ruta corregida
      setReservas(response.data);
    } catch (error) {
      console.error("Error al cargar reservas:", error);
      setMensaje('Error al cargar las reservas');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (reservaEditar) {
        await api.put(`/reserva/${reservaEditar.id}`, nuevaReserva); // Ruta corregida
        setMensaje('Reserva actualizada exitosamente');
      } else {
        await api.post("/reserva", nuevaReserva); // Ruta corregida
        setMensaje('Reserva creada exitosamente');
      }
      setNuevaReserva({
        usuarioid: '',
        eventoid: '',
        fecha_hora: new Date().toISOString().slice(0, 16),
        estado: true,
        cantidad_personas: ''
      });
      setReservaEditar(null);
      cargarReservas();
    } catch (error) {
      console.error("Error al enviar la reserva:", error);
      setMensaje('Error al procesar la reserva');
    }
  };

  const handleEditar = (reserva) => {
    setReservaEditar(reserva);
    setNuevaReserva({
      usuarioid: reserva.usuarioid,
      eventoid: reserva.eventoid,
      fecha_hora: reserva.fecha_hora.slice(0, 16),
      estado: reserva.estado,
      cantidad_personas: reserva.cantidad_personas
    });
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta reserva?')) {
      try {
        await api.delete(`/reserva/${id}`); // Ruta corregida
        setMensaje('Reserva eliminada exitosamente');
        cargarReservas();
      } catch (error) {
        console.error("Error al eliminar reserva:", error);
        setMensaje('Error al eliminar la reserva');
      }
    }
  };

  return (
    <>
      <Sidebar />
      <div className="app-container">
        <div className="main-content">
          <h2>Reservas de Popayán Nocturna</h2>

          {mensaje && <div className="mensaje">{mensaje}</div>}

          <form onSubmit={handleSubmit} className="form-container">
            <div className="form-group">
              <input
                type="number"
                value={nuevaReserva.usuarioid}
                onChange={(e) => setNuevaReserva({ ...nuevaReserva, usuarioid: e.target.value })}
                placeholder="ID Usuario"
                required
              />
              <input
                type="number"
                value={nuevaReserva.eventoid}
                onChange={(e) => setNuevaReserva({ ...nuevaReserva, eventoid: e.target.value })}
                placeholder="ID Evento"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="datetime-local"
                value={nuevaReserva.fecha_hora}
                onChange={(e) => setNuevaReserva({ ...nuevaReserva, fecha_hora: e.target.value })}
                required
              />
              <input
                type="number"
                value={nuevaReserva.cantidad_personas}
                onChange={(e) => setNuevaReserva({ ...nuevaReserva, cantidad_personas: e.target.value })}
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
