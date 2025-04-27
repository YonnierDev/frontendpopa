import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LugarCard.css';

const LugarCard = ({ lugar }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/lugar/${lugar.id}`);
  };

  return (
    <div className="lugar-card bonita" onClick={handleClick} style={{cursor:'pointer'}}>
      <div className="lugar-card-img-container">
        <img src={lugar.imagen} alt={lugar.nombre} className="lugar-img" />
        <div className="lugar-card-fav">
          <span className="lugar-card-heart">♡</span>
        </div>
      </div>
      <div className="lugar-info">
        <div className="lugar-card-header">
          <span className="lugar-card-location">{lugar.ubicacion}</span>
          <span className="lugar-card-rating">⭐ {lugar.rating}</span>
        </div>
        <h3 className="lugar-card-title">{lugar.nombre}</h3>
        <div className="lugar-card-footer">
          <span className="lugar-card-precio">{lugar.precio ? `$${Number(lugar.precio).toLocaleString()} COP` : ''}</span>
        </div>
      </div>
    </div>
  );
};

export default LugarCard;
