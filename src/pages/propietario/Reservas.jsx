import React, { useState, useEffect } from 'react';
import { api } from "../../components/api/api"; 
import { useNavigate } from 'react-router-dom';
import './Reservas.css';
import Sidebar from '../../components/Sidebar';

const Reservas = () => {
  const [reservas, setReservas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [lugares, setLugares] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    cargarReservas();
    cargarUsuarios();
    cargarEventos();
    cargarLugares();
  }, []);

  const cargarReservas = async () => {
    try {
      const response = await api.get("/reservas");
      setReservas(response.data);
    } catch (error) {
      console.error("Error al cargar reservas:", error);
      setMensaje('Error al cargar las reservas');
    }
  };

  const cargarUsuarios = async () => {
    try {
      const response = await api.get("/usuarios");
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  const cargarEventos = async () => {
    try {
      const response = await api.get("/eventos");
      setEventos(response.data);
    } catch (error) {
      console.error("Error al cargar eventos:", error);
    }
  };

  const cargarLugares = async () => {
    try {
      const response = await api.get("/lugares");
      setLugares(response.data);
    } catch (error) {
      console.error("Error al cargar lugares:", error);
    }
  };

  const filtrarReservas = () => {
    return reservas.filter(reserva =>
      obtenerNombreUsuario(reserva.usuarioid).toLowerCase().includes(busqueda.toLowerCase()) ||
      obtenerNombreEvento(reserva.eventoid).toLowerCase().includes(busqueda.toLowerCase())
    );
  };

  const obtenerNombreUsuario = (usuarioid) => {
    const usuario = usuarios.find(user => user.id === usuarioid);
    return usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Desconocido';
  };

  const obtenerNombreEvento = (eventoid) => {
    const evento = eventos.find(evento => evento.id === eventoid);
    return evento ? evento.nombre : 'Desconocido';
  };

  const obtenerLugarEvento = (eventoid) => {
    const evento = eventos.find(evento => evento.id === eventoid);
    const lugar = lugares.find(lugar => lugar.id === evento?.lugarid);
    return lugar ? lugar.nombre : 'Desconocido';
  };

  const handleAceptarReserva = async (id) => {
    try {
      await api.put(`/reserva/${id}`, { estado: true });
      setMensaje('Reserva aceptada exitosamente');
      cargarReservas();
    } catch (error) {
      console.error("Error al aceptar reserva:", error);
      setMensaje('Error al aceptar la reserva');
    }
  };

  const handleRechazarReserva = async (id) => {
    try {
      await api.put(`/reserva/${id}`, { estado: false });
      setMensaje('Reserva rechazada exitosamente');
      cargarReservas();
    } catch (error) {
      console.error("Error al rechazar reserva:", error);
      setMensaje('Error al rechazar la reserva');
    }
  };

  return (
    <>
      <Sidebar />
      <div className="app-container">
        <div className="main-content">
          <h2>Reservas de Popayán Nocturna</h2>

          {mensaje && <div className="mensaje">{mensaje}</div>}

          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por usuario o evento"
            className="buscador"
          />

          <div className="items-list">
            {filtrarReservas().map((reserva) => (
              <div key={reserva.id} className="item-card">
                <div className="item-header">
                  <span>Usuario: {obtenerNombreUsuario(reserva.usuarioid)}</span>
                  <span>Evento: {obtenerNombreEvento(reserva.eventoid)}</span>
                </div>
                <div className="item-content">
                  <div className="item-details">
                    <span>Lugar: {obtenerLugarEvento(reserva.eventoid)}</span>
                    <span>📅 {new Date(reserva.fecha_hora).toLocaleString()}</span>
                    <span>👥 Personas: {reserva.cantidad_personas}</span>
                  </div>
                </div>
                <div className="item-footer">
                  <div className="item-actions">
                    <button onClick={() => handleAceptarReserva(reserva.id)}>Aceptar</button>
                    <button onClick={() => handleRechazarReserva(reserva.id)}>Rechazar</button>
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
