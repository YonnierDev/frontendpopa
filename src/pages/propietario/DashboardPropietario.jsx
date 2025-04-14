import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import './DashboardPropietario.css';
import { FaMapMarkerAlt, FaComments, FaCalendarAlt, FaClock, FaTicketAlt } from 'react-icons/fa';

const DashboardPropietario = () => {
  const [lugares, setLugares] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        console.log('Usuario actual:', usuario);
        
        if (!usuario) {
          console.log('No hay usuario, redirigiendo a login');
          navigate('/login');
          return;
        }

        const [lugaresRes, eventosRes, reservasRes] = await Promise.all([
          fetch(`https://popnocturna.vercel.app/api/lugares?usuarioid=${usuario.usuarioId}`),
          fetch(`https://popnocturna.vercel.app/api/eventos?usuarioid=${usuario.usuarioId}`),
          fetch(`https://popnocturna.vercel.app/api/reservas?usuarioid=${usuario.usuarioId}`)
        ]);

        if (!lugaresRes.ok) throw new Error(`Error al cargar lugares: ${lugaresRes.status}`);
        if (!eventosRes.ok) throw new Error(`Error al cargar eventos: ${eventosRes.status}`);
        if (!reservasRes.ok) throw new Error(`Error al cargar reservas: ${reservasRes.status}`);

        const [lugaresData, eventosData, reservasData] = await Promise.all([
          lugaresRes.json(),
          eventosRes.json(),
          reservasRes.json()
        ]);

        // Asignar eventos a cada lugar
        const lugaresConEventos = lugaresData.map(lugar => ({
          ...lugar,
          eventos: eventosData.filter(evento => evento.lugarId === lugar.id)
        }));

        console.log('Lugares con eventos:', lugaresConEventos);
        setLugares(lugaresConEventos);
        setEventos(eventosData);
        setReservas(reservasData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [navigate]);

  const handleLugarClick = (lugarId) => {
    if (!lugarId) {
      console.error('ID de lugar no válido:', lugarId);
      return;
    }
    console.log('Navegando a lugar con ID:', lugarId);
    navigate(`/propietario/lugar/${lugarId}`);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-content">
          <div className="loading">Cargando datos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <section className="welcome-section">
          <h2>Bienvenido a tu Dashboard</h2>
          <p>Administra tus lugares, eventos y reservas desde aquí</p>
        </section>

        <div className="stats">
          <div className="stat-item">
            <h4>Lugares</h4>
            <div className="stat-number">{lugares.length}</div>
          </div>
          <div className="stat-item">
            <h4>Eventos</h4>
            <div className="stat-number">{eventos.length}</div>
          </div>
          <div className="stat-item">
            <h4>Reservas</h4>
            <div className="stat-number">{reservas.length}</div>
          </div>
        </div>

        <h3>Tus Lugares</h3>
        {lugares.length > 0 ? (
          <div className="lugares-grid">
            {lugares.map((lugar) => (
              <div
                key={lugar.id}
                className="lugar-card"
                onClick={() => handleLugarClick(lugar.id)}
              >
                <div className="lugar-imagen">
                  {lugar.imagen ? (
                    <img 
                      src={lugar.imagen} 
                      alt={lugar.nombre}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://res.cloudinary.com/popaimagen/image/upload/v1744615116/default-place.jpg';
                      }}
                    />
                  ) : (
                    <img 
                      src="https://res.cloudinary.com/popaimagen/image/upload/v1744615116/default-place.jpg" 
                      alt="Imagen por defecto"
                    />
                  )}
                </div>
                <div className="lugar-info">
                  <h3>{lugar.nombre}</h3>
                  <div className="ubicacion">
                    <FaMapMarkerAlt />
                    {lugar.ubicacion}
                  </div>
                  <p className="descripcion">{lugar.descripcion}</p>
                  <div className="lugar-stats">
                    <span>
                      <FaComments />
                      {lugar.comentarios?.length || 0} comentarios
                    </span>
                    <span>
                      <FaCalendarAlt />
                      {lugar.eventos?.length || 0} eventos
                    </span>
                  </div>
                  {lugar.eventos && lugar.eventos.length > 0 ? (
                    <div className="eventos-lista">
                      <h4>
                        <FaCalendarAlt />
                        Próximos Eventos ({lugar.eventos.length})
                      </h4>
                      {lugar.eventos.map((evento, index) => (
                        <div key={index} className="evento-item">
                          <h5>
                            <FaTicketAlt />
                            {evento.nombre}
                          </h5>
                          <div className="evento-detalles">
                            <span>
                              <FaCalendarAlt />
                              {new Date(evento.fecha).toLocaleDateString('es-ES', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short'
                              })}
                            </span>
                            <span>
                              <FaClock />
                              {evento.hora}
                            </span>
                            <span>
                              <FaTicketAlt />
                              ${evento.precio}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="eventos-lista">
                      <h4>
                        <FaCalendarAlt />
                        No hay eventos programados
                      </h4>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-lugares">
            <p>Aún no tienes lugares registrados</p>
            <button
              className="btn-crear-lugar"
              onClick={() => navigate('/crear-lugar')}
            >
              Crear Nuevo Lugar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPropietario;
