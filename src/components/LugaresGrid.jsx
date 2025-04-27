import React, { useEffect, useState } from 'react';
import LugarCard from './LugarCard';
import './LugaresGrid.css';
import { api } from './api/api';

const LugaresGrid = () => {
  const [lugares, setLugares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLugares = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await api.get('/lugares');
        setLugares(response.data);
      } catch (err) {
        setError('Error al cargar los lugares');
      } finally {
        setLoading(false);
      }
    };
    fetchLugares();
  }, []);

  if (loading) return <div style={{textAlign:'center',padding:'40px'}}>Cargando lugares...</div>;
  if (error) return <div style={{color:'red',textAlign:'center',padding:'40px'}}>{error}</div>;

  return (
    <div className="lugares-grid">
      {lugares.map((lugar, idx) => (
        <LugarCard key={lugar.id || idx} lugar={{
          id: lugar.id,
          nombre: lugar.nombre,
          ubicacion: lugar.ubicacion,
          precio: lugar.precio || 'N/A',
          rating: lugar.calificacion_promedio || 0,
          imagen: lugar.imagen || 'https://a0.muscache.com/im/pictures/airbnb1.jpg',
        }} />
      ))}
    </div>
  );
};

export default LugaresGrid;
