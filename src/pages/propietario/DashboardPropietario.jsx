import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import './DashboardPropietario.css';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar, FaComments, FaBuilding } from 'react-icons/fa';

const DashboardPropietario = () => {
  const [lugares, setLugares] = useState([]);
  const [comentarios, setComentarios] = useState([]);
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
        setLugares(data);
      } catch (error) {
        setError('Error al cargar los lugares: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    obtenerLugaresDelPropietario();
    // Cargar comentarios reales con token
    const cargarComentarios = async () => {
      try {
        const response = await fetch(`${API_URL}/comentarios`, {
          headers: {
            'Authorization': `Bearer ${usuario.token}`
          }
        });
        if (!response.ok) throw new Error('No se pudo cargar comentarios');
        const data = await response.json();
        setComentarios(Array.isArray(data) ? data : []);
      } catch (error) {
        setComentarios([]);
      }
    };
    if (usuario && usuario.token) cargarComentarios();
  }, [usuario, navigate]);

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

  console.log('comentarios:', comentarios);
  console.log('lugares:', lugares);
  return (
    <div className="propietario-dashboard">
      <div className="propietario-content">
        {/* KPIs en fila horizontal */}
        <div className="propietario-kpis-row">
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
                      <span style={{ color: '#111', fontWeight: 600 }}>
                        <FaComments style={{ color: '#111', marginRight: 4 }} />
                        {comentarios.filter(c => c.lugar === lugar.id || c.lugar_id === lugar.id).length} comentario{comentarios.filter(c => c.lugar === lugar.id || c.lugar_id === lugar.id).length !== 1 ? 's' : ''}
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
