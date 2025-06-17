import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { api } from './api/api';
import './Sidebar.css';

const Sidebar = ({ lugarId: propLugarId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [lugares, setLugares] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Obtener el lugarId de la ruta actual
  const obtenerLugarIdDeRuta = () => {
    const match = location.pathname.match(/\/propietario\/\w+\/(\d+)/);
    return match ? match[1] : null;
  };

  // Verificar si la ruta actual coincide con el path
  const isActive = (path) => {
    // Si el path incluye un parámetro dinámico, solo verificamos la parte estática
    if (path.includes(':')) {
      const basePath = path.split('/:')[0];
      return location.pathname.startsWith(basePath);
    }
    return location.pathname.startsWith(path);
  };

  // Obtener los lugares del propietario
  useEffect(() => {
    const obtenerLugares = async () => {
      try {
        setCargando(true);
        const response = await api.get('/propietario/lugares');
        if (response.data && response.data.length > 0) {
          setLugares(response.data);
        } else {
          setError('No se encontraron lugares');
        }
      } catch (err) {
        console.error('Error al obtener los lugares:', err);
        setError('Error al cargar los lugares');
      } finally {
        setCargando(false);
      }
    };

    obtenerLugares();
  }, []);

  // Determinar el lugarId actual
  const lugarIdDeRuta = obtenerLugarIdDeRuta();
  const lugarIdActual = lugarIdDeRuta || propLugarId || (lugares.length > 0 ? lugares[0].id : null);

  // Si está cargando, mostrar un indicador
  if (cargando) {
    return (
      <div className="sidebar">
        <div className="sidebar-menu">
          <div className="sidebar-loading">Cargando lugares...</div>
        </div>
      </div>
    );
  }

  // Si hay un error, mostrarlo
  if (error) {
    return (
      <div className="sidebar">
        <div className="sidebar-menu">
          <div className="sidebar-error">{error}</div>
          <button 
            className="sidebar-button"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Si no hay lugares, mostrar mensaje
  if (lugares.length === 0) {
    return (
      <div className="sidebar">
        <div className="sidebar-menu">
          <div className="sidebar-info">No hay lugares registrados</div>
          <button 
            className="sidebar-button"
            onClick={() => navigate('/propietario/dashboard')}
          >
            <FaArrowLeft style={{marginRight:'8px'}}/>
            Volver al dashboard
          </button>
        </div>
      </div>
    );
  }

  // Función para manejar la navegación
  const handleNavigation = (basePath) => {
    if (!lugarIdActual) {
      console.error('No se pudo determinar el lugar actual');
      return;
    }

    // Rutas que necesitan el lugarId como parámetro
    const rutasConLugarId = [
      '/propietario/comentarios',
      '/propietario/calificaciones'
    ];

    // Rutas que necesitan el lugarId como query param
    const rutasConQueryParam = [
      '/propietario/eventos',
      '/propietario/reservas'
    ];

    let url = basePath;
    
    if (rutasConLugarId.some(ruta => basePath.startsWith(ruta))) {
      url = `${basePath}/${lugarIdActual}`;
    } else if (rutasConQueryParam.some(ruta => basePath.startsWith(ruta))) {
      const separator = basePath.includes('?') ? '&' : '?';
      url = `${basePath}${separator}lugarId=${lugarIdActual}`;
    }

    navigate(url);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-menu">
        <button 
          className={`sidebar-button ${isActive('/propietario/eventos') ? 'active' : ''}`}
          onClick={() => handleNavigation('/propietario/eventos')}
        >
          <span className="emoji">🎉</span> Eventos
        </button>
        <button 
          className={`sidebar-button ${isActive('/propietario/reservas') ? 'active' : ''}`}
          onClick={() => handleNavigation('/propietario/reservas')}
        >
          <span className="emoji">📅</span> Reservas
        </button>
        <button 
          className={`sidebar-button ${isActive('/propietario/comentarios') ? 'active' : ''}`}
          onClick={() => handleNavigation('/propietario/comentarios')}
        >
          <span className="emoji">💬</span> Comentarios
        </button>
        <button 
          className={`sidebar-button ${isActive('/propietario/calificaciones') ? 'active' : ''}`}
          onClick={() => handleNavigation('/propietario/calificaciones')}
        >
          <span className="emoji">⭐</span> Calificaciones
        </button>
        <button
          className="sidebar-button sidebar-volver-lugares"
          onClick={() => navigate('/propietario/dashboard')}
        >
          <span style={{display:'inline-flex',alignItems:'center'}}>
            <FaArrowLeft style={{marginRight:'8px'}}/>
            Volver a lugares
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
