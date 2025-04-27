import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar, FaComments } from 'react-icons/fa';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalLugares: 0,
    promedioCalificacion: 0,
    totalComentarios: 0,
    lugares: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const API_URL = 'https://popnocturna.vercel.app/api';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_URL}/propietario/dashboard`, {
          headers: {
            'Authorization': `Bearer ${usuario.token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al cargar las estadísticas');
        }

        const data = await response.json();
        setStats(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [usuario.token]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="dashboard-content">
      <h1>Bienvenido, {usuario.nombre}</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total de Lugares</h3>
          <div className="stat-value">{stats.totalLugares}</div>
        </div>
        <div className="stat-card">
          <h3>Calificación Promedio</h3>
          <div className="stat-value">
            <FaStar className="icon" />
            {stats.promedioCalificacion.toFixed(1)}
          </div>
        </div>
        <div className="stat-card">
          <h3>Total de Comentarios</h3>
          <div className="stat-value">
            <FaComments className="icon" />
            {stats.totalComentarios}
          </div>
        </div>
      </div>

      <h2>Mis Lugares</h2>
      <div className="lugares-grid">
        {stats.lugares.map(lugar => (
          <div key={lugar.id} className="lugar-card" onClick={() => navigate(`/propietario/lugares/${lugar.id}`)}>
            <div className="lugar-image">
              <img src={lugar.imagen || '/placeholder.jpg'} alt={lugar.nombre} />
            </div>
            <div className="lugar-info">
              <h3>{lugar.nombre}</h3>
              <p>
                <FaMapMarkerAlt /> {lugar.ubicacion}
              </p>
              <div className="lugar-stats">
                <span><FaStar /> {lugar.calificacion_promedio.toFixed(1)}</span>
                <span><FaComments /> {lugar.total_comentarios}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
