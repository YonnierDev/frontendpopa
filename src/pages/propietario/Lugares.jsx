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
  const [eventos, setEventos] = useState([]); // Almacenar eventos
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
        setCategorias(categoriasData);

        // Cargar eventos solo si hay lugares
        if (lugaresPropietario.length > 0) {
          const eventosResponse = await fetch(`${API_URL}/eventos`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });

          if (!eventosResponse.ok) {
            throw new Error('Error al cargar los eventos');
          }

          const eventosData = await eventosResponse.json();
          setEventos(eventosData);
        }

      } catch (error) {
        setError('Error al cargar los datos: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [usuario.usuarioId, token]);

  const handleVerLugar = (lugarId) => {
    navigate(`/propietario/lugar/${lugarId}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpiar errores anteriores
    setSuccess(''); // Limpiar mensaje de éxito anterior

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('nombre', formData.nombre);
      formDataToSend.append('descripcion', formData.descripcion);
      formDataToSend.append('ubicacion', formData.ubicacion);
      formDataToSend.append('categoriaid', formData.categoriaid);
      formDataToSend.append('imagen', formData.imagen);

      const response = await fetch(`${API_URL}/lugares`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Error al crear el lugar');
      }

      const data = await response.json();
      setSuccess('Lugar creado exitosamente');
      setShowForm(false); // Ocultar el formulario después de crear el lugar
      setLugares([...lugares, data]); // Agregar el lugar recién creado a la lista
    } catch (error) {
      setError('Error al crear el lugar: ' + error.message);
    }
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

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        {showForm && (
          <div className="form-container">
            <h3>Crear Nuevo Lugar</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nombre">Nombre:</label>
                <input
                  type="text"
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="descripcion">Descripción:</label>
                <textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="ubicacion">Ubicación:</label>
                <input
                  type="text"
                  id="ubicacion"
                  value={formData.ubicacion}
                  onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="categoriaid">Categoría:</label>
                <select
                  id="categoriaid"
                  value={formData.categoriaid}
                  onChange={(e) => setFormData({ ...formData, categoriaid: e.target.value })}
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.map(categoria => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.tipo}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="imagen">Imagen:</label>
                <input
                  type="file"
                  id="imagen"
                  onChange={(e) => setFormData({ ...formData, imagen: e.target.files[0] })}
                />
              </div>
              <button type="submit" className="btn-submit">Crear Lugar</button>
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
                <p className="owner">Propietario: {lugar.usuario.nombre}</p>
                <p className="category">Categoría: {lugar.categoria.tipo}</p>
                <div className="item-stats">
                  <span>⭐ {lugar.calificacion_promedio?.toFixed(1) || 'N/A'}</span>
                  <span>💬 {lugar.total_comentarios || 0}</span>
                </div>
              </div>

              {/* Mostrar los eventos solo del lugar específico */}
              {eventos.filter(evento => evento.lugarid === lugar.id).map(evento => (
                <div key={evento.id} className="evento-item">
                  <p>{evento.nombre}</p>
                  <p>{evento.descripcion}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Lugares;
