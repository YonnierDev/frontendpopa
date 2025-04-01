import React, { useState, useEffect } from 'react';
import { api } from "./api/api";
import { useNavigate } from 'react-router-dom';
import './Categorias.css';

const Categorias = () => {
  // Datos locales temporales
  const categoriasIniciales = [
    { id: 1, tipo: "Restaurantes" },
    { id: 2, tipo: "Parques" },
    { id: 3, tipo: "Museos" },
    { id: 4, tipo: "Hoteles" }
  ];

  const [categorias, setCategorias] = useState(categoriasIniciales);
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [categoriaEditar, setCategoriaEditar] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (categoriaEditar) {
        // Actualización local
        setCategorias(categorias.map(cat => 
          cat.id === categoriaEditar.id ? { ...cat, tipo: nuevaCategoria } : cat
        ));
        setMensaje('Categoría actualizada exitosamente');
      } else {
        // Creación local
        const nuevaCat = {
          id: categorias.length + 1,
          tipo: nuevaCategoria
        };
        setCategorias([...categorias, nuevaCat]);
        setMensaje('Categoría creada exitosamente');
      }
      setNuevaCategoria('');
      setCategoriaEditar(null);
    } catch (error) {
      setMensaje('Error al procesar la categoría');
      console.error("Error:", error);
    }
  };

  const handleEditar = (categoria) => {
    setCategoriaEditar(categoria);
    setNuevaCategoria(categoria.tipo);
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta categoría?')) {
      try {
        // Eliminación local
        setCategorias(categorias.filter(cat => cat.id !== id));
        setMensaje('Categoría eliminada exitosamente');
      } catch (error) {
        setMensaje('Error al eliminar la categoría');
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className="categorias-container">
      <div className="page-header">
        <h2>Gestión de Categorías</h2>
        <div className="navigation-buttons">
          <button 
            className="nav-button"
            onClick={() => navigate('/lugares')}
          >
            <span className="icon">📍</span>
            <span className="text">Gestionar Lugares</span>
          </button>
          <button 
            className="nav-button"
            onClick={() => navigate('/comentarios')}
          >
            <span className="icon">💬</span>
            <span className="text">Gestionar Comentarios</span>
          </button>
        </div>
      </div>
      
      <div className="content-section">
        {mensaje && <div className="mensaje">{mensaje}</div>}

        <form onSubmit={handleSubmit} className="categoria-form">
          <input
            type="text"
            value={nuevaCategoria}
            onChange={(e) => setNuevaCategoria(e.target.value)}
            placeholder="Nombre de la categoría"
            required
          />
          <button type="submit">
            {categoriaEditar ? 'Actualizar' : 'Crear'} Categoría
          </button>
        </form>

        <div className="categorias-lista">
          {categorias.map((categoria) => (
            <div key={categoria.id} className="categoria-item">
              <span>{categoria.tipo}</span>
              <div className="categoria-botones">
                <button onClick={() => handleEditar(categoria)}>Editar</button>
                <button onClick={() => handleEliminar(categoria.id)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categorias; 