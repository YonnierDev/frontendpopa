import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';
import { FaArrowLeft } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

const Sidebar = ({ lugarId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar">
      {/* <div className="sidebar-header">
        <h3>PopNocturna</h3>
      </div> */}
      <div className="sidebar-menu">
        
        <button 
          className={`sidebar-button ${isActive(`/propietario/eventos/${lugarId}`) ? 'active' : ''}`}
          onClick={() => navigate(`/propietario/eventos/${lugarId}`)}
        >
          <span className="emoji">🎉</span> Eventos
        </button>
        <button 
          className={`sidebar-button ${isActive(`/propietario/reservas/${lugarId}`) ? 'active' : ''}`}
          onClick={() => navigate(`/propietario/reservas/${lugarId}`)}
        >
          <span className="emoji">📅</span> Reservas
        </button>
        <button 
          className={`sidebar-button ${isActive(`/propietario/comentarios/${lugarId}`) ? 'active' : ''}`}
          onClick={() => navigate(`/propietario/comentarios/${lugarId}`)}
        >
          <span className="emoji">💬</span> Comentarios
        </button>
        <button 
          className={`sidebar-button ${isActive(`/propietario/calificaciones/${lugarId}`) ? 'active' : ''}`}
          onClick={() => navigate(`/propietario/calificaciones/${lugarId}`)}
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
    </div>
  );
};

export default Sidebar;
