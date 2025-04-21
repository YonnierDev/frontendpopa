import React from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaDollarSign, FaClock } from 'react-icons/fa';
import defaultLogo from '../../assets/logos.png';

const Card = ({ item, tipo = 'lugar', onClick }) => {
  const isEvento = tipo === 'evento';
  const isCategoria = tipo === 'categoria';

  // Formatear fecha para eventos
  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div 
      className="card shadow-sm h-100 rounded-4 overflow-hidden" 
      role="button" 
      onClick={onClick}
      style={{ width: '100%', maxWidth: '320px', cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* Imagen arriba */}
      <div style={{ position: 'relative' }}>
        <img
          src={item.imagen || defaultLogo}
          className="card-img-top"
          alt={item.nombre}
          style={{ height: '200px', objectFit: 'cover' }}
        />
        {/* Badge de tipo en la esquina */}
        <span className={`badge position-absolute top-0 start-0 m-2 ${isEvento ? 'bg-warning' : isCategoria ? 'bg-success' : 'bg-info'}`}>
          {isEvento ? 'Evento' : isCategoria ? item.tipo : 'Lugar'}
        </span>
      </div>

      {/* Cuerpo de la tarjeta */}
      <div className="card-body">
        <h5 className="card-title fw-bold mb-2">{isCategoria ? item.tipo : item.nombre}</h5>
        <p className="card-text text-muted small mb-3">{item.descripcion}</p>
        <div className="d-flex flex-column gap-2">
          {/* Ubicación (común para ambos) */}
          {item.ubicacion && (
            <div className="d-flex align-items-center gap-2">
              <FaMapMarkerAlt className="text-secondary" />
              <small>{item.ubicacion}</small>
            </div>
          )}

          {/* Campos específicos para eventos */}
          {isEvento && (
            <>
              <div className="d-flex align-items-center gap-2">
                <FaCalendarAlt className="text-secondary" />
                <small>{formatearFecha(item.fecha_hora)}</small>
              </div>
              {item.duracion && (
                <div className="d-flex align-items-center gap-2">
                  <FaClock className="text-secondary" />
                  <small>{item.duracion}</small>
                </div>
              )}
            </>
          )}

          {/* Campos comunes para ambos */}
          {item.capacidad && (
            <div className="d-flex align-items-center gap-2">
              <FaUsers className="text-secondary" />
              <small>Capacidad: {item.capacidad} personas</small>
            </div>
          )}

          {item.precio && (
            <div className="d-flex align-items-center gap-2">
              <FaDollarSign className="text-secondary" />
              <small>Precio: ${item.precio}</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;