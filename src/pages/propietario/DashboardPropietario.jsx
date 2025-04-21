import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import './DashboardPropietario.css';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaCheckCircle, FaTimesCircle, FaStar, FaComments } from 'react-icons/fa';

const DashboardPropietario = () => {
  const [lugares, setLugares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_URL = 'https://popnocturna.vercel.app/api';
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerLugaresDelPropietario = async () => {
      try {
        if (!usuario || !usuario.token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`${API_URL}/propietario/lugares`, {
          headers: {
            'Authorization': `Bearer ${usuario.token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            navigate('/login');
            return;
          }
          throw new Error('No se pudo obtener los lugares');
        }

        const data = await response.json();
        console.log('Lugares obtenidos:', data);
        setLugares(data);
      } catch (error) {
        console.error('Error al obtener los lugares:', error);
        setError('Error al cargar los lugares: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    obtenerLugaresDelPropietario();
  }, [usuario, navigate]);

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

  const lugaresActivos = lugares.filter(lugar => lugar.estado).length;
  const lugaresPendientes = lugares.length - lugaresActivos;
  const promedioCalificacion = lugares.length > 0
    ? (lugares.reduce((acc, lugar) => acc + (lugar.calificacion_promedio || 0), 0) / lugares.length).toFixed(1)
    : 'N/A';
  const totalComentarios = lugares.reduce((acc, lugar) => acc + (lugar.total_comentarios || 0), 0);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2>Bienvenido, {usuario?.nombre || 'Propietario'}</h2>
        </div>

        {error && (
          <div className="error-message">
            <FaTimesCircle />
            {error}
          </div>
        )}

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>🏠 Lugares Totales</h3>
            <p>{lugares.length}</p>
            <div className="stat-detail">
              <span className="stat-active">✅ {lugaresActivos} activos</span>
              <span className="stat-pending">⏳ {lugaresPendientes} pendientes</span>
            </div>
          </div>
          <div className="stat-card">
            <h3>⭐ Promedio Calificación</h3>
            <p>{promedioCalificacion}</p>
          </div>
          <div className="stat-card">
            <h3>💬 Total Comentarios</h3>
            <p>{totalComentarios}</p>
          </div>
        </div>

        <div className="lugares-resumen">
          <h3>Mis Lugares</h3>
          <div className="lugares-lista">
            {lugares.length === 0 ? (
              <div className="no-lugares">
                No tienes lugares registrados aún. ¡Crea tu primer lugar!
              </div>
            ) : (
              lugares.map((lugar) => (
                <div
                  key={lugar.id}
                  className="lugar-card"
                  onClick={() => navigate(`/propietario/lugar/${lugar.id}`)}
                >
                  {lugar.imagen && (
                    <img src={lugar.imagen} alt={lugar.nombre} className="lugar-imagen" />
                  )}
                  <div className="lugar-info">
                    <h4>{lugar.nombre}</h4>
                    <p><FaMapMarkerAlt /> {lugar.ubicacion}</p>
                    <p className="lugar-descripcion">{lugar.descripcion}</p>
                    <p>
                      <FaStar /> {lugar.calificacion_promedio?.toFixed(1) || 'N/A'}
                      <span className="separador">•</span>
                      <FaComments /> {lugar.total_comentarios || 0}
                      <span className={`lugar-estado ${lugar.estado ? 'activo' : 'pendiente'}`}>
                        {lugar.estado ? (
                          <><FaCheckCircle /> Activo</>
                        ) : (
                          <><FaTimesCircle /> Pendiente</>
                        )}
                      </span>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPropietario;
