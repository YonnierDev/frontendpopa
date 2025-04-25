import React, { useState, useEffect } from 'react';
import { FaStar, FaBuilding } from 'react-icons/fa';

const Calificaciones = () => {
  const [calificaciones, setCalificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const API_URL = 'https://popnocturna.vercel.app/api';

  useEffect(() => {
    const fetchCalificaciones = async () => {
      try {
        const response = await fetch(`${API_URL}/propietario/calificaciones`, {
          headers: {
            'Authorization': `Bearer ${usuario.token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al cargar las calificaciones');
        }

        const data = await response.json();
        setCalificaciones(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCalificaciones();
  }, [usuario.token]);

  const renderStars = (cantidad) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={index < cantidad ? 'star-filled' : 'star-empty'}
      />
    ));
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="calificaciones-container">
      <h1>Calificaciones</h1>

      <div className="calificaciones-grid">
        {calificaciones.map(calificacion => (
          <div key={calificacion.id} className="calificacion-card">
            <div className="calificacion-header">
              <FaBuilding className="icon" />
              <h3>{calificacion.lugar_nombre}</h3>
            </div>

            <div className="calificacion-info">
              <div className="calificacion-promedio">
                <p>Calificación Promedio</p>
                <div className="stars">
                  {renderStars(calificacion.promedio)}
                  <span className="promedio-valor">
                    {calificacion.promedio.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="calificacion-stats">
                <div className="stat">
                  <span>Total de Calificaciones</span>
                  <strong>{calificacion.total_calificaciones}</strong>
                </div>
                <div className="stat">
                  <span>Mejor Calificación</span>
                  <strong>{calificacion.mejor_calificacion}</strong>
                </div>
                <div className="stat">
                  <span>Peor Calificación</span>
                  <strong>{calificacion.peor_calificacion}</strong>
                </div>
              </div>

              <div className="calificacion-distribucion">
                <h4>Distribución de Calificaciones</h4>
                {[5, 4, 3, 2, 1].map(estrellas => (
                  <div key={estrellas} className="distribucion-row">
                    <div className="stars-label">
                      {renderStars(estrellas)}
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress"
                        style={{
                          width: `${(calificacion.distribucion[estrellas] || 0) * 100}%`
                        }}
                      />
                    </div>
                    <span className="cantidad">
                      {calificacion.distribucion[estrellas] || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calificaciones;
