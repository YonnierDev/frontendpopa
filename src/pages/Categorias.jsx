import React, { useState, useEffect } from 'react';
import { api } from "./api/api";
import { useNavigate } from 'react-router-dom';
import './Categorias.css';
import Sidebar from '../components/Sidebar';

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState({
    tipo: ''
  });
  const [categoriaEditar, setCategoriaEditar] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const response = await api.get("/categorias");
      console.log('Categorías cargadas:', response.data);
      setCategorias(response.data);
    } catch (error) {
      console.error("Error detallado:", error.response || error);
      setMensaje('Error al cargar las categorías: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (categoriaEditar) {
        await api.put(`/categoria/${categoriaEditar.id}`, nuevaCategoria);
        setMensaje('Categoría actualizada exitosamente');
      } else {
        await api.post("/categoria", nuevaCategoria);
        setMensaje('Categoría creada exitosamente');
      }
      setNuevaCategoria({ tipo: '' });
      setCategoriaEditar(null);
      cargarCategorias();
    } catch (error) {
      setMensaje('Error al procesar la categoría');
      console.error("Error:", error);
    }
  };

  const handleEditar = (categoria) => {
    setCategoriaEditar(categoria);
    setNuevaCategoria({ tipo: categoria.tipo });
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta categoría?')) {
      try {
        await api.delete(`/categoria/${id}`);
        setMensaje('Categoría eliminada exitosamente');
        cargarCategorias();
      } catch (error) {
        setMensaje('Error al eliminar la categoría');
        console.error("Error:", error);
      }
    }
  };

  return (
    <>
      <Sidebar />
      <div className="app-container">
        <div className="header">
          <button className="cerrar-sesion" onClick={() => navigate('/login')}>
            Cerrar sesión
          </button>
        </div>

        <div className="main-content">
          <h2>Categorías de Popayán Nocturna</h2>
          
          {mensaje && <div className="mensaje">{mensaje}</div>}

          <form onSubmit={handleSubmit} className="form-container">
            <div className="form-group">
              <input
                type="text"
                value={nuevaCategoria.tipo}
                onChange={(e) => setNuevaCategoria({ tipo: e.target.value })}
                placeholder="Nombre de la categoría"
                required
              />
            </div>
            <button type="submit" className="btn-crear">
              {categoriaEditar ? 'Actualizar' : 'Crear'} Categoría
            </button>
          </form>

          <div className="items-list">
            {categorias.map((categoria) => (
              <div key={categoria.id} className="item-card">
                <div className="item-content">
                  <h3>{categoria.tipo}</h3>
                  <p className="item-details">
                    <span>Creado: {new Date(categoria.createdAt).toLocaleDateString()}</span>
                    <span>Actualizado: {new Date(categoria.updatedAt).toLocaleDateString()}</span>
                  </p>
                </div>
                <div className="item-actions">
                  <button onClick={() => handleEditar(categoria)}>Editar</button>
                  <button onClick={() => handleEliminar(categoria.id)}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Categorias; 