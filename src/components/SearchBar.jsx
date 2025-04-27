import React from 'react';
import './SearchBar.css';

const SearchBar = () => (
  <div className="search-bar">
    <input type="text" placeholder="¿Dónde? Explora destinos" className="search-input" />
    <input type="date" className="search-input" />
    <input type="date" className="search-input" />
    <input type="number" placeholder="¿Cuántos?" min="1" className="search-input" />
    <button className="search-btn">Buscar</button>
  </div>
);

export default SearchBar;
