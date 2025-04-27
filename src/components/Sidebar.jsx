import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate('/login');
  };

<<<<<<< HEAD
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>PopNocturna</h3>
      </div>
=======
  // Mostrar botón solo en LugarDetalle (ruta real: /propietario/lugar/:id)
  const showVolverLugares = /\/propietario\/lugar\//i.test(location.pathname);

  return (
    <div className="sidebar">
      {/* <div className="sidebar-header">
        <h3>PopNocturna</h3>
      </div> */}
>>>>>>> 4c6738033daad045332ce1cc617753bbd4797571
      <div className="sidebar-menu">
        <button 
          className={`sidebar-button ${isActive('/propietario/dashboard') ? 'active' : ''}`}
          onClick={() => navigate('/propietario/dashboard')}
        >
          <span className="emoji">🏠</span> Inicio
        </button>
        <button 
          className={`sidebar-button ${isActive('/propietario/lugares') ? 'active' : ''}`}
          onClick={() => navigate('/propietario/lugares')}
        >
          <span className="emoji">📍</span> Lugares
        </button>
        <button 
          className={`sidebar-button ${isActive('/propietario/eventos') ? 'active' : ''}`}
          onClick={() => navigate('/propietario/eventos')}
        >
          <span className="emoji">🎉</span> Eventos
        </button>
        <button 
          className={`sidebar-button ${isActive('/propietario/reservas') ? 'active' : ''}`}
          onClick={() => navigate('/propietario/reservas')}
        >
          <span className="emoji">📅</span> Reservas
        </button>
        <button 
          className={`sidebar-button ${isActive('/propietario/comentarios') ? 'active' : ''}`}
          onClick={() => navigate('/propietario/comentarios')}
        >
          <span className="emoji">💬</span> Comentarios
        </button>
        <button 
          className={`sidebar-button ${isActive('/propietario/calificaciones') ? 'active' : ''}`}
          onClick={() => navigate('/propietario/calificaciones')}
        >
          <span className="emoji">⭐</span> Calificaciones
        </button>
<<<<<<< HEAD
=======
        {showVolverLugares && (
          <button
            className="sidebar-button sidebar-volver-lugares"
            style={{
              background: 'linear-gradient(90deg, #ff512f 0%, #dd2476 100%)', // degradado naranja-rosado
              color: '#fff',
              borderRadius: '30px',
              fontWeight: 'bold',
              marginTop: '15px',
              marginBottom: '5px',
              boxShadow: '0 4px 16px rgba(221,36,118,0.18)',
              border: '2px solid #fff',
              letterSpacing: '1px',
              fontSize: '1.08rem',
              transition: 'background 0.2s, transform 0.15s',
              outline: 'none',
              textShadow: '0 2px 8px rgba(0,0,0,0.10)',
            }}
            onClick={() => navigate('/propietario/lugares')}
            onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #ff512f 0%, #f09819 100%)'}
            onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #ff512f 0%, #dd2476 100%)'}
          >
            Volver a lugares
          </button>
        )}
>>>>>>> 4c6738033daad045332ce1cc617753bbd4797571
      </div>
      <div className="logout-container">
        <button className="logout-btn" onClick={handleLogout}>
          <span className="emoji">🚪</span> Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
