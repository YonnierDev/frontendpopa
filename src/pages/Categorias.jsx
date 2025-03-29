import React, { useState, useEffect } from 'react';
import { api } from "./api/api";
import { useNavigate } from 'react-router-dom';
import './Categorias.css';

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [categoriaEditar, setCategoriaEditar] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const response = await api.get("/categorias");
      setCategorias(response.data);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
      setMensaje('Error al cargar las categorías');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (categoriaEditar) {
        await api.put(`/categorias/${categoriaEditar.id}`, { tipo: nuevaCategoria });
        setMensaje('Categoría actualizada exitosamente');
      } else {
        await api.post("/categorias", { tipo: nuevaCategoria });
        setMensaje('Categoría creada exitosamente');
      }
      setNuevaCategoria('');
      setCategoriaEditar(null);
      cargarCategorias();
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
        await api.delete(`/categorias/${id}`);
        setMensaje('Categoría eliminada exitosamente');
        cargarCategorias();
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