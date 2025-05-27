import React, { useEffect, useState } from 'react';
// import Sidebar from '../../components/Sidebar';
import './DashboardPropietario.css';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar, FaComments, FaBuilding, FaPlus, FaTimes } from 'react-icons/fa';

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
    imagen: null
  });

  const API_URL = 'https://popnocturna.vercel.app/api';
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const navigate = useNavigate();

  const cargarCategorias = async () => {
    try {
      const response = await fetch(`${API_URL}/categorias`);
      if (!response.ok) throw new Error('Error al cargar categorías');
      const data = await response.json();
      setCategorias(data);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validación frontend: imagen obligatoria
    if (!formData.imagen) {
      setError('La imagen es requerida');
      return;
    }
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('nombre', formData.nombre.trim().toLowerCase()); // El backend espera nombre en minúsculas
      formDataToSend.append('descripcion', formData.descripcion);
      formDataToSend.append('ubicacion', formData.ubicacion);
      formDataToSend.append('categoriaid', formData.categoriaid);
      formDataToSend.append('imagen', formData.imagen); // Imagen es obligatoria

      const response = await fetch(`${API_URL}/propietario/lugar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${usuario.token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        let mensaje = 'Error al crear el lugar';
        try {
          const errorData = await response.json();
          mensaje = errorData.mensaje || mensaje;
        } catch {}
        throw new Error(mensaje);
      }

      cargarDatos();
      setShowModal(false);
      setFormData({ nombre: '', descripcion: '', ubicacion: '', categoriaid: '', imagen: null });
    } catch (error) {
      console.error('Error creando lugar:', error);
      setError('Error al crear el lugar: ' + error.message);
    }
  };

  const cargarDatos = async () => {
    try {
      const response = await fetch(`${API_URL}/propietario/lugares`, {
        headers: { 'Authorization': `Bearer ${usuario.token}` }
      });
      if (!response.ok) throw new Error('No se pudo obtener los lugares');
      const data = await response.json();
      setLugares(data);
    } catch (error) {
      setError('Error al cargar los lugares: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  cargarCategorias();

  const obtenerLugaresDelPropietario = async () => {
    try {
      if (!usuario || !usuario.token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_URL}/propietario/lugares`, {
        headers: { 'Authorization': `Bearer ${usuario.token}` }
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        throw new Error('No se pudo obtener los lugares');
      }

      const data = await response.json();
      setLugares(data);
    } catch (error) {
      setError('Error al cargar los lugares: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const cargarComentarios = async () => {
    try {
      const response = await fetch(`${API_URL}/comentarios`, {
        headers: { 'Authorization': `Bearer ${usuario.token}` }
      });
      if (!response.ok) throw new Error('No se pudo cargar comentarios');
      const data = await response.json();
      setComentarios(Array.isArray(data) ? data : []);
    } catch (error) {
      setComentarios([]);
    }
  };

  obtenerLugaresDelPropietario();
  if (usuario && usuario.token) cargarComentarios();
}, []);

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
  const totalComentarios = lugares.reduce((acc, lugar) => acc + (lugar.total_comentarios || 0), 0);

  return (
    <div className="propietario-dashboard">
      <div className="content-container">
        <div className="propietario-kpis-row">
          <div className="propietario-stat-box"><div className="propietario-stat-icon"><FaBuilding /></div><div className="propietario-stat-content"><h3>Lugares Registrados</h3><p className="propietario-stat-value">{lugares.length}</p></div></div>
          <div className="propietario-stat-box"><div className="propietario-stat-icon"><FaStar /></div><div className="propietario-stat-content"><h3>Calificación Promedio</h3><p className="propietario-stat-value">{promedioCalificacion}</p></div></div>
          <div className="propietario-stat-box"><div className="propietario-stat-icon"><FaComments /></div><div className="propietario-stat-content"><h3>Total de Comentarios</h3><p className="propietario-stat-value">{totalComentarios}</p></div></div>
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
                <div key={lugar.id} className="propietario-place-card" onClick={() => navigate(`/propietario/lugar/${lugar.id}`)}>
                  <div className="propietario-place-image">
                    {lugar.imagen ? (
                      <img src={lugar.imagen} alt={lugar.nombre} />
                    ) : (
                      <div className="propietario-no-image">Sin imagen</div>
                    )}
                    <h3 className="propietario-place-title">{lugar.nombre}</h3>
                  </div>
                  <div className="propietario-place-info">
                    <p className="propietario-place-location"><FaMapMarkerAlt />{lugar.ubicacion}</p>
                    <div className="propietario-place-stats">
                      <span><FaStar /> {lugar.calificacion_promedio?.toFixed(1) || '0.0'}</span>
                      <span style={{ color: '#111', fontWeight: 600 }}>
                        <FaComments style={{ marginRight: 4 }} />
                        {comentarios.filter(c => c.lugar === lugar.id || c.lugar_id === lugar.id).length} comentario{comentarios.filter(c => c.lugar === lugar.id || c.lugar_id === lugar.id).length !== 1 ? 's' : ''}
                      </span>
                    </div>
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
    <label htmlFor="imagen">Imagen</label>
    <input type="file" id="imagen" accept="image/*" onChange={handleImageChange} />
  </div>
  <div className="form-botones-modal">
    <button type="button" onClick={() => setShowModal(false)} className="btn-cancelar-lugar">Cancelar</button>
    <button type="submit" className="btn-submit-lugar">Crear Lugar</button>
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
