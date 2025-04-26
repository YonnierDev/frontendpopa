import React from 'react';
import './CategoriesBar.css';
import { useNavigate } from 'react-router-dom';

const categories = [
  { icon: '🏟️', name: 'Canchas Sintéticas', path: '/categoria/canchas-sinteticas' },
  { icon: '🕺', name: 'Discotecas', path: '/categoria/discotecas' },
  { icon: '🍽️', name: 'Restaurantes', path: '/categoria/restaurantes' },
  { icon: '🍔', name: 'Comidas Rápidas', path: '/categoria/comidas-rapidas' },
  { icon: '🏕️', name: 'Acampar-Gampling', path: '/categoria/acampar-gampling' },
  { icon: '🍻', name: 'Bares', path: '/categoria/bares' },
];

const CategoriesBar = () => {
  const navigate = useNavigate();
  return (
    <div className="categories-bar">
      {categories.map((cat, idx) => (
        <div key={idx} className="category-item" onClick={() => navigate(cat.path)}>
          <span className="category-icon">{cat.icon}</span>
          <span className="category-name">{cat.name}</span>
        </div>
      ))}
    </div>
  );
};

export default CategoriesBar;
