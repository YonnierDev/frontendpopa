import React, { useState, useEffect } from 'react';
import { api } from "../../components/api/api";
import { useNavigate } from 'react-router-dom';
import './Reservas.css';
import Sidebar from '../../components/Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Reservas = () => {
  const [reservas, setReservas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    cargarReservas();
  }, []);

  const cargarReservas = async () => {
    try {
      setCargando(true);
      const response = await api.get("/reservasdetalle");
      setReservas(response.data);
    } catch (error) {
      console.error("Error al cargar reservas:", error);
      toast.error('Error al cargar las reservas');
    } finally {
      setCargando(false);
    }
  };

  const handleAprobarReserva = async (numeroReserva, aprobacion) => {
    try {
      await api.patch(`/reserva/aprobar/${numeroReserva}`, { aprobacion: aprobacion.toLowerCase() });
      toast.success(`Reserva ${aprobacion.toLowerCase()}`);
      cargarReservas();
    } catch (error) {
      console.error('Error al actualizar la reserva:', error);
      toast.error('Error al actualizar el estado de la reserva');
    }
  };

  const filtrarReservas = () => {
    return reservas.filter(reserva =>
      reserva.usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      reserva.evento.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      reserva.evento.lugar.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
  };

  const getAprobacionBadgeClass = (aprobacion) => {
    switch (aprobacion.toLowerCase()) {
      case 'aceptado':
        return 'badge bg-success';
      case 'rechazado':
        return 'badge bg-danger';
      default:
        return 'badge bg-warning';
    }
  };

  return (
    <div className="reservas-container">
      <Sidebar />
      <div className="content-container">
        <h1>Gestión de Reservas</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar por usuario, evento o lugar..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="table-container">
          {cargando ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>N° Reserva</th>
                  <th>Usuario</th>
                  <th>Evento</th>
                  <th>Lugar</th>
                  <th>Fecha Reserva</th>
                  <th>Fecha Evento</th>
                  <th>Estado Reserva</th>
                  <th>Estado Evento</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrarReservas().map((reserva) => (
                  <tr key={reserva.numero_reserva}>
                    <td>{reserva.numero_reserva}</td>
                    <td>
                      <div>
                        <div>{reserva.usuario.nombre}</div>
                        <small className="text-muted">{reserva.usuario.correo}</small>
                      </div>
                    </td>
                    <td>{reserva.evento.nombre}</td>
                    <td>{reserva.evento.lugar.nombre}</td>
                    <td>{new Date(reserva.fecha_hora).toLocaleString()}</td>
                    <td>{new Date(reserva.evento.fecha_hora).toLocaleString()}</td>
                    <td>
                      <span className={getAprobacionBadgeClass(reserva.aprobacion)}>
                        {reserva.aprobacion}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${reserva.estado ? 'bg-primary' : 'bg-secondary'}`}>
                        {reserva.estado ? 'Evento Activo' : 'Evento Finalizado'}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleAprobarReserva(reserva.numero_reserva, 'Aceptado')}
                          disabled={reserva.aprobacion.toLowerCase() === 'aceptado'}
                        >
                          Aceptar
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleAprobarReserva(reserva.numero_reserva, 'Rechazado')}
                          disabled={reserva.aprobacion.toLowerCase() === 'rechazado'}
                        >
                          Rechazar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <ToastContainer position="bottom-right" />
      </div>
    </div>
  );
};

export default Reservas;
