import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Popayán Nocturna</h3>
      </div>
      <div className="sidebar-menu">
        <button 
          className={`sidebar-button ${isActive('/dashboard') ? 'active' : ''}`}
          onClick={() => navigate('/dashboard')}
        >
          <span className="emoji">🏠</span> Dashboard
        </button>
        <button 
          className={`sidebar-button ${isActive('/categorias') ? 'active' : ''}`}
          onClick={() => navigate('/categorias')}
        >
          <span className="emoji">📝</span> Categorías
        </button>
        <button 
          className={`sidebar-button ${isActive('/lugares') ? 'active' : ''}`}
          onClick={() => navigate('/lugares')}
        >
          <span className="emoji">📍</span> Lugares
        </button>
        <button 
          className={`sidebar-button ${isActive('/comentarios') ? 'active' : ''}`}
          onClick={() => navigate('/comentarios')}
        >
          <span className="emoji">💬</span> Comentarios
        </button>
        <button 
          className={`sidebar-button ${isActive('/calificaciones') ? 'active' : ''}`}
          onClick={() => navigate('/calificaciones')}
        >
          <span className="emoji">⭐</span> Calificaciones
        </button>
        <button 
          className={`sidebar-button ${isActive('/eventos') ? 'active' : ''}`}
          onClick={() => navigate('/eventos')}
        >
          <span className="emoji">🎉</span> Eventos
        </button>
        <button 
          className={`sidebar-button ${isActive('/reservas') ? 'active' : ''}`}
          onClick={() => navigate('/reservas')}
        >
          <span className="emoji">📅</span> Reservas
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
