import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaMapMarkerAlt, 
  FaStar, 
  FaComments, 
  FaBuilding, 
  FaPlus, 
  FaTimes,
  FaQuestionCircle,
  FaCheckCircle,
  FaUsers,
  FaChartLine,
  FaEdit,
  FaShareAlt,
  FaChartBar,
  FaBookOpen,
  FaHeadset,
  FaCheck,
  FaClock
} from 'react-icons/fa';
import { api } from '../../components/api/api';
import './DashboardPropietario.css';

const DashboardPropietario = () => {
  const [lugares, setLugares] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [showGuiaModal, setShowGuiaModal] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    nombre: '',
    descripcion: '',
    ubicacion: '',
    categoriaid: '',
    imagen: null,
    fotos_lugar: [],
    imagenesExistentes: []
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
    
    if (!formData.nombre || !formData.ubicacion || !formData.categoriaid) {
      setError('Los campos marcados con * son obligatorios');
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
      formDataToSend.append('nombre', formData.nombre);
      formDataToSend.append('descripcion', formData.descripcion);
      formDataToSend.append('ubicacion', formData.ubicacion);
      formDataToSend.append('categoriaid', formData.categoriaid);
      
      if (formData.imagen) {
        formDataToSend.append('imagen', formData.imagen);
      }
      
      if (formData.fotos_lugar && formData.fotos_lugar.length > 0) {
        formData.fotos_lugar.forEach((foto) => {
          formDataToSend.append('fotos_lugar', foto);
        });
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setError('No se encontró el token de autenticación');
        setLoading(false);
        navigate('/login');
        return;
      }

      // Siempre usamos el endpoint de creación para mantener consistencia con el backend
      const response = await api.post('/api/propietario/lugar', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      // Nota: La funcionalidad de edición estará disponible pronto

      setShowModal(false);
      setFormData({
        nombre: '',
        descripcion: '',
        ubicacion: '',
        categoriaid: '',
        imagen: null,
        fotos_lugar: []
      });
      
      await cargarDatos();
      setShowSuccess(true);
      // Recargar la lista de lugares después de un breve retraso
      setTimeout(() => {
        cargarDatos();
        resetForm();
      }, 1000);
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

  const resetForm = () => {
    setFormData({
      id: null,
      nombre: '',
      descripcion: '',
      ubicacion: '',
      categoriaid: '',
      imagen: null,
      fotos_lugar: []
    });
    setShowModal(false);
  };

  const closeHelpModal = () => {
    setShowHelpModal(false);
  };

  const openGuiaModal = () => {
    setShowGuiaModal(true);
  };

  const closeGuiaModal = () => {
    setShowGuiaModal(false);
  };

  useEffect(() => {
    const cargarTodo = async () => {
      setLoading(true);
      try {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        if (!usuario?.token) {
          navigate('/login');
          return;
        }

        await cargarCategorias();
        await cargarDatos();
        
      } catch (error) {
        console.error('Error en carga inicial:', error);
        setError('Error al cargar los datos: ' + (error.message || 'Error desconocido'));
      } finally {
        setLoading(false);
      }
    };

    cargarTodo();
  }, [navigate]);

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
        </div>

        {error && <div className="propietario-error">{error}</div>}
        {showSuccess && (
          <div className="propietario-success">
            <div className="success-content">
              <div className="success-icon">✓</div>
              <p>
                {isEditing 
                  ? '¡Tus cambios han sido guardados! El administrador revisará las actualizaciones.'
                  : '¡Listo! Tu lugar estará visible cuando sea aprobado.'
                }
              </p>
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
              <button 
                className="btn-secondary"
                onClick={() => setShowHelpModal(true)}
              >
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
                <h2 style={{color: 'white'}}>Tus Lugares</h2>
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

                        </div>
                        <div className="place-actions">
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="help-section">
                <h3>¿Necesitas ayuda con algo más?</h3>
                <p>Consulta nuestra guía para propietarios o contacta a nuestro equipo de soporte.</p>
                <div className="help-actions">
                  <button className="btn-outline" onClick={openGuiaModal}>
                    <FaBookOpen /> Ver guía
                  </button>
                  
                  {/* Modal de Guía */}
                  {showGuiaModal && (
                    <div className="modal-overlay" onClick={closeGuiaModal}>
                      <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                          <h3>Guía para Propietarios</h3>
                          <button className="close-button" onClick={closeGuiaModal}>
                            <FaTimes />
                          </button>
                        </div>
                        <div className="modal-body">
                          <h4>Bienvenido a la Guía para Propietarios</h4>
                          <p>Esta guía te ayudará a gestionar tus lugares de manera efectiva en nuestra plataforma.</p>
                          
                          <div className="guide-section">
                            <h5>1. Agregar un Nuevo Lugar</h5>
                            <p>Para agregar un nuevo lugar, haz clic en el botón "Agregar nuevo lugar" y completa el formulario con la información requerida.</p>
                          </div>
                          
                          <div className="guide-section">
                            <h5>2. Estado de Aprobación</h5>
                            <p>Los lugares nuevos deben ser aprobados por el administrador. El estado de aprobación se actualizará en tu panel una vez revisado.</p>
                          </div>
                          
                          <div className="guide-section">
                            <h5>3. Panel de Control del Lugar</h5>
                            <p>Al hacer clic en cualquier tarjeta de lugar, accederás al panel de control completo donde podrás:</p>
                            
                            <h6>Gestión de Eventos</h6>
                            <ul>
                              <li>Crear y programar nuevos eventos especiales</li>
                              <li>Gestionar eventos existentes (editar, cancelar)</li>
                            </ul>
                            
                            <h6>Calificaciones y Comentarios</h6>
                            <ul>
                              <li>Revisar calificaciones de los visitantes</li>
                              <li>Ver el promedio de calificaciones</li>
                              <li>Ver los comentarios de los clientes</li>
                            </ul>
                            
                            <h6>Reservas</h6>
                            <ul>
                              <li>Aprobar o rechazar solicitudes de reserva</li>
                            </ul>
                          </div>
                          
                          <div className="guide-section">
                            <h5>4. Soporte</h5>
                            <p>Si necesitas ayuda, puedes contactar a nuestro equipo de soporte en cualquier momento.</p>
                          </div>
                        </div>
                        <div className="modal-footer">
                          <button className="btn-primary" onClick={closeGuiaModal}>
                            Entendido
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  <button 
                    className="btn-outline" 
                    onClick={() => alert('Ponte en contacto con nuestro equipo de soporte en: nocturnapopayan@gmail.com')}
                  >
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
                  <label htmlFor="imagen">Imagen Principal {!isEditing && '*'}</label>
                  <input 
                    type="file" 
                    id="imagen" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    required={!isEditing}
                  />
                  <small className="form-text">
                    {isEditing ? 'Selecciona una nueva imagen si deseas cambiarla' : 'La imagen principal es obligatoria'}
                  </small>
                  {isEditing && formData.imagenesExistentes.length > 0 && (
                    <div className="existing-images">
                      <p>Imagen principal:</p>
                      <img 
                        src={formData.imagenesExistentes[0]} 
                        alt="Imagen principal" 
                        style={{ maxWidth: '100%', maxHeight: '150px', marginTop: '10px' }}
                      />
                    </div>
                  )}
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
                  <button type="button" onClick={resetForm} className="btn-cancelar-lugar">
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

        {/* Modal de Ayuda */}
        {showHelpModal && (
          <div className="modal" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div className="modal-content" style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0 }}>¿Cómo funciona?</h3>
                <button 
                  onClick={() => setShowHelpModal(false)} 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: '#666' }}
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="help-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="help-section" style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 0.75rem 0' }}><FaPlus style={{ marginRight: '8px' }} /> Crear un nuevo lugar</h4>
                  <p style={{ margin: '0 0 0.75rem 0' }}>Para agregar un nuevo lugar a la plataforma:</p>
                  <ol style={{ margin: '0 0 0.75rem 1.5rem', padding: 0 }}>
                    <li style={{ marginBottom: '0.5rem' }}>Haz clic en "Agregar nuevo lugar"</li>
                    <li style={{ marginBottom: '0.5rem' }}>Completa todos los campos obligatorios (*)</li>
                    <li style={{ marginBottom: '0.5rem' }}>Sube al menos una imagen principal</li>
                    <li style={{ marginBottom: '0.5rem' }}>Haz clic en "Crear Lugar"</li>
                  </ol>
                  <p style={{ margin: '0.75rem 0 0 0' }}>Tu lugar será revisado por nuestro equipo antes de ser publicado.</p>
                </div>

                <div className="help-section" style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 0.75rem 0' }}><FaChartBar style={{ marginRight: '8px' }} /> Estadísticas</h4>
                  <p style={{ margin: 0 }}>Próximamente podrás ver estadísticas detalladas sobre las visitas a tus lugares.</p>
                </div>

                <div className="help-section">
                  <h4 style={{ margin: '0 0 0.75rem 0' }}><FaHeadset style={{ marginRight: '8px' }} /> Soporte</h4>
                  <p style={{ margin: '0 0 0.75rem 0' }}>Si necesitas ayuda adicional, no dudes en contactar a nuestro equipo de soporte:</p>
                  <p style={{ margin: 0 }}>
                    Email: <a href="mailto:nocturnapopayan@gmail.com" style={{ color: '#4A90E2', textDecoration: 'none' }}>
                      nocturnapopayan@gmail.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="modal-footer" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  className="btn-submit-lugar"
                  onClick={() => setShowHelpModal(false)}
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
  );
};

export default DashboardPropietario;
