import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import './Lugares.css';

const Lugares = () => {
  const [lugares, setLugares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    ubicacion: '',
    categoriaid: '',
    imagen: null
  });
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const API_URL = 'https://popnocturna.vercel.app/api';

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Cargar lugares del propietario
        const lugaresResponse = await fetch(`${API_URL}/lugares`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const lugaresData = await lugaresResponse.json();
        // Filtrar lugares del propietario actual
        const lugaresPropietario = lugaresData.filter(lugar => lugar.usuarioid === usuario.usuarioId);
        setLugares(lugaresPropietario);

        // Cargar categorías
        const categoriasResponse = await fetch(`${API_URL}/categorias`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!categoriasResponse.ok) {
          throw new Error('Error al cargar las categorías');
        }

        const categoriasData = await categoriasResponse.json();
        console.log('Categorías recibidas:', categoriasData);
        setCategorias(categoriasData);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
        setError('Error al cargar los datos: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [usuario.usuarioId, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Archivo seleccionado:', {
        name: file.name,
        type: file.type,
        size: file.size
      });
      setFormData(prev => ({
        ...prev,
        imagen: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.imagen) {
      setError('La imagen es requerida');
      return;
    }

    try {
      // Verificar el tipo y tamaño de la imagen
      if (!formData.imagen.type.startsWith('image/')) {
        throw new Error('El archivo debe ser una imagen');
      }

      if (formData.imagen.size > 5 * 1024 * 1024) { // 5MB
        throw new Error('La imagen no debe superar los 5MB');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('usuarioid', usuario.usuarioId);
      formDataToSend.append('categoriaid', formData.categoriaid);
      formDataToSend.append('nombre', formData.nombre);
      formDataToSend.append('descripcion', formData.descripcion);
      formDataToSend.append('ubicacion', formData.ubicacion);
      formDataToSend.append('imagen', formData.imagen);

      console.log('Datos del formulario:', {
        usuarioid: usuario.usuarioId,
        categoriaid: formData.categoriaid,
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        ubicacion: formData.ubicacion,
        imagen: {
          name: formData.imagen.name,
          type: formData.imagen.type,
          size: formData.imagen.size
        }
      });

      const response = await fetch(`${API_URL}/lugar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (error) {
        console.error('Error al parsear la respuesta:', error);
        throw new Error('Error al procesar la respuesta del servidor');
      }

      console.log('Respuesta del servidor:', responseData);

      if (!response.ok) {
        throw new Error(responseData.mensaje || 'Error al crear el lugar');
      }
      
      // Recargar los lugares después de crear uno nuevo
      const lugaresResponse = await fetch(`${API_URL}/lugares`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const lugaresData = await lugaresResponse.json();
      const lugaresPropietario = lugaresData.filter(lugar => lugar.usuarioid === usuario.usuarioId);
      setLugares(lugaresPropietario);

      setShowForm(false);
      setFormData({
        nombre: '',
        descripcion: '',
        ubicacion: '',
        categoriaid: '',
        imagen: null
      });
    } catch (error) {
      console.error('Error al crear el lugar:', error);
      setError(error.message);
    }
  };

  const handleEliminarLugar = async (lugarId, e) => {
    e.stopPropagation(); // Evitar que se active el click del card
    if (!window.confirm('¿Estás seguro de que deseas eliminar este lugar?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/lugar/${lugarId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || 'Error al eliminar el lugar');
      }

      setLugares(prev => prev.filter(lugar => lugar.id !== lugarId));
    } catch (error) {
      console.error('Error al eliminar el lugar:', error);
      setError(error.message);
    }
  };

  const handleVerLugar = (lugarId) => {
    navigate(`/propietario/lugar/${lugarId}`);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-content">
          <div className="loading">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <div className="header-section">
          <h2>Mis Lugares</h2>
          <button className="btn-crear" onClick={() => setShowForm(true)}>
            Crear Nuevo Lugar
          </button>
        </div>

        {showForm && (
          <div className="form-container">
            <h3>Crear Nuevo Lugar</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Ubicación</label>
                <input
                  type="text"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Categoría</label>
                <select
                  name="categoriaid"
                  value={formData.categoriaid}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccione una categoría</option>
                  {categorias.map(categoria => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.tipo}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Imagen</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </div>
              {error && <div className="error-message">{error}</div>}
              <div className="form-actions">
                <button type="submit" className="btn-submit">Crear Lugar</button>
                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="items-list">
          {lugares.map((lugar) => (
            <div
              key={lugar.id}
              className="item-card"
              onClick={() => handleVerLugar(lugar.id)}
            >
              <div className="item-image">
                {lugar.imagen ? (
                  <img src={lugar.imagen} alt={lugar.nombre} />
                ) : (
                  <div className="image-placeholder">🏪</div>
                )}
              </div>
              <div className="item-info">
                <h3>{lugar.nombre}</h3>
                <p className="location">📍 {lugar.ubicacion}</p>
                <p className="description">{lugar.descripcion}</p>
                <div className="item-stats">
                  <span>⭐ {lugar.calificacion_promedio?.toFixed(1) || 'N/A'}</span>
                  <span>💬 {lugar.total_comentarios || 0}</span>
                </div>
                <button 
                  className="btn-delete"
                  onClick={(e) => handleEliminarLugar(lugar.id, e)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Lugares;
