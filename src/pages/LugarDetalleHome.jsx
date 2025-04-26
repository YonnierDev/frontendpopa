import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './LugarDetalleHome.css';
import { FaMapMarkerAlt, FaStar, FaUser } from 'react-icons/fa';
import ComentarioCalificacionBox from './home/ComentarioCalificacionBox';

const LugarDetalleHome = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lugar, setLugar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const res = await fetch('https://popnocturna.vercel.app/api/lugares');
        if (!res.ok) throw new Error('Error al cargar los lugares');
        const data = await res.json();
        const encontrado = data.find(l => l.id === parseInt(id));
        if (!encontrado) throw new Error('Lugar no encontrado');
        setLugar(encontrado);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, [id]);

  if (loading) return <div className="lugar-detalle-home">Cargando...</div>;
  if (error) return <div className="lugar-detalle-home">{error}</div>;
  if (!lugar) return <div className="lugar-detalle-home">No se encontró el lugar</div>;

  return (
    <div className="lugar-detalle-home-airbnb">
      <div className="lugar-detalle-home-header">
        <h1>{lugar.nombre}</h1>
        <div className="lugar-detalle-home-meta">
          <span><FaStar/> {lugar.calificacion_promedio?.toFixed(1) || '0.0'}</span>
          <span><FaMapMarkerAlt/> {lugar.ubicacion}</span>
        </div>
      </div>
      <div className="lugar-detalle-home-img">
        <img src={lugar.imagen} alt={lugar.nombre} />
      </div>
      <div className="lugar-detalle-home-content">
        <div className="lugar-detalle-home-info">
          <h2>Descripción</h2>
          <div className="lugar-detalle-home-description-block">
            <span className="lugar-detalle-home-description-icon">📝</span>
            <blockquote>{lugar.descripcion}</blockquote>
          </div>
          <div className="lugar-detalle-home-tags-row">
            <span className={`lugar-detalle-home-badge categoria`}>{lugar.categoria?.tipo || 'No especificada'}</span>
            <span className={`lugar-detalle-home-badge estado-${lugar.estado ? 'activo' : 'inactivo'}`}>{lugar.estado ? 'Activo' : 'Inactivo'}</span>
          </div>
          <hr className="lugar-detalle-home-divider" />
          <div className="lugar-detalle-home-row">
            <div><strong>Propietario:</strong> <FaUser/> {lugar.usuario?.nombre || 'No especificado'}</div>
            <div><strong>Correo:</strong> {lugar.usuario?.correo || 'No especificado'}</div>
          </div>
        </div>
        <ComentarioCalificacionBox lugarId={lugar.id} />
        {lugar.eventos && lugar.eventos.length > 0 && (
          <div className="lugar-detalle-home-eventos">
            <h2>Próximos Eventos</h2>
            <ul>
              {lugar.eventos.map((evento, idx) => (
                <li key={idx}><strong>{evento.nombre}:</strong> {evento.descripcion}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default LugarDetalleHome;
