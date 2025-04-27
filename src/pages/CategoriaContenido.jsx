import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LugarCard from '../components/LugarCard';
import { api } from '../components/api/api';
import '../components/LugaresGrid.css';

const categoriasMap = {
  'canchas-sinteticas': 'Canchas Sintéticas',
  'discotecas': 'Discotecas',
  'restaurantes': 'Restaurantes',
  'comidas-rapidas': 'Comidas Rápidas',
  'acampar-gampling': 'Acampar-Gampling',
  'bares': 'Bares',
};

const categoriasApiMap = {
  'canchas-sinteticas': 'Canchas Sintéticas',
  'discotecas': 'Discotecas',
  'restaurantes': 'Restaurantes',
  'comidas-rapidas': 'Comidas Rápidas',
  'acampar-gampling': 'Acampar-Gampling',
  'bares': 'Bares',
};

const CategoriaContenido = () => {
  const { categoria } = useParams();
  const [lugares, setLugares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLugares = async () => {
      try {
        setLoading(true);
        setError('');
        // Buscar por nombre de categoría exacta
        const nombreCategoria = categoriasApiMap[categoria] || categoria;
        const response = await api.get(`/lugares?categoria_nombre=${encodeURIComponent(nombreCategoria)}`);
        setLugares(response.data);
      } catch (err) {
        setError('Error al cargar los lugares de esta categoría');
      } finally {
        setLoading(false);
      }
    };
    fetchLugares();
  }, [categoria]);

  if (loading) return <div style={{textAlign:'center',padding:'40px'}}>Cargando...</div>;
  if (error) return <div style={{color:'red',textAlign:'center',padding:'40px'}}>{error}</div>;

  return (
    <div style={{padding:'32px'}}>
      <h2 style={{textAlign:'center',marginBottom:'32px'}}>
        {categoriasApiMap[categoria] || categoria}
      </h2>
      <div className="lugares-grid">
        {lugares.length > 0 ? lugares.map((lugar, idx) => (
          <LugarCard key={lugar.id || idx} lugar={{
            nombre: lugar.nombre,
            ubicacion: lugar.ubicacion,
            precio: lugar.precio || 'N/A',
            rating: lugar.calificacion_promedio || 0,
            imagen: lugar.imagen || 'https://a0.muscache.com/im/pictures/airbnb1.jpg',
          }} />
        )) : <div style={{gridColumn:'1/-1',textAlign:'center'}}>No hay lugares en esta categoría.</div>}
      </div>
    </div>
  );
};

export default CategoriaContenido;
