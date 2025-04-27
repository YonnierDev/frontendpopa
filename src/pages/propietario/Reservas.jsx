import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { FaCheck, FaTimes, FaCalendar, FaClock } from 'react-icons/fa';

const Reservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const API_URL = 'https://popnocturna.vercel.app/api';

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const response = await fetch(`${API_URL}/propietario/reservas`, {
          headers: {
            'Authorization': `Bearer ${usuario.token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al cargar las reservas');
        }

        const data = await response.json();
        setReservas(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, [usuario.token]);

  const handleAprobarReserva = async (id) => {
    try {
      const response = await fetch(`${API_URL}/propietario/reservas/${id}/aprobar`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${usuario.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al aprobar la reserva');
      }

      setReservas(reservas.map(reserva => 
        reserva.id === id ? { ...reserva, estado: 'aprobada' } : reserva
      ));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRechazarReserva = async (id) => {
    try {
      const response = await fetch(`${API_URL}/propietario/reservas/${id}/rechazar`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${usuario.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al rechazar la reserva');
      }

      setReservas(reservas.map(reserva => 
        reserva.id === id ? { ...reserva, estado: 'rechazada' } : reserva
      ));
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="reservas-container">
      <h1>Reservas</h1>

      <div className="reservas-grid">
        {reservas.map(reserva => (
          <div key={reserva.id} className={`reserva-card estado-${reserva.estado}`}>
            <div className="reserva-info">
              <h3>Reserva #{reserva.id}</h3>
              <p className="lugar-nombre">{reserva.lugar_nombre}</p>
              <p>
                <FaCalendar /> {new Date(reserva.fecha).toLocaleDateString()}
              </p>
              <p>
                <FaClock /> {reserva.hora}
              </p>
              <p>Cliente: {reserva.cliente_nombre}</p>
              <p>Personas: {reserva.cantidad_personas}</p>
              <p className={`estado estado-${reserva.estado}`}>
                Estado: {reserva.estado}
              </p>
            </div>
            
            {reserva.estado === 'pendiente' && (
              <div className="reserva-actions">
                <button 
                  onClick={() => handleAprobarReserva(reserva.id)}
                  className="btn-aprobar"
                >
                  <FaCheck /> Aprobar
                </button>
                <button 
                  onClick={() => handleRechazarReserva(reserva.id)}
                  className="btn-rechazar"
                >
                  <FaTimes /> Rechazar
                </button>
              </div>
            )}
          </div>
        ))}
=======
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
>>>>>>> 4c6738033daad045332ce1cc617753bbd4797571
      </div>
    </div>
  );
};

export default Reservas;
