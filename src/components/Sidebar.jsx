import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';
import { FaArrowLeft } from 'react-icons/fa';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate('/login');
  };

  // Mostrar botón solo en LugarDetalle (ruta real: /propietario/lugar/:id)
  const showVolverLugares = /\/propietario\/lugar\//i.test(location.pathname);

  return (
    <div className="sidebar">
      {/* <div className="sidebar-header">
        <h3>PopNocturna</h3>
      </div> */}
      <div className="sidebar-menu">
        
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
        <button
          className="sidebar-button sidebar-volver-lugares"
          onClick={() => navigate('/propietario/dashboard')}
        >
          <span style={{display:'inline-flex',alignItems:'center'}}><FaArrowLeft style={{marginRight:'8px'}}/>Volver a lugares</span>
        </button>
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
