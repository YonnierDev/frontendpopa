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
  const [categorias, setCategorias] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    ubicacion: '',
    categoriaid: '',
    imagen: null,
    fotos_lugar: [],
    carta_pdf: null
  });

  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const navigate = useNavigate();

  const cargarCategorias = async () => {
    try {
      const response = await api.get('/categorias');
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

  const handlePdfChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, carta_pdf: e.target.files[0] });
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

    const formDataToSend = new FormData();
    
    // Agregar campos al FormData
    Object.keys(formData).forEach(key => {
      if (key === 'fotos_lugar' && formData[key].length > 0) {
        // Para múltiples archivos en fotos_lugar
        formData[key].forEach(file => {
          formDataToSend.append('fotos_lugar', file);
        });
      } else if (formData[key] !== null && formData[key] !== '') {
        // Para campos simples
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      // Usar la instancia de Axios configurada
      await api.post('/propietario/lugar', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Cerrar modal y recargar datos
      setShowModal(false);
      await cargarDatos();
      
      // Resetear formulario
      setFormData({
        nombre: '',
        descripcion: '',
        ubicacion: '',
        categoriaid: '',
        imagen: null,
        fotos_lugar: [],
        carta_pdf: null
      });
      
    } catch (error) {
      console.error('Error al crear lugar:', error);
      setError(error.response?.data?.message || 'Error al crear el lugar. Por favor, inténtalo de nuevo.');
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
        api.get('/propietario/lugares'),
        api.get('/comentarios')
      ]);

      const lugaresData = Array.isArray(lugaresRes.data) ? lugaresRes.data : [];
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

  const promedioCalificacion = lugares.length > 0
    ? (lugares.reduce((acc, lugar) => acc + (lugar.calificacion_promedio || 0), 0) / lugares.length).toFixed(1)
    : '0.0';
  return (
    <div className="propietario-dashboard">
      <div className="content-container">
        <div className="propietario-kpis-row">
           <div className="propietario-stat-box"><div className="propietario-stat-icon"><FaBuilding /></div><div className="propietario-stat-content"><h3>Lugares Registrados</h3><p className="propietario-stat-value">{lugares.length}</p></div></div>
         </div>

        <div className="propietario-welcome">
          <h1 style={{ color: 'white' }}>Bienvenido, {usuario?.nombre || 'Propietario'}</h1>
          <p>Gestiona tus lugares y revisa tus estadísticas</p>
        </div>

        {error && <div className="propietario-error">{error}</div>}

        <div className="propietario-places">
          <div className="propietario-places-header">
            <h2>Mis Lugares</h2>
            <button className="btn-nuevo-lugar" onClick={() => setShowModal(true)}>
              <FaPlus /> Nuevo Lugar
            </button>
          </div>

          <div className="propietario-places-grid">
            {lugares.length === 0 ? (
              <div className="propietario-no-places">No tienes lugares registrados aún</div>
            ) : (
              lugares.map((lugar) => (
                <div key={lugar.id} className="propietario-place-card">
                  <div 
                    className="propietario-place-image" 
                    onClick={() => navigate(`/propietario/lugar/${lugar.id}`)}
                  >
                    <div className="image-container">
                      <img 
                        src={lugar.imagen || 'https://via.placeholder.com/300x200?text=Sin+imagen'} 
                        alt={lugar.nombre} 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/300x200?text=Error+imagen';
                        }}
                      />
                    </div>
                    
                    <div className="propietario-place-status">
                      {lugar.aprobacion ? (
                        <span className="status-badge approved">Aprobado</span>
                      ) : (
                        <span className="status-badge pending">En revisión</span>
                      )}
                    </div>
                    
                    <div className="propietario-place-info">
                      <h3 className="propietario-place-title">{lugar.nombre}</h3>
                      <p className="propietario-place-location">
                        <FaMapMarkerAlt /> {lugar.ubicacion}
                      </p>
                    </div>
                  </div>
                  
                  <div className="propietario-place-footer">
                    <div className="additional-images-preview">
                      {lugar.fotos_lugar && lugar.fotos_lugar.slice(0, 3).map((foto, index) => (
                        <div key={index} className="thumbnail">
                          <img 
                            src={foto} 
                            alt={`Foto ${index + 1}`}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/50x50?text=Imagen';
                            }}
                          />
                        </div>
                      ))}
                      {lugar.fotos_lugar && lugar.fotos_lugar.length > 3 && (
                        <div className="more-images">+{lugar.fotos_lugar.length - 3}</div>
                      )}
                    </div>
                    
                    {lugar.carta_pdf && (
                      <a 
                        href={lugar.carta_pdf} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="pdf-link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Ver PDF
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
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

  <div className="form-group">
    <label htmlFor="carta_pdf">Carta de Presentación (PDF)</label>
    <input 
      type="file" 
      id="carta_pdf" 
      accept=".pdf" 
      onChange={handlePdfChange} 
    />
    <small className="form-text">Documento PDF con información adicional (opcional)</small>
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
