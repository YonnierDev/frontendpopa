import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import './LugarDetalle.css';
import { 
  FaMapMarkerAlt, 
  FaStar, 
  FaComment, 
  FaCalendarAlt,
  FaEdit,
  FaTrash,
  FaUser,
  FaClock,
  FaTicketAlt,
  FaPhone,
  FaEnvelope,
  FaMoneyBillWave,
  FaUsers,
  FaWifi,
  FaParking,
  FaUtensils,
  FaMusic,
  FaCocktail,
  FaSmokingBan
} from 'react-icons/fa';

const LugarDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lugar, setLugar] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEventoForm, setShowEventoForm] = useState(false);
  const [nuevoEvento, setNuevoEvento] = useState({
    nombre: '',
    descripcion: '',
    fecha: '',
    hora: '',
    precio: ''
  });
  const [editingImage, setEditingImage] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [imageSize, setImageSize] = useState({ width: '100%', height: 'auto' });
  const [tempImageSize, setTempImageSize] = useState({ width: '100%', height: 'auto' });
  const [editingSize, setEditingSize] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        console.log('Intentando cargar datos para el lugar:', id);
        
        // Verificar si el ID es válido
        if (!id || isNaN(id)) {
          throw new Error('ID de lugar no válido');
        }

        // Primero intentamos obtener todos los lugares
        const lugaresRes = await fetch('https://popnocturna.vercel.app/api/lugares');
        if (!lugaresRes.ok) {
          throw new Error(`Error al cargar los lugares: ${lugaresRes.status}`);
        }

        const lugaresData = await lugaresRes.json();
        console.log('Todos los lugares:', lugaresData);

        // Buscar el lugar específico
        const lugarEncontrado = lugaresData.find(lugar => lugar.id === parseInt(id));
        console.log('Lugar encontrado:', lugarEncontrado);

        if (!lugarEncontrado) {
          throw new Error('El lugar no fue encontrado. Por favor, verifica que el ID sea correcto.');
        }

        // Obtener los eventos del lugar
        const eventosRes = await fetch(`https://popnocturna.vercel.app/api/eventos?lugarId=${id}`);
        if (!eventosRes.ok) {
          throw new Error(`Error al cargar los eventos: ${eventosRes.status}`);
        }

        const eventosData = await eventosRes.json();
        console.log('Eventos del lugar:', eventosData);

        setLugar(lugarEncontrado);
        setEventos(eventosData);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id]);

  const handleCrearEvento = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://popnocturna.vercel.app/api/eventos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...nuevoEvento,
          lugarid: parseInt(id)
        })
      });

      if (!response.ok) {
        throw new Error('Error al crear el evento');
      }

      // Recargar los datos del lugar para mostrar el nuevo evento
      const lugaresRes = await fetch(`https://popnocturna.vercel.app/api/lugares`);
      const lugaresData = await lugaresRes.json();
      const lugarActualizado = lugaresData.find(lugar => lugar.id === parseInt(id));
      setLugar(lugarActualizado);
      
      // Limpiar el formulario y ocultarlo
      setNuevoEvento({
        nombre: '',
        descripcion: '',
        fecha: '',
        hora: '',
        precio: ''
      });
      setShowEventoForm(false);
    } catch (error) {
      console.error('Error al crear evento:', error);
      setError(error.message);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'popaimagen');

        const response = await fetch('https://api.cloudinary.com/v1_1/popaimagen/image/upload', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) throw new Error('Error al subir la imagen');

        const data = await response.json();
        setNewImage(data.secure_url);
      } catch (error) {
        console.error('Error al subir la imagen:', error);
        alert('Error al subir la imagen. Por favor, inténtalo de nuevo.');
      }
    }
  };

  const handleSaveImage = async () => {
    if (!newImage) return;

    try {
      const response = await fetch(`https://popnocturna.vercel.app/api/lugares/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imagen: newImage })
      });

      if (!response.ok) throw new Error('Error al actualizar la imagen');

      setLugar(prev => ({ ...prev, imagen: newImage }));
      setEditingImage(false);
      setNewImage(null);
    } catch (error) {
      console.error('Error al guardar la imagen:', error);
      alert('Error al guardar la imagen. Por favor, inténtalo de nuevo.');
    }
  };

  const handleSizeChange = (e) => {
    const { name, value } = e.target;
    setTempImageSize(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveSize = async () => {
    try {
      // Guardar el tamaño en el estado local
      setImageSize(tempImageSize);
      setEditingSize(false);
      
      // Mostrar mensaje de éxito
      alert('Tamaño de imagen actualizado correctamente');
    } catch (error) {
      console.error('Error al guardar el tamaño:', error);
      alert('Error al guardar el tamaño. Por favor, inténtalo de nuevo.');
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-content">
          <div className="loading">Cargando datos...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-content">
          <div className="error-message">
            <h2>Error</h2>
            <p>{error}</p>
            <button 
              className="btn-volver"
              onClick={() => navigate('/propietario/dashboard')}
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!lugar) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-content">
          <div className="error-message">
            <h2>Lugar no encontrado</h2>
            <p>No se encontró información para este lugar.</p>
            <button 
              className="btn-volver"
              onClick={() => navigate('/propietario/dashboard')}
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <div className="lugar-detalle">
          {/* Sección de Información Principal */}
          <div className="lugar-header">
            <div className="lugar-titulo">
              <h1>{lugar.nombre}</h1>
              <div className="lugar-estado-badge">
                {lugar.estado ? 'Activo' : 'Inactivo'}
              </div>
            </div>
            <div className="lugar-ubicacion">
              <FaMapMarkerAlt />
              <span>{lugar.ubicacion}</span>
            </div>
          </div>

          {/* Imagen del Lugar */}
          <div className="lugar-imagen-container">
            <div className="image-controls">
              <button 
                className="edit-btn"
                onClick={() => setEditingImage(!editingImage)}
              >
                <FaEdit /> {editingImage ? 'Cancelar' : 'Editar Imagen'}
              </button>
              {editingImage && (
                <div className="image-edit-panel">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="image-upload"
                  />
                  <div className="size-controls">
                    <button 
                      className="size-edit-btn"
                      onClick={() => setEditingSize(!editingSize)}
                    >
                      <FaEdit /> {editingSize ? 'Cancelar' : 'Editar Tamaño'}
                    </button>
                    {editingSize && (
                      <div className="size-edit-panel">
                        <label>
                          Ancho:
                          <input
                            type="text"
                            name="width"
                            value={tempImageSize.width}
                            onChange={handleSizeChange}
                            placeholder="100%"
                          />
                        </label>
                        <label>
                          Alto:
                          <input
                            type="text"
                            name="height"
                            value={tempImageSize.height}
                            onChange={handleSizeChange}
                            placeholder="auto"
                          />
                        </label>
                        <button 
                          className="save-size-btn"
                          onClick={handleSaveSize}
                        >
                          Aplicar Tamaño
                        </button>
                      </div>
                    )}
                  </div>
                  {newImage && (
                    <button 
                      className="save-btn"
                      onClick={handleSaveImage}
                    >
                      Guardar Imagen
                    </button>
                  )}
                </div>
              )}
            </div>
            <img 
              src={lugar.imagen} 
              alt={lugar.nombre}
              style={{
                width: imageSize.width,
                height: imageSize.height
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://res.cloudinary.com/popaimagen/image/upload/v1744615116/default-place.jpg';
              }}
            />
          </div>

          {/* Información Detallada */}
          <div className="lugar-info-grid">
            <div className="info-card">
              <h2>Descripción</h2>
              <p>{lugar.descripcion}</p>
            </div>

            <div className="info-card">
              <h2>Categoría</h2>
              <p>{lugar.categoria?.tipo || 'No especificada'}</p>
            </div>

            <div className="info-card">
              <h2>Estado de Aprobación</h2>
              <p className={lugar.aprobacion ? 'aprobado' : 'pendiente'}>
                {lugar.aprobacion ? 'Aprobado' : 'Pendiente de Aprobación'}
              </p>
            </div>
          </div>

          {/* Sección de Eventos */}
          <div className="seccion-eventos">
            <div className="seccion-header">
              <h2>Eventos</h2>
              <button 
                className="btn-crear-evento"
                onClick={() => setShowEventoForm(!showEventoForm)}
              >
                {showEventoForm ? 'Cancelar' : 'Crear Nuevo Evento'}
              </button>
            </div>

            {showEventoForm && (
              <form className="evento-form" onSubmit={handleCrearEvento}>
                <div className="form-group">
                  <label>Nombre del Evento</label>
                  <input
                    type="text"
                    value={nuevoEvento.nombre}
                    onChange={(e) => setNuevoEvento({...nuevoEvento, nombre: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Descripción</label>
                  <textarea
                    value={nuevoEvento.descripcion}
                    onChange={(e) => setNuevoEvento({...nuevoEvento, descripcion: e.target.value})}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Fecha</label>
                    <input
                      type="date"
                      value={nuevoEvento.fecha}
                      onChange={(e) => setNuevoEvento({...nuevoEvento, fecha: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Hora</label>
                    <input
                      type="time"
                      value={nuevoEvento.hora}
                      onChange={(e) => setNuevoEvento({...nuevoEvento, hora: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Precio</label>
                    <input
                      type="number"
                      value={nuevoEvento.precio}
                      onChange={(e) => setNuevoEvento({...nuevoEvento, precio: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn-submit">Crear Evento</button>
              </form>
            )}

            <div className="eventos-grid">
              {eventos && eventos.length > 0 ? (
                eventos.map((evento, index) => (
                  <div key={index} className="evento-card">
                    <div className="evento-header">
                      <h3>{evento.nombre}</h3>
                      <div className="evento-acciones">
                        <button className="btn-edit"><FaEdit /></button>
                        <button className="btn-delete"><FaTrash /></button>
                      </div>
                    </div>
                    <p className="evento-descripcion">{evento.descripcion}</p>
                    <div className="evento-detalles">
                      <span><FaClock /> {evento.hora}</span>
                      <span><FaTicketAlt /> ${evento.precio}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-eventos">No hay eventos programados</p>
              )}
            </div>
          </div>

          {/* Sección de Comentarios */}
          <div className="seccion-comentarios">
            <h2>Comentarios</h2>
            <div className="comentarios-grid">
              {lugar.comentarios && lugar.comentarios.length > 0 ? (
                lugar.comentarios.map((comentario, index) => (
                  <div key={index} className="comentario-card">
                    <div className="comentario-header">
                      <div className="usuario-info">
                        <FaUser />
                        <span>{comentario.usuario?.nombre || 'Anónimo'}</span>
                      </div>
                      <div className="comentario-fecha">
                        {new Date(comentario.fecha).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="comentario-texto">{comentario.texto}</p>
                    <div className="comentario-acciones">
                      <button className="btn-responder">Responder</button>
                      <button className="btn-reportar">Reportar</button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-comentarios">No hay comentarios aún</p>
              )}
            </div>
          </div>

          {/* Sección de Calificaciones */}
          <div className="seccion-calificaciones">
            <h2>Calificaciones</h2>
            <div className="calificaciones-grid">
              {lugar.calificaciones && lugar.calificaciones.length > 0 ? (
                lugar.calificaciones.map((calificacion, index) => (
                  <div key={index} className="calificacion-card">
                    <div className="calificacion-header">
                      <div className="usuario-info">
                        <FaUser />
                        <span>{calificacion.usuario?.nombre || 'Anónimo'}</span>
                      </div>
                      <div className="calificacion-estrellas">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            className={i < calificacion.puntuacion ? 'estrella-llena' : 'estrella-vacia'} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="calificacion-comentario">{calificacion.comentario}</p>
                    <div className="calificacion-fecha">
                      {new Date(calificacion.fecha).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-calificaciones">No hay calificaciones aún</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LugarDetalle; 