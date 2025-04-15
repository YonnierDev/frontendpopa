import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import './DashboardPropietario.css';
import { useNavigate } from 'react-router-dom'; // ✅ Importado

const DashboardPropietario = () => {
  const [lugares, setLugares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_URL = 'https://popnocturna.vercel.app/api';
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const navigate = useNavigate(); // ✅ Inicializado

  useEffect(() => {
    const obtenerLugaresDelPropietario = async () => {
      try {
        const response = await fetch(`${API_URL}/lugares`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('No se pudo obtener los lugares');
        }

        const data = await response.json();

        const lugaresPropietario = data.filter(lugar => lugar.usuarioid === usuario.usuarioId);
        setLugares(lugaresPropietario);
      } catch (error) {
        console.error('Error al obtener los lugares:', error);
        setError('Error al cargar los lugares: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    if (usuario?.usuarioId) {
      obtenerLugaresDelPropietario();
    }
  }, [usuario?.usuarioId, token]);

  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-content">
          <div className="loading">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <h2>Bienvenido, {usuario?.nombre || 'Propietario'}</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>🗺️ Lugares Totales</h3>
            <p>{lugares.length}</p>
          </div>
          <div className="stat-card">
            <h3>⭐ Promedio Calificación</h3>
            <p>
              {lugares.length > 0
                ? (
                    lugares.reduce((acc, lugar) => acc + (lugar.calificacion_promedio || 0), 0) / lugares.length
                  ).toFixed(1)
                : 'N/A'}
            </p>
          </div>
          <div className="stat-card">
            <h3>💬 Total Comentarios</h3>
            <p>
              {lugares.reduce((acc, lugar) => acc + (lugar.total_comentarios || 0), 0)}
            </p>
          </div>
        </div>

        <div className="lugares-resumen">
          <h3>Mis Lugares</h3>
          <div className="lugares-lista">
            {lugares.map((lugar) => (
              <div
                key={lugar.id}
                className="lugar-card"
                onClick={() => navigate(`/propietario/lugar/${lugar.id}`)} // ✅ Navegación agregada
                style={{ cursor: 'pointer' }} // ✅ Mejora visual para saber que es clickeable
              >
                <div className="lugar-info">
                  <h4>{lugar.nombre}</h4>
                  <p>📍 {lugar.ubicacion}</p>
                  <p>{lugar.descripcion}</p>
                  <p>⭐ {lugar.calificacion_promedio?.toFixed(1) || 'N/A'} | 💬 {lugar.total_comentarios || 0}</p>
                </div>
                {lugar.imagen && (
                  <img src={lugar.imagen} alt={lugar.nombre} className="lugar-imagen" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPropietario;
