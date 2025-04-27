import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSearch, FaEdit, FaTrash, FaImage, FaPlus } from 'react-icons/fa';
import './styles/CategoriasSuper.css';

const CategoriasSuper = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [formData, setFormData] = useState({
    tipo: '',
    descripcion: '',
    estado: true
  });
  const [imagen, setImagen] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (!token || !usuario || (usuario.rol !== 1 && usuario.rol !== 2)) {
      setError('No tienes permisos para acceder a esta página');
      return;
    }

    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('https://popnocturna.vercel.app/api/categorias', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && Array.isArray(response.data)) {
        setCategorias(response.data);
      } else {
        setError('Formato de respuesta inválido');
      }
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      setError(error.response?.data?.mensaje || 'Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCategorias = categorias.filter(categoria =>
    categoria.tipo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    categoria.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (categoria) => {
    setSelectedCategoria(categoria);
    setFormData({
      tipo: categoria.tipo || '',
      descripcion: categoria.descripcion || '',
      estado: categoria.estado
    });
    setPreviewUrl(categoria.imagen || '');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://popnocturna.vercel.app/api/categoria/${id}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        toast.success('Categoría eliminada correctamente');
        fetchCategorias();
      } catch (error) {
        console.error('Error al eliminar:', error);
        toast.error(error.response?.data?.mensaje || 'Error al eliminar la categoría');
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      if (imagen) {
        formDataToSend.append('imagen', imagen);
      }

      let response;
      if (selectedCategoria) {
        response = await axios.put(`https://popnocturna.vercel.app/api/categoria/${selectedCategoria.id}`, formDataToSend, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Categoría actualizada correctamente');
      } else {
        response = await axios.post('https://popnocturna.vercel.app/api/categoria', formDataToSend, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Categoría creada correctamente');
      }

      setShowModal(false);
      fetchCategorias();
    } catch (error) {
      console.error('Error al guardar:', error);
      toast.error(error.response?.data?.mensaje || 'Error al guardar la categoría');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleToggleEstado = async (id, estadoActual) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`https://popnocturna.vercel.app/api/categoria/estado/${id}`, {
        estado: !estadoActual
      }, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      toast.success('Estado de la categoría actualizado');
      fetchCategorias();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      toast.error(error.response?.data?.mensaje || 'Error al cambiar el estado de la categoría');
    }
  };

  if (loading) return <div className="categorias-loading">Cargando categorías...</div>;
  if (error) return <div className="categorias-alert categorias-alert-error">{error}</div>;

  return (
    <div className="categorias-container">
      <div className="categorias-header">
        <h1 className="categorias-title">Gestión de Categorías</h1>
        <div className="categorias-header-actions">
          <button 
            className="categorias-btn categorias-btn-primary"
            onClick={() => {
              setSelectedCategoria(null);
              setFormData({
                tipo: '',
                descripcion: '',
                estado: true
              });
              setImagen(null);
              setPreviewUrl('');
              setShowModal(true);
            }}
          >
            <FaPlus /> Nueva Categoría
          </button>
        </div>
      </div>

      <div className="categorias-search-container">
        <div className="categorias-search">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="categorias-form-input"
            placeholder="Buscar categorías..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="categorias-table-container">
        <table className="categorias-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategorias.length === 0 ? (
              <tr>
                <td colSpan="5" className="categorias-no-data">
                  No hay categorías disponibles
                </td>
              </tr>
            ) : (
              filteredCategorias.map(categoria => (
                <tr key={categoria.id}>
                  <td>
                    <div className="categoria-imagen">
                      {categoria.imagen ? (
                        <img src={categoria.imagen} alt={categoria.tipo} />
                      ) : (
                        <div className="no-imagen">
                          <FaImage />
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="categoria-info">
                      <h3>{categoria.tipo}</h3>
                    </div>
                  </td>
                  <td>{categoria.descripcion || 'Sin descripción'}</td>
                  <td>
                    <div className="categoria-status-column">
                      <span className={`categoria-status-badge ${categoria.estado ? 'active' : 'inactive'}`}>
                        {categoria.estado ? 'Activo' : 'Inactivo'}
                      </span>
                      <label className="categoria-switch">
                        <input
                          type="checkbox"
                          checked={categoria.estado}
                          onChange={() => handleToggleEstado(categoria.id, categoria.estado)}
                        />
                        <span className="categoria-slider"></span>
                      </label>
                    </div>
                  </td>
                  <td>
                    <div className="categorias-actions">
                      <button
                        className="categorias-btn categorias-btn-secondary"
                        onClick={() => handleEdit(categoria)}
                        title="Editar categoría"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="categorias-btn categorias-btn-danger"
                        onClick={() => handleDelete(categoria.id)}
                        title="Eliminar categoría"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="categorias-modal">
          <div className="categorias-modal-content">
            <h2>{selectedCategoria ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="categorias-form-group">
                <label htmlFor="tipo">Nombre</label>
                <input
                  type="text"
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  required
                  className="categorias-form-input"
                />
              </div>
              <div className="categorias-form-group">
                <label htmlFor="descripcion">Descripción</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  className="categorias-form-input"
                />
              </div>
              <div className="categorias-form-group">
                <label htmlFor="imagen">Imagen</label>
                <input
                  type="file"
                  id="imagen"
                  accept="image/*"
                  onChange={handleImageChange}
                  required={!selectedCategoria}
                  className="categorias-form-input"
                />
                {previewUrl && (
                  <div className="categorias-image-preview">
                    <img src={previewUrl} alt="Preview" />
                  </div>
                )}
              </div>
              <div className="categorias-form-group">
                <label>
                  <input
                    type="checkbox"
                    name="estado"
                    checked={formData.estado}
                    onChange={handleChange}
                  />
                  Activo
                </label>
              </div>
              <div className="categorias-modal-actions">
                <button
                  type="button"
                  className="categorias-btn categorias-btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="categorias-btn categorias-btn-primary"
                >
                  {selectedCategoria ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriasSuper;
