import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import './DashboardPropietario.css';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar, FaComments, FaBuilding } from 'react-icons/fa';

const DashboardPropietario = () => {
  const [lugares, setLugares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_URL = 'https://popnocturna.vercel.app/api';
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerLugaresDelPropietario = async () => {
      try {
        if (!usuario || !token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`${API_URL}/propietario/lugares`, {
          headers: {
            'Authorization': `Bearer ${token}`
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
        setLugares(data);
      } catch (error) {
        setError('Error al cargar los lugares: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    obtenerLugaresDelPropietario();
  }, [usuario, token, navigate]);

  if (loading) {
    return (
      <div className="propietario-dashboard">
        <Sidebar />
        <div className="propietario-content">
          <div className="propietario-loading">Cargando...</div>
        </div>
      </div>
    );
  }

  const promedioCalificacion = lugares.length > 0
    ? (lugares.reduce((acc, lugar) => acc + (lugar.calificacion_promedio || 0), 0) / lugares.length).toFixed(1)
    : '0.0';
  const totalComentarios = lugares.reduce((acc, lugar) => acc + (lugar.total_comentarios || 0), 0);

  return (
    <div className="propietario-dashboard">
      <Sidebar />
      <div className="propietario-content">
        {/* Mensaje de bienvenida */}
        <div className="propietario-welcome">
          <h1>Bienvenido, {usuario?.nombre || 'Propietario'}</h1>
          <p>Gestiona tus lugares y revisa tus estadísticas</p>
        </div>

        {error && (
          <div className="propietario-error">
            {error}
          </div>
        )}

        {/* Estadísticas */}
        <div className="propietario-stats">
          <div className="propietario-stat-box">
            <div className="propietario-stat-icon">
              <FaBuilding />
            </div>
            <div className="propietario-stat-content">
              <h3>Lugares Registrados</h3>
              <p className="propietario-stat-value">{lugares.length}</p>
            </div>
          </div>

          <div className="propietario-stat-box">
            <div className="propietario-stat-icon">
              <FaStar />
            </div>
            <div className="propietario-stat-content">
              <h3>Calificación Promedio</h3>
              <p className="propietario-stat-value">{promedioCalificacion}</p>
            </div>
          </div>

          <div className="propietario-stat-box">
            <div className="propietario-stat-icon">
              <FaComments />
            </div>
            <div className="propietario-stat-content">
              <h3>Total de Comentarios</h3>
              <p className="propietario-stat-value">{totalComentarios}</p>
            </div>
          </div>
        </div>

        {/* Lista de lugares */}
        <div className="propietario-places">
          <h2>Mis Lugares</h2>
          <div className="propietario-places-grid">
            {lugares.length === 0 ? (
              <div className="propietario-no-places">
                No tienes lugares registrados aún
              </div>
            ) : (
              lugares.map((lugar) => (
                <div
                  key={lugar.id}
                  className="propietario-place-card"
                  onClick={() => navigate(`/propietario/lugar/${lugar.id}`)}
                >
                  <div className="propietario-place-image">
                    {lugar.imagen ? (
                      <img src={lugar.imagen} alt={lugar.nombre} />
                    ) : (
                      <div className="propietario-no-image">Sin imagen</div>
                    )}
                  </div>
                  <div className="propietario-place-info">
                    <h3>{lugar.nombre}</h3>
                    <p className="propietario-place-location">
                      <FaMapMarkerAlt />
                      {lugar.ubicacion}
                    </p>
                    <div className="propietario-place-stats">
                      <span>
                        <FaStar /> 
                        {lugar.calificacion_promedio?.toFixed(1) || '0.0'}
                      </span>
                      <span>
                        <FaComments />
                        {lugar.total_comentarios || 0} comentarios
                      </span>
                    </div>
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
