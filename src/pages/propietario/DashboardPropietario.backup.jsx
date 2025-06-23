import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar, FaComments, FaBuilding, FaPlus, FaTimes } from 'react-icons/fa';
import { api } from '../../components/api/api';
import './DashboardPropietario.css';

const DashboardPropietario = () => {
  const [lugares, setLugares] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    ubicacion: '',
    categoriaid: '',
    imagen: null,
    fotos_lugar: []
  });

  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const navigate = useNavigate();

  const cargarCategorias = async () => {
    try {
      const response = await api.get('/api/categorias');
      setCategorias(response.data);
    } catch (error) {
      console.error('Error cargando categorías:', error);
      setError('No se pudieron cargar las categorías');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, imagen: e.target.files[0] });
    }
  };

  const handleFotosChange = (e) => {
    if (e.target.files) {
      setFormData({ ...formData, fotos_lugar: [...e.target.files] });
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validación de campos requeridos
    if (!formData.nombre || !formData.descripcion || !formData.ubicacion || !formData.categoriaid) {
      setError('Todos los campos son obligatorios');
      setLoading(false);
      return;
    }

    if (!formData.imagen) {
      setError('La imagen principal es requerida');
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      
      // Agregar campos básicos
      formDataToSend.append('nombre', formData.nombre);
      formDataToSend.append('descripcion', formData.descripcion);
      formDataToSend.append('ubicacion', formData.ubicacion);
      formDataToSend.append('categoriaid', formData.categoriaid);
      
      // Agregar imagen principal
      if (formData.imagen) {
        formDataToSend.append('imagen', formData.imagen);
      }
      
      // Agregar fotos adicionales
      if (formData.fotos_lugar && formData.fotos_lugar.length > 0) {
        formData.fotos_lugar.forEach((foto) => {
          formDataToSend.append('fotos_lugar', foto);
        });
      }
      


      // Enviar la solicitud con el token de autenticación
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No se encontró el token de autenticación');
        setLoading(false);
        navigate('/login');
        return;
      }

      const response = await api.post('/api/propietario/lugar', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      // Cerrar el modal y limpiar el formulario
      setShowModal(false);
      setFormData({
        nombre: '',
        descripcion: '',
        ubicacion: '',
        categoriaid: '',
        imagen: null,
        fotos_lugar: []
      });
      
      // Recargar los datos para asegurarnos de tener la lista más reciente
      // Esto garantiza que solo se muestren los lugares aprobados
      await cargarDatos();
      
      // Mostrar mensaje de éxito
      setShowSuccess(true);
      // Ocultar el mensaje después de 5 segundos
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      
    } catch (error) {
      console.error('Error al crear el lugar:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.mensaje || 'Error al crear el lugar';
      setError(errorMessage);
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const cargarDatos = async () => {
    try {
      if (!usuario?.token) {
        navigate('/login');
        return [];
      }

      const [lugaresRes, comentariosRes] = await Promise.all([
        api.get('/api/propietario/lugares'),
        api.get('/api/comentarios')
      ]);

      // Filtrar solo los lugares que estén aprobados (aprobacion = true)
      const lugaresData = Array.isArray(lugaresRes.data) 
        ? lugaresRes.data.filter(lugar => lugar.aprobacion === true) 
        : [];
      
      const comentariosData = Array.isArray(comentariosRes.data) ? comentariosRes.data : [];
      
      setLugares(lugaresData);
      setComentarios(comentariosData);
      
      return lugaresData;
    } catch (error) {
      console.error('Error cargando datos:', error);
      setError('Error al cargar los datos: ' + (error.response?.data?.message || error.message || 'Error desconocido'));
      if (error.response?.status === 401) {
        navigate('/login');
      }
      return [];
    }
  };

  // Efecto para cargar datos iniciales
  useEffect(() => {
    const cargarTodo = async () => {
      setLoading(true);
      try {
        // Verificar autenticación primero
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        if (!usuario?.token) {
          navigate('/login');
          return;
        }

        // Cargar categorías
        await cargarCategorias();
        
        // Cargar lugares y comentarios (ya se cargan juntos en cargarDatos)
        await cargarDatos();
        
      } catch (error) {
        console.error('Error en carga inicial:', error);
        setError('Error al cargar los datos: ' + (error.message || 'Error desconocido'));
      } finally {
        setLoading(false);
      }
    };

    cargarTodo();
  }, [navigate]); // Solo dependencia de navigate

  if (loading) {
    return (
      <div className="propietario-dashboard">
        <div className="propietario-content">
          <div className="propietario-loading">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="propietario-dashboard">
      <div className="content-container">
        <div className="dashboard-header">
          <div>
            <h1>Mis Lugares</h1>
            <p className="welcome-text">Bienvenido, {usuario?.nombre || 'Propietario'}</p>
          </div>
          <button 
            className="btn-nuevo-lugar"
            onClick={() => setShowModal(true)}
          >
            <FaPlus /> Nuevo Lugar
          </button>
        </div>

        {error && <div className="propietario-error">{error}</div>}
        {showSuccess && (
          <div className="propietario-success">
            <div className="success-content">
              <div className="success-icon">✓</div>
              <p>¡Listo! Tu lugar estará visible cuando sea aprobado.</p>
            </div>
            <button 
              className="close-success" 
              onClick={() => setShowSuccess(false)}
              aria-label="Cerrar mensaje"
            >
              ×
            </button>
          </div>
        )}

        <div className="dashboard-content">
          <div className="welcome-section">
            <h1>Bienvenido de vuelta</h1>
            <p className="welcome-subtitle">Gestiona tus lugares y mantén tu información actualizada</p>
            <div className="welcome-actions">
              <button 
                className="btn-nuevo-lugar"
                onClick={() => setShowModal(true)}
              >
                <FaPlus /> Agregar nuevo lugar
              </button>
              <button className="btn-secondary">
                <FaQuestionCircle /> Cómo funciona
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Cargando tus lugares...</p>
            </div>
          ) : lugares.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-content">
                <div className="empty-state-icon">
                  <FaBuilding size={64} />
                </div>
                <h2>¡Aún no tienes lugares registrados!</h2>
                <p>Comienza creando tu primer lugar para mostrarlo a los usuarios de Nocturna.</p>
                <button 
                  className="btn-nuevo-lugar"
                  onClick={() => setShowModal(true)}
                >
                  <FaPlus /> Crear mi primer lugar
                </button>
                <div className="empty-state-tips">
                  <div className="tip">
                    <FaCheckCircle />
                    <span>Fácil de configurar</span>
                  </div>
                  <div className="tip">
                    <FaUsers />
                    <span>Llega a más clientes</span>
                  </div>
                  <div className="tip">
                    <FaChartLine />
                    <span>Mide tu rendimiento</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="section-header">
                <h2>Tus Lugares</h2>
                <p className="section-description">
                  {lugares.length} {lugares.length === 1 ? 'lugar registrado' : 'lugares registrados'}
                </p>
              </div>
              
              <div className="places-grid">
                {lugares.map((lugar) => (
                  <div key={lugar.id} className="place-card" onClick={() => navigate(`/propietario/lugar/${lugar.id}`)}>
                    <div className="place-image-container">
                      {lugar.imagen ? (
                        <img 
                          src={lugar.imagen} 
                          alt={lugar.nombre}
                          className="place-image"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder-image.svg';
                          }}
                          loading="lazy"
                        />
                      ) : (
                        <div className="no-image">
                          <FaBuilding size={32} />
                          <span>Sin imagen</span>
                        </div>
                      )}
                      <div className={`status-badge ${lugar.aprobacion ? 'approved' : 'pending'}`}>
                        <span className="badge-icon">
                          {lugar.aprobacion ? <FaCheck /> : <FaClock />}
                        </span>
                        <span>{lugar.aprobacion ? 'Aprobado' : 'En revisión'}</span>
                      </div>
                      {lugar.calificacion_promedio > 0 && (
                        <div className="rating-badge">
                          <FaStar className="star-icon" />
                          <span>{lugar.calificacion_promedio.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <div className="place-info">
                      <div className="place-header">
                        <h3 className="place-title">{lugar.nombre}</h3>
                        <button 
                          className="btn-edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/propietario/lugar/editar/${lugar.id}`);
                          }}
                        >
                          <FaEdit />
                        </button>
                      </div>
                      <p className="place-location">
                        <FaMapMarkerAlt /> {lugar.ubicacion}
                      </p>
                      {lugar.descripcion && (
                        <p className="place-description">
                          {lugar.descripcion.length > 100 
                            ? `${lugar.descripcion.substring(0, 100)}...` 
                            : lugar.descripcion}
                        </p>
                      )}
                      <div className="place-footer">
                        <div className="place-meta">
                          {lugar.categorianombre && (
                            <span className="category-tag">
                              {lugar.categorianombre}
                            </span>
                          )}
                          <span className="created-date">
                            Creado el {new Date(lugar.fecha_creacion).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="place-actions">
                          <button 
                            className="btn-action"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Acción para compartir
                            }}
                            title="Compartir"
                          >
                            <FaShareAlt />
                          </button>
                          <button 
                            className="btn-action"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Acción para ver estadísticas
                            }}
                            title="Estadísticas"
                          >
                            <FaChartBar />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="help-section">
                <h3>¿Neitas ayuda con algo más?</h3>
                <p>Consulta nuestra guía para propietarios o contacta a nuestro equipo de soporte.</p>
                <div className="help-actions">
                  <button className="btn-outline">
                    <FaBookOpen /> Ver guía
                  </button>
                  <button className="btn-outline">
                    <FaHeadset /> Contactar soporte
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Crear Nuevo Lugar */}
        {showModal && (
          <div className="modal" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div className="modal-content" style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0 }}>Crear Nuevo Lugar</h3>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: '#666' }}>
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="form-crear-lugar">
  <div className="form-group">
    <label htmlFor="nombre">Nombre</label>
    <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} required />
  </div>
  <div className="form-group">
    <label htmlFor="descripcion">Descripción</label>
    <textarea id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleInputChange} required />
  </div>
  <div className="form-group">
    <label htmlFor="ubicacion">Ubicación</label>
    <input type="text" id="ubicacion" name="ubicacion" value={formData.ubicacion} onChange={handleInputChange} required />
  </div>
  <div className="form-group">
    <label htmlFor="categoriaid">Categoría</label>
    <select id="categoriaid" name="categoriaid" value={formData.categoriaid} onChange={handleInputChange} required>
      <option value="">Selecciona una categoría</option>
      {categorias.map((cat) => (
        <option key={cat.id} value={cat.id}>{cat.tipo}</option>
      ))}
    </select>
  </div>
  <div className="form-group">
    <label htmlFor="imagen">Imagen Principal *</label>
    <input 
      type="file" 
      id="imagen" 
      accept="image/*" 
      onChange={handleImageChange} 
      required 
    />
    <small className="form-text">La imagen principal es obligatoria</small>
  </div>

  <div className="form-group">
    <label htmlFor="fotos_lugar">Fotos Adicionales</label>
    <input 
      type="file" 
      id="fotos_lugar" 
      accept="image/*" 
      multiple 
      onChange={handleFotosChange} 
    />
    <small className="form-text">Puedes seleccionar múltiples imágenes (opcional)</small>
    {formData.fotos_lugar.length > 0 && (
      <div className="mt-2">
        <small>{formData.fotos_lugar.length} archivo(s) seleccionado(s)</small>
      </div>
    )}
  </div>

  <div className="form-botones-modal">
    <button type="button" onClick={() => setShowModal(false)} className="btn-cancelar-lugar">
      Cancelar
    </button>
    <button type="submit" className="btn-submit-lugar">
      Crear Lugar
    </button>
  </div>
</form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPropietario;
