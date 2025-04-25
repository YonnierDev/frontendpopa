import React, { useState, useEffect } from 'react';
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
      </div>
    </div>
  );
};

export default Reservas;
