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

        // Cargar eventos solo si hay lugares
        if (lugaresPropietario.length > 0) {
          const eventosResponse = await fetch(`${API_URL}/eventos`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });

          if (!eventosResponse.ok) {
            throw new Error('Error al cargar los eventos');
          }

          const eventosData = await eventosResponse.json();
          console.log('Eventos recibidos:', eventosData);
          setEventos(eventosData);
        }

      } catch (error) {
        console.error('Error al cargar los datos:', error);
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
              {/* Aquí va tu formulario */}
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

              {/* Mostrar los eventos solo del lugar específico */}
              <div className="events">
                {eventos.filter(evento => evento.lugarid === lugar.id).length === 0 ? (
                  <p>No hay eventos para este lugar</p>
                ) : (
                  eventos.filter(evento => evento.lugarid === lugar.id).map((evento) => (
                    <div key={evento.id} className="evento-card">
                      <h4>{evento.nombre}</h4>
                      <p>{evento.descripcion}</p>
                      <p>{evento.fecha_hora}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Lugares;
